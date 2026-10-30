
import { Heart, Sparkles } from 'lucide-react';

export default function Finished() {
  return (
    <main className="page finished-page">
      <div className="finish-icon">
        <Heart size={32} fill="currentColor" />
      </div>

      <div className="eyebrow">
        <Sparkles size={15} /> ALL MEMORIES VIEWED <Sparkles size={15} />
      </div>

      <h1>Thank you for sharing in her story.</h1>

      <p className="subtitle">
        Oamogetswe Precious is a blessing beyond words, and we're grateful
        you took a moment to celebrate her little life with us.
      </p>

      <div className="closing-card">
        <p>
          “Children are a heritage from the LORD, offspring a reward from him.”
        </p>
        <strong>Psalm 127:3 · NIV</strong>
      </div>

      <p className="letter-signoff">
        With love, always <span>♡</span>
      </p>
    </main>
  );
}
