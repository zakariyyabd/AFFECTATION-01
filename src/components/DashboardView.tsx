import { useState, useEffect, type ChangeEvent } from 'react';
import { Plus, Trash2, Copy, CheckCircle2, Archive, AlertTriangle } from 'lucide-react';
import { SettingsData } from '../hooks/useSettings';
import { MultiSelect } from './MultiSelect';
import { Select } from './Select';
import { format } from 'date-fns';
import { useHistory, type HistoryRecord } from '../hooks/useHistory';

export interface Mission {
  id: string;
  location: string;
  taskType: string;
  drivers: string[];
  conveyors: string[];
  workers: string[];
  note: string;
}

interface DashboardViewProps {
  settings: SettingsData;
}

export function DashboardView({ settings }: DashboardViewProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [copied, setCopied] = useState(false);

  // Form state for new mission
  const [location, setLocation] = useState('');
  const [taskType, setTaskType] = useState('');
  const [drivers, setDrivers] = useState<string[]>([]);
  const [conveyors, setConveyors] = useState<string[]>([]);
  const [workers, setWorkers] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const { records, saveRecords, replaceRecordsForDate } = useHistory();
  const [archived, setArchived] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);

  const handleTaskTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTaskType(val);
    const foundTask = settings.taskTypes.find(t => t.name === val);
    if (foundTask && foundTask.location) {
      setLocation(foundTask.location);
    }
  };

  const handleCopyAndArchive = () => {
    if (!reportText) return;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (missions.length === 0) return;

    const hasExisting = records.some(r => r.date === date);
    if (hasExisting) {
      setShowOverwriteModal(true);
    } else {
      performArchive(false);
    }
  };

  const performArchive = (overwrite: boolean) => {
    const newRecords: HistoryRecord[] = [];
    missions.forEach(m => {
      m.drivers.forEach(name => newRecords.push({ id: crypto.randomUUID(), date, role: 'driver', name, location: m.location, taskType: m.taskType, note: m.note, timestamp: Date.now() }));
      m.conveyors.forEach(name => newRecords.push({ id: crypto.randomUUID(), date, role: 'conveyor', name, location: m.location, taskType: m.taskType, note: m.note, timestamp: Date.now() }));
      m.workers.forEach(name => newRecords.push({ id: crypto.randomUUID(), date, role: 'worker', name, location: m.location, taskType: m.taskType, note: m.note, timestamp: Date.now() }));
    });
    
    if (overwrite) {
      replaceRecordsForDate(date, newRecords);
    } else {
      saveRecords(newRecords);
    }
    
    setMissions([]);
    setShowOverwriteModal(false);
    setArchived(true);
    setTimeout(() => setArchived(false), 2000);
  };

  const handleAddMission = () => {
    // Add even if partially empty, to let them create flexible blocks
    const newMission: Mission = {
      id: crypto.randomUUID(),
      location,
      taskType,
      drivers,
      conveyors,
      workers,
      note,
    };
    
    setMissions([...missions, newMission]);
    
    // Reset form
    setLocation('');
    setTaskType('');
    setDrivers([]);
    setConveyors([]);
    setWorkers([]);
    setNote('');
  };

  const handleDeleteMission = (id: string) => {
    setMissions(missions.filter(m => m.id !== id));
  };

  const generateReportText = () => {
    if (!date) return '';
    try {
      // Split to avoid timezone conversion issues on purely string matching
      const [year, month, day] = date.split('-');
      const dateStr = `${day}/${month}/${year}`;
      let output = `📅 ${dateStr}\n\n`;

      missions.forEach(mission => {
        const locTask = [mission.location, mission.taskType].filter(Boolean).join('  ');
        if (locTask) {
          output += `- 📍 ${locTask}\n`;
        }

        if (mission.drivers.length > 0) {
          output += `- 🚚 ${mission.drivers.join(' + ')}\n`;
        }

        if (mission.conveyors.length > 0) {
          output += `- 🧑‍🔧 ${mission.conveyors.join(' + ')}  convoyeur\n`;
        }

        if (mission.workers.length > 0) {
          const workerLines = mission.workers.map(w => `- 👷 ${w}`);
          output += workerLines.join('\n') + '\n';
        }

        if (mission.note) {
          output += `- 📝 ${mission.note}\n`;
        }

        output += '\n'; // Blank line between missions
      });

      return output.trim();
    } catch (e) {
      return '';
    }
  };

  const reportText = generateReportText();

  return (
    <div className="flex-1 overflow-y-auto lg:overflow-hidden bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-full">
        
        {/* Left Column: Form */}
        <section className="lg:col-span-7 p-6 sm:p-8 bg-white lg:border-l border-slate-200 flex flex-col overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <span>📅</span> إدخال بيانات التكليف اليومية
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">التاريخ</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">نوع المهمة</label>
                <Select value={taskType} onChange={handleTaskTypeChange}>
                  <option value="">-- إختر نوع المهمة --</option>
                  {settings.taskTypes.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">المكان / الموقع</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="مثلاً: مراكش، تيزرت..."
                  className="w-full p-2.5 border border-slate-200 rounded-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">السائق</label>
                <MultiSelect
                  options={settings.drivers}
                  selected={drivers}
                  onChange={setDrivers}
                  placeholder="إختر السائقين..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">الـ Convoyeur</label>
                <MultiSelect
                  options={settings.conveyors}
                  selected={conveyors}
                  onChange={setConveyors}
                  placeholder="إختر Convoyeurs..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">العامل</label>
                <MultiSelect
                  options={settings.workers}
                  selected={workers}
                  onChange={setWorkers}
                  placeholder="إختر العمال..."
                />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">ملاحظات إضافية</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أضف ملاحظة هنا..."
              className="w-full h-24 p-3 border border-slate-200 rounded-sm bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            
            <button
              onClick={handleAddMission}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              إضافة المهمة
            </button>
          </div>
        </section>

        {/* Right Column: Preview & Added Missions */}
        <section className="lg:col-span-5 p-6 sm:p-8 bg-slate-100 flex flex-col overflow-y-auto">
          
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">📱 معاينة نص الواتساب</h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-sm uppercase">
              WhatsApp Ready
            </span>
          </div>
          
          <div className="flex-1 bg-white p-6 border border-slate-200 rounded-lg shadow-inner font-mono text-sm leading-relaxed overflow-hidden flex flex-col min-h-[300px]">
            <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-slate-800" dir="rtl">
              {reportText || (
                <span className="text-slate-400 italic">أضف مهام لظهور النص هنا...</span>
              )}
            </div>
            
            <div className="mt-4 shrink-0">
              <button
                onClick={handleCopyAndArchive}
                disabled={!reportText}
                className="w-full py-3 bg-emerald-600 text-white rounded-sm font-bold flex items-center justify-center space-x-reverse space-x-2 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]"
              >
                {copied && archived ? <CheckCircle2 className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                <span>{copied && archived ? 'تم النسخ والأرشفة بنجاح!' : 'نسخ النص وأرشفة السجل'}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-[11px] text-slate-400 font-medium shrink-0">
            <div className="flex items-center space-x-reverse space-x-2 border-r border-slate-300 pr-4">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>تحديث تلقائي للنص</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>جاهز للإرسال</span>
            </div>
          </div>

          {missions.length > 0 && (
            <div className="mt-8 shrink-0">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4 flex justify-between items-center">
                <span>📋 المهام السابقة ({missions.length})</span>
                <button 
                  onClick={() => setMissions([])}
                  className="text-red-500 hover:text-red-700"
                >
                  مسح الكل
                </button>
              </h3>
              <div className="space-y-3">
                {missions.map((m, i) => (
                  <div key={m.id} className="bg-white border border-slate-200 rounded-md p-3 flex justify-between items-start shadow-sm">
                    <div className="text-sm">
                      <div className="font-semibold text-slate-800">
                        مهمة {i + 1}: {m.location} {m.taskType}
                      </div>
                      {(m.drivers.length > 0 || m.conveyors.length > 0 || m.workers.length > 0) && (
                        <div className="text-slate-500 mt-1 flex gap-2 flex-wrap text-xs">
                          {m.drivers.length > 0 && <span>🚚 {m.drivers.length}</span>}
                          {m.conveyors.length > 0 && <span>🧑‍🔧 {m.conveyors.length}</span>}
                          {m.workers.length > 0 && <span>👷 {m.workers.length}</span>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteMission(m.id)}
                      className="text-slate-400 hover:text-red-500 p-1 hover:bg-slate-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </div>

      {showOverwriteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">تنبيه: سجل مكرر</h3>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed">
              لقد قمت مسبقاً بنسخ وأرشفة مهام في نفس هذا التاريخ <strong className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded font-mono" dir="ltr">{date}</strong>. 
              <br/><br/>
              هل توافق على كتابة هذه المهام الجديدة <strong>مكان السجل السابق</strong> أم تفضل <strong>تغيير التاريخ</strong>؟
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowOverwriteModal(false)}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-sm font-bold text-sm transition-colors"
              >
                تغيير التاريخ
              </button>
              <button
                onClick={() => performArchive(true)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-sm font-bold text-sm transition-colors shadow-sm"
              >
                استبدال السابق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
