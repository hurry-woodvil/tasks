import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task } from '@tasks/models/task';

@Component({
  selector: 'app-task-item',
  imports: [FormsModule],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class TaskItem {
  readonly task = input.required<Task>();

  readonly toggleTask = output<string>();
  readonly deleteTask = output<string>();
  readonly saveTask = output<{ id: string; title: string; dueDate: string | null }>();

  readonly editing = signal(false);
  readonly editTitle = signal('');
  readonly editDueDate = signal<string | null>(null);

  startEdit(): void {
    this.editTitle.set(this.task().title);
    this.editDueDate.set(this.task().dueDate);

    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.editTitle.set('');
    this.editDueDate.set(null);
  }

  saveEdit(): void {
    const title = this.editTitle().trim();

    if (!title) {
      return;
    }

    this.saveTask.emit({
      id: this.task().id,
      title,
      dueDate: this.editDueDate(),
    });

    this.editing.set(false);
    this.editTitle.set('');
    this.editDueDate.set(null);
  }
}
