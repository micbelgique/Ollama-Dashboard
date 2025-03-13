import { useState, useEffect } from "react";
import { installModel, fetchModels } from "@services/ollamaService";
import { Model } from "@models/ollama";
import { eventBus } from "@utils/eventBus";

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

  return (
    <div>
      <h2>Installer un modèle</h2>

      {/* N'afficher les suggestions que lorsque les modèles installés sont chargés */}
      {installedModels.length > 0 && (
        <>
          {/* Section des modèles de chat */}
          {filteredChatModels.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <h3>Modèles de chat</h3>
              <div>
                {filteredChatModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => setModelName(model.name)}
                    disabled={isLoading}
                  >
                    {model.name} ({model.size})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section des modèles de vision */}
          {filteredVisionModels.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <h3>Modèles avec vision</h3>
              <div>
                {filteredVisionModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => setModelName(model.name)}
                    disabled={isLoading}
                  >
                    {model.name} ({model.size})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section des modèles d'embeddings */}
          {filteredEmbeddingModels.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <h3>Modèles d'embeddings</h3>
              <div>
                {filteredEmbeddingModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => setModelName(model.name)}
                    disabled={isLoading}
                  >
                    {model.name} ({model.size})
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div>
        <label htmlFor="model-name">Nom du modèle:</label>
        <input
          id="model-name"
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="ex: llama3:latest"
          disabled={isLoading}
        />
      </div>

      <div>
        <input
          id="insecure"
          type="checkbox"
          checked={isInsecure}
          onChange={(e) => setIsInsecure(e.target.checked)}
          disabled={isLoading}
        />
        <label htmlFor="insecure">Insecure (ignorer SSL)</label>
      </div>

      <button
        onClick={handleInstallClick}
        disabled={isLoading || !modelName.trim()}
      >
        {isLoading ? "Installation..." : "Installer"}
      </button>

      {status && (
        <div>
          <p>{status}</p>

          {progress && (
            <div>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#eee",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    width: `${progress.percentage}%`,
                    backgroundColor: "#4CAF50",
                    height: "20px",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
              <p>
                {formatSize(progress.completed)} / {formatSize(progress.total)}{" "}
                ({progress.percentage}%)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
