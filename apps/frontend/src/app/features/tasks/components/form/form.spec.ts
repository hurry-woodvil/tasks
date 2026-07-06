import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskForm } from './form';

describe('TaskForm', () => {
  let fixture: ComponentFixture<TaskForm>;
  let component: TaskForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits add event when title is entered', () => {
    const spy = vi.spyOn(component.add, 'emit');

    component.title.set('Angularを学ぶ');
    component.dueDate.set('2026-07-01');

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({
      title: 'Angularを学ぶ',
      dueDate: '2026-07-01',
    });
  });

  it('dose not emit add event when title is empty', () => {
    const spy = vi.spyOn(component.add, 'emit');

    component.title.set('     ');
    component.dueDate.set('2026-07-01');

    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('resets form after submit', () => {
    component.title.set('Angularを学ぶ');
    component.dueDate.set('2026-07-01');

    component.onSubmit();

    expect(component.title()).toBe('');
    expect(component.dueDate()).toBeNull();
  });
});
