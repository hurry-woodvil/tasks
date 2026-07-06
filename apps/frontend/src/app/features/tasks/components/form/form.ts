import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class TaskForm {
  readonly title = signal('');
  readonly dueDate = signal<string | null>(null);

  readonly add = output<{ title: string; dueDate: string | null }>();

  onSubmit(): void {
    const title = this.title().trim();

    if (!title) {
      return;
    }

    this.add.emit({ title, dueDate: this.dueDate() });
    this.title.set('');
    this.dueDate.set(null);
  }
}
