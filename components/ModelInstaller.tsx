"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Fade,
  Link,
} from "@mui/material";
import {
  MessageSquare,
  Eye,
  Network,
  ArrowRight,
  Download,
  Library,
  BookOpen,
  FileText,
  X,
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
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [installedModels, setInstalledModels] = useState<Model[]>([]);
  const [progress, setProgress] = useState<{
    total: number;
    completed: number;
    percentage: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    if (!modelName.trim()) return;

    setIsLoading(true);
    setStatus("Démarrage de l'installation...");
    setProgress(null);
    setIsCancelling(false);

    // Créer un nouveau contrôleur d'annulation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await installModel(
        modelName,
        false,
        (status, progressData) => {
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
              abortControllerRef.current = null;

              // Ajouter un délai avant le rafraîchissement
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }, 1000);
          } else if (status === "Téléchargement annulé") {
            setTimeout(() => {
              setIsLoading(false);
              setIsCancelling(false);
              abortControllerRef.current = null;

              // Permettre à l'utilisateur de voir le message d'annulation
              setTimeout(() => {
                setStatus("");
              }, 2000);
            }, 500);
          }
        },
        controller.signal // Passer le signal au service
      );
    } catch (error: any) {
      console.error("Erreur:", error);

      if (isCancelling) {
        setStatus("Téléchargement annulé");
      } else {
        setStatus("Échec de l'installation");
      }

      setIsLoading(false);
      setIsCancelling(false);
      abortControllerRef.current = null;
    }
  };

  // Nouvelle fonction pour gérer l'annulation
  const handleCancelDownload = () => {
    if (!abortControllerRef.current || isCancelling) return;

    setIsCancelling(true);
    setStatus("Annulation du téléchargement...");

    // Déclencher l'annulation
    abortControllerRef.current.abort();
  };

  // Nettoyer le contrôleur lors du démontage du composant
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Obtenir le nom de base du modèle pour le lien
  const getBaseModelName = (modelName: string) => {
    return modelName.split(":")[0];
  };

  // Fonction pour obtenir le style basé sur le type de modèle
  const getModelStyle = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: // Chat
        return {
          icon: <MessageSquare size={20} color="#fff" />,
          smallIcon: (
            <MessageSquare size={16} color={theme.palette.primary.main} />
          ),
          color: theme.palette.primary.main,
          gradient: "linear-gradient(135deg, #4AA9FF, #2563EB)",
          lightBg: "rgba(74, 169, 255, 0.1)",
          hoverGradient: "linear-gradient(to right, #2563EB, #1D4ED8)",
          shadowColor: "rgba(74, 169, 255, 0.39)",
          hoverShadowColor: "rgba(74, 169, 255, 0.5)",
          borderColor: "primary.main",
          chipBg: "rgba(74, 169, 255, 0.1)",
          chipColor: "primary.main",
        };
      case 1: // Vision - Rouge
        return {
          icon: <Eye size={20} color="#fff" />,
          smallIcon: <Eye size={16} color="#E11D48" />,
          color: "#E11D48",
          gradient: "linear-gradient(135deg, #FF4D6A, #E11D48)",
          lightBg: "rgba(255, 77, 106, 0.1)",
          hoverGradient: "linear-gradient(to right, #E11D48, #BE123C)",
          shadowColor: "rgba(255, 77, 106, 0.39)",
          hoverShadowColor: "rgba(255, 77, 106, 0.5)",
          borderColor: "#E11D48",
          chipBg: "rgba(255, 77, 106, 0.1)",
          chipColor: "#E11D48",
        };
      case 2: // Embeddings
        return {
          icon: <Network size={20} color="#fff" />,
          smallIcon: <Network size={16} color={theme.palette.warning.main} />,
          color: theme.palette.warning.main,
          gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
          lightBg: "rgba(245, 158, 11, 0.1)",
          hoverGradient: "linear-gradient(to right, #D97706, #B45309)",
          shadowColor: "rgba(245, 158, 11, 0.39)",
          hoverShadowColor: "rgba(245, 158, 11, 0.5)",
          borderColor: "warning.main",
          chipBg: "rgba(245, 158, 11, 0.1)",
          chipColor: "warning.main",
        };
      default:
        return getModelStyle(0);
    }
  };

  const currentStyle = getModelStyle(activeTab);
  const noAvailableModels =
    (activeTab === 0 && filteredChatModels.length === 0) ||
    (activeTab === 1 && filteredVisionModels.length === 0) ||
    (activeTab === 2 && filteredEmbeddingModels.length === 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header avec le lien vers la bibliothèque Ollama */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: currentStyle.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
          >
            <Library size={20} color="#fff" />
          </Box>
          <Typography
            variant="h6"
            component="div"
            fontWeight={700}
            sx={{
              color: currentStyle.color,
              transition: "color 0.3s ease",
            }}
          >
            Modèles disponibles
          </Typography>
        </Box>

        <Link
          href="https://ollama.com/library"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            color: currentStyle.color,
            fontSize: "0.875rem",
            fontWeight: 600,
            transition: "all 0.2s",
            p: 0.75,
            px: 1.2,
            borderRadius: 2,
            border: `1px solid ${currentStyle.color}20`,
            "&:hover": {
              backgroundColor: `${currentStyle.color}10`,
              boxShadow: `0 2px 8px ${currentStyle.shadowColor}`,
              transform: "translateY(-2px)",
            },
          }}
        >
          <BookOpen size={15} strokeWidth={2} />
          Bibliothèque complète
        </Link>
      </Box>

      {/* Tabs for model categories */}
      <Box
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: currentStyle.color,
              height: 3,
              borderRadius: "3px 3px 0 0",
              transition: "background-color 0.3s ease",
            },
            "& .MuiTab-root": {
              transition: "all 0.3s ease",
              "&.Mui-selected": {
                "& svg": {
                  color: "inherit",
                  transition: "color 0.3s ease",
                },
              },
            },
          }}
        >
          {/* Onglet Chat */}
          <Tab
            label={
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: activeTab === 0 ? 600 : 500,
                  color:
                    activeTab === 0 ? getModelStyle(0).color : "text.secondary",
                  transition: "all 0.3s ease",
                }}
              >
                Chat
              </Typography>
            }
            icon={
              <MessageSquare
                size={18}
                color={
                  activeTab === 0 ? getModelStyle(0).color : "currentColor"
                }
                style={{ transition: "color 0.3s ease" }}
              />
            }
            iconPosition="start"
            sx={{
              textTransform: "none",
              minHeight: 48,
              fontWeight: 600,
              color:
                activeTab === 0 ? getModelStyle(0).color : "text.secondary",
              transition: "color 0.3s ease",
              "&:hover": {
                color: activeTab !== 0 ? "text.primary" : undefined,
              },
            }}
          />

          {/* Onglet Vision */}
          <Tab
            label={
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: activeTab === 1 ? 600 : 500,
                  color:
                    activeTab === 1 ? getModelStyle(1).color : "text.secondary",
                  transition: "all 0.3s ease",
                }}
              >
                Vision
              </Typography>
            }
            icon={
              <Eye
                size={18}
                color={
                  activeTab === 1 ? getModelStyle(1).color : "currentColor"
                }
                style={{ transition: "color 0.3s ease" }}
              />
            }
            iconPosition="start"
            sx={{
              textTransform: "none",
              minHeight: 48,
              fontWeight: 600,
              color:
                activeTab === 1 ? getModelStyle(1).color : "text.secondary",
              transition: "color 0.3s ease",
              "&:hover": {
                color: activeTab !== 1 ? "text.primary" : undefined,
              },
            }}
          />

          {/* Onglet Embeddings */}
          <Tab
            label={
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: activeTab === 2 ? 600 : 500,
                  color:
                    activeTab === 2 ? getModelStyle(2).color : "text.secondary",
                  transition: "all 0.3s ease",
                }}
              >
                Embeddings
              </Typography>
            }
            icon={
              <Network
                size={18}
                color={
                  activeTab === 2 ? getModelStyle(2).color : "currentColor"
                }
                style={{ transition: "color 0.3s ease" }}
              />
            }
            iconPosition="start"
            sx={{
              textTransform: "none",
              minHeight: 48,
              fontWeight: 600,
              color:
                activeTab === 2 ? getModelStyle(2).color : "text.secondary",
              transition: "color 0.3s ease",
              "&:hover": {
                color: activeTab !== 2 ? "text.primary" : undefined,
              },
            }}
          />
        </Tabs>
      </Box>

      {/* Tab panels */}
      <Box sx={{ mb: 4, minHeight: 300 }}>
        {/* Chat models */}
        <Fade in={activeTab === 0} timeout={500}>
          <Box role="tabpanel" hidden={activeTab !== 0} sx={{ height: "100%" }}>
            {filteredChatModels.length > 0 ? (
              <Grid container spacing={2.5}>
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
                            : "0 2px 8px rgba(0, 0, 0, 0.02)",
                        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        "&:hover": {
                          borderColor: "primary.main",
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 20px rgba(0, 0, 0, 0.06)",
                        },
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        background:
                          modelName === model.name
                            ? "rgba(74, 169, 255, 0.05)"
                            : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                      }}
                      onClick={() => setModelName(model.name)}
                    >
                      {modelName === model.name && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: getModelStyle(0).gradient,
                          }}
                        />
                      )}
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              p: 0.9,
                              borderRadius: 1.5,
                              background:
                                modelName === model.name
                                  ? getModelStyle(0).gradient
                                  : "primary.lighter",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                          >
                            {modelName === model.name ? (
                              <MessageSquare size={16} color="#fff" />
                            ) : (
                              <MessageSquare
                                size={16}
                                color={theme.palette.primary.main}
                              />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.2,
                              flex: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{
                                lineHeight: 1.2,
                                color:
                                  modelName === model.name
                                    ? currentStyle.color
                                    : "text.primary",
                                transition: "color 0.3s ease",
                              }}
                            >
                              {model.name}
                            </Typography>
                            <Link
                              href={`https://ollama.com/library/${getBaseModelName(
                                model.name
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                fontSize: "0.7rem",
                                color: "text.secondary",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                                width: "fit-content",
                                transition: "all 0.2s",
                                p: 0.2,
                                px: 0.5,
                                borderRadius: 0.5,
                                "&:hover": {
                                  backgroundColor: "rgba(74, 169, 255, 0.08)",
                                  color: "primary.main",
                                },
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText size={11} />
                              Documentation
                            </Link>
                          </Box>
                        </Box>
                        <Chip
                          label={model.size}
                          size="small"
                          sx={{
                            bgcolor: "rgba(74, 169, 255, 0.1)",
                            color: "primary.main",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            height: 24,
                            borderRadius: 1,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  color: "text.secondary",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <MessageSquare
                  size={40}
                  color={currentStyle.color}
                  opacity={0.5}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: currentStyle.color,
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  Tous les modèles de chat suggérés sont déjà installés
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>

        {/* Vision models */}
        <Fade in={activeTab === 1} timeout={500}>
          <Box role="tabpanel" hidden={activeTab !== 1} sx={{ height: "100%" }}>
            {filteredVisionModels.length > 0 ? (
              <Grid container spacing={2.5}>
                {filteredVisionModels.map((model) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={model.name}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor:
                          modelName === model.name
                            ? "#E11D48"
                            : "rgba(226, 232, 240, 0.5)",
                        boxShadow:
                          modelName === model.name
                            ? "0 0 0 2px rgba(255, 77, 106, 0.2)"
                            : "0 2px 8px rgba(0, 0, 0, 0.02)",
                        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        "&:hover": {
                          borderColor: "#E11D48",
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 20px rgba(0, 0, 0, 0.06)",
                        },
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        background:
                          modelName === model.name
                            ? "rgba(255, 77, 106, 0.05)"
                            : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                      }}
                      onClick={() => setModelName(model.name)}
                    >
                      {modelName === model.name && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: getModelStyle(1).gradient,
                          }}
                        />
                      )}
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              p: 0.9,
                              borderRadius: 1.5,
                              background:
                                modelName === model.name
                                  ? getModelStyle(1).gradient
                                  : "rgba(255, 77, 106, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                          >
                            {modelName === model.name ? (
                              <Eye size={16} color="#fff" />
                            ) : (
                              <Eye size={16} color="#E11D48" />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.2,
                              flex: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{
                                lineHeight: 1.2,
                                color:
                                  modelName === model.name
                                    ? currentStyle.color
                                    : "text.primary",
                                transition: "color 0.3s ease",
                              }}
                            >
                              {model.name}
                            </Typography>
                            <Link
                              href={`https://ollama.com/library/${getBaseModelName(
                                model.name
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                fontSize: "0.7rem",
                                color: "text.secondary",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                                width: "fit-content",
                                transition: "all 0.2s",
                                p: 0.2,
                                px: 0.5,
                                borderRadius: 0.5,
                                "&:hover": {
                                  backgroundColor: "rgba(255, 77, 106, 0.08)",
                                  color: "#E11D48",
                                },
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText size={11} />
                              Documentation
                            </Link>
                          </Box>
                        </Box>
                        <Chip
                          label={model.size}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255, 77, 106, 0.1)",
                            color: "#E11D48",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            height: 24,
                            borderRadius: 1,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  color: "text.secondary",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Eye size={40} color={currentStyle.color} opacity={0.5} />
                <Typography
                  variant="body1"
                  sx={{
                    color: currentStyle.color,
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  Tous les modèles de vision suggérés sont déjà installés
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>

        {/* Embedding models */}
        <Fade in={activeTab === 2} timeout={500}>
          <Box role="tabpanel" hidden={activeTab !== 2} sx={{ height: "100%" }}>
            {filteredEmbeddingModels.length > 0 ? (
              <Grid container spacing={2.5}>
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
                            : "0 2px 8px rgba(0, 0, 0, 0.02)",
                        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        "&:hover": {
                          borderColor: "warning.main",
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 20px rgba(0, 0, 0, 0.06)",
                        },
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        background:
                          modelName === model.name
                            ? "rgba(245, 158, 11, 0.05)"
                            : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                      }}
                      onClick={() => setModelName(model.name)}
                    >
                      {modelName === model.name && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: getModelStyle(2).gradient,
                          }}
                        />
                      )}
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              p: 0.9,
                              borderRadius: 1.5,
                              background:
                                modelName === model.name
                                  ? getModelStyle(2).gradient
                                  : "warning.lighter",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                          >
                            {modelName === model.name ? (
                              <Network size={16} color="#fff" />
                            ) : (
                              <Network
                                size={16}
                                color={theme.palette.warning.main}
                              />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.2,
                              flex: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{
                                lineHeight: 1.2,
                                color:
                                  modelName === model.name
                                    ? currentStyle.color
                                    : "text.primary",
                                transition: "color 0.3s ease",
                              }}
                            >
                              {model.name}
                            </Typography>
                            <Link
                              href={`https://ollama.com/library/${getBaseModelName(
                                model.name
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                fontSize: "0.7rem",
                                color: "text.secondary",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                                width: "fit-content",
                                transition: "all 0.2s",
                                p: 0.2,
                                px: 0.5,
                                borderRadius: 0.5,
                                "&:hover": {
                                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                                  color: "warning.main",
                                },
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText size={11} />
                              Documentation
                            </Link>
                          </Box>
                        </Box>
                        <Chip
                          label={model.size}
                          size="small"
                          sx={{
                            bgcolor: "rgba(245, 158, 11, 0.1)",
                            color: "warning.main",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            height: 24,
                            borderRadius: 1,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  color: "text.secondary",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Network size={40} color={currentStyle.color} opacity={0.5} />
                <Typography
                  variant="body1"
                  sx={{
                    color: currentStyle.color,
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  Tous les modèles d'embeddings suggérés sont déjà installés
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Box>

      {/* Installation button and status */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Ne montrer le bouton que s'il y a des modèles disponibles */}
        {!noAvailableModels && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              disabled={isLoading || !modelName.trim()}
              onClick={handleInstallClick}
              endIcon={
                isLoading || !modelName.trim() ? null : (
                  <ArrowRight size={16} color="#ffffff" />
                )
              }
              startIcon={
                isLoading ? null : <Download size={16} color="#ffffff" />
              }
              sx={{
                background: currentStyle.gradient,
                color: "#ffffff",
                boxShadow: `0 4px 14px 0 ${currentStyle.shadowColor}`,
                "&:hover": {
                  background: currentStyle.hoverGradient,
                  boxShadow: `0 6px 20px 0 ${currentStyle.hoverShadowColor}`,
                },
                "&:disabled": {
                  background: "rgba(226, 232, 240, 0.8)",
                  color: "rgba(148, 163, 184, 1)",
                },
                borderRadius: 2,
                px: 3,
                py: 1.2,
                fontSize: "0.95rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
                transition: "all 0.3s ease",
              }}
            >
              {isLoading
                ? "Installation en cours..."
                : !modelName.trim()
                ? "Sélectionnez un modèle"
                : `Installer ${modelName}`}
            </Button>
          </Box>
        )}

        {status && (
          <Fade in={!!status}>
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 3,
                bgcolor: currentStyle.lightBg,
                borderRadius: 2,
                border: `1px solid ${currentStyle.color}20`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: currentStyle.color,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.95rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  {currentStyle.smallIcon}
                  {status}
                </Typography>

                {/* Bouton d'annulation - uniquement visible pendant un téléchargement actif */}
                {isLoading && progress && !isCancelling && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCancelDownload}
                    startIcon={<X size={14} />}
                    sx={{
                      minWidth: "auto",
                      fontSize: "0.75rem",
                      py: 0.3,
                      px: 1.2,
                      borderRadius: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: `${currentStyle.color}40`,
                      color: currentStyle.color,
                      backgroundColor: `${currentStyle.color}08`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: `${currentStyle.color}15`,
                        borderColor: currentStyle.color,
                        transform: "translateY(-1px)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    Annuler
                  </Button>
                )}
              </Box>

              {progress && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress.percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "rgba(226, 232, 240, 0.5)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                        background: isCancelling
                          ? "linear-gradient(135deg, #9ca3af, #4b5563)"
                          : currentStyle.gradient,
                        backgroundSize: "200% 200%",
                        animation: isCancelling
                          ? "none"
                          : "gradientShift 2s ease infinite",
                        "@keyframes gradientShift": {
                          "0%": { backgroundPosition: "0% 50%" },
                          "50%": { backgroundPosition: "100% 50%" },
                          "100%": { backgroundPosition: "0% 50%" },
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1.5,
                      opacity: isCancelling ? 0.7 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isCancelling
                          ? "text.secondary"
                          : currentStyle.color,
                        fontWeight: 600,
                      }}
                    >
                      {isCancelling
                        ? "Annulation..."
                        : `${progress.percentage}%`}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isCancelling
                          ? "text.secondary"
                          : currentStyle.color,
                        fontWeight: 500,
                      }}
                    >
                      {formatSize(progress.completed)} /{" "}
                      {formatSize(progress.total)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Fade>
        )}
      </Box>
    </Paper>
  );
}
