import "./globals.css";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Embercore — Strength Studio",
  description:
    "The independent strength studio for coached training, honest programming and a floor that never feels crowded.",
  openGraph: {
    title: "Embercore — Strength Studio",
    description:
      "The independent strength studio for coached training, honest programming and a floor that never feels crowded.",
    images: [{ url: "/assets/embercore-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embercore — Strength Studio",
    description:
      "The independent strength studio for coached training, honest programming and a floor that never feels crowded.",
    images: ["/assets/embercore-og.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0a09",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="anim">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300..800&family=Barlow+Condensed:ital,wght@1,600;1,700&family=Fira+Code:wght@400&display=swap"
          rel="stylesheet"
        />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              imports: {
                three: "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
                "three/addons/":
                  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/",
              },
            }),
          }}
        />
      </head>
      <body>
        <noscript>
          <style>{`html.anim [data-in], .reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
