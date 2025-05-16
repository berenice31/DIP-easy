import axios from "axios";
import {
  Menu,
  MenuCreate,
  MenuUpdate,
  MenuItem,
  MenuItemCreate,
  MenuItemUpdate,
} from "../types/menu";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const menuService = {
  // Récupérer tous les menus
  async getAllMenus(): Promise<Menu[]> {
    const response = await axios.get(`${API_URL}/menus`);
    return response.data;
  },

  // Récupérer un menu par son ID
  async getMenuById(id: string): Promise<Menu> {
    const response = await axios.get(`${API_URL}/menus/${id}`);
    return response.data;
  },

  // Créer un nouveau menu
  async createMenu(menu: MenuCreate): Promise<Menu> {
    const response = await axios.post(`${API_URL}/menus`, menu);
    return response.data;
  },

  // Mettre à jour un menu
  async updateMenu(id: string, menu: MenuUpdate): Promise<Menu> {
    const response = await axios.put(`${API_URL}/menus/${id}`, menu);
    return response.data;
  },

  // Supprimer un menu
  async deleteMenu(id: string): Promise<Menu> {
    const response = await axios.delete(`${API_URL}/menus/${id}`);
    return response.data;
  },

  // Ajouter un élément au menu
  async addMenuItem(menuId: string, item: MenuItemCreate): Promise<MenuItem> {
    const response = await axios.post(`${API_URL}/menus/${menuId}/items`, item);
    return response.data;
  },

  // Mettre à jour un élément du menu
  async updateMenuItem(
    itemId: string,
    item: MenuItemUpdate
  ): Promise<MenuItem> {
    const response = await axios.put(`${API_URL}/menus/items/${itemId}`, item);
    return response.data;
  },

  // Supprimer un élément du menu
  async deleteMenuItem(itemId: string): Promise<boolean> {
    const response = await axios.delete(`${API_URL}/menus/items/${itemId}`);
    return response.data;
  },
};
