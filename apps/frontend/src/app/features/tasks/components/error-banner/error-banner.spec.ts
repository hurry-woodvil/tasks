import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskErrorBanner } from './error-banner';

describe('TaskErrorBanner', () => {
  let component: TaskErrorBanner;
  let fixture: ComponentFixture<TaskErrorBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskErrorBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskErrorBanner);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('message', 'タスクの取得に失敗しました');
    fixture.detectChanges();
  });

  it('renders error message', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('タスクの取得に失敗しました');
  });

  it('emits retry event', () => {
    const spy = vi.spyOn(component.retry, 'emit');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(spy).toHaveBeenCalled();
  });
});
