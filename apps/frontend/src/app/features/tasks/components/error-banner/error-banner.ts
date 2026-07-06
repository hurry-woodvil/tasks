import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-task-error-banner',
  imports: [],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
})
export class TaskErrorBanner {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
