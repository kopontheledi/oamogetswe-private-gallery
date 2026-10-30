
import { useState } from 'react';
import { ArrowRight, Heart, LockKeyhole } from 'lucide-react';
import PhotoFrame from '../components/PhotoFrame.jsx';
import VerseCard from '../components/VerseCard.jsx';

export default function Gallery({ photos, onFinish }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const item = photos[photoIndex];

  function next() {
    if (photoIndex === photos.length - 1) {
      onFinish();
      return;
    }

    setPhotoIndex((previous) => previous + 1);
  }

  if (!item) {
    return (
      <main className="page">
        <p>No memories are available yet.</p>
      </main>
    );
  }

  return (
    <main className="page gallery-page">
      <div className="gallery-topline">
        <span>OAMOGETSWE'S LITTLE WORLD</span>
        <span><LockKeyhole size={13} /> PRIVATE</span>
      </div>

      <div className="progress-label">
        MEMORY {photoIndex + 1} OF {photos.length}
      </div>

      <div className="progress-track">
        <span style={{
          width: `${((photoIndex + 1) / photos.length) * 100}%`
        }} />
      </div>

      <h2>{item.title}</h2>

      <PhotoFrame
        src={item.image}
        alt={`Memory ${photoIndex + 1} of Oamogetswe Precious`}
      />

      <VerseCard
        title="A little blessing from the Bible"
        verse={item.verse}
        reference={item.reference}
      />

      <p className="gallery-caption">
        <Heart size={15} fill="currentColor" />
        A precious moment, kept with love.
      </p>

      <button className="primary-button" onClick={next}>
        {photoIndex === photos.length - 1
          ? 'Finish the album'
          : 'Keep going'}
        <ArrowRight size={17} />
      </button>

      <p className="lock-reminder">
        <LockKeyhole size={13} />
        When you continue, this photo stays locked.
      </p>
    </main>
  );
}
