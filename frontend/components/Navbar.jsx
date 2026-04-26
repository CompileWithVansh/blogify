'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SignedIn, SignedOut, SignInButton, SignUpButton, UserButton,
} from '@clerk/nextjs';
import {
  PenLine, BookOpen, LayoutDashboard, Menu, X, Feather, Shield,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/blog', label: 'Blog', icon: BookOpen },
];

export default function Navbar({ isAdmin = false }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="section h-16 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group" data-testid="nav-logo">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Feather size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-stone-900 tracking-tight">
            Blog<span className="text-indigo-600">ify</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl transition-all',
                pathname.startsWith(href)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}

          <SignedIn>
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl transition-all',
                pathname.startsWith('/dashboard')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              )}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl transition-all',
                  pathname.startsWith('/admin')
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-600 hover:text-white hover:bg-indigo-600'
                )}
              >
                <Shield size={15} />
                Admin
              </Link>
            )}
          </SignedIn>
        </div>

        {/* ── Right actions ── */}
        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-ghost text-sm">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary text-sm">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/blog/create" className="btn-primary text-sm" data-testid="nav-write-btn">
              <PenLine size={15} />
              Write
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 ring-2 ring-stone-200 hover:ring-indigo-300 transition-all rounded-xl',
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link label="Dashboard" labelIcon={<LayoutDashboard size={14} />} href="/dashboard" />
                {isAdmin && (
                  <UserButton.Link label="Admin Panel" labelIcon={<Shield size={14} />} href="/admin" />
                )}
                <UserButton.Link label="Write a Post" labelIcon={<PenLine size={14} />} href="/blog/create" />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-stone-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-fade-in">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-stone-700 hover:bg-stone-100'
              )}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}

          <SignedIn>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <Shield size={16} /> Admin Panel
              </Link>
            )}

            <Link
              href="/blog/create"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <PenLine size={16} /> Write a Post
            </Link>
            <div className="flex items-center gap-3 px-3 py-2.5">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9 ring-2 ring-stone-200 hover:ring-indigo-300 transition-all rounded-xl',
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link label="Dashboard" labelIcon={<LayoutDashboard size={14} />} href="/dashboard" />
                  {isAdmin && (
                    <UserButton.Link label="Admin Panel" labelIcon={<Shield size={14} />} href="/admin" />
                  )}
                  <UserButton.Link label="Write a Post" labelIcon={<PenLine size={14} />} href="/blog/create" />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
              <span className="text-sm text-stone-500">Account &amp; Sign Out</span>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="pt-2 flex flex-col gap-2">
              <SignInButton mode="modal">
                <button className="w-full btn-secondary text-sm justify-center">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full btn-primary text-sm justify-center">Get Started</button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
}
