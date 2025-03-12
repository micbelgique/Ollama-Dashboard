import { useState } from "react";
import { installModel } from "../services/ollamaService";

// Modèles suggérés
const SUGGESTED_MODELS = [
  "phi4:latest",
  "mistral:latest",
  "phi3:latest",
  "llama3.2:latest",
  "deepseek-r1:7b",
  "mxbai-embed-large:latest",
];

export default function ModelInstaller() {
  const [modelName, setModelName] = useState("");
  const [isInsecure, setIsInsecure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState<{
    total: number;
    completed: number;
    percentage: number;
  } | null>(null);

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

      <div>
        {SUGGESTED_MODELS.map((model) => (
          <button
            key={model}
            onClick={() => setModelName(model)}
            disabled={isLoading}
          >
            {model}
          </button>
        ))}
      </div>

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
