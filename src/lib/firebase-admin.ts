import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let adminApp: App | undefined
let adminDb: Firestore | undefined

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  // Check if we have service account JSON
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson)
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      })
    } catch {
      // If parsing fails, try as base64 or other formats
      adminApp = initializeApp()
    }
  } else {
    // Initialize without credentials (for emulator or default credentials)
    adminApp = initializeApp()
  }

  return adminApp
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    const app = getAdminApp()
    adminDb = getFirestore(app)
  }
  return adminDb
}

export { getAdminApp }
