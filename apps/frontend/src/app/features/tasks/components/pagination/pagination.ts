import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-task-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class TaskPagination {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly previousPage = output<void>();
  readonly nextPage = output<void>();
}
