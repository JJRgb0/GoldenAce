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
        },
        {
            volume: localStorage.getItem('arcadeVolume') ? Number(localStorage.getItem('arcadeVolume')) : 50,
            brightness: localStorage.getItem('arcadeBrightness') ? Number(localStorage.getItem('arcadeBrightness')) : 70,
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
        },
        setVolume(state, action) {
            state[2].volume = action.payload
            localStorage.setItem('arcadeVolume', action.payload.toString());
        },
        setBrightness(state, action) {
            state[2].brightness = action.payload
            localStorage.setItem('arcadeBrightness', action.payload.toString());
        }
    }
})

export const { toggleVisibility, toggleScreenVisibility, setPath, setVolume, setBrightness } = arcadeSlice.actions;
export const arcadeReducer = arcadeSlice.reducer;