import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskControls } from './controls';

describe('TaskControls', () => {
  let fixture: ComponentFixture<TaskControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskControls],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskControls);
    fixture.componentRef.setInput('filter', 'all');
    fixture.componentRef.setInput('searchQuery', '');
    fixture.componentRef.setInput('sort', 'createdAt');
    fixture.detectChanges();
  });

  it('emits searchQueryChange when search input changes', () => {
    const component = fixture.componentInstance;
    const spy = vi.spyOn(component.searchQueryChange, 'emit');

    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[aria-label="タスク検索"]',
    );

    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));

    expect(spy).toHaveBeenCalledWith('Angular');
  });

  it('emits sortChange when sort select changes', () => {
    const component = fixture.componentInstance;
    const spy = vi.spyOn(component.sortChange, 'emit');

    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      'select[aria-label="並び順"]',
    );

    select.value = 'title';
    select.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith('title');
  });

  it('emits filterChange when todo filter button is clicked', () => {
    const component = fixture.componentInstance;
    const spy = vi.spyOn(component.filterChange, 'emit');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="未完了"]',
    );

    button.click();

    expect(spy).toHaveBeenCalledWith('todo');
  });
});
