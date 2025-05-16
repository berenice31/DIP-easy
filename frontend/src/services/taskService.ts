import api from "./api";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
} from "../types/task";
import { logger } from "../utils";

class TaskService {
  private readonly baseUrl = "/tasks";

  async getTasks(page: number = 1, size: number = 10): Promise<TaskResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching tasks", { error });
      throw error;
    }
  }

  async getTask(id: string): Promise<Task> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching task", { id, error });
      throw error;
    }
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      logger.error("Error creating task", { data, error });
      throw error;
    }
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error updating task", { id, data, error });
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      logger.error("Error deleting task", { id, error });
      throw error;
    }
  }

  async searchTasks(
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<TaskResponse> {
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
      logger.error("Error searching tasks", { query, error });
      throw error;
    }
  }

  async getTasksByStatus(
    status: string,
    page: number = 1,
    size: number = 10
  ): Promise<TaskResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          status,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching tasks by status", { status, error });
      throw error;
    }
  }

  async getTasksByAssignee(
    userId: string,
    page: number = 1,
    size: number = 10
  ): Promise<TaskResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          assignee_id: userId,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching tasks by assignee", { userId, error });
      throw error;
    }
  }

  async getTasksByPriority(
    priority: string,
    page: number = 1,
    size: number = 10
  ): Promise<TaskResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          priority,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching tasks by priority", { priority, error });
      throw error;
    }
  }

  async getTasksByDueDate(
    startDate: string,
    endDate: string,
    page: number = 1,
    size: number = 10
  ): Promise<TaskResponse> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          start_date: startDate,
          end_date: endDate,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      logger.error("Error fetching tasks by due date", {
        startDate,
        endDate,
        error,
      });
      throw error;
    }
  }

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      logger.error("Error updating task status", { id, status, error });
      throw error;
    }
  }

  async assignTask(id: string, userId: string): Promise<Task> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/assign`, {
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      logger.error("Error assigning task", { id, userId, error });
      throw error;
    }
  }

  async updateTaskPriority(id: string, priority: string): Promise<Task> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/priority`, {
        priority,
      });
      return response.data;
    } catch (error) {
      logger.error("Error updating task priority", { id, priority, error });
      throw error;
    }
  }

  async updateTaskDueDate(id: string, dueDate: string): Promise<Task> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/due-date`, {
        due_date: dueDate,
      });
      return response.data;
    } catch (error) {
      logger.error("Error updating task due date", { id, dueDate, error });
      throw error;
    }
  }
}

export const taskService = new TaskService();
