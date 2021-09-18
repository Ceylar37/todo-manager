import {createSelector} from "reselect";
import {RootState} from "../store";

export const getTodoPage = (state: RootState) => state.todo
export const getFilters = (state: RootState) => state.todo.filters
export const getCurrentTodoListId = (state: RootState) => state.todo.currentTodoListId
export const getTodoListsLength = (state: RootState) => state.todo.todoLists.length
export const getFilterTerm = (state: RootState) => state.todo.filterTerm
export const getCurrentTodoList = createSelector(
    getTodoPage,
    getCurrentTodoListId,
    (todo, currentTodoListId) => todo.todoLists.find(todoList => todoList.id === currentTodoListId)
)

export const getCurrentTodoListName = createSelector(
    getCurrentTodoList,
    todoList => todoList?.name
)

export const getCurrentFilter = createSelector(
    getFilters,
    filters => (filters.find(filter => filter.isFilterOn))?.name
)

export const getFilteredTodos = createSelector(
    getCurrentTodoList,
    getCurrentFilter,
    (todoList, filter) => {
        switch (filter) {
            case 'Only Completed':
                return todoList?.value.filter(todo => todo.completed)
            case 'Only Not Completed':
                return todoList?.value.filter(todo => !todo.completed)
            default:
                return todoList?.value
        }
    }
)

export const getTermFilteredTodos = createSelector(
    getFilterTerm,
    getFilteredTodos,
    (filterTerm, filteredTodos) => filteredTodos?.filter(todo => todo.title.toLowerCase().indexOf(filterTerm) + 1)
)