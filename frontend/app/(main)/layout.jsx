import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@clerk/nextjs/server';
import { checkUser, isAdminUser } from '@/lib/checkUser';

export default async function MainLayout({ children }) {
  const { userId } = await auth();
  let isAdmin = false;

  if (userId) {
    const user = await checkUser();
    isAdmin = isAdminUser(user);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
