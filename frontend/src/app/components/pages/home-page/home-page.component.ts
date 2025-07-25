import { Component, inject, OnInit } from '@angular/core';
import { TaskStoreService } from '../../../services/tasks/task-store.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  private readonly taskStore = inject(TaskStoreService);
  private readonly fb = inject(FormBuilder);

  readonly tasks = this.taskStore.tasks;
  readonly loading = this.taskStore.loading;
  readonly error = this.taskStore.error;

  completedTasks = this.taskStore.completedTasks;
  pendingTasks = this.taskStore.pendingTasks;

  readonly taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.taskStore.loadTasks().subscribe();
  }

  createTask(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const newTask = {
        title: formValue.title.trim(),
        description: formValue.description.trim(),
        done: false,
      };

      this.taskStore.createTask(newTask).subscribe({
        next: () => {
          this.taskForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de la création de la tâche:', error);
        },
      });
    }
  }

  get titleControl() {
    return this.taskForm.get('title');
  }
  get descriptionControl() {
    return this.taskForm.get('description');
  }

  toggleTask(id: string) {
    this.taskStore.toggleTaskDone(id).subscribe();
  }

  deleteTask(id: string) {
    this.taskStore.deleteTask(id).subscribe();
  }

  clearError() {
    this.taskStore.clearError();
  }
}
