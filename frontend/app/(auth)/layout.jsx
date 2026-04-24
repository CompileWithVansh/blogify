import Link from 'next/link';
import { Feather } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center px-4 relative overflow-hidden noise">
      {/* Blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <Feather size={20} className="text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">
          Blog<span className="text-indigo-200">ify</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md">
        {children}
      </div>

      <p className="mt-8 text-white/40 text-sm">
        © {new Date().getFullYear()} Blogify
      </p>
    </div>
  );
}
