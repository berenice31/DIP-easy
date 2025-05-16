import { useState, useCallback } from "react";
import {
  Menu,
  MenuCreate,
  MenuUpdate,
  MenuItem,
  MenuItemCreate,
  MenuItemUpdate,
} from "../types/menu";
import { menuService } from "../services/menuService";

export const useMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenu = useCallback(async (menu: MenuCreate) => {
    try {
      setLoading(true);
      setError(null);
      const newMenu = await menuService.createMenu(menu);
      setMenus((prev) => [...prev, newMenu]);
      return newMenu;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMenu = useCallback(async (id: string, menu: MenuUpdate) => {
    try {
      setLoading(true);
      setError(null);
      const updatedMenu = await menuService.updateMenu(id, menu);
      setMenus((prev) => prev.map((m) => (m.id === id ? updatedMenu : m)));
      return updatedMenu;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMenu = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await menuService.deleteMenu(id);
      setMenus((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMenuItem = useCallback(
    async (menuId: string, item: MenuItemCreate) => {
      try {
        setLoading(true);
        setError(null);
        const newItem = await menuService.addMenuItem(menuId, item);
        setMenus((prev) =>
          prev.map((menu) => {
            if (menu.id === menuId) {
              return { ...menu, items: [...menu.items, newItem] };
            }
            return menu;
          })
        );
        return newItem;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateMenuItem = useCallback(
    async (itemId: string, item: MenuItemUpdate) => {
      try {
        setLoading(true);
        setError(null);
        const updatedItem = await menuService.updateMenuItem(itemId, item);
        setMenus((prev) =>
          prev.map((menu) => ({
            ...menu,
            items: menu.items.map((i) => (i.id === itemId ? updatedItem : i)),
          }))
        );
        return updatedItem;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteMenuItem = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      await menuService.deleteMenuItem(itemId);
      setMenus((prev) =>
        prev.map((menu) => ({
          ...menu,
          items: menu.items.filter((i) => i.id !== itemId),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    menus,
    loading,
    error,
    fetchMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
};
