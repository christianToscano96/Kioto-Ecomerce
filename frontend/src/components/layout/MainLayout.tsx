import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <main className="max-w-screen-2xl mx-auto px-8 pt-24 pb-32">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}