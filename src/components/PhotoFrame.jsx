import { Heart } from 'lucide-react';

export default function PhotoFrame({ src, alt, isParents = false }) {
  return (
    <div className={`photo-frame ${isParents ? 'parents-frame' : ''}`}>
      {src ? <img src={src} alt={alt} draggable="false" /> : (
        <div className="photo-placeholder">
          <Heart size={30} />
          <span>{isParents ? 'Add your family photo here' : 'Your precious photo will appear here'}</span>
          <small>Private photo placeholder</small>
        </div>
      )}
    </div>
  );
}
