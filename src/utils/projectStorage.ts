/**
 * Persistencia del proyecto en localStorage.
 *
 * - Se guarda un sobre versionado { version, project } para poder migrar formatos futuros.
 * - Nada de aquí lanza: si el storage no existe, está bloqueado, lleno o trae datos
 *   corruptos, load devuelve null y save/clear devuelven false.
 */

import type { Activity, Project } from '../types';

export const STORAGE_KEY = 'evm-project';
export const STORAGE_VERSION = 1;

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isDate = (v: unknown): v is string => isStr(v) && ISO_DATE.test(v);

function isValidActivity(a: unknown): a is Activity {
  return (
    isRecord(a) &&
    isStr(a.id) &&
    isStr(a.wbsCode) &&
    isStr(a.name) &&
    isDate(a.plannedStartDate) &&
    isDate(a.plannedEndDate) &&
    isNum(a.plannedCost) &&
    isNum(a.actualCost) &&
    isNum(a.percentComplete)
  );
}

export function isValidProject(p: unknown): p is Project {
  return (
    isRecord(p) &&
    isStr(p.id) &&
    isStr(p.name) &&
    isStr(p.currency) &&
    isDate(p.startDate) &&
    isDate(p.plannedEndDate) &&
    isNum(p.budget) &&
    Array.isArray(p.activities) &&
    p.activities.every(isValidActivity)
  );
}

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null; // acceso bloqueado (modo privado, cookies deshabilitadas)
  }
}

export function loadProject(storage: StorageLike | null = defaultStorage()): Project | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION) return null;
    return isValidProject(parsed.project) ? parsed.project : null;
  } catch {
    return null;
  }
}

export function saveProject(project: Project, storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, project }));
    return true;
  } catch {
    return false; // cuota llena o acceso denegado
  }
}

export function clearStoredProject(storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
