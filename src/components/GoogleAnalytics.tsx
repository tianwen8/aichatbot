'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// 为全局gtag函数添加类型声明
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  // 添加检测当前域名的代码
  useEffect(() => {
    // 检测当前域名并设置适当的配置
    const hostname = window.location.hostname;
    if (hostname.includes('perai.xyz')) {
      // 对periai.xyz域名的特定配置
      window.dataLayer = window.dataLayer || [];
      const gtag = function() {
        window.dataLayer.push(arguments);
      };
      // @ts-ignore - arguments是一个特殊对象
      gtag('js', new Date());
      // @ts-ignore - arguments是一个特殊对象
      gtag('config', `${process.env.NEXT_PUBLIC_GA_ID}`, {
        cookie_domain: 'periai.xyz',
        cookie_flags: 'SameSite=None;Secure',
      });
    }
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', \`${process.env.NEXT_PUBLIC_GA_ID}\`, {
              cookie_domain: 'auto',
              cookie_flags: 'SameSite=None;Secure',
              allow_linker: true
            });
          `,
        }}
      />
    </>
  );
} 