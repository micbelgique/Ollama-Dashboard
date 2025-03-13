import { useState, useEffect } from "react";
import {
  fetchModels,
  deleteModel,
  fetchRunningModels,
} from "../services/ollamaService";
import { Model, RunningModel } from "../types/ollama";
import ModelDetailsView from "../components/ModelDetailsView";
import { eventBus } from "../utils/eventBus";

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

  return (
    <div>
      <h2>Modèles disponibles</h2>
      <div>
        {models.map((model) => {
          // Vérifier si le modèle est en cours d'exécution
          const isRunning = runningModels.some((rm) => rm.name === model.name);

          return (
            <div key={model.digest}>
              <h3>
                {model.name}{" "}
                {isRunning && (
                  <span style={{ color: "green" }}>(En cours d'exécution)</span>
                )}
              </h3>
              <ModelDetailsView model={model.name} />
              <button
                onClick={() => handleDeleteModel(model.name)}
                disabled={isRunning}
                title={
                  isRunning
                    ? "Impossible de supprimer un modèle en cours d'exécution"
                    : ""
                }
              >
                Supprimer
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
