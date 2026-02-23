import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'add-expense',
        loadComponent: () => import('./pages/add-expense/add-expense.page').then(m => m.AddExpensePage)
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics.page').then(m => m.AnalyticsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profiles/profiles.page').then(m => m.ProfilesPage)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];