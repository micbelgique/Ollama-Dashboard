"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import {
  MessageSquare,
  Eye,
  Network,
  Download,
  AlertTriangle,
} from "lucide-react";
import { installModel, fetchModels } from "@/services/ollamaService";
import type { Model } from "@models/ollama";
import { eventBus } from "@/utils/eventBus";

// Modèles suggérés par catégorie avec leurs tailles
const SUGGESTED_CHAT_MODELS = [
  { name: "phi4:latest", size: "9.1GB" },
  { name: "mistral:latest", size: "4.1GB" },
  { name: "phi3:latest", size: "2.2GB" },
  { name: "llama3.2:latest", size: "2.0GB" },
  { name: "deepseek-r1:7b", size: "4.7GB" },
];

// Modèles suggérés avec capacités vision et leurs tailles
const SUGGESTED_VISION_MODELS = [
  { name: "llava:7b", size: "4.7GB" },
  { name: "minicpm-v:8b", size: "5.5GB" },
  { name: "llama3.2-vision:11b", size: "7.9GB" },
];

// Modèles d'embeddings et leurs tailles
const SUGGESTED_EMBEDDING_MODELS = [
  { name: "mxbai-embed-large:latest", size: "670MB" },
  { name: "nomic-embed-text:latest", size: "274MB" },
];

export default function ModelInstaller() {
  const theme = useTheme();
  const [modelName, setModelName] = useState("");
  const [isInsecure, setIsInsecure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [installedModels, setInstalledModels] = useState<Model[]>([]);
  const [progress, setProgress] = useState<{
    total: number;
    completed: number;
    percentage: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch installed models on component mount
  useEffect(() => {
    const loadInstalledModels = async () => {
      try {
        const models = await fetchModels();
        setInstalledModels(models);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des modèles installés:",
          error
        );
      }
    };

    loadInstalledModels();

    // Écouter l'événement de suppression
    const unsubscribe = eventBus.on("modelDeleted", loadInstalledModels);

    // Se désabonner lors du démontage du composant
    return () => unsubscribe();
  }, []);

  // Filtrer les modèles de chat déjà installés
  const filteredChatModels = SUGGESTED_CHAT_MODELS.filter((suggestedModel) => {
    const suggestedModelName = suggestedModel.name.split(":")[0];
    return !installedModels.some(
      (installedModel) =>
        installedModel.name.startsWith(suggestedModelName + ":") ||
        installedModel.name === suggestedModel.name
    );
  });

  // Filtrer les modèles de vision déjà installés
  const filteredVisionModels = SUGGESTED_VISION_MODELS.filter(
    (suggestedModel) => {
      const suggestedModelName = suggestedModel.name.split(":")[0];
      return !installedModels.some(
        (installedModel) =>
          installedModel.name.startsWith(suggestedModelName + ":") ||
          installedModel.name === suggestedModel.name
      );
    }
  );

  // Filtrer les modèles d'embedding déjà installés
  const filteredEmbeddingModels = SUGGESTED_EMBEDDING_MODELS.filter(
    (suggestedModel) => {
      const suggestedModelName = suggestedModel.name.split(":")[0];
      return !installedModels.some(
        (installedModel) =>
          installedModel.name.startsWith(suggestedModelName + ":") ||
          installedModel.name === suggestedModel.name
      );
    }
  );

  const handleInstallClick = async () => {
    if (!modelName.trim()) {
      alert("Veuillez entrer un nom de modèle");
      return;
    }

    setIsLoading(true);
    setStatus("Démarrage de l'installation...");
    setProgress(null);

    try {
      await installModel(modelName, isInsecure, (status, progressData) => {
        setStatus(status);

        if (progressData) {
          const percentage = Math.round(
            (progressData.completed / progressData.total) * 100
          );
          setProgress({
            total: progressData.total,
            completed: progressData.completed,
            percentage: percentage,
          });
        } else {
          setProgress(null);
        }

        if (status === "success") {
          setTimeout(() => {
            setIsLoading(false);
            setStatus("Installation terminée! Actualisation...");

            // Ajouter un délai avant le rafraîchissement pour que l'utilisateur
            // puisse voir le message de succès
            setTimeout(() => {
              window.location.reload(); // Rafraîchit la page entière
            }, 2000);
          }, 1000);
        }
      });
    } catch (error) {
      console.error("Erreur:", error);
      setStatus("Échec de l'installation");
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 600,
          background: "linear-gradient(to right, #4AA9FF, #2563EB)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Installer un modèle
      </Typography>

      {/* Tabs for model categories */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <Tab
          label="Modèles de chat"
          icon={<MessageSquare size={16} />}
          iconPosition="start"
          sx={{
            textTransform: "none",
            minHeight: 48,
            fontWeight: 500,
          }}
        />
        <Tab
          label="Modèles avec vision"
          icon={<Eye size={16} />}
          iconPosition="start"
          sx={{
            textTransform: "none",
            minHeight: 48,
            fontWeight: 500,
          }}
        />
        <Tab
          label="Modèles d'embeddings"
          icon={<Network size={16} />}
          iconPosition="start"
          sx={{
            textTransform: "none",
            minHeight: 48,
            fontWeight: 500,
          }}
        />
      </Tabs>

      {/* Tab panels */}
      <Box sx={{ mb: 4 }}>
        {/* Chat models */}
        <Box role="tabpanel" hidden={activeTab !== 0}>
          {filteredChatModels.length > 0 ? (
            <Grid container spacing={2}>
              {filteredChatModels.map((model) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={model.name}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor:
                        modelName === model.name
                          ? "primary.main"
                          : "rgba(226, 232, 240, 0.5)",
                      boxShadow:
                        modelName === model.name
                          ? "0 0 0 2px rgba(74, 169, 255, 0.2)"
                          : "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => setModelName(model.name)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            p: 0.75,
                            borderRadius: 1,
                            bgcolor: "primary.lighter",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MessageSquare
                            size={16}
                            color={theme.palette.primary.main}
                          />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {model.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={model.size}
                        size="small"
                        sx={{
                          bgcolor: "rgba(74, 169, 255, 0.1)",
                          color: "primary.main",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
              <Typography>
                Tous les modèles de chat suggérés sont déjà installés
              </Typography>
            </Box>
          )}
        </Box>

        {/* Vision models */}
        <Box role="tabpanel" hidden={activeTab !== 1}>
          {filteredVisionModels.length > 0 ? (
            <Grid container spacing={2}>
              {filteredVisionModels.map((model) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={model.name}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor:
                        modelName === model.name
                          ? "secondary.main"
                          : "rgba(226, 232, 240, 0.5)",
                      boxShadow:
                        modelName === model.name
                          ? "0 0 0 2px rgba(255, 77, 106, 0.2)"
                          : "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "secondary.main",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => setModelName(model.name)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            p: 0.75,
                            borderRadius: 1,
                            bgcolor: "secondary.lighter",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Eye size={16} color={theme.palette.secondary.main} />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {model.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={model.size}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255, 77, 106, 0.1)",
                          color: "secondary.main",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
              <Typography>
                Tous les modèles de vision suggérés sont déjà installés
              </Typography>
            </Box>
          )}
        </Box>

        {/* Embedding models */}
        <Box role="tabpanel" hidden={activeTab !== 2}>
          {filteredEmbeddingModels.length > 0 ? (
            <Grid container spacing={2}>
              {filteredEmbeddingModels.map((model) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={model.name}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor:
                        modelName === model.name
                          ? "warning.main"
                          : "rgba(226, 232, 240, 0.5)",
                      boxShadow:
                        modelName === model.name
                          ? "0 0 0 2px rgba(245, 158, 11, 0.2)"
                          : "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "warning.main",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => setModelName(model.name)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            p: 0.75,
                            borderRadius: 1,
                            bgcolor: "warning.lighter",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Network
                            size={16}
                            color={theme.palette.warning.main}
                          />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {model.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={model.size}
                        size="small"
                        sx={{
                          bgcolor: "rgba(245, 158, 11, 0.1)",
                          color: "warning.main",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
              <Typography>
                Tous les modèles d'embeddings suggérés sont déjà installés
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Installation personnalisée
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom du modèle"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="ex: llama3:latest"
              disabled={isLoading}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isInsecure}
                  onChange={(e) => setIsInsecure(e.target.checked)}
                  disabled={isLoading}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AlertTriangle size={16} color={theme.palette.warning.main} />
                  <Typography variant="body2">
                    Insecure (ignorer SSL)
                  </Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          disabled={isLoading || !modelName.trim()}
          onClick={handleInstallClick}
          startIcon={<Download size={16} />}
          sx={{
            background: "linear-gradient(to right, #4AA9FF, #2563EB)",
            boxShadow: "0 4px 14px 0 rgba(74, 169, 255, 0.39)",
            "&:hover": {
              background: "linear-gradient(to right, #2563EB, #1D4ED8)",
              boxShadow: "0 6px 20px 0 rgba(74, 169, 255, 0.5)",
            },
            "&:disabled": {
              background: "rgba(226, 232, 240, 0.8)",
              color: "rgba(148, 163, 184, 1)",
            },
            borderRadius: 2,
            px: 3,
          }}
        >
          {isLoading ? "Installation..." : "Installer"}
        </Button>
      </Box>

      {status && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "rgba(74, 169, 255, 0.05)",
            borderRadius: 2,
            border: "1px solid rgba(74, 169, 255, 0.1)",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {status}
          </Typography>

          {progress && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "rgba(226, 232, 240, 0.5)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: "linear-gradient(to right, #4AA9FF, #2563EB)",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1, textAlign: "right" }}
              >
                {formatSize(progress.completed)} / {formatSize(progress.total)}{" "}
                ({progress.percentage}%)
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
