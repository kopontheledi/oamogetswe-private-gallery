import { useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from './firebase.js';
import Welcome from './pages/Welcome.jsx';
import Gallery from './pages/Gallery.jsx';
import Finished from './pages/Finished.jsx';
import { babyMemories } from './data/memories.js';

export default function App() {
  const [page, setPage] = useState('welcome');
  const [bootError, setBootError] = useState('');

  // The invite token is a random secret in the URL fragment, so it is not sent
  // in ordinary HTTP requests or referrer headers. The backend stores only its hash.
  const inviteToken = window.location.hash.startsWith('#invite=')
    ? window.location.hash.slice('#invite='.length)
    : '';

  useEffect(() => {
    if (!inviteToken) return;
    signInAnonymously(auth).catch((error) => {
      console.error(error);
      setBootError('We could not start a secure viewing session. Please contact the album owner.');
    });
  }, [inviteToken]);

  async function call(name, extra = {}) {
    if (!inviteToken) throw new Error('Missing private invitation token.');
    if (!auth.currentUser) await signInAnonymously(auth);
    const callable = httpsCallable(functions, name);
    const result = await callable({ token: inviteToken, ...extra });
    return result.data;
  }

  async function loadCurrentPhoto() {
    return call('getCurrentPhoto');
  }

  async function advancePhoto() {
    return call('advancePhoto');
  }

  if (bootError) return <main className="page"><h1>One moment, please</h1><p>{bootError}</p></main>;

  if (page === 'welcome') {
    return <Welcome onEnter={() => setPage('gallery')} />;
  }
  if (page === 'finished') return <Finished />;

  return (
    <Gallery
      photos={babyMemories}
      loadCurrentPhoto={loadCurrentPhoto}
      advancePhoto={advancePhoto}
      onFinish={() => setPage('finished')}
    />
  );
}
