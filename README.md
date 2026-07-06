# Tasks

**Current Version: v0.2.0**

Angular Signals を使ったタスク管理アプリ。

このプロジェクトは、Angular の設計・状態管理・テスト・UI コンポーネント設計を学習することを目的として開発している。

---

## Learning Goals

このプロジェクトは Todo アプリを作ることが目的ではなく、

Angular における

- Component 設計
- Signals
- State Management
- Repository Pattern
- Dependency Injection
- Testing

を学習・検証することを目的としている。

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
- Repository Pattern
- Dependency Injection
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
            ┃   ┣━ task-repository.ts
            ┃   ┣━ task-repository.provider.ts
            ┃   ┣━ json-server-task-repository.ts
            ┃   ┣━ mock-task-repository.ts
            ┃   ┗━ local-storage-task-repository.ts
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
TaskRepository (interface)
↓
Provider
  ┣━ JsonServerTaskRepository
  ┣━ MockTaskRepository
  ┗━ LocalStorageTaskRepository
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
┣━ tasks
┃   ↓
┃   filteredTasks
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

## Design Decisions

このプロジェクトでは以下の設計方針を採用している。

- Feature First によるディレクトリ構成
- Signals を利用した状態管理
- Store に画面ロジックを集約
- Repository Pattern によるデータアクセスの抽象化
- Dependency Injection による Repository の切り替え
- Barrel Export による公開 API の整理

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
- OpenAPI
- Authentication
- Authorization
- Angular Material
- Responsive UI
- Dark Mode
