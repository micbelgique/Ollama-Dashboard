"use client";

import { Suspense } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ModelList from "@/components/ModelList";
import ModelInstaller from "@/components/ModelInstaller";
import { LoadingModels } from "@/components/loading-ui";
import { InstallGuide } from "@/components/install-guide";
import { SystemStatus } from "@/components/system-status";
import { Download, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(130deg, #f9fafb 0%, #eff6ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* App Bar - Version ultra minimaliste */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid",
            borderColor: "rgba(226, 232, 240, 0.8)",
            color: "text.primary",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  background:
                    "linear-gradient(45deg, rgba(37, 99, 235, 0.08), rgba(74, 169, 255, 0.08))",
                  border: "1px solid rgba(255, 255, 255, 0.7)",
                }}
              >
                <Image
                  src="https://ollama.com/public/ollama.png"
                  alt="Ollama Logo"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(to right, #2563EB, #4AA9FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ollama Desktop
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 10,
            pb: 6,
            px: { xs: 2, sm: 4, md: 6 },
            position: "relative",
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
                top: "5%",
                left: "10%",
                width: "600px",
                height: "600px",
                background:
                  "radial-gradient(circle, rgba(74, 169, 255, 0.06) 0%, rgba(74, 169, 255, 0) 70%)",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "10%",
                right: "5%",
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(255, 77, 106, 0.06) 0%, rgba(255, 77, 106, 0) 70%)",
                borderRadius: "50%",
              }}
            />
          </Box>

          <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
            <Box component="header" sx={{ mb: 4 }}>
              {/* System Status Indicator */}
              <Box sx={{ mb: 4 }}>
                <SystemStatus />
              </Box>

              {/* Installation Guide - si nécessaire */}
              <InstallGuide />
            </Box>

            <Box component="section">
              {/* Section Installer un modèle */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      mr: 2,
                    }}
                  >
                    <Download size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Installer un modèle
                  </Typography>
                </Box>

                <Suspense fallback={<LoadingModels />}>
                  <ModelInstaller />
                </Suspense>
              </Paper>

              {/* Section Modèles installés */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      mr: 2,
                    }}
                  >
                    <LayoutDashboard
                      size={20}
                      color={theme.palette.primary.main}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Modèles installés
                  </Typography>
                </Box>

                <Suspense fallback={<LoadingModels />}>
                  <ModelList />
                </Suspense>
              </Paper>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
