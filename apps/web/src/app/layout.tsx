import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/app-providers';
import { SiteHeader } from '@/components/site-header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'FateAgent · 智能足球赛事分析平台',
  description: '基于数据的足球赛事分析与可视化决策支持。'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="font-sans">
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
