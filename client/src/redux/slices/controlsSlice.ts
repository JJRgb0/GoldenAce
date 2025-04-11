import { createSlice } from "@reduxjs/toolkit";

const controlsSlice = createSlice({
    name: 'controls',
    initialState: [
        // Joystick
        {
            up: false,
            down: false,
            left: false,
            right: false,
        },
        // Buttons
        {
            1: false,
            2: false,
            3: false,
            4: false,
        }
    ],
    reducers: {
        setJoystick(state, action) {
            state[0] = {
                up: action.payload.up,
                down: action.payload.down,
                left: action.payload.left,
                right: action.payload.right,
            };
        },
        setButtons(state, action) {
            state[1] = {
                ...state[1],
                ...action.payload,
            };
        },
        resetControls(state) {
            state[0] = {
                up: false,
                down: false,
                left: false,
                right: false,
            };
            state[1] = {
                up: false,
                down: false,
                left: false,
                right: false,
            };
        }
    }
})

export const { setJoystick, setButtons, resetControls } = controlsSlice.actions;
export const controlsReducer = controlsSlice.reducer;