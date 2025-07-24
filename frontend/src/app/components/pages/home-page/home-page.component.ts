import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../../services/tasks/task.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);
  tasks = this.taskService.tasks;

  readonly taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.taskService.getTasks().subscribe();
  }

  createTask(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const newTask = {
        title: formValue.title.trim(),
        description: formValue.description.trim(),
        done: false,
      };

      this.taskService.createTask(newTask).subscribe({
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
    this.taskService.toggleTaskDone(id).subscribe();
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe();
  }
}
