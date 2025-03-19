"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Fade,
  Grid,
  Tooltip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { fetchRunningModels, fetchModels } from "@/services/ollamaService";
// Import improved icons
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
// Remplacer l'icône de stockage par HardDrive pour cohérence avec ModelList
import { HardDrive, Cpu } from "lucide-react";

// Map des tailles de modèles par nom
const MODEL_SIZES = {
  phi4: 9.1,
  mistral: 4.1,
  phi3: 2.2,
  "llama3.2": 2.0,
  "deepseek-r1": 4.7,
  llava: 4.7,
  "minicpm-v": 5.5,
  "llama3.2-vision": 7.9,
  "mxbai-embed-large": 0.67,
  "nomic-embed-text": 0.274,
};

interface ModelSizes {
  [key: string]: number;
}

const getModelSize = (modelName: string): number => {
  const baseName: string = modelName.split(":")[0];
  for (const [key, size] of Object.entries(MODEL_SIZES as ModelSizes)) {
    if (baseName.includes(key)) {
      return size;
    }
  }
  return 0;
};

export function SystemStatus() {
  const [isOllamaRunning, setIsOllamaRunning] = useState<boolean | null>(null);
  const [systemInfo, setSystemInfo] = useState({
    memoryUsage: "0 GB",
    modelCount: 0,
    runningModels: 0,
    totalStorage: "0 GB",
  });

  useEffect(() => {
    const checkOllamaStatus = async () => {
      try {
        const runningModels = await fetchRunningModels();
        const allModels = await fetchModels();

        setIsOllamaRunning(true);
        const estimatedMemoryUsage = runningModels.length * 2.5;
        const totalStorageUsed = allModels.reduce(
          (sum, model) => sum + getModelSize(model.name),
          0
        );

        setSystemInfo({
          memoryUsage: `${estimatedMemoryUsage.toFixed(1)} GB`,
          modelCount: allModels.length,
          runningModels: runningModels.length,
          totalStorage: `${totalStorageUsed.toFixed(1)} GB`,
        });
      } catch (error) {
        console.error("Error checking Ollama status:", error);
        setIsOllamaRunning(false);
      }
    };

    checkOllamaStatus();
    const interval = setInterval(checkOllamaStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in={true} timeout={600}>
      <Paper
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(226, 232, 240, 0.6)",
          p: 1.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Status avec tooltip */}
          <Grid item xs={4} sm={4}>
            <Tooltip
              title={
                isOllamaRunning
                  ? "Ollama est en ligne et fonctionne correctement"
                  : "Ollama est hors ligne. Veuillez démarrer le service Ollama."
              }
              arrow
              placement="top"
            >
              <Box
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  position: "relative",
                  borderRight: {
                    xs: 0,
                    sm: "1px solid rgba(226, 232, 240, 0.5)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  STATUT
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: isOllamaRunning
                        ? "rgba(37, 99, 235, 0.15)" // Bleu au lieu de vert
                        : "rgba(255, 77, 106, 0.15)",
                      width: 48,
                      height: 48,
                      mb: 1,
                    }}
                  >
                    {isOllamaRunning ? (
                      <CloudDoneRoundedIcon
                        sx={{
                          color: "#2563EB", // Bleu au lieu de vert
                          fontSize: 28,
                          animation: "pulse 1.5s infinite",
                          "@keyframes pulse": {
                            "0%": { opacity: 0.7 },
                            "50%": { opacity: 1 },
                            "100%": { opacity: 0.7 },
                          },
                        }}
                      />
                    ) : (
                      <CloudOffRoundedIcon
                        sx={{
                          color: "#E11D48",
                          fontSize: 28,
                        }}
                      />
                    )}
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isOllamaRunning ? "#2563EB" : "#E11D48", // Bleu au lieu de vert
                      fontWeight: 700,
                      fontSize: "0.875rem",
                    }}
                  >
                    {isOllamaRunning ? "En ligne" : "Hors ligne"}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          </Grid>

          {/* Storage - Avec HardDrive icon */}
          <Grid item xs={4} sm={4}>
            <Tooltip
              title="Espace disque total utilisé par tous les modèles installés"
              arrow
              placement="top"
            >
              <Box
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  position: "relative",
                  borderRight: {
                    xs: 0,
                    sm: "1px solid rgba(226, 232, 240, 0.5)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  STOCKAGE
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 152, 0, 0.15)",
                      width: 48,
                      height: 48,
                      mb: 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <HardDrive size={26} color="#F59E0B" />
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#F59E0B"
                    fontSize="0.875rem"
                  >
                    {systemInfo.totalStorage}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          </Grid>

          {/* Models - Design modernisé */}
          <Grid item xs={4} sm={4}>
            <Tooltip
              title="Nombre de modèles actifs comparé au nombre total de modèles installés"
              arrow
              placement="top"
            >
              <Box sx={{ p: 1.5, textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  MODÈLES
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "rgba(37, 99, 235, 0.15)",
                      width: 48,
                      height: 48,
                      mb: 1,
                    }}
                  >
                    <Cpu size={26} color="#2563EB" />
                  </Avatar>

                  {/* Affichage modernisé des modèles actifs/total */}
                  <Box sx={{ width: "100%", mb: 0.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="#2563EB"
                      >
                        {systemInfo.runningModels} actifs
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={500}
                        color="text.secondary"
                      >
                        {systemInfo.modelCount} total
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={
                        (systemInfo.runningModels /
                          Math.max(1, systemInfo.modelCount)) *
                        100
                      }
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#2563EB",
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Fade>
  );
}
