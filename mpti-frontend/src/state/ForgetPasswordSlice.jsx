import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI
})

export const forgetPasswordSendEmail = createAsyncThunk(
    "forget-password/email",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            email: data.email
        })
        
        try {
            const response = await axiosInstance.post("/forget-password/email", prepData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            const result = await response.data
            return result;
        } catch (error) {
            
            if(error.response){
                const message = error.response.data.errors;
                return thunkAPI.rejectWithValue(message)
            }else{
                return thunkAPI.rejectWithValue("Network error")
            }
        }
    }
)

export const forgetPasswordSendCode = createAsyncThunk(
    "forget-password/code",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            code: data.code,
            email: data.email
        })
        try {
            const response = await axiosInstance.post("/forget-password/code", prepData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            const result = await response.data
            return result;
        } catch (error) {
            
            if(error.response){
                const message = error.response.data.errors;
                return thunkAPI.rejectWithValue(message)
            }else{
                return thunkAPI.rejectWithValue("Network error")
            }
        }
    }
)

export const forgetPasswordSendNewPass = createAsyncThunk(
    "forget-password/new-password",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            email: data.email,
            code: data.code,
            newPass: data.newPass,
            reNewPass: data.reNewPass
        })
        try {
            const response = await axiosInstance.post("/forget-password/new-password", prepData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            const result = await response.data
            return result;
        } catch (error) {
            
            if(error.response){
                const message = error.response.data.errors;
                return thunkAPI.rejectWithValue(message)
            }else{
                return thunkAPI.rejectWithValue("Network error")
            }
        }
    }
)

export const FORGET_PASSWORD_PROGRESS = {
    EMAIL: "EMAIL",
    CODE: "CODE",
    REPASS: "REPASS",
}


const ForgetPasswordSlice = createSlice({
    name: "forget_password",
    initialState: {
        loading: null,
        error: null,
        message: null,
        progress: FORGET_PASSWORD_PROGRESS.EMAIL,
        data: {
            email: null,
            code: null,
            newPass: null,
            reNewPass: null
        }
    },
    reducers:{
        updateEmailForgotPassword: (state, action)=>{
            state.data.email = action.payload
        },
        updateCodeForgotPassword: (state, action)=>{
            state.data.code = action.payload
        },
        updateNewPassForgotPassword: (state, action)=>{
            state.data.newPass = action.payload
        },
        updateReNewPassForgotPassword: (state, action)=>{
            state.data.reNewPass = action.payload
        },
        updateErrorForgotPassword: (state, action)=>{
            state.error = action.payload
        },
        updateMessageForgotPassword: (state, action)=>{
            state.message = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(forgetPasswordSendEmail.pending, (state, action)=>{
                state.loading = true;
                state.error = false;
            })
            .addCase(forgetPasswordSendEmail.fulfilled, (state, action)=>{
                
                state.loading = false;
                state.error = false;
                state.progress = FORGET_PASSWORD_PROGRESS.CODE;
                // state.data.email = action.payload;
            })
            .addCase(forgetPasswordSendEmail.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })
            .addCase(forgetPasswordSendCode.pending, (state, action)=>{
                state.loading = true;
                state.error = false;
            })
            .addCase(forgetPasswordSendCode.fulfilled, (state, action)=>{
                state.loading = false;
                state.error = false;
                state.progress = FORGET_PASSWORD_PROGRESS.REPASS;
                // state.data.code = action.payload;
            })
            .addCase(forgetPasswordSendCode.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })
            .addCase(forgetPasswordSendNewPass.pending, (state, action)=>{
                state.loading = true;
                state.error = false;
            })
            .addCase(forgetPasswordSendNewPass.fulfilled, (state, action)=>{
                state.loading = null;
                state.error = null;
                state.progress = FORGET_PASSWORD_PROGRESS.EMAIL
                state.data.email = null;
                state.data.code = null;
                state.data.newPass = null;
                state.data.reNewPass = null;
            })
            .addCase(forgetPasswordSendNewPass.rejected, (state, action)=>{
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })
    }

})
export const {updateEmailForgotPassword, updateCodeForgotPassword, updateNewPassForgotPassword, updateReNewPassForgotPassword, updateErrorForgotPassword, updateMessageForgotPassword} = ForgetPasswordSlice.actions
export default ForgetPasswordSlice.reducer