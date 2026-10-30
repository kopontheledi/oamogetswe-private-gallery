# Oamogetswe Precious — Private Baby Gallery

A React + Vite JavaScript starter for a pink, baby-blue private memory album.

## What's included
- Welcome page with a blessing letter for Oamogetswe Precious.
- Parents' portrait placeholder with the caption “Two hearts, one love”.
- Ten Bible verses (KJV) paired with ten baby-photo slots.
- One-photo-at-a-time gallery UI and a final thank-you page.
- Firebase callable Functions that validate an invite, read the server-controlled current photo, and advance progress forward only.
- Locked-down Firestore and Storage rules.
- Firebase Hosting configuration.

## Important: this is a starter, not a deployed or fully provisioned website
No photos have been supplied or uploaded. The app does not yet include an administrator dashboard or a token-creation command. Do not share a real invitation until you have completed the setup below and tested it with test photos.

## Requirements
- Node.js 20+
- A Firebase project
- Firebase Authentication with Anonymous sign-in enabled
- Cloud Firestore
- Cloud Storage
- Cloud Functions (Blaze billing plan generally required)
- Firebase App Check is recommended before sharing publicly

## 1. Install dependencies
```bash
npm install
cd functions && npm install && cd ..
```

## 2. Configure Firebase web app
Copy `.env.example` to `.env.local` and enter the Firebase Web App config values. Do not place Admin SDK credentials in `.env.local`.

In Firebase Console:
1. Create/register a Web App.
2. Enable Authentication > Sign-in method > Anonymous.
3. Create the Firestore database.
4. Set up Cloud Storage.
5. Check billing requirements and budget alerts before enabling/deploying Functions.

## 3. Configure the gallery photos
Upload images to private Storage paths:
- `gallery/parents.jpg` (parents portrait, shown on the welcome page)
- `gallery/baby-01.jpg` through `gallery/baby-10.jpg`

The parents' photo is a welcome-page image and is not one of the ten sequential baby photos.

In Firestore, create documents in `galleryPhotos`:
- Document ID `0`, field `storagePath: "gallery/baby-01.jpg"`
- Document ID `1`, field `storagePath: "gallery/baby-02.jpg"`
- Continue through document ID `9`, field `storagePath: "gallery/baby-10.jpg"`

The parents' photo currently appears as a placeholder in the welcome page. Before launch, wire a protected server response for the parents' image as well; do not make it public just to display it. This starter intentionally avoids a public Storage URL.

## 4. Invitation tokens (server-side only)
The invitation token must be generated with a cryptographically secure random generator on a trusted machine. Store only its SHA-256 hash as the Firestore document ID in `galleryInvites`, with fields such as:
```json
{
  "revoked": false,
  "createdAt": "Firestore server timestamp",
  "expiresAt": null
}
```
The invitation URL format is:
`https://YOUR_HOST/#invite=YOUR_RANDOM_TOKEN`

Never put tokens in source code, public Firestore documents, analytics, or screenshots. Do not generate tokens in client-side JavaScript. The README does not include a client-side admin route by design.

## 5. Critical security behaviour and limitations
- Firestore/Storage client rules deny all direct access.
- Functions use Admin SDK to verify invitation and fetch the current photo.
- Server-side progress is forward-only and tied to an anonymous-auth UID.
- The included starter has no admin-only invite-management UI yet; build and test that before sharing.
- The `getCurrentPhoto` function serves only the current photo, but a visitor can still save/screenshot pixels while a photo is visible. No website can prevent screenshots with certainty.
- A shared invitation link can be forwarded. For stronger identity assurance, use individually authenticated invitees or a one-time activation workflow.
- The parents' welcome photo needs to be served through a protected backend function before launch.
- Consider rate limits and Firebase App Check before public use.
- Configure and test photo metadata, file size limits, region and storage bucket name for your Firebase project.
- Never put private service-account JSON files in this project or deploy them to Hosting.

## 6. Run locally
```bash
npm run dev
```

## 7. Build and deploy
```bash
npm run build
npx firebase login
npx firebase use YOUR_FIREBASE_PROJECT_ID
npx firebase deploy
```

Do not deploy/share real baby photos until the missing invitation management and parents-photo endpoint are completed and the access flow has been tested with dummy photos.
