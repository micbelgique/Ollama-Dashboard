"use client";

import { useState, useEffect } from "react";
import { ModelDetails, ShowModelRequest } from "@/types/ollama";
import { fetchModelDetails } from "@/services/ollamaService";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";

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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!details) {
    return (
      <Box
        sx={{
          py: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography>Impossible de charger les détails du modèle.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ color: "text.primary" }}>
      {/* Informations générales - basées sur details.details */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Informations générales
        </Typography>

        <Grid container spacing={1.5}>
          {/* Famille */}
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                bgcolor: theme.palette.grey[50],
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "block",
                  mb: 0.5,
                }}
              >
                Famille
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {details.details.family || "Non spécifié"}
              </Typography>
            </Paper>
          </Grid>

          {/* Paramètres */}
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                bgcolor: theme.palette.grey[50],
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "block",
                  mb: 0.5,
                }}
              >
                Paramètres
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {details.details.parameter_size || "Non spécifié"}
              </Typography>
            </Paper>
          </Grid>

          {/* Quantization */}
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                bgcolor: theme.palette.grey[50],
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "block",
                  mb: 0.5,
                }}
              >
                Quantization
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {details.details.quantization_level || "Non spécifié"}
              </Typography>
            </Paper>
          </Grid>

          {/* Format */}
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                bgcolor: theme.palette.grey[50],
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "block",
                  mb: 0.5,
                }}
              >
                Format
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {details.details.format || "GGUF"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Informations techniques - basées sur details.model_info */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Informations techniques
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            border: `1px solid ${theme.palette.grey[100]}`,
          }}
        >
          {/* Architecture */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                px: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Architecture
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {details.model_info["general.architecture"] || "Non spécifié"}
              </Typography>
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
                py: 1,
                px: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Longueur de contexte
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {details.model_info["llama.context_length"] || "Non spécifié"}
              </Typography>
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
                py: 1,
                px: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Longueur d'embedding
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {details.model_info["llama.embedding_length"] || "Non spécifié"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ModelDetailsView;
