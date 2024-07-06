import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI
})

export const customerCheckNik = createAsyncThunk(
    "customer/nik",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            nik: data.nik
        })
        try {
            const response = await axiosInstance.post("/customer/nik", prepData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.token
                },
            });

            const result = await response.data;

            return result;
        } catch (error) {
            if (error.response) {
                const message = error.response.data.errors;
                return thunkAPI.rejectWithValue(message)
            } else {
                return thunkAPI.rejectWithValue("Network error")
            }
        }

    }
)

export const customerRegister = createAsyncThunk(
    "customer/register",
    async (data, thunkAPI) => {
        const prepData = {
            nik: data.nik,
            name: data.name,
            address: data.address,
            type: data.type == "RUMAH_TANGGA" ? 1 : data.type == "USAHA" ? 2 : "invalid",
            ktp: data.ktp,
        }
        try {
            const response = await axiosInstance.postForm("/customer", prepData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': data.token
                },
            });

            const result = await response.data;

            return result;
        } catch (error) {
            if (error.response) {
                const message = error.response.data.errors;
                return thunkAPI.rejectWithValue(message)
            } else {
                return thunkAPI.rejectWithValue("Network error")
            }
        }

    }
)

export const transactionCustomer = createAsyncThunk(
    "transaction",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            nik: data.nik,
            inputDate: data.inputDate,
            countBuy: data.countBuy
        })
        try {
            const response = await axiosInstance.post("/transaction", prepData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.token
                },
            });

            const result = await response.data;

            return result;
        } catch (error) {
            if (error.response) {
                const message = error.response.data.errors;
                return thunkAPI.rejectWithValue(message)
            } else {
                return thunkAPI.rejectWithValue("Network error")
            }
        }
    }
)

const CustomerSlice = createSlice({
    name: "customer",
    initialState: {
        loading: null,
        error: null,
        message: null,
        success: null,
        successRegister: null,
        data: {
            nik: null,
            name: null,
            address: null,
            type: 'RUMAH_TANGGA',
            ktp: {
                ktpSource: null,
                ktpName: null
            },
            inputDate: null,
        },
        transactionData: {
            countBuy: 1
        },
        transactionDataDone: {}
    },
    reducers: {
        updateSuccessCustomer: (state, action) => {
            state.success = action.payload;
        },
        updateSuccessRegisterCustomer: (state, action) => {
            state.successRegister = action.payload;
        },
        updateCountBuyCustomer: (state, action) => {
            state.transactionData.countBuy = action.payload;
        },
        updateNikCustomer: (state, action) => {
            state.data.nik = action.payload;
        },
        updateInputDateCustomer: (state, action) => {
            state.data.inputDate = action.payload;
        },
        updateErrorCustomer: (state, action) => {
            state.error = action.payload
        },
        updateMessageCustomer: (state, action) => {
            state.message = action.payload
        },
        updateNameCustomer: (state, action) => {
            state.data.name = action.payload
        },
        updateAddressCustomer: (state, action) => {
            state.data.address = action.payload
        },
        updateTypeCustomer: (state, action) => {
            state.data.type = action.payload
        },
        updateKtpCustomer: (state, action) => {
            state.data.ktp.ktpSource = action.payload.ktpSource
            state.data.ktp.ktpName = action.payload.ktpName
        }
    },
    extraReducers: builder => {
        builder
            .addCase(customerCheckNik.pending, (state, action) => {
                state.loading = true
                state.error = false
            })
            .addCase(customerCheckNik.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.success = true

                state.data.nik = action.payload.data.nik
                state.data.name = action.payload.data.nama
                state.data.type = action.payload.data.tipe
            })
            .addCase(customerCheckNik.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload
            })
            .addCase(transactionCustomer.pending, (state, action) => {
                state.loading = true
                state.error = false
            })
            .addCase(transactionCustomer.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.success = true
                state.message = "Berhasil menambah transaksi"
                state.transactionDataDone = action.payload.data
                state.data.nik = null
                state.data.name = null
                state.data.address = null
                state.data.type = 'RUMAH_TANGGA'
            })
            .addCase(transactionCustomer.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.success = false
                state.message = action.payload
            })
            .addCase(customerRegister.pending, (state, action) => {
                state.loading = true
                state.error = false
            })
            .addCase(customerRegister.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.message = action.payload
                state.successRegister = true
                // state.data.nik = null
                // state.data.name = null
                // state.data.address = null
                // state.data.type = 'Rumah Tangga'
            })
            .addCase(customerRegister.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.message = action.payload
                state.successRegister = false
            })
    }
})

export const { updateSuccessRegisterCustomer, updateSuccessCustomer, updateCountBuyCustomer, updateNikCustomer, updateKtpCustomer, updateNameCustomer, updateAddressCustomer, updateInputDateCustomer, updateErrorCustomer, updateMessageCustomer, updateTypeCustomer } = CustomerSlice.actions
export default CustomerSlice.reducer