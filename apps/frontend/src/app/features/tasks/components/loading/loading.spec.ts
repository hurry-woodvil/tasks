import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLoading } from './loading';

describe('TaskLoading', () => {
  let fixture: ComponentFixture<TaskLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskLoading],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskLoading);
    fixture.detectChanges();
  });

  it('lenders loading message', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('タスクを読み込んでいます...');
  });
});
