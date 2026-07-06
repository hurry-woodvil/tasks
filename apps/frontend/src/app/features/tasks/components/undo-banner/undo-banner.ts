import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-task-undo-banner',
  imports: [],
  templateUrl: './undo-banner.html',
  styleUrl: './undo-banner.css',
})
export class TaskUndoBanner {
  readonly taskTitle = input.required<string>();

  readonly undo = output<void>();
}
