import { useState } from "react";
import { useApi } from "./useApi";
import { logService } from "../services/logService";
import { Log, CreateLogRequest, LogResponse } from "../types/log";

export function useLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = useApi<LogResponse>(
    async (page = currentPage, size = pageSize) => {
      const response = await logService.getLogs(page, size);
      setLogs(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchLog = useApi<Log>(async (id: string) => {
    return await logService.getLog(id);
  });

  const createLog = useApi<Log>(async (data: CreateLogRequest) => {
    const newLog = await logService.createLog(data);
    setLogs((prev) => [...prev, newLog]);
    return newLog;
  });

  const deleteLog = useApi<void>(async (id: string) => {
    await logService.deleteLog(id);
    setLogs((prev) => prev.filter((log) => log.id !== id));
  });

  const searchLogs = useApi<LogResponse>(
    async (query: string, page = 1, size = pageSize) => {
      const response = await logService.searchLogs(query, page, size);
      setLogs(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getLogsByLevel = useApi<LogResponse>(
    async (level: string, page = 1, size = pageSize) => {
      const response = await logService.getLogsByLevel(level, page, size);
      setLogs(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getLogsByUser = useApi<LogResponse>(
    async (userId: string, page = 1, size = pageSize) => {
      const response = await logService.getLogsByUser(userId, page, size);
      setLogs(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getLogsByDateRange = useApi<LogResponse>(
    async (startDate: string, endDate: string, page = 1, size = pageSize) => {
      const response = await logService.getLogsByDateRange(
        startDate,
        endDate,
        page,
        size
      );
      setLogs(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getLogsByModule = useApi<LogResponse>(
    async (module: string, page = 1, size = pageSize) => {
      const response = await logService.getLogsByModule(module, page, size);
      setLogs(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const clearLogs = useApi<void>(async () => {
    await logService.clearLogs();
    setLogs([]);
    setTotal(0);
  });

  const exportLogs = useApi<Blob>(async (format: "csv" | "json" = "json") => {
    return await logService.exportLogs(format);
  });

  return {
    logs,
    total,
    currentPage,
    pageSize,
    fetchLogs,
    fetchLog,
    createLog,
    deleteLog,
    searchLogs,
    getLogsByLevel,
    getLogsByUser,
    getLogsByDateRange,
    getLogsByModule,
    clearLogs,
    exportLogs,
  };
}
