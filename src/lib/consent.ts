'use client'

export type ConsentValue = 'accepted' | 'essential' | null

export const CONSENT_KEY = 'upar.consent'
const KEY = CONSENT_KEY
export const CONSENT_EVENT = 'upar:consent-change'

export function readConsent(): ConsentValue {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(KEY)
    return value === 'accepted' || value === 'essential' ? value : null
  } catch {
    return null
  }
}

export function writeConsent(value: Exclude<ConsentValue, null>): void {
  try {
    window.localStorage.setItem(KEY, value)
  } catch {
    /* ignora indisponibilidade do armazenamento */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}
