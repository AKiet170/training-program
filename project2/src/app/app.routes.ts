import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'weather',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/weather/weather.component').then((m) => m.WeatherComponent);
    },
  },
  {
    path: 'tasks',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/tasks/tasks.component').then((m) => m.TasksComponent);
    }
  },
  {
    path: 'expenses',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/expenses/expenses.component').then((m) => m.ExpensesComponent);
    }
  } 
];
