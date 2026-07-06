import { Component, inject, OnInit } from '@angular/core';

import { TaskStore } from '@tasks/stores/task-store';
import {
  TaskControls,
  TaskErrorBanner,
  TaskForm,
  TaskList,
  TaskLoading,
  TaskPagination,
  TaskUndoBanner,
} from '@tasks/components';

@Component({
  selector: 'app-task-list-page',
  imports: [
    TaskForm,
    TaskControls,
    TaskList,
    TaskPagination,
    TaskErrorBanner,
    TaskUndoBanner,
    TaskLoading,
  ],
  templateUrl: './list-page.html',
  styleUrl: './list-page.css',
})
export class TaskListPage implements OnInit {
  readonly taskStore = inject(TaskStore);

  ngOnInit(): void {
    this.taskStore.loadTasks();
  }
}
