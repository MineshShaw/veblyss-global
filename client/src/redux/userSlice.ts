import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocketAddress } from 'net';

interface AddressData {
  _id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

interface UserState {
  name: string | null;
  email: string | null;
  cartdata: Array<{ id: string; name: string; price: number }> | null;
  wishlistdata: Array<{ id: string; name: string; price: number }> | null;
  orderdata: Array<{ id: string; name: string; price: number }> | null;
  addressdata: Array<AddressData> | null;
}

const initialState: UserState = {
  name: null,
  email: null,
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
    updateName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    updateEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setAddresses(state, action: PayloadAction<Array<AddressData>>) {
      state.addressdata = action.payload;
    },
    removeAddress(state, action: PayloadAction<string>) {
      if (state.addressdata) {
        state.addressdata = state.addressdata.filter((addr) => addr._id !== action.payload);
      }
    },
    updateCart(state, action: PayloadAction<Array<{ id: string; name: string; price: number }>>) {
      state.cartdata = action.payload;
    },
    updateWishlist(state, action: PayloadAction<Array<{ id: string; name: string; price: number }>>) {
      state.wishlistdata = action.payload;
    },
    updateOrder(state, action: PayloadAction<Array<{ id: string; name: string; price: number }>>) {
      state.orderdata = action.payload;
    },
    updateAddress(state, action: PayloadAction<Array<AddressData>>) {
      state.addressdata = action.payload;
    },
  },
});

export const {
  setUser,
  resetUser,
  updateName,
  updateEmail,
  setAddresses,
  removeAddress,
  updateCart,
  updateWishlist,
  updateOrder,
  updateAddress,
} = userSlice.actions;

export default userSlice.reducer;
