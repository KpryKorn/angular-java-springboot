import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../../services/tasks/task.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  ngOnInit() {
    this.taskService.getTasks().subscribe();
  }
}
