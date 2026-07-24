// URL validation
export function isValidUrl(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isNonEmpty(string) {
  return typeof string === 'string' && string.trim().length > 0
}

export function validateAnalyzeInput({ inputType, inputValue }) {
  if (!inputValue || !inputValue.trim()) {
    return { valid: false, message: 'Please paste an internship description or URL.' }
  }
  if (inputType === 'url' && !isValidUrl(inputValue.trim())) {
    return { valid: false, message: 'That does not look like a valid URL. Include http:// or https://' }
  }
  if (inputType === 'text' && inputValue.trim().length < 20) {
    return { valid: false, message: 'Please paste a bit more of the internship description (at least 20 characters).' }
  }
  return { valid: true }
}

export function validateAuthForm({ email, password, name }) {
  if (name !== undefined && (!name || name.trim().length < 2)) {
    return { valid: false, message: 'Please enter your name.' }
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, message: 'Please enter a valid email address.' }
  }
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters.' }
  }
  return { valid: true }
}

// Derive a title from the input for display in history
export function deriveTitle(inputType, inputValue) {
  if (inputType === 'url') {
    try {
      const url = new URL(inputValue)
      return url.hostname.replace(/^www\./, '')
    } catch {
      return 'URL Analysis'
    }
  }
  const firstLine = inputValue.trim().split('\n')[0]
  return firstLine.length > 60 ? firstLine.slice(0, 57) + '...' : firstLine || 'Internship Analysis'
}

// --- The analysis engine ---
// Each check returns { id, label, status: 'pass'|'fail'|'warn', detail }

const SUSPICIOUS_KEYWORDS = [
  'work from home',
  'data entry',
  'form filling',
  'easy money',
  'earn money',
  'guaranteed',
  'no experience needed',
  'urgent hiring',
  'limited seats',
  'registration fee',
  'security deposit',
  'training fee',
  'refundable',
  'whatsapp',
  'telegram',
  'pay',
  'payment',
  'bank details',
  'aadhaar',
  'pan card',
  'investment',
]

const GRAMMAR_HINTS = [
  'kindly',
  'dear candidate',
  'sir/madam',
  'revert back',
  'do the needful',
  'please find the attached',
  "your's faithfully",
  'opportunity to earn',
]

function hasKeyword(text, list) {
  const lower = text.toLowerCase()
  return list.filter((k) => lower.includes(k))
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function extractEmails(text) {
  const matches = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g)
  return matches || []
}

function extractNumbers(text) {
  const matches = text.match(/(\+?\d[\d\s-]{7,}\d)/g)
  return matches || []
}

export function analyzeInternship(inputType, rawValue) {
  const text = inputType === 'url' ? rawValue : rawValue
  const lower = text.toLowerCase()
  const checks = []

  // 1. Company website presence
  const hasWebsite =
    /\b(?:www\.)?[a-z0-9-]+\.[a-z]{2,}\b/i.test(text) ||
    inputType === 'url'
  checks.push({
    id: 'website',
    label: 'Company Website',
    status: hasWebsite ? 'pass' : 'warn',
    detail: hasWebsite
      ? 'A company website was mentioned or linked.'
      : 'No company website found in the listing. Genuine internships usually link to one.',
  })

  // 2. SSL / HTTPS (only meaningful for URL input)
  let sslStatus = 'warn'
  let sslDetail = 'No URL provided to verify SSL certificate.'
  if (inputType === 'url') {
    try {
      const url = new URL(text)
      if (url.protocol === 'https:') {
        sslStatus = 'pass'
        sslDetail = 'The URL uses HTTPS — the connection is encrypted.'
      } else {
        sslStatus = 'fail'
        sslDetail = 'The URL uses HTTP (not HTTPS). Legitimate companies use HTTPS.'
      }
    } catch {
      sslStatus = 'fail'
      sslDetail = 'The URL could not be parsed to check its certificate.'
    }
  }
  checks.push({ id: 'ssl', label: 'SSL Certificate', status: sslStatus, detail: sslDetail })

  // 3. Email domain check
  const emails = extractEmails(text)
  const freeDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com']
  let emailStatus = 'warn'
  let emailDetail = 'No email address found in the listing.'
  if (emails.length > 0) {
    const domains = emails.map((e) => e.split('@')[1].toLowerCase())
    const usesFree = domains.some((d) => freeDomains.includes(d))
    if (usesFree) {
      emailStatus = 'fail'
      emailDetail = `Contact email uses a free domain (${domains.join(', ')}). Real companies use a custom domain.`
    } else {
      emailStatus = 'pass'
      emailDetail = `Contact email uses a custom domain (${domains.join(', ')}).`
    }
  }
  checks.push({ id: 'email', label: 'Email Domain', status: emailStatus, detail: emailDetail })

  // 4. Salary too good to be true
  const salaryMatch = lower.match(/(?:₹|rs\.?|inr|\$|usd)\s?[\d,]+(?:\s?(?:lpa|lakhs?|k|per month|per annum|pm))?/)
  const highSalary = new RegExp(
    '(?:₹\\s?\\d{2,}\\s?,?\\d{3}\\s?(?:per month|pm|/month))|(?:\\d+\\s?lpa)|(?:₹\\s?\\d{1,3},\\d{3})',
    'i'
  ).test(text)
  checks.push({
    id: 'salary',
    label: 'Salary Too Good',
    status: highSalary ? 'fail' : salaryMatch ? 'pass' : 'warn',
    detail: highSalary
      ? 'The offered salary looks unusually high for an internship role. This is a common lure.'
      : salaryMatch
        ? 'Salary mentioned appears within a normal range.'
        : 'No specific salary figure found.',
  })

  // 5. Asking for money
  const moneyKeywords = hasKeyword(text, [
    'registration fee',
    'security deposit',
    'training fee',
    'training charge',
    'refundable deposit',
    'pay ',
    'payment',
    'fee',
    'deposit',
    'buy a kit',
    'purchase',
    'invest',
  ])
  checks.push({
    id: 'money',
    label: 'Asking For Money',
    status: moneyKeywords.length > 0 ? 'fail' : 'pass',
    detail:
      moneyKeywords.length > 0
        ? `Found money-related terms: ${moneyKeywords.slice(0, 4).join(', ')}. Genuine internships never ask you to pay.`
        : 'No requests for payment, fees, or deposits were found.',
  })

  // 6. Poor grammar
  const grammarHits = hasKeyword(text, GRAMMAR_HINTS)
  const grammarStatus = grammarHits.length >= 2 ? 'fail' : grammarHits.length === 1 ? 'warn' : 'pass'
  checks.push({
    id: 'grammar',
    label: 'Poor Grammar',
    status: grammarStatus,
    detail:
      grammarHits.length > 0
        ? `Phrases often seen in scam messages detected: ${grammarHits.join(', ')}.`
        : 'The writing reads naturally with no obvious scam-style phrasing.',
  })

  // 7. LinkedIn presence
  const linkedin = lower.includes('linkedin') || lower.includes('linked.in')
  checks.push({
    id: 'linkedin',
    label: 'LinkedIn Presence',
    status: linkedin ? 'pass' : 'warn',
    detail: linkedin
      ? 'A LinkedIn link or reference was found.'
      : 'No LinkedIn reference found. Most genuine recruiters link a LinkedIn profile or company page.',
  })

  // 8. Fake contact (WhatsApp/Telegram only)
  const numbers = extractNumbers(text)
  const whatsappOnly =
    (lower.includes('whatsapp') || lower.includes('telegram')) &&
    numbers.length > 0 &&
    !lower.includes('email') &&
    !lower.includes('@')
  checks.push({
    id: 'contact',
    label: 'Fake Contact',
    status: whatsappOnly ? 'fail' : numbers.length > 0 ? 'pass' : 'warn',
    detail: whatsappOnly
      ? 'Only a WhatsApp/Telegram number is given with no professional email. This is a red flag.'
      : numbers.length > 0
        ? 'A phone number was found alongside other contact info.'
        : 'No phone number found. Not necessarily bad, but verify how to reach them.',
  })

  // 9. Address
  const addressHints = /(address|location|office|street|road|city|pin\s?code|pincode)/i.test(text)
  checks.push({
    id: 'address',
    label: 'No Address',
    status: addressHints ? 'pass' : 'warn',
    detail: addressHints
      ? 'An address or location reference was found.'
      : 'No office address or location mentioned. Legitimate companies usually state where they are.',
  })

  // 10. Company registration
  const regHints = /(cin|gst|registration|registered|incorporated|pvt\.?\s?ltd|private limited|llp)/i.test(text)
  checks.push({
    id: 'registration',
    label: 'No Company Registration',
    status: regHints ? 'pass' : 'warn',
    detail: regHints
      ? 'A registration or incorporation reference (CIN/GST/Pvt Ltd) was found.'
      : 'No company registration number or legal entity type mentioned.',
  })

  // 11. Offer letter suspicious
  const offerHints = /(offer letter|appointment letter|confirmation letter|congratulations)/i.test(text)
  const prematureOffer = offerHints && !/(interview|assessment|test|round)/i.test(text)
  checks.push({
    id: 'offer',
    label: 'Offer Letter Suspicious',
    status: prematureOffer ? 'fail' : offerHints ? 'warn' : 'pass',
    detail: prematureOffer
      ? 'An offer letter is mentioned with no interview or assessment process. Real offers come after a process.'
      : offerHints
        ? 'An offer letter is mentioned — verify it follows a proper interview process.'
        : 'No premature offer letter detected.',
  })

  // 12. Interview without process
  const noProcess =
    !/(interview|assessment|test|round|technical round|hr round|coding|assignment|screening)/i.test(text) &&
    countWords(text) > 40
  checks.push({
    id: 'interview',
    label: 'Interview Without Process',
    status: noProcess ? 'warn' : 'pass',
    detail: noProcess
      ? 'No interview, assessment, or selection process is described.'
      : 'An interview or assessment process is referenced.',
  })

  // --- Score calculation ---
  const weights = {
    website: 8,
    ssl: 6,
    email: 10,
    salary: 8,
    money: 14,
    grammar: 8,
    linkedin: 8,
    contact: 10,
    address: 6,
    registration: 8,
    offer: 8,
    interview: 6,
  }
  let score = 100
  checks.forEach((c) => {
    if (c.status === 'fail') score -= weights[c.id] || 5
    else if (c.status === 'warn') score -= (weights[c.id] || 5) / 2
  })
  const trustScore = Math.max(0, Math.min(100, Math.round(score)))

  let riskLevel = 'Safe'
  if (trustScore < 25) riskLevel = 'Very Dangerous'
  else if (trustScore < 50) riskLevel = 'High Risk'
  else if (trustScore < 75) riskLevel = 'Moderate'

  // --- AI-style suggestions ---
  const failChecks = checks.filter((c) => c.status === 'fail')
  const passChecks = checks.filter((c) => c.status === 'pass')
  const whyFake = failChecks.map((c) => c.detail)
  const whyGenuine = passChecks.slice(0, 4).map((c) => c.detail)
  const thingsToVerify = [
    ...checks.filter((c) => c.status === 'warn').map((c) => `Verify: ${c.label.toLowerCase()} — ${c.detail}`),
  ]
  if (whyFake.length === 0) {
    whyFake.push('No hard red flags were detected, but stay alert for anything unusual during contact.')
  }
  if (whyGenuine.length === 0) {
    whyGenuine.push('No positive trust signals were found, which itself is a warning.')
  }
  const safetyTips = [
    'Never pay money for an internship, training, or security deposit.',
    'Search the company name on LinkedIn and the Ministry of Corporate Affairs portal.',
    'Call the company’s official landline to confirm the offer.',
    'Do not share Aadhaar, PAN, or bank details until you have verified the employer.',
    'Trust your gut — if the offer feels too easy or too lucrative, investigate more.',
  ]

  return {
    trustScore,
    riskLevel,
    checks,
    suggestions: {
      whyFake,
      whyGenuine,
      thingsToVerify,
      safetyTips,
    },
  }
}
