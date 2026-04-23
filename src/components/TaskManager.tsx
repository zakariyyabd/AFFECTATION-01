import { useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { type TaskDef } from '../hooks/useSettings';

interface TaskManagerProps {
  items: TaskDef[];
  onChange: (items: TaskDef[]) => void;
}

export function TaskManager({ items, onChange }: TaskManagerProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // check if duplicate by name
    if (items.some(i => i.name === name.trim())) {
      setName('');
      setLocation('');
      return;
    }
    
    onChange([...items, { name: name.trim(), location: location.trim() }]);
    setName('');
    setLocation('');
  };

  const handleRemove = (nameToRemove: string) => {
    onChange(items.filter((item) => item.name !== nameToRemove));
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wide">المهام وأماكنها (Task Types)</h3>
      
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم المهمة..."
          className="flex-1 w-1/2 bg-slate-50 border border-slate-200 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="المكان الافتراضي..."
          className="flex-1 w-1/2 bg-slate-50 border border-slate-200 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-sm transition-all flex items-center justify-center shrink-0 shadow-sm active:scale-95"
          title="إضافة"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm italic w-full text-center py-6 bg-slate-50 rounded-sm border border-dashed border-slate-200">القائمة فارغة</p>
        ) : (
          items.map((item) => (
            <div
              key={item.name}
              className="bg-white text-slate-700 px-3 py-3 rounded-sm text-sm border border-slate-200 flex items-center justify-between group hover:border-indigo-200 transition-colors shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-900">{item.name}</span>
                {item.location && <span className="text-xs text-slate-500 font-medium flex items-center gap-1">📍 {item.location}</span>}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item.name)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded p-1.5 transition-colors opacity-80 group-hover:opacity-100"
                title="حذف"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
