import { useState } from "react";
import { useApi } from "./useApi";
import { settingService } from "../services/settingService";
import {
  Setting,
  CreateSettingRequest,
  UpdateSettingRequest,
  SettingResponse,
} from "../types/setting";

export function useSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors?: string[];
  } | null>(null);

  const fetchSettings = useApi<SettingResponse>(
    async (page = currentPage, size = pageSize) => {
      const response = await settingService.getSettings(page, size);
      setSettings(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchSetting = useApi<Setting>(async (id: string) => {
    return await settingService.getSetting(id);
  });

  const createSetting = useApi<Setting>(async (data: CreateSettingRequest) => {
    const newSetting = await settingService.createSetting(data);
    setSettings((prev) => [...prev, newSetting]);
    return newSetting;
  });

  const updateSetting = useApi<Setting>(
    async (id: string, data: UpdateSettingRequest) => {
      const updatedSetting = await settingService.updateSetting(id, data);
      setSettings((prev) =>
        prev.map((setting) => (setting.id === id ? updatedSetting : setting))
      );
      return updatedSetting;
    }
  );

  const deleteSetting = useApi<void>(async (id: string) => {
    await settingService.deleteSetting(id);
    setSettings((prev) => prev.filter((setting) => setting.id !== id));
  });

  const searchSettings = useApi<SettingResponse>(
    async (query: string, page = 1, size = pageSize) => {
      const response = await settingService.searchSettings(query, page, size);
      setSettings(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getSettingsByCategory = useApi<SettingResponse>(
    async (category: string, page = 1, size = pageSize) => {
      const response = await settingService.getSettingsByCategory(
        category,
        page,
        size
      );
      setSettings(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getSettingsByUser = useApi<SettingResponse>(
    async (userId: string, page = 1, size = pageSize) => {
      const response = await settingService.getSettingsByUser(
        userId,
        page,
        size
      );
      setSettings(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getSettingsByModule = useApi<SettingResponse>(
    async (module: string, page = 1, size = pageSize) => {
      const response = await settingService.getSettingsByModule(
        module,
        page,
        size
      );
      setSettings(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const validateSetting = useApi<{ valid: boolean; errors?: string[] }>(
    async (id: string) => {
      const result = await settingService.validateSetting(id);
      setValidationResult(result);
      return result;
    }
  );

  const resetSetting = useApi<Setting>(async (id: string) => {
    const resetSetting = await settingService.resetSetting(id);
    setSettings((prev) =>
      prev.map((setting) => (setting.id === id ? resetSetting : setting))
    );
    return resetSetting;
  });

  const importSettings = useApi<void>(async (file: File) => {
    await settingService.importSettings(file);
    // Rafraîchir la liste des paramètres après l'import
    const response = await settingService.getSettings(currentPage, pageSize);
    setSettings(response.items);
    setTotal(response.total);
  });

  const exportSettings = useApi<Blob>(
    async (format: "csv" | "json" = "json") => {
      return await settingService.exportSettings(format);
    }
  );

  return {
    settings,
    total,
    currentPage,
    pageSize,
    validationResult,
    fetchSettings,
    fetchSetting,
    createSetting,
    updateSetting,
    deleteSetting,
    searchSettings,
    getSettingsByCategory,
    getSettingsByUser,
    getSettingsByModule,
    validateSetting,
    resetSetting,
    importSettings,
    exportSettings,
  };
}
