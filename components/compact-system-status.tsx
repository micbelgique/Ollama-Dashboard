"use client";

import { useState, useEffect } from "react";
import { Tooltip, Chip, Badge, CircularProgress, Stack } from "@mui/material";
import { fetchRunningModels, fetchModels } from "@/services/ollamaService";
import { Database, Cpu, Activity } from "lucide-react";

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

  // Style de base commun pour tous les indicateurs
  const baseChipStyle = {
    height: 28,
    borderRadius: "14px",
    px: 0.8,
    "& .MuiChip-label": {
      px: 1,
      fontSize: "0.75rem",
      fontWeight: 600,
    },
    "& .MuiChip-icon": {
      fontSize: 16,
      mr: 0.5,
    },
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    },
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{ height: "100%" }}
    >
      {/* Status indicator - Modern design */}
      <Tooltip title="Statut du serveur Ollama" arrow placement="bottom">
        <Chip
          icon={<Activity size={14} />}
          label={isOllamaRunning ? "Serveur actif" : "Serveur inactif"}
          size="small"
          sx={{
            ...baseChipStyle,
            bgcolor: isOllamaRunning
              ? "rgba(16, 185, 129, 0.12)"
              : "rgba(244, 63, 94, 0.12)",
            color: isOllamaRunning ? "#10B981" : "#F43F5E",
            border: `1px solid ${
              isOllamaRunning
                ? "rgba(16, 185, 129, 0.4)"
                : "rgba(244, 63, 94, 0.4)"
            }`,
            "& .MuiChip-icon": {
              ...baseChipStyle["& .MuiChip-icon"],
              color: isOllamaRunning ? "#10B981" : "#F43F5E",
            },
          }}
        />
      </Tooltip>

      {/* Loading indicator */}
      {isLoading && (
        <CircularProgress size={18} sx={{ color: "#2563EB", opacity: 0.8 }} />
      )}

      {/* Storage indicator */}
      <Tooltip title="Espace disque" arrow placement="bottom">
        <Chip
          icon={<Database size={14} />}
          label={systemInfo.totalStorage}
          size="small"
          sx={{
            ...baseChipStyle,
            bgcolor: "rgba(249, 115, 22, 0.12)",
            color: "#F97316",
            border: "1px solid rgba(249, 115, 22, 0.4)",
            "& .MuiChip-icon": {
              ...baseChipStyle["& .MuiChip-icon"],
              color: "#F97316",
            },
          }}
        />
      </Tooltip>

      {/* Models indicator with badge */}
      <Tooltip title="Modèles installés" arrow placement="bottom">
        <Badge
          badgeContent={
            systemInfo.runningModels > 0 ? systemInfo.runningModels : null
          }
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
              ...baseChipStyle,
              bgcolor: "rgba(37, 99, 235, 0.12)",
              color: "#2563EB",
              border: "1px solid rgba(37, 99, 235, 0.4)",
              "& .MuiChip-icon": {
                ...baseChipStyle["& .MuiChip-icon"],
                color: "#2563EB",
              },
            }}
          />
        </Badge>
      </Tooltip>
    </Stack>
  );
}
