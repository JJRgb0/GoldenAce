import { createSlice } from "@reduxjs/toolkit";

const arcadeSlice = createSlice({
    name: 'arcade',
    initialState: [
        {
            arcadeVisible: false,
            screenVisible: false,
        },
        {
            path: undefined as string | undefined,
        }
    ],
    reducers: {
        toggleVisibility(state, action) {
            state[0].arcadeVisible = action.payload
        },
        toggleScreenVisibility(state, action) {
            state[0].screenVisible = action.payload
        },
        setPath(state, action) {
            state[1].path = action.payload
        }
    }
})

export const { toggleVisibility, toggleScreenVisibility, setPath } = arcadeSlice.actions;
export const arcadeReducer = arcadeSlice.reducer;