import api from "./api";
import {
  StabilityTest,
  CompatibilityTest,
  CreateStabilityTestRequest,
  CreateCompatibilityTestRequest,
  UpdateStabilityTestRequest,
  UpdateCompatibilityTestRequest,
  TestResponse,
} from "../types/test";
import { logger } from "../utils";

class TestService {
  private readonly baseUrl = "/tests";

  // Tests de stabilité
  async getStabilityTests(
    page: number = 1,
    size: number = 10
  ): Promise<TestResponse<StabilityTest>> {
    try {
      const response = await api.get(`${this.baseUrl}/stability`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching stability tests", { error });
      throw error;
    }
  }

  async getStabilityTest(id: string): Promise<StabilityTest> {
    try {
      const response = await api.get(`${this.baseUrl}/stability/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching stability test", { id, error });
      throw error;
    }
  }

  async createStabilityTest(
    data: CreateStabilityTestRequest
  ): Promise<StabilityTest> {
    try {
      const response = await api.post(`${this.baseUrl}/stability`, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating stability test", { data, error });
      throw error;
    }
  }

  async updateStabilityTest(
    id: string,
    data: UpdateStabilityTestRequest
  ): Promise<StabilityTest> {
    try {
      const response = await api.put(`${this.baseUrl}/stability/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error updating stability test", { id, data, error });
      throw error;
    }
  }

  async deleteStabilityTest(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/stability/${id}`);
    } catch (error) {
      logger.error("Error deleting stability test", { id, error });
      throw error;
    }
  }

  // Tests de compatibilité
  async getCompatibilityTests(
    page: number = 1,
    size: number = 10
  ): Promise<TestResponse<CompatibilityTest>> {
    try {
      const response = await api.get(`${this.baseUrl}/compatibility`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching compatibility tests", { error });
      throw error;
    }
  }

  async getCompatibilityTest(id: string): Promise<CompatibilityTest> {
    try {
      const response = await api.get(`${this.baseUrl}/compatibility/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching compatibility test", { id, error });
      throw error;
    }
  }

  async createCompatibilityTest(
    data: CreateCompatibilityTestRequest
  ): Promise<CompatibilityTest> {
    try {
      const response = await api.post(`${this.baseUrl}/compatibility`, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating compatibility test", { data, error });
      throw error;
    }
  }

  async updateCompatibilityTest(
    id: string,
    data: UpdateCompatibilityTestRequest
  ): Promise<CompatibilityTest> {
    try {
      const response = await api.put(
        `${this.baseUrl}/compatibility/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      logger.error("Error updating compatibility test", { id, data, error });
      throw error;
    }
  }

  async deleteCompatibilityTest(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/compatibility/${id}`);
    } catch (error) {
      logger.error("Error deleting compatibility test", { id, error });
      throw error;
    }
  }

  // Méthodes communes
  async getTestsByProduct(productId: string): Promise<{
    stability: StabilityTest[];
    compatibility: CompatibilityTest[];
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/product/${productId}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching tests by product", { productId, error });
      throw error;
    }
  }

  async searchTests(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<{
    stability: TestResponse<StabilityTest>;
    compatibility: TestResponse<CompatibilityTest>;
  }> {
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
      logger.error("Error searching tests", { query, error });
      throw error;
    }
  }
}

export const testService = new TestService();
