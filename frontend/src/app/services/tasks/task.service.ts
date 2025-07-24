import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { Task } from '../../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.API_URL + '/tasks';

  // état privé (comme useState)
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // état public lecture seule
  public readonly tasks = this._tasks.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  readonly completedTasks = computed(() =>
    this._tasks().filter((task) => task.done)
  );

  readonly pendingTasks = computed(() =>
    this._tasks().filter((task) => !task.done)
  );

  getTasks(): Observable<Task[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Task[]>(this.url).pipe(
      tap((tasks) => {
        this._tasks.set(tasks);
      }),
      catchError((error) => {
        this._error.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  createTask(task: Task): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<Task>(this.url, task).pipe(
      tap((newTask) => {
        this._tasks.update((tasks) => [...tasks, newTask]);
      }),
      catchError((error) => {
        this._error.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  updateTask(id: string, taskData: Partial<Task>): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<Task>(`${this.url}/${id}`, taskData).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) =>
          tasks.map((task) => (task.id === id ? updatedTask : task))
        );
      }),
      catchError((error) => {
        this._error.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  deleteTask(id: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
      }),
      catchError((error) => {
        this._error.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  toggleTaskDone(id: string): Observable<Task> {
    const task = this._tasks().find((task) => task.id === id);
    if (!task) {
      this._error.set('Task not found');
      return throwError(() => new Error('Task not found'));
    }

    return this.updateTask(id, { done: !task.done });
  }
}
