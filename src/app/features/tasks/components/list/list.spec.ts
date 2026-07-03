import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Task } from '@tasks/models/task';
import { TaskList } from './list';

describe('TaskList', () => {
  let fixture: ComponentFixture<TaskList>;
  let component: TaskList;

  const task: Task = {
    id: '1',
    title: 'Angularを学ぶ',
    status: 'todo',
    dueDate: null,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tasks', [task]);
    fixture.detectChanges();
  });

  it('renders tasks', () => {
    expect(fixture.nativeElement.textContent).toContain('Angularを学ぶ');
  });

  it('emits toggleTask event', () => {
    const spy = vi.spyOn(component.toggleTask, 'emit');

    const nativeElement: HTMLElement = fixture.nativeElement;
    const checkbox = nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(checkbox).not.toBeNull();
    checkbox.click();

    expect(spy).toHaveBeenCalledWith('1');
  });
});
