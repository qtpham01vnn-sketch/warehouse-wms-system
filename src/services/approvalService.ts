import { planService } from './planService';
import type { ApprovalAction, DepartmentPlan } from '../types';

export const approvalService = {
  getActionsByPlan: (planId: string): ApprovalAction[] => {
    const allActions: ApprovalAction[] = JSON.parse(localStorage.getItem('wf_approvals') || '[]');
    return allActions.filter(a => a.planId === planId).sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
  },

  getAllPendingPlans: (): DepartmentPlan[] => {
    return planService.getDepartmentPlans().filter(p => p.status === 'pending');
  },

  submitForApproval: (planId: string, performedBy: string, comment: string) => {
    const plans = planService.getDepartmentPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    plan.status = 'pending';
    plan.submittedAt = new Date().toISOString();
    planService.saveDepartmentPlan(plan);

    const action: ApprovalAction = {
      id: `app_${Date.now()}`,
      planId,
      action: 'submit',
      comment,
      performedBy,
      performedAt: new Date().toISOString()
    };
    
    const actions: ApprovalAction[] = JSON.parse(localStorage.getItem('wf_approvals') || '[]');
    actions.push(action);
    localStorage.setItem('wf_approvals', JSON.stringify(actions));
  },

  approvePlan: (planId: string, performedBy: string, comment: string) => {
    const plans = planService.getDepartmentPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    plan.status = 'approved';
    plan.approvedAt = new Date().toISOString();
    plan.approvedBy = performedBy;
    planService.saveDepartmentPlan(plan);

    const action: ApprovalAction = {
      id: `app_${Date.now()}`,
      planId,
      action: 'approve',
      comment,
      performedBy,
      performedAt: new Date().toISOString()
    };
    
    const actions: ApprovalAction[] = JSON.parse(localStorage.getItem('wf_approvals') || '[]');
    actions.push(action);
    localStorage.setItem('wf_approvals', JSON.stringify(actions));
  },

  rejectPlan: (planId: string, performedBy: string, comment: string) => {
    const plans = planService.getDepartmentPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    plan.status = 'rejected';
    plan.rejectionReason = comment;
    planService.saveDepartmentPlan(plan);

    const action: ApprovalAction = {
      id: `app_${Date.now()}`,
      planId,
      action: 'reject',
      comment,
      performedBy,
      performedAt: new Date().toISOString()
    };
    
    const actions: ApprovalAction[] = JSON.parse(localStorage.getItem('wf_approvals') || '[]');
    actions.push(action);
    localStorage.setItem('wf_approvals', JSON.stringify(actions));
  },

  requestRevision: (planId: string, performedBy: string, comment: string) => {
    const plans = planService.getDepartmentPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    plan.status = 'revision';
    plan.rejectionReason = comment;
    planService.saveDepartmentPlan(plan);

    const action: ApprovalAction = {
      id: `app_${Date.now()}`,
      planId,
      action: 'request_revision',
      comment,
      performedBy,
      performedAt: new Date().toISOString()
    };
    
    const actions: ApprovalAction[] = JSON.parse(localStorage.getItem('wf_approvals') || '[]');
    actions.push(action);
    localStorage.setItem('wf_approvals', JSON.stringify(actions));
  }
};
