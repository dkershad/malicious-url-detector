"""Feature engineering for malicious URL detection."""
import re, math
from urllib.parse import urlparse, parse_qs

SUSPICIOUS_WORDS = ['login','verify','update','secure','account','banking','paypal','ebay',
    'amazon','microsoft','apple','password','credential','confirm','suspend','urgent','alert']
SUSPICIOUS_TLDS = {'tk','ml','ga','cf','gq','xyz','top','work','click','download','loan','win','stream','gdn','bid'}

def shannon_entropy(s):
    if not s: return 0.0
    freq = {}
    for c in s: freq[c] = freq.get(c,0) + 1
    return round(-sum((f/len(s))*math.log2(f/len(s)) for f in freq.values()), 4)

def extract_features(url):
    try:
        if not url.startswith(('http://','https://')): url = 'https://' + url
        p = urlparse(url)
    except: return {}
    h = p.netloc or ''
    tld = h.rsplit('.',1)[-1].lower() if '.' in h else ''
    sub = h.split('.')[0] if h else ''
    return {
        'url_length': len(url), 'hostname_length': len(h), 'path_length': len(p.path),
        'num_dots': h.count('.'), 'num_hyphens': h.count('-'),
        'num_digits_in_host': sum(c.isdigit() for c in h),
        'num_subdomains': max(0, len(h.split('.'))-2),
        'has_https': int(p.scheme=='https'), 'has_port': int(bool(p.port)),
        'has_query': int(bool(p.query)), 'num_query_params': len(parse_qs(p.query)),
        'has_fragment': int(bool(p.fragment)), 'has_at_sign': int('@' in url),
        'has_double_slash': int('//' in p.path),
        'has_hex_encoding': int(bool(re.search(r'%[0-9a-fA-F]{2}', url))),
        'entropy': shannon_entropy(sub),
        'ip_in_url': int(bool(re.match(r'\d{1,3}(\.\d{1,3}){3}', h))),
        'suspicious_word_count': sum(w in url.lower() for w in SUSPICIOUS_WORDS),
        'suspicious_tld': int(tld in SUSPICIOUS_TLDS),
        'url_is_short': int(len(url)<30),
        'consecutive_digits': len(max(re.findall(r'\d+', h), default='', key=len)),
    }

ORDERED_KEYS = ['url_length','hostname_length','path_length','num_dots','num_hyphens',
    'num_digits_in_host','num_subdomains','has_https','has_port','has_query',
    'num_query_params','has_fragment','has_at_sign','has_double_slash','has_hex_encoding',
    'entropy','ip_in_url','suspicious_word_count','suspicious_tld','url_is_short','consecutive_digits']

def features_to_vector(features):
    return [features.get(k, 0) for k in ORDERED_KEYS]
