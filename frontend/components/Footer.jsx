import Link from 'next/link';
import { Feather, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 mt-auto">
      <div className="section py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Feather size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-stone-900">
                Blog<span className="text-indigo-600">ify</span>
              </span>
            </Link>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
              A modern platform for writers and readers. Share your ideas, discover great content.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: '/blog', label: 'All Posts' },
                { href: '/blog?category=technology', label: 'Technology' },
                { href: '/blog?category=lifestyle', label: 'Lifestyle' },
                { href: '/blog?category=travel', label: 'Travel' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-stone-500 hover:text-indigo-600 transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 text-sm uppercase tracking-wider">Account</h3>
            <ul className="space-y-2">
              {[
                { href: '/sign-up', label: 'Get Started' },
                { href: '/sign-in', label: 'Sign In' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/blog/create', label: 'Write a Post' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-stone-500 hover:text-indigo-600 transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-stone-100">
          <p className="text-stone-400 text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">Blogify</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-stone-400 hover:text-stone-700 transition-colors" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="#" className="text-stone-400 hover:text-stone-700 transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
