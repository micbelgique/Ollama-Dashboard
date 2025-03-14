"use client";

import { Box, Typography, CircularProgress } from "@mui/material";

export function LoadingModels() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <Box sx={{ position: "relative", mb: 3 }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #4AA9FF, #FF4D6A, #FF9F2E)",
            borderRadius: "50%",
            filter: "blur(16px)",
            opacity: 0.3,
            animation: "pulse 2s infinite",
          }}
        />
        <Box
          sx={{
            position: "relative",
            height: 64,
            width: 64,
            borderRadius: "50%",
            border: "4px solid transparent",
            backgroundImage:
              "linear-gradient(white, white), linear-gradient(to right, #4AA9FF, #FF4D6A, #FF9F2E)",
            backgroundOrigin: "border-box",
            backgroundClip: "content-box, border-box",
            animation: "spin 3s linear infinite",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(360deg)",
              },
            },
            "@keyframes pulse": {
              "0%": {
                opacity: 0.2,
              },
              "50%": {
                opacity: 0.3,
              },
              "100%": {
                opacity: 0.2,
              },
            },
          }}
        >
          <Box
            sx={{
              height: 48,
              width: 48,
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={32}
              thickness={4}
              sx={{
                color: "#4AA9FF",
              }}
            />
          </Box>
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{ mb: 1, color: "text.primary", fontWeight: 600 }}
      >
        Chargement des modèles...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Récupération des informations depuis Ollama
      </Typography>
    </Box>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, #4AA9FF, #FF4D6A, #FF9F2E)",
          borderRadius: "50%",
          filter: "blur(4px)",
          opacity: 0.3,
        }}
      />
      <CircularProgress
        size={sizeMap[size]}
        thickness={4}
        sx={{
          position: "relative",
          color: "text.primary",
        }}
      />
    </Box>
  );
}
