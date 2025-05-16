import { useState } from "react";
import { useApi } from "./useApi";
import { taskService } from "../services/taskService";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
} from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchTasks = useApi<TaskResponse>(
    async (page = currentPage, size = pageSize) => {
      const response = await taskService.getTasks(page, size);
      setTasks(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const fetchTask = useApi<Task>(async (id: string) => {
    return await taskService.getTask(id);
  });

  const createTask = useApi<Task>(async (data: CreateTaskRequest) => {
    const newTask = await taskService.createTask(data);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  });

  const updateTask = useApi<Task>(
    async (id: string, data: UpdateTaskRequest) => {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    }
  );

  const deleteTask = useApi<void>(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  });

  const searchTasks = useApi<TaskResponse>(
    async (query: string, page = 1, size = pageSize) => {
      const response = await taskService.searchTasks(query, page, size);
      setTasks(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getTasksByStatus = useApi<TaskResponse>(
    async (status: string, page = 1, size = pageSize) => {
      const response = await taskService.getTasksByStatus(status, page, size);
      setTasks(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getTasksByAssignee = useApi<TaskResponse>(
    async (userId: string, page = 1, size = pageSize) => {
      const response = await taskService.getTasksByAssignee(userId, page, size);
      setTasks(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getTasksByPriority = useApi<TaskResponse>(
    async (priority: string, page = 1, size = pageSize) => {
      const response = await taskService.getTasksByPriority(
        priority,
        page,
        size
      );
      setTasks(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const getTasksByDueDate = useApi<TaskResponse>(
    async (startDate: string, endDate: string, page = 1, size = pageSize) => {
      const response = await taskService.getTasksByDueDate(
        startDate,
        endDate,
        page,
        size
      );
      setTasks(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.size);
      return response;
    }
  );

  const updateTaskStatus = useApi<Task>(async (id: string, status: string) => {
    const updatedTask = await taskService.updateTaskStatus(id, status);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
    return updatedTask;
  });

  const assignTask = useApi<Task>(async (id: string, userId: string) => {
    const updatedTask = await taskService.assignTask(id, userId);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
    return updatedTask;
  });

  const updateTaskPriority = useApi<Task>(
    async (id: string, priority: string) => {
      const updatedTask = await taskService.updateTaskPriority(id, priority);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    }
  );

  const updateTaskDueDate = useApi<Task>(
    async (id: string, dueDate: string) => {
      const updatedTask = await taskService.updateTaskDueDate(id, dueDate);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    }
  );

  return {
    tasks,
    total,
    currentPage,
    pageSize,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    searchTasks,
    getTasksByStatus,
    getTasksByAssignee,
    getTasksByPriority,
    getTasksByDueDate,
    updateTaskStatus,
    assignTask,
    updateTaskPriority,
    updateTaskDueDate,
  };
}
