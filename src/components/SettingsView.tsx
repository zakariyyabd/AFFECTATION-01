import { ListManager } from './ListManager';
import { TaskManager } from './TaskManager';
import { SettingsData } from '../hooks/useSettings';

interface SettingsViewProps {
  settings: SettingsData;
  onUpdate: <K extends keyof SettingsData>(key: K, items: SettingsData[K]) => void;
}

export function SettingsView({ settings, onUpdate }: SettingsViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">إعدادات النظام</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">إدارة القوائم والخيارات المتاحة في لوحة التحكم</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <TaskManager
          items={settings.taskTypes}
          onChange={(items) => onUpdate('taskTypes', items)}
        />
        <ListManager
          title="أسماء السائقين (Drivers)"
          items={settings.drivers}
          onChange={(items) => onUpdate('drivers', items)}
          placeholder="اسم السائق..."
        />
        <ListManager
          title="Convoyeurs"
          items={settings.conveyors}
          onChange={(items) => onUpdate('conveyors', items)}
          placeholder="اسم Convoyeur..."
        />
        <ListManager
          title="أسماء العمال (Workers)"
          items={settings.workers}
          onChange={(items) => onUpdate('workers', items)}
          placeholder="اسم العامل..."
        />
      </div>
    </div>
    </div>
  );
}
