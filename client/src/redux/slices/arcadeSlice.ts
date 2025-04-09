import { createSlice } from "@reduxjs/toolkit";

const arcadeSlice = createSlice({
    name: 'arcade',
    initialState: [
        {
            arcadeVisible: false,
            screenVisible: false,
        },
    ],
    reducers: {
        toggleVisibility(state, action) {
            state[0].arcadeVisible = action.payload
        },
        toggleScreenVisibility(state, action) {
            state[0].screenVisible = action.payload
        }
    }
})

export const { toggleVisibility, toggleScreenVisibility } = arcadeSlice.actions;
export const arcadeReducer = arcadeSlice.reducer;