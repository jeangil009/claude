// ============================================================================
// TIPOS PARA SISTEMA DE ADMINISTRACIÓN DE PROYECTOS DE CONSTRUCCIÓN
// Basado en PMBOK 7ma Edición y estándares PMI
// ============================================================================

import { Activity, Project } from './index';

// ============================================================================
// 1. PLAN DE GESTIÓN DE LA INTEGRACIÓN
// ============================================================================

export interface ProjectCharter {
  id: string;
  projectId: string;
  title: string;
  purpose: string;
  objectives: ProjectObjective[];
  scope: {
    inScope: string[];
    outOfScope: string[];
  };
  deliverables: Deliverable[];
  milestones: Milestone[];
  assumptions: string[];
  constraints: string[];
  risks: string[];
  budget: {
    estimated: number;
    contingency: number;
    currency: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    duration: number; // días
  };
  stakeholders: string[];
  projectManager: TeamMember;
  sponsor: TeamMember;
  approvalDate?: string;
  approvedBy?: string;
  version: string;
  lastUpdated: string;
}

export interface ProjectObjective {
  id: string;
  description: string;
  type: 'cost' | 'schedule' | 'quality' | 'scope' | 'other';
  metric: string;
  target: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  wbsCode: string;
  dueDate: string;
  acceptanceCriteria: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected';
  assignedTo: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  plannedDate: string;
  actualDate?: string;
  status: 'pending' | 'achieved' | 'delayed' | 'at_risk';
  dependencies: string[];
  deliverables: string[];
  isCritical: boolean;
}

export interface LessonLearned {
  id: string;
  projectId: string;
  date: string;
  category: 'technical' | 'management' | 'organizational' | 'external';
  phase: ProjectPhase;
  title: string;
  situation: string;
  impact: string;
  lessonDescription: string;
  recommendations: string[];
  applicableTo: string[];
  submittedBy: string;
  status: 'draft' | 'reviewed' | 'approved';
}

export type ProjectPhase =
  | 'initiation'
  | 'planning'
  | 'execution'
  | 'monitoring'
  | 'closing';

// ============================================================================
// 2. PLAN DE GESTIÓN DEL ALCANCE
// ============================================================================

export interface ScopeManagementPlan {
  id: string;
  projectId: string;
  scopeStatement: ScopeStatement;
  wbs: WBSElement;
  wbsDictionary: WBSDictionaryEntry[];
  scopeBaseline: ScopeBaseline;
  changeControlProcess: string;
  scopeVerificationProcess: string;
  requirementsTraceabilityMatrix: RequirementTrace[];
}

export interface ScopeStatement {
  projectDescription: string;
  productScope: string;
  projectScope: string;
  acceptanceCriteria: string[];
  deliverables: Deliverable[];
  exclusions: string[];
  constraints: string[];
  assumptions: string[];
}

export interface WBSElement {
  id: string;
  code: string;
  name: string;
  description: string;
  level: number;
  parentId?: string;
  children: WBSElement[];
  isWorkPackage: boolean;
  accountCode?: string;
  responsibleOBS?: string;
  plannedCost?: number;
  plannedDuration?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
}

export interface WBSDictionaryEntry {
  wbsCode: string;
  elementName: string;
  description: string;
  accountCode: string;
  responsibleOrganization: string;
  responsiblePerson: string;
  workDescription: string;
  assumptions: string[];
  constraints: string[];
  milestones: string[];
  acceptanceCriteria: string[];
  technicalReferences: string[];
  qualityRequirements: string[];
  resourceRequirements: ResourceRequirement[];
  costEstimate: number;
  durationEstimate: number;
  dependencies: string[];
  risks: string[];
}

export interface ScopeBaseline {
  approvedScope: string;
  approvedWBS: WBSElement;
  approvedDate: string;
  version: string;
  changes: ScopeChange[];
}

export interface ScopeChange {
  id: string;
  date: string;
  description: string;
  reason: string;
  impact: string;
  approvedBy: string;
}

export interface RequirementTrace {
  id: string;
  requirementId: string;
  requirementDescription: string;
  source: string;
  priority: 'must_have' | 'should_have' | 'could_have' | 'wont_have';
  category: string;
  wbsElement: string;
  deliverable: string;
  testCase: string;
  status: 'proposed' | 'approved' | 'implemented' | 'verified';
}

// ============================================================================
// 3. PLAN DE GESTIÓN DEL CRONOGRAMA
// ============================================================================

export interface ScheduleManagementPlan {
  id: string;
  projectId: string;
  methodology: 'critical_path' | 'critical_chain' | 'agile' | 'hybrid';
  schedulingTool: string;
  unitOfMeasure: 'hours' | 'days' | 'weeks';
  levelOfAccuracy: string;
  controlThresholds: {
    variance: number;
    unit: 'percent' | 'days';
  };
  reportingFormats: string[];
  activities: ScheduleActivity[];
  dependencies: ActivityDependency[];
  criticalPath: string[];
  baselineSchedule: ScheduleBaseline;
  calendars: ProjectCalendar[];
}

export interface ScheduleActivity {
  id: string;
  wbsCode: string;
  name: string;
  description: string;
  duration: number;
  durationUnit: 'hours' | 'days' | 'weeks';
  plannedStart: string;
  plannedFinish: string;
  actualStart?: string;
  actualFinish?: string;
  earlyStart?: string;
  earlyFinish?: string;
  lateStart?: string;
  lateFinish?: string;
  totalFloat: number;
  freeFloat: number;
  isCritical: boolean;
  isMilestone: boolean;
  percentComplete: number;
  predecessors: string[];
  successors: string[];
  resources: ResourceAssignment[];
  constraints: ActivityConstraint[];
  calendarId: string;
}

export interface ActivityDependency {
  id: string;
  predecessorId: string;
  successorId: string;
  type: 'FS' | 'FF' | 'SS' | 'SF'; // Finish-Start, Finish-Finish, Start-Start, Start-Finish
  lag: number;
  lagUnit: 'hours' | 'days' | 'weeks';
}

export interface ActivityConstraint {
  type: 'ASAP' | 'ALAP' | 'SNET' | 'SNLT' | 'FNET' | 'FNLT' | 'MSO' | 'MFO';
  date?: string;
  description: string;
}

export interface ScheduleBaseline {
  id: string;
  version: string;
  approvedDate: string;
  approvedBy: string;
  activities: ScheduleActivity[];
  milestones: Milestone[];
  criticalPath: string[];
}

export interface ProjectCalendar {
  id: string;
  name: string;
  description: string;
  workingDays: number[]; // 0-6, domingo a sábado
  workingHours: {
    start: string;
    end: string;
  };
  holidays: Holiday[];
  exceptions: CalendarException[];
}

export interface Holiday {
  date: string;
  name: string;
  isRecurring: boolean;
}

export interface CalendarException {
  startDate: string;
  endDate: string;
  type: 'working' | 'non_working';
  description: string;
}

// ============================================================================
// 4. PLAN DE GESTIÓN DE COSTOS (Complemento al EVM existente)
// ============================================================================

export interface CostManagementPlan {
  id: string;
  projectId: string;
  unitOfMeasure: string;
  levelOfPrecision: number;
  levelOfAccuracy: string;
  controlThresholds: {
    costVariance: number;
    unit: 'percent' | 'currency';
  };
  rulesOfPerformance: string[];
  reportingFormats: string[];
  costEstimates: CostEstimate[];
  costBaseline: CostBaseline;
  fundingRequirements: FundingRequirement[];
  cashFlow: CashFlowPeriod[];
}

export interface CostEstimate {
  id: string;
  wbsCode: string;
  description: string;
  estimateType: 'ROM' | 'budget' | 'definitive';
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  subcontractorCost: number;
  indirectCost: number;
  contingency: number;
  totalCost: number;
  basis: string;
  assumptions: string[];
  constraints: string[];
  riskAdjustment: number;
  accuracy: string;
}

export interface CostBaseline {
  id: string;
  version: string;
  approvedDate: string;
  approvedBy: string;
  totalBudget: number;
  managementReserve: number;
  contingencyReserve: number;
  performanceMeasurementBaseline: number;
  periodDistribution: CostDistribution[];
}

export interface CostDistribution {
  period: string;
  plannedValue: number;
  cumulativePlannedValue: number;
}

export interface FundingRequirement {
  id: string;
  period: string;
  amount: number;
  cumulativeAmount: number;
  source: string;
  status: 'planned' | 'requested' | 'approved' | 'received';
}

export interface CashFlowPeriod {
  period: string;
  inflows: CashFlowItem[];
  outflows: CashFlowItem[];
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export interface CashFlowItem {
  category: string;
  description: string;
  amount: number;
  date: string;
}

// ============================================================================
// 5. PLAN DE GESTIÓN DE CALIDAD
// ============================================================================

export interface QualityManagementPlan {
  id: string;
  projectId: string;
  qualityPolicy: string;
  qualityObjectives: QualityObjective[];
  qualityStandards: QualityStandard[];
  qualityRoles: QualityRole[];
  qualityMetrics: QualityMetric[];
  qualityControlActivities: QualityControlActivity[];
  qualityAssuranceActivities: QualityAssuranceActivity[];
  inspectionCheckpoints: InspectionCheckpoint[];
  nonConformanceProcess: NonConformanceProcess;
  continuousImprovement: ContinuousImprovementPlan;
}

export interface QualityObjective {
  id: string;
  description: string;
  metric: string;
  target: number;
  tolerance: number;
  unit: string;
  measurementMethod: string;
  frequency: string;
  responsible: string;
}

export interface QualityStandard {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'international' | 'national' | 'industry' | 'company';
  applicableTo: string[];
  requirements: string[];
}

export interface QualityRole {
  role: string;
  responsibilities: string[];
  authority: string[];
  qualifications: string[];
  person: string;
}

export interface QualityMetric {
  id: string;
  name: string;
  description: string;
  formula: string;
  unit: string;
  target: number;
  upperLimit: number;
  lowerLimit: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'per_activity';
  dataSource: string;
  responsible: string;
  currentValue?: number;
  trend?: 'improving' | 'stable' | 'declining';
}

export interface QualityControlActivity {
  id: string;
  name: string;
  description: string;
  wbsCode: string;
  type: 'inspection' | 'testing' | 'measurement' | 'audit';
  procedure: string;
  acceptanceCriteria: string[];
  tools: string[];
  samples: number;
  frequency: string;
  responsible: string;
  records: QualityRecord[];
}

export interface QualityRecord {
  id: string;
  date: string;
  activityId: string;
  inspector: string;
  result: 'pass' | 'fail' | 'conditional';
  measurements: Measurement[];
  observations: string;
  attachments: string[];
  signedBy: string;
}

export interface Measurement {
  parameter: string;
  value: number;
  unit: string;
  specification: string;
  withinSpec: boolean;
}

export interface QualityAssuranceActivity {
  id: string;
  name: string;
  description: string;
  type: 'process_audit' | 'product_audit' | 'review' | 'walkthrough';
  scope: string;
  criteria: string[];
  schedule: string;
  auditor: string;
  status: 'planned' | 'in_progress' | 'completed';
  findings: AuditFinding[];
}

export interface AuditFinding {
  id: string;
  type: 'conformity' | 'observation' | 'minor_nc' | 'major_nc';
  description: string;
  evidence: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  dueDate?: string;
  status: 'open' | 'in_progress' | 'closed';
}

export interface InspectionCheckpoint {
  id: string;
  name: string;
  wbsCode: string;
  phase: string;
  description: string;
  inspectionType: 'hold_point' | 'witness_point' | 'review_point';
  criteria: string[];
  checklist: ChecklistItem[];
  requiredApprovals: string[];
  status: 'pending' | 'passed' | 'failed' | 'waived';
  inspectionDate?: string;
  inspector?: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  description: string;
  requirement: string;
  status: 'pending' | 'ok' | 'not_ok' | 'na';
  comments?: string;
}

export interface NonConformanceProcess {
  identificationProcedure: string;
  documentationRequirements: string[];
  dispositionOptions: string[];
  approvalAuthorities: ApprovalAuthority[];
  trackingSystem: string;
}

export interface ApprovalAuthority {
  level: string;
  description: string;
  authority: string;
  monetaryLimit?: number;
}

export interface ContinuousImprovementPlan {
  methodology: string;
  tools: string[];
  meetingSchedule: string;
  kpis: string[];
  improvementProjects: ImprovementProject[];
}

export interface ImprovementProject {
  id: string;
  name: string;
  description: string;
  objective: string;
  expectedBenefit: string;
  responsible: string;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
  startDate?: string;
  endDate?: string;
  results?: string;
}

// ============================================================================
// 6. PLAN DE GESTIÓN DE RECURSOS
// ============================================================================

export interface ResourceManagementPlan {
  id: string;
  projectId: string;
  humanResources: HumanResourcePlan;
  materialResources: MaterialResourcePlan;
  equipmentResources: EquipmentResourcePlan;
  resourceCalendar: ResourceCalendar;
  teamDevelopmentPlan: TeamDevelopmentPlan;
}

export interface HumanResourcePlan {
  organizationalChart: OrganizationalUnit;
  roles: RoleDefinition[];
  teamMembers: TeamMember[];
  raciMatrix: RACIEntry[];
  staffingPlan: StaffingRequirement[];
  trainingNeeds: TrainingNeed[];
  recognitionPlan: string;
  safetyRequirements: string[];
}

export interface OrganizationalUnit {
  id: string;
  name: string;
  role: string;
  person?: TeamMember;
  children: OrganizationalUnit[];
  reportingTo?: string;
}

export interface RoleDefinition {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  authority: string[];
  qualifications: string[];
  skills: string[];
  experience: string;
  certifications: string[];
  reportingTo: string;
  directReports: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  organization: string;
  skills: Skill[];
  certifications: Certification[];
  availability: Availability;
  costRate: number;
  costRateUnit: 'hour' | 'day' | 'month';
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Skill {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience: number;
}

export interface Certification {
  name: string;
  issuingBody: string;
  dateObtained: string;
  expirationDate?: string;
  status: 'valid' | 'expired' | 'pending';
}

export interface Availability {
  percentAllocation: number;
  startDate: string;
  endDate: string;
  exceptions: AvailabilityException[];
}

export interface AvailabilityException {
  startDate: string;
  endDate: string;
  reason: string;
  type: 'vacation' | 'training' | 'other_project' | 'sick_leave' | 'other';
}

export interface RACIEntry {
  activity: string;
  wbsCode: string;
  responsible: string[];
  accountable: string;
  consulted: string[];
  informed: string[];
}

export interface StaffingRequirement {
  role: string;
  quantity: number;
  startDate: string;
  endDate: string;
  skills: string[];
  source: 'internal' | 'external' | 'contractor';
  status: 'planned' | 'requested' | 'assigned' | 'released';
  assignedPerson?: string;
}

export interface TrainingNeed {
  id: string;
  topic: string;
  description: string;
  targetAudience: string[];
  type: 'technical' | 'soft_skills' | 'safety' | 'tools';
  priority: 'high' | 'medium' | 'low';
  duration: number;
  provider: string;
  cost: number;
  scheduledDate?: string;
  status: 'identified' | 'planned' | 'completed';
}

export interface MaterialResourcePlan {
  materials: Material[];
  procurementSchedule: MaterialProcurement[];
  inventoryPolicy: InventoryPolicy;
  storageRequirements: StorageRequirement[];
}

export interface Material {
  id: string;
  code: string;
  name: string;
  description: string;
  category: MaterialCategory;
  unit: string;
  unitCost: number;
  totalQuantityRequired: number;
  leadTime: number; // días
  suppliers: string[];
  specifications: string;
  qualityRequirements: string[];
  storageRequirements: string;
  shelfLife?: number;
  hazardous: boolean;
  msdsRequired: boolean;
}

export type MaterialCategory =
  | 'concrete'
  | 'steel'
  | 'wood'
  | 'electrical'
  | 'plumbing'
  | 'finishing'
  | 'equipment'
  | 'consumables'
  | 'safety'
  | 'other';

export interface MaterialProcurement {
  materialId: string;
  quantity: number;
  requiredDate: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  supplierId: string;
  purchaseOrder?: string;
  status: 'planned' | 'ordered' | 'in_transit' | 'received' | 'inspected';
}

export interface InventoryPolicy {
  minimumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock: number;
  reviewFrequency: string;
}

export interface StorageRequirement {
  materialCategory: string;
  conditions: string[];
  securityLevel: 'low' | 'medium' | 'high';
  specialHandling: string[];
}

export interface EquipmentResourcePlan {
  equipment: Equipment[];
  utilizationPlan: EquipmentUtilization[];
  maintenanceSchedule: MaintenanceSchedule[];
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  description: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  capacity: string;
  specifications: string[];
  ownership: 'owned' | 'rented' | 'leased';
  dailyRate: number;
  operatorRequired: boolean;
  operatorCost: number;
  fuelConsumption?: number;
  maintenanceSchedule: string;
  certifications: string[];
  status: 'available' | 'in_use' | 'maintenance' | 'unavailable';
}

export type EquipmentType =
  | 'excavator'
  | 'crane'
  | 'truck'
  | 'mixer'
  | 'pump'
  | 'compressor'
  | 'generator'
  | 'scaffold'
  | 'formwork'
  | 'hand_tools'
  | 'survey'
  | 'safety'
  | 'other';

export interface EquipmentUtilization {
  equipmentId: string;
  activityId: string;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  operator?: string;
  status: 'planned' | 'in_use' | 'completed' | 'cancelled';
}

export interface MaintenanceSchedule {
  equipmentId: string;
  type: 'preventive' | 'corrective';
  description: string;
  frequency: string;
  lastMaintenance?: string;
  nextMaintenance: string;
  estimatedDuration: number;
  estimatedCost: number;
  responsible: string;
}

export interface ResourceCalendar {
  id: string;
  resourceType: 'human' | 'equipment' | 'material';
  resourceId: string;
  availability: AvailabilityPeriod[];
}

export interface AvailabilityPeriod {
  startDate: string;
  endDate: string;
  hoursAvailable: number;
  notes?: string;
}

export interface TeamDevelopmentPlan {
  objectives: string[];
  activities: TeamActivity[];
  performanceAssessment: PerformanceAssessment;
  conflictResolution: string;
  recognitionProgram: RecognitionProgram;
}

export interface TeamActivity {
  id: string;
  name: string;
  type: 'training' | 'team_building' | 'workshop' | 'mentoring';
  description: string;
  participants: string[];
  scheduledDate: string;
  duration: number;
  facilitator: string;
  status: 'planned' | 'completed' | 'cancelled';
}

export interface PerformanceAssessment {
  method: string;
  frequency: string;
  criteria: string[];
  feedbackProcess: string;
}

export interface RecognitionProgram {
  criteria: string[];
  types: string[];
  frequency: string;
  budget: number;
}

export interface ResourceAssignment {
  resourceId: string;
  resourceType: 'human' | 'equipment' | 'material';
  resourceName: string;
  units: number;
  unitType: 'percent' | 'hours' | 'quantity';
  costRate: number;
  totalCost: number;
}

export interface ResourceRequirement {
  resourceType: 'human' | 'equipment' | 'material';
  description: string;
  quantity: number;
  unit: string;
  duration?: number;
  skills?: string[];
  specifications?: string;
}

// ============================================================================
// 7. PLAN DE GESTIÓN DE COMUNICACIONES
// ============================================================================

export interface CommunicationManagementPlan {
  id: string;
  projectId: string;
  communicationRequirements: CommunicationRequirement[];
  communicationMatrix: CommunicationMatrixEntry[];
  meetingSchedule: MeetingDefinition[];
  reportingRequirements: ReportDefinition[];
  escalationProcedures: EscalationProcedure[];
  communicationTechnology: CommunicationTechnology[];
  documentManagement: DocumentManagementPlan;
  communicationConstraints: string[];
}

export interface CommunicationRequirement {
  stakeholder: string;
  informationNeeds: string[];
  frequency: string;
  format: string;
  method: string;
  responsible: string;
}

export interface CommunicationMatrixEntry {
  id: string;
  communicationType: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'as_needed' | 'milestone';
  format: 'meeting' | 'email' | 'report' | 'dashboard' | 'presentation' | 'phone';
  sender: string;
  recipients: string[];
  purpose: string;
  deliveryMethod: string;
  template?: string;
}

export interface MeetingDefinition {
  id: string;
  name: string;
  purpose: string;
  frequency: string;
  duration: number; // minutos
  dayOfWeek?: number;
  time?: string;
  location: string;
  facilitator: string;
  requiredAttendees: string[];
  optionalAttendees: string[];
  agenda: string[];
  outputs: string[];
  minutesDistribution: string[];
}

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: 'status' | 'progress' | 'financial' | 'quality' | 'risk' | 'change' | 'closeout';
  frequency: string;
  dueDate: string;
  author: string;
  reviewers: string[];
  approvers: string[];
  distribution: string[];
  format: string;
  template: string;
  contentRequirements: string[];
}

export interface EscalationProcedure {
  level: number;
  trigger: string;
  timeframe: string;
  escalateTo: string;
  communicationMethod: string;
  expectedResponse: string;
}

export interface CommunicationTechnology {
  tool: string;
  purpose: string;
  users: string[];
  accessLevel: string;
  trainingRequired: boolean;
}

export interface DocumentManagementPlan {
  documentRepository: string;
  namingConvention: string;
  versionControl: string;
  accessControl: AccessControlRule[];
  retentionPolicy: RetentionPolicy;
  documentTypes: DocumentType[];
}

export interface AccessControlRule {
  role: string;
  permissions: ('read' | 'write' | 'delete' | 'approve')[];
  documentTypes: string[];
}

export interface RetentionPolicy {
  activeProjectRetention: string;
  archiveRetention: string;
  disposalMethod: string;
}

export interface DocumentType {
  type: string;
  description: string;
  format: string;
  template?: string;
  approvalRequired: boolean;
  retentionPeriod: string;
}

// ============================================================================
// 8. PLAN DE GESTIÓN DE RIESGOS
// ============================================================================

export interface RiskManagementPlan {
  id: string;
  projectId: string;
  methodology: string;
  roles: RiskRole[];
  budgeting: RiskBudget;
  timing: RiskTiming;
  riskCategories: RiskCategory[];
  probabilityDefinitions: ProbabilityDefinition[];
  impactDefinitions: ImpactDefinition[];
  probabilityImpactMatrix: PIMatrixCell[];
  riskRegister: Risk[];
  riskResponseStrategies: RiskResponseStrategy[];
  monitoringApproach: RiskMonitoringApproach;
  reportingFormats: string[];
}

export interface RiskRole {
  role: string;
  responsibilities: string[];
  person: string;
}

export interface RiskBudget {
  contingencyReserve: number;
  managementReserve: number;
  allocationMethod: string;
}

export interface RiskTiming {
  identificationFrequency: string;
  assessmentFrequency: string;
  reviewMeetings: string;
  auditSchedule: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  description: string;
  subcategories: RiskSubcategory[];
}

export interface RiskSubcategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface ProbabilityDefinition {
  level: number;
  name: string;
  description: string;
  percentageRange: {
    min: number;
    max: number;
  };
}

export interface ImpactDefinition {
  level: number;
  name: string;
  costImpact: string;
  scheduleImpact: string;
  qualityImpact: string;
  scopeImpact: string;
}

export interface PIMatrixCell {
  probability: number;
  impact: number;
  score: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  color: string;
}

export interface Risk {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: 'threat' | 'opportunity';
  cause: string;
  effect: string;
  trigger: string;
  wbsElement?: string;
  owner: string;
  identifiedDate: string;
  identifiedBy: string;

  // Evaluación cualitativa
  probability: number;
  impact: number;
  score: number;
  priority: 'low' | 'medium' | 'high' | 'critical';

  // Evaluación cuantitativa (opcional)
  quantitativeAnalysis?: QuantitativeRiskAnalysis;

  // Respuesta al riesgo
  responseStrategy: RiskResponseType;
  responseDescription: string;
  responsePlan: string[];
  contingencyPlan?: string;
  fallbackPlan?: string;
  residualProbability?: number;
  residualImpact?: number;
  residualScore?: number;
  secondaryRisks?: string[];

  // Seguimiento
  status: 'identified' | 'analyzed' | 'response_planned' | 'monitoring' | 'occurred' | 'closed';
  lastReviewDate?: string;
  nextReviewDate?: string;
  actualOutcome?: string;
  lessonsLearned?: string;

  // Costos
  expectedMonetaryValue?: number;
  contingencyBudget?: number;
  actualCost?: number;
}

export type RiskResponseType =
  | 'avoid'
  | 'transfer'
  | 'mitigate'
  | 'accept'
  | 'exploit'
  | 'share'
  | 'enhance'
  | 'escalate';

export interface QuantitativeRiskAnalysis {
  method: 'monte_carlo' | 'decision_tree' | 'sensitivity' | 'expected_value';
  costImpactMin: number;
  costImpactMost: number;
  costImpactMax: number;
  scheduleImpactMin: number;
  scheduleImpactMost: number;
  scheduleImpactMax: number;
  expectedMonetaryValue: number;
  confidenceLevel: number;
}

export interface RiskResponseStrategy {
  type: RiskResponseType;
  applicableTo: 'threat' | 'opportunity' | 'both';
  description: string;
  examples: string[];
}

export interface RiskMonitoringApproach {
  reviewFrequency: string;
  triggerMonitoring: string;
  earlyWarningIndicators: string[];
  reportingRequirements: string[];
  auditSchedule: string;
}

// ============================================================================
// 9. PLAN DE GESTIÓN DE ADQUISICIONES
// ============================================================================

export interface ProcurementManagementPlan {
  id: string;
  projectId: string;
  procurementStrategy: ProcurementStrategy;
  makeOrBuyDecisions: MakeOrBuyDecision[];
  procurementDocuments: ProcurementDocument[];
  vendors: Vendor[];
  contracts: Contract[];
  procurementSchedule: ProcurementScheduleItem[];
  evaluationCriteria: EvaluationCriteria;
  contractAdministration: ContractAdministration;
  procurementMetrics: ProcurementMetric[];
}

export interface ProcurementStrategy {
  approach: string;
  contractTypes: string[];
  competitionLevel: string;
  prequalificationRequired: boolean;
  localContentRequirements: string;
  sustainabilityRequirements: string[];
}

export interface MakeOrBuyDecision {
  id: string;
  item: string;
  description: string;
  decision: 'make' | 'buy';
  rationale: string;
  costAnalysis: {
    makeCost: number;
    buyCost: number;
    factors: string[];
  };
  risks: string[];
  approvedBy: string;
  approvalDate: string;
}

export interface ProcurementDocument {
  id: string;
  type: 'RFI' | 'RFQ' | 'RFP' | 'IFB';
  title: string;
  description: string;
  scope: string;
  requirements: string[];
  evaluationCriteria: string[];
  submissionDeadline: string;
  contactPerson: string;
  status: 'draft' | 'issued' | 'responses_received' | 'evaluated' | 'awarded' | 'cancelled';
  responses: VendorResponse[];
}

export interface VendorResponse {
  vendorId: string;
  submissionDate: string;
  technicalScore?: number;
  commercialScore?: number;
  totalScore?: number;
  rank?: number;
  status: 'received' | 'under_review' | 'shortlisted' | 'selected' | 'rejected';
  evaluationNotes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'supplier' | 'contractor' | 'consultant';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  qualifications: string[];
  certifications: string[];
  experience: VendorExperience[];
  financialInfo: {
    creditRating?: string;
    annualRevenue?: number;
    insuranceCoverage?: number;
  };
  performanceHistory: VendorPerformance[];
  status: 'potential' | 'prequalified' | 'approved' | 'preferred' | 'suspended' | 'blacklisted';
  prequalificationDate?: string;
  expirationDate?: string;
}

export interface VendorExperience {
  projectName: string;
  client: string;
  value: number;
  completionDate: string;
  relevance: string;
}

export interface VendorPerformance {
  contractId: string;
  projectName: string;
  period: string;
  qualityScore: number;
  scheduleScore: number;
  safetyScore: number;
  cooperationScore: number;
  overallScore: number;
  issues: string[];
  comments: string;
}

export interface Contract {
  id: string;
  number: string;
  title: string;
  vendorId: string;
  type: ContractType;
  scope: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  paymentTerms: PaymentTerm[];
  deliverables: ContractDeliverable[];
  milestones: ContractMilestone[];
  warranties: Warranty[];
  insurance: InsuranceRequirement[];
  bonds: BondRequirement[];
  penalties: Penalty[];
  changeOrders: ChangeOrder[];
  claims: Claim[];
  status: 'draft' | 'negotiation' | 'active' | 'suspended' | 'completed' | 'terminated';
  signedDate?: string;
  administrator: string;
}

export type ContractType =
  | 'fixed_price'
  | 'cost_plus_fixed_fee'
  | 'cost_plus_incentive'
  | 'time_and_materials'
  | 'unit_price';

export interface PaymentTerm {
  id: string;
  description: string;
  amount: number;
  percentage: number;
  condition: string;
  dueDate?: string;
  status: 'pending' | 'invoiced' | 'approved' | 'paid';
  invoiceNumber?: string;
  paymentDate?: string;
}

export interface ContractDeliverable {
  id: string;
  description: string;
  dueDate: string;
  acceptanceCriteria: string[];
  status: 'pending' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submissionDate?: string;
  acceptanceDate?: string;
}

export interface ContractMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  payment?: number;
  status: 'pending' | 'achieved' | 'delayed';
  achievementDate?: string;
}

export interface Warranty {
  type: string;
  coverage: string;
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  startDate?: string;
  endDate?: string;
  conditions: string[];
}

export interface InsuranceRequirement {
  type: string;
  minimumCoverage: number;
  provider?: string;
  policyNumber?: string;
  expirationDate?: string;
  status: 'required' | 'provided' | 'verified' | 'expired';
}

export interface BondRequirement {
  type: 'bid' | 'performance' | 'payment' | 'maintenance';
  amount: number;
  percentage?: number;
  provider?: string;
  bondNumber?: string;
  expirationDate?: string;
  status: 'required' | 'provided' | 'released';
}

export interface Penalty {
  type: 'delay' | 'quality' | 'safety' | 'other';
  description: string;
  condition: string;
  amount: number;
  calculationMethod: string;
  maxAmount?: number;
}

export interface ChangeOrder {
  id: string;
  number: string;
  contractId: string;
  title: string;
  description: string;
  reason: string;
  scopeChange: string;
  costImpact: number;
  scheduleImpact: number;
  requestedBy: string;
  requestDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  approvedBy?: string;
  approvalDate?: string;
}

export interface Claim {
  id: string;
  contractId: string;
  type: 'time_extension' | 'cost_adjustment' | 'dispute';
  title: string;
  description: string;
  amount?: number;
  timeExtension?: number;
  submittedBy: string;
  submissionDate: string;
  status: 'submitted' | 'under_review' | 'negotiation' | 'approved' | 'rejected' | 'arbitration' | 'resolved';
  resolution?: string;
  resolutionDate?: string;
}

export interface EvaluationCriteria {
  technicalCriteria: CriterionWeight[];
  commercialCriteria: CriterionWeight[];
  weightDistribution: {
    technical: number;
    commercial: number;
  };
  minimumScore: number;
}

export interface CriterionWeight {
  criterion: string;
  weight: number;
  description: string;
  scoringGuide: string;
}

export interface ContractAdministration {
  administrator: string;
  responsibilities: string[];
  reportingRequirements: string[];
  meetingSchedule: string;
  paymentProcess: string[];
  changeOrderProcess: string[];
  disputeResolutionProcess: string[];
  closeoutRequirements: string[];
}

export interface ProcurementScheduleItem {
  id: string;
  item: string;
  procurementMethod: string;
  plannedRFPDate: string;
  plannedAwardDate: string;
  plannedDeliveryDate: string;
  actualRFPDate?: string;
  actualAwardDate?: string;
  actualDeliveryDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
}

export interface ProcurementMetric {
  name: string;
  description: string;
  formula: string;
  target: number;
  currentValue?: number;
  status?: 'on_track' | 'at_risk' | 'off_track';
}

// ============================================================================
// 10. PLAN DE GESTIÓN DE INTERESADOS
// ============================================================================

export interface StakeholderManagementPlan {
  id: string;
  projectId: string;
  stakeholderRegister: Stakeholder[];
  powerInterestMatrix: PowerInterestPosition[];
  engagementStrategy: EngagementStrategy[];
  communicationApproach: StakeholderCommunication[];
  engagementAssessment: EngagementAssessment[];
  issuesLog: StakeholderIssue[];
}

export interface Stakeholder {
  id: string;
  name: string;
  organization: string;
  role: string;
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
  };
  type: 'internal' | 'external';
  category: StakeholderCategory;
  requirements: string[];
  expectations: string[];
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
  power: 'high' | 'medium' | 'low';
  urgency: 'high' | 'medium' | 'low';
  legitimacy: 'high' | 'medium' | 'low';
  attitude: 'supportive' | 'neutral' | 'resistant' | 'unaware';
  currentEngagement: EngagementLevel;
  desiredEngagement: EngagementLevel;
  potentialImpact: string;
  engagementStrategy: string;
}

export type StakeholderCategory =
  | 'sponsor'
  | 'customer'
  | 'end_user'
  | 'team_member'
  | 'functional_manager'
  | 'government'
  | 'community'
  | 'media'
  | 'supplier'
  | 'contractor'
  | 'other';

export type EngagementLevel =
  | 'unaware'
  | 'resistant'
  | 'neutral'
  | 'supportive'
  | 'leading';

export interface PowerInterestPosition {
  stakeholderId: string;
  power: number; // 1-10
  interest: number; // 1-10
  quadrant: 'manage_closely' | 'keep_satisfied' | 'keep_informed' | 'monitor';
  strategy: string;
}

export interface EngagementStrategy {
  stakeholderId: string;
  objective: string;
  approach: string;
  tactics: string[];
  frequency: string;
  responsible: string;
  successIndicators: string[];
}

export interface StakeholderCommunication {
  stakeholderId: string;
  informationNeeds: string[];
  communicationMethod: string[];
  frequency: string;
  format: string;
  sender: string;
  feedbackMechanism: string;
}

export interface EngagementAssessment {
  date: string;
  stakeholderId: string;
  currentLevel: EngagementLevel;
  desiredLevel: EngagementLevel;
  gap: number;
  actions: string[];
  responsible: string;
  dueDate: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface StakeholderIssue {
  id: string;
  stakeholderId: string;
  date: string;
  description: string;
  type: 'concern' | 'complaint' | 'request' | 'conflict';
  priority: 'high' | 'medium' | 'low';
  owner: string;
  resolution: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  resolutionDate?: string;
}

// ============================================================================
// 11. PLAN HSE (SEGURIDAD, SALUD Y MEDIO AMBIENTE)
// ============================================================================

export interface HSEManagementPlan {
  id: string;
  projectId: string;
  hsePolicy: HSEPolicy;
  organizationalStructure: HSEOrganization;
  hazardIdentification: HazardIdentification;
  riskAssessment: HSERiskAssessment[];
  safetyProcedures: SafetyProcedure[];
  environmentalPlan: EnvironmentalPlan;
  healthPlan: OccupationalHealthPlan;
  emergencyResponse: EmergencyResponsePlan;
  trainingProgram: HSETrainingProgram;
  inspectionProgram: HSEInspectionProgram;
  incidentManagement: IncidentManagement;
  performanceMonitoring: HSEPerformanceMonitoring;
  documentationRequirements: HSEDocumentation;
}

export interface HSEPolicy {
  statement: string;
  commitments: string[];
  objectives: HSEObjective[];
  responsibilities: string[];
  compliance: string[];
  communicationPlan: string;
  reviewFrequency: string;
  approvedBy: string;
  approvalDate: string;
}

export interface HSEObjective {
  id: string;
  category: 'safety' | 'health' | 'environment';
  description: string;
  target: string;
  metric: string;
  currentValue?: number;
  responsible: string;
  dueDate: string;
  status: 'on_track' | 'at_risk' | 'achieved' | 'missed';
}

export interface HSEOrganization {
  hseManager: TeamMember;
  safetyOfficers: TeamMember[];
  emergencyTeam: EmergencyTeamMember[];
  committees: HSECommittee[];
  responsibilities: HSEResponsibility[];
}

export interface EmergencyTeamMember {
  person: TeamMember;
  role: string;
  training: string[];
  certifications: string[];
  contactInfo: {
    primary: string;
    secondary: string;
  };
}

export interface HSECommittee {
  name: string;
  purpose: string;
  members: string[];
  meetingFrequency: string;
  responsibilities: string[];
}

export interface HSEResponsibility {
  role: string;
  safetyResponsibilities: string[];
  healthResponsibilities: string[];
  environmentalResponsibilities: string[];
}

export interface HazardIdentification {
  methodology: string;
  scope: string[];
  hazardCategories: HazardCategory[];
  identifiedHazards: Hazard[];
  reviewFrequency: string;
}

export interface HazardCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface Hazard {
  id: string;
  code: string;
  category: string;
  description: string;
  location: string;
  activity: string;
  potentialConsequences: string[];
  existingControls: string[];
  identifiedDate: string;
  identifiedBy: string;
  status: 'active' | 'controlled' | 'eliminated';
}

export interface HSERiskAssessment {
  id: string;
  hazardId: string;
  assessmentDate: string;
  assessor: string;
  likelihood: number; // 1-5
  severity: number; // 1-5
  riskLevel: number;
  riskRating: 'low' | 'medium' | 'high' | 'extreme';
  controlMeasures: ControlMeasure[];
  residualLikelihood: number;
  residualSeverity: number;
  residualRiskLevel: number;
  residualRiskRating: 'low' | 'medium' | 'high' | 'extreme';
  acceptability: 'acceptable' | 'tolerable' | 'unacceptable';
  reviewDate: string;
}

export interface ControlMeasure {
  id: string;
  type: 'elimination' | 'substitution' | 'engineering' | 'administrative' | 'ppe';
  description: string;
  effectiveness: 'high' | 'medium' | 'low';
  implementationDate?: string;
  responsible: string;
  verificationMethod: string;
  status: 'planned' | 'implemented' | 'verified';
}

export interface SafetyProcedure {
  id: string;
  code: string;
  title: string;
  purpose: string;
  scope: string;
  applicableActivities: string[];
  hazards: string[];
  ppeRequired: PPERequirement[];
  steps: ProcedureStep[];
  permitRequired: boolean;
  permitType?: string;
  authorizedPersonnel: string[];
  emergencyProcedure: string;
  references: string[];
  version: string;
  effectiveDate: string;
  reviewDate: string;
}

export interface PPERequirement {
  type: PPEType;
  specification: string;
  standard: string;
  mandatory: boolean;
}

export type PPEType =
  | 'hard_hat'
  | 'safety_glasses'
  | 'face_shield'
  | 'hearing_protection'
  | 'respirator'
  | 'safety_vest'
  | 'safety_boots'
  | 'gloves'
  | 'fall_protection'
  | 'coveralls'
  | 'other';

export interface ProcedureStep {
  stepNumber: number;
  description: string;
  hazards: string[];
  controls: string[];
  responsible: string;
}

export interface EnvironmentalPlan {
  environmentalPolicy: string;
  significantAspects: EnvironmentalAspect[];
  permits: EnvironmentalPermit[];
  wasteManagement: WasteManagementPlan;
  emissionsControl: EmissionsControl;
  noiseControl: NoiseControl;
  erosionControl: ErosionControl;
  spilPrevention: SpillPreventionPlan;
  biodiversityProtection: BiodiversityPlan;
  monitoringProgram: EnvironmentalMonitoring[];
}

export interface EnvironmentalAspect {
  id: string;
  activity: string;
  aspect: string;
  impact: string;
  significance: 'low' | 'medium' | 'high';
  legalRequirement?: string;
  controlMeasures: string[];
  monitoring: string;
}

export interface EnvironmentalPermit {
  id: string;
  type: string;
  issuingAuthority: string;
  permitNumber: string;
  issueDate: string;
  expirationDate: string;
  conditions: string[];
  status: 'valid' | 'expired' | 'pending' | 'revoked';
}

export interface WasteManagementPlan {
  wasteTypes: WasteType[];
  segregationProcedures: string[];
  storageRequirements: string[];
  disposalMethods: DisposalMethod[];
  recyclingTargets: RecyclingTarget[];
  contractors: string[];
  documentation: string[];
}

export interface WasteType {
  id: string;
  name: string;
  category: 'hazardous' | 'non_hazardous' | 'recyclable' | 'construction_debris';
  source: string;
  estimatedQuantity: number;
  unit: string;
  handlingProcedure: string;
  disposalMethod: string;
}

export interface DisposalMethod {
  wasteType: string;
  method: string;
  facility: string;
  frequency: string;
  documentation: string[];
}

export interface RecyclingTarget {
  material: string;
  targetPercentage: number;
  currentPercentage?: number;
  method: string;
}

export interface EmissionsControl {
  sources: EmissionSource[];
  controlMeasures: string[];
  monitoringFrequency: string;
  limits: EmissionLimit[];
}

export interface EmissionSource {
  id: string;
  source: string;
  pollutant: string;
  estimatedEmission: number;
  unit: string;
  controlMeasure: string;
}

export interface EmissionLimit {
  pollutant: string;
  limit: number;
  unit: string;
  regulation: string;
}

export interface NoiseControl {
  noiseSources: NoiseSource[];
  limits: NoiseLimit[];
  controlMeasures: string[];
  monitoringLocations: string[];
  monitoringFrequency: string;
  workingHoursRestrictions: string;
}

export interface NoiseSource {
  source: string;
  activity: string;
  estimatedLevel: number;
  duration: string;
  controlMeasure: string;
}

export interface NoiseLimit {
  location: string;
  dayLimit: number;
  nightLimit: number;
  regulation: string;
}

export interface ErosionControl {
  measures: ErosionControlMeasure[];
  inspectionFrequency: string;
  maintenanceRequirements: string[];
  contingencyPlan: string;
}

export interface ErosionControlMeasure {
  type: string;
  location: string;
  specification: string;
  installationDate?: string;
  status: 'planned' | 'installed' | 'maintained';
}

export interface SpillPreventionPlan {
  hazardousMaterials: HazardousMaterial[];
  storageRequirements: string[];
  containmentMeasures: string[];
  responseEquipment: string[];
  responseProcedure: string[];
  reportingRequirements: string[];
  trainingRequirements: string[];
}

export interface HazardousMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  msdsAvailable: boolean;
  handlingProcedure: string;
  spillResponse: string;
}

export interface BiodiversityPlan {
  sensitiveAreas: SensitiveArea[];
  protectionMeasures: string[];
  monitoringRequirements: string[];
  restorationPlan?: string;
}

export interface SensitiveArea {
  id: string;
  name: string;
  type: string;
  location: string;
  species: string[];
  protectionMeasures: string[];
  bufferZone?: number;
}

export interface EnvironmentalMonitoring {
  parameter: string;
  location: string;
  frequency: string;
  method: string;
  limit?: number;
  unit: string;
  responsible: string;
  records: MonitoringRecord[];
}

export interface MonitoringRecord {
  date: string;
  value: number;
  withinLimit: boolean;
  action?: string;
  recorder: string;
}

export interface OccupationalHealthPlan {
  healthPolicy: string;
  medicalSurveillance: MedicalSurveillance;
  occupationalHazards: OccupationalHazard[];
  healthPrograms: HealthProgram[];
  firstAidProvisions: FirstAidProvision;
  fitnessForDuty: FitnessForDutyProgram;
}

export interface MedicalSurveillance {
  preEmploymentExam: string[];
  periodicExams: PeriodicExam[];
  exposureMonitoring: ExposureMonitoring[];
  recordRetention: string;
}

export interface PeriodicExam {
  examType: string;
  frequency: string;
  applicableTo: string[];
  parameters: string[];
}

export interface ExposureMonitoring {
  hazard: string;
  method: string;
  frequency: string;
  exposureLimit: number;
  unit: string;
}

export interface OccupationalHazard {
  id: string;
  type: 'physical' | 'chemical' | 'biological' | 'ergonomic' | 'psychosocial';
  description: string;
  healthEffects: string[];
  exposureLimit?: string;
  controlMeasures: string[];
  monitoring: string;
}

export interface HealthProgram {
  id: string;
  name: string;
  objective: string;
  activities: string[];
  frequency: string;
  participants: string[];
  responsible: string;
}

export interface FirstAidProvision {
  firstAidKits: FirstAidKit[];
  trainedPersonnel: string[];
  emergencyContacts: EmergencyContact[];
  medicalFacilities: string[];
}

export interface FirstAidKit {
  location: string;
  type: 'basic' | 'advanced';
  contents: string[];
  inspectionFrequency: string;
  lastInspection?: string;
}

export interface EmergencyContact {
  service: string;
  name: string;
  phone: string;
  address?: string;
  responseTime?: string;
}

export interface FitnessForDutyProgram {
  policy: string;
  requirements: string[];
  testingProcedures: string[];
  consequences: string[];
}

export interface EmergencyResponsePlan {
  emergencyTypes: EmergencyType[];
  organizationChart: EmergencyOrganization;
  communicationPlan: EmergencyCommunication;
  evacuationPlan: EvacuationPlan;
  emergencyEquipment: EmergencyEquipment[];
  drillSchedule: EmergencyDrill[];
  externalResources: ExternalResource[];
  recoveryProcedures: string[];
}

export interface EmergencyType {
  id: string;
  type: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  severity: 'low' | 'medium' | 'high' | 'catastrophic';
  responseProcedure: string[];
  resources: string[];
  notifications: string[];
}

export interface EmergencyOrganization {
  commander: string;
  roles: EmergencyRole[];
  alternates: AlternateAssignment[];
}

export interface EmergencyRole {
  role: string;
  responsibilities: string[];
  person: string;
  contact: string;
}

export interface AlternateAssignment {
  primaryRole: string;
  alternate: string;
  contact: string;
}

export interface EmergencyCommunication {
  alarmSystems: AlarmSystem[];
  notificationProcedure: string[];
  externalNotifications: ExternalNotification[];
  assemblyPoints: AssemblyPoint[];
}

export interface AlarmSystem {
  type: string;
  location: string;
  signal: string;
  testingFrequency: string;
}

export interface ExternalNotification {
  agency: string;
  contact: string;
  notificationCriteria: string;
  timeframe: string;
}

export interface AssemblyPoint {
  id: string;
  location: string;
  capacity: number;
  assignedAreas: string[];
  coordinator: string;
}

export interface EvacuationPlan {
  routes: EvacuationRoute[];
  procedures: string[];
  specialNeeds: string[];
  accountingProcedure: string;
  reentryProcedure: string;
}

export interface EvacuationRoute {
  id: string;
  fromArea: string;
  toAssemblyPoint: string;
  primaryRoute: string;
  alternateRoute: string;
  capacity: number;
}

export interface EmergencyEquipment {
  type: string;
  location: string;
  quantity: number;
  inspectionFrequency: string;
  lastInspection?: string;
  status: 'operational' | 'needs_maintenance' | 'out_of_service';
}

export interface EmergencyDrill {
  id: string;
  type: string;
  scheduledDate: string;
  actualDate?: string;
  participants: number;
  scenario: string;
  objectives: string[];
  results?: string;
  lessonsLearned?: string[];
  correctiveActions?: string[];
  status: 'planned' | 'completed' | 'cancelled';
}

export interface ExternalResource {
  service: string;
  provider: string;
  contact: string;
  responseTime: string;
  capabilities: string[];
  contractInPlace: boolean;
}

export interface HSETrainingProgram {
  trainingMatrix: TrainingMatrixEntry[];
  trainingCourses: TrainingCourse[];
  trainingRecords: TrainingRecord[];
  competencyRequirements: CompetencyRequirement[];
}

export interface TrainingMatrixEntry {
  role: string;
  requiredTraining: string[];
  refresherFrequency: string;
}

export interface TrainingCourse {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'induction' | 'specialized' | 'refresher' | 'toolbox';
  duration: number;
  durationUnit: 'hours' | 'days';
  provider: 'internal' | 'external';
  providerName?: string;
  certification?: string;
  validityPeriod?: number;
  content: string[];
  targetAudience: string[];
}

export interface TrainingRecord {
  id: string;
  personId: string;
  courseId: string;
  date: string;
  score?: number;
  passed: boolean;
  certificateNumber?: string;
  expirationDate?: string;
  trainer: string;
}

export interface CompetencyRequirement {
  activity: string;
  competencies: string[];
  certifications: string[];
  experience: string;
}

export interface HSEInspectionProgram {
  inspectionTypes: InspectionType[];
  inspectionSchedule: ScheduledInspection[];
  inspectionChecklists: InspectionChecklist[];
  inspectionRecords: InspectionRecord[];
}

export interface InspectionType {
  id: string;
  name: string;
  description: string;
  frequency: string;
  scope: string[];
  inspector: string;
  checklist: string;
}

export interface ScheduledInspection {
  id: string;
  typeId: string;
  area: string;
  scheduledDate: string;
  inspector: string;
  status: 'scheduled' | 'completed' | 'overdue' | 'cancelled';
}

export interface InspectionChecklist {
  id: string;
  name: string;
  version: string;
  items: InspectionChecklistItem[];
}

export interface InspectionChecklistItem {
  id: string;
  category: string;
  item: string;
  requirement: string;
  acceptanceCriteria: string;
}

export interface InspectionRecord {
  id: string;
  typeId: string;
  date: string;
  area: string;
  inspector: string;
  findings: InspectionFinding[];
  overallRating: 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  followUpRequired: boolean;
  signedBy: string;
}

export interface InspectionFinding {
  id: string;
  checklistItemId: string;
  status: 'ok' | 'not_ok' | 'na';
  observation?: string;
  photo?: string;
  correctiveAction?: string;
  responsible?: string;
  dueDate?: string;
  closedDate?: string;
}

export interface IncidentManagement {
  reportingProcedure: string[];
  investigationProcedure: string[];
  classificationCriteria: IncidentClassification[];
  incidents: Incident[];
  statistics: IncidentStatistics;
}

export interface IncidentClassification {
  type: string;
  description: string;
  reportingTimeframe: string;
  investigationRequired: boolean;
  notificationRequired: string[];
}

export interface Incident {
  id: string;
  date: string;
  time: string;
  location: string;
  type: 'fatality' | 'lost_time' | 'medical_treatment' | 'first_aid' | 'near_miss' | 'property_damage' | 'environmental';
  description: string;
  injuredPersons?: InjuredPerson[];
  witnesses: string[];
  immediateActions: string[];
  rootCauses?: string[];
  contributingFactors?: string[];
  correctiveActions: CorrectiveAction[];
  preventiveActions: string[];
  lessonsLearned?: string;
  reportedBy: string;
  investigatedBy?: string;
  investigationDate?: string;
  status: 'reported' | 'investigating' | 'actions_pending' | 'closed';
}

export interface InjuredPerson {
  name: string;
  role: string;
  injuryType: string;
  injurySeverity: 'minor' | 'moderate' | 'serious' | 'fatal';
  bodyPart: string;
  treatment: string;
  daysLost?: number;
}

export interface CorrectiveAction {
  id: string;
  description: string;
  responsible: string;
  dueDate: string;
  completedDate?: string;
  status: 'open' | 'in_progress' | 'completed' | 'verified';
  effectiveness?: string;
}

export interface IncidentStatistics {
  totalIncidents: number;
  byType: Record<string, number>;
  ltir: number; // Lost Time Incident Rate
  trir: number; // Total Recordable Incident Rate
  severity: number;
  frequency: number;
  manhours: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface HSEPerformanceMonitoring {
  kpis: HSEKPI[];
  targets: HSETarget[];
  reportingSchedule: string;
  managementReview: ManagementReview[];
}

export interface HSEKPI {
  id: string;
  name: string;
  description: string;
  formula: string;
  unit: string;
  frequency: string;
  target: number;
  currentValue?: number;
  trend?: 'improving' | 'stable' | 'declining';
}

export interface HSETarget {
  id: string;
  category: 'safety' | 'health' | 'environment';
  description: string;
  metric: string;
  target: number;
  unit: string;
  period: string;
  currentValue?: number;
  status: 'on_track' | 'at_risk' | 'achieved' | 'missed';
}

export interface ManagementReview {
  date: string;
  participants: string[];
  agenda: string[];
  decisions: string[];
  actions: string[];
  nextReview: string;
}

export interface HSEDocumentation {
  requiredDocuments: RequiredDocument[];
  recordRetention: RecordRetentionRule[];
  auditTrail: boolean;
}

export interface RequiredDocument {
  type: string;
  description: string;
  format: string;
  retention: string;
  responsible: string;
}

export interface RecordRetentionRule {
  documentType: string;
  retentionPeriod: string;
  storageLocation: string;
  disposalMethod: string;
}

// ============================================================================
// 12. GESTIÓN DE CAMBIOS
// ============================================================================

export interface ChangeManagementPlan {
  id: string;
  projectId: string;
  changeControlBoard: ChangeControlBoard;
  changeProcess: ChangeProcess;
  changeCategories: ChangeCategory[];
  changeLog: ChangeRequest[];
  impactAssessmentCriteria: ImpactCriteria[];
}

export interface ChangeControlBoard {
  members: CCBMember[];
  quorum: number;
  meetingSchedule: string;
  decisionProcess: string;
  escalationPath: string;
}

export interface CCBMember {
  name: string;
  role: string;
  votingRights: boolean;
  alternare?: string;
}

export interface ChangeProcess {
  stages: ChangeStage[];
  templates: string[];
  notifications: ChangeNotification[];
  documentationRequirements: string[];
}

export interface ChangeStage {
  name: string;
  description: string;
  responsible: string;
  approver?: string;
  timeframe: string;
  outputs: string[];
}

export interface ChangeNotification {
  trigger: string;
  recipients: string[];
  method: string;
  template: string;
}

export interface ChangeCategory {
  id: string;
  name: string;
  description: string;
  approvalAuthority: string;
  timeframe: string;
  examples: string[];
}

export interface ChangeRequest {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  type: 'scope' | 'schedule' | 'cost' | 'quality' | 'resource' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestDate: string;
  justification: string;

  // Análisis de impacto
  impactAnalysis?: ChangeImpactAnalysis;

  // Alternativas
  alternatives?: ChangeAlternative[];

  // Decisión
  decision?: 'approved' | 'rejected' | 'deferred' | 'more_info';
  decisionDate?: string;
  decisionBy?: string;
  decisionRationale?: string;
  conditions?: string[];

  // Implementación
  implementationPlan?: string[];
  assignedTo?: string;
  targetDate?: string;
  actualCompletionDate?: string;

  // Estado
  status: 'draft' | 'submitted' | 'analysis' | 'review' | 'approved' | 'rejected' | 'implementing' | 'completed' | 'closed';

  // Documentación
  attachments: string[];
  relatedChanges: string[];
}

export interface ChangeImpactAnalysis {
  scopeImpact: string;
  scheduleImpact: {
    days: number;
    criticalPath: boolean;
    affectedActivities: string[];
  };
  costImpact: {
    amount: number;
    breakdown: CostBreakdown[];
  };
  qualityImpact: string;
  riskImpact: string[];
  resourceImpact: string;
  stakeholderImpact: string;
  contractualImpact: string;
  overallRisk: 'low' | 'medium' | 'high';
  recommendation: string;
  analysedBy: string;
  analysisDate: string;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  description: string;
}

export interface ChangeAlternative {
  id: string;
  description: string;
  pros: string[];
  cons: string[];
  costImpact: number;
  scheduleImpact: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: boolean;
}

export interface ImpactCriteria {
  category: string;
  thresholds: ImpactThreshold[];
}

export interface ImpactThreshold {
  level: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  costRange?: { min: number; max: number };
  scheduleRange?: { min: number; max: number };
  approvalLevel: string;
}

// ============================================================================
// 13. PLAN COMPLETO DEL PROYECTO
// ============================================================================

export interface ProjectManagementPlan {
  id: string;
  projectId: string;
  version: string;
  status: 'draft' | 'approved' | 'active' | 'closed';
  createdDate: string;
  lastUpdated: string;
  approvedBy?: string;
  approvalDate?: string;

  // Planes subsidiarios
  projectCharter: ProjectCharter;
  scopeManagementPlan: ScopeManagementPlan;
  scheduleManagementPlan: ScheduleManagementPlan;
  costManagementPlan: CostManagementPlan;
  qualityManagementPlan: QualityManagementPlan;
  resourceManagementPlan: ResourceManagementPlan;
  communicationManagementPlan: CommunicationManagementPlan;
  riskManagementPlan: RiskManagementPlan;
  procurementManagementPlan: ProcurementManagementPlan;
  stakeholderManagementPlan: StakeholderManagementPlan;
  hseManagementPlan: HSEManagementPlan;
  changeManagementPlan: ChangeManagementPlan;

  // Líneas base
  scopeBaseline: ScopeBaseline;
  scheduleBaseline: ScheduleBaseline;
  costBaseline: CostBaseline;

  // Lecciones aprendidas
  lessonsLearned: LessonLearned[];

  // Métricas del proyecto
  projectMetrics: ProjectMetrics;
}

export interface ProjectMetrics {
  overallHealth: ProjectHealth;
  schedulePerformance: number; // SPI
  costPerformance: number; // CPI
  qualityScore: number;
  safetyScore: number;
  stakeholderSatisfaction: number;
  riskExposure: number;
  changeRequestCount: number;
  openIssuesCount: number;
}

// ============================================================================
// TIPOS AUXILIARES Y UTILIDADES
// ============================================================================

export type DateString = string; // ISO 8601 format

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  entityType: string;
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  description: string;
}

export interface Comment {
  id: string;
  entityType: string;
  entityId: string;
  author: string;
  date: string;
  content: string;
  attachments?: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedDate: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: string;
  primary: boolean;
}

// Constantes para construcción
export const CONSTRUCTION_PHASES = [
  'Preliminares',
  'Cimentación',
  'Estructura',
  'Albañilería',
  'Instalaciones',
  'Acabados',
  'Exteriores',
  'Entrega'
] as const;

export type ConstructionPhase = typeof CONSTRUCTION_PHASES[number];

export const RISK_CATEGORIES_CONSTRUCTION = {
  technical: {
    name: 'Técnicos',
    subcategories: ['Diseño', 'Calidad', 'Tecnología', 'Complejidad']
  },
  external: {
    name: 'Externos',
    subcategories: ['Clima', 'Mercado', 'Regulatorio', 'Comunidad']
  },
  organizational: {
    name: 'Organizacionales',
    subcategories: ['Recursos', 'Dependencias', 'Financiamiento']
  },
  management: {
    name: 'Gestión',
    subcategories: ['Estimación', 'Planificación', 'Control', 'Comunicación']
  }
} as const;

export const HSE_INCIDENT_TYPES = [
  { id: 'fatality', name: 'Fatalidad', severity: 5 },
  { id: 'lost_time', name: 'Tiempo Perdido', severity: 4 },
  { id: 'medical_treatment', name: 'Tratamiento Médico', severity: 3 },
  { id: 'first_aid', name: 'Primeros Auxilios', severity: 2 },
  { id: 'near_miss', name: 'Casi Accidente', severity: 1 },
  { id: 'property_damage', name: 'Daño a Propiedad', severity: 2 },
  { id: 'environmental', name: 'Ambiental', severity: 3 }
] as const;
