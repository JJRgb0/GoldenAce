import { createSlice } from "@reduxjs/toolkit";

const isCustomBinds = localStorage.getItem('arcadeBinds') !== null;

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
            btnUp: false,
            btnLeft: false,
            btnRight: false,
            btnDown: false,
        },
        // Binds
        {
            up: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).up : ['W', 'w'],
            down: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).down : ['S', 's'],
            left: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).left : ['A', 'a'],
            right: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).right : ['D', 'd'],
            btnUp: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).btnUp : ['I', 'i'],
            btnLeft: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).btnLeft : ['J', 'j'],
            btnRight: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).btnRight : ['L', 'l'],
            btnDown: isCustomBinds ? JSON.parse(localStorage.getItem('arcadeBinds')!).btnDown : ['K', 'k'],
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
        setBinds(state, action) {
            state[2] = {
                ...state[2],
                ...action.payload,
            };
        }
    }
})

export const { setJoystick, setButtons, setBinds } = controlsSlice.actions;
export const controlsReducer = controlsSlice.reducer;