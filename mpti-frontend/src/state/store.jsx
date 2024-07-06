import { configureStore } from "@reduxjs/toolkit";
import forgetPasswordReducer from "./ForgetPasswordSlice"
import userReducer from "./UserSlice";
import customerReducer from "./CustomerSlice";
import stokReducer from "./StokSlice";
import salesReducer from "./SalesSlice";
const store = configureStore({
    reducer: {
        user: userReducer,
        forgetPassword: forgetPasswordReducer,
        customer: customerReducer,
        stok: stokReducer,
        sales: salesReducer
    }
})
export default store