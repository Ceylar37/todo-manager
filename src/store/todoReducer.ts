import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v1} from "uuid";
import {AppDispatch, RootState} from "./index";

export interface ITodo {
    id: string,
    title: string,
    completed: boolean
}

interface ITodoList {
    todoListId: string,
    todoListName: string,
    todoList: ITodo[]
}

export const firstTodoListId = v1()
export const secondTodoListId = v1()

export const todoInitialState = {
    todoLists: [
        {todoListId: firstTodoListId, todoListName: 'first list', todoList: []},
        {todoListId: secondTodoListId, todoListName: 'second list', todoList: []}
    ] as ITodoList[],
    currentTodoListId: firstTodoListId as string,
    error: '' as string
}

interface IAddTodoList {
    todoListName: string,
}

interface IAddTodoToList {
    todoTitle: string
}

interface IChangeCurrentTodoListId {
    newCurrentId: string
}

interface IMarkTodoOrDeleteTodo {
    todoId: string
}

const todoSlice = createSlice({
    name: 'todo',
    initialState: todoInitialState,
    reducers: {
        addTodoList: (state, action: PayloadAction<IAddTodoList>) => {
            state.todoLists.push({todoListId: v1(), todoListName: action.payload.todoListName, todoList: []})
        },
        addTodoToList: (state, action: PayloadAction<IAddTodoToList>) => {
            const currentTodoList = takeCurrentTodoList(state.todoLists, state.currentTodoListId)
            if (currentTodoList) currentTodoList.todoList.push({
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
                const currentTodo = takeCurrentTodo(currentTodoList.todoList, action.payload.todoId)
                currentTodo.completed = !currentTodo.completed
            } catch (e) {
                alert(e)
            }
        },
        deleteTodo: (state, action: PayloadAction<IMarkTodoOrDeleteTodo>) => {
            try {
                const currentTodoList = takeCurrentTodoList(state.todoLists, state.currentTodoListId)
                currentTodoList.todoList.filter(todo => todo.id !== action.payload.todoId)
            } catch (e) {
                alert(e)
            }
        },
        deleteTodoList: (state, action: PayloadAction<IMarkTodoOrDeleteTodo>) => {
            state.todoLists.filter(todoList => todoList.todoListId !== action.payload.todoId)
        }
    }
})

const takeCurrentTodoList = (todoLists: ITodoList[], currentTodoListId: string) => {
    const currentTodoList = todoLists.find(todoList => todoList.todoListId === currentTodoListId)
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
    if (thunkAPI.getState().todo.todoLists.find(todoList => todoListName === todoList.todoListName))
        return `Todo List with name ${todoListName} already exists`
    else
        thunkAPI.dispatch(todoActions.addTodoList({todoListName}))
    return ''
})

export const deleteTodoList = createAsyncThunk<Promise<void>,
    void,
    IThunkApi>('todo/deleteTodoList', async (arg, thunkAPI) => {
    const tempTodoListId = thunkAPI.getState().todo.currentTodoListId
    thunkAPI.dispatch(todoActions.changeCurrentTodoListId({newCurrentId: thunkAPI.getState().todo.todoLists[1].todoListId}))
    thunkAPI.dispatch(todoActions.deleteTodo({todoId: tempTodoListId}))
})