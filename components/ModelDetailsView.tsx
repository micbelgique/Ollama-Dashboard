import { useState, useEffect } from "react";
import { ModelDetails, ShowModelRequest } from "../types/ollama";
import { fetchModelDetails } from "../services/ollamaService";

const ModelDetailsView = ({ model }: ShowModelRequest) => {
  const [details, setDetails] = useState<ModelDetails | null>(null);

  useEffect(() => {
    if (model) {
      fetchModelDetails(model).then((data) => {
        setDetails(data);
      });
    }
  }, [model]);

  if (!details) {
    return null;
  }

  // Format the size in GB
  const formatSize = (count: number) => {
    return (count / 1_000_000_000).toFixed(1) + "B";
  };

  return (
    <div className="model-details">
      <div className="details-section">
        <h3>Informations générales</h3>
        <ul>
          <li>
            <strong>Taille:</strong> {details.details.parameter_size}
          </li>
          <li>
            <strong>Famille:</strong> {details.details.family}
          </li>
          <li>
            <strong>Quantization:</strong> {details.details.quantization_level}
          </li>
          <li>
            <strong>Format:</strong> {details.details.format}
          </li>
        </ul>
      </div>

      <div className="details-section">
        <h3>Informations techniques</h3>
        <ul>
          <li>
            <strong>Architecture:</strong>{" "}
            {details.model_info["general.architecture"]}
          </li>
          <li>
            <strong>Contexte:</strong>{" "}
            {details.model_info["llama.context_length"]} tokens
          </li>
          <li>
            <strong>Embedding:</strong>{" "}
            {details.model_info["llama.embedding_length"] ?? "Non disponible"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModelDetailsView;
