// src/pages/_document.tsx (ES Modules version)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* Remove the problematic script here */}
      </body>
    </Html>
  );
}