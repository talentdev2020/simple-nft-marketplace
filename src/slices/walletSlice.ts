import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
interface IWalletState {
    ethBalance: string;
}

const initialState: IWalletState = {
  ethBalance: "0"
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setEthBalance: (state, action: PayloadAction<string>) => {
      state.ethBalance = action.payload;
    },
  },
});

export const { setEthBalance } = walletSlice.actions;

export const getEthBalance = (state: RootState) => state.wallet.ethBalance;

export default walletSlice.reducer;
