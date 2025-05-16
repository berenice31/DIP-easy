import api from "./api";
import {
  Ingredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
  IngredientResponse,
} from "../types/ingredient";
import { logger } from "../utils";

class IngredientService {
  private readonly baseUrl = "/ingredients";

  async getIngredients(
    page: number = 1,
    size: number = 10
  ): Promise<IngredientResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching ingredients", { error });
      throw error;
    }
  }

  async getIngredient(id: string): Promise<Ingredient> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching ingredient", { id, error });
      throw error;
    }
  }

  async createIngredient(data: CreateIngredientRequest): Promise<Ingredient> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating ingredient", { data, error });
      throw error;
    }
  }

  async updateIngredient(
    id: string,
    data: UpdateIngredientRequest
  ): Promise<Ingredient> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error updating ingredient", { id, data, error });
      throw error;
    }
  }

  async deleteIngredient(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      logger.error("Error deleting ingredient", { id, error });
      throw error;
    }
  }

  async searchIngredients(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<IngredientResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          search: query,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error searching ingredients", { query, error });
      throw error;
    }
  }

  async getIngredientsByProduct(productId: string): Promise<Ingredient[]> {
    try {
      const response = await api.get(`${this.baseUrl}/product/${productId}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching ingredients by product", {
        productId,
        error,
      });
      throw error;
    }
  }
}

export const ingredientService = new IngredientService();
