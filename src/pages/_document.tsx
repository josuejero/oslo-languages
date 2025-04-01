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
        
       // Check for admin page case
       if (window.location.pathname === "/admin") {
         // Log auth status to help debug
         console.log("Admin page loaded, checking auth state");
         // Add a timeout to check after NextAuth has time to initialize
         setTimeout(() => {
           const isForced = sessionStorage.getItem("forceAdminRedirect");
           console.log("Forced redirect flag:", isForced);
           if (isForced === "true") {
             console.log("Auth should be established, keeping user on admin page");
             sessionStorage.removeItem("forceAdminRedirect");
           }
         }, 500);
       }
      })();
    `,
  }}
/>
      </body>
    </Html>
  );
}