import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { TaskStoreService } from '../services/tasks/task-store.service';

export const taskExistsGuard: CanActivateFn = (route, state) => {
  const taskStore = inject(TaskStoreService);
  const router = inject(Router);
  const taskId = route.paramMap.get('id');

  if (!taskId) {
    router.navigate(['/tasks']);
    return false;
  }

  // Si les tâches ne sont pas chargées, les charger d'abord
  if (taskStore.tasks().length === 0) {
    return taskStore.loadTasks().pipe(
      map(() => {
        const taskExists = taskStore
          .tasks()
          .some((task) => task.id.toString() === taskId);
        if (!taskExists) {
          router.navigate(['/tasks']);
        }
        return taskExists;
      }),
      catchError(() => {
        router.navigate(['/tasks']);
        return of(false);
      })
    );
  }

  // Les tâches sont déjà chargées, vérifier directement
  const taskExists = taskStore
    .tasks()
    .some((task) => task.id.toString() === taskId);
  if (!taskExists) {
    router.navigate(['/tasks']);
  }
  return taskExists;
};
