import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEmptyState } from './empty-state';

describe('TaskEmptyState', () => {
  let fixture: ComponentFixture<TaskEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEmptyState],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEmptyState);
    fixture.detectChanges();
  });

  it('renders empty state', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('まだタスクはありません');
  });

  it('shows helper message', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('最初のタスクを追加してみましょう');
  });
});
