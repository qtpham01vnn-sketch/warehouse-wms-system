import type { CompanyPlan, DepartmentPlan } from '../types';

export const planService = {
  getCompanyPlans: (): CompanyPlan[] => {
    return JSON.parse(localStorage.getItem('wf_company_plans') || '[]');
  },
  
  saveCompanyPlan: (plan: CompanyPlan) => {
    const plans = planService.getCompanyPlans();
    const existing = plans.findIndex(p => p.id === plan.id);
    if (existing > -1) {
      plans[existing] = plan;
    } else {
      plans.push(plan);
    }
    localStorage.setItem('wf_company_plans', JSON.stringify(plans));
  },

  deleteCompanyPlan: (id: string) => {
    const plans = planService.getCompanyPlans().filter(p => p.id !== id);
    localStorage.setItem('wf_company_plans', JSON.stringify(plans));
  },
  
  getDepartmentPlans: (): DepartmentPlan[] => {
    return JSON.parse(localStorage.getItem('wf_department_plans') || '[]');
  },
  
  saveDepartmentPlan: (plan: DepartmentPlan) => {
    const plans = planService.getDepartmentPlans();
    const existing = plans.findIndex(p => p.id === plan.id);
    if (existing > -1) {
      plans[existing] = plan;
    } else {
      plans.push(plan);
    }
    localStorage.setItem('wf_department_plans', JSON.stringify(plans));
  },

  deleteDepartmentPlan: (id: string) => {
    const plans = planService.getDepartmentPlans().filter(p => p.id !== id);
    localStorage.setItem('wf_department_plans', JSON.stringify(plans));
  }
};
