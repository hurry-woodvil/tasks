import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItem } from './item';

describe('TaskItem', () => {
  let fixture: ComponentFixture<TaskItem>;
  let component: TaskItem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItem);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', {
      id: '1',
      title: 'Angularを学ぶ',
      status: 'todo',
      dueDate: '2026-07-01',
      createdAt: '2026-06-29T00:00:00.000Z',
      updatedAt: '2026-06-29T00:00:00.000Z',
    });

    fixture.detectChanges();
  });

  it('renders task title', () => {
    expect(fixture.nativeElement.textContent).toContain('Angularを学ぶ');
  });

  it('emits toggle event', () => {
    const spy = vi.spyOn(component.toggleTask, 'emit');

    component.toggleTask.emit(component.task().id);

    expect(spy).toHaveBeenCalledWith('1');
  });

  it('emits delete event', () => {
    const spy = vi.spyOn(component.deleteTask, 'emit');

    component.deleteTask.emit(component.task().id);

    expect(spy).toHaveBeenCalledWith('1');
  });

  it('emits delete event when delete button is clicked', () => {
    const spy = vi.spyOn(component.deleteTask, 'emit');

    const button = fixture.nativeElement.querySelector('button:last-of-type');
    button.click();

    expect(spy).toHaveBeenCalledWith('1');
  });

  it('starts editing', () => {
    component.startEdit();

    expect(component.editing()).toBe(true);
    expect(component.editTitle()).toBe('Angularを学ぶ');
    expect(component.editDueDate()).toBe('2026-07-01');
  });

  it('cancels editing', () => {
    component.startEdit();
    component.cancelEdit();

    expect(component.editing()).toBe(false);
    expect(component.editTitle()).toBe('');
    expect(component.editDueDate()).toBeNull();
  });

  it('emits save event when editing is submitted', () => {
    const spy = vi.spyOn(component.saveTask, 'emit');

    component.startEdit();
    component.editTitle.set('Angular Signalsを学ぶ');
    component.editDueDate.set('2026-07-10');

    component.saveEdit();

    expect(spy).toHaveBeenCalledWith({
      id: '1',
      title: 'Angular Signalsを学ぶ',
      dueDate: '2026-07-10',
    });
    expect(component.editing()).toBe(false);
  });

  it('does not emit save event when title is empty', () => {
    const spy = vi.spyOn(component.saveTask, 'emit');

    component.startEdit();
    component.editTitle.set('      ');

    component.saveEdit();

    expect(spy).not.toHaveBeenCalled();
    expect(component.editing()).toBe(true);
  });
});
