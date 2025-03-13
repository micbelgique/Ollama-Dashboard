import { useState, useEffect } from "react";
import {
  fetchModels,
  deleteModel,
  fetchRunningModels,
} from "@services/ollamaService";
import { Model, RunningModel } from "@models/ollama";
import ModelDetailsView from "@components/ModelDetailsView";
import { eventBus } from "@utils/eventBus";

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

export default function ModelList() {
  const [models, setModels] = useState<Model[]>([]);
  const [runningModels, setRunningModels] = useState<RunningModel[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadModels = async () => {
    const modelList = await fetchModels();
    setModels(modelList);
  };

  const loadRunningModels = async () => {
    const running = await fetchRunningModels();
    setRunningModels(running);
  };

  useEffect(() => {
    loadModels();
    loadRunningModels();

    // Actualiser la liste des modèles en cours d'exécution toutes les 5 secondes
    const interval = setInterval(loadRunningModels, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteModel = async (modelName: string) => {
    if (confirm(`Supprimer le modèle "${modelName}" ?`)) {
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

  // Calculer l'espace total utilisé
  const totalSpaceUsed = models.reduce((sum, model) => {
    return sum + getModelSize(model.name);
  }, 0);

  return (
    <div>
      <h2>Modèles disponibles</h2>
      <p>Espace total utilisé: {totalSpaceUsed.toFixed(1)}GB</p>
      {isDeleting && <p className="deleting-status">Suppression en cours...</p>}
      <div>
        {models.map((model) => {
          // Vérifier si le modèle est en cours d'exécution
          const isRunning = runningModels.some((rm) => rm.name === model.name);
          const modelSize = getModelSize(model.name);

          return (
            <div key={model.digest}>
              <h3>
                {model.name}{" "}
                <span>
                  ({modelSize > 0 ? `${modelSize}GB` : "Taille inconnue"})
                </span>{" "}
                {isRunning && (
                  <span style={{ color: "green" }}>(En cours d'exécution)</span>
                )}
              </h3>
              <ModelDetailsView model={model.name} />
              <button
                onClick={() => handleDeleteModel(model.name)}
                disabled={isRunning || isDeleting}
                title={
                  isRunning
                    ? "Impossible de supprimer un modèle en cours d'exécution"
                    : isDeleting
                    ? "Suppression en cours..."
                    : ""
                }
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
