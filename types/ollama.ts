// Types spécifiques à Ollama - Version simplifiée
export interface Model {
  name: string;
  digest: string;
}

// Type pour la réponse de l'API
export interface ModelResponse {
  models: Model[];
}

// Types pour la requête POST à /api/show
export interface ShowModelRequest {
  model: string;
}

export interface ModelDetails {
  template: string;
  details: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
  model_info: {
    "general.architecture": string;
    "llama.context_length": number;
    "llama.embedding_length": number;
    // Uniquement les informations essentielles
  };
}

// Types pour les modèles en cours d'exécution
export interface RunningModel {
  name: string;
  // Ajouter d'autres champs si nécessaires
}

export interface RunningModelResponse {
  models: RunningModel[];
}
