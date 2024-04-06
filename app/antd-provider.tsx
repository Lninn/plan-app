"use client";

import { useTheme } from "@/hooks";
import { ConfigProvider, theme } from "antd";


export default function AntdProvider({ children }: { children: React.ReactNode }) {
  const themeHook = useTheme()

  const algorithm = themeHook.theme === 'dark' ? [theme.defaultAlgorithm, theme.darkAlgorithm] : theme.defaultAlgorithm

  return (
    <ConfigProvider theme={{ algorithm }}>
      <ConfigProvider theme={{ cssVar: true, hashed: false }}>
        {children}
      </ConfigProvider>
    </ConfigProvider>
  );
}
