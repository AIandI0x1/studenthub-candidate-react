import { Candidate } from '@/models/candidate';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: Candidate | null;
  isProfileCompleted: boolean;
}

const initialState: UserState = {
  user: null,
  isProfileCompleted: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
    },
    setIsProfileCompleted: (state, action: PayloadAction<{ isProfileCompleted: boolean }>) => {
      state.isProfileCompleted = action.payload.isProfileCompleted;
    }, 
  },
});

export const { setUser, setIsProfileCompleted } = userSlice.actions;
export default userSlice.reducer;