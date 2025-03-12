import { useState, useEffect } from "react";
import { fetchModels, deleteModel } from "../services/ollamaService";
import { Model } from "../types/ollama";
import ModelDetailsView from "../components/ModelDetailsView";

export default function ModelList() {
  const [models, setModels] = useState<Model[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadModels = async () => {
    const modelList = await fetchModels();
    setModels(modelList);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleDeleteModel = async (modelName: string) => {
    if (confirm(`Supprimer le modèle "${modelName}" ?`)) {
      setIsDeleting(true);

      try {
        await deleteModel(modelName);
        await loadModels(); // Refresh the list
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
        {models.map((model) => (
          <div key={model.digest}>
            <h3>{model.name}</h3>
            <ModelDetailsView model={model.name} />
            <button onClick={() => handleDeleteModel(model.name)}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
