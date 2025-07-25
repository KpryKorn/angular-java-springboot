import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../../services/tasks/task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-detail-page',
  imports: [],
  templateUrl: './task-detail-page.component.html',
})
export class TaskDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly taskService = inject(TaskService);
  readonly taskId = signal<string>('');

  readonly task = computed(() => {
    const id = this.taskId();
    const tasks = this.taskService.tasks();
    return tasks.find((task) => task.id.toString() === id) || null;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId.set(id);
    }
  }

  toggleTask(id: string) {
    this.taskService.toggleTaskDone(id).subscribe();
  }
}
