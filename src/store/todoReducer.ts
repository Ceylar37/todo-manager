import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v1} from "uuid";
import {AppDispatch, RootState} from "./index";

export interface ITodo {
    id: string,
    title: string,
    completed: boolean
}
export interface ITodoList {
    id: string,
    name: string,
    value: ITodo[]
}
export interface IFilter {
    name: 'Only Completed' | 'Only Not Completed',
    isFilterOn: boolean
}

export const firstTodoListId = v1()
export const secondTodoListId = v1()

export const todoInitialState = {
    todoLists: [
        {id: firstTodoListId, name: 'first list', value: [
            {id: v1(), title: 'delectus aut autem', completed: false},
            {id: v1(), title: 'quis ut nam facilis et officia qui', completed: true},
            {id: v1(), title: 'fugiat veniam minus', completed: false}
            ]},
        {id: secondTodoListId, name: 'second list', value: [
                {id: v1(), title: 'et porro tempora', completed: true},
                {id: v1(), title: 'laboriosam mollitia et enim quasi adipisci quia provident illum', completed: false},
                {id: v1(), title: 'qui ullam ratione quibusdam voluptatem quia omnis', completed: false}
            ]}
    ] as ITodoList[],
    currentTodoListId: firstTodoListId as string,
    filters: [
        {name: 'Only Completed', isFilterOn: false},
        {name: 'Only Not Completed', isFilterOn: false},
    ] as IFilter[]
}

interface IAddTodoList {todoListName: string,}
interface IAddTodoToList {todoTitle: string}
interface IChangeCurrentTodoListId {newCurrentId: string}
interface IMarkTodoOrDeleteTodo {todoId: string}
interface IChangeFilter {filterName: string}

const todoSlice = createSlice({
    name: 'todo',
    initialState: todoInitialState,
    reducers: {
        addTodoList: (state, action: PayloadAction<IAddTodoList>) => {
            state.todoLists.push({id: v1(), name: action.payload.todoListName, value: []})
        },
        addTodoToList: (state, action: PayloadAction<IAddTodoToList>) => {
            const currentTodoList = takeCurrentTodoList(state.todoLists, state.currentTodoListId)
            if (currentTodoList) currentTodoList.value.push({
                id: v1(),
                title: action.payload.todoTitle,
                completed: false
            })
        },
        changeCurrentTodoListId: (state, action: PayloadAction<IChangeCurrentTodoListId>) => {
            state.currentTodoListId = action.payload.newCurrentId
        },
        markTodo: (state, action: PayloadAction<IMarkTodoOrDeleteTodo>) => {
            try {
                const currentTodoList = takeCurrentTodoList(state.todoLists, state.currentTodoListId)
                const currentTodo = takeCurrentTodo(currentTodoList.value, action.payload.todoId)
                currentTodo.completed = !currentTodo.completed
            } catch (e) {
                alert(e)
            }
        },
        deleteTodo: (state, action: PayloadAction<IMarkTodoOrDeleteTodo>) => {
            try {
                let currentTodoList = takeCurrentTodoList(state.todoLists, state.currentTodoListId)
                currentTodoList.value = currentTodoList.value.filter(todo => todo.id !== action.payload.todoId)
            } catch (e) {
                alert(e)
            }
        },
        deleteTodoList: (state, action: PayloadAction<IMarkTodoOrDeleteTodo>) => {
            state.todoLists = state.todoLists.filter(todoList => todoList.id !== action.payload.todoId)
        },
        changeFilter: (state, action: PayloadAction<IChangeFilter>) => {
            state.filters.forEach(filter => {
                filter.name === action.payload.filterName ? filter.isFilterOn = !filter.isFilterOn : filter.isFilterOn = false
            })
        }
    }
})

const takeCurrentTodoList = (todoLists: ITodoList[], currentTodoListId: string) => {
    const currentTodoList = todoLists.find(todoList => todoList.id === currentTodoListId)
    if (currentTodoList)
        return currentTodoList
    else
        throw new Error('TODO LIST NOT FOUND')
}
const takeCurrentTodo = (todoList: ITodo[], currentTodoId: string) => {
    const currentTodo = todoList.find(todo => todo.id === currentTodoId)
    if (currentTodo)
        return currentTodo
    else
        throw new Error('TODO NOT FOUND')
}

export const todoReducer = todoSlice.reducer
export const todoActions = todoSlice.actions

interface IThunkApi {
    dispatch: AppDispatch,
    state: RootState
}

export const addTodoList = createAsyncThunk<Promise<string>,
    string,
    IThunkApi>('todo/addTodoList', async (todoListName, thunkAPI) => {
    if (thunkAPI.getState().todo.todoLists.find(todoList => todoListName === todoList.name))
        return `Todo List with name ${todoListName} already exists`
    else {
        await thunkAPI.dispatch(todoActions.addTodoList({todoListName}))
        thunkAPI.dispatch(todoActions.changeCurrentTodoListId({newCurrentId: thunkAPI.getState().todo.todoLists[thunkAPI.getState().todo.todoLists.length - 1].id}))
    }
    return ''
})

export const deleteTodoList = createAsyncThunk<Promise<void>,
    void,
    IThunkApi>('todo/deleteTodoList', async (arg, thunkAPI) => {
    const tempTodoListId = thunkAPI.getState().todo.currentTodoListId
    await thunkAPI.dispatch(todoActions.deleteTodoList({todoId: tempTodoListId}))
    thunkAPI.dispatch(todoActions.changeCurrentTodoListId({newCurrentId: thunkAPI.getState().todo.todoLists[0].id}))
})