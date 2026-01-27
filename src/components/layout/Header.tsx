import { useState } from 'react';
import {
  Building2,
  BarChart3,
  Calendar,
  Settings,
  LayoutDashboard,
  FileText,
  GitBranch,
  DollarSign,
  Award,
  Users,
  MessageSquare,
  AlertTriangle,
  ShoppingCart,
  UserCheck,
  Shield,
  RefreshCw,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  projectName: string;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ projectName, currentView, onViewChange }: HeaderProps) {
  const [showPMBOKMenu, setShowPMBOKMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'project-plan', label: 'Plan del Proyecto', icon: LayoutDashboard },
    { id: 'dashboard', label: 'EVM Dashboard', icon: BarChart3 },
    { id: 'activities', label: 'Actividades', icon: Calendar },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const pmbokPlans = [
    { id: 'integration', label: 'Integración', icon: FileText, description: 'Acta de Constitución' },
    { id: 'scope', label: 'Alcance', icon: GitBranch, description: 'EDT/WBS' },
    { id: 'schedule', label: 'Cronograma', icon: Calendar, description: 'Diagrama de Gantt' },
    { id: 'cost', label: 'Costos', icon: DollarSign, description: 'Presupuesto y EVM' },
    { id: 'quality', label: 'Calidad', icon: Award, description: 'Control de Calidad' },
    { id: 'resources', label: 'Recursos', icon: Users, description: 'Equipo y Materiales' },
    { id: 'communications', label: 'Comunicaciones', icon: MessageSquare, description: 'Matriz de Comunicaciones' },
    { id: 'risks', label: 'Riesgos', icon: AlertTriangle, description: 'Matriz de Riesgos' },
    { id: 'procurement', label: 'Adquisiciones', icon: ShoppingCart, description: 'Contratos' },
    { id: 'stakeholders', label: 'Interesados', icon: UserCheck, description: 'Stakeholders' },
    { id: 'hse', label: 'HSE', icon: Shield, description: 'Seguridad y Ambiente' },
    { id: 'changes', label: 'Cambios', icon: RefreshCw, description: 'Control de Cambios' }
  ];

  const navItems = mainNavItems;

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

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1">
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
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* PMBOK Plans Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPMBOKMenu(!showPMBOKMenu)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${pmbokPlans.some(p => currentView === p.id)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <FileText className="w-4 h-4" />
                <span>Planes PMBOK</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPMBOKMenu ? 'rotate-180' : ''}`} />
              </button>

              {showPMBOKMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPMBOKMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 max-h-[70vh] overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase">Planes de Gestión</p>
                    </div>
                    {pmbokPlans.map(plan => {
                      const Icon = plan.icon;
                      const isActive = currentView === plan.id;
                      return (
                        <button
                          key={plan.id}
                          onClick={() => {
                            onViewChange(plan.id);
                            setShowPMBOKMenu(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-left
                            transition-colors
                            ${isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">{plan.label}</p>
                            <p className="text-xs text-gray-500">{plan.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
                      ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-2 mt-2 border-t border-gray-200">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Planes PMBOK</p>
                {pmbokPlans.map(plan => {
                  const Icon = plan.icon;
                  const isActive = currentView === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => {
                        onViewChange(plan.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2 text-sm
                        ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {plan.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
