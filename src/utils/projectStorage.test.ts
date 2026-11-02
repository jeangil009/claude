import { describe, expect, it } from 'vitest';
import type { Activity, Project } from '../types';
import {
  STORAGE_KEY,
  STORAGE_VERSION,
  clearStoredProject,
  loadProject,
  saveProject,
  type StorageLike,
} from './projectStorage';

const activity: Activity = {
  id: 'a1',
  wbsCode: '1.1',
  name: 'Excavación',
  description: '',
  plannedStartDate: '2026-01-01',
  plannedEndDate: '2026-01-11',
  plannedCost: 1000,
  actualCost: 600,
  percentComplete: 50,
  responsable: 'x',
  category: 'otros',
};

const project: Project = {
  id: 'p1',
  name: 'Proyecto',
  description: '',
  client: 'c',
  location: 'l',
  startDate: '2026-01-01',
  plannedEndDate: '2026-01-21',
  budget: 3000,
  currency: 'USD',
  status: 'en_progreso',
  activities: [activity],
};

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

describe('R21 persistencia ida y vuelta', () => {
  it('guardar y cargar devuelve el mismo proyecto', () => {
    const st = memoryStorage();
    expect(saveProject(project, st)).toBe(true);
    expect(loadProject(st)).toEqual(project);
  });
  it('guarda un sobre versionado bajo la clave esperada', () => {
    const st = memoryStorage();
    saveProject(project, st);
    const raw = JSON.parse(st.data[STORAGE_KEY]);
    expect(raw.version).toBe(STORAGE_VERSION);
    expect(raw.project).toEqual(project);
  });
  it('sin nada guardado → null', () => {
    expect(loadProject(memoryStorage())).toBeNull();
  });
  it('guardar de nuevo sobrescribe', () => {
    const st = memoryStorage();
    saveProject(project, st);
    saveProject({ ...project, name: 'Otro' }, st);
    expect(loadProject(st)?.name).toBe('Otro');
  });
  it('un proyecto sin actividades es válido', () => {
    const st = memoryStorage();
    const empty = { ...project, activities: [] };
    saveProject(empty, st);
    expect(loadProject(st)).toEqual(empty);
  });
  it('clearStoredProject borra lo guardado', () => {
    const st = memoryStorage();
    saveProject(project, st);
    expect(clearStoredProject(st)).toBe(true);
    expect(loadProject(st)).toBeNull();
  });
});

describe('R22 persistencia datos inválidos', () => {
  const put = (value: unknown) => memoryStorage({ [STORAGE_KEY]: typeof value === 'string' ? value : JSON.stringify(value) });

  it('JSON corrupto → null', () => {
    expect(loadProject(put('{no es json'))).toBeNull();
    expect(loadProject(put(''))).toBeNull();
  });
  it('versión distinta → null', () => {
    expect(loadProject(put({ version: STORAGE_VERSION + 1, project }))).toBeNull();
    expect(loadProject(put({ project }))).toBeNull();
  });
  it('proyecto sin actividades como arreglo → null', () => {
    expect(loadProject(put({ version: STORAGE_VERSION, project: { ...project, activities: null } }))).toBeNull();
    expect(loadProject(put({ version: STORAGE_VERSION, project: { ...project, activities: {} } }))).toBeNull();
  });
  it('presupuesto no numérico o NaN serializado (null) → null', () => {
    expect(loadProject(put({ version: STORAGE_VERSION, project: { ...project, budget: '3000' } }))).toBeNull();
    expect(loadProject(put({ version: STORAGE_VERSION, project: { ...project, budget: null } }))).toBeNull();
  });
  it('fechas inválidas → null', () => {
    expect(loadProject(put({ version: STORAGE_VERSION, project: { ...project, startDate: 'ayer' } }))).toBeNull();
    const badAct = { ...activity, plannedEndDate: '' };
    expect(loadProject(put({ version: STORAGE_VERSION, project: { ...project, activities: [badAct] } }))).toBeNull();
  });
  it('actividad con costo faltante → null', () => {
    const { plannedCost: _omit, ...rest } = activity;
    void _omit;
    expect(loadProject(put({ version: STORAGE_VERSION, project: { ...project, activities: [rest] } }))).toBeNull();
  });
  it('valores que no son objeto → null', () => {
    expect(loadProject(put('null'))).toBeNull();
    expect(loadProject(put('[]'))).toBeNull();
    expect(loadProject(put('42'))).toBeNull();
  });
});

describe('R23 persistencia tolerante a fallos', () => {
  it('setItem que lanza (cuota llena) → save devuelve false sin lanzar', () => {
    const st: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {},
    };
    expect(() => saveProject(project, st)).not.toThrow();
    expect(saveProject(project, st)).toBe(false);
  });
  it('getItem que lanza (acceso bloqueado) → load devuelve null sin lanzar', () => {
    const st: StorageLike = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {},
      removeItem: () => {},
    };
    expect(() => loadProject(st)).not.toThrow();
    expect(loadProject(st)).toBeNull();
  });
  it('removeItem que lanza → clear devuelve false sin lanzar', () => {
    const st: StorageLike = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {
        throw new Error('x');
      },
    };
    expect(clearStoredProject(st)).toBe(false);
  });
  it('sin storage (null) → load null, save false, clear false', () => {
    expect(loadProject(null)).toBeNull();
    expect(saveProject(project, null)).toBe(false);
    expect(clearStoredProject(null)).toBe(false);
  });
});
