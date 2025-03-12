import apiClient from "../utils/apiClient";
import {
  Model,
  ModelResponse,
  ModelDetails,
  ShowModelRequest,
} from "../types/ollama";

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
    return true; // Success - 200 OK
  } catch (error) {
    console.error("Error deleting model:", error);
    return false; // Failure - 404 Not Found or other error
  }
}
