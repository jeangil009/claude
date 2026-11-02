import { Project, Activity } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Datos de ejemplo para un proyecto de construcción de vivienda
export const sampleActivities: Activity[] = [
  {
    id: uuidv4(),
    wbsCode: '1.1',
    name: 'Limpieza y Trazo del Terreno',
    description: 'Limpieza general, nivelación y trazo de ejes del terreno',
    plannedStartDate: '2024-01-15',
    plannedEndDate: '2024-01-22',
    actualStartDate: '2024-01-15',
    actualEndDate: '2024-01-21',
    plannedCost: 45000,
    actualCost: 42000,
    percentComplete: 100,
    responsable: 'Juan Pérez',
    category: 'preliminares'
  },
  {
    id: uuidv4(),
    wbsCode: '1.2',
    name: 'Instalaciones Provisionales',
    description: 'Bodega, oficina de obra, sanitarios y conexiones temporales',
    plannedStartDate: '2024-01-18',
    plannedEndDate: '2024-01-25',
    actualStartDate: '2024-01-18',
    actualEndDate: '2024-01-26',
    plannedCost: 65000,
    actualCost: 72000,
    percentComplete: 100,
    responsable: 'Juan Pérez',
    category: 'preliminares'
  },
  {
    id: uuidv4(),
    wbsCode: '2.1',
    name: 'Excavación para Cimentación',
    description: 'Excavación de zanjas para zapatas y cimientos corridos',
    plannedStartDate: '2024-01-23',
    plannedEndDate: '2024-02-02',
    actualStartDate: '2024-01-24',
    actualEndDate: '2024-02-05',
    plannedCost: 120000,
    actualCost: 135000,
    percentComplete: 100,
    responsable: 'Roberto García',
    category: 'cimentacion'
  },
  {
    id: uuidv4(),
    wbsCode: '2.2',
    name: 'Zapatas de Concreto Armado',
    description: 'Construcción de zapatas aisladas y corridas',
    plannedStartDate: '2024-02-03',
    plannedEndDate: '2024-02-15',
    actualStartDate: '2024-02-06',
    actualEndDate: '2024-02-18',
    plannedCost: 280000,
    actualCost: 295000,
    percentComplete: 100,
    responsable: 'Roberto García',
    category: 'cimentacion'
  },
  {
    id: uuidv4(),
    wbsCode: '2.3',
    name: 'Cimientos y Contratrabes',
    description: 'Construcción de cimientos corridos y contratrabes',
    plannedStartDate: '2024-02-16',
    plannedEndDate: '2024-02-28',
    actualStartDate: '2024-02-19',
    plannedCost: 350000,
    actualCost: 320000,
    percentComplete: 95,
    responsable: 'Roberto García',
    category: 'cimentacion'
  },
  {
    id: uuidv4(),
    wbsCode: '3.1',
    name: 'Columnas Planta Baja',
    description: 'Armado, cimbrado y colado de columnas de planta baja',
    plannedStartDate: '2024-03-01',
    plannedEndDate: '2024-03-15',
    actualStartDate: '2024-03-04',
    plannedCost: 420000,
    actualCost: 380000,
    percentComplete: 85,
    responsable: 'Miguel Ángel Torres',
    category: 'estructura'
  },
  {
    id: uuidv4(),
    wbsCode: '3.2',
    name: 'Trabes y Losa Entrepiso',
    description: 'Construcción de trabes principales y losa de entrepiso',
    plannedStartDate: '2024-03-16',
    plannedEndDate: '2024-04-05',
    plannedCost: 580000,
    actualCost: 420000,
    percentComplete: 70,
    responsable: 'Miguel Ángel Torres',
    category: 'estructura'
  },
  {
    id: uuidv4(),
    wbsCode: '3.3',
    name: 'Columnas Planta Alta',
    description: 'Armado, cimbrado y colado de columnas de planta alta',
    plannedStartDate: '2024-04-06',
    plannedEndDate: '2024-04-20',
    plannedCost: 380000,
    actualCost: 180000,
    percentComplete: 45,
    responsable: 'Miguel Ángel Torres',
    category: 'estructura'
  },
  {
    id: uuidv4(),
    wbsCode: '3.4',
    name: 'Losa de Azotea',
    description: 'Construcción de losa de azotea y pretiles',
    plannedStartDate: '2024-04-21',
    plannedEndDate: '2024-05-10',
    plannedCost: 520000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Miguel Ángel Torres',
    category: 'estructura'
  },
  {
    id: uuidv4(),
    wbsCode: '4.1',
    name: 'Muros de Block Planta Baja',
    description: 'Construcción de muros divisorios y de carga en planta baja',
    plannedStartDate: '2024-03-20',
    plannedEndDate: '2024-04-15',
    plannedCost: 320000,
    actualCost: 150000,
    percentComplete: 40,
    responsable: 'Carlos Mendoza',
    category: 'albanileria'
  },
  {
    id: uuidv4(),
    wbsCode: '4.2',
    name: 'Muros de Block Planta Alta',
    description: 'Construcción de muros divisorios y de carga en planta alta',
    plannedStartDate: '2024-04-25',
    plannedEndDate: '2024-05-20',
    plannedCost: 280000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Carlos Mendoza',
    category: 'albanileria'
  },
  {
    id: uuidv4(),
    wbsCode: '5.1',
    name: 'Instalación Eléctrica Primera Fase',
    description: 'Tubería conduit, cajas y alambrado oculto',
    plannedStartDate: '2024-04-01',
    plannedEndDate: '2024-04-30',
    plannedCost: 180000,
    actualCost: 85000,
    percentComplete: 50,
    responsable: 'Electricista José Luis',
    category: 'instalaciones_electricas'
  },
  {
    id: uuidv4(),
    wbsCode: '6.1',
    name: 'Instalación Hidráulica',
    description: 'Tuberías de agua fría y caliente, válvulas y conexiones',
    plannedStartDate: '2024-04-01',
    plannedEndDate: '2024-04-25',
    plannedCost: 145000,
    actualCost: 68000,
    percentComplete: 45,
    responsable: 'Plomero Antonio',
    category: 'instalaciones_hidraulicas'
  },
  {
    id: uuidv4(),
    wbsCode: '6.2',
    name: 'Instalación Sanitaria',
    description: 'Drenaje, registros y conexión a red municipal',
    plannedStartDate: '2024-02-20',
    plannedEndDate: '2024-03-10',
    actualStartDate: '2024-02-22',
    plannedCost: 125000,
    actualCost: 110000,
    percentComplete: 80,
    responsable: 'Plomero Antonio',
    category: 'instalaciones_hidraulicas'
  },
  {
    id: uuidv4(),
    wbsCode: '7.1',
    name: 'Aplanados Interiores',
    description: 'Aplanado de yeso en muros y plafones interiores',
    plannedStartDate: '2024-05-25',
    plannedEndDate: '2024-06-20',
    plannedCost: 220000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Carlos Mendoza',
    category: 'acabados'
  },
  {
    id: uuidv4(),
    wbsCode: '7.2',
    name: 'Pisos y Azulejos',
    description: 'Instalación de pisos cerámicos y azulejos en baños/cocina',
    plannedStartDate: '2024-06-21',
    plannedEndDate: '2024-07-15',
    plannedCost: 280000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Especialista en pisos',
    category: 'acabados'
  },
  {
    id: uuidv4(),
    wbsCode: '8.1',
    name: 'Puertas y Marcos',
    description: 'Instalación de puertas interiores y exteriores',
    plannedStartDate: '2024-07-01',
    plannedEndDate: '2024-07-20',
    plannedCost: 165000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Carpintero Fernando',
    category: 'carpinteria'
  },
  {
    id: uuidv4(),
    wbsCode: '8.2',
    name: 'Closets y Muebles Fijos',
    description: 'Fabricación e instalación de closets y cocina integral',
    plannedStartDate: '2024-07-15',
    plannedEndDate: '2024-08-05',
    plannedCost: 320000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Carpintero Fernando',
    category: 'carpinteria'
  },
  {
    id: uuidv4(),
    wbsCode: '9.1',
    name: 'Pintura Interior',
    description: 'Preparación de superficies y pintura vinílica interior',
    plannedStartDate: '2024-07-20',
    plannedEndDate: '2024-08-10',
    plannedCost: 145000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Equipo de pintura',
    category: 'pintura'
  },
  {
    id: uuidv4(),
    wbsCode: '9.2',
    name: 'Pintura Exterior',
    description: 'Impermeabilización y pintura de fachadas',
    plannedStartDate: '2024-08-01',
    plannedEndDate: '2024-08-15',
    plannedCost: 95000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Equipo de pintura',
    category: 'pintura'
  },
  {
    id: uuidv4(),
    wbsCode: '10.1',
    name: 'Limpieza Final y Detalles',
    description: 'Limpieza general y corrección de detalles',
    plannedStartDate: '2024-08-12',
    plannedEndDate: '2024-08-20',
    plannedCost: 35000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Juan Pérez',
    category: 'otros'
  }
];

export const sampleProject: Project = {
  id: uuidv4(),
  name: 'Casa Habitación Residencial Los Pinos',
  description: 'Construcción de casa habitación de 2 niveles con 3 recámaras, 2.5 baños, sala, comedor, cocina, estudio y área de servicio. Superficie de construcción: 280 m²',
  client: 'Familia Rodríguez Martínez',
  location: 'Fracc. Los Pinos, Guadalajara, Jalisco',
  startDate: '2024-01-15',
  plannedEndDate: '2024-08-20',
  budget: 5070000, // USD 5,070,000 (cifras de ejemplo, sin convertir)
  currency: 'USD',
  status: 'en_progreso',
  activities: sampleActivities
};

// Función para crear un nuevo proyecto vacío
export function createEmptyProject(): Project {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    client: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    plannedEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 0,
    currency: 'USD',
    status: 'planificacion',
    activities: []
  };
}

// Función para crear una nueva actividad vacía
export function createEmptyActivity(wbsCode: string = ''): Activity {
  return {
    id: uuidv4(),
    wbsCode,
    name: '',
    description: '',
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    plannedCost: 0,
    actualCost: 0,
    percentComplete: 0,
    responsable: '',
    category: 'otros'
  };
}
