import { combineReducers } from '@reduxjs/toolkit';

import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as chatReducer } from 'src/slices/chat';
import { reducer as kanbanReducer } from 'src/slices/kanban';
import { reducer as mailReducer } from 'src/slices/mail';
// import { homeSlice} from "../slices/homeSlice";
import homeReducer from 'src/slices/home'; // Assuming the file name is home.js

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  home: homeReducer,
});
