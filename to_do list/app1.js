"use strict";
const STORAGE_KEY = "todo-app-items";
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const countEl = document.getElementById("count");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const filterButtons = document.querySelectorAll(".filter");
let todos = loadTodos();
let currentFilter = "all";
function loadTodos() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function saveTodos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
    catch {
        /* storage unavailable – ignore */
    }
}
function addTodo(text) {
    todos.push({ id: Date.now(), text, completed: false });
    update();
}
function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo)
        todo.completed = !todo.completed;
    update();
}
function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    update();
}
function editTodo(id, text) {
    const trimmed = text.trim();
    if (trimmed === "") {
        deleteTodo(id);
        return;
    }
    const todo = todos.find((t) => t.id === id);
    if (todo)
        todo.text = trimmed;
    update();
}
function visibleTodos() {
    if (currentFilter === "active")
        return todos.filter((t) => !t.completed);
    if (currentFilter === "completed")
        return todos.filter((t) => t.completed);
    return todos;
}
function startEditing(li, todo) {
    const label = li.querySelector(".todo-text");
    const editor = document.createElement("input");
    editor.type = "text";
    editor.className = "edit-input";
    editor.value = todo.text;
    label.replaceWith(editor);
    editor.focus();
    editor.select();
    let finished = false;
    const finish = (save) => {
        if (finished)
            return;
        finished = true;
        if (save)
            editTodo(todo.id, editor.value);
        else
            render();
    };
    editor.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            finish(true);
        if (e.key === "Escape")
            finish(false);
    });
    editor.addEventListener("blur", () => finish(true));
}
const TRASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v7M14 10v7"/></svg>';
function createItem(todo) {
    const li = document.createElement("li");
    li.className = "todo" + (todo.completed ? " done" : "");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "Mark as completed");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));
    const label = document.createElement("span");
    label.className = "todo-text";
    label.textContent = todo.text;
    label.addEventListener("dblclick", () => startEditing(li, todo));
    const del = document.createElement("button");
    del.className = "btn-delete";
    del.setAttribute("aria-label", "Delete todo");
    del.innerHTML = TRASH_ICON;
    del.addEventListener("click", () => deleteTodo(todo.id));
    li.append(checkbox, label, del);
    return li;
}
function render() {
    list.innerHTML = "";
    const items = visibleTodos();
    if (items.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Nothing here yet. Add a todo above.";
        list.appendChild(empty);
    }
    else {
        items.forEach((todo) => list.appendChild(createItem(todo)));
    }
    const left = todos.filter((t) => !t.completed).length;
    countEl.textContent = `${left} ${left === 1 ? "item" : "items"} left`;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === currentFilter));
}
function update() {
    saveTodos();
    render();
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "")
        return;
    addTodo(text);
    input.value = "";
    input.focus();
});
filterButtons.forEach((btn) => btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
}));
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((t) => !t.completed);
    update();
});
clearAllBtn.addEventListener("click", () => {
    todos = [];
    update();
});
render();
//# sourceMappingURL=app1.js.map