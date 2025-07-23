import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Task } from '../../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.API_URL + '/tasks';

  _tasks = signal<Task[]>([]);
  _loading = signal<boolean>(false);
  _error = signal<string | null>(null);

  public readonly tasks = this._tasks.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  getTasks(): Observable<Task[]> {
    this._loading.set(true);
    this._error.set(null);
    console.log(this._tasks());

    return this.http.get<Task[]>(this.url).pipe(
      tap((tasks) => {
        this._tasks.set(tasks);
        this._loading.set(false);
      }),

      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return throwError(() => error);
      })
    );
  }
}
