import React from 'react';
import './globals.css';
import { QueryProvider } from '../src/providers/QueryProvider';
import { SuppressExtensionErrors } from '../src/components/common/SuppressExtensionErrors';

export const metadata = {
  title: 'WAR RISK PREDICTION',
  description: 'Real-time 3D Globe + Briefing Grid Geopolitical Instability and Maritime Trade Impact Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function shouldSuppress(msg, src, err) {
                  var str = (msg || '') + ' ' + (src || '') + ' ' + (err && err.stack || '');
                  return str.indexOf('nkbihfbeogaeaoehlefnkodbefgpgknn') !== -1 ||
                         str.indexOf('inpage.js') !== -1 ||
                         str.indexOf('MetaMask') !== -1 ||
                         str.indexOf('Failed to connect') !== -1;
                }
                var origError = window.onerror;
                window.onerror = function(msg, src, line, col, err) {
                  if (shouldSuppress(msg, src, err)) return true;
                  if (origError) return origError.apply(this, arguments);
                };
                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e && (e.reason && (e.reason.message || e.reason.stack) || e.reason) || '';
                  if (shouldSuppress(reason, '', null)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
                window.addEventListener('error', function(e) {
                  var msg = e && e.message || '';
                  var src = e && e.filename || '';
                  var err = e && e.error || null;
                  if (shouldSuppress(msg, src, err)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="bg-cyber-bg text-cyber-textMain antialiased">
        <SuppressExtensionErrors />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
