import { useState } from 'react';
import { DashboardLayout, type ViewType } from './components/layout/DashboardLayout';
import Overview from './components/dashboard/Overview';
import EquipmentList from './components/inventory/EquipmentList';
import MaintenanceManager from './components/maintenance/MaintenanceManager';
import SparePartsInventory from './components/spare-parts/SparePartsInventory';
import AlertsCenter from './components/alerts/AlertsCenter';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Overview />;
      case 'inventory': return <EquipmentList />;
      case 'maintenance': return <MaintenanceManager />;
      case 'parts': return <SparePartsInventory />;
      case 'alerts': return <AlertsCenter />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout 
      currentView={currentView} 
      onNavigate={(view: ViewType) => setCurrentView(view)}
    >
      {renderView()}
    </DashboardLayout>
  );
}

export default App;
