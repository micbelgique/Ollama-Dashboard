import apiClient from "@utils/apiClient";
import {
  Model,
  ModelResponse,
  ModelDetails,
  ShowModelRequest,
  RunningModel,
  RunningModelResponse,
} from "@models/ollama";

export async function fetchModels(): Promise<Model[]> {
  try {
    const response = await apiClient.get<ModelResponse>("api/tags");
    return response.data.models || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchModelDetails(
  modelName: string
): Promise<ModelDetails | null> {
  try {
    const requestBody: ShowModelRequest = { model: modelName };
    const response = await apiClient.post<ModelDetails>(
      "api/show",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteModel(modelName: string): Promise<boolean> {
  try {
    await apiClient.delete("api/delete", {
      data: { model: modelName },
    });
    return true;
  } catch (error) {
    console.error("Error deleting model:", error);
    return false;
  }
}

export async function installModel(
  modelName: string,
  isInsecure: boolean,
  onProgress: (
    status: string,
    progress?: { total: number; completed: number }
  ) => void
): Promise<boolean> {
  try {
    // Variable pour stocker les données reçues par le stream
    let receivedData = "";

    // Enlever la déclaration de la variable response non utilisée
    await apiClient.post(
      "api/pull",
      {
        model: modelName,
        insecure: isInsecure,
        stream: true,
      },
      {
        responseType: "text", // Changé de "stream" à "text"
        onDownloadProgress: (progressEvent) => {
          // Récupérer les données actuelles depuis la réponse
          const chunk = progressEvent.event
            ? (progressEvent.event.target as XMLHttpRequest).responseText
            : "";

          // Mettre à jour notre buffer de données avec les nouvelles données
          if (chunk && chunk !== receivedData) {
            receivedData = chunk;

            // Traiter les lignes de la réponse
            const lines = receivedData.split("\n").filter(Boolean);

            if (lines.length > 0) {
              try {
                const lastLine = lines[lines.length - 1];
                const data = JSON.parse(lastLine);

                if (data.total && data.completed) {
                  onProgress(data.status, {
                    total: data.total,
                    completed: data.completed,
                  });
                } else {
                  onProgress(data.status);
                }

                // Si l'installation est terminée
                if (data.status === "success") {
                  // On peut réinitialiser les données reçues
                  receivedData = "";
                }
              } catch (e) {
                console.error("Erreur de parsing:", e);
              }
            }
          }
        },
      }
    );
    return true;
  } catch (error) {
    console.error("Erreur d'installation:", error);
    return false;
  }
}

export async function fetchRunningModels(): Promise<RunningModel[]> {
  try {
    const response = await apiClient.get<RunningModelResponse>("api/ps");
    return response.data.models || [];
  } catch (error) {
    console.error("Error fetching running models:", error);
    return [];
  }
}
