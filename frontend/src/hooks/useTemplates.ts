import { useState } from "react";
import { useApi } from "./useApi";
import { templateService } from "../services/templateService";
import {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateResponse,
} from "../types/template";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [preview, setPreview] = useState<string>("");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors?: string[];
  } | null>(null);

  const fetchTemplates = useApi<TemplateResponse>(
    async (page = currentPage, size = pageSize) => {
      const response = await templateService.getTemplates(page, size);
      setTemplates(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchTemplate = useApi<Template>(async (id: string) => {
    return await templateService.getTemplate(id);
  });

  const createTemplate = useApi<Template>(
    async (data: CreateTemplateRequest) => {
      const newTemplate = await templateService.createTemplate(data);
      setTemplates((prev) => [...prev, newTemplate]);
      return newTemplate;
    }
  );

  const updateTemplate = useApi<Template>(
    async (id: string, data: UpdateTemplateRequest) => {
      const updatedTemplate = await templateService.updateTemplate(id, data);
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === id ? updatedTemplate : template
        )
      );
      return updatedTemplate;
    }
  );

  const deleteTemplate = useApi<void>(async (id: string) => {
    await templateService.deleteTemplate(id);
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  });

  const searchTemplates = useApi<TemplateResponse>(
    async (query: string, page = 1, size = pageSize) => {
      const response = await templateService.searchTemplates(query, page, size);
      setTemplates(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const generateDocument = useApi<{ url: string }>(
    async (templateId: string, productId: string) => {
      return await templateService.generateDocument(templateId, productId);
    }
  );

  const previewTemplate = useApi<string>(
    async (templateId: string, data: Record<string, any>) => {
      const preview = await templateService.previewTemplate(templateId, data);
      setPreview(preview);
      return preview;
    }
  );

  const validateTemplate = useApi<{ valid: boolean; errors?: string[] }>(
    async (templateId: string) => {
      const result = await templateService.validateTemplate(templateId);
      setValidationResult(result);
      return result;
    }
  );

  const duplicateTemplate = useApi<Template>(
    async (templateId: string, newName: string) => {
      const newTemplate = await templateService.duplicateTemplate(
        templateId,
        newName
      );
      setTemplates((prev) => [...prev, newTemplate]);
      return newTemplate;
    }
  );

  return {
    templates,
    total,
    currentPage,
    pageSize,
    preview,
    validationResult,
    fetchTemplates,
    fetchTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    searchTemplates,
    generateDocument,
    previewTemplate,
    validateTemplate,
    duplicateTemplate,
  };
}
