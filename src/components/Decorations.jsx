import { Heart, Cloud, Star, Sparkles } from 'lucide-react';

export default function Decorations() {
  return (
    <div className="decorations" aria-hidden="true">
      <Heart className="deco deco-heart" />
      <Cloud className="deco deco-cloud" />
      <Star className="deco deco-star" />
      <Sparkles className="deco deco-sparkles" />
    </div>
  );
}
