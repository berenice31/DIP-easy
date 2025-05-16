import { useState } from "react";
import { useApi } from "./useApi";
import { ingredientService } from "../services/ingredientService";
import {
  Ingredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
  IngredientResponse,
} from "../types/ingredient";

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchIngredients = useApi<IngredientResponse>(
    async (page = currentPage, size = pageSize) => {
      const response = await ingredientService.getIngredients(page, size);
      setIngredients(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchIngredient = useApi<Ingredient>(async (id: string) => {
    return await ingredientService.getIngredient(id);
  });

  const createIngredient = useApi<Ingredient>(
    async (data: CreateIngredientRequest) => {
      const newIngredient = await ingredientService.createIngredient(data);
      setIngredients((prev) => [...prev, newIngredient]);
      return newIngredient;
    }
  );

  const updateIngredient = useApi<Ingredient>(
    async (id: string, data: UpdateIngredientRequest) => {
      const updatedIngredient = await ingredientService.updateIngredient(
        id,
        data
      );
      setIngredients((prev) =>
        prev.map((ingredient) =>
          ingredient.id === id ? updatedIngredient : ingredient
        )
      );
      return updatedIngredient;
    }
  );

  const deleteIngredient = useApi<void>(async (id: string) => {
    await ingredientService.deleteIngredient(id);
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
  });

  const searchIngredients = useApi<IngredientResponse>(
    async (query: string, page = 1, size = pageSize) => {
      const response = await ingredientService.searchIngredients(
        query,
        page,
        size
      );
      setIngredients(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getIngredientsByProduct = useApi<Ingredient[]>(
    async (productId: string) => {
      return await ingredientService.getIngredientsByProduct(productId);
    }
  );

  return {
    ingredients,
    total,
    currentPage,
    pageSize,
    fetchIngredients,
    fetchIngredient,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    searchIngredients,
    getIngredientsByProduct,
  };
}
