import api from "./api";

class GenerationService {
  private baseUrl = "/generations";

  async generate(templateId: string, productId: string) {
    const body = new URLSearchParams();
    body.append("template_id", templateId);
    body.append("product_id", productId);
    const response = await api.post(this.baseUrl + "/", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

  async list() {
    const response = await api.get(this.baseUrl + "/");
    return response.data;
  }

  async delete(id: string) {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export const generationService = new GenerationService();
