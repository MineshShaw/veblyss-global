import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string | null;
  email: string | null;
  password: string | null;
  cartdata: object | null;
  wishlistdata: object | null;
  orderdata: object | null;
  addressdata: object | null;
}

const initialState: UserState = {
  name: null,
  email: null,
  password: null,
  cartdata: null,
  wishlistdata: null,
  orderdata: null,
  addressdata: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    resetUser() {
      return initialState;
    },
    updateCart(state, action: PayloadAction<object>) {
      state.cartdata = action.payload;
    },
    updateWishlist(state, action: PayloadAction<object>) {
      state.wishlistdata = action.payload;
    },
    updateOrder(state, action: PayloadAction<object>) {
      state.orderdata = action.payload;
    },
    updateAddress(state, action: PayloadAction<object>) {
      state.addressdata = action.payload;
    },
  },
});

export const {
  setUser,
  resetUser,
  updateCart,
  updateWishlist,
  updateOrder,
  updateAddress,
} = userSlice.actions;

export default userSlice.reducer;
