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
                
                // Loop detection logic for login page
                if (window.location.pathname === "/admin/login") {
                  const loginAttempts = sessionStorage.getItem("loginLoopCount") || "0";
                  const count = parseInt(loginAttempts) + 1;
                  sessionStorage.setItem("loginLoopCount", count.toString());
                  
                  // If we detect more than 3 refreshes in under 3 seconds, break the loop
                  if (count > 3 && (new Date().getTime() - (parseInt(sessionStorage.getItem("loginLoopStart") || "0")) < 3000)) {
                    console.warn("Detected potential login redirect loop, breaking the cycle");
                    // Clean up all redirect-related flags
                    sessionStorage.removeItem("adminLoginAttempt");
                    sessionStorage.removeItem("adminLoginTime");
                    sessionStorage.removeItem("forceAdminRedirect");
                    sessionStorage.removeItem("loginLoopCount");
                    sessionStorage.removeItem("loginLoopStart");
                    // Force to home page to break the loop
                    if (window.location.pathname !== "/") {
                      window.location.replace("/");
                    }
                  }
                  
                  // Start tracking time if this is the first attempt
                  if (count === 1) {
                    sessionStorage.setItem("loginLoopStart", new Date().getTime().toString());
                  }
                } else {
                  // Reset loop detection when not on login page
                  sessionStorage.removeItem("loginLoopCount");
                  sessionStorage.removeItem("loginLoopStart");
                }
                
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
