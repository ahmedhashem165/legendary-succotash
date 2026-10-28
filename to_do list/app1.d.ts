interface Todo {
    id: number;
    text: string;
    completed: boolean;
}
type Filter = "all" | "active" | "completed";
declare const STORAGE_KEY = "todo-app-items";
declare const form: HTMLFormElement;
declare const input: HTMLInputElement;
declare const list: HTMLUListElement;
declare const countEl: HTMLSpanElement;
declare const clearCompletedBtn: HTMLButtonElement;
declare const clearAllBtn: HTMLButtonElement;
declare const filterButtons: NodeListOf<HTMLButtonElement>;
declare let todos: Todo[];
declare let currentFilter: Filter;
declare const TRASH_ICON: string;
//# sourceMappingURL=app1.d.ts.map