import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const API = "http://37.27.29.18:8001/api/to-dos";

interface todoState {
    data: any[],
    selectedTodo: any,
    status?: string,
    error?: string
}

const initialState: todoState = {
    data: [],
    selectedTodo: null
}

export const fetchTodos = createAsyncThunk('todo/fetchTodos', async () => {
    const response = await axios.get(API);
    return response.data;
});

export const fetchTodoById = createAsyncThunk("todo/fetchTodoById", async (id: number) => {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
});

export const deleteTodo = createAsyncThunk("todo/deleteTodo", async (id: number, { dispatch }) => {
    await axios.delete(`${API}?id=${id}`);
    dispatch(fetchTodos());
    return id;
});

export const editTodo = createAsyncThunk("todo/editTodo", async ({ id, updatedTodo }: any, { dispatch }) => {
    const response = await axios.put(`${API}`, { ...updatedTodo, id });
    dispatch(fetchTodos());
    return response.data;
});

export const addTodo = createAsyncThunk("todo/addTodo", async (formData: FormData, { dispatch }) => {
    await axios.post(API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(fetchTodos());
});


export const toggleStatus = createAsyncThunk("todo/toggleStatus", async (id: number, { dispatch }) => {
    await axios.put(`http://37.27.29.18:8001/completed?id=${id}`);
    dispatch(fetchTodos());
    return id;
});

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.data = action.payload.data;
            })
            .addCase(fetchTodoById.fulfilled, (state, action) => {
                state.selectedTodo = action.payload.data;
            })
    },
})

export default todoSlice.reducer
