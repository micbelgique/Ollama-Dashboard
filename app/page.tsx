"use client";

import { Suspense, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ModelList from "@/components/ModelList";
import ModelInstaller from "@/components/ModelInstaller";
import { LoadingModels } from "@/components/loading-ui";
import { InstallGuideContent } from "@/components/install-guide";
import { Download, LayoutDashboard, HelpCircle, X } from "lucide-react";
import React from "react";
import { CompactSystemStatus } from "@/components/compact-system-status";

export default function HomePage() {
  const theme = useTheme();
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const handleOpenInstallModal = () => {
    setInstallModalOpen(true);
  };

  const handleCloseInstallModal = () => {
    setInstallModalOpen(false);
  };

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
        {/* Modern App Bar with integrated system status */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid",
            borderColor: "rgba(226, 232, 240, 0.8)",
            color: "text.primary",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar
              disableGutters
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 64,
                px: { xs: 1, md: 2 },
              }}
            >
              {/* Left side: Logo and title */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="a"
                  href="https://ollama.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: -1,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.5)",
                      filter: "blur(3px)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover": {
                      "& img": {
                        transform: "scale(1.05) rotate(3deg)",
                      },
                      "&::before": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://ollama.com/public/og-twitter.png"
                    alt="Ollama"
                    sx={{
                      height: 32,
                      width: "auto",
                      objectFit: "contain",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.05))",
                      transition: "all 0.3s ease",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    background: "linear-gradient(45deg, #2563EB, #4AA9FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    position: "relative",
                    "&::after": {
                      content: "''",
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      width: "100%",
                      height: 2,
                      background:
                        "linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.3), transparent)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      borderRadius: 1,
                    },
                    "&:hover::after": {
                      opacity: 1,
                    },
                  }}
                >
                  Gestionnaire Ollama
                </Typography>
              </Box>

              {/* Center space - flexible */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Right side: System Status + Install button - Docker Desktop style */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <CompactSystemStatus />

                <Button
                  variant="text"
                  onClick={handleOpenInstallModal}
                  startIcon={<HelpCircle size={15} strokeWidth={2.5} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#475569",
                    backgroundColor: "transparent",
                    borderRadius: 2,
                    py: 0.7,
                    px: { xs: 1.5, sm: 2 },
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "rgba(226, 232, 240, 0.6)",
                      color: "#1E293B",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Guide d'installation
                  </Box>
                </Button>
              </Box>
            </Toolbar>
          </Container>
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
                  "radial-gradient(circle, rgba(74, 169, 255, 0.08) 0%, rgba(74, 169, 255, 0) 70%)",
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
                  "radial-gradient(circle, rgba(255, 77, 106, 0.08) 0%, rgba(255, 77, 106, 0) 70%)",
                borderRadius: "50%",
              }}
            />
          </Box>

          <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
            <Box component="section">
              {/* Section Installer un modèle */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  mb: 4,
                  borderRadius: 4,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-3px)",
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
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.light,
                        0.2
                      )}, ${alpha(theme.palette.primary.main, 0.2)})`,
                      mr: 2,
                    }}
                  >
                    <Download size={22} color={theme.palette.primary.main} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "-0.3px",
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
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 4,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-3px)",
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
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.light,
                        0.2
                      )}, ${alpha(theme.palette.primary.main, 0.2)})`,
                      mr: 2,
                    }}
                  >
                    <LayoutDashboard
                      size={22}
                      color={theme.palette.primary.main}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "-0.3px",
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

        {/* Installation Guide Modal */}
        <Dialog
          fullWidth
          maxWidth="md"
          open={installModalOpen}
          onClose={handleCloseInstallModal}
          // Remove the problematic TransitionComponent completely
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
            },
          }}
        >
          <Box sx={{ position: "relative", p: 3 }}>
            <IconButton
              onClick={handleCloseInstallModal}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.05)",
                  color: "text.primary",
                },
              }}
            >
              <X size={20} />
            </IconButton>
            <InstallGuideContent />
          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
