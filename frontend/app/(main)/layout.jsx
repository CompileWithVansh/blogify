import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@clerk/nextjs/server';
import { checkUser } from '@/lib/checkUser';

export default async function MainLayout({ children }) {
  // Sync logged-in Clerk user to Strapi on every page load.
  // This ensures the user exists in Strapi before they try to create a post.
  const { userId } = await auth();
  if (userId) {
    await checkUser();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
