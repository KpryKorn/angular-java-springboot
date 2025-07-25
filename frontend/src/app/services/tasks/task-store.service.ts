import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskApiService } from './task-api.service';
import { Task } from '../../models/task';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskStoreService {
  private readonly taskApiService = inject(TaskApiService);

  // État privé (comme useState)
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // État public en lecture seule
  public readonly tasks = this._tasks.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  // Computed values (comme useMemo)
  readonly completedTasks = computed(() =>
    this._tasks().filter((task) => task.done)
  );

  readonly pendingTasks = computed(() =>
    this._tasks().filter((task) => !task.done)
  );

  readonly taskCount = computed(() => ({
    total: this._tasks().length,
    completed: this.completedTasks().length,
    pending: this.pendingTasks().length,
  }));

  // Actions (comme les mutations)
  loadTasks(): Observable<Task[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.taskApiService.getTasks().pipe(
      tap((tasks) => {
        this._tasks.set(tasks);
      }),
      catchError((error) => {
        this._error.set(
          error.message || 'Erreur lors du chargement des tâches'
        );
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return this.taskApiService.getTaskById(id).pipe(
      tap((task) => {
        // Mettre à jour le store si la tâche n'existe pas déjà
        const currentTasks = this._tasks();
        const taskExists = currentTasks.some((t) => t.id.toString() === id);

        if (!taskExists) {
          this._tasks.update((tasks) => [...tasks, task]);
        }
      }),
      catchError((error) => {
        this._error.set(error.message || `Tâche ${id} non trouvée`);
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  createTask(taskData: Omit<Task, 'id'>): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return this.taskApiService.createTask(taskData).pipe(
      tap((newTask) => {
        this._tasks.update((tasks) => [...tasks, newTask]);
      }),
      catchError((error) => {
        this._error.set(
          error.message || 'Erreur lors de la création de la tâche'
        );
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  updateTask(id: string, taskData: Partial<Task>): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return this.taskApiService.updateTask(id, taskData).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) =>
          tasks.map((task) => (task.id.toString() === id ? updatedTask : task))
        );
      }),
      catchError((error) => {
        this._error.set(
          error.message || 'Erreur lors de la mise à jour de la tâche'
        );
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  patchTask(id: string, taskData: Partial<Task>): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return this.taskApiService.patchTask(id, taskData).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) =>
          tasks.map((task) => (task.id.toString() === id ? updatedTask : task))
        );
      }),
      catchError((error) => {
        this._error.set(
          error.message || 'Erreur lors de la mise à jour partielle de la tâche'
        );
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.taskApiService.deleteTask(id).pipe(
      tap(() => {
        this._tasks.update((tasks) =>
          tasks.filter((task) => task.id.toString() !== id)
        );
      }),
      catchError((error) => {
        this._error.set(
          error.message || 'Erreur lors de la suppression de la tâche'
        );
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  toggleTaskDone(id: string): Observable<Task> {
    const task = this._tasks().find((task) => task.id.toString() === id);
    if (!task) {
      this._error.set('Tâche non trouvée');
      return throwError(() => new Error('Tâche non trouvée'));
    }

    return this.patchTask(id, { done: !task.done });
  }

  // Méthodes utilitaires
  clearError(): void {
    this._error.set(null);
  }

  reset(): void {
    this._tasks.set([]);
    this._loading.set(false);
    this._error.set(null);
  }

  // Méthodes pour les optimistic updates (optionnel)
  addTaskOptimistic(taskData: Omit<Task, 'id'>): void {
    const tempTask: Task = {
      ...taskData,
      id: `temp-${Date.now()}`, // ID temporaire
    };
    this._tasks.update((tasks) => [...tasks, tempTask]);
  }

  removeTaskOptimistic(id: string): void {
    this._tasks.update((tasks) =>
      tasks.filter((task) => task.id.toString() !== id)
    );
  }
}
