import api from "./api";
import { Attachment } from "../types";
import { logger } from "../utils";

class AttachmentService {
  private readonly baseUrl = "/attachments";

  async listByProduct(productId: string): Promise<Attachment[]> {
    try {
      const response = await api.get(`${this.baseUrl}/product/${productId}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching attachments", { productId, error });
      throw error;
    }
  }

  async upload(
    productId: string,
    fieldKey: string,
    file: File
  ): Promise<Attachment> {
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("field_key", fieldKey);
    formData.append("file", file);

    try {
      const response = await api.post(this.baseUrl + "/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      logger.error("Error uploading attachment", {
        productId,
        fieldKey,
        error,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      logger.error("Error deleting attachment", { id, error });
      throw error;
    }
  }
}

export const attachmentService = new AttachmentService();
