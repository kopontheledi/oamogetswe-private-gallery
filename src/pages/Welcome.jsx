
import { Heart, LockKeyhole, Sparkles } from 'lucide-react';
import Decorations from '../components/Decorations.jsx';
import PhotoFrame from '../components/PhotoFrame.jsx';
import { welcomeMessage } from '../data/memories.js';

export default function Welcome({ onEnter }) {
  return (
    <main className="page welcome-page">
      <Decorations />

      <div className="eyebrow">
        <Sparkles size={15} />
        OUR LITTLE MIRACLE
        <Sparkles size={15} />
      </div>

      <h1>
        Oamogetswe <span>Precious</span>
      </h1>

      <p className="subtitle">
        Our answered prayer. Our precious blessing. Our greatest little love.
      </p>

      <PhotoFrame
        src="/images/parents.jpeg"
        alt="Oamogetswe Precious with her parents"
        isParents
      />

      <p className="parents-caption">
        Two hearts, one love — and you, our most precious blessing.
        <Heart size={15} fill="currentColor" />
      </p>

      <section className="letter-card">
        <p className="letter-greeting">To our precious girl,</p>

        {welcomeMessage.split('\n\n').map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <p className="letter-signoff">
          Loved endlessly, today and always <span>♡</span>
        </p>
      </section>

      <div className="privacy-note">
        <LockKeyhole size={15} />
        A private album, shared with love
      </div>

      <button className="primary-button" onClick={onEnter}>
        Enter My Little World
        <Heart size={17} fill="currentColor" />
      </button>

      <p className="tiny-note">
        Pink dreams, blue skies, and a lifetime of love.
      </p>
    </main>
  );
}
