import { logger } from '../utils/logger.js'

/**
 * WHOIS via RDAP protocol (free, no auth, JSON-based replacement for WHOIS)
 * Falls back to whoiser library if RDAP fails
 */
export async function fetchWhois(domain) {
  // Strip www prefix — WHOIS works on base domain
  const baseDomain = domain.replace(/^www\./, '')

  // Try RDAP first (modern, JSON, no timeout issues)
  const rdapResult = await tryRDAP(baseDomain)
  if (rdapResult) return rdapResult

  // Fallback: whoiser library
  return tryWhoiser(baseDomain)
}

async function tryRDAP(domain) {
  const rdapServers = [
    `https://rdap.org/domain/${domain}`,
    `https://rdap.arin.net/registry/domain/${domain}`,
    `https://rdap.verisign.com/com/v1/domain/${domain}`,
  ]

  for (const url of rdapServers) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { 'Accept': 'application/json' }
      })
      if (!res.ok) continue
      const data = await res.json()
      return parseRDAP(domain, data)
    } catch (err) {
      logger.warn(`RDAP failed (${url}): ${err.message}`)
    }
  }
  return null
}

function parseRDAP(domain, data) {
  const getEvent = (action) => {
    const ev = data.events?.find(e => e.eventAction === action)
    return ev?.eventDate || null
  }

  const creationDate = getEvent('registration')
  const expirationDate = getEvent('expiration')
  const updatedDate = getEvent('last changed') || getEvent('last update of RDAP database')

  const domainAgeDays = creationDate
    ? Math.floor((Date.now() - new Date(creationDate).getTime()) / 86400000)
    : null

  // Extract registrar from entities
  let registrar = null
  let registrant = null
  let country = null

  for (const entity of data.entities || []) {
    const roles = entity.roles || []
    const vcard = entity.vcardArray?.[1] || []
    const getName = () => vcard.find(v => v[0] === 'fn')?.[3] || null
    const getOrg = () => vcard.find(v => v[0] === 'org')?.[3] || null
    const getCountry = () => vcard.find(v => v[0] === 'adr')?.[1]?.['country-name'] || null

    if (roles.includes('registrar')) registrar = getName() || getOrg()
    if (roles.includes('registrant')) {
      registrant = getName() || getOrg()
      country = getCountry()
    }
  }

  const nameServers = data.nameservers?.map(ns => ns.ldhName).filter(Boolean) || null
  const status = data.status || null

  return {
    domain,
    registrar,
    creationDate,
    expirationDate,
    updatedDate,
    registrant,
    country,
    nameServers,
    status,
    domainAgeDays,
    source: 'RDAP',
    raw: null,
  }
}

async function tryWhoiser(domain) {
  // First try direct TCP WHOIS (port 43)
  const tcpResult = await tryTCPWhois(domain).catch(() => null)
  if (tcpResult) return tcpResult

  try {
    const { default: whoiser } = await import('whoiser')
    const raw = await whoiser(domain, { timeout: 12000 })
    const firstResult = Object.values(raw).find(r => typeof r === 'object' && !r.error) || {}

    const normalize = (keys) => {
      for (const k of keys) {
        const val = firstResult[k]
        if (val) return Array.isArray(val) ? val[0] : String(val)
      }
      return null
    }

    const creationDate = normalize(['Created Date', 'Creation Date', 'created', 'Domain Registration Date'])
    const expirationDate = normalize(['Expiry Date', 'Expiration Date', 'expires', 'Registry Expiry Date'])
    const updatedDate = normalize(['Updated Date', 'Last Updated', 'updated'])

    const domainAgeDays = creationDate
      ? Math.floor((Date.now() - new Date(creationDate).getTime()) / 86400000)
      : null

    return {
      domain,
      registrar: normalize(['Registrar', 'registrar']),
      creationDate,
      expirationDate,
      updatedDate,
      registrant: normalize(['Registrant Name', 'Registrant Organization', 'registrant']),
      country: normalize(['Registrant Country', 'country']),
      nameServers: firstResult['Name Server'] || firstResult['nserver'] || null,
      status: firstResult['Domain Status'] || firstResult['status'] || null,
      domainAgeDays,
      source: 'WHOIS',
      raw: JSON.stringify(firstResult).slice(0, 2000),
    }
  } catch (err) {
    logger.warn(`WHOIS fallback failed for ${domain}: ${err.message}`)
    return {
      domain,
      registrar: null,
      creationDate: null,
      expirationDate: null,
      updatedDate: null,
      registrant: null,
      country: null,
      nameServers: null,
      status: null,
      domainAgeDays: null,
      source: 'failed',
      error: 'WHOIS/RDAP lookup failed — check your internet connection',
      raw: null,
    }
  }
}

/**
 * Direct TCP WHOIS query (port 43) — bypasses HTTP proxy restrictions
 */
async function tryTCPWhois(domain) {
  const { createConnection } = await import('net')

  // Determine WHOIS server based on TLD
  const tld = domain.split('.').pop().toLowerCase()
  const serverMap = {
    'com': 'whois.verisign-grs.com',
    'net': 'whois.verisign-grs.com',
    'org': 'whois.pir.org',
    'io': 'whois.nic.io',
    'co': 'whois.nic.co',
    'uk': 'whois.nic.uk',
    'de': 'whois.denic.de',
    'tk': 'whois.dot.tk',
    'xyz': 'whois.nic.xyz',
  }
  const whoisServer = serverMap[tld] || `whois.nic.${tld}`

  return new Promise((resolve) => {
    let raw = ''
    const socket = createConnection(43, whoisServer, () => {
      socket.write(domain + '\r\n')
    })
    socket.on('data', chunk => { raw += chunk.toString() })
    socket.on('end', () => resolve(parseRawWhois(domain, raw)))
    socket.on('error', () => resolve(null))
    socket.setTimeout(10000, () => { socket.destroy(); resolve(null) })
  })
}

function parseRawWhois(domain, raw) {
  if (!raw || raw.length < 50) return null

  const get = (keys) => {
    for (const key of keys) {
      const match = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'im'))
      if (match) return match[1].trim()
    }
    return null
  }

  const creationDate = get(['Creation Date', 'Created On', 'created', 'Registration Date', 'Registered'])
  const expirationDate = get(['Expiry Date', 'Expiration Date', 'Expiry date', 'expires'])
  const updatedDate = get(['Updated Date', 'Last Modified', 'Last Updated', 'modified'])
  const registrar = get(['Registrar', 'Registrar Name', 'registrar'])
  const registrant = get(['Registrant Name', 'Registrant Organization', 'Registrant'])
  const country = get(['Registrant Country', 'Country'])

  const domainAgeDays = creationDate
    ? Math.floor((Date.now() - new Date(creationDate).getTime()) / 86400000)
    : null

  // Must have at least creation date to be useful
  if (!creationDate && !registrar) return null

  return {
    domain,
    registrar,
    creationDate,
    expirationDate,
    updatedDate,
    registrant,
    country,
    nameServers: null,
    status: get(['Domain Status', 'Status']),
    domainAgeDays,
    source: 'WHOIS-TCP',
    raw: raw.slice(0, 2000),
  }
}
