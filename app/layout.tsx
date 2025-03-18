import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestionnaire Ollama",
  description: "Interface pour gérer vos modèles Ollama",
  icons: {
    // Utilisation de l'image officielle d'Ollama
    icon: [
      { url: "https://ollama.com/public/og-twitter.png", type: "image/png" },
    ],
    apple: [{ url: "/ollama.png", type: "image/png" }],
    shortcut: [{ url: "/ollama.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Favicon officielle d'Ollama */}
        <link rel="icon" href="/ollama.png" type="image/png" />
        <link rel="shortcut icon" href="/ollama.png" type="image/png" />
        <link rel="apple-touch-icon" href="/ollama.png" type="image/png" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
