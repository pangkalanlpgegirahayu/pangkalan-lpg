import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Link, useNavigate } from "react-router-dom"
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { getAllHistorySales, getSales, updateCurrentPageSales, updateEndDateSales, updateStartDateSales, updatesuccessGetDataSales } from "../../../state/SalesSlice";
import axios from "axios";
import { updateSuccessLogoutUser } from "../../../state/UserSlice";
import LineChartSales from "./Components/LineChartSales";

function Sales() {
    const salesState = useSelector(state => state.sales);
    const userState = useSelector(state => state.user);
    const stokState = useSelector(state => state.stok);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleStartDateInputChange = (event) => {
        dispatch(updateStartDateSales(event.target.value == "" ? undefined : event.target.value))

    }

    const handleEndDateInputChange = (event) => {
        dispatch(updateEndDateSales(event.target.value == "" ? undefined : event.target.value))
    }

    const handleSubmitSearchHistory = (event) => {
        event.preventDefault();
        const dataPrep = {
            token: userState.data.token,
            currentPage: salesState.historyData?.currentPage,
            startDate: salesState.historyData?.startDate,
            endDate: salesState.historyData?.endDate
        }

        dispatch(getSales(dataPrep)).then(result=>{
            if(result.payload === "Unauthorized"){
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
        })
        dispatch(getAllHistorySales(dataPrep)).then(result => {

            if(result.payload === "Unauthorized"){
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
        })
    }

    const handleHistoryNextPage = (event) => {
        dispatch(updateCurrentPageSales(salesState.historyData.currentPage + 1))
        const dataPrep = {
            token: userState.data.token,
            currentPage: salesState.historyData.paging?.next,
            startDate: salesState.historyData?.startDate,
            endDate: salesState.historyData?.endDate
        }
        dispatch(getSales(dataPrep)).then(result=>{
            if(result.payload === "Unauthorized"){
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
        })
    }

    const handleHistoryPrevPage = (event) => {
        dispatch(updateCurrentPageSales(salesState.historyData.currentPage - 1))
        const dataPrep = {
            token: userState.data.token,
            currentPage: salesState.historyData.paging?.prev,
            startDate: salesState.historyData?.startDate,
            endDate: salesState.historyData?.endDate
        }
        dispatch(getSales(dataPrep)).then(result=>{
            if(result.payload === "Unauthorized"){
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
        })
    }

    useEffect(() => {
        document.title = "Pangkalan LPG Egi Rahayu - Laporan Penjualan"

        fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
            .then(response => response.json())
            .then(data => {

                dispatch(updateStartDateSales(data.datetime.slice(0, 11) + "00:00"))
                dispatch(updateEndDateSales(data.datetime.slice(0, 11) + "23:59"))
                const dataPrep = {
                    token: userState.data.token,
                    currentPage: 1,
                    startDate: data.datetime.slice(0, 11) + "00:00",
                    endDate: data.datetime.slice(0, 11) + "23:59"
                }
                dispatch(getSales(dataPrep)).then(result => {
                    if (!result.error) {
                        dispatch(updatesuccessGetDataSales(true));
                    } else {
                        dispatch(updatesuccessGetDataSales(false))
                    }

                    if(result.payload === "Unauthorized"){
                        dispatch(updateSuccessLogoutUser(true))
                        navigate("/login")
                    }
                })
                dispatch(getAllHistorySales(dataPrep)).then(result => {

                    if(result.payload === "Unauthorized"){
                        dispatch(updateSuccessLogoutUser(true))
                        navigate("/login")
                    }
                    console.log(result.payload)
                })
            })
            .catch(error => {

            });



    }, [])

    const handleDonwloadHistory = (event) => {
        const dataPrep = {
            token: userState.data.token,
            startDate: salesState.historyData.startDate,
            endDate: salesState.historyData.endDate
        }

        dispatch(getAllHistorySales(dataPrep)).then(result => {

            if (!result.error) {
                excelExport(result.payload)
            }

            if(result.payload === "Unauthorized"){
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
        })
        dispatch(getSales(dataPrep)).then(result=>{
            if(result.payload === "Unauthorized"){
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
        })
    }

    const excelExport = (result) => {
        const fileName = `penjualan${salesState.historyData.startDate}-${salesState.historyData.endDate}`;
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";

        const Heading = [
            [`Total Terjual : `, result.dataSold.countSold],
            [`Total Keuntungan : `, result.dataSold.revenue],
            ['No', 'Nama', 'Nomor Restok', 'Tanggal', 'Jumlah', 'Harga Satuan', 'Total', 'Penginput']
        ];
        const ws = XLSX.utils.json_to_sheet(result.data.map((data, index) => [index + 1, data.nama_pembeli, data.id_pengiriman, data.tanggal, data.jumlah, data.hargaSatuan, data.totalBayar, data.nama_penginput]), { origin: 'A3' });
        XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A1' });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const filedata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(filedata, fileName + fileExtension);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(updatesuccessGetDataSales(null))
        }, 5000)
        return () => clearTimeout(timer)
    }, [salesState.successGetData])

    return (
        <>
            <div className="w-full pt-2 pb-7">

                <div className="grid gap-3">
                    <div className="card overflow-x-auto max-w-5xl ">
                        <Form className="card-body gap-4 flex-col p-4 mt-4" onSubmit={handleSubmitSearchHistory}>
                            <div className="flex md:flex-row flex-col gap-4">
                                <div className="w-full">

                                    <input defaultValue={salesState.historyData?.startDate} onChange={handleStartDateInputChange} type="datetime-local" className="input input-bordered w-full" />
                                </div>
                                <h2 className="card-title text-center justify-center">Sampai</h2>
                                <div className="w-full">

                                    <input defaultValue={salesState.historyData?.endDate} onChange={handleEndDateInputChange} type="datetime-local" className="input input-bordered w-full" />
                                </div>
                            </div>
                            <button type="submit" className="btn w-full bg-[#4AAE64] text-white hover:text-black" disabled={salesState?.loading}>
                                {salesState?.loading &&
                                    <span className="loading loading-spinner"></span>
                                }
                                Cari
                            </button>
                        </Form>
                    </div>

                    <div className="">
                        <div className="flex justify-between items-center py-2">
                            <p className="card-title">Total Penjualan</p>

                        </div>
                        <div className="flex gap-6 flex-col md:flex-row">

                            <div className="card max-w-5xl rounded-md w-full bg-base-100 shadow-sm overflow-x-auto">

                                <div className="card-body justify-center text-center items-center">
                                    <h2 className="text-[2em] font-medium">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(salesState.data?.revenue)}</h2>

                                </div>
                            </div>
                            <div className="card max-w-5xl rounded-md w-full bg-base-100 shadow-sm overflow-x-auto">
                                <p className="py-1.5 px-3 bg-[#f9fafb]">Total Produk Terjual</p>
                                <div className="card-body text-center items-center">
                                    <h2 className="text-[2em]">{salesState.data?.countSold ?? 0}<span className="pl-2 text-sm">tabung</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex justify-between items-center py-2">
                            <p className="card-title">Keuntungan Penjualan</p>

                        </div>
                        <div className="flex gap-6 flex-col md:flex-row">

                            <div className="card max-w-5xl rounded-md w-full bg-base-100 shadow-sm overflow-x-auto">
                                <p className="py-1.5 px-3 bg-[#f9fafb]">Keuntungan</p>
                                <div className="card-body justify-center text-center items-center">
                                    <h2 className="text-[2em] font-medium">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(salesState.data?.revenue - salesState.data?.modal)}</h2>

                                </div>
                            </div>
                            <div className="card max-w-5xl rounded-md w-full bg-base-100 shadow-sm overflow-x-auto">
                                <p className="py-1.5 px-3 bg-[#f9fafb]">Modal</p>
                                <div className="card-body text-center items-center">
                                    <h2 className="text-[2em] font-medium">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(salesState.data?.modal)}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <LineChartSales print={salesState.dataPrint}/>
                    <div className="card max-w-5xl overflow-x-auto rounded-none">
                        <div className="flex gap-4 py-2 justify-between flex-col sm:flex-row">
                            <h2 className="card-title">Data Penjualan</h2>
                        </div>
                        
                        <div className="card-body bg-base-100 rounded-md shadow-sm">
                            <button className="btn bg-[#4aae64] text-white hover:text-black" onClick={handleDonwloadHistory}>
                                <span className="material-symbols-outlined">
                                    download
                                </span>
                                Unduh
                            </button>
                            <div className=" overflow-x-auto">

                                <table className="table">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th>No.</th>
                                            <th>Nama</th>
                                            <th>Nomor Restok</th>
                                            <th>Tanggal</th>
                                            <th>Jumlah</th>
                                            <th>Harga Satuan</th>
                                            <th>Total</th>

                                        </tr>
                                    </thead>
                                    <tbody className={salesState?.loading ? "skeleton" : ""}>
                                        {
                                            salesState.historyData.list?.length == 0 ? (
                                                <tr><td colSpan={6} className="text-center">Tidak ada data</td></tr>
                                            ) : (
                                                salesState.historyData.list?.map((data, index) => {

                                                    return (
                                                        <tr key={index}>
                                                            <td>{(5 * salesState.historyData.paging.page - ((5 - index - 1)))}</td>
                                                            <td>{data.nama_pembeli}</td>
                                                            <td>{data.id_pengiriman}</td>
                                                            <td>{data.tanggal}</td>
                                                            <td>{data.jumlah}</td>
                                                            <td>{data.hargaSatuan}</td>
                                                            <td>{data.totalBayar}</td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        }

                                    </tbody>

                                </table>
                            </div>
                            {salesState.historyData.list?.length != 0 &&
                                <div className="card-actions justify-center">
                                    <div className="join">
                                        {
                                            salesState.historyData.paging?.prev &&
                                            <button className="join-item btn" onClick={handleHistoryPrevPage}>«</button>
                                        }

                                        <button className="join-item btn">{salesState.historyData.paging.page}</button>

                                        {
                                            salesState.historyData.paging?.next &&
                                            <button className="join-item btn" onClick={handleHistoryNextPage}>»</button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            {
                salesState.successGetData === false &&
                <div className="toast toast-end">
                    <div role="alert" className="alert alert-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Tidak ada riwayat terjual</span>
                    </div>
                </div>
            }
            {
                salesState.successGetData === true &&
                <div className="toast toast-end">
                    <div role="alert" className="alert alert-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Sukses mengambil riwayat penjualan</span>
                    </div>
                </div>
            }
        </>
    )
}

export default Sales