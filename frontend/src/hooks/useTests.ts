import { useState } from "react";
import { useApi } from "./useApi";
import { testService } from "../services/testService";
import {
  StabilityTest,
  CompatibilityTest,
  CreateStabilityTestRequest,
  CreateCompatibilityTestRequest,
  UpdateStabilityTestRequest,
  UpdateCompatibilityTestRequest,
  TestResponse,
} from "../types/test";

export function useTests() {
  const [stabilityTests, setStabilityTests] = useState<StabilityTest[]>([]);
  const [compatibilityTests, setCompatibilityTests] = useState<
    CompatibilityTest[]
  >([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Tests de stabilité
  const fetchStabilityTests = useApi<TestResponse<StabilityTest>>(
    async (page = currentPage, size = pageSize) => {
      const response = await testService.getStabilityTests(page, size);
      setStabilityTests(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchStabilityTest = useApi<StabilityTest>(async (id: string) => {
    return await testService.getStabilityTest(id);
  });

  const createStabilityTest = useApi<StabilityTest>(
    async (data: CreateStabilityTestRequest) => {
      const newTest = await testService.createStabilityTest(data);
      setStabilityTests((prev) => [...prev, newTest]);
      return newTest;
    }
  );

  const updateStabilityTest = useApi<StabilityTest>(
    async (id: string, data: UpdateStabilityTestRequest) => {
      const updatedTest = await testService.updateStabilityTest(id, data);
      setStabilityTests((prev) =>
        prev.map((test) => (test.id === id ? updatedTest : test))
      );
      return updatedTest;
    }
  );

  const deleteStabilityTest = useApi<void>(async (id: string) => {
    await testService.deleteStabilityTest(id);
    setStabilityTests((prev) => prev.filter((test) => test.id !== id));
  });

  // Tests de compatibilité
  const fetchCompatibilityTests = useApi<TestResponse<CompatibilityTest>>(
    async (page = currentPage, size = pageSize) => {
      const response = await testService.getCompatibilityTests(page, size);
      setCompatibilityTests(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchCompatibilityTest = useApi<CompatibilityTest>(
    async (id: string) => {
      return await testService.getCompatibilityTest(id);
    }
  );

  const createCompatibilityTest = useApi<CompatibilityTest>(
    async (data: CreateCompatibilityTestRequest) => {
      const newTest = await testService.createCompatibilityTest(data);
      setCompatibilityTests((prev) => [...prev, newTest]);
      return newTest;
    }
  );

  const updateCompatibilityTest = useApi<CompatibilityTest>(
    async (id: string, data: UpdateCompatibilityTestRequest) => {
      const updatedTest = await testService.updateCompatibilityTest(id, data);
      setCompatibilityTests((prev) =>
        prev.map((test) => (test.id === id ? updatedTest : test))
      );
      return updatedTest;
    }
  );

  const deleteCompatibilityTest = useApi<void>(async (id: string) => {
    await testService.deleteCompatibilityTest(id);
    setCompatibilityTests((prev) => prev.filter((test) => test.id !== id));
  });

  // Méthodes communes
  const getTestsByProduct = useApi<{
    stability: StabilityTest[];
    compatibility: CompatibilityTest[];
  }>(async (productId: string) => {
    return await testService.getTestsByProduct(productId);
  });

  const searchTests = useApi<{
    stability: TestResponse<StabilityTest>;
    compatibility: TestResponse<CompatibilityTest>;
  }>(async (query: string, page = 1, size = pageSize) => {
    const response = await testService.searchTests(query, page, size);
    setStabilityTests(response.stability.items);
    setCompatibilityTests(response.compatibility.items);
    setTotal(response.stability.total + response.compatibility.total);
    setCurrentPage(page);
    setPageSize(size);
    return response;
  });

  return {
    stabilityTests,
    compatibilityTests,
    total,
    currentPage,
    pageSize,
    fetchStabilityTests,
    fetchStabilityTest,
    createStabilityTest,
    updateStabilityTest,
    deleteStabilityTest,
    fetchCompatibilityTests,
    fetchCompatibilityTest,
    createCompatibilityTest,
    updateCompatibilityTest,
    deleteCompatibilityTest,
    getTestsByProduct,
    searchTests,
  };
}
