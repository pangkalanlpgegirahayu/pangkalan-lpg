import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI
})

export const addStok = createAsyncThunk(
    "gas/add",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            inputDate: data.inputDate,
            countStok: data.countStok,
            information: data.information
        })

        try {
            const response = await axiosInstance.post("/gas/add", prepData, {
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

export const updatePriceStok = createAsyncThunk(
    "gas/update",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            inputDate: data.inputDate,
            priceBuy: data.priceBuy,
            priceSell: data.priceSell
        })
        try {
            const response = await axiosInstance.post("/gas/update", prepData, {
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

export const historyStok = createAsyncThunk(
    "gas/history",
    async (data, thunkAPI) => {

        try {
            const response = await axiosInstance.get("/gas/send", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.token
                },
                params: {
                    page: data.currentPage,
                    size: 5,
                    startDate: data.startDate == '' ? null : data.startDate,
                    endDate: data.endDate == '' ? null : data.endDate
                }
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

export const downloadHistoryStok = createAsyncThunk(
    "gas/all-history",
    async (data, thunkAPI) => {

        try {
            const response = await axiosInstance.get("/gas/send/download", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.token
                },
                params: {
                    startDate: data.startDate == '' ? null : data.startDate,
                    endDate: data.endDate == '' ? null : data.endDate
                }
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

export const gasStok = createAsyncThunk(
    "gas/stok",
    async (data, thunkAPI) => {

        try {
            const response = await axiosInstance.get("/gas/stok", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.token
                }
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

export const gasDelete = createAsyncThunk(
    "gas/delete",
    async (data, thunkAPI) => {

        try {
            const response = await axiosInstance.delete(`/gas/stok/${data.stokId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.token
                }
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

export const gasRetur = createAsyncThunk(
    "gas/retur",
    async (data, thunkAPI) => {
        const prepData = JSON.stringify({
            nik: data.nik,
            countReturNew: data.countReturNew,
            countReturMoney: data.countReturMoney,
        })

        try {
            const response = await axiosInstance.post("/gas/retur", prepData, {
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

const StokSlice = createSlice({
    name: "gas",
    initialState: {
        loading: null,
        error: null,
        message: null,
        success: null,
        data: {
            inputDate: null,
            countStok: 100,
            information: null,
            priceBuy: null,
            priceSell: null
        },
        dataStok: {
            countTotalStok: 0,
            stok: 0,
            countSold: 0,
            countRetur: 0,
            dirtyRevenue: null,
            priceBuy: null,
            priceSell: null,
        },
        historyData: {
            startDate: '',
            endDate: '',
            currentPage: 1,
            list: [],
            paging: {}
        },
        dataRetur: {
            nik: null,
            countReturNew: 0,
            countReturMoney: 0,
        },
        dataPrint: []
    },
    reducers: {
        updateNikRetur: (state, action) => {
            state.dataRetur.nik = action.payload;
        },
        updateCountReturNew: (state, action) => {
            state.dataRetur.countReturNew = action.payload;
        },
        updateCountReturMoney: (state, action) => {
            state.dataRetur.countReturMoney = action.payload;
        },
        updateInputDateStok: (state, action) => {
            state.data.inputDate = action.payload;
        },
        updateCountStok: (state, action) => {
            state.data.countStok = action.payload;
        },
        updateInformationStok: (state, action) => {
            state.data.information = action.payload;
        },
        updateErrorStok: (state, action) => {
            state.error = action.payload;
        },
        updateMessageStok: (state, action) => {
            state.message = action.payload;
        },
        updateCurrentPageStok: (state, action) => {
            state.historyData.currentPage = action.payload;
        },
        updateStartDateStok: (state, action) => {
            state.historyData.startDate = action.payload;
        },
        updateEndDateStok: (state, action) => {

            state.historyData.endDate = action.payload;


        },
        updateSuccessStok: (state, action) => {
            state.success = action.payload;
        },
        updatePriceBuyStok: (state, action) => {
            state.data.priceBuy = action.payload;
        }
        ,
        updatePriceSellStok: (state, action) => {
            state.data.priceSell = action.payload;
        }

    },
    extraReducers: builder =>
        builder.addCase(addStok.pending, (state, action) => {
            state.loading = true;
            state.error = false;
        }).
            addCase(addStok.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.success = true;
                state.message = action.payload;
            }).addCase(addStok.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            }).addCase(historyStok.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            }).
            addCase(historyStok.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.historyData.list = action.payload.data;
                state.historyData.paging = action.payload.paging;
            }).addCase(historyStok.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
                state.historyData.list = [];
                state.historyData.paging = {};
            }).addCase(downloadHistoryStok.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.success = true;
                state.message = "Berhasil unduh";
                state.dataPrint = action.payload.data;
            }).addCase(gasStok.fulfilled, (state, action) => {
                state.dataStok.stok = action.payload.data.stok;
                state.dataStok.countTotalStok = action.payload.data.totalStok;
                state.dataStok.dirtyRevenue = action.payload.data.totalKeuntungan;
                state.dataStok.countRetur = action.payload.data.retur;
                state.dataStok.countSold = action.payload.data.sold ?? 0;
                state.dataStok.priceBuy = action.payload.data.hargaBeli;
                state.data.priceBuy = action.payload.data.hargaBeli;
                state.dataStok.priceSell = action.payload.data.hargaJual;
                state.data.priceSell = action.payload.data.hargaJual;
            }).addCase(gasStok.rejected, (state, action) => {
                state.dataStok.stok = 0;
                state.dataStok.countTotalStok = 0;
                state.dataStok.dirtyRevenue = 0;
                state.dataStok.priceBuy = 0;
                state.data.priceBuy = 0;
                state.dataStok.priceSale = 0;
                state.data.priceSale = 0;
                state.loading = false;
                state.success = false;
                state.error = true;
                state.message = action.payload;
            }).addCase(updatePriceStok.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            }).addCase(updatePriceStok.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.success = true;
                state.message = action.payload.data;
            }).addCase(updatePriceStok.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                // state.success = false;
                state.message = action.payload
            })
            .addCase(gasDelete.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                // state.success = false;

            })
            .addCase(gasDelete.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                // state.success = false;
                state.message = action.payload
            })
            .addCase(gasDelete.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                // state.success = false;
                state.message = action.payload
            })
            .addCase(gasRetur.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(gasRetur.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.dataStok.countRetur = action.payload.data.countRetur;
                state.dataStok.stok = action.payload.data.stok;
                state.dataStok.countSell = action.payload.data.countSell;
            })
            .addCase(gasRetur.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
            })

})

export const { updateNikRetur, updateCountReturMoney, updateCountReturNew, updatePriceBuyStok, updatePriceSellStok, updateSuccessStok, updateInputDateStok, updateCountStok, updateInformationStok, updateErrorStok, updateMessageStok, updateCurrentPageStok, updateStartDateStok, updateEndDateStok } = StokSlice.actions
export default StokSlice.reducer