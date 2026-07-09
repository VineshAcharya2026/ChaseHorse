import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ThemeProvider } from '@/components/theme-provider';
import { LeadFormProvider } from '@/components/lead-form-provider';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { LeadFormModal } from '@/components/sections/lead-form-modal';
import { SiteContentProvider } from '@/components/site-content-provider';
import { getSiteContent } from '@/lib/content';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'ChaseHorse | Logistics & Supply Chain Solutions',
    template: '%s | ChaseHorse',
  },
  description:
    'ChaseHorse — technology-driven logistics and supply chain transformation. Deploy faster. Deliver smarter.',
  openGraph: {
    siteName: 'ChaseHorse',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ch-theme');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <SiteContentProvider initial={getSiteContent()}>
            <LeadFormProvider>
              <SmoothScroll>
                <SiteHeader />
                <main>{children}</main>
                <SiteFooter />
              </SmoothScroll>
              <LeadFormModal />
            </LeadFormProvider>
          </SiteContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
