"use client";

import { useState, useEffect } from "react";
import { ModelDetails, ShowModelRequest } from "@/types/ollama";
import { fetchModelDetails } from "@/services/ollamaService";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  useTheme,
  Fade,
  Skeleton,
  Tooltip,
  Chip,
} from "@mui/material";
import { BrainCircuit, Cpu, Settings, FileJson } from "lucide-react";

const ModelDetailsView = ({ model }: ShowModelRequest) => {
  const theme = useTheme();
  const [details, setDetails] = useState<ModelDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadModelDetails() {
      setIsLoading(true);
      if (model) {
        try {
          const data = await fetchModelDetails(model);
          setDetails(data);
        } catch (error) {
          console.error("Erreur lors du chargement des détails:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadModelDetails();
  }, [model]);

  // Détermine le type de modèle pour les couleurs thématiques
  const getModelType = () => {
    if (!model) return "Chat";

    const modelName = model.toLowerCase();
    if (
      modelName.includes("llava") ||
      modelName.includes("vision") ||
      modelName.includes("minicpm-v")
    ) {
      return "Vision";
    } else if (modelName.includes("embed")) {
      return "Embeddings";
    } else {
      return "Chat";
    }
  };

  // Obtenir les couleurs correspondant au type de modèle
  const getModelColor = () => {
    switch (getModelType()) {
      case "Vision":
        return { main: "#E11D48", light: "rgba(255, 77, 106, 0.1)" };
      case "Embeddings":
        return {
          main: theme.palette.warning.main,
          light: theme.palette.warning.lighter,
        };
      default:
        return {
          main: theme.palette.primary.main,
          light: theme.palette.primary.lighter,
        };
    }
  };

  const modelColor = getModelColor();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={120}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={180}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    );
  }

  if (!details) {
    return (
      <Fade in={true} timeout={300}>
        <Box
          sx={{
            py: 3,
            textAlign: "center",
            color: "text.secondary",
            bgcolor: "rgba(0, 0, 0, 0.02)",
            borderRadius: 2,
          }}
        >
          <Typography>Impossible de charger les détails du modèle.</Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={400}>
      <Box sx={{ color: "text.primary" }}>
        {/* Informations générales - basées sur details.details */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2.5, gap: 1.5 }}
          >
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: modelColor.light,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
              }}
            >
              <BrainCircuit size={18} color={modelColor.main} />
            </Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Informations générales
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {/* Famille */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 2,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "block",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  Famille
                </Typography>
                <Tooltip
                  title={details.details.family || "Non spécifié"}
                  placement="top"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                      fontSize: "0.95rem",
                    }}
                  >
                    {details.details.family || "Non spécifié"}
                  </Typography>
                </Tooltip>
              </Paper>
            </Grid>

            {/* Paramètres */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 2,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "block",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  Paramètres
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                >
                  {details.details.parameter_size || "Non spécifié"}
                </Typography>
              </Paper>
            </Grid>

            {/* Quantization */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 2,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "block",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  Quantization
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                >
                  {details.details.quantization_level || "Non spécifié"}
                </Typography>
              </Paper>
            </Grid>

            {/* Format */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 2,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "block",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  Format
                </Typography>
                <Chip
                  label={details.details.format || "GGUF"}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.8rem",
                    bgcolor: modelColor.light,
                    color: modelColor.main,
                    fontWeight: 600,
                    alignSelf: "flex-start",
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Informations techniques - basées sur details.model_info */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2.5, gap: 1.5 }}
          >
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: modelColor.light,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
              }}
            >
              <Cpu size={18} color={modelColor.main} />
            </Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Informations techniques
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              bgcolor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {/* Architecture */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                  px: 3,
                  height: 64,
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.01)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Settings size={16} color={theme.palette.text.secondary} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Architecture
                  </Typography>
                </Box>
                <Tooltip
                  title={
                    details.model_info["general.architecture"] || "Non spécifié"
                  }
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      maxWidth: { xs: "120px", sm: "200px" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {details.model_info["general.architecture"] ||
                      "Non spécifié"}
                  </Typography>
                </Tooltip>
              </Box>
              <Divider sx={{ opacity: 0.6 }} />
            </Box>

            {/* Contexte */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                  px: 3,
                  height: 64,
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.01)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Settings size={16} color={theme.palette.text.secondary} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Longueur de contexte
                  </Typography>
                </Box>
                <Chip
                  label={
                    details.model_info["llama.context_length"] || "Non spécifié"
                  }
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.8rem",
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Divider sx={{ opacity: 0.6 }} />
            </Box>

            {/* Embedding */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                  px: 3,
                  height: 64,
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.01)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Settings size={16} color={theme.palette.text.secondary} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Longueur d'embedding
                  </Typography>
                </Box>
                <Chip
                  label={
                    details.model_info["llama.embedding_length"] ||
                    "Non spécifié"
                  }
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.8rem",
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* JSON Metadata - Section métadonnées */}
        <Box sx={{ mb: 0 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2.5, gap: 1.5 }}
          >
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: modelColor.light,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
              }}
            >
              <FileJson size={18} color={modelColor.main} />
            </Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Métadonnées
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid rgba(226, 232, 240, 0.8)",
              bgcolor: "rgba(0, 0, 0, 0.02)",
              overflow: "auto",
              height: 200, // Hauteur fixe pour harmoniser
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.03)",
              },
            }}
          >
            <pre style={{ margin: 0, overflow: "auto", height: "100%" }}>
              {JSON.stringify(details.model_info, null, 2)}
            </pre>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
};

export default ModelDetailsView;
