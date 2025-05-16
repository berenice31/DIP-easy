import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { productService } from "../services/productService";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
} from "../types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchProducts = useApi<ProductResponse>(
    async (page = currentPage, size = pageSize) => {
      const response = await productService.getProducts(page, size);
      setProducts(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchProduct = useApi<Product>(async (id: string) => {
    return await productService.getProduct(id);
  });

  const createProduct = useApi<Product>(async (data: CreateProductRequest) => {
    const newProduct = await productService.createProduct(data);
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  });

  const updateProduct = useApi<Product>(
    async (id: string, data: UpdateProductRequest) => {
      const updatedProduct = await productService.updateProduct(id, data);
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updatedProduct : product))
      );
      return updatedProduct;
    }
  );

  const deleteProduct = useApi<void>(async (id: string) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  });

  const searchProducts = useApi<ProductResponse>(
    async (query: string, page = 1, size = pageSize) => {
      const response = await productService.searchProducts(query, page, size);
      setProducts(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  return {
    products,
    total,
    currentPage,
    pageSize,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
  };
}
