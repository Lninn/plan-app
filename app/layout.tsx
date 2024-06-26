import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/lib/StoreProvider";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdProvider from "./antd-provider";
import Script from 'next/script'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plan App",
  description: "Plan App",
};

interface UserConfig {
  appearance?:
  | boolean
  | 'dark'
  | 'force-dark'
  | 'auto'
  | {
    initialValue?: 'dark' | 'force-dark';
  };
}

const APPEARANCE_KEY = 'vitepress-theme-appearance'
const userConfig: UserConfig = {
  appearance: 'auto',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fallbackPreference =
      typeof userConfig?.appearance === 'string'
        ? userConfig?.appearance
        : typeof userConfig?.appearance === 'object'
          ? userConfig.appearance.initialValue ?? 'auto'
          : 'auto'

  return (
    <html lang="en">
      <Script
         id="check-dark-mode"
         dangerouslySetInnerHTML={{
           __html: (
            fallbackPreference === 'force-dark'
              ? `document.documentElement.classList.add('dark')`
              : `;(() => {
                  const preference = localStorage.getItem('${APPEARANCE_KEY}') || '${fallbackPreference}'
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                  if (!preference || preference === 'auto' ? prefersDark : preference === 'dark')
                    document.documentElement.classList.add('dark')
                })()`
           ),
         }}
      />
      <body className={inter.className}>
        <AntdRegistry>
          <StoreProvider lastUpdate={new Date().getTime()}>
            <AntdProvider>
              {children}
            </AntdProvider>
          </StoreProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
