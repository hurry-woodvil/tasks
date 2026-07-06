import { Routes } from '@angular/router';

import { TaskListPage } from '@tasks/pages/list-page/list-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    component: TaskListPage,
  },
];
