import api from "./api";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
} from "../types/product";
import { logger } from "../utils";

class ProductService {
  private readonly baseUrl = "/products";

  async getProducts(
    page: number = 1,
    size: number = 10
  ): Promise<ProductResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching products", { error });
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching product", { id, error });
      throw error;
    }
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating product", { data, error });
      throw error;
    }
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<Product> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error updating product", { id, data, error });
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      logger.error("Error deleting product", { id, error });
      throw error;
    }
  }

  async searchProducts(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<ProductResponse> {
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
      logger.error("Error searching products", { query, error });
      throw error;
    }
  }
}

export const productService = new ProductService();
