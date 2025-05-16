import React, { useState } from "react";
import MenuGenerator from "../components/common/MenuGenerator";
import MenuDisplay from "../components/common/MenuDisplay";
import MenuEditor from "../components/common/MenuEditor";
import { Menu, MenuItem } from "../types/menu";
import { MenuParser } from "../services/menuParser";

const MenuPage: React.FC = () => {
  const [menu, setMenu] = useState<Menu>({
    id: crypto.randomUUID(),
    name: "Mon Menu",
    items: [],
    categories: ["Entrées", "Plats", "Desserts", "Boissons"],
  });

  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMenuGenerated = (text: string) => {
    setIsProcessing(true);
    try {
      const parsedItems = MenuParser.parseText(text);

      // Mettre à jour les catégories si de nouvelles sont trouvées
      const newCategories = Array.from(
        new Set([
          ...menu.categories,
          ...parsedItems.map((item) => item.category),
        ])
      );

      setMenu((prev) => ({
        ...prev,
        items: [...prev.items, ...parsedItems],
        categories: newCategories,
      }));
    } catch (error) {
      console.error("Erreur lors du parsing du menu:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setMenu((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleSaveItem = (item: MenuItem) => {
    setMenu((prev) => {
      const existingItemIndex = prev.items.findIndex((i) => i.id === item.id);
      const newItems = [...prev.items];

      if (existingItemIndex >= 0) {
        newItems[existingItemIndex] = item;
      } else {
        newItems.push(item);
      }

      // Mettre à jour les catégories si une nouvelle est ajoutée
      const categories = new Set([...prev.categories, item.category]);

      return {
        ...prev,
        items: newItems,
        categories: Array.from(categories),
      };
    });

    setIsEditorOpen(false);
    setEditingItem(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <MenuGenerator onMenuGenerated={handleMenuGenerated} />
        </div>

        <div className="mb-8">
          <button
            onClick={() => setIsEditorOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Ajouter un élément
          </button>
        </div>

        {isProcessing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Traitement du menu en cours...</p>
          </div>
        ) : (
          <MenuDisplay
            menu={menu}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {isEditorOpen && (
          <MenuEditor
            item={editingItem}
            categories={menu.categories}
            onSave={handleSaveItem}
            onCancel={() => {
              setIsEditorOpen(false);
              setEditingItem(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MenuPage;
