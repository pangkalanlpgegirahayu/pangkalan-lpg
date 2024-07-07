import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI
})

export const getSales = createAsyncThunk(
    "sales",
    async (data, thunkAPI) => {

        try {
            const response = await axiosInstance.get("/gas/sales", {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': data.token
                },
                params: {
                    page: data.currentPage,
                    size: 5,
                    startDate: data.startDate == '' ? null : data.startDate,
                    endDate: data.endDate == '' ? null : data.endDate
                }
            })

            const result = await response.data

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

export const getAllHistorySales = createAsyncThunk(
    "sales/download",
    async (data, thunkAPI) => {

        try {
            const response = await axiosInstance.get("/gas/sales/download", {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': data.token
                },
                params: {
                    startDate: data.startDate == '' ? null : data.startDate,
                    endDate: data.endDate == '' ? null : data.endDate
                }
            })

            const result = await response.data

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

const SalesSlice = createSlice({
    name: "sales",
    initialState: {
        loading: null,
        error: null,
        message: null,
        successGetData: null,
        data: {
            modal: null,
            countSold: null,
            revenue: null,
            salesList: null
        },
        historyData: {
            startDate: '',
            endDate: '',
            currentPage: 1,
            list: [],
            paging: {}
        },
        dataPrint: []
    },
    reducers: {
        updateStartDateSales: (state, action) => {
            state.historyData.startDate = action.payload;
        },
        updateEndDateSales: (state, action) => {
            state.historyData.endDate = action.payload;
        },
        updateErrorSales: (state, action) => {
            state.error = action.payload;
        },
        updateMessageSales: (state, action) => {
            state.message = action.payload;
        },
        updateCurrentPageSales: (state, action) => {
            state.historyData.currentPage = action.payload;
        },
        updatesuccessGetDataSales: (state, action) => {
            state.successGetData = action.payload;
        }
    },
    extraReducers: builder =>
        builder
            .addCase(getSales.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getSales.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                // state.successGetData = true;
                state.historyData.list = action.payload.data;
                state.historyData.paging = action.payload.paging;
                state.data.countSold = action.payload.dataSold.countSold;
                state.data.revenue = action.payload.dataSold.revenue;
                state.data.modal = action.payload.dataSold.modal;
            })
            .addCase(getSales.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                // state.successGetData = false;
                state.data.revenue = 0;
                state.data.countSold = 0;
                state.data.modal = 0;
                state.message = action.payload;
            })
            .addCase(getAllHistorySales.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllHistorySales.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.successGetData = true;
                // state.historyData.list = action.payload.data;
                // state.historyData.paging = action.payload.paging;
                state.dataPrint = action.payload.data
                state.data.countSold = action.payload.dataSold.countSold;
                state.data.revenue = action.payload.dataSold.revenue;
            })
            .addCase(getAllHistorySales.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.successGetData = false;
                state.data.revenue = 0;
                state.data.countSold = 0;
                state.message = action.payload;
            })
})


export const { updatesuccessGetDataSales, updateErrorSales, updateCurrentPageSales, updateEndDateSales, updateStartDateSales, updateMessageSales } = SalesSlice.actions
export default SalesSlice.reducer