import type { Metadata } from "next";
import "@/app/globals.css"; // Créez un fichier de styles globaux

export const metadata: Metadata = {
  title: "Ollama Desktop",
  description: "Interface pour gérer vos modèles Ollama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 min-h-screen">
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
