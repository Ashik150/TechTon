import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isLoading: true,
};

export const eventReducer = createReducer(initialState, (builder) => {
    builder
        // Event Create
        .addCase('eventCreateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('eventCreateSuccess', (state, action) => {
            state.isLoading = false;
            state.event = action.payload;
            state.success = true;
        })
        .addCase('eventCreateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        // Get All Events of Shop
        .addCase('getAlleventsShopRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAlleventsShopSuccess', (state, action) => {
            state.isLoading = false;
            state.events = action.payload;
        })
        .addCase('getAlleventsShopFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // Delete Event of Shop
        .addCase('deleteeventRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('deleteeventSuccess', (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase('deleteeventFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        //get all events
        .addCase('getAlleventsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAlleventsSuccess', (state, action) => {
            state.isLoading = false;
            state.allEvents = action.payload;
        })
        .addCase('getAlleventsFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        // Clear Errors
        .addCase('clearErrors', (state) => {
            state.error = null;
        });
});
