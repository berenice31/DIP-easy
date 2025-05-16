export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  menu_id: string;
}

export interface Menu {
  id: string;
  name: string;
  user_id: string;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItemCreate {
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface MenuItemUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}

export interface MenuCreate {
  name: string;
  items?: MenuItemCreate[];
}

export interface MenuUpdate {
  name?: string;
}
