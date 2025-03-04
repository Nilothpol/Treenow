import React from 'react';
import DashboardStats from '../components/DashboardStats';
import RecentOrders from '../components/RecentOrders';

export default function Dashboard() {
  return (
    <div className="p-6">
      <DashboardStats />
      <RecentOrders />
    </div>
  );
}