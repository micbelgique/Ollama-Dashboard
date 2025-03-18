"use client";

import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Paper,
  Fade,
  Snackbar,
  Alert,
  Slide,
  AlertTitle,
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
  const baseName = modelName.split(":")[0];
  for (const [key, size] of Object.entries(MODEL_SIZES)) {
    if (baseName.includes(key)) {
      return size;
    }
  }
  return 0;
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

function createTransitionProps(type: "fade" | "slide"): {
  component: typeof Fade | typeof Slide;
  props: Record<string, unknown>;
} {
  if (type === "fade") {
    return {
      component: Fade,
      props: { appear: true, timeout: 300 },
    };
  }
  return {
    component: Slide,
    props: { appear: true, direction: "left", timeout: 300 },
  };
}

export default function ModelList() {
  const theme = useTheme();
  const [models, setModels] = useState<Model[]>([]);
  const [runningModels, setRunningModels] = useState<RunningModel[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    const interval = setInterval(loadRunningModels, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteModel = (modelName: string) => {
    setModelToDelete(modelName);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!modelToDelete) return;

    setDeleteDialogOpen(false);
    setIsDeleting(true);
    setDeleteInProgress(modelToDelete);
    const modelToDeleteRef = modelToDelete; // Sauvegarde une référence

    try {
      await deleteModel(modelToDeleteRef);

      // Attendre légèrement pour l'animation
      setTimeout(() => {
        setDeleteSuccess(modelToDeleteRef);

        // Recharger les modèles avant de réinitialiser l'état de suppression
        // pour éviter un rendu erroné
        loadModels().then(() => {
          // Réinitialiser les états
          setIsDeleting(false);
          setDeleteInProgress(null);
          eventBus.emit("modelDeleted");
        });

        // Fermer la notification de succès après 3 secondes
        setTimeout(() => setDeleteSuccess(null), 3000);
      }, 300);
    } catch (error) {
      console.error("Erreur de suppression:", error);
      setIsDeleting(false);
      setDeleteInProgress(null);
      setDeleteError("Une erreur est survenue lors de la suppression");
    }
  };

  const cancelDelete = () => {
    setModelToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleViewDetails = (modelName: string) => {
    setSelectedModel(modelName);
    setIsDetailsOpen(true);
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  // Filtrer les modèles par type
  const chatModels = models.filter(
    (model) => getModelType(model.name) === "Chat"
  );
  const visionModels = models.filter(
    (model) => getModelType(model.name) === "Vision"
  );
  const embeddingModels = models.filter(
    (model) => getModelType(model.name) === "Embeddings"
  );

  // Calculer l'espace utilisé par type
  const getCategorySize = (models: Model[]) => {
    return models.reduce((sum, model) => sum + getModelSize(model.name), 0);
  };

  const chatModelsSize = getCategorySize(chatModels);
  const visionModelsSize = getCategorySize(visionModels);
  const embeddingModelsSize = getCategorySize(embeddingModels);
  const totalSpaceUsed =
    chatModelsSize + visionModelsSize + embeddingModelsSize;

  // Styles par type de modèle
  const getModelStyle = (modelType: "Chat" | "Vision" | "Embeddings") => {
    switch (modelType) {
      case "Chat":
        return {
          icon: <MessageSquare size={20} color="#fff" />,
          smallIcon: <MessageSquare size={16} />,
          color: theme.palette.primary.main,
          gradient: "linear-gradient(135deg, #4AA9FF, #2563EB)",
          lightBg: theme.palette.primary.lighter,
          shadowColor: `${theme.palette.primary.main}40`,
          hoverShadowColor: `${theme.palette.primary.main}60`,
        };
      case "Vision":
        return {
          icon: <Eye size={20} color="#fff" />,
          smallIcon: <Eye size={16} color="#E11D48" />,
          color: "#E11D48", // Remplacé theme.palette.secondary.main par #E11D48
          gradient: "linear-gradient(135deg, #FF4D6A, #E11D48)",
          lightBg: "rgba(255, 77, 106, 0.1)", // Adapté pour correspondre à ModelInstaller
          shadowColor: "rgba(255, 77, 106, 0.39)",
          hoverShadowColor: "rgba(255, 77, 106, 0.5)",
        };
      case "Embeddings":
        return {
          icon: <Network size={20} color="#fff" />,
          smallIcon: <Network size={16} />,
          color: theme.palette.warning.main,
          gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
          lightBg: theme.palette.warning.lighter,
          shadowColor: `${theme.palette.warning.main}40`,
          hoverShadowColor: `${theme.palette.warning.main}60`,
        };
      default:
        return {
          icon: <MessageSquare size={20} color="#fff" />,
          smallIcon: <MessageSquare size={16} />,
          color: theme.palette.primary.main,
          gradient: "linear-gradient(135deg, #4AA9FF, #2563EB)",
          lightBg: theme.palette.primary.lighter,
          shadowColor: `${theme.palette.primary.main}40`,
          hoverShadowColor: `${theme.palette.primary.main}60`,
        };
    }
  };

  // Obtenir le style correspondant à l'onglet actif
  const currentStyle = (() => {
    if (activeTab === 0) return getModelStyle("Chat");
    if (activeTab === 1) return getModelStyle("Vision");
    if (activeTab === 2) return getModelStyle("Embeddings");
    return getModelStyle("Chat");
  })();

  // Fonction pour rendre les modèles d'une catégorie
  const renderModelGrid = (categoryModels: Model[]) => {
    if (categoryModels.length === 0) {
      const modelType =
        activeTab === 0 ? "Chat" : activeTab === 1 ? "Vision" : "Embeddings";
      const style = getModelStyle(modelType);

      return (
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
          {style.icon}
          <Typography
            variant="body1"
            sx={{
              color: style.color,
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            Aucun modèle {modelType.toLowerCase()} installé
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {categoryModels.map((model) => {
          const isRunning = runningModels.some((rm) => rm.name === model.name);
          const modelSize = getModelSize(model.name);
          const modelType = getModelType(model.name);
          const modelStyle = getModelStyle(modelType);

          return (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={`${model.name}-${model.digest}`}
            >
              <Fade
                in={deleteInProgress !== model.name}
                timeout={{ enter: 500, exit: 400 }}
              >
                <Card
                  sx={{
                    position: "relative",
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid",
                    borderColor:
                      deleteInProgress === model.name
                        ? `${theme.palette.error.main}40`
                        : "rgba(226, 232, 240, 0.5)",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition:
                      "all 0.3s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-4px)",
                    },
                    opacity: deleteInProgress === model.name ? 0.6 : 1,
                    transform:
                      deleteInProgress === model.name
                        ? "scale(0.96)"
                        : "scale(1)",
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
                            startIcon={
                              isDeleting && modelToDelete === model.name ? (
                                <CircularProgress
                                  size={14}
                                  sx={{ color: theme.palette.error.main }}
                                />
                              ) : (
                                <Trash2 size={16} />
                              )
                            }
                            onClick={() => handleDeleteModel(model.name)}
                            disabled={isRunning || isDeleting}
                            sx={{
                              borderColor: `${theme.palette.error.main}40`,
                              color: theme.palette.error.main,
                              "&:hover": {
                                bgcolor: theme.palette.error.lighter,
                                borderColor: theme.palette.error.main,
                                transform: "translateY(-2px)",
                              },
                              "&:active": {
                                transform: "translateY(0)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isDeleting && modelToDelete === model.name
                              ? "Suppression..."
                              : "Supprimer"}
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    );
  };

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
              transition: "background 0.3s ease",
            }}
          >
            {currentStyle.icon}
          </Box>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={700}
            sx={{
              color: currentStyle.color,
              transition: "color 0.3s ease",
            }}
          >
            Modèles disponibles
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Chip
            icon={<HardDrive size={16} />}
            label={`Espace utilisé: ${totalSpaceUsed.toFixed(1)}GB`}
            sx={{
              bgcolor: `${currentStyle.color}10`,
              color: currentStyle.color,
              fontWeight: 500,
              transition: "all 0.3s ease",
              "& .MuiChip-icon": {
                color: currentStyle.color,
                transition: "color 0.3s ease",
              },
            }}
          />
        </Box>
      </Box>

      {/* Tabs pour les catégories de modèles */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              minHeight: 48,
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "text.secondary",
              "&.Mui-selected": {
                color: currentStyle.color,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: currentStyle.color,
              height: 3,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MessageSquare size={18} style={{ marginRight: 8 }} />
                <span>Chat ({chatModels.length})</span>
                {chatModels.length > 0 && (
                  <Chip
                    label={`${chatModelsSize.toFixed(1)}GB`}
                    size="small"
                    sx={{
                      ml: 1,
                      height: 18,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: "rgba(74, 169, 255, 0.1)",
                    }}
                  />
                )}
              </Box>
            }
            id="tab-0"
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Eye size={18} style={{ marginRight: 8 }} />
                <span>Vision ({visionModels.length})</span>
                {visionModels.length > 0 && (
                  <Chip
                    label={`${visionModelsSize.toFixed(1)}GB`}
                    size="small"
                    sx={{
                      ml: 1,
                      height: 18,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: "rgba(225, 29, 72, 0.1)",
                    }}
                  />
                )}
              </Box>
            }
            id="tab-1"
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Network size={18} style={{ marginRight: 8 }} />
                <span>Embeddings ({embeddingModels.length})</span>
                {embeddingModels.length > 0 && (
                  <Chip
                    label={`${embeddingModelsSize.toFixed(1)}GB`}
                    size="small"
                    sx={{
                      ml: 1,
                      height: 18,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: "rgba(245, 158, 11, 0.1)",
                    }}
                  />
                )}
              </Box>
            }
            id="tab-2"
          />
        </Tabs>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} sx={{ color: currentStyle.color }} />
        </Box>
      ) : models.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <Typography>Aucun modèle installé</Typography>
        </Box>
      ) : (
        <Box sx={{ minHeight: 300 }}>
          {/* Contenu des onglets */}
          <Fade in={activeTab === 0} timeout={500}>
            <Box
              role="tabpanel"
              hidden={activeTab !== 0}
              sx={{ height: "100%" }}
            >
              {renderModelGrid(chatModels)}
            </Box>
          </Fade>

          <Fade in={activeTab === 1} timeout={500}>
            <Box
              role="tabpanel"
              hidden={activeTab !== 1}
              sx={{ height: "100%" }}
            >
              {renderModelGrid(visionModels)}
            </Box>
          </Fade>

          <Fade in={activeTab === 2} timeout={500}>
            <Box
              role="tabpanel"
              hidden={activeTab !== 2}
              sx={{ height: "100%" }}
            >
              {renderModelGrid(embeddingModels)}
            </Box>
          </Fade>
        </Box>
      )}

      {/* Détails du modèle (dialogue) */}
      <Dialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="md"
        scroll="paper"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            m: { xs: 1, sm: 2 },
            maxHeight: "calc(100% - 64px)",
            width: { md: "800px" }, // Largeur fixe pour desktop
            height: "auto",
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

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        slots={{ transition: Fade }}
        TransitionProps={createTransitionProps("fade").props}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            p: 0.5,
            overflow: "hidden",
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: theme.palette.error.lighter,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={18} color={theme.palette.error.main} />
            </Box>
            <Typography variant="h6" component="span" fontWeight={600}>
              Confirmer la suppression
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2.5, pb: 1 }}>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer le modèle
            <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
              {modelToDelete}
            </Box>
            ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{ p: 2, borderTop: "1px solid rgba(226, 232, 240, 0.8)" }}
        >
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              borderColor: "rgba(203, 213, 225, 0.5)",
              color: "text.secondary",
              "&:hover": {
                borderColor: "text.primary",
                bgcolor: "rgba(203, 213, 225, 0.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            disableElevation
            startIcon={
              isDeleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Trash2 size={16} />
              )
            }
            disabled={isDeleting}
            sx={{
              bgcolor: theme.palette.error.main,
              color: "white",
              "&:hover": {
                bgcolor: theme.palette.error.dark,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification de succès */}
      <Snackbar
        open={!!deleteSuccess}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        slots={{ transition: Slide }}
        TransitionProps={createTransitionProps("slide").props}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
          }}
          onClose={() => setDeleteSuccess(null)}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2">
              <strong>{deleteSuccess}</strong> supprimé avec succès
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      {/* Notification d'erreur */}
      <Snackbar
        open={!!deleteError}
        autoHideDuration={4000}
        onClose={() => setDeleteError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        slots={{ transition: Slide }}
        TransitionProps={createTransitionProps("slide").props}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" }}
          onClose={() => setDeleteError(null)}
        >
          <AlertTitle>Erreur</AlertTitle>
          <Typography variant="body2">{deleteError}</Typography>
        </Alert>
      </Snackbar>
    </Paper>
  );
}
