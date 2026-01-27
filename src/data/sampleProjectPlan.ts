import type { ProjectManagementPlan } from '../types/pmbok';

export const sampleProjectManagementPlan: ProjectManagementPlan = {
  id: 'pmp-001',
  projectId: 'proj-001',
  version: '1.0',
  status: 'active',
  createdDate: '2024-01-15',
  lastUpdated: '2024-06-15',
  approvedBy: 'Ing. Roberto García',
  approvalDate: '2024-01-20',

  projectCharter: {
    id: 'charter-001',
    projectId: 'proj-001',
    title: 'Construcción de Edificio Residencial Torre Norte',
    purpose: 'Construir un edificio residencial de 8 niveles con 32 departamentos, estacionamiento subterráneo y áreas comunes, para satisfacer la demanda de vivienda de calidad en la zona norte de la ciudad.',
    objectives: [
      {
        id: 'obj-001',
        description: 'Completar la construcción dentro del presupuesto aprobado',
        type: 'cost',
        metric: 'Costo total del proyecto',
        target: '$45,000,000 MXN',
        priority: 'high'
      },
      {
        id: 'obj-002',
        description: 'Entregar el proyecto en la fecha programada',
        type: 'schedule',
        metric: 'Fecha de entrega',
        target: 'Diciembre 2024',
        priority: 'high'
      },
      {
        id: 'obj-003',
        description: 'Cumplir con los estándares de calidad establecidos',
        type: 'quality',
        metric: 'Índice de calidad',
        target: '95% de conformidad',
        priority: 'high'
      },
      {
        id: 'obj-004',
        description: 'Mantener cero accidentes fatales',
        type: 'other',
        metric: 'Incidentes de seguridad',
        target: '0 fatalidades',
        priority: 'high'
      }
    ],
    scope: {
      inScope: [
        'Construcción de estructura de 8 niveles',
        'Instalaciones eléctricas e hidrosanitarias',
        'Acabados interiores de departamentos',
        'Áreas comunes (lobby, gimnasio, salón de eventos)',
        'Estacionamiento subterráneo para 64 vehículos',
        'Sistema de elevadores (2 unidades)',
        'Sistema contra incendios',
        'Jardines y áreas verdes exteriores'
      ],
      outOfScope: [
        'Mobiliario de departamentos',
        'Equipamiento de gimnasio',
        'Decoración interior personalizada',
        'Conexiones de servicios externos (CFE, agua)',
        'Permisos y licencias (responsabilidad del cliente)'
      ]
    },
    deliverables: [
      {
        id: 'del-001',
        name: 'Cimentación completa',
        description: 'Zapatas, contratrabes y losa de cimentación terminadas',
        wbsCode: '1.2',
        dueDate: '2024-03-15',
        acceptanceCriteria: ['Pruebas de compactación aprobadas', 'Revisión estructural aprobada'],
        status: 'approved',
        assignedTo: 'Ing. Carlos Mendoza',
        approvedBy: 'Ing. Roberto García',
        approvalDate: '2024-03-18'
      },
      {
        id: 'del-002',
        name: 'Estructura completa',
        description: 'Columnas, trabes, losas y muros de todos los niveles',
        wbsCode: '1.3',
        dueDate: '2024-06-30',
        acceptanceCriteria: ['Pruebas de resistencia de concreto', 'Plomeo y niveles verificados'],
        status: 'in_progress',
        assignedTo: 'Ing. Carlos Mendoza'
      },
      {
        id: 'del-003',
        name: 'Instalaciones completas',
        description: 'Sistemas eléctricos, hidráulicos, sanitarios y gas',
        wbsCode: '1.4',
        dueDate: '2024-09-15',
        acceptanceCriteria: ['Pruebas de presión hidráulica', 'Certificación eléctrica'],
        status: 'pending',
        assignedTo: 'Ing. Ana López'
      },
      {
        id: 'del-004',
        name: 'Acabados terminados',
        description: 'Pisos, pintura, carpintería y herrería',
        wbsCode: '1.5',
        dueDate: '2024-11-30',
        acceptanceCriteria: ['Inspección visual aprobada', 'Lista de verificación de acabados'],
        status: 'pending',
        assignedTo: 'Arq. María Fernández'
      }
    ],
    milestones: [
      {
        id: 'ms-001',
        name: 'Inicio de obra',
        description: 'Inicio formal de trabajos de construcción',
        plannedDate: '2024-01-15',
        actualDate: '2024-01-15',
        status: 'achieved',
        dependencies: [],
        deliverables: [],
        isCritical: true
      },
      {
        id: 'ms-002',
        name: 'Cimentación terminada',
        description: 'Conclusión de trabajos de cimentación',
        plannedDate: '2024-03-15',
        actualDate: '2024-03-18',
        status: 'achieved',
        dependencies: ['ms-001'],
        deliverables: ['del-001'],
        isCritical: true
      },
      {
        id: 'ms-003',
        name: 'Estructura 50%',
        description: 'Avance del 50% en estructura (4 niveles)',
        plannedDate: '2024-05-15',
        actualDate: '2024-05-20',
        status: 'achieved',
        dependencies: ['ms-002'],
        deliverables: [],
        isCritical: true
      },
      {
        id: 'ms-004',
        name: 'Estructura completa',
        description: 'Conclusión de trabajos estructurales',
        plannedDate: '2024-06-30',
        status: 'at_risk',
        dependencies: ['ms-003'],
        deliverables: ['del-002'],
        isCritical: true
      },
      {
        id: 'ms-005',
        name: 'Instalaciones completas',
        description: 'Conclusión de instalaciones MEP',
        plannedDate: '2024-09-15',
        status: 'pending',
        dependencies: ['ms-004'],
        deliverables: ['del-003'],
        isCritical: true
      },
      {
        id: 'ms-006',
        name: 'Acabados completos',
        description: 'Conclusión de trabajos de acabados',
        plannedDate: '2024-11-30',
        status: 'pending',
        dependencies: ['ms-005'],
        deliverables: ['del-004'],
        isCritical: true
      },
      {
        id: 'ms-007',
        name: 'Entrega final',
        description: 'Entrega del proyecto al cliente',
        plannedDate: '2024-12-15',
        status: 'pending',
        dependencies: ['ms-006'],
        deliverables: [],
        isCritical: true
      }
    ],
    assumptions: [
      'El clima permitirá trabajar al menos 22 días al mes',
      'Los materiales estarán disponibles según el programa de adquisiciones',
      'El cliente proporcionará los permisos necesarios a tiempo',
      'No habrá cambios significativos en el diseño después de la aprobación',
      'La mano de obra calificada estará disponible según lo planificado',
      'Los servicios públicos (agua, electricidad) estarán disponibles en el sitio'
    ],
    constraints: [
      'Presupuesto máximo de $45,000,000 MXN',
      'Fecha límite de entrega: 15 de diciembre de 2024',
      'Horario de trabajo: 7:00 AM - 6:00 PM de lunes a sábado',
      'Restricciones de ruido después de las 8:00 PM',
      'Acceso limitado por la calle principal',
      'Altura máxima permitida: 28 metros'
    ],
    risks: [
      'Retrasos por condiciones climáticas adversas',
      'Incremento en precios de materiales de construcción',
      'Escasez de mano de obra calificada',
      'Cambios en regulaciones de construcción',
      'Problemas geotécnicos no detectados',
      'Retrasos en entrega de materiales importados'
    ],
    budget: {
      estimated: 45000000,
      contingency: 4500000,
      currency: 'MXN'
    },
    timeline: {
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      duration: 335
    },
    stakeholders: ['Cliente', 'Residentes vecinos', 'Autoridades municipales', 'Subcontratistas'],
    projectManager: {
      id: 'pm-001',
      name: 'Ing. Roberto García',
      email: 'roberto.garcia@constructora.com',
      phone: '+52 555 123 4567',
      role: 'Director de Proyecto',
      department: 'Proyectos',
      organization: 'Constructora del Norte S.A.',
      skills: [
        { name: 'Gestión de Proyectos', level: 'expert', yearsExperience: 15 },
        { name: 'Construcción', level: 'expert', yearsExperience: 20 }
      ],
      certifications: [
        { name: 'PMP', issuingBody: 'PMI', dateObtained: '2015-06-15', status: 'valid' }
      ],
      availability: { percentAllocation: 100, startDate: '2024-01-15', endDate: '2024-12-15', exceptions: [] },
      costRate: 150000,
      costRateUnit: 'month',
      startDate: '2024-01-15',
      status: 'active'
    },
    sponsor: {
      id: 'sp-001',
      name: 'Lic. Fernando Martínez',
      email: 'fernando.martinez@inversionistas.com',
      phone: '+52 555 987 6543',
      role: 'Patrocinador del Proyecto',
      department: 'Dirección General',
      organization: 'Grupo Inversionista del Norte',
      skills: [],
      certifications: [],
      availability: { percentAllocation: 10, startDate: '2024-01-15', endDate: '2024-12-15', exceptions: [] },
      costRate: 0,
      costRateUnit: 'month',
      startDate: '2024-01-15',
      status: 'active'
    },
    version: '1.0',
    lastUpdated: '2024-06-15'
  },

  scopeManagementPlan: {
    id: 'scope-001',
    projectId: 'proj-001',
    scopeStatement: {
      projectDescription: 'Construcción de edificio residencial de 8 niveles con estacionamiento subterráneo',
      productScope: '32 departamentos, áreas comunes, estacionamiento para 64 vehículos',
      projectScope: 'Diseño ejecutivo, construcción, instalaciones y acabados completos',
      acceptanceCriteria: ['Cumplimiento de planos aprobados', 'Pruebas de calidad satisfactorias'],
      deliverables: [],
      exclusions: ['Mobiliario', 'Equipamiento de gimnasio'],
      constraints: ['Presupuesto', 'Tiempo', 'Regulaciones locales'],
      assumptions: ['Disponibilidad de materiales', 'Permisos otorgados']
    },
    wbs: {
      id: 'wbs-root',
      code: '1',
      name: 'Edificio Residencial Torre Norte',
      description: 'Proyecto completo de construcción',
      level: 0,
      children: [
        {
          id: 'wbs-1.1',
          code: '1.1',
          name: 'Preliminares',
          description: 'Trabajos preliminares y preparación del sitio',
          level: 1,
          parentId: 'wbs-root',
          children: [
            { id: 'wbs-1.1.1', code: '1.1.1', name: 'Limpieza de terreno', description: '', level: 2, parentId: 'wbs-1.1', children: [], isWorkPackage: true, plannedCost: 150000, plannedDuration: 5 },
            { id: 'wbs-1.1.2', code: '1.1.2', name: 'Trazo y nivelación', description: '', level: 2, parentId: 'wbs-1.1', children: [], isWorkPackage: true, plannedCost: 200000, plannedDuration: 3 },
            { id: 'wbs-1.1.3', code: '1.1.3', name: 'Instalaciones provisionales', description: '', level: 2, parentId: 'wbs-1.1', children: [], isWorkPackage: true, plannedCost: 350000, plannedDuration: 7 }
          ],
          isWorkPackage: false,
          plannedCost: 700000,
          plannedDuration: 15
        },
        {
          id: 'wbs-1.2',
          code: '1.2',
          name: 'Cimentación',
          description: 'Trabajos de cimentación profunda',
          level: 1,
          parentId: 'wbs-root',
          children: [
            { id: 'wbs-1.2.1', code: '1.2.1', name: 'Excavación', description: '', level: 2, parentId: 'wbs-1.2', children: [], isWorkPackage: true, plannedCost: 1500000, plannedDuration: 20 },
            { id: 'wbs-1.2.2', code: '1.2.2', name: 'Zapatas', description: '', level: 2, parentId: 'wbs-1.2', children: [], isWorkPackage: true, plannedCost: 2000000, plannedDuration: 15 },
            { id: 'wbs-1.2.3', code: '1.2.3', name: 'Contratrabes', description: '', level: 2, parentId: 'wbs-1.2', children: [], isWorkPackage: true, plannedCost: 1800000, plannedDuration: 12 },
            { id: 'wbs-1.2.4', code: '1.2.4', name: 'Losa de cimentación', description: '', level: 2, parentId: 'wbs-1.2', children: [], isWorkPackage: true, plannedCost: 2500000, plannedDuration: 10 }
          ],
          isWorkPackage: false,
          plannedCost: 7800000,
          plannedDuration: 57
        },
        {
          id: 'wbs-1.3',
          code: '1.3',
          name: 'Estructura',
          description: 'Estructura de concreto armado',
          level: 1,
          parentId: 'wbs-root',
          children: [
            { id: 'wbs-1.3.1', code: '1.3.1', name: 'Columnas', description: '', level: 2, parentId: 'wbs-1.3', children: [], isWorkPackage: true, plannedCost: 4500000, plannedDuration: 45 },
            { id: 'wbs-1.3.2', code: '1.3.2', name: 'Trabes', description: '', level: 2, parentId: 'wbs-1.3', children: [], isWorkPackage: true, plannedCost: 3500000, plannedDuration: 40 },
            { id: 'wbs-1.3.3', code: '1.3.3', name: 'Losas', description: '', level: 2, parentId: 'wbs-1.3', children: [], isWorkPackage: true, plannedCost: 5000000, plannedDuration: 50 },
            { id: 'wbs-1.3.4', code: '1.3.4', name: 'Escaleras', description: '', level: 2, parentId: 'wbs-1.3', children: [], isWorkPackage: true, plannedCost: 800000, plannedDuration: 20 }
          ],
          isWorkPackage: false,
          plannedCost: 13800000,
          plannedDuration: 90
        },
        {
          id: 'wbs-1.4',
          code: '1.4',
          name: 'Instalaciones',
          description: 'Instalaciones MEP',
          level: 1,
          parentId: 'wbs-root',
          children: [
            { id: 'wbs-1.4.1', code: '1.4.1', name: 'Instalación eléctrica', description: '', level: 2, parentId: 'wbs-1.4', children: [], isWorkPackage: true, plannedCost: 3000000, plannedDuration: 60 },
            { id: 'wbs-1.4.2', code: '1.4.2', name: 'Instalación hidráulica', description: '', level: 2, parentId: 'wbs-1.4', children: [], isWorkPackage: true, plannedCost: 2500000, plannedDuration: 45 },
            { id: 'wbs-1.4.3', code: '1.4.3', name: 'Instalación sanitaria', description: '', level: 2, parentId: 'wbs-1.4', children: [], isWorkPackage: true, plannedCost: 2000000, plannedDuration: 40 },
            { id: 'wbs-1.4.4', code: '1.4.4', name: 'Sistema contra incendios', description: '', level: 2, parentId: 'wbs-1.4', children: [], isWorkPackage: true, plannedCost: 1500000, plannedDuration: 30 }
          ],
          isWorkPackage: false,
          plannedCost: 9000000,
          plannedDuration: 75
        },
        {
          id: 'wbs-1.5',
          code: '1.5',
          name: 'Acabados',
          description: 'Acabados interiores y exteriores',
          level: 1,
          parentId: 'wbs-root',
          children: [
            { id: 'wbs-1.5.1', code: '1.5.1', name: 'Aplanados', description: '', level: 2, parentId: 'wbs-1.5', children: [], isWorkPackage: true, plannedCost: 2000000, plannedDuration: 40 },
            { id: 'wbs-1.5.2', code: '1.5.2', name: 'Pisos', description: '', level: 2, parentId: 'wbs-1.5', children: [], isWorkPackage: true, plannedCost: 3500000, plannedDuration: 35 },
            { id: 'wbs-1.5.3', code: '1.5.3', name: 'Pintura', description: '', level: 2, parentId: 'wbs-1.5', children: [], isWorkPackage: true, plannedCost: 1500000, plannedDuration: 30 },
            { id: 'wbs-1.5.4', code: '1.5.4', name: 'Carpintería', description: '', level: 2, parentId: 'wbs-1.5', children: [], isWorkPackage: true, plannedCost: 2500000, plannedDuration: 40 }
          ],
          isWorkPackage: false,
          plannedCost: 9500000,
          plannedDuration: 60
        }
      ],
      isWorkPackage: false,
      plannedCost: 45000000,
      plannedDuration: 335
    },
    wbsDictionary: [],
    scopeBaseline: {
      approvedScope: 'Construcción completa de edificio residencial',
      approvedWBS: {} as any,
      approvedDate: '2024-01-20',
      version: '1.0',
      changes: []
    },
    changeControlProcess: 'Todas las solicitudes de cambio deben ser aprobadas por el CCB',
    scopeVerificationProcess: 'Inspección formal de entregables contra criterios de aceptación',
    requirementsTraceabilityMatrix: []
  },

  scheduleManagementPlan: {
    id: 'schedule-001',
    projectId: 'proj-001',
    methodology: 'critical_path',
    schedulingTool: 'Microsoft Project',
    unitOfMeasure: 'days',
    levelOfAccuracy: '±5%',
    controlThresholds: { variance: 10, unit: 'percent' },
    reportingFormats: ['Diagrama de Gantt', 'Curva S', 'Reporte semanal'],
    activities: [],
    dependencies: [],
    criticalPath: ['1.2.1', '1.2.2', '1.3.1', '1.3.3', '1.5.2'],
    baselineSchedule: {
      id: 'baseline-001',
      version: '1.0',
      approvedDate: '2024-01-20',
      approvedBy: 'Ing. Roberto García',
      activities: [],
      milestones: [],
      criticalPath: []
    },
    calendars: [
      {
        id: 'cal-001',
        name: 'Calendario Estándar',
        description: 'Calendario de trabajo normal',
        workingDays: [1, 2, 3, 4, 5, 6],
        workingHours: { start: '07:00', end: '18:00' },
        holidays: [
          { date: '2024-01-01', name: 'Año Nuevo', isRecurring: true },
          { date: '2024-02-05', name: 'Día de la Constitución', isRecurring: true },
          { date: '2024-03-18', name: 'Natalicio de Benito Juárez', isRecurring: true }
        ],
        exceptions: []
      }
    ]
  },

  costManagementPlan: {
    id: 'cost-001',
    projectId: 'proj-001',
    unitOfMeasure: 'MXN',
    levelOfPrecision: 2,
    levelOfAccuracy: '±10%',
    controlThresholds: { costVariance: 5, unit: 'percent' },
    rulesOfPerformance: ['Medición del valor ganado mensual', 'Análisis de varianzas semanales'],
    reportingFormats: ['Reporte de costos mensual', 'Curva S', 'Análisis EVM'],
    costEstimates: [],
    costBaseline: {
      id: 'cb-001',
      version: '1.0',
      approvedDate: '2024-01-20',
      approvedBy: 'Lic. Fernando Martínez',
      totalBudget: 45000000,
      managementReserve: 2250000,
      contingencyReserve: 4500000,
      performanceMeasurementBaseline: 38250000,
      periodDistribution: []
    },
    fundingRequirements: [],
    cashFlow: []
  },

  qualityManagementPlan: {
    id: 'quality-001',
    projectId: 'proj-001',
    qualityPolicy: 'Comprometidos con la excelencia en construcción, cumpliendo todos los estándares de calidad aplicables y superando las expectativas del cliente mediante mejora continua.',
    qualityObjectives: [
      {
        id: 'qo-001',
        description: 'Mantener índice de retrabajo menor al 2%',
        metric: 'Porcentaje de retrabajo',
        target: 2,
        tolerance: 0.5,
        unit: '%',
        measurementMethod: 'Registro de retrabajos / Total de actividades',
        frequency: 'Mensual',
        responsible: 'Ing. de Calidad'
      },
      {
        id: 'qo-002',
        description: 'Lograr 100% de conformidad en pruebas de concreto',
        metric: 'Pruebas de concreto conformes',
        target: 100,
        tolerance: 2,
        unit: '%',
        measurementMethod: 'Pruebas aprobadas / Total de pruebas',
        frequency: 'Por colado',
        responsible: 'Laboratorio'
      }
    ],
    qualityStandards: [
      {
        id: 'qs-001',
        name: 'NMX-C-083-ONNCCE',
        code: 'NMX-C-083',
        description: 'Determinación de la resistencia a la compresión de cilindros de concreto',
        type: 'national',
        applicableTo: ['Concreto estructural'],
        requirements: ['Muestreo según norma', 'Curado estándar', 'Ensayo a 28 días']
      },
      {
        id: 'qs-002',
        name: 'NOM-001-SEDE',
        code: 'NOM-001-SEDE',
        description: 'Instalaciones eléctricas',
        type: 'national',
        applicableTo: ['Instalaciones eléctricas'],
        requirements: ['Diseño según norma', 'Materiales certificados', 'Verificación por UVIE']
      }
    ],
    qualityRoles: [
      {
        role: 'Gerente de Calidad',
        responsibilities: ['Supervisión del sistema de calidad', 'Aprobación de procedimientos'],
        authority: ['Detener trabajos por no conformidad'],
        qualifications: ['Ingeniero Civil', '5 años de experiencia'],
        person: 'Ing. Patricia Ruiz'
      }
    ],
    qualityMetrics: [
      {
        id: 'qm-001',
        name: 'Índice de Calidad de Concreto',
        description: 'Porcentaje de pruebas de concreto que cumplen especificaciones',
        formula: '(Pruebas aprobadas / Total pruebas) x 100',
        unit: '%',
        target: 98,
        upperLimit: 100,
        lowerLimit: 95,
        frequency: 'weekly',
        dataSource: 'Reportes de laboratorio',
        responsible: 'Ing. de Calidad',
        currentValue: 97.5,
        trend: 'stable'
      }
    ],
    qualityControlActivities: [],
    qualityAssuranceActivities: [],
    inspectionCheckpoints: [
      {
        id: 'ic-001',
        name: 'Inspección de Acero de Refuerzo',
        wbsCode: '1.3.1',
        phase: 'Estructura',
        description: 'Verificación de armado de acero antes de colado',
        inspectionType: 'hold_point',
        criteria: ['Diámetros según planos', 'Recubrimientos mínimos', 'Traslapes adecuados'],
        checklist: [
          { id: 'cl-001', description: 'Diámetros de varillas', requirement: 'Según planos', status: 'ok' },
          { id: 'cl-002', description: 'Separación de estribos', requirement: 'Según planos', status: 'ok' },
          { id: 'cl-003', description: 'Recubrimiento mínimo', requirement: '4 cm', status: 'ok' }
        ],
        requiredApprovals: ['Ing. Estructural', 'Supervisión'],
        status: 'passed',
        inspectionDate: '2024-05-10',
        inspector: 'Ing. Carlos Mendoza'
      }
    ],
    nonConformanceProcess: {
      identificationProcedure: 'Cualquier persona puede identificar y reportar no conformidades',
      documentationRequirements: ['Formulario de NC', 'Fotografías', 'Ubicación exacta'],
      dispositionOptions: ['Reparar', 'Rehacer', 'Aceptar con desviación', 'Rechazar'],
      approvalAuthorities: [
        { level: 'Menor', description: 'NC sin impacto estructural', authority: 'Residente', monetaryLimit: 50000 },
        { level: 'Mayor', description: 'NC con impacto estructural', authority: 'Gerente de Proyecto', monetaryLimit: 500000 }
      ],
      trackingSystem: 'Sistema de gestión de calidad'
    },
    continuousImprovement: {
      methodology: 'PDCA',
      tools: ['Diagrama de Pareto', 'Ishikawa', '5 Por qués'],
      meetingSchedule: 'Mensual',
      kpis: ['Índice de calidad', 'Costo de no calidad'],
      improvementProjects: []
    }
  },

  resourceManagementPlan: {
    id: 'resource-001',
    projectId: 'proj-001',
    humanResources: {
      organizationalChart: {
        id: 'org-root',
        name: 'Director de Proyecto',
        role: 'Dirección General',
        person: {
          id: 'pm-001',
          name: 'Ing. Roberto García',
          email: 'roberto.garcia@constructora.com',
          phone: '+52 555 123 4567',
          role: 'Director de Proyecto',
          department: 'Proyectos',
          organization: 'Constructora del Norte S.A.',
          skills: [],
          certifications: [],
          availability: { percentAllocation: 100, startDate: '2024-01-15', endDate: '2024-12-15', exceptions: [] },
          costRate: 150000,
          costRateUnit: 'month',
          startDate: '2024-01-15',
          status: 'active'
        },
        children: [
          {
            id: 'org-001',
            name: 'Residente de Obra',
            role: 'Supervisión de Campo',
            person: {
              id: 'res-001',
              name: 'Ing. Carlos Mendoza',
              email: 'carlos.mendoza@constructora.com',
              phone: '+52 555 234 5678',
              role: 'Residente de Obra',
              department: 'Construcción',
              organization: 'Constructora del Norte S.A.',
              skills: [{ name: 'Supervisión de obra', level: 'expert', yearsExperience: 10 }],
              certifications: [],
              availability: { percentAllocation: 100, startDate: '2024-01-15', endDate: '2024-12-15', exceptions: [] },
              costRate: 80000,
              costRateUnit: 'month',
              startDate: '2024-01-15',
              status: 'active'
            },
            children: [],
            reportingTo: 'org-root'
          },
          {
            id: 'org-002',
            name: 'Coordinador de Instalaciones',
            role: 'Instalaciones MEP',
            person: {
              id: 'coord-001',
              name: 'Ing. Ana López',
              email: 'ana.lopez@constructora.com',
              phone: '+52 555 345 6789',
              role: 'Coordinador de Instalaciones',
              department: 'Instalaciones',
              organization: 'Constructora del Norte S.A.',
              skills: [{ name: 'Instalaciones eléctricas', level: 'advanced', yearsExperience: 8 }],
              certifications: [],
              availability: { percentAllocation: 100, startDate: '2024-04-01', endDate: '2024-12-15', exceptions: [] },
              costRate: 70000,
              costRateUnit: 'month',
              startDate: '2024-04-01',
              status: 'active'
            },
            children: [],
            reportingTo: 'org-root'
          }
        ],
        reportingTo: undefined
      },
      roles: [],
      teamMembers: [
        {
          id: 'pm-001',
          name: 'Ing. Roberto García',
          email: 'roberto.garcia@constructora.com',
          phone: '+52 555 123 4567',
          role: 'Director de Proyecto',
          department: 'Proyectos',
          organization: 'Constructora del Norte S.A.',
          skills: [
            { name: 'Gestión de Proyectos', level: 'expert', yearsExperience: 15 },
            { name: 'Construcción', level: 'expert', yearsExperience: 20 }
          ],
          certifications: [
            { name: 'PMP', issuingBody: 'PMI', dateObtained: '2015-06-15', status: 'valid' }
          ],
          availability: { percentAllocation: 100, startDate: '2024-01-15', endDate: '2024-12-15', exceptions: [] },
          costRate: 150000,
          costRateUnit: 'month',
          startDate: '2024-01-15',
          status: 'active'
        },
        {
          id: 'res-001',
          name: 'Ing. Carlos Mendoza',
          email: 'carlos.mendoza@constructora.com',
          phone: '+52 555 234 5678',
          role: 'Residente de Obra',
          department: 'Construcción',
          organization: 'Constructora del Norte S.A.',
          skills: [
            { name: 'Supervisión de obra', level: 'expert', yearsExperience: 10 },
            { name: 'Control de calidad', level: 'advanced', yearsExperience: 8 }
          ],
          certifications: [],
          availability: { percentAllocation: 100, startDate: '2024-01-15', endDate: '2024-12-15', exceptions: [] },
          costRate: 80000,
          costRateUnit: 'month',
          startDate: '2024-01-15',
          status: 'active'
        },
        {
          id: 'coord-001',
          name: 'Ing. Ana López',
          email: 'ana.lopez@constructora.com',
          phone: '+52 555 345 6789',
          role: 'Coordinador de Instalaciones',
          department: 'Instalaciones',
          organization: 'Constructora del Norte S.A.',
          skills: [
            { name: 'Instalaciones eléctricas', level: 'advanced', yearsExperience: 8 },
            { name: 'Instalaciones hidráulicas', level: 'advanced', yearsExperience: 6 }
          ],
          certifications: [],
          availability: { percentAllocation: 100, startDate: '2024-04-01', endDate: '2024-12-15', exceptions: [] },
          costRate: 70000,
          costRateUnit: 'month',
          startDate: '2024-04-01',
          status: 'active'
        }
      ],
      raciMatrix: [
        {
          activity: 'Revisión de planos',
          wbsCode: '1.0',
          responsible: ['Ing. Carlos Mendoza'],
          accountable: 'Ing. Roberto García',
          consulted: ['Arq. María Fernández'],
          informed: ['Lic. Fernando Martínez']
        },
        {
          activity: 'Supervisión de cimentación',
          wbsCode: '1.2',
          responsible: ['Ing. Carlos Mendoza'],
          accountable: 'Ing. Roberto García',
          consulted: ['Ing. Estructural'],
          informed: ['Lic. Fernando Martínez']
        },
        {
          activity: 'Coordinación de instalaciones',
          wbsCode: '1.4',
          responsible: ['Ing. Ana López'],
          accountable: 'Ing. Roberto García',
          consulted: ['Ing. Carlos Mendoza'],
          informed: ['Lic. Fernando Martínez']
        }
      ],
      staffingPlan: [
        {
          role: 'Albañil',
          quantity: 20,
          startDate: '2024-02-01',
          endDate: '2024-11-30',
          skills: ['Albañilería', 'Acabados'],
          source: 'contractor',
          status: 'assigned'
        },
        {
          role: 'Electricista',
          quantity: 8,
          startDate: '2024-04-01',
          endDate: '2024-11-15',
          skills: ['Instalaciones eléctricas', 'NOM-001-SEDE'],
          source: 'contractor',
          status: 'assigned'
        }
      ],
      trainingNeeds: [
        {
          id: 'tn-001',
          topic: 'Seguridad en Alturas',
          description: 'Capacitación en trabajos en alturas y uso de equipo de protección',
          targetAudience: ['Albañiles', 'Fierreros'],
          type: 'safety',
          priority: 'high',
          duration: 8,
          provider: 'Externo',
          cost: 25000,
          status: 'completed'
        }
      ],
      recognitionPlan: 'Reconocimiento mensual al mejor equipo',
      safetyRequirements: ['Uso obligatorio de EPP', 'Capacitación en seguridad']
    },
    materialResources: {
      materials: [
        {
          id: 'mat-001',
          code: 'CONC-001',
          name: 'Concreto f\'c=250 kg/cm²',
          description: 'Concreto premezclado para elementos estructurales',
          category: 'concrete',
          unit: 'm³',
          unitCost: 2500,
          totalQuantityRequired: 3500,
          leadTime: 1,
          suppliers: ['Cemex', 'Holcim'],
          specifications: 'f\'c=250 kg/cm², revenimiento 14±2 cm',
          qualityRequirements: ['Certificado de calidad', 'Pruebas de revenimiento'],
          storageRequirements: 'N/A - Entrega directa',
          hazardous: false,
          msdsRequired: false
        },
        {
          id: 'mat-002',
          code: 'ACER-001',
          name: 'Acero de refuerzo',
          description: 'Varilla corrugada fy=4200 kg/cm²',
          category: 'steel',
          unit: 'ton',
          unitCost: 22000,
          totalQuantityRequired: 450,
          leadTime: 7,
          suppliers: ['DeAcero', 'ArcelorMittal'],
          specifications: 'fy=4200 kg/cm², ASTM A615',
          qualityRequirements: ['Certificado de molino', 'Pruebas de tensión'],
          storageRequirements: 'Área techada, sobre tarimas',
          hazardous: false,
          msdsRequired: false
        }
      ],
      procurementSchedule: [],
      inventoryPolicy: {
        minimumStock: 7,
        reorderPoint: 14,
        reorderQuantity: 30,
        maxStock: 60,
        reviewFrequency: 'Semanal'
      },
      storageRequirements: []
    },
    equipmentResources: {
      equipment: [
        {
          id: 'eq-001',
          code: 'GRU-001',
          name: 'Grúa Torre',
          description: 'Grúa torre para izaje de materiales',
          type: 'crane',
          brand: 'Liebherr',
          model: '81K',
          serialNumber: 'LH-2024-001',
          capacity: '6 toneladas',
          specifications: ['Alcance 50m', 'Altura máxima 40m'],
          ownership: 'rented',
          dailyRate: 8500,
          operatorRequired: true,
          operatorCost: 1200,
          fuelConsumption: 0,
          maintenanceSchedule: 'Semanal',
          certifications: ['Certificación de carga'],
          status: 'in_use'
        }
      ],
      utilizationPlan: [],
      maintenanceSchedule: []
    },
    resourceCalendar: {
      id: 'rc-001',
      resourceType: 'human',
      resourceId: 'all',
      availability: []
    },
    teamDevelopmentPlan: {
      objectives: ['Mejorar productividad', 'Reducir rotación'],
      activities: [],
      performanceAssessment: {
        method: 'Evaluación 360°',
        frequency: 'Trimestral',
        criteria: ['Productividad', 'Calidad', 'Trabajo en equipo'],
        feedbackProcess: 'Reunión individual con supervisor'
      },
      recognitionProgram: {
        criteria: ['Mejor desempeño', 'Sin accidentes', 'Innovación'],
        types: ['Bono', 'Reconocimiento público', 'Día libre'],
        frequency: 'Mensual',
        budget: 50000
      }
    }
  },

  communicationManagementPlan: {
    id: 'comm-001',
    projectId: 'proj-001',
    communicationRequirements: [],
    communicationMatrix: [
      {
        id: 'cm-001',
        communicationType: 'Reporte de Avance Semanal',
        description: 'Informe semanal del estado del proyecto',
        frequency: 'weekly',
        format: 'report',
        sender: 'Residente de Obra',
        recipients: ['Director de Proyecto', 'Patrocinador'],
        purpose: 'Informar avance físico y financiero',
        deliveryMethod: 'Email'
      },
      {
        id: 'cm-002',
        communicationType: 'Reunión de Coordinación',
        description: 'Reunión semanal de coordinación de obra',
        frequency: 'weekly',
        format: 'meeting',
        sender: 'Director de Proyecto',
        recipients: ['Equipo de proyecto', 'Subcontratistas'],
        purpose: 'Coordinar actividades de la semana',
        deliveryMethod: 'Presencial'
      }
    ],
    meetingSchedule: [
      {
        id: 'meet-001',
        name: 'Reunión de Coordinación Semanal',
        purpose: 'Coordinar actividades y resolver problemas',
        frequency: 'Semanal',
        duration: 60,
        dayOfWeek: 1,
        time: '08:00',
        location: 'Oficina de obra',
        facilitator: 'Ing. Roberto García',
        requiredAttendees: ['Residente', 'Coordinadores'],
        optionalAttendees: ['Subcontratistas'],
        agenda: ['Revisión de avance', 'Problemas y soluciones', 'Plan de la semana'],
        outputs: ['Minuta de reunión', 'Lista de compromisos'],
        minutesDistribution: ['Equipo de proyecto']
      }
    ],
    reportingRequirements: [],
    escalationProcedures: [
      {
        level: 1,
        trigger: 'Problema técnico menor',
        timeframe: '24 horas',
        escalateTo: 'Residente de Obra',
        communicationMethod: 'Verbal o email',
        expectedResponse: 'Solución inmediata'
      },
      {
        level: 2,
        trigger: 'Problema que afecta cronograma',
        timeframe: '4 horas',
        escalateTo: 'Director de Proyecto',
        communicationMethod: 'Llamada telefónica',
        expectedResponse: 'Plan de acción en 24 horas'
      }
    ],
    communicationTechnology: [],
    documentManagement: {
      documentRepository: 'SharePoint del proyecto',
      namingConvention: 'PROYECTO_TIPO_VERSION_FECHA',
      versionControl: 'Control automático en SharePoint',
      accessControl: [],
      retentionPolicy: {
        activeProjectRetention: 'Durante el proyecto',
        archiveRetention: '10 años',
        disposalMethod: 'Destrucción segura'
      },
      documentTypes: []
    },
    communicationConstraints: ['Información confidencial solo por canales seguros']
  },

  riskManagementPlan: {
    id: 'risk-001',
    projectId: 'proj-001',
    methodology: 'Análisis cualitativo y cuantitativo según PMBOK',
    roles: [
      {
        role: 'Gerente de Riesgos',
        responsibilities: ['Identificación', 'Análisis', 'Seguimiento'],
        person: 'Ing. Roberto García'
      }
    ],
    budgeting: {
      contingencyReserve: 4500000,
      managementReserve: 2250000,
      allocationMethod: 'Basado en análisis de riesgos'
    },
    timing: {
      identificationFrequency: 'Semanal',
      assessmentFrequency: 'Quincenal',
      reviewMeetings: 'Mensual',
      auditSchedule: 'Trimestral'
    },
    riskCategories: [
      {
        id: 'cat-001',
        name: 'Técnicos',
        description: 'Riesgos relacionados con aspectos técnicos',
        subcategories: [
          { id: 'sub-001', name: 'Diseño', description: 'Problemas de diseño', examples: ['Errores en planos'] },
          { id: 'sub-002', name: 'Calidad', description: 'Problemas de calidad', examples: ['Materiales defectuosos'] }
        ]
      },
      {
        id: 'cat-002',
        name: 'Externos',
        description: 'Riesgos externos al proyecto',
        subcategories: [
          { id: 'sub-003', name: 'Clima', description: 'Condiciones climáticas', examples: ['Lluvias intensas'] },
          { id: 'sub-004', name: 'Mercado', description: 'Condiciones de mercado', examples: ['Incremento de precios'] }
        ]
      }
    ],
    probabilityDefinitions: [
      { level: 1, name: 'Muy Baja', description: 'Improbable', percentageRange: { min: 0, max: 10 } },
      { level: 2, name: 'Baja', description: 'Poco probable', percentageRange: { min: 11, max: 30 } },
      { level: 3, name: 'Media', description: 'Posible', percentageRange: { min: 31, max: 50 } },
      { level: 4, name: 'Alta', description: 'Probable', percentageRange: { min: 51, max: 70 } },
      { level: 5, name: 'Muy Alta', description: 'Casi seguro', percentageRange: { min: 71, max: 100 } }
    ],
    impactDefinitions: [
      { level: 1, name: 'Muy Bajo', costImpact: '<1%', scheduleImpact: '<1 semana', qualityImpact: 'Imperceptible', scopeImpact: 'Sin cambio' },
      { level: 2, name: 'Bajo', costImpact: '1-5%', scheduleImpact: '1-2 semanas', qualityImpact: 'Menor', scopeImpact: 'Áreas menores' },
      { level: 3, name: 'Medio', costImpact: '5-10%', scheduleImpact: '2-4 semanas', qualityImpact: 'Moderado', scopeImpact: 'Áreas principales' },
      { level: 4, name: 'Alto', costImpact: '10-20%', scheduleImpact: '1-2 meses', qualityImpact: 'Significativo', scopeImpact: 'Inaceptable' },
      { level: 5, name: 'Muy Alto', costImpact: '>20%', scheduleImpact: '>2 meses', qualityImpact: 'Inaceptable', scopeImpact: 'Proyecto inviable' }
    ],
    probabilityImpactMatrix: [],
    riskRegister: [
      {
        id: 'risk-001',
        code: 'R-001',
        title: 'Retraso por condiciones climáticas',
        description: 'Lluvias intensas pueden retrasar actividades de cimentación y estructura',
        category: 'Externos',
        subcategory: 'Clima',
        type: 'threat',
        cause: 'Temporada de lluvias',
        effect: 'Retraso en cronograma',
        trigger: 'Pronóstico de lluvia >50mm',
        owner: 'Ing. Carlos Mendoza',
        identifiedDate: '2024-01-20',
        identifiedBy: 'Ing. Roberto García',
        probability: 4,
        impact: 3,
        score: 12,
        priority: 'high',
        responseStrategy: 'mitigate',
        responseDescription: 'Programar actividades críticas fuera de temporada de lluvias',
        responsePlan: ['Monitorear pronóstico', 'Proteger excavaciones', 'Tener plan B'],
        status: 'monitoring'
      },
      {
        id: 'risk-002',
        code: 'R-002',
        title: 'Incremento en precio de acero',
        description: 'Volatilidad en precios de acero puede incrementar costos',
        category: 'Externos',
        subcategory: 'Mercado',
        type: 'threat',
        cause: 'Condiciones de mercado internacional',
        effect: 'Sobrecosto',
        trigger: 'Incremento >10% en precio',
        owner: 'Ing. Roberto García',
        identifiedDate: '2024-01-20',
        identifiedBy: 'Ing. Roberto García',
        probability: 3,
        impact: 4,
        score: 12,
        priority: 'high',
        responseStrategy: 'transfer',
        responseDescription: 'Contrato de precio fijo con proveedor',
        responsePlan: ['Negociar contratos anticipados', 'Buscar proveedores alternativos'],
        status: 'response_planned'
      },
      {
        id: 'risk-003',
        code: 'R-003',
        title: 'Escasez de mano de obra',
        description: 'Dificultad para conseguir personal calificado',
        category: 'Organizacionales',
        subcategory: 'Recursos',
        type: 'threat',
        cause: 'Alta demanda de construcción en la zona',
        effect: 'Retraso y menor productividad',
        trigger: 'Vacantes sin cubrir >2 semanas',
        owner: 'Ing. Carlos Mendoza',
        identifiedDate: '2024-02-01',
        identifiedBy: 'Ing. Carlos Mendoza',
        probability: 3,
        impact: 3,
        score: 9,
        priority: 'medium',
        responseStrategy: 'mitigate',
        responseDescription: 'Mantener relación con múltiples contratistas',
        responsePlan: ['Base de datos de contratistas', 'Incentivos de permanencia'],
        status: 'monitoring'
      }
    ],
    riskResponseStrategies: [],
    monitoringApproach: {
      reviewFrequency: 'Semanal',
      triggerMonitoring: 'Continuo',
      earlyWarningIndicators: ['Pronóstico del clima', 'Precios de materiales'],
      reportingRequirements: ['Reporte mensual de riesgos'],
      auditSchedule: 'Trimestral'
    },
    reportingFormats: ['Matriz de riesgos', 'Top 10 riesgos']
  },

  procurementManagementPlan: {
    id: 'proc-001',
    projectId: 'proj-001',
    procurementStrategy: {
      approach: 'Combinación de contratos por precios unitarios y suma alzada',
      contractTypes: ['Precio unitario', 'Suma alzada', 'Tiempo y materiales'],
      competitionLevel: 'Mínimo 3 cotizaciones para compras >$100,000',
      prequalificationRequired: true,
      localContentRequirements: 'Preferencia a proveedores locales',
      sustainabilityRequirements: ['Materiales certificados', 'Prácticas ambientales']
    },
    makeOrBuyDecisions: [],
    procurementDocuments: [],
    vendors: [
      {
        id: 'ven-001',
        name: 'Cemex México',
        type: 'supplier',
        contactPerson: 'Lic. Juan Pérez',
        email: 'juan.perez@cemex.com',
        phone: '+52 555 111 2222',
        address: 'Av. Industrial 100, CDMX',
        taxId: 'CEM850101XXX',
        qualifications: ['Productor de concreto certificado'],
        certifications: ['ISO 9001', 'ISO 14001'],
        experience: [],
        financialInfo: { creditRating: 'AAA', annualRevenue: 50000000000 },
        performanceHistory: [],
        status: 'preferred'
      }
    ],
    contracts: [
      {
        id: 'con-001',
        number: 'CON-2024-001',
        title: 'Suministro de Concreto Premezclado',
        vendorId: 'ven-001',
        type: 'unit_price',
        scope: 'Suministro de concreto premezclado para toda la obra',
        value: 8750000,
        currency: 'MXN',
        startDate: '2024-01-15',
        endDate: '2024-11-30',
        paymentTerms: [],
        deliverables: [],
        milestones: [],
        warranties: [{ type: 'Calidad', coverage: 'Resistencia garantizada', duration: 28, durationUnit: 'days', conditions: ['Muestreo según norma'] }],
        insurance: [],
        bonds: [],
        penalties: [],
        changeOrders: [],
        claims: [],
        status: 'active',
        signedDate: '2024-01-10',
        administrator: 'Ing. Carlos Mendoza'
      }
    ],
    procurementSchedule: [],
    evaluationCriteria: {
      technicalCriteria: [
        { criterion: 'Experiencia', weight: 30, description: 'Años de experiencia en proyectos similares', scoringGuide: '5pts: >10 años, 3pts: 5-10 años, 1pt: <5 años' },
        { criterion: 'Capacidad técnica', weight: 25, description: 'Recursos y equipamiento', scoringGuide: '5pts: Sobresaliente, 3pts: Adecuado, 1pt: Mínimo' }
      ],
      commercialCriteria: [
        { criterion: 'Precio', weight: 35, description: 'Precio total de la propuesta', scoringGuide: 'Menor precio = mayor puntaje' },
        { criterion: 'Condiciones de pago', weight: 10, description: 'Términos de pago ofrecidos', scoringGuide: '5pts: 60 días, 3pts: 30 días, 1pt: Anticipo' }
      ],
      weightDistribution: { technical: 55, commercial: 45 },
      minimumScore: 70
    },
    contractAdministration: {
      administrator: 'Ing. Carlos Mendoza',
      responsibilities: ['Supervisión de entregas', 'Verificación de calidad', 'Procesamiento de pagos'],
      reportingRequirements: ['Reporte mensual de contratos'],
      meetingSchedule: 'Quincenal con proveedores principales',
      paymentProcess: ['Recepción de factura', 'Verificación de entrega', 'Aprobación', 'Pago a 30 días'],
      changeOrderProcess: ['Solicitud', 'Evaluación de impacto', 'Aprobación', 'Modificación de contrato'],
      disputeResolutionProcess: ['Negociación directa', 'Mediación', 'Arbitraje'],
      closeoutRequirements: ['Finiquito', 'Liberación de fianzas', 'Evaluación final']
    },
    procurementMetrics: []
  },

  stakeholderManagementPlan: {
    id: 'stake-001',
    projectId: 'proj-001',
    stakeholderRegister: [
      {
        id: 'st-001',
        name: 'Lic. Fernando Martínez',
        organization: 'Grupo Inversionista del Norte',
        role: 'Patrocinador del Proyecto',
        contactInfo: { email: 'fernando.martinez@gin.com', phone: '+52 555 987 6543' },
        type: 'internal',
        category: 'sponsor',
        requirements: ['ROI >15%', 'Entrega a tiempo'],
        expectations: ['Comunicación clara', 'Sin sorpresas'],
        influence: 'high',
        interest: 'high',
        power: 'high',
        urgency: 'high',
        legitimacy: 'high',
        attitude: 'supportive',
        currentEngagement: 'supportive',
        desiredEngagement: 'leading',
        potentialImpact: 'Puede detener o aprobar el proyecto',
        engagementStrategy: 'Mantener informado y consultar en decisiones importantes'
      },
      {
        id: 'st-002',
        name: 'Asociación de Vecinos Colonia Norte',
        organization: 'Comunidad',
        role: 'Vecinos del proyecto',
        contactInfo: { email: 'vecinos.norte@gmail.com', phone: '+52 555 444 5555' },
        type: 'external',
        category: 'community',
        requirements: ['Minimizar molestias', 'Horarios de trabajo'],
        expectations: ['Respeto a la comunidad', 'Limpieza'],
        influence: 'medium',
        interest: 'high',
        power: 'medium',
        urgency: 'medium',
        legitimacy: 'high',
        attitude: 'neutral',
        currentEngagement: 'neutral',
        desiredEngagement: 'supportive',
        potentialImpact: 'Pueden generar quejas que retrasen el proyecto',
        engagementStrategy: 'Comunicación proactiva sobre avances y medidas de mitigación'
      },
      {
        id: 'st-003',
        name: 'Dirección de Desarrollo Urbano',
        organization: 'Gobierno Municipal',
        role: 'Autoridad reguladora',
        contactInfo: { email: 'desarrollo.urbano@municipio.gob.mx', phone: '+52 555 666 7777' },
        type: 'external',
        category: 'government',
        requirements: ['Cumplimiento de normatividad', 'Permisos vigentes'],
        expectations: ['Apego a reglamentos'],
        influence: 'high',
        interest: 'medium',
        power: 'high',
        urgency: 'low',
        legitimacy: 'high',
        attitude: 'neutral',
        currentEngagement: 'neutral',
        desiredEngagement: 'supportive',
        potentialImpact: 'Pueden detener la obra por incumplimientos',
        engagementStrategy: 'Cumplir normatividad y mantener comunicación formal'
      }
    ],
    powerInterestMatrix: [
      { stakeholderId: 'st-001', power: 9, interest: 9, quadrant: 'manage_closely', strategy: 'Gestionar de cerca' },
      { stakeholderId: 'st-002', power: 5, interest: 8, quadrant: 'keep_informed', strategy: 'Mantener informado' },
      { stakeholderId: 'st-003', power: 8, interest: 4, quadrant: 'keep_satisfied', strategy: 'Mantener satisfecho' }
    ],
    engagementStrategy: [
      {
        stakeholderId: 'st-001',
        objective: 'Mantener apoyo activo al proyecto',
        approach: 'Comunicación ejecutiva regular',
        tactics: ['Reuniones mensuales', 'Reportes ejecutivos', 'Consultas en decisiones clave'],
        frequency: 'Mensual',
        responsible: 'Ing. Roberto García',
        successIndicators: ['Aprobaciones rápidas', 'Soporte en problemas']
      },
      {
        stakeholderId: 'st-002',
        objective: 'Convertir de neutral a apoyo',
        approach: 'Comunicación comunitaria',
        tactics: ['Reuniones informativas', 'Buzón de quejas', 'Medidas de mitigación'],
        frequency: 'Mensual',
        responsible: 'Relaciones Públicas',
        successIndicators: ['Reducción de quejas', 'Retroalimentación positiva']
      }
    ],
    communicationApproach: [],
    engagementAssessment: [],
    issuesLog: [
      {
        id: 'issue-001',
        stakeholderId: 'st-002',
        date: '2024-03-15',
        description: 'Queja por ruido excesivo durante excavación',
        type: 'complaint',
        priority: 'medium',
        owner: 'Ing. Carlos Mendoza',
        resolution: 'Se ajustaron horarios de trabajo pesado',
        status: 'resolved',
        resolutionDate: '2024-03-18'
      }
    ]
  },

  hseManagementPlan: {
    id: 'hse-001',
    projectId: 'proj-001',
    hsePolicy: {
      statement: 'Estamos comprometidos con la protección de la vida, la salud de nuestros trabajadores y el medio ambiente. Ningún trabajo es tan urgente que no pueda hacerse de manera segura.',
      commitments: [
        'Cumplir con toda la legislación aplicable',
        'Proporcionar un ambiente de trabajo seguro',
        'Prevenir lesiones y enfermedades ocupacionales',
        'Proteger el medio ambiente'
      ],
      objectives: [
        {
          id: 'hse-obj-001',
          category: 'safety',
          description: 'Cero accidentes fatales',
          target: '0',
          metric: 'Número de fatalidades',
          responsible: 'Gerente HSE',
          dueDate: '2024-12-31',
          status: 'on_track'
        },
        {
          id: 'hse-obj-002',
          category: 'safety',
          description: 'LTIR menor a 1.0',
          target: '<1.0',
          metric: 'Lost Time Incident Rate',
          currentValue: 0.5,
          responsible: 'Gerente HSE',
          dueDate: '2024-12-31',
          status: 'achieved'
        }
      ],
      responsibilities: ['Todos somos responsables de la seguridad'],
      compliance: ['NOM-031-STPS', 'NOM-017-STPS'],
      communicationPlan: 'Charlas diarias de seguridad',
      reviewFrequency: 'Anual',
      approvedBy: 'Director General',
      approvalDate: '2024-01-15'
    },
    organizationalStructure: {
      hseManager: {} as any,
      safetyOfficers: [],
      emergencyTeam: [],
      committees: [],
      responsibilities: []
    },
    hazardIdentification: {
      methodology: 'Análisis de Seguridad en el Trabajo (AST)',
      scope: ['Todas las actividades de construcción'],
      hazardCategories: [
        { id: 'haz-cat-001', name: 'Caídas', description: 'Caídas de altura', examples: ['Trabajo en andamios', 'Bordes de losa'] },
        { id: 'haz-cat-002', name: 'Golpes', description: 'Golpes por objetos', examples: ['Caída de materiales', 'Equipos en movimiento'] }
      ],
      identifiedHazards: [
        {
          id: 'haz-001',
          code: 'HAZ-001',
          category: 'Caídas',
          description: 'Caída de altura desde andamios',
          location: 'Fachadas',
          activity: 'Instalación de acabados exteriores',
          potentialConsequences: ['Lesiones graves', 'Fatalidad'],
          existingControls: ['Andamios certificados', 'Líneas de vida', 'EPP'],
          identifiedDate: '2024-01-20',
          identifiedBy: 'Ing. HSE',
          status: 'controlled'
        }
      ],
      reviewFrequency: 'Semanal'
    },
    riskAssessment: [
      {
        id: 'ra-001',
        hazardId: 'haz-001',
        assessmentDate: '2024-01-25',
        assessor: 'Ing. HSE',
        likelihood: 3,
        severity: 5,
        riskLevel: 15,
        riskRating: 'high',
        controlMeasures: [
          {
            id: 'cm-001',
            type: 'engineering',
            description: 'Instalación de líneas de vida en perímetro',
            effectiveness: 'high',
            implementationDate: '2024-02-01',
            responsible: 'Supervisor HSE',
            verificationMethod: 'Inspección visual',
            status: 'implemented'
          }
        ],
        residualLikelihood: 2,
        residualSeverity: 5,
        residualRiskLevel: 10,
        residualRiskRating: 'medium',
        acceptability: 'tolerable',
        reviewDate: '2024-07-25'
      }
    ],
    safetyProcedures: [],
    environmentalPlan: {
      environmentalPolicy: 'Minimizar el impacto ambiental de nuestras operaciones',
      significantAspects: [
        {
          id: 'asp-001',
          activity: 'Excavación',
          aspect: 'Generación de polvo',
          impact: 'Contaminación del aire',
          significance: 'medium',
          legalRequirement: 'NOM-025-SEMARNAT',
          controlMeasures: ['Riego de áreas', 'Lonas de protección'],
          monitoring: 'Visual diario'
        }
      ],
      permits: [
        {
          id: 'perm-001',
          type: 'Licencia de Construcción',
          issuingAuthority: 'Desarrollo Urbano Municipal',
          permitNumber: 'LC-2024-0123',
          issueDate: '2024-01-10',
          expirationDate: '2025-01-10',
          conditions: ['Cumplir planos aprobados'],
          status: 'valid'
        }
      ],
      wasteManagement: {
        wasteTypes: [
          {
            id: 'waste-001',
            name: 'Escombro de construcción',
            category: 'construction_debris',
            source: 'Demolición y excavación',
            estimatedQuantity: 500,
            unit: 'm³',
            handlingProcedure: 'Separación y disposición en sitio autorizado',
            disposalMethod: 'Relleno sanitario autorizado'
          }
        ],
        segregationProcedures: ['Separar por tipo de material'],
        storageRequirements: ['Contenedores identificados'],
        disposalMethods: [],
        recyclingTargets: [
          { material: 'Madera', targetPercentage: 50, method: 'Reciclaje local' }
        ],
        contractors: ['Transportes Ambientales S.A.'],
        documentation: ['Manifiestos de transporte']
      },
      emissionsControl: { sources: [], controlMeasures: [], monitoringFrequency: 'Mensual', limits: [] },
      noiseControl: { noiseSources: [], limits: [], controlMeasures: [], monitoringLocations: [], monitoringFrequency: 'Semanal', workingHoursRestrictions: '7:00-18:00' },
      erosionControl: { measures: [], inspectionFrequency: 'Semanal', maintenanceRequirements: [], contingencyPlan: '' },
      spilPrevention: { hazardousMaterials: [], storageRequirements: [], containmentMeasures: [], responseEquipment: [], responseProcedure: [], reportingRequirements: [], trainingRequirements: [] },
      biodiversityProtection: { sensitiveAreas: [], protectionMeasures: [], monitoringRequirements: [] },
      monitoringProgram: []
    },
    healthPlan: {
      healthPolicy: 'Promover la salud ocupacional de todos los trabajadores',
      medicalSurveillance: {
        preEmploymentExam: ['Examen general', 'Audiometría', 'Espirometría'],
        periodicExams: [
          { examType: 'Audiometría', frequency: 'Anual', applicableTo: ['Operadores de equipo'], parameters: ['Umbral auditivo'] }
        ],
        exposureMonitoring: [],
        recordRetention: '5 años'
      },
      occupationalHazards: [],
      healthPrograms: [],
      firstAidProvisions: {
        firstAidKits: [
          { location: 'Oficina de obra', type: 'advanced', contents: ['Vendas', 'Gasas', 'Férulas'], inspectionFrequency: 'Semanal' }
        ],
        trainedPersonnel: ['Ing. Carlos Mendoza', '2 auxiliares'],
        emergencyContacts: [
          { service: 'Ambulancia', name: 'Cruz Roja', phone: '065', responseTime: '15 min' },
          { service: 'Bomberos', name: 'H. Cuerpo de Bomberos', phone: '068', responseTime: '10 min' },
          { service: 'Hospital', name: 'Hospital Regional', phone: '+52 555 888 9999', address: 'Av. Salud 100' }
        ],
        medicalFacilities: ['Hospital Regional a 5 km']
      },
      fitnessForDuty: { policy: 'Todos los trabajadores deben estar aptos para sus funciones', requirements: [], testingProcedures: [], consequences: [] }
    },
    emergencyResponse: {
      emergencyTypes: [
        {
          id: 'emerg-001',
          type: 'Incendio',
          description: 'Fuego en instalaciones o materiales',
          probability: 'low',
          severity: 'high',
          responseProcedure: ['Activar alarma', 'Evacuar', 'Llamar a bomberos', 'Combatir si es seguro'],
          resources: ['Extintores', 'Hidrantes'],
          notifications: ['Bomberos', 'Gerente de proyecto']
        },
        {
          id: 'emerg-002',
          type: 'Accidente grave',
          description: 'Lesión que requiere atención médica inmediata',
          probability: 'medium',
          severity: 'high',
          responseProcedure: ['Asegurar la escena', 'Primeros auxilios', 'Llamar ambulancia', 'Notificar a gerencia'],
          resources: ['Kit de primeros auxilios', 'Camilla'],
          notifications: ['Ambulancia', 'Familia', 'Gerente HSE']
        }
      ],
      organizationChart: { commander: 'Ing. Roberto García', roles: [], alternates: [] },
      communicationPlan: {
        alarmSystems: [
          { type: 'Sirena', location: 'Torre de grúa', signal: 'Sonido continuo = Evacuación', testingFrequency: 'Mensual' }
        ],
        notificationProcedure: ['Activar alarma', 'Comunicar por radio'],
        externalNotifications: [],
        assemblyPoints: [
          { id: 'ap-001', location: 'Estacionamiento principal', capacity: 100, assignedAreas: ['Toda la obra'], coordinator: 'Ing. HSE' }
        ]
      },
      evacuationPlan: {
        routes: [
          { id: 'route-001', fromArea: 'Edificio en construcción', toAssemblyPoint: 'Estacionamiento principal', primaryRoute: 'Escalera principal norte', alternateRoute: 'Escalera sur', capacity: 50 }
        ],
        procedures: ['Mantener la calma', 'No usar elevadores', 'Ayudar a compañeros'],
        specialNeeds: ['Personas con movilidad reducida'],
        accountingProcedure: 'Lista de asistencia en punto de reunión',
        reentryProcedure: 'Solo cuando autoridades lo indiquen'
      },
      emergencyEquipment: [],
      drillSchedule: [
        {
          id: 'drill-001',
          type: 'Evacuación general',
          scheduledDate: '2024-06-15',
          scenario: 'Simulacro de incendio en bodega de materiales',
          objectives: ['Evaluar tiempo de evacuación', 'Verificar rutas'],
          status: 'completed',
          actualDate: '2024-06-15',
          participants: 85,
          results: 'Evacuación en 4 minutos',
          lessonsLearned: ['Mejorar señalización en segundo nivel']
        }
      ],
      externalResources: []
    },
    trainingProgram: {
      trainingMatrix: [],
      trainingCourses: [
        {
          id: 'course-001',
          code: 'IND-001',
          name: 'Inducción HSE',
          description: 'Capacitación inicial de seguridad',
          type: 'induction',
          duration: 4,
          durationUnit: 'hours',
          provider: 'internal',
          content: ['Política HSE', 'Riesgos del proyecto', 'EPP', 'Emergencias'],
          targetAudience: ['Todo el personal']
        },
        {
          id: 'course-002',
          code: 'ALT-001',
          name: 'Trabajo en Alturas',
          description: 'Capacitación para trabajos en altura',
          type: 'specialized',
          duration: 8,
          durationUnit: 'hours',
          provider: 'external',
          providerName: 'Seguridad Industrial S.A.',
          certification: 'DC-3',
          validityPeriod: 12,
          content: ['Marco legal', 'Sistemas de protección', 'Rescate'],
          targetAudience: ['Personal que trabaja en altura']
        }
      ],
      trainingRecords: [
        {
          id: 'tr-001',
          personId: 'Carlos Mendoza',
          courseId: 'course-001',
          date: '2024-01-20',
          score: 95,
          passed: true,
          trainer: 'Ing. HSE'
        }
      ],
      competencyRequirements: []
    },
    inspectionProgram: {
      inspectionTypes: [
        {
          id: 'insp-type-001',
          name: 'Inspección diaria de seguridad',
          description: 'Recorrido de verificación de condiciones',
          frequency: 'Diaria',
          scope: ['EPP', 'Condiciones de trabajo', 'Señalización'],
          inspector: 'Supervisor HSE',
          checklist: 'CL-001'
        }
      ],
      inspectionSchedule: [
        {
          id: 'sched-001',
          typeId: 'insp-type-001',
          area: 'Toda la obra',
          scheduledDate: '2024-06-20',
          inspector: 'Supervisor HSE',
          status: 'completed'
        }
      ],
      inspectionChecklists: [],
      inspectionRecords: [
        {
          id: 'rec-001',
          typeId: 'insp-type-001',
          date: '2024-06-20',
          area: 'Nivel 5',
          inspector: 'Supervisor HSE',
          findings: [
            { id: 'find-001', checklistItemId: 'item-001', status: 'ok' },
            { id: 'find-002', checklistItemId: 'item-002', status: 'not_ok', observation: 'Trabajador sin casco', correctiveAction: 'Retroalimentación inmediata', responsible: 'Supervisor', dueDate: '2024-06-20', closedDate: '2024-06-20' }
          ],
          overallRating: 'needs_improvement',
          followUpRequired: true,
          signedBy: 'Supervisor HSE'
        }
      ]
    },
    incidentManagement: {
      reportingProcedure: ['Reportar inmediatamente al supervisor', 'Llenar formato de reporte'],
      investigationProcedure: ['Asegurar la escena', 'Entrevistar testigos', 'Análisis de causas raíz'],
      classificationCriteria: [],
      incidents: [
        {
          id: 'inc-001',
          date: '2024-04-15',
          time: '10:30',
          location: 'Nivel 3, zona de columnas',
          type: 'near_miss',
          description: 'Objeto cayó desde nivel superior sin causar lesiones',
          witnesses: ['Juan Pérez', 'María López'],
          immediateActions: ['Acordonamiento del área', 'Revisión de procedimientos'],
          rootCauses: ['Falta de red de protección', 'Área de trabajo no delimitada'],
          correctiveActions: [
            { id: 'ca-001', description: 'Instalar redes de protección', responsible: 'Supervisor', dueDate: '2024-04-16', completedDate: '2024-04-16', status: 'verified' }
          ],
          preventiveActions: ['Capacitación sobre manejo de materiales'],
          lessonsLearned: 'Importancia de las redes de protección',
          reportedBy: 'Juan Pérez',
          investigatedBy: 'Ing. HSE',
          investigationDate: '2024-04-15',
          status: 'closed'
        }
      ],
      statistics: {
        totalIncidents: 5,
        byType: { near_miss: 3, first_aid: 2, lost_time: 0, fatality: 0 },
        ltir: 0,
        trir: 0.5,
        severity: 0,
        frequency: 1.2,
        manhours: 150000,
        trend: 'improving'
      }
    },
    performanceMonitoring: {
      kpis: [],
      targets: [],
      reportingSchedule: 'Mensual',
      managementReview: []
    },
    documentationRequirements: {
      requiredDocuments: [],
      recordRetention: [],
      auditTrail: true
    }
  },

  changeManagementPlan: {
    id: 'change-001',
    projectId: 'proj-001',
    changeControlBoard: {
      members: [
        { name: 'Ing. Roberto García', role: 'Presidente CCB', votingRights: true },
        { name: 'Lic. Fernando Martínez', role: 'Patrocinador', votingRights: true },
        { name: 'Ing. Carlos Mendoza', role: 'Residente', votingRights: true }
      ],
      quorum: 2,
      meetingSchedule: 'Según necesidad, máximo 48 horas',
      decisionProcess: 'Mayoría simple',
      escalationPath: 'Patrocinador para cambios >$500,000'
    },
    changeProcess: {
      stages: [
        { name: 'Solicitud', description: 'Presentar solicitud formal', responsible: 'Solicitante', timeframe: '1 día', outputs: ['Formato de solicitud'] },
        { name: 'Análisis', description: 'Evaluar impacto', responsible: 'Equipo técnico', timeframe: '3 días', outputs: ['Análisis de impacto'] },
        { name: 'Revisión CCB', description: 'Decisión del comité', responsible: 'CCB', timeframe: '2 días', outputs: ['Acta de decisión'] },
        { name: 'Implementación', description: 'Ejecutar el cambio', responsible: 'Equipo asignado', timeframe: 'Variable', outputs: ['Cambio implementado'] }
      ],
      templates: ['SOL-CAMBIO-001'],
      notifications: [],
      documentationRequirements: ['Justificación', 'Análisis de impacto', 'Aprobaciones']
    },
    changeCategories: [
      { id: 'cat-001', name: 'Menor', description: 'Sin impacto en costo ni cronograma', approvalAuthority: 'Residente', timeframe: '24 horas', examples: ['Ajustes menores de diseño'] },
      { id: 'cat-002', name: 'Moderado', description: 'Impacto <5% en costo o 1 semana en cronograma', approvalAuthority: 'Director de Proyecto', timeframe: '48 horas', examples: ['Cambio de materiales'] },
      { id: 'cat-003', name: 'Mayor', description: 'Impacto >5% en costo o >1 semana', approvalAuthority: 'CCB', timeframe: '1 semana', examples: ['Cambios estructurales'] }
    ],
    changeLog: [
      {
        id: 'cr-001',
        number: 'CR-2024-001',
        title: 'Cambio de acabado en lobby',
        description: 'Cambiar piso de mármol a porcelanato de alta gama',
        category: 'Moderado',
        type: 'scope',
        priority: 'medium',
        requestedBy: 'Lic. Fernando Martínez',
        requestDate: '2024-05-10',
        justification: 'Reducción de costo sin afectar calidad',
        impactAnalysis: {
          scopeImpact: 'Cambio de especificación de piso',
          scheduleImpact: { days: 0, criticalPath: false, affectedActivities: ['1.5.2'] },
          costImpact: { amount: -150000, breakdown: [{ category: 'Materiales', amount: -150000, description: 'Diferencia de precio' }] },
          qualityImpact: 'Sin impacto significativo',
          riskImpact: [],
          resourceImpact: 'Sin impacto',
          stakeholderImpact: 'Sin impacto',
          contractualImpact: 'Adenda a contrato de acabados',
          overallRisk: 'low',
          recommendation: 'Aprobar',
          analysedBy: 'Ing. Carlos Mendoza',
          analysisDate: '2024-05-12'
        },
        decision: 'approved',
        decisionDate: '2024-05-15',
        decisionBy: 'Ing. Roberto García',
        decisionRationale: 'Ahorro sin afectar calidad',
        status: 'completed',
        attachments: []
      }
    ],
    impactAssessmentCriteria: []
  },

  scopeBaseline: {} as any,
  scheduleBaseline: {} as any,
  costBaseline: {} as any,
  lessonsLearned: [],

  projectMetrics: {
    overallHealth: 'good',
    schedulePerformance: 0.95,
    costPerformance: 1.02,
    qualityScore: 97,
    safetyScore: 98,
    stakeholderSatisfaction: 85,
    riskExposure: 15,
    changeRequestCount: 3,
    openIssuesCount: 2
  }
};
