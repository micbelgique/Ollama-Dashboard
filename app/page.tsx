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
import { SystemStatus } from "@/components/system-status";
import { Download, LayoutDashboard, HelpCircle, X } from "lucide-react";
import React from "react";

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
        {/* Modern App Bar with integrated install guide button */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
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
                justifyContent: "space-between",
                alignItems: "center",
                height: 70,
              }}
            >
              {/* Left spacer to balance layout */}
              <Box sx={{ width: 150 }} />

              {/* Title in center */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  background: "linear-gradient(45deg, #2563EB, #4AA9FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textAlign: "center",
                }}
              >
                Gestionnaire Ollama
              </Typography>

              {/* Install button on right */}
              <Button
                variant="outlined"
                size="small"
                onClick={handleOpenInstallModal}
                startIcon={<HelpCircle size={14} />}
                sx={{
                  borderRadius: "8px",
                  px: 2,
                  py: 0.6,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "rgba(37, 99, 235, 0.3)",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.04)",
                    borderColor: "primary.main",
                  },
                  transition: "all 0.2s",
                }}
              >
                Installation
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 10, // Reduced top padding since we no longer have the button there
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
            <Box component="header" sx={{ mb: 4 }}>
              {/* System Status Indicator */}
              <Box sx={{ mb: 4 }}>
                <SystemStatus />
              </Box>
            </Box>

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

        {/* Installation Guide Modal - Fixed to prevent app from freezing */}
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
