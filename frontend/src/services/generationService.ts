import api from "./api";

class GenerationService {
  private baseUrl = "/generations";

  async generate(templateId: string, productId: string) {
    const formData = new FormData();
    formData.append("template_id", templateId);
    formData.append("product_id", productId);
    const response = await api.post(this.baseUrl + "/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async finalize(generationId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.patch(
      `${this.baseUrl}/${generationId}/finalize`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }
}

export const generationService = new GenerationService();
