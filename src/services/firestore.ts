import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

// Signature interface
export interface Signature {
  id?: string;
  userId: string;
  nome: string;
  sobrenome: string;
  area: string;
  cargo: string;
  email: string;
  telefone: string;
  linkedin?: string;
  whatsapp?: string;
  template: 'classic' | 'modern' | 'minimal' | 'corporate';
  theme: 'branco' | 'azul' | 'dark';
  slug?: string;
  views?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Convert Firestore document to Signature
function docToSignature(doc: DocumentData): Signature {
  return {
    id: doc.id,
    ...doc.data(),
  } as Signature;
}

// Generate unique slug
function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

// Lazy collection references
function getSignaturesCollection(): CollectionReference {
  if (!db) throw new Error('Firebase not configured');
  return collection(db, 'signatures');
}

function getBrandAssetsCollection(): CollectionReference {
  if (!db) throw new Error('Firebase not configured');
  return collection(db, 'brandAssets');
}

// Get all signatures for a user
export async function getUserSignatures(userId: string): Promise<Signature[]> {
  if (!isFirebaseConfigured || !db) return [];
  
  const signaturesCollection = getSignaturesCollection();
  const q = query(
    signaturesCollection,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToSignature);
}

// Get signature by ID
export async function getSignatureById(id: string): Promise<Signature | null> {
  if (!isFirebaseConfigured || !db) return null;
  
  const docRef = doc(db, 'signatures', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docToSignature(docSnap);
  }
  return null;
}

// Get signature by slug (public)
export async function getSignatureBySlug(slug: string): Promise<Signature | null> {
  if (!isFirebaseConfigured || !db) return null;
  
  const signaturesCollection = getSignaturesCollection();
  const q = query(
    signaturesCollection,
    where('slug', '==', slug),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return docToSignature(doc);
}

// Create signature
export async function createSignature(data: Omit<Signature, 'id' | 'slug' | 'views' | 'createdAt' | 'updatedAt'>): Promise<Signature> {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  
  const signaturesCollection = getSignaturesCollection();
  const slug = generateSlug();
  
  const docRef = await addDoc(signaturesCollection, {
    ...data,
    slug,
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    ...data,
    slug,
    views: 0,
  };
}

// Update signature
export async function updateSignature(id: string, data: Partial<Signature>): Promise<void> {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, 'signatures', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete signature
export async function deleteSignature(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, 'signatures', id);
  await deleteDoc(docRef);
}

// Increment view count
export async function incrementSignatureViews(slug: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  
  const signature = await getSignatureBySlug(slug);
  if (signature && signature.id) {
    const docRef = doc(db, 'signatures', signature.id);
    await updateDoc(docRef, {
      views: (signature.views || 0) + 1,
    });
  }
}

// Brand Asset interface
export interface BrandAsset {
  id?: string;
  category: 'logo' | 'color' | 'font' | 'icon' | 'template' | 'guideline';
  name: string;
  description?: string;
  fileUrl?: string;
  filePath?: string;
  metadata?: Record<string, string>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Get all brand assets
export async function getBrandAssets(category?: string): Promise<BrandAsset[]> {
  if (!isFirebaseConfigured || !db) return [];
  
  const brandAssetsCollection = getBrandAssetsCollection();
  let q = query(brandAssetsCollection, orderBy('name', 'asc'));
  
  if (category) {
    q = query(
      brandAssetsCollection,
      where('category', '==', category),
      orderBy('name', 'asc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as BrandAsset));
}

// Get brand asset by ID
export async function getBrandAssetById(id: string): Promise<BrandAsset | null> {
  if (!isFirebaseConfigured || !db) return null;
  
  const docRef = doc(db, 'brandAssets', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as BrandAsset;
  }
  return null;
}

// Create brand asset (admin only)
export async function createBrandAsset(data: Omit<BrandAsset, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandAsset> {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  
  const brandAssetsCollection = getBrandAssetsCollection();
  const docRef = await addDoc(brandAssetsCollection, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    ...data,
  };
}

// Update brand asset (admin only)
export async function updateBrandAsset(id: string, data: Partial<BrandAsset>): Promise<void> {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, 'brandAssets', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete brand asset (admin only)
export async function deleteBrandAsset(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, 'brandAssets', id);
  await deleteDoc(docRef);
}
