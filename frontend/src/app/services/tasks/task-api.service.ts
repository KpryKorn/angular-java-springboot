import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Task } from '../../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.API_URL + '/tasks';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url).pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des tâches:', error);
        return throwError(() => error);
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`).pipe(
      catchError((error) => {
        console.error(`Erreur lors du chargement de la tâche ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.url, task).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création de la tâche:', error);
        return throwError(() => error);
      })
    );
  }

  updateTask(id: string, taskData: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, taskData).pipe(
      catchError((error) => {
        console.error(
          `Erreur lors de la mise à jour complète de la tâche ${id}:`,
          error
        );
        return throwError(() => error);
      })
    );
  }

  patchTask(id: string, taskData: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}`, taskData).pipe(
      catchError((error) => {
        console.error(
          `Erreur lors de la mise à jour partielle de la tâche ${id}:`,
          error
        );
        return throwError(() => error);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError((error) => {
        console.error(
          `Erreur lors de la suppression de la tâche ${id}:`,
          error
        );
        return throwError(() => error);
      })
    );
  }
}
