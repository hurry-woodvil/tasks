import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUndoBanner } from './undo-banner';

describe('TaskUndoBanner', () => {
  let component: TaskUndoBanner;
  let fixture: ComponentFixture<TaskUndoBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskUndoBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskUndoBanner);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('taskTitle', '削除したタスク');
    fixture.detectChanges();
  });

  it('renders deleted task title', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('削除したタスク');
    expect(element.textContent).toContain('削除しました');
  });

  it('emits undo event', () => {
    const spy = vi.spyOn(component.undo, 'emit');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalled();
  });
});
