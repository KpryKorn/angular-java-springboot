import { Routes } from '@angular/router';
import { TrackerComponent } from './components/pages/tracker/tracker.component';

export const routes: Routes = [
  {
    path: 'tracker',
    component: TrackerComponent,
  },
  {
    path: '**',
    redirectTo: 'tracker',
  },
];
