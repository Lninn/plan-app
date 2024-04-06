"use client";

import { ConfigProvider, theme } from "antd";


export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.defaultAlgorithm, theme.darkAlgorithm],
      }}>
      <ConfigProvider theme={{ cssVar: true, hashed: false }}>{children}</ConfigProvider>
    </ConfigProvider>
  );
}
