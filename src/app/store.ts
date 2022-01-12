import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import walletReducer from '../slices/walletSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['wallet/setTokenInstance', 'wallet/setProvider'],
        // Ignore these paths in the state
        ignoredPaths: ['wallet.tokenInstance', 'wallet.provider'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
