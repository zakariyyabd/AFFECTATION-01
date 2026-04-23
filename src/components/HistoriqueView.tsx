import { useState, useMemo } from 'react';
import { Trash2, Search, Users, Calendar, MapPin, Briefcase } from 'lucide-react';
import { useHistory, type Role } from '../hooks/useHistory';
import { cn } from '../lib/utils';

const TABS: { id: Role; label: string }[] = [
  { id: 'driver', label: 'السائقين' },
  { id: 'conveyor', label: 'Convoyeurs' },
  { id: 'worker', label: 'العمال' }
];

export function HistoriqueView() {
  const { records, deleteRecord, clearAll } = useHistory();
  const [activeRole, setActiveRole] = useState<Role>('driver');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredRecords = useMemo(() => {
    return records
      .filter(r => r.role === activeRole)
      .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.timestamp - a.timestamp);
  }, [records, activeRole, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span>🕰️</span> سجل التكليفات
            </h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">متابعة أماكن وتكليفات فرق العمل حسب التاريخ</p>
          </div>
          
          <div className="relative">
            {confirmClear ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                <span className="text-sm text-red-600 font-bold">هل أنت متأكد؟</span>
                <button onClick={() => { clearAll(); setConfirmClear(false); }} className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded-sm hover:bg-red-700">نعم، مسح كلي</button>
                <button onClick={() => setConfirmClear(false)} className="bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold rounded-sm hover:bg-slate-300">إلغاء</button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-sm text-sm font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                مسح كل السجل
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex space-x-reverse space-x-2">
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveRole(tab.id)}
                className={cn(
                  "px-4 sm:px-6 py-2.5 font-bold text-sm rounded-sm transition-all text-center", 
                  activeRole === tab.id 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="البحث بالاسم أو المكان..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-sm pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4 flex items-center gap-2"><Users className="w-3.5 h-3.5"/> الاسم</th>
                  <th className="p-4"><div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5"/> التاريخ</div></th>
                  <th className="p-4"><div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/> المكان / الموقع</div></th>
                  <th className="p-4"><div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5"/> نوع المهمة</div></th>
                  <th className="p-4">ملاحظة</th>
                  <th className="p-4 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      لا توجد سجلات مطابقة في هذا القسم.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => {
                    const [year, month, day] = record.date.split('-');
                    const formattedDate = `${day}/${month}/${year}`;
                    
                    return (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{record.name}</td>
                        <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">{formattedDate}</td>
                        <td className="p-4 text-slate-700">{record.location || '-'}</td>
                        <td className="p-4 text-slate-700">{record.taskType || '-'}</td>
                        <td className="p-4 text-slate-500 text-xs max-w-xs truncate" title={record.note}>{record.note || '-'}</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => deleteRecord(record.id)} 
                            className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded transition-all"
                            title="حذف هذا السجل"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
