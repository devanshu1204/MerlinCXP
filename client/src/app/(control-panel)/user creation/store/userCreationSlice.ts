import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserCreationState } from '../types/User';

const initialState: UserCreationState = {
    users: [],
    loading: false,
    error: null
};

const userCreationSlice = createSlice({
    name: 'userCreation',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        addUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        }
    }
});

export const { setUsers, addUser, updateUser, deleteUser } = userCreationSlice.actions;
export default userCreationSlice.reducer;
