"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Trash2,
  MessageSquare,
  Eye,
  Network,
  Info,
  HardDrive,
} from "lucide-react";
import {
  fetchModels,
  deleteModel,
  fetchRunningModels,
} from "@/services/ollamaService";
import type { Model, RunningModel } from "@models/ollama";
import { eventBus } from "@/utils/eventBus";
import ModelDetailsView from "@/components/ModelDetailsView";

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

// Fonction pour déterminer la taille d'un modèle basé sur son nom
const getModelSize = (modelName: string): number => {
  // Extraire le nom de base du modèle (avant le ":")
  const baseName = modelName.split(":")[0];

  // Trouver la correspondance la plus proche dans notre map de tailles
  for (const [key, size] of Object.entries(MODEL_SIZES)) {
    if (baseName.includes(key)) {
      return size;
    }
  }

  return 0; // Taille inconnue
};

// Fonction pour déterminer le type de modèle
const getModelType = (modelName: string): "Chat" | "Vision" | "Embeddings" => {
  const baseName = modelName.toLowerCase();

  if (
    baseName.includes("llava") ||
    baseName.includes("vision") ||
    baseName.includes("minicpm-v")
  ) {
    return "Vision";
  } else if (baseName.includes("embed")) {
    return "Embeddings";
  } else {
    return "Chat";
  }
};

export default function ModelList() {
  const theme = useTheme();
  const [models, setModels] = useState<Model[]>([]);
  const [runningModels, setRunningModels] = useState<RunningModel[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadModels = async () => {
    setIsLoading(true);
    try {
      const modelList = await fetchModels();
      setModels(modelList);
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRunningModels = async () => {
    try {
      const running = await fetchRunningModels();
      setRunningModels(running);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des modèles en cours d'exécution:",
        error
      );
    }
  };

  useEffect(() => {
    loadModels();
    loadRunningModels();

    // Actualiser la liste des modèles en cours d'exécution toutes les 5 secondes
    const interval = setInterval(loadRunningModels, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteModel = async (modelName: string) => {
    if (window.confirm(`Supprimer le modèle "${modelName}" ?`)) {
      setIsDeleting(true);

      try {
        await deleteModel(modelName);
        await loadModels(); // Refresh the list
        eventBus.emit("modelDeleted"); // Émettre l'événement
      } catch (error) {
        console.error("Erreur de suppression:", error);
        alert("Échec de suppression");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleViewDetails = (modelName: string) => {
    setSelectedModel(modelName);
    setIsDetailsOpen(true);
  };

  // Calculer l'espace total utilisé
  const totalSpaceUsed = models.reduce((sum, model) => {
    return sum + getModelSize(model.name);
  }, 0);

  // Get style based on model type
  const getModelStyle = (modelType: "Chat" | "Vision" | "Embeddings") => {
    switch (modelType) {
      case "Chat":
        return {
          icon: <MessageSquare size={20} color="#fff" />,
          color: theme.palette.primary.main,
          gradient: "linear-gradient(135deg, #4AA9FF, #2563EB)",
          lightBg: theme.palette.primary.lighter,
        };
      case "Vision":
        return {
          icon: <Eye size={20} color="#fff" />,
          color: theme.palette.secondary.main,
          gradient: "linear-gradient(135deg, #FF4D6A, #E11D48)",
          lightBg: theme.palette.secondary.lighter,
        };
      case "Embeddings":
        return {
          icon: <Network size={20} color="#fff" />,
          color: theme.palette.warning.main,
          gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
          lightBg: theme.palette.warning.lighter,
        };
      default:
        return {
          icon: <MessageSquare size={20} color="#fff" />,
          color: theme.palette.primary.main,
          gradient: "linear-gradient(135deg, #4AA9FF, #2563EB)",
          lightBg: theme.palette.primary.lighter,
        };
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            background: "linear-gradient(to right, #4AA9FF, #2563EB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Modèles disponibles
        </Typography>
        <Chip
          icon={<HardDrive size={16} />}
          label={`Espace total utilisé: ${totalSpaceUsed.toFixed(1)}GB`}
          sx={{
            bgcolor: "rgba(74, 169, 255, 0.1)",
            color: "primary.main",
            fontWeight: 500,
            "& .MuiChip-icon": {
              color: "primary.main",
            },
          }}
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : models.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <Typography>Aucun modèle installé</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {models.map((model) => {
            // Vérifier si le modèle est en cours d'exécution
            const isRunning = runningModels.some(
              (rm) => rm.name === model.name
            );
            const modelSize = getModelSize(model.name);
            const modelType = getModelType(model.name);
            const modelStyle = getModelStyle(modelType);

            return (
              <Grid item xs={12} md={6} lg={4} key={model.digest}>
                <Card
                  sx={{
                    position: "relative",
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid",
                    borderColor: "rgba(226, 232, 240, 0.5)",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: modelStyle.gradient,
                    }}
                  />

                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              p: 0.75,
                              borderRadius: 1.5,
                              background: modelStyle.gradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {modelStyle.icon}
                          </Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {model.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {modelSize > 0
                            ? `${modelSize.toFixed(1)}GB`
                            : "Taille inconnue"}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          isRunning ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  height: 8,
                                  width: 8,
                                  borderRadius: "50%",
                                  bgcolor: "white",
                                  mr: 0.75,
                                  animation: "pulse 1.5s infinite",
                                  "@keyframes pulse": {
                                    "0%": { opacity: 0.6 },
                                    "50%": { opacity: 1 },
                                    "100%": { opacity: 0.6 },
                                  },
                                }}
                              />
                              Actif
                            </Box>
                          ) : (
                            "Inactif"
                          )
                        }
                        size="small"
                        sx={{
                          bgcolor: isRunning
                            ? modelStyle.color
                            : "rgba(203, 213, 225, 0.4)",
                          color: isRunning ? "white" : "text.secondary",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Type
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontWeight={500}
                        >
                          {modelType}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Info size={16} />}
                        onClick={() => handleViewDetails(model.name)}
                        sx={{
                          borderColor: `${modelStyle.color}40`,
                          color: modelStyle.color,
                          "&:hover": {
                            bgcolor: modelStyle.lightBg,
                            borderColor: modelStyle.color,
                          },
                        }}
                      >
                        Détails
                      </Button>
                      <Tooltip
                        title={
                          isRunning
                            ? "Impossible de supprimer un modèle en cours d'exécution"
                            : ""
                        }
                      >
                        <span>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Trash2 size={16} />}
                            onClick={() => handleDeleteModel(model.name)}
                            disabled={isRunning || isDeleting}
                            sx={{
                              borderColor: `${theme.palette.error.main}40`,
                              color: theme.palette.error.main,
                              "&:hover": {
                                bgcolor: theme.palette.error.lighter,
                                borderColor: theme.palette.error.main,
                              },
                              "&.Mui-disabled": {
                                borderColor: "rgba(203, 213, 225, 0.4)",
                                color: "text.disabled",
                              },
                            }}
                          >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Détails du modèle */}
      <Dialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            m: { xs: 1, sm: 2 },
            maxHeight: "calc(100% - 64px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid",
            borderColor: "rgba(226, 232, 240, 0.8)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1.5,
                background: getModelStyle(getModelType(selectedModel || ""))
                  .gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getModelStyle(getModelType(selectedModel || "")).icon}
            </Box>
            <Typography variant="h6" component="span" fontWeight={600}>
              {selectedModel}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {selectedModel && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ mb: 2 }}
                >
                  Détails du modèle
                </Typography>
                <ModelDetailsView model={selectedModel} />
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "rgba(226, 232, 240, 0.8)",
          }}
        >
          <Button
            onClick={() => setIsDetailsOpen(false)}
            variant="contained"
            sx={{
              background: getModelStyle(getModelType(selectedModel || ""))
                .gradient,
              boxShadow: `0 4px 14px 0 ${
                getModelStyle(getModelType(selectedModel || "")).color
              }39`,
              "&:hover": {
                boxShadow: `0 6px 20px 0 ${
                  getModelStyle(getModelType(selectedModel || "")).color
                }50`,
              },
              borderRadius: 2,
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
