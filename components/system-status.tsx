"use client";

import { useState, useEffect } from "react";
import { Server, Activity, HardDrive } from "lucide-react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Tooltip,
  useTheme,
  Paper,
  Fade,
} from "@mui/material";
import { fetchRunningModels, fetchModels } from "@/services/ollamaService";

// Map des tailles de modèles par nom (imported from ModelList)
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

// Fonction pour déterminer la taille d'un modèle basé sur son nom (imported from ModelList)
interface ModelSizes {
  [key: string]: number;
}

const getModelSize = (modelName: string): number => {
  // Extraire le nom de base du modèle (avant le ":")
  const baseName: string = modelName.split(":")[0];

  // Trouver la correspondance la plus proche dans notre map de tailles
  for (const [key, size] of Object.entries(MODEL_SIZES as ModelSizes)) {
    if (baseName.includes(key)) {
      return size;
    }
  }

  return 0; // Taille inconnue
};

export function SystemStatus() {
  const theme = useTheme();
  const [isOllamaRunning, setIsOllamaRunning] = useState<boolean | null>(null);
  const [systemInfo, setSystemInfo] = useState({
    memoryUsage: "0 GB",
    modelCount: 0,
    runningModels: 0,
    totalStorage: "0 GB", // Added totalStorage field
  });

  useEffect(() => {
    // Check if Ollama is running by trying to fetch models
    const checkOllamaStatus = async () => {
      try {
        const runningModels = await fetchRunningModels();
        const allModels = await fetchModels();

        setIsOllamaRunning(true);

        // Estimate memory usage based on running models (rough estimate)
        const estimatedMemoryUsage = runningModels.length * 2.5; // Rough estimate of 2.5GB per model

        // Calculate total storage used by all models
        const totalStorageUsed = allModels.reduce((sum, model) => {
          return sum + getModelSize(model.name);
        }, 0);

        setSystemInfo({
          memoryUsage: `${estimatedMemoryUsage.toFixed(1)} GB`,
          modelCount: allModels.length,
          runningModels: runningModels.length,
          totalStorage: `${totalStorageUsed.toFixed(1)} GB`, // Format the storage value
        });
      } catch (error) {
        console.error("Error checking Ollama status:", error);
        setIsOllamaRunning(false);
      }
    };

    checkOllamaStatus();
    const interval = setInterval(checkOllamaStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in={true} timeout={800}>
      <Card
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "rgba(226, 232, 240, 0.5)",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          borderRadius: 2,
          transition: "all 0.3s ease",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            {/* Status Indicator */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  m: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "calc(100% - 16px)",
                  borderRadius: 2,
                  bgcolor: isOllamaRunning
                    ? "rgba(22, 163, 74, 0.05)"
                    : "rgba(220, 38, 38, 0.05)",
                  border: "1px solid",
                  borderColor: isOllamaRunning
                    ? "rgba(22, 163, 74, 0.1)"
                    : "rgba(220, 38, 38, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: isOllamaRunning
                      ? "success.lighter"
                      : "error.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Server
                    size={20}
                    color={
                      isOllamaRunning
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={600}
                  >
                    Statut du serveur
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: isOllamaRunning
                          ? "success.main"
                          : "error.main",
                        animation: isOllamaRunning
                          ? "pulse 1.5s infinite"
                          : "none",
                        "@keyframes pulse": {
                          "0%": { opacity: 0.6 },
                          "50%": { opacity: 1 },
                          "100%": { opacity: 0.6 },
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: isOllamaRunning ? "success.main" : "error.main",
                        fontWeight: 500,
                      }}
                    >
                      {isOllamaRunning
                        ? "Ollama est en cours d'exécution"
                        : "Ollama est arrêté"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Storage Usage */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  m: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "calc(100% - 16px)",
                  borderRadius: 2,
                  bgcolor: "rgba(245, 158, 11, 0.05)",
                  border: "1px solid rgba(245, 158, 11, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "warning.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HardDrive size={20} color={theme.palette.warning.main} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={600}
                  >
                    Stockage
                  </Typography>
                  <Tooltip
                    title="Espace disque utilisé par tous les modèles"
                    arrow
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {systemInfo.totalStorage} utilisés
                    </Typography>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>

            {/* Model Stats */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  m: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "calc(100% - 16px)",
                  borderRadius: 2,
                  bgcolor: "rgba(74, 169, 255, 0.05)",
                  border: "1px solid rgba(74, 169, 255, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Activity size={20} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={600}
                  >
                    Modèles
                  </Typography>
                  <Tooltip title="Modèles actifs / total des modèles" arrow>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      <Box
                        component="span"
                        sx={{ color: "success.main", fontWeight: 500 }}
                      >
                        {systemInfo.runningModels}
                      </Box>{" "}
                      actifs / {systemInfo.modelCount} total
                    </Typography>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
}
