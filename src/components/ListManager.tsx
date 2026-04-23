import { useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ListManagerProps {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ListManager({ title, items, onChange, placeholder = 'إضافة...' }: ListManagerProps) {
  const [newValue, setNewValue] = useState('');

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    if (items.includes(newValue.trim())) {
      setNewValue('');
      return;
    }
    onChange([...items, newValue.trim()]);
    setNewValue('');
  };

  const handleRemove = (itemToRemove: string) => {
    onChange(items.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-sm font-bold text-slate-700 uppercase mb-4">{title}</h3>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-sm transition-colors flex items-center justify-center shrink-0 shadow-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm italic w-full text-center py-4">القائمة فارغة</p>
        ) : (
          items.map((item) => (
            <div
              key={item}
              className="bg-slate-100 text-slate-700 px-2 py-1 rounded-sm text-sm flex items-center gap-2 group border border-slate-200"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemove(item)}
                className="text-slate-400 hover:text-red-500 hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                title="حذف"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
