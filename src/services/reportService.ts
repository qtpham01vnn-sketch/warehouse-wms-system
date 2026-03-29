import type { MonthlyReport } from '../types';

export const reportService = {
  getMonthlyReports: (): MonthlyReport[] => {
    return JSON.parse(localStorage.getItem('wf_monthly_reports') || '[]');
  },

  getReportsByDepartment: (departmentId: string): MonthlyReport[] => {
    const reports = reportService.getMonthlyReports();
    return reports.filter(r => r.departmentId === departmentId);
  },

  saveReport: (report: MonthlyReport) => {
    const reports = reportService.getMonthlyReports();
    const index = reports.findIndex(r => r.id === report.id);
    if (index > -1) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    localStorage.setItem('wf_monthly_reports', JSON.stringify(reports));
  }
};
