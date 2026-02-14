/**
 * Organization Structure - NESS
 * 
 * Departments and roles for the signature generator
 * All roles are in English as per company standard
 * 
 * Part of ness.OS ecosystem
 */

// Department types
export type DepartmentId = 
  | 'executive'
  | 'sales'
  | 'marketing'
  | 'technology'
  | 'security'
  | 'finance'
  | 'hr'
  | 'legal'
  | 'projects'
  | 'support'
  | 'operations';

// Department structure
export interface Department {
  id: DepartmentId;
  name: string;
  namePt: string;
  roles: Role[];
}

// Role structure with hierarchy levels
export interface Role {
  id: string;
  title: string;
  level: 'c-level' | 'director' | 'manager' | 'senior' | 'mid' | 'junior' | 'intern';
}

// Departments configuration
export const departments: Department[] = [
  {
    id: 'executive',
    name: 'Executive',
    namePt: 'Executivo',
    roles: [
      { id: 'ceo', title: 'CEO', level: 'c-level' },
      { id: 'cfo', title: 'CFO', level: 'c-level' },
      { id: 'cto', title: 'CTO', level: 'c-level' },
      { id: 'coo', title: 'COO', level: 'c-level' },
      { id: 'cmo', title: 'CMO', level: 'c-level' },
      { id: 'cio', title: 'CIO', level: 'c-level' },
      { id: 'cso', title: 'CSO', level: 'c-level' },
      { id: 'chro', title: 'CHRO', level: 'c-level' },
      { id: 'cpo', title: 'CPO', level: 'c-level' },
      { id: 'cdo', title: 'CDO', level: 'c-level' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    namePt: 'Comercial',
    roles: [
      { id: 'sales-director', title: 'Sales Director', level: 'director' },
      { id: 'sales-manager', title: 'Sales Manager', level: 'manager' },
      { id: 'account-executive', title: 'Account Executive', level: 'senior' },
      { id: 'senior-account-executive', title: 'Senior Account Executive', level: 'senior' },
      { id: 'sales-representative', title: 'Sales Representative', level: 'mid' },
      { id: 'business-development', title: 'Business Development Representative', level: 'junior' },
      { id: 'sales-analyst', title: 'Sales Analyst', level: 'mid' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    namePt: 'Marketing',
    roles: [
      { id: 'marketing-director', title: 'Marketing Director', level: 'director' },
      { id: 'marketing-manager', title: 'Marketing Manager', level: 'manager' },
      { id: 'senior-marketing-analyst', title: 'Senior Marketing Analyst', level: 'senior' },
      { id: 'marketing-analyst', title: 'Marketing Analyst', level: 'mid' },
      { id: 'content-manager', title: 'Content Manager', level: 'manager' },
      { id: 'content-writer', title: 'Content Writer', level: 'mid' },
      { id: 'senior-designer', title: 'Senior Designer', level: 'senior' },
      { id: 'designer', title: 'Designer', level: 'mid' },
      { id: 'social-media-manager', title: 'Social Media Manager', level: 'manager' },
      { id: 'social-media-analyst', title: 'Social Media Analyst', level: 'mid' },
    ],
  },
  {
    id: 'technology',
    name: 'Technology',
    namePt: 'Tecnologia',
    roles: [
      { id: 'tech-director', title: 'Technology Director', level: 'director' },
      { id: 'engineering-manager', title: 'Engineering Manager', level: 'manager' },
      { id: 'tech-lead', title: 'Tech Lead', level: 'manager' },
      { id: 'solutions-architect', title: 'Solutions Architect', level: 'senior' },
      { id: 'senior-software-engineer', title: 'Senior Software Engineer', level: 'senior' },
      { id: 'software-engineer', title: 'Software Engineer', level: 'mid' },
      { id: 'junior-software-engineer', title: 'Junior Software Engineer', level: 'junior' },
      { id: 'senior-devops-engineer', title: 'Senior DevOps Engineer', level: 'senior' },
      { id: 'devops-engineer', title: 'DevOps Engineer', level: 'mid' },
      { id: 'qa-engineer', title: 'QA Engineer', level: 'mid' },
      { id: 'senior-qa-engineer', title: 'Senior QA Engineer', level: 'senior' },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    namePt: 'Segurança',
    roles: [
      { id: 'security-director', title: 'Security Director', level: 'director' },
      { id: 'security-manager', title: 'Security Manager', level: 'manager' },
      { id: 'senior-security-analyst', title: 'Senior Security Analyst', level: 'senior' },
      { id: 'security-analyst', title: 'Security Analyst', level: 'mid' },
      { id: 'senior-penetration-tester', title: 'Senior Penetration Tester', level: 'senior' },
      { id: 'penetration-tester', title: 'Penetration Tester', level: 'mid' },
      { id: 'soc-analyst', title: 'SOC Analyst', level: 'mid' },
      { id: 'senior-soc-analyst', title: 'Senior SOC Analyst', level: 'senior' },
      { id: 'security-engineer', title: 'Security Engineer', level: 'mid' },
      { id: 'grc-analyst', title: 'GRC Analyst', level: 'mid' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    namePt: 'Financeiro',
    roles: [
      { id: 'finance-director', title: 'Finance Director', level: 'director' },
      { id: 'controller', title: 'Controller', level: 'manager' },
      { id: 'finance-manager', title: 'Finance Manager', level: 'manager' },
      { id: 'senior-financial-analyst', title: 'Senior Financial Analyst', level: 'senior' },
      { id: 'financial-analyst', title: 'Financial Analyst', level: 'mid' },
      { id: 'accountant', title: 'Accountant', level: 'mid' },
      { id: 'accounts-payable', title: 'Accounts Payable Specialist', level: 'mid' },
      { id: 'accounts-receivable', title: 'Accounts Receivable Specialist', level: 'mid' },
      { id: 'treasury-analyst', title: 'Treasury Analyst', level: 'mid' },
    ],
  },
  {
    id: 'hr',
    name: 'Human Resources',
    namePt: 'Recursos Humanos',
    roles: [
      { id: 'hr-director', title: 'HR Director', level: 'director' },
      { id: 'hr-manager', title: 'HR Manager', level: 'manager' },
      { id: 'senior-hr-analyst', title: 'Senior HR Analyst', level: 'senior' },
      { id: 'hr-analyst', title: 'HR Analyst', level: 'mid' },
      { id: 'senior-recruiter', title: 'Senior Recruiter', level: 'senior' },
      { id: 'recruiter', title: 'Recruiter', level: 'mid' },
      { id: 'talent-acquisition', title: 'Talent Acquisition Specialist', level: 'mid' },
      { id: 'hr-business-partner', title: 'HR Business Partner', level: 'manager' },
      { id: 'training-coordinator', title: 'Training Coordinator', level: 'mid' },
      { id: 'benefits-analyst', title: 'Benefits Analyst', level: 'mid' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal',
    namePt: 'Jurídico',
    roles: [
      { id: 'legal-director', title: 'Legal Director', level: 'director' },
      { id: 'general-counsel', title: 'General Counsel', level: 'director' },
      { id: 'senior-lawyer', title: 'Senior Lawyer', level: 'senior' },
      { id: 'lawyer', title: 'Lawyer', level: 'mid' },
      { id: 'legal-analyst', title: 'Legal Analyst', level: 'mid' },
      { id: 'compliance-officer', title: 'Compliance Officer', level: 'manager' },
      { id: 'contracts-manager', title: 'Contracts Manager', level: 'manager' },
    ],
  },
  {
    id: 'projects',
    name: 'Project Management',
    namePt: 'Projetos',
    roles: [
      { id: 'pmo-director', title: 'PMO Director', level: 'director' },
      { id: 'pmo-manager', title: 'PMO Manager', level: 'manager' },
      { id: 'senior-project-manager', title: 'Senior Project Manager', level: 'senior' },
      { id: 'project-manager', title: 'Project Manager', level: 'mid' },
      { id: 'senior-scrum-master', title: 'Senior Scrum Master', level: 'senior' },
      { id: 'scrum-master', title: 'Scrum Master', level: 'mid' },
      { id: 'senior-product-owner', title: 'Senior Product Owner', level: 'senior' },
      { id: 'product-owner', title: 'Product Owner', level: 'mid' },
      { id: 'project-analyst', title: 'Project Analyst', level: 'mid' },
    ],
  },
  {
    id: 'support',
    name: 'Customer Support',
    namePt: 'Suporte',
    roles: [
      { id: 'support-director', title: 'Support Director', level: 'director' },
      { id: 'support-manager', title: 'Support Manager', level: 'manager' },
      { id: 'senior-support-analyst', title: 'Senior Support Analyst', level: 'senior' },
      { id: 'support-analyst', title: 'Support Analyst', level: 'mid' },
      { id: 'support-specialist', title: 'Support Specialist', level: 'mid' },
      { id: 'technical-support', title: 'Technical Support Engineer', level: 'mid' },
      { id: 'customer-success-manager', title: 'Customer Success Manager', level: 'manager' },
      { id: 'customer-success-analyst', title: 'Customer Success Analyst', level: 'mid' },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    namePt: 'Operações',
    roles: [
      { id: 'operations-director', title: 'Operations Director', level: 'director' },
      { id: 'operations-manager', title: 'Operations Manager', level: 'manager' },
      { id: 'senior-operations-analyst', title: 'Senior Operations Analyst', level: 'senior' },
      { id: 'operations-analyst', title: 'Operations Analyst', level: 'mid' },
      { id: 'process-analyst', title: 'Process Analyst', level: 'mid' },
      { id: 'quality-analyst', title: 'Quality Analyst', level: 'mid' },
      { id: 'logistics-coordinator', title: 'Logistics Coordinator', level: 'mid' },
    ],
  },
];

// Helper functions
export function getDepartmentById(id: DepartmentId): Department | undefined {
  return departments.find(d => d.id === id);
}

export function getRolesByDepartment(departmentId: DepartmentId): Role[] {
  const department = getDepartmentById(departmentId);
  return department?.roles || [];
}

export function getAllRoles(): { department: string; role: Role }[] {
  const result: { department: string; role: Role }[] = [];
  departments.forEach(dept => {
    dept.roles.forEach(role => {
      result.push({ department: dept.name, role });
    });
  });
  return result;
}

// For backwards compatibility with signature form
export function getDepartmentNames(): string[] {
  return departments.map(d => d.name);
}

export function getRoleTitlesByDepartment(departmentId: DepartmentId): string[] {
  return getRolesByDepartment(departmentId).map(r => r.title);
}

// Export simple arrays for form compatibility
export const departmentList = departments.map(d => ({
  id: d.id,
  name: d.name,
  namePt: d.namePt,
}));

export const rolesByDepartment: Record<string, string[]> = departments.reduce((acc, dept) => {
  acc[dept.name] = dept.roles.map(r => r.title);
  return acc;
}, {} as Record<string, string[]>);
