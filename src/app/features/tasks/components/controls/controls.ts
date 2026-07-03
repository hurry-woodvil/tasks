import { Component, input, output } from '@angular/core';

import { TaskFilter, TaskSort } from '@tasks/models/task';

@Component({
  selector: 'app-task-controls',
  imports: [],
  templateUrl: './controls.html',
  styleUrl: './controls.css',
})
export class TaskControls {
  readonly filter = input.required<TaskFilter>();
  readonly searchQuery = input.required<string>();
  readonly sort = input.required<TaskSort>();

  readonly filterChange = output<TaskFilter>();
  readonly searchQueryChange = output<string>();
  readonly sortChange = output<TaskSort>();
}
