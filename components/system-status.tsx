"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Fade,
  Grid,
  Tooltip,
  Avatar,
} from "@mui/material";
import { fetchRunningModels, fetchModels } from "@/services/ollamaService";
// Import improved icons
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import SdStorageRoundedIcon from "@mui/icons-material/SdStorageRounded";

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
  // Removed unused isLoading state

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
          {/* Status */}
          <Grid item xs={4} sm={4}>
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
                      ? "rgba(46, 204, 113, 0.15)"
                      : "rgba(231, 76, 60, 0.15)",
                    width: 48,
                    height: 48,
                    mb: 1,
                  }}
                >
                  {isOllamaRunning ? (
                    <CloudDoneRoundedIcon
                      sx={{
                        color: "success.main",
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
                        color: "error.main",
                        fontSize: 28,
                      }}
                    />
                  )}
                </Avatar>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isOllamaRunning ? "success.main" : "error.main",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {isOllamaRunning ? "En ligne" : "Hors ligne"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Storage - Modernized */}
          <Grid item xs={4} sm={4}>
            <Tooltip
              title="Espace disque utilisé par tous les modèles"
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
                      bgcolor: "rgba(246, 185, 59, 0.15)",
                      width: 48,
                      height: 48,
                      mb: 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <SdStorageRoundedIcon
                      sx={{
                        color: "warning.dark",
                        fontSize: 26,
                      }}
                    />
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="warning.dark"
                    fontSize="0.875rem"
                  >
                    {systemInfo.totalStorage}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          </Grid>

          {/* Models */}
          <Grid item xs={4} sm={4}>
            <Tooltip
              title="Modèles actifs / total des modèles"
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
                      bgcolor: "rgba(52, 152, 219, 0.15)",
                      width: 48,
                      height: 48,
                      mb: 1,
                    }}
                  >
                    <PrecisionManufacturingRoundedIcon
                      sx={{
                        color: "primary.main",
                        fontSize: 26,
                      }}
                    />
                  </Avatar>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                      size="small"
                      label={systemInfo.runningModels}
                      color="success"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        mr: 0.5,
                        px: 1,
                        fontWeight: 700,
                        borderRadius: 1,
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="text.primary"
                      fontSize="0.875rem"
                    >
                      / {systemInfo.modelCount}
                    </Typography>
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
