import Link from 'next/link';
import { Feather, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Feather size={36} className="text-indigo-500" />
      </div>
      <div className="text-8xl font-bold gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold text-stone-900 mb-2">Page not found</h1>
      <p className="text-stone-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  );
}
