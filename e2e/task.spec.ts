import { Page, expect, test } from '@playwright/test';

async function addTask(page: Page, title: string, dueDate?: string): Promise<void> {
  await page.getByLabel('新規タスク名').fill(title);

  if (dueDate) {
    await page.getByLabel('新規期限').fill(dueDate);
  }

  await page.getByRole('button', { name: '追加' }).click();
}

const apiUrl = 'http://localhost:3000/tasks';

test.beforeEach(async ({ page, request }) => {
  const response = await request.get(apiUrl);
  const tasks = await response.json();

  for (const task of tasks) {
    await request.delete(`${apiUrl}/${task.id}`);
  }

  await page.goto('/tasks');
});

test.afterAll(async ({ request }) => {
  const response = await request.get(apiUrl);
  expect(response.ok()).toBe(true);

  const tasks = await response.json();

  for (const task of tasks) {
    await request.delete(`${apiUrl}/${task.id}`);
    expect(response.ok()).toBe(true);
  }
});

test.describe('task CRUD', () => {
  test('add a task', async ({ page }) => {
    await addTask(page, 'Angularを学ぶ');

    await expect(page.getByText('Angularを学ぶ')).toHaveCount(1);
    await expect(page.getByText('Angularを学ぶ')).toBeVisible();
  });

  test('toggles a task status', async ({ page }) => {
    await addTask(page, 'Angularを学ぶ');

    const checkbox = page.getByLabel('Angularを学ぶを完了する');

    await expect(checkbox).not.toBeChecked();

    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('deletes a task', async ({ page }) => {
    await addTask(page, 'Angularを学ぶ');

    await expect(page.getByText('Angularを学ぶ')).toHaveCount(1);

    await page.getByLabel('Angularを学ぶを削除').click();

    await expect(page.getByText('Angularを学ぶ', { exact: true })).toHaveCount(0);
  });

  test('edits a task title', async ({ page }) => {
    await addTask(page, 'Angularを学ぶ');

    await page.getByLabel('Angularを学ぶを編集').click();

    await page.getByLabel('編集タスク名').fill('Angular Signalsを学ぶ');
    await page.getByRole('button', { name: '保存' }).click();

    await expect(page.getByText('Angular Signalsを学ぶ')).toHaveCount(1);
    await expect(page.getByText('Angularを学ぶ')).toHaveCount(0);
  });

  test('edits a task due date', async ({ page }) => {
    await addTask(page, 'Angularを学ぶ', '2026-07-01');

    await page.getByLabel('Angularを学ぶを編集').click();

    await page.getByLabel('編集期限').fill('2026-07-10');
    await page.getByRole('button', { name: '保存' }).click();

    await expect(page.getByText('2026-07-10')).toBeVisible();
  });
});

test.describe('task filtering and searching', () => {
  test('filters tasks by status', async ({ page }) => {
    await addTask(page, '未完了タスク');

    await addTask(page, '完了済みタスク');
    await page.getByLabel('完了済みタスクを完了する').check();

    await page.getByRole('button', { name: '未完了', exact: true }).click();

    await expect(page.getByText('未完了タスク')).toHaveCount(1);
    await expect(page.getByText('完了済みタスク')).toHaveCount(0);

    await page.getByRole('button', { name: '完了済み', exact: true }).click();

    await expect(page.getByText('未完了タスク')).toHaveCount(0);
    await expect(page.getByText('完了済みタスク')).toHaveCount(1);

    await page.getByRole('button', { name: 'すべて', exact: true }).click();

    await expect(page.getByText('未完了タスク')).toHaveCount(1);
    await expect(page.getByText('完了済みタスク')).toHaveCount(1);
  });

  test('searches tasks by title', async ({ page }) => {
    await addTask(page, 'Angularを学ぶ');

    await addTask(page, 'Reactを学ぶ');

    await page.getByLabel('タスク検索').fill('Angular');

    await expect(page.getByText('Angularを学ぶ')).toHaveCount(1);
    await expect(page.getByText('Reactを学ぶ')).toHaveCount(0);
  });
});

test.describe('task sorting', () => {
  test('sorts tasks by title', async ({ page }) => {
    await addTask(page, 'B: Angularを学ぶ');

    await addTask(page, 'A: Reactを学ぶ');

    await page.getByLabel('並び順').selectOption('title');

    const tasks = page.getByRole('listitem');

    await expect(tasks.nth(0)).toContainText('A: Reactを学ぶ');
    await expect(tasks.nth(1)).toContainText('B: Angularを学ぶ');
  });

  test('sorts tasks by dueDate', async ({ page }) => {
    await addTask(page, 'A: 期限が遅いタスク', '2026-07-20');

    await addTask(page, 'B: 期限が早いタスク', '2026-07-01');

    await page.getByLabel('並び順').selectOption('dueDate');

    const tasks = page.getByRole('listitem');

    await expect(tasks.nth(0)).toContainText('B: 期限が早いタスク');
    await expect(tasks.nth(1)).toContainText('A: 期限が遅いタスク');
  });
});

test.describe('task pagination', () => {
  test('paginates tasks', async ({ page }) => {
    for (let i = 0; i < 6; i++) {
      await addTask(page, `タスク${i + 1}`);
    }

    await expect(page.getByText('タスク1')).toHaveCount(0);
    await expect(page.getByText('タスク6')).toHaveCount(1);

    await page.getByLabel('次のページ').click();

    await expect(page.getByText('タスク1')).toHaveCount(1);
    await expect(page.getByText('タスク6')).toHaveCount(0);
  });
});

test.describe('task persistence', () => {
  test('keeps tasks after reload', async ({ page }) => {
    await addTask(page, 'リロード後も残るタスク');

    await expect(page.getByText('リロード後も残るタスク')).toHaveCount(1);

    await page.reload();

    await expect(page.getByText('リロード後も残るタスク')).toHaveCount(1);
  });
});

test.describe('task undo', () => {
  test('restores a deleted task', async ({ page }) => {
    await addTask(page, 'Undo対象タスク');

    await expect(page.getByText('Undo対象タスク')).toHaveCount(1);

    await page.getByLabel('Undo対象タスクを削除').click();

    await expect(page.getByText('Undo対象タスク', { exact: true })).toHaveCount(0);
    await expect(page.getByText('「Undo対象タスク」を削除しました')).toBeVisible();

    await page.getByRole('button', { name: '元に戻す' }).click();

    await expect(page.getByText('Undo対象タスク', { exact: true })).toHaveCount(1);
    await expect(page.getByText('「Undo対象タスク」を削除しました')).toHaveCount(0);
  });
});

test.describe('task error handling', () => {
  test('retries loading tasks after error', async ({ page }) => {
    let shouldFail = true;

    await page.route('http://localhost:3000/tasks', async (route) => {
      if (route.request().method() === 'GET' && shouldFail) {
        shouldFail = false;

        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'error' }),
        });

        return;
      }

      await route.continue();
    });

    await page.goto('/tasks');

    await expect(page.getByText('タスクの取得に失敗しました')).toBeVisible();

    await page.getByRole('button', { name: '再読み込み' }).click();

    await expect(page.getByText('タスクの取得に失敗しました')).toHaveCount(0);
  });
});
