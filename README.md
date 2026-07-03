# Tasks

Angular Signals を使ったタスク管理アプリ。

このプロジェクトは、Angular の設計・状態管理・テスト・UI コンポーネント設計を学習することを目的として開発している。

---

## Features

- タスクの追加
- タスクの編集
- タスクの削除
- Undo
- 完了 / 未完了
- フィルター
- 検索
- ソート
- ページネーション
- Loading
- Error Retry
- Empty State

---

## Tech Stack

- Angular
- TypeScript
- Angular Signals
- RxJS
- JSON Server
- Vitest
- Playwright
- ESLint
- Prettier
- pnpm

---

## Architecture

### Directory Structure

```text
src/
┗━ app/
    ┗━ features/
        ┗━ tasks/
            ┣━ components/
            ┣━ data-access/
            ┣━ models/
            ┣━ pages/
            ┗━ stores/
```

### Data Flow

```text
UI
↓
TaskListPage
↓
TaskStore (Signals)
↓
TaskRepository
↓
JSON Server
```

### Component Design

```text
TaskListPage
┣━ TaskControls
┣━ TaskForm
┣━ TaskLoading
┣━ TaskErrorBanner
┣━ TaskList
┃   ┣━ TaskItem
┃   ┗━ TaskEmptyState
┣━ TaskPagination
┗━ TaskUndoBanner
```

---

## State Management

TaskStore は Signals を利用しています。

```text
tasks
┃
┣━ filteredTasks
┃   ↓
┃   pagedTasks
┃
┣━ loading
┣━ error
┣━ recentlyDeletedTask
┣━ currentPage
┗━ pageSize

```

---

## Testing

### Unit Test

- Component
- Store

### E2E

- CRUD
- Search
- Filter
- Sort
- Pagination
- Undo
- Retry

---

## Development

### Install

```zsh
pnpm install
```

### Start

```zsh
pnpm dev
```

### Test

```zsh
pnpm test
```

### E2E

```zsh
pnpm e2e
```

### Check

```zsh
pnpm check
```

---

## Future Improvements

- NestJS Backend
- Repository Interface
- Authentication
- Responsive UI
- Dark Mode
- Material Design
