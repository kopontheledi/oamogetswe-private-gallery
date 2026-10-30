import { BookOpen } from 'lucide-react';

export default function VerseCard({ title, verse, reference }) {
  return (
    <aside className="verse-card">
      <div className="verse-heading">
        <BookOpen size={17} />
         <span>{title}</span>
         </div>
      <blockquote>“{verse}”</blockquote>
      <p className="verse-reference">{reference} · KJV</p>
    </aside>
  );
}
