import { Building2, BarChart3, Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  projectName: string;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ projectName, currentView, onViewChange }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'activities', label: 'Actividades', icon: Calendar },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">EVM Pro</h1>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">{projectName}</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
