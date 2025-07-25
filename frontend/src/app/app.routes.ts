import { Routes } from '@angular/router';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { TaskDetailPageComponent } from './components/pages/task-detail-page/task-detail-page.component';
import { taskExistsGuard } from './guards/task-exists.guard';
export const routes: Routes = [
  {
    path: 'tasks',
    component: HomePageComponent,
  },
  {
    path: 'tasks/:id',
    component: TaskDetailPageComponent,
    canActivate: [taskExistsGuard],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
