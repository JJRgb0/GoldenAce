import { createSlice } from "@reduxjs/toolkit";

const setArcadeVisible = createSlice({
    name: 'setArcade',
    initialState: [
        {
            visible: false,
        },
    ],
    reducers: {
        toggleVisibility(state, action) {
            state[0].visible = action.payload
        }
    }
})

export const { toggleVisibility } = setArcadeVisible.actions;
export const setArcadeReducer = setArcadeVisible.reducer;