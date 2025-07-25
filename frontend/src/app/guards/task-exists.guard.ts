import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { TaskService } from '../services/tasks/task.service';

export const taskExistsGuard: CanActivateFn = (route, state) => {
  const taskService = inject(TaskService);
  const router = inject(Router);
  const taskId = route.paramMap.get('id');

  if (!taskId) {
    router.navigate(['/tasks']);
    return false;
  }

  return taskService.getTaskById(taskId).pipe(
    map(() => true),
    catchError((error) => {
      console.error('Tâche non trouvée:', error);
      router.navigate(['/tasks']);
      return of(false);
    })
  );
};
