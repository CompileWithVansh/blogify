import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: { default: 'Blogify', template: '%s | Blogify' },
  description: 'A modern blog platform — read, write, and share ideas.',
  keywords: ['blog', 'writing', 'articles', 'blogify'],
  openGraph: {
    type: 'website',
    siteName: 'Blogify',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body className="font-sans">
          {children}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                border: '1px solid #e7e5e4',
                boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
