import {createSelector} from "reselect";
import {RootState} from "../store";

export const getTodoPage = (state: RootState) => state.todo
export const getFilters = (state: RootState) => state.todo.filters
export const getCurrentTodoListId = (state: RootState) => state.todo.currentTodoListId

export const getCurrentTodoList = createSelector(
    getTodoPage,
    getCurrentTodoListId,
    (todo, currentTodoListId) => todo.todoLists.find(todoList => todoList.id === currentTodoListId)
)