// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Helper script to detect and fix redirection loops
                console.log("Admin page redirection helper loaded");
                
                // Check for specific login case
                if (window.location.pathname === "/admin/login") {
                  // If we have a session and should be at admin page
                  const forceRedirect = sessionStorage.getItem("forceAdminRedirect");
                  if (forceRedirect === "true") {
                    console.log("Detected forced admin redirect case");
                    sessionStorage.removeItem("forceAdminRedirect");
                    window.location.replace("/admin");
                  }
                }
              })();
            `,
          }}
        />
      </body>
    </Html>
  );
}