import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation des images
  images: {
    domains: ["localhost"],
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Configuration des alias de chemins
  eslint: {
    dirs: ["app", "components", "services", "utils", "types"],
  },

  // Environnement
  env: {
    OLLAMA_API_URL: process.env.OLLAMA_API_URL || "http://localhost:11434",
  },

  // Ajouts minimaux pour améliorer les performances
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Pour de meilleures performances de production
  reactStrictMode: true,

  // Pour un chargement plus rapide des pages
  poweredByHeader: false,
};

export default nextConfig;
