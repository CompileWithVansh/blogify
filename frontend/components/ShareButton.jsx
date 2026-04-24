'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-indigo-600 transition-colors font-medium"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}
