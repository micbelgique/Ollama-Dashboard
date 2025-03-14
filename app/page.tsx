"use client";

import { Suspense } from "react";
import Image from "next/image";
import { Box, Container, Typography, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/lib/theme";
import ModelList from "@/components/ModelList";
import ModelInstaller from "@/components/ModelInstaller";
import { LoadingModels } from "@/components/loading-ui";

export default function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom right, #f8fafc, rgba(239, 246, 255, 0.3))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "800px",
              height: "800px",
              background: "#4AA9FF",
              borderRadius: "50%",
              opacity: 0.02,
              transform: "translate(-50%, -50%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "20%",
              right: 0,
              width: "600px",
              height: "600px",
              background: "#FF4D6A",
              borderRadius: "50%",
              opacity: 0.02,
              transform: "translateX(50%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "30%",
              width: "700px",
              height: "700px",
              background: "#FF9F2E",
              borderRadius: "50%",
              opacity: 0.02,
              transform: "translateY(50%)",
            }}
          />
        </Box>

        <Container
          sx={{ py: 4, position: "relative", zIndex: 1, maxWidth: "1200px" }}
        >
          <Box component="header" sx={{ mb: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                mb: 4,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    filter: "blur(20px)",
                    opacity: 0.2,
                    background:
                      "linear-gradient(to right, #4AA9FF, #FF4D6A, #FF9F2E)",
                    borderRadius: "50%",
                  }}
                />
                <Image
                  src="https://ollama.com/public/ollama.png"
                  alt="Ollama Logo"
                  width={80}
                  height={80}
                  style={{ position: "relative" }}
                  priority
                />
              </Box>

              <Box sx={{ mt: 2, position: "relative" }}>
                {/* Title */}
                <Box sx={{ position: "relative" }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: "bold",
                      background:
                        "linear-gradient(to right, #4AA9FF, #FF4D6A, #FF9F2E)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      position: "relative",
                      zIndex: 10,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Ollama Manager
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      width: "100%",
                      height: "1px",
                      background:
                        "linear-gradient(to right, transparent, #4AA9FF, transparent)",
                    }}
                  />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 2,
                    color: "text.secondary",
                    bgcolor: "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(4px)",
                    px: 2,
                    py: 0.5,
                    borderRadius: "24px",
                    border: "1px solid rgba(226, 232, 240, 0.5)",
                    display: "inline-block",
                  }}
                >
                  Gestionnaire de modèles IA local
                </Typography>
              </Box>
            </Box>

            <Box sx={{ position: "relative", mt: 4 }}>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, #4AA9FF, #FF4D6A, #FF9F2E)",
                  borderRadius: "24px",
                  filter: "blur(8px)",
                  opacity: 0.2,
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  height: "1px",
                  width: "100%",
                  background:
                    "linear-gradient(to right, #4AA9FF, #FF4D6A, #FF9F2E)",
                }}
              />
            </Box>
          </Box>

          <Box component="main" sx={{ position: "relative" }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                bgcolor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226, 232, 240, 0.5)",
              }}
            >
              <Suspense fallback={<LoadingModels />}>
                <ModelInstaller />
              </Suspense>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226, 232, 240, 0.5)",
              }}
            >
              <Suspense fallback={<LoadingModels />}>
                <ModelList />
              </Suspense>
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
