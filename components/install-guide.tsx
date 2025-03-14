"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  Fade,
} from "@mui/material";
import {
  HelpCircle,
  ExternalLink,
  Terminal,
  Download,
  ChevronDown,
  ChevronUp,
  Github,
  Info,
} from "lucide-react";

export function InstallGuide() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsOpen(!isOpen)}
          startIcon={
            isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          }
          endIcon={<HelpCircle size={16} />}
          sx={{
            borderColor: "rgba(74, 169, 255, 0.5)",
            color: "#4AA9FF",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(4px)",
            "&:hover": {
              borderColor: "#4AA9FF",
              background: "rgba(74, 169, 255, 0.05)",
            },
            px: 3,
          }}
        >
          {isOpen
            ? "Masquer l'aide d'installation"
            : "Comment installer Ollama ?"}
        </Button>
      </Box>

      {/* Conditional render with CSS transition */}
      <Fade in={isOpen} timeout={500}>
        <Box
          sx={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
            overflow: "hidden",
            transition: "opacity 0.3s ease",
            mb: isOpen ? 3 : 0,
            display: isOpen ? "block" : "none",
          }}
        >
          <Card
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: "rgba(74, 169, 255, 0.2)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              borderRadius: 2,
              overflow: "hidden",
              transition: "all 0.3s ease",
              mt: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: "text.primary",
                    background: "linear-gradient(to right, #4AA9FF, #2563EB)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Info size={18} />
                  Installation d'Ollama
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: "700px", mx: "auto" }}
                >
                  Ollama est nécessaire pour exécuter des modèles d'IA
                  localement. Suivez ces instructions pour l'installer sur votre
                  système.
                </Typography>
              </Box>

              <Grid container spacing={3} justifyContent="center">
                {/* macOS */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                      border: "1px solid",
                      borderColor: "grey.100",
                      borderRadius: 2,
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: "primary.lighter",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Download
                          size={16}
                          color={theme.palette.primary.main}
                        />
                      </Box>
                      <Typography
                        variant="subtitle2"
                        color="text.primary"
                        fontWeight={600}
                      >
                        macOS
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Téléchargez et installez l'application depuis le site
                      officiel. Compatible avec macOS 12 ou supérieur.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      endIcon={<ExternalLink size={14} />}
                      onClick={() =>
                        window.open("https://ollama.com/download/mac", "_blank")
                      }
                      sx={{
                        color: "primary.main",
                        borderColor: "primary.light",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "primary.lighter",
                        },
                      }}
                    >
                      Télécharger pour macOS
                    </Button>
                  </Paper>
                </Grid>

                {/* Linux */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                      border: "1px solid",
                      borderColor: "grey.100",
                      borderRadius: 2,
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: "secondary.lighter",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Terminal
                          size={16}
                          color={theme.palette.secondary.main}
                        />
                      </Box>
                      <Typography
                        variant="subtitle2"
                        color="text.primary"
                        fontWeight={600}
                      >
                        Linux
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Installez via la commande curl depuis le terminal:
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: "grey.900",
                        color: "grey.200",
                        p: 1.5,
                        borderRadius: 1,
                        mb: 2,
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        overflow: "auto",
                        position: "relative",
                      }}
                    >
                      curl -fsSL https://ollama.com/install.sh | sh
                      <Tooltip title="Copier la commande">
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            color: "grey.400",
                            "&:hover": { color: "white" },
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "curl -fsSL https://ollama.com/install.sh | sh"
                            );
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      endIcon={<ExternalLink size={14} />}
                      onClick={() =>
                        window.open(
                          "https://ollama.com/download/linux",
                          "_blank"
                        )
                      }
                      sx={{
                        color: "secondary.main",
                        borderColor: "secondary.light",
                        "&:hover": {
                          borderColor: "secondary.main",
                          bgcolor: "secondary.lighter",
                        },
                      }}
                    >
                      Instructions détaillées
                    </Button>
                  </Paper>
                </Grid>

                {/* Windows */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                      border: "1px solid",
                      borderColor: "grey.100",
                      borderRadius: 2,
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: "warning.lighter",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Download
                          size={16}
                          color={theme.palette.warning.main}
                        />
                      </Box>
                      <Typography
                        variant="subtitle2"
                        color="text.primary"
                        fontWeight={600}
                      >
                        Windows
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Téléchargez et installez l'application Windows. Compatible
                      avec Windows 10/11 avec WSL2.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      endIcon={<ExternalLink size={14} />}
                      onClick={() =>
                        window.open(
                          "https://ollama.com/download/windows",
                          "_blank"
                        )
                      }
                      sx={{
                        color: "warning.main",
                        borderColor: "warning.light",
                        "&:hover": {
                          borderColor: "warning.main",
                          bgcolor: "warning.lighter",
                        },
                      }}
                    >
                      Télécharger pour Windows
                    </Button>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Github size={14} />}
                  endIcon={<ExternalLink size={14} />}
                  onClick={() =>
                    window.open("https://github.com/ollama/ollama", "_blank")
                  }
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Documentation complète sur GitHub
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Box>
  );
}
