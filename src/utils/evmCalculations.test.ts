import { describe, it, expect } from 'vitest';
import {
  calculateCostVariance,
  calculateScheduleVariance,
  calculateCPI,
  calculateSPI,
  calculateEACTypical,
  calculateEACAtypical,
  calculateEACCombined,
  calculateETC,
  calculateVAC,
  calculateTCPI_BAC,
  calculateTCPI_EAC,
  calculateEarnedValue,
  calculateTotalEarnedValue,
  calculateTotalActualCost,
  getCostStatus,
  getScheduleStatus,
  getProjectHealth,
  calculateAllEVMMetrics,
  formatCurrency,
  formatPercent,
  formatIndex,
  generateRecommendations
} from './evmCalculations';
import { Activity, Project } from '../types';

// Helper: create a minimal activity
function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: '1',
    wbsCode: '1.1',
    name: 'Test Activity',
    description: '',
    plannedStartDate: '2024-01-01',
    plannedEndDate: '2024-02-01',
    plannedCost: 100000,
    actualCost: 0,
    percentComplete: 0,
    responsable: 'Test',
    category: 'otros',
    ...overrides,
  };
}

// Helper: create a minimal project
function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Test Project',
    description: '',
    client: '',
    location: '',
    startDate: '2024-01-01',
    plannedEndDate: '2024-06-01',
    budget: 500000,
    currency: 'MXN',
    status: 'en_progreso',
    activities: [],
    ...overrides,
  };
}

describe('Cost Variance (CV)', () => {
  it('returns positive when EV > AC (under budget)', () => {
    expect(calculateCostVariance(100, 80)).toBe(20);
  });

  it('returns negative when EV < AC (over budget)', () => {
    expect(calculateCostVariance(80, 100)).toBe(-20);
  });

  it('returns zero when EV equals AC', () => {
    expect(calculateCostVariance(100, 100)).toBe(0);
  });
});

describe('Schedule Variance (SV)', () => {
  it('returns positive when EV > PV (ahead)', () => {
    expect(calculateScheduleVariance(100, 80)).toBe(20);
  });

  it('returns negative when EV < PV (behind)', () => {
    expect(calculateScheduleVariance(80, 100)).toBe(-20);
  });

  it('returns zero when on schedule', () => {
    expect(calculateScheduleVariance(100, 100)).toBe(0);
  });
});

describe('CPI (Cost Performance Index)', () => {
  it('calculates CPI correctly', () => {
    expect(calculateCPI(100, 80)).toBeCloseTo(1.25);
  });

  it('returns 1 when AC is 0 and EV is 0', () => {
    expect(calculateCPI(0, 0)).toBe(1);
  });

  it('returns Infinity when AC is 0 and EV > 0', () => {
    expect(calculateCPI(100, 0)).toBe(Infinity);
  });

  it('returns value < 1 when over budget', () => {
    expect(calculateCPI(80, 100)).toBeCloseTo(0.8);
  });
});

describe('SPI (Schedule Performance Index)', () => {
  it('calculates SPI correctly', () => {
    expect(calculateSPI(100, 80)).toBeCloseTo(1.25);
  });

  it('returns 1 when PV is 0 and EV is 0', () => {
    expect(calculateSPI(0, 0)).toBe(1);
  });

  it('returns value < 1 when behind schedule', () => {
    expect(calculateSPI(80, 100)).toBeCloseTo(0.8);
  });
});

describe('EAC Calculations', () => {
  it('EAC Typical = BAC / CPI', () => {
    expect(calculateEACTypical(100000, 0.8)).toBeCloseTo(125000);
  });

  it('EAC Typical returns Infinity when CPI is 0', () => {
    expect(calculateEACTypical(100000, 0)).toBe(Infinity);
  });

  it('EAC Atypical = AC + (BAC - EV)', () => {
    expect(calculateEACAtypical(50000, 100000, 40000)).toBe(110000);
  });

  it('EAC Combined = AC + (BAC - EV) / (CPI * SPI)', () => {
    const result = calculateEACCombined(50000, 100000, 40000, 0.8, 0.9);
    expect(result).toBeCloseTo(50000 + 60000 / (0.8 * 0.9));
  });

  it('EAC Combined returns Infinity when CPI*SPI is 0', () => {
    expect(calculateEACCombined(50000, 100000, 40000, 0, 0.9)).toBe(Infinity);
  });
});

describe('ETC and VAC', () => {
  it('ETC = EAC - AC', () => {
    expect(calculateETC(120000, 50000)).toBe(70000);
  });

  it('VAC = BAC - EAC (positive = under budget)', () => {
    expect(calculateVAC(100000, 90000)).toBe(10000);
  });

  it('VAC = BAC - EAC (negative = over budget)', () => {
    expect(calculateVAC(100000, 120000)).toBe(-20000);
  });
});

describe('TCPI', () => {
  it('TCPI_BAC calculates correctly', () => {
    // (BAC - EV) / (BAC - AC) = (100000 - 40000) / (100000 - 50000) = 60000/50000 = 1.2
    expect(calculateTCPI_BAC(100000, 40000, 50000)).toBeCloseTo(1.2);
  });

  it('TCPI_BAC returns Infinity when BAC - AC <= 0', () => {
    expect(calculateTCPI_BAC(100000, 40000, 100000)).toBe(Infinity);
  });

  it('TCPI_EAC calculates correctly', () => {
    // (BAC - EV) / (EAC - AC) = (100000 - 40000) / (120000 - 50000) = 60000/70000
    expect(calculateTCPI_EAC(100000, 40000, 120000, 50000)).toBeCloseTo(60000 / 70000);
  });
});

describe('Earned Value per Activity', () => {
  it('calculates EV as plannedCost * percentComplete/100', () => {
    const act = makeActivity({ plannedCost: 200000, percentComplete: 50 });
    expect(calculateEarnedValue(act)).toBe(100000);
  });

  it('returns 0 when percentComplete is 0', () => {
    const act = makeActivity({ plannedCost: 200000, percentComplete: 0 });
    expect(calculateEarnedValue(act)).toBe(0);
  });

  it('returns full cost when 100% complete', () => {
    const act = makeActivity({ plannedCost: 200000, percentComplete: 100 });
    expect(calculateEarnedValue(act)).toBe(200000);
  });
});

describe('Total EV and AC', () => {
  it('sums EV across activities', () => {
    const project = makeProject({
      activities: [
        makeActivity({ id: '1', plannedCost: 100000, percentComplete: 50 }),
        makeActivity({ id: '2', plannedCost: 200000, percentComplete: 25 }),
      ],
    });
    // 50000 + 50000 = 100000
    expect(calculateTotalEarnedValue(project)).toBe(100000);
  });

  it('sums AC across activities', () => {
    const project = makeProject({
      activities: [
        makeActivity({ id: '1', actualCost: 30000 }),
        makeActivity({ id: '2', actualCost: 45000 }),
      ],
    });
    expect(calculateTotalActualCost(project)).toBe(75000);
  });
});

describe('Status Functions', () => {
  it('getCostStatus returns under_budget for CPI > 1.05', () => {
    expect(getCostStatus(1.1)).toBe('under_budget');
  });

  it('getCostStatus returns on_budget for CPI 0.95-1.05', () => {
    expect(getCostStatus(1.0)).toBe('on_budget');
  });

  it('getCostStatus returns over_budget for CPI < 0.95', () => {
    expect(getCostStatus(0.8)).toBe('over_budget');
  });

  it('getScheduleStatus returns under_budget for SPI > 1.05', () => {
    expect(getScheduleStatus(1.1)).toBe('under_budget');
  });

  it('getScheduleStatus returns over_budget for SPI < 0.95', () => {
    expect(getScheduleStatus(0.8)).toBe('over_budget');
  });
});

describe('Project Health', () => {
  it('returns excellent when both CPI and SPI >= 1.0', () => {
    expect(getProjectHealth(1.1, 1.1)).toBe('excellent');
  });

  it('returns good for avg >= 0.9', () => {
    expect(getProjectHealth(0.95, 0.95)).toBe('good');
  });

  it('returns warning for avg >= 0.8', () => {
    expect(getProjectHealth(0.85, 0.85)).toBe('warning');
  });

  it('returns critical for avg < 0.8', () => {
    expect(getProjectHealth(0.7, 0.7)).toBe('critical');
  });
});

describe('calculateAllEVMMetrics', () => {
  it('computes all metrics for a project with activities', () => {
    const project = makeProject({
      budget: 500000,
      activities: [
        makeActivity({ id: '1', plannedCost: 250000, actualCost: 200000, percentComplete: 80 }),
        makeActivity({ id: '2', plannedCost: 250000, actualCost: 100000, percentComplete: 30 }),
      ],
    });

    const metrics = calculateAllEVMMetrics(project, new Date('2024-03-01'));

    // EV = 250000*0.8 + 250000*0.3 = 200000 + 75000 = 275000
    expect(metrics.EV).toBe(275000);
    // AC = 200000 + 100000 = 300000
    expect(metrics.AC).toBe(300000);
    // CV = EV - AC = 275000 - 300000 = -25000
    expect(metrics.CV).toBe(-25000);
    // CPI = 275000 / 300000
    expect(metrics.CPI).toBeCloseTo(275000 / 300000);
    // BAC
    expect(metrics.BAC).toBe(500000);
    // percentComplete = EV / BAC * 100 ~= 55
    expect(metrics.percentComplete).toBeCloseTo(55);
  });

  it('handles empty project', () => {
    const project = makeProject({ budget: 100000, activities: [] });
    const metrics = calculateAllEVMMetrics(project);
    expect(metrics.EV).toBe(0);
    expect(metrics.AC).toBe(0);
    expect(metrics.PV).toBe(0);
    expect(metrics.percentComplete).toBe(0);
  });
});

describe('Format Functions', () => {
  it('formatCurrency formats with MXN by default', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1,000');
  });

  it('formatPercent formats correctly', () => {
    expect(formatPercent(45.67)).toBe('45.7%');
    expect(formatPercent(45.67, 2)).toBe('45.67%');
  });

  it('formatIndex handles Infinity', () => {
    expect(formatIndex(Infinity)).toBe('N/A');
  });

  it('formatIndex formats finite numbers', () => {
    expect(formatIndex(1.234)).toBe('1.23');
  });
});

describe('Recommendations', () => {
  it('generates cost warning when CPI < 0.9', () => {
    const metrics = calculateAllEVMMetrics(
      makeProject({
        budget: 100000,
        activities: [
          makeActivity({ plannedCost: 100000, actualCost: 120000, percentComplete: 100 }),
        ],
      })
    );
    const recs = generateRecommendations(metrics);
    expect(recs.some(r => r.includes('sobre presupuesto'))).toBe(true);
  });

  it('generates positive message when project is on track', () => {
    const metrics = calculateAllEVMMetrics(
      makeProject({
        budget: 200000,
        activities: [
          makeActivity({ plannedCost: 100000, actualCost: 95000, percentComplete: 100 }),
          makeActivity({ id: '2', plannedCost: 100000, actualCost: 50000, percentComplete: 50 }),
        ],
      })
    );
    const recs = generateRecommendations(metrics);
    // CPI > 1.0 so we should get positive cost recommendation or general positive
    expect(recs.length).toBeGreaterThan(0);
  });
});
