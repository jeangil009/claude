import { afterEach, describe, expect, it, vi } from 'vitest';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Activity, ChartDataPoint, Project } from '../types';
import {
  analyzeTrends,
  calculateAllEVMMetrics,
  calculateCostVariance,
  calculateCPI,
  calculateEACAtypical,
  calculateEACCombined,
  calculateEACTypical,
  calculateEarnedValue,
  calculateETC,
  calculatePlannedValue,
  calculateScheduleVariance,
  calculateSPI,
  calculateTCPI_BAC,
  calculateTCPI_EAC,
  calculateTotalActualCost,
  calculateTotalEarnedValue,
  calculateVAC,
  generateActivitySummaries,
  getCostStatus,
  getProjectHealth,
  getScheduleStatus,
} from './evmCalculations';

// ---------- Fixture determinista (fechas locales, sin depender de "hoy") ----------
const act = (over: Partial<Activity>): Activity => ({
  id: 'a',
  wbsCode: '1',
  name: 'act',
  description: '',
  plannedStartDate: '2026-01-01',
  plannedEndDate: '2026-01-11',
  plannedCost: 1000,
  actualCost: 600,
  percentComplete: 50,
  responsable: 'x',
  category: 'otros',
  ...over,
});

const A1 = act({ id: 'a1', name: 'A1' }); // 10 días, 1000, AC 600, 50 %
const A2 = act({
  id: 'a2',
  name: 'A2',
  plannedStartDate: '2026-01-11',
  plannedEndDate: '2026-01-21',
  plannedCost: 2000,
  actualCost: 0,
  percentComplete: 0,
});

const project: Project = {
  id: 'p',
  name: 'p',
  description: '',
  client: '',
  location: '',
  startDate: '2026-01-01',
  plannedEndDate: '2026-01-21',
  budget: 3000,
  currency: 'USD',
  status: 'en_progreso',
  activities: [A1, A2],
};

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

afterEach(() => {
  vi.useRealTimers();
});

describe('R01 CV', () => {
  it('CV = EV - AC', () => {
    expect(calculateCostVariance(500, 600)).toBe(-100);
    expect(calculateCostVariance(700, 600)).toBe(100);
    expect(calculateCostVariance(0, 0)).toBe(0);
  });
});

describe('R02 SV', () => {
  it('SV = EV - PV', () => {
    expect(calculateScheduleVariance(500, 1000)).toBe(-500);
    expect(calculateScheduleVariance(1200, 1000)).toBe(200);
  });
});

describe('R03 CPI', () => {
  it('CPI = EV / AC', () => {
    expect(calculateCPI(500, 600)).toBeCloseTo(5 / 6, 10);
    expect(calculateCPI(600, 500)).toBeCloseTo(1.2, 10);
  });
  it('AC = 0', () => {
    expect(calculateCPI(100, 0)).toBe(Infinity);
    expect(calculateCPI(0, 0)).toBe(1);
  });
});

describe('R04 SPI', () => {
  it('SPI = EV / PV', () => {
    expect(calculateSPI(500, 1000)).toBe(0.5);
    expect(calculateSPI(1500, 1000)).toBe(1.5);
  });
  it('PV = 0', () => {
    expect(calculateSPI(100, 0)).toBe(Infinity);
    expect(calculateSPI(0, 0)).toBe(1);
  });
});

describe('R05 EAC típico', () => {
  it('EAC = BAC / CPI', () => {
    expect(calculateEACTypical(3000, 0.5)).toBe(6000);
    expect(calculateEACTypical(3000, 1)).toBe(3000);
  });
  it('CPI = 0 → Infinity', () => {
    expect(calculateEACTypical(3000, 0)).toBe(Infinity);
  });
});

describe('R06 EAC atípico', () => {
  it('EAC = AC + (BAC - EV)', () => {
    expect(calculateEACAtypical(600, 3000, 500)).toBe(3100);
    expect(calculateEACAtypical(0, 3000, 0)).toBe(3000);
  });
});

describe('R07 EAC combinado', () => {
  it('EAC = AC + (BAC - EV) / (CPI * SPI)', () => {
    // 600 + 2500 / (0.5 * 0.5) = 600 + 10000
    expect(calculateEACCombined(600, 3000, 500, 0.5, 0.5)).toBe(10600);
    expect(calculateEACCombined(600, 3000, 500, 1, 1)).toBe(3100);
  });
  it('denominador 0 → Infinity', () => {
    expect(calculateEACCombined(600, 3000, 500, 0, 1)).toBe(Infinity);
    expect(calculateEACCombined(600, 3000, 500, 1, 0)).toBe(Infinity);
  });
});

describe('R08 ETC', () => {
  it('ETC = EAC - AC', () => {
    expect(calculateETC(3600, 600)).toBe(3000);
  });
});

describe('R09 VAC', () => {
  it('VAC = BAC - EAC', () => {
    expect(calculateVAC(3000, 3600)).toBe(-600);
    expect(calculateVAC(3000, 2500)).toBe(500);
  });
});

describe('R10 TCPI_BAC', () => {
  it('TCPI = (BAC - EV) / (BAC - AC)', () => {
    expect(calculateTCPI_BAC(3000, 500, 600)).toBeCloseTo(2500 / 2400, 10);
  });
  it('BAC - AC <= 0 → Infinity', () => {
    expect(calculateTCPI_BAC(3000, 500, 3000)).toBe(Infinity);
    expect(calculateTCPI_BAC(3000, 500, 3500)).toBe(Infinity);
  });
});

describe('R11 TCPI_EAC', () => {
  it('TCPI = (BAC - EV) / (EAC - AC)', () => {
    expect(calculateTCPI_EAC(3000, 500, 3600, 600)).toBeCloseTo(2500 / 3000, 10);
  });
  it('EAC - AC <= 0 → Infinity', () => {
    expect(calculateTCPI_EAC(3000, 500, 600, 600)).toBe(Infinity);
    expect(calculateTCPI_EAC(3000, 500, 500, 600)).toBe(Infinity);
  });
});

describe('R12 EV y AC', () => {
  it('EV de actividad = costo × %/100', () => {
    expect(calculateEarnedValue(A1)).toBe(500);
    expect(calculateEarnedValue(A2)).toBe(0);
    expect(calculateEarnedValue(act({ plannedCost: 800, percentComplete: 100 }))).toBe(800);
  });
  it('totales del proyecto', () => {
    expect(calculateTotalEarnedValue(project)).toBe(500);
    expect(calculateTotalActualCost(project)).toBe(600);
  });
  it('proyecto sin actividades', () => {
    const empty = { ...project, activities: [] };
    expect(calculateTotalEarnedValue(empty)).toBe(0);
    expect(calculateTotalActualCost(empty)).toBe(0);
  });
});

describe('R13 PV', () => {
  it('antes del inicio de todo → 0', () => {
    expect(calculatePlannedValue(project, d(2025, 12, 31))).toBe(0);
  });
  it('en curso → prorrateo lineal', () => {
    // A1: 5/10 de 1000; A2 aún no inicia
    expect(calculatePlannedValue(project, d(2026, 1, 6))).toBe(500);
  });
  it('en la fecha fin exacta → costo completo de esa actividad', () => {
    // A1 termina el 11; A2 inicia el 11 con 0 días transcurridos
    expect(calculatePlannedValue(project, d(2026, 1, 11))).toBe(1000);
  });
  it('después del fin de todo → BAC', () => {
    expect(calculatePlannedValue(project, d(2026, 1, 31))).toBe(3000);
  });
  it('actividad de duración 0 días no divide entre cero', () => {
    const p = { ...project, activities: [act({ plannedStartDate: '2026-01-05', plannedEndDate: '2026-01-05' })] };
    expect(Number.isFinite(calculatePlannedValue(p, d(2026, 1, 5)))).toBe(true);
    expect(calculatePlannedValue(p, d(2026, 1, 5))).toBe(1000);
  });
});

describe('R14 estados', () => {
  it('costo: >1.05 / [0.95,1.05] / <0.95', () => {
    expect(getCostStatus(1.06)).toBe('under_budget');
    expect(getCostStatus(1.05)).toBe('on_budget');
    expect(getCostStatus(1.0)).toBe('on_budget');
    expect(getCostStatus(0.95)).toBe('on_budget');
    expect(getCostStatus(0.94)).toBe('over_budget');
  });
  it('cronograma: mismos umbrales', () => {
    expect(getScheduleStatus(1.06)).toBe('under_budget');
    expect(getScheduleStatus(1.05)).toBe('on_budget');
    expect(getScheduleStatus(0.95)).toBe('on_budget');
    expect(getScheduleStatus(0.94)).toBe('over_budget');
  });
});

describe('R15 salud', () => {
  it('umbrales sobre el promedio CPI/SPI', () => {
    expect(getProjectHealth(1.0, 1.0)).toBe('excellent');
    expect(getProjectHealth(0.9, 0.9)).toBe('good');
    expect(getProjectHealth(0.8, 0.8)).toBe('warning');
    expect(getProjectHealth(0.79, 0.79)).toBe('critical');
    expect(getProjectHealth(1.2, 0.8)).toBe('excellent'); // promedio 1.0
  });
});

describe('R16 métricas', () => {
  const m = calculateAllEVMMetrics(project, d(2026, 1, 11));
  it('valores base', () => {
    expect(m.BAC).toBe(3000);
    expect(m.PV).toBe(1000);
    expect(m.EV).toBe(500);
    expect(m.AC).toBe(600);
  });
  it('varianzas e índices', () => {
    expect(m.CV).toBe(-100);
    expect(m.SV).toBe(-500);
    expect(m.CPI).toBeCloseTo(5 / 6, 10);
    expect(m.SPI).toBe(0.5);
  });
  it('proyecciones', () => {
    expect(m.EAC_typical).toBeCloseTo(3600, 6);
    expect(m.EAC_atypical).toBe(3100);
    expect(m.EAC_combined).toBeCloseTo(6600, 6);
  });
  it('identidades ETC y VAC', () => {
    expect(m.ETC).toBeCloseTo(m.EAC_typical - m.AC, 6);
    expect(m.VAC).toBeCloseTo(m.BAC - m.EAC_typical, 6);
    expect(m.ETC).toBeCloseTo(3000, 6);
    expect(m.VAC).toBeCloseTo(-600, 6);
  });
  it('TCPI y porcentajes', () => {
    expect(m.TCPI_BAC).toBeCloseTo(2500 / 2400, 10);
    expect(m.TCPI_EAC).toBeCloseTo(2500 / 3000, 10);
    expect(m.percentComplete).toBeCloseTo((500 / 3000) * 100, 10);
    expect(m.percentSpent).toBeCloseTo(20, 10);
    expect(m.percentScheduled).toBeCloseTo((1000 / 3000) * 100, 10);
  });
  it('estados', () => {
    expect(m.costStatus).toBe('over_budget');
    expect(m.scheduleStatus).toBe('over_budget');
    expect(m.overallHealth).toBe('critical');
  });
  it('BAC = 0 no produce NaN en porcentajes', () => {
    const z = calculateAllEVMMetrics({ ...project, budget: 0, activities: [] }, d(2026, 1, 11));
    expect(z.percentComplete).toBe(0);
    expect(z.percentSpent).toBe(0);
    expect(z.percentScheduled).toBe(0);
  });
});

describe('R17 resúmenes de actividad', () => {
  it('sv = EV - PV de la actividad a la fecha actual (no siempre 0)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(d(2026, 1, 11)); // A1 debería estar 100 % (PV 1000) y va al 50 % (EV 500)
    const [s1, s2] = generateActivitySummaries(project);
    expect(s1.earnedValue).toBe(500);
    expect(s1.cv).toBe(-100);
    expect(s1.sv).toBe(-500);
    expect(s2.sv).toBe(0);
  });
  it('actividad adelantada tiene sv positivo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(d(2026, 1, 6)); // PV A1 = 500
    const ahead = { ...project, activities: [act({ percentComplete: 80 })] };
    const [s] = generateActivitySummaries(ahead);
    expect(s.sv).toBeCloseTo(800 - 500, 6);
  });
});

describe('R18 tendencias', () => {
  const base = calculateAllEVMMetrics(project, d(2026, 1, 11));
  const pt = (CPI: number, SPI: number): ChartDataPoint => ({
    period: 'P',
    date: '',
    PV: 0,
    EV: 0,
    AC: 0,
    BAC: 0,
    CPI,
    SPI,
  });
  const dateStr = (days: number) => format(addDays(d(2026, 1, 11), days), 'dd/MM/yyyy', { locale: es });

  it('proyecto al 100 % → fecha proyectada = hoy', () => {
    vi.useFakeTimers();
    vi.setSystemTime(d(2026, 1, 11));
    const r = analyzeTrends({ ...base, percentComplete: 100, SPI: 1 }, []);
    expect(r.projectedCompletionDate).toBe(dateStr(0));
  });
  it('SPI <= 0 → 999 días', () => {
    vi.useFakeTimers();
    vi.setSystemTime(d(2026, 1, 11));
    const r = analyzeTrends({ ...base, SPI: 0 }, []);
    expect(r.projectedCompletionDate).toBe(dateStr(999));
  });
  it('menor SPI nunca adelanta la fecha proyectada', () => {
    vi.useFakeTimers();
    vi.setSystemTime(d(2026, 1, 11));
    const fast = analyzeTrends({ ...base, percentComplete: 40, SPI: 1.2 }, []);
    const slow = analyzeTrends({ ...base, percentComplete: 40, SPI: 0.6 }, []);
    const parse = (s: string) => {
      const [dd, mm, yy] = s.split('/').map(Number);
      return new Date(yy, mm - 1, dd).getTime();
    };
    expect(parse(slow.projectedCompletionDate)).toBeGreaterThanOrEqual(parse(fast.projectedCompletionDate));
  });
  it('tendencias CPI/SPI con 3+ puntos', () => {
    const up = analyzeTrends(base, [pt(0.8, 0.9), pt(0.85, 0.9), pt(0.9, 0.9)]);
    expect(up.cpiTrend).toBe('improving');
    expect(up.spiTrend).toBe('stable');
    const down = analyzeTrends(base, [pt(1, 1), pt(0.95, 0.95), pt(0.9, 0.9)]);
    expect(down.cpiTrend).toBe('declining');
    expect(down.spiTrend).toBe('declining');
  });
  it('menos de 3 puntos → estable', () => {
    const r = analyzeTrends(base, [pt(1, 1), pt(0.5, 0.5)]);
    expect(r.cpiTrend).toBe('stable');
    expect(r.spiTrend).toBe('stable');
  });
  it('nivel de riesgo por umbrales', () => {
    expect(analyzeTrends({ ...base, CPI: 1, SPI: 1 }, []).riskLevel).toBe('low');
    expect(analyzeTrends({ ...base, CPI: 0.94, SPI: 1 }, []).riskLevel).toBe('medium');
    expect(analyzeTrends({ ...base, CPI: 1, SPI: 0.89 }, []).riskLevel).toBe('high');
    expect(analyzeTrends({ ...base, CPI: 0.79, SPI: 1 }, []).riskLevel).toBe('critical');
  });
  it('costo final proyectado = EAC típico', () => {
    expect(analyzeTrends(base, []).projectedFinalCost).toBe(base.EAC_typical);
  });
});

describe('R17 Checker', () => {
  it('PV por actividad: no iniciada, en el inicio exacto, terminada, costo 0 y sin contaminación entre actividades', () => {
    vi.useFakeTimers();
    const b = act({ id: 'b', name: 'B', plannedStartDate: '2026-01-11', plannedEndDate: '2026-01-21', plannedCost: 2000, percentComplete: 10 });
    const zero = act({ id: 'z', name: 'Z', plannedCost: 0, actualCost: 0, percentComplete: 50 });
    const multi = { ...project, activities: [act({ id: 'a', name: 'A', percentComplete: 20 }), b, zero] };
    const snapshot = JSON.stringify(multi);

    // 06-ene: A en curso (PV 500), B no iniciada con 10 % (PV 0), Z costo 0
    vi.setSystemTime(d(2026, 1, 6));
    const [sa, sb, sz] = generateActivitySummaries(multi);
    expect(sa.sv).toBeCloseTo(200 - 500, 6); // no recibe el PV de B
    expect(sb.sv).toBeCloseTo(200 - 0, 6); // adelantada aunque no haya iniciado; no recibe el PV de A
    expect(sz.sv).toBe(0);
    expect(Number.isNaN(sz.sv)).toBe(false);

    // Fecha exactamente en el inicio de A (01-ene 00:00 local): PV 0
    vi.setSystemTime(d(2026, 1, 1));
    const [ia] = generateActivitySummaries({ ...project, activities: [act({ percentComplete: 50 })] });
    expect(ia.sv).toBe(500);

    // Terminada al 100 % y fecha posterior al fin: PV = EV = costo -> sv 0
    vi.setSystemTime(d(2026, 2, 1));
    const [done] = generateActivitySummaries({ ...project, activities: [act({ percentComplete: 100 })] });
    expect(done.sv).toBe(0);
    // Fecha exactamente en el fin: PV completo
    vi.setSystemTime(d(2026, 1, 11));
    const [atEnd] = generateActivitySummaries({ ...project, activities: [act({ percentComplete: 100 })] });
    expect(atEnd.sv).toBe(0);

    // No muta la entrada
    expect(JSON.stringify(multi)).toBe(snapshot);
  });
});
