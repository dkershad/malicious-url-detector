import axios from 'axios'
import { logger } from '../utils/logger.js'

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY
const VIRUSTOTAL_BASE_URL = 'https://www.virustotal.com/api/v3'

/**
 * Scan a URL using VirusTotal API
 * Returns threat information from 90+ antivirus engines
 */
export async function scanURLWithVirusTotal(url) {
  if (!VIRUSTOTAL_API_KEY || VIRUSTOTAL_API_KEY === 'your_virustotal_api_key_here') {
    logger.warn('VIRUSTOTAL_API_KEY not set — skipping VirusTotal analysis')
    return null
  }

  try {
    // Step 1: Submit URL for scanning
    const submitResponse = await axios.post(
      `${VIRUSTOTAL_BASE_URL}/urls`,
      `url=${encodeURIComponent(url)}`,
      {
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    )

    const analysisId = submitResponse.data.data.id
    logger.info(`VirusTotal scan submitted for ${url} (ID: ${analysisId})`)

    // Step 2: Get scan results (may need to wait a moment)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const resultsResponse = await axios.get(
      `${VIRUSTOTAL_BASE_URL}/analyses/${analysisId}`,
      {
        headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
        timeout: 10000
      }
    )

    const stats = resultsResponse.data.data.attributes.stats
    const results = resultsResponse.data.data.attributes.results

    // Count detections
    const detections = stats.malicious + stats.suspicious
    const totalEngines = stats.malicious + stats.suspicious + stats.undetected + stats.timeout

    // Get list of engines that detected the URL as malicious
    const detectionDetails = Object.entries(results)
      .filter(([_, engine]) => engine.category === 'malicious' || engine.category === 'suspicious')
      .map(([engineName, engine]) => ({
        engine: engineName,
        category: engine.category,
        result: engine.result
      }))
      .slice(0, 5) // Top 5 detections

    return {
      url,
      analysisId,
      detections,
      totalEngines,
      detectionPercentage: Math.round((detections / totalEngines) * 100),
      stats: {
        malicious: stats.malicious,
        suspicious: stats.suspicious,
        undetected: stats.undetected,
        timeout: stats.timeout
      },
      detectionDetails,
      verdict: getVerdictFromDetections(detections, totalEngines),
      lastAnalysisDate: resultsResponse.data.data.attributes.last_analysis_date,
      source: 'VirusTotal (90+ antivirus engines)'
    }
  } catch (err) {
    if (err.response?.status === 401) {
      logger.error(`VirusTotal Auth Error: Invalid API key`)
    } else if (err.response?.status === 429) {
      logger.error(`VirusTotal Rate Limit: Too many requests (free tier limited)`)
    } else {
      logger.error(`VirusTotal error: ${err.message}`)
    }
    return null
  }
}

/**
 * Determine threat verdict based on detection ratio
 */
function getVerdictFromDetections(detections, totalEngines) {
  const ratio = detections / totalEngines
  
  if (ratio === 0) {
    return 'CLEAN'
  } else if (ratio <= 0.05) {
    return 'SUSPICIOUS'
  } else if (ratio <= 0.15) {
    return 'LIKELY_MALICIOUS'
  } else {
    return 'MALICIOUS'
  }
}

/**
 * Get historical analysis for a URL (if previously scanned)
 */
export async function getURLReputation(url) {
  if (!VIRUSTOTAL_API_KEY) return null

  try {
    // URL-encode the domain for the API endpoint
    const encodedUrl = Buffer.from(url).toString('base64').replace(/=/g, '')

    const response = await axios.get(
      `${VIRUSTOTAL_BASE_URL}/urls/${encodedUrl}`,
      {
        headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
        timeout: 5000
      }
    )

    const data = response.data.data.attributes
    const stats = data.last_analysis_stats

    return {
      url,
      lastAnalysisDate: new Date(data.last_analysis_date * 1000).toISOString(),
      stats: {
        malicious: stats.malicious,
        suspicious: stats.suspicious,
        undetected: stats.undetected
      },
      detectionRatio: `${stats.malicious}/${stats.malicious + stats.undetected + stats.suspicious}`,
      categories: data.categories || {},
      source: 'VirusTotal'
    }
  } catch (err) {
    logger.debug(`URL reputation check failed: ${err.message}`)
    return null
  }
}
