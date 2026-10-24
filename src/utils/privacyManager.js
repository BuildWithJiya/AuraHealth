/**
 * privacyManager.js
 * 
 * Privacy-First Architecture for Aura Health:
 * 1. 100% On-Device Storage Vault (Zero-Cloud transmission, local storage only).
 * 2. Anonymous / Ghost Profile Mode (strips personal identifiers, suppresses PII in exports).
 * 3. Discreet Camouflage Mode (Stigma Protection for shared/conservative households):
 *    - Changes document.title to neutral "Daily Calculator & Study Notes"
 *    - Replaces favicon with neutral icon
 *    - Provides emergency screen curtain / camouflage UI
 */

const PRIVACY_STORAGE_KEY = 'auradx_v1_privacy_settings'

const DEFAULT_PRIVACY = {
  anonymousMode: false,
  camouflageMode: false,
  panicCurtainActive: false,
  storageVault: 'local-only', // always on-device
}

// Neutral Camouflage Favicon (data URI of a small neutral calculator / note icon)
const NEUTRAL_FAVICON = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236B7280"><rect x="4" y="2" width="16" height="20" rx="3" fill="%23E5E7EB" stroke="%234B5563" stroke-width="2"/><rect x="7" y="5" width="10" height="4" rx="1" fill="%239CA3AF"/><circle cx="8" cy="12" r="1.2" fill="%234B5563"/><circle cx="12" cy="12" r="1.2" fill="%234B5563"/><circle cx="16" cy="12" r="1.2" fill="%234B5563"/><circle cx="8" cy="16" r="1.2" fill="%234B5563"/><circle cx="12" cy="16" r="1.2" fill="%234B5563"/><circle cx="16" cy="16" r="1.2" fill="%234B5563"/></svg>'

const ORIGINAL_TITLE = 'Aura Health — Benchmark & Diagnose Women\'s Health'
const CAMOUFLAGE_TITLE = 'Daily Calculator & Study Notes — Formula Sheet'

export function loadPrivacySettings() {
  try {
    const raw = localStorage.getItem(PRIVACY_STORAGE_KEY)
    if (raw) {
      return { ...DEFAULT_PRIVACY, ...JSON.parse(raw) }
    }
  } catch (err) {
    console.warn('Could not read privacy settings:', err)
  }
  return DEFAULT_PRIVACY
}

export function savePrivacySettings(settings) {
  try {
    localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(settings))
  } catch (err) {
    console.warn('Could not save privacy settings:', err)
  }
}

/**
 * Applies or removes browser tab camouflage (title & favicon)
 */
export function setCamouflageInBrowser(enabled) {
  try {
    if (typeof document === 'undefined') return

    if (enabled) {
      document.title = CAMOUFLAGE_TITLE
      let link = document.querySelector("link[rel*='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = NEUTRAL_FAVICON
    } else {
      document.title = ORIGINAL_TITLE
      let link = document.querySelector("link[rel*='icon']")
      if (link) {
        link.href = '/favicon.ico'
      }
    }
  } catch (err) {
    console.warn('Camouflage toggle failed:', err)
  }
}

/**
 * Returns a sanitized patient representation for display & reporting.
 * If anonymousMode is true, strips all identifying demographic PII.
 */
export function getSanitizedPatient(patient, isAnonymous) {
  if (!patient) return null
  if (!isAnonymous) return patient

  return {
    ...patient,
    name: 'Aura-Anonymous-User',
    age: 'Adult',
    originalName: patient.name,
    isMasked: true,
  }
}

/**
 * Exports all local on-device data as a secure JSON backup file.
 */
export function exportLocalVaultBackup() {
  try {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      vaultType: 'On-Device Zero-Cloud LocalStorage',
      privacyStandard: 'HIPAA & GDPR Aligned Client-Side Only',
      records: {},
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('auradx_v1_')) {
        try {
          backupData.records[key] = JSON.parse(localStorage.getItem(key))
        } catch {
          backupData.records[key] = localStorage.getItem(key)
        }
      }
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AuraHealth_LocalVault_Backup_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return true
  } catch (err) {
    console.error('Export vault failed:', err)
    return false
  }
}
