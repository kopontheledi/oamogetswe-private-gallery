const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const crypto = require('crypto');

initializeApp();
const db = getFirestore();
const REGION = 'europe-west1';
const TOTAL_PHOTOS = 10;
const INVITES = 'galleryInvites';
const PROGRESS = 'galleryProgress';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function verifyInvite(data, context) {
  if (!context.auth) throw new HttpsError('unauthenticated', 'A viewing session is required.');
  const token = typeof data?.token === 'string' ? data.token : '';
  if (token.length < 32 || token.length > 256) throw new HttpsError('permission-denied', 'Invalid invitation.');
  const inviteId = hashToken(token);
  const inviteRef = db.collection(INVITES).doc(inviteId);
  const inviteSnap = await inviteRef.get();
  if (!inviteSnap.exists || inviteSnap.data().revoked === true) {
    throw new HttpsError('permission-denied', 'This invitation is no longer active.');
  }
  const invite = inviteSnap.data();
  if (invite.expiresAt && invite.expiresAt.toMillis() < Date.now()) {
    throw new HttpsError('permission-denied', 'This invitation has expired.');
  }
  const progressRef = db.collection(PROGRESS).doc(inviteId);
  const progressSnap = await progressRef.get();
  if (progressSnap.exists && progressSnap.data().uid !== context.auth.uid) {
    throw new HttpsError('permission-denied', 'This invitation has already been used by another session.');
  }
  if (!progressSnap.exists) {
    await progressRef.create({ uid: context.auth.uid, currentIndex: 0, completed: false, createdAt: FieldValue.serverTimestamp() });
  }
  return { inviteId, inviteRef, progressRef };
}

// Each image is fetched by the server and returned as a data URL. No public
// Storage URL or long-lived signed URL is ever handed to the visitor.
exports.getCurrentPhoto = onCall({ region: REGION, enforceAppCheck: false }, async (request) => {
  const { inviteId, progressRef } = await verifyInvite(request.data, request);
  const progressSnap = await progressRef.get();
  const progress = progressSnap.data();
  if (progress.completed || progress.currentIndex >= TOTAL_PHOTOS) return { done: true };
  const index = progress.currentIndex;
  const metaSnap = await db.collection('galleryPhotos').doc(String(index)).get();
  if (!metaSnap.exists || !metaSnap.data().storagePath) {
    throw new HttpsError('not-found', 'This photo has not been uploaded yet.');
  }
  const file = getStorage().bucket().file(metaSnap.data().storagePath);
  const [buffer] = await file.download();
  const [metadata] = await file.getMetadata();
  const contentType = metadata.contentType || 'image/jpeg';
  if (!/^image\/(jpeg|png|webp|avif)$/.test(contentType)) {
    throw new HttpsError('failed-precondition', 'Unsupported photo format.');
  }
  return {
    done: false,
    photoIndex: index,
    dataUrl: `data:${contentType};base64,${buffer.toString('base64')}`,
  };
});

// Progress only moves forward. Transaction prevents two rapid calls from
// advancing by more than one step or racing with another request.
exports.advancePhoto = onCall({ region: REGION, enforceAppCheck: false }, async (request) => {
  const { progressRef } = await verifyInvite(request.data, request);
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(progressRef);
    if (!snap.exists) throw new HttpsError('failed-precondition', 'Viewing progress is missing.');
    const progress = snap.data();
    if (progress.completed || progress.currentIndex >= TOTAL_PHOTOS - 1) {
      tx.update(progressRef, { completed: true, completedAt: FieldValue.serverTimestamp() });
      return { done: true };
    }
    const nextIndex = progress.currentIndex + 1;
    tx.update(progressRef, { currentIndex: nextIndex, updatedAt: FieldValue.serverTimestamp() });
    return { done: false, photoIndex: nextIndex };
  });
  return result;
});

// ADMIN SETUP NOTE:
// Create an invite from a trusted local Admin SDK script or a locked-down
// admin-only callable after setting Firebase custom claims. Never create
// invitation tokens from client-side code. The README includes a safe setup plan.
