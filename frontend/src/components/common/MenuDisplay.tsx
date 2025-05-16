import React from "react";
import { Menu, MenuItem } from "../../types/menu";

interface MenuDisplayProps {
  menu: Menu;
  onEditItem?: (item: MenuItem) => void;
  onDeleteItem?: (itemId: string) => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({
  menu,
  onEditItem,
  onDeleteItem,
}) => {
  const groupedItems = menu.categories.reduce((acc, category) => {
    acc[category] = menu.items.filter((item) => item.category === category);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">{menu.name}</h1>

      {menu.categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
            {category}
          </h2>

          <div className="grid gap-4">
            {groupedItems[category]?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {item.price.toFixed(2)} €
                    </span>
                    {(onEditItem || onDeleteItem) && (
                      <div className="flex space-x-2">
                        {onEditItem && (
                          <button
                            onClick={() => onEditItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        )}
                        {onDeleteItem && (
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuDisplay;
