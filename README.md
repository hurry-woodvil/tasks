# Tasks

**Current Version: v0.3.0**

Angular Signals と NextJS を使ったタスク管理アプリ。

このプロジェクトは、フロントエンドだけでなくバックエンドも含めた
モダンな Web アプリケーション開発を学習することを目的としている。

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

NestJS における

- Layered Architecture
- Repository Pattern
- Dependency Injection
- Validation
- ORM (Prisma)

さらに

- Unit Test
- E2E Test
- Full Stack Development

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
- SQLite 永続化
- REST API

---

## Tech Stack

### Angular

- Angular
- Angular Signals
- RxJS
- TypeScript

### Backend

- NestJS
- Prisma ORM
- SQLite
- class-validator

### Testing

- Vitest
- Jest
- Playwright

### Tooling

- pnpm
- ESLint
- Prettier

---

## Architecture

### Directory Structure

```text
apps/
┣━ frontend/
┃   ┗━ src/
┃       ┗━ app/
┃           ┗━ features/
┃               ┗━ tasks/
┃                   ┣━ components/
┃                   ┣━ data-access/
┃                   ┃   ┣━ task-repository.ts
┃                   ┃   ┣━ task-repository.provider.ts
┃                   ┃   ┣━ json-server-task-repository.ts
┃                   ┃   ┣━ mock-task-repository.ts
┃                   ┃   ┗━ local-storage-task-repository.ts
┃                   ┣━ models/
┃                   ┣━ pages/
┃                   ┗━ stores/
┗━ backend/
    ┗━ src/
        ┗━ app/
            ┣━ prisma/
            ┗━ tasks/
```

### Data Flow

```text
Angular UI
↓
TaskStore (Signals)
↓
TaskRepository
↓
HTTP
↓
NestJS Controller
↓
TaskService
↓
TaskRepository
↓
Prisma
↓
SQLite
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
- Layered Architecture (NestJS)
- Prisma ORM
- Repository Pattern (Frontend / Backend)
- DTO + Validation

---

## API Documentation

Backend 起動後、Swagger UI で API 仕様を確認可能。

```zsh
pnpm backend:dev
```

```text
http://localhost:3000/api
```

---

## Testing

### Frontend

#### Unit Test

- Component
- Store

#### E2E

- CRUD
- Search
- Filter
- Sort
- Pagination
- Undo
- Retry

### Backend

#### Unit Test

- Controller
- Service
- Repository

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

- OpenAPI
- JWT Authentication
- Authorization
- Docker
- CI (GitHub Actions)
- Angular Material
- Responsive UI
- Dark Mode
