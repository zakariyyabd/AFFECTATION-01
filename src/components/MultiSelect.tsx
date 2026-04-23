import { useState, useRef, useEffect, MouseEvent } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (e: MouseEvent, option: string) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          "min-h-[42px] bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 flex items-center justify-between cursor-pointer transition-all",
          isOpen ? "ring-2 ring-indigo-500 border-transparent" : "hover:border-slate-300"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
          {selected.length === 0 && <span className="text-slate-400 select-none text-sm">{placeholder}</span>}
          {selected.map((item) => (
            <span
              key={item}
              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-sm flex items-center gap-1"
            >
              {item}
              <span
                onClick={(e) => removeOption(e, item)}
                className="hover:bg-indigo-200 hover:text-indigo-900 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </span>
            </span>
          ))}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-sm shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="p-3 text-sm text-slate-500 text-center">القائمة فارغة، قم بالإضافة من إعدادات النظام</div>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <div
                  key={option}
                  className={cn(
                    "px-3 py-2 cursor-pointer flex items-center justify-between text-sm transition-colors",
                    isSelected ? "bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-slate-50 text-slate-700"
                  )}
                  onClick={() => toggleOption(option)}
                >
                  {option}
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
