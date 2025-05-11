## 1. Variables CSS → Tailwind config
Dans `tailwind.config.js` :
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'primary-light': '#EEF2FF',
        secondary: '#10B981',
        'secondary-light': '#ECFDF5',
        neutral: '#F9FAFB',
        'text-default': '#374151',
        'text-dark': '#1F2937',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '1.2' }],
        h2: ['1.875rem', { lineHeight: '1.3' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        md: '0.375rem',
        lg: '0.5rem',
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
}


Boutons → composants UI Kit ou classes Tailwind

2. Boutons → composants UI Kit ou classes Tailwind

// components/ui/Button.tsx (shadcn/ui ou custom)
import { cva } from 'class-variance-authority';

const btn = cva(
  'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-600 disabled:opacity-50',
        secondary:
          'bg-secondary text-white hover:bg-secondary-600 disabled:opacity-50',
        outline:
          'bg-transparent border-2 border-primary text-primary hover:bg-primary-light disabled:opacity-50',
        danger: 'bg-error text-white hover:bg-error-600 disabled:opacity-50',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
);

export function Button({
  variant,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}) {
  return (
    <button className={btn({ variant })} {...props}>
      {children}
    </button>
  );
}

3. Inputs & Forms

    On installe @tailwindcss/forms pour des styles par défaut.

    Exemples :

<input
  type="text"
  placeholder="Nom commercial"
  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-text-default focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
/>
<label className="block text-sm font-medium text-text-dark mb-1">
  Nom commercial
</label>

4. Sidebar fixe

<aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
  {menuItems.map(item => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-text-default hover:bg-gray-100 ${
          isActive ? 'bg-primary-light text-primary' : ''
        }`
      }
    >
      <item.Icon className="h-6 w-6 mr-3" />
      {item.label}
    </NavLink>
  ))}
</aside>

5. Tables & Cartes

{/* Carte KPI */}
<div className="bg-white p-4 rounded-lg shadow-sm">
  <h4 className="text-h4 font-semibold mb-2">{title}</h4>
  <p className="text-h2">{value}</p>
</div>

{/* Tableau */}
<table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      {columns.map(col => (
        <th
          key={col}
          className="px-4 py-2 text-left text-sm font-semibold text-text-dark"
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {data.map(row => (
      <tr key={row.id} className="hover:bg-primary-light">
        {columns.map(col => (
          <td key={col} className="px-4 py-2 text-sm text-text-default">
            {row[col]}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>

Avec cette configuration Tailwind + UI Kit, chaque couleur, typographie et composant est cohérent, réutilisable et facilement maintenable.
