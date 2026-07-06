import { Component, input, output } from '@angular/core';

import { Task } from '@tasks/models/task';
import { TaskEmptyState } from './empty-state';
import { TaskItem } from './item';

@Component({
  selector: 'app-task-list',
  imports: [TaskEmptyState, TaskItem],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class TaskList {
  readonly tasks = input.required<Task[]>();

  readonly toggleTask = output<string>();
  readonly deleteTask = output<string>();
  readonly saveTask = output<{ id: string; title: string; dueDate: string | null }>();
}
