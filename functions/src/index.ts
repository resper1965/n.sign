import * as functions from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { nanoid } from 'nanoid'

// Initialize Firebase Admin
initializeApp()
const db = getFirestore()

// ========== SIGNATURES API ==========

// GET /api/signatures - List all signatures
export const getSignatures = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const snapshot = await db
      .collection('signatures')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    const signatures = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.json({ signatures })
  } catch (error) {
    console.error('Error fetching signatures:', error)
    res.status(500).json({ error: 'Failed to fetch signatures' })
  }
})

// POST /api/signatures - Create a new signature
export const createSignature = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { nome, sobrenome, area, email, telefone, linkedin, whatsapp, template, theme } = req.body

    if (!nome || !sobrenome || !area || !email) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const slug = nanoid(8)
    const createdAt = new Date().toISOString()

    const signatureData = {
      nome,
      sobrenome,
      area,
      email,
      telefone: telefone || null,
      linkedin: linkedin || null,
      whatsapp: whatsapp || null,
      template: template || 'classic',
      theme: theme || 'branco',
      slug,
      createdAt,
    }

    const docRef = await db.collection('signatures').add(signatureData)

    res.json({
      signature: {
        id: docRef.id,
        ...signatureData,
      },
      shareUrl: `/s/${slug}`,
    })
  } catch (error) {
    console.error('Error creating signature:', error)
    res.status(500).json({ error: 'Failed to create signature' })
  }
})

// GET /api/signatures/:slug - Get signature by slug
export const getSignatureBySlug = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Extract slug from path
  const pathParts = req.path.split('/')
  const slug = pathParts[pathParts.length - 1]

  if (!slug) {
    res.status(400).json({ error: 'Missing slug' })
    return
  }

  try {
    const snapshot = await db
      .collection('signatures')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (snapshot.empty) {
      res.status(404).json({ error: 'Signature not found' })
      return
    }

    const doc = snapshot.docs[0]
    res.json({
      signature: {
        id: doc.id,
        ...doc.data(),
      },
    })
  } catch (error) {
    console.error('Error fetching signature:', error)
    res.status(500).json({ error: 'Failed to fetch signature' })
  }
})

// ========== PROPOSALS API ==========

// GET /api/proposals - List all proposals
export const getProposals = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const snapshot = await db
      .collection('proposals')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    const proposals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.json({ proposals })
  } catch (error) {
    console.error('Error fetching proposals:', error)
    res.status(500).json({ error: 'Failed to fetch proposals' })
  }
})

// POST /api/proposals - Create a new proposal
export const createProposal = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { title, clientName, clientEmail, description, value, status, gammaDocId, gammaUrl } = req.body

    if (!title || !clientName || !clientEmail) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const proposalData = {
      title,
      clientName,
      clientEmail,
      description: description || null,
      value: value || null,
      status: status || 'draft',
      gammaDocId: gammaDocId || null,
      gammaUrl: gammaUrl || null,
      createdAt,
      updatedAt,
    }

    const docRef = await db.collection('proposals').add(proposalData)

    res.json({
      proposal: {
        id: docRef.id,
        ...proposalData,
      },
    })
  } catch (error) {
    console.error('Error creating proposal:', error)
    res.status(500).json({ error: 'Failed to create proposal' })
  }
})
