"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Chip,
  Badge,
  CircularProgress,
} from "@mui/material";
import { fetchRunningModels, fetchModels } from "@/services/ollamaService";
import { Database, Cpu } from "lucide-react";

// Réutiliser la logique de taille des modèles
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

export function CompactSystemStatus() {
  const [isOllamaRunning, setIsOllamaRunning] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [systemInfo, setSystemInfo] = useState({
    modelCount: 0,
    runningModels: 0,
    totalStorage: "0 GB",
  });

  useEffect(() => {
    const checkOllamaStatus = async () => {
      setIsLoading(true);
      try {
        const runningModels = await fetchRunningModels();
        const allModels = await fetchModels();

        setIsOllamaRunning(true);
        const totalStorageUsed = allModels.reduce(
          (sum, model) => sum + getModelSize(model.name),
          0
        );

        setSystemInfo({
          modelCount: allModels.length,
          runningModels: runningModels.length,
          totalStorage: `${totalStorageUsed.toFixed(1)} GB`,
        });
      } catch (error) {
        console.error("Error checking Ollama status:", error);
        setIsOllamaRunning(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOllamaStatus();
    const interval = setInterval(checkOllamaStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        height: "100%",
      }}
    >
      {/* Status indicator - Modern pill design */}
      <Chip
        icon={
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: isOllamaRunning ? "#10B981" : "#F43F5E",
              boxShadow: isOllamaRunning
                ? "0 0 6px rgba(16, 185, 129, 0.6)"
                : "0 0 6px rgba(244, 63, 94, 0.6)",
              animation: isOllamaRunning ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": { opacity: 0.7 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.7 },
              },
              ml: 0.8,
            }}
          />
        }
        label={
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: "0.7rem",
              mr: 0.5,
            }}
          >
            {isOllamaRunning ? "En ligne" : "Hors ligne"}
          </Typography>
        }
        size="small"
        sx={{
          height: 24,
          borderRadius: "12px",
          bgcolor: isOllamaRunning
            ? "rgba(16, 185, 129, 0.1)"
            : "rgba(244, 63, 94, 0.1)",
          color: isOllamaRunning ? "#10B981" : "#F43F5E",
          border: `1px solid ${
            isOllamaRunning
              ? "rgba(16, 185, 129, 0.3)"
              : "rgba(244, 63, 94, 0.3)"
          }`,
          "& .MuiChip-icon": {
            mr: -0.5,
          },
        }}
      />

      {/* Loading indicator */}
      {isLoading && (
        <CircularProgress size={20} sx={{ color: "#2563EB", ml: 1 }} />
      )}

      {/* Storage indicator */}
      <Tooltip
        title="Espace disque utilisé par les modèles"
        arrow
        placement="bottom"
      >
        <Chip
          icon={<Database size={14} />}
          label={systemInfo.totalStorage}
          size="small"
          sx={{
            height: 24,
            borderRadius: "12px",
            bgcolor: "rgba(249, 115, 22, 0.1)",
            color: "#F97316",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            "& .MuiChip-label": {
              px: 1,
              fontSize: "0.7rem",
              fontWeight: 600,
            },
            "& .MuiChip-icon": {
              color: "#F97316",
            },
          }}
        />
      </Tooltip>

      {/* Models indicator with badge */}
      <Tooltip
        title="Modèles actifs / total installés"
        arrow
        placement="bottom"
      >
        <Badge
          badgeContent={systemInfo.runningModels}
          color="primary"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              height: 16,
              minWidth: 16,
              fontSize: "0.65rem",
              fontWeight: 700,
              p: "0 4px",
              border: "1px solid white",
            },
          }}
        >
          <Chip
            icon={<Cpu size={14} />}
            label={`${systemInfo.modelCount} modèles`}
            size="small"
            sx={{
              height: 24,
              borderRadius: "12px",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              color: "#2563EB",
              border: "1px solid rgba(37, 99, 235, 0.3)",
              "& .MuiChip-label": {
                px: 1,
                fontSize: "0.7rem",
                fontWeight: 600,
              },
              "& .MuiChip-icon": {
                color: "#2563EB",
              },
            }}
          />
        </Badge>
      </Tooltip>
    </Box>
  );
}
