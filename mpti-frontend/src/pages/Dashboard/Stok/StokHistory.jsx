import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Link, useNavigate } from "react-router-dom"
import { downloadHistoryStok, historyStok, updateCurrentPageStok, updateEndDateStok, updateErrorStok, updateStartDateStok, updateSuccessStok } from "../../../state/StokSlice";
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


function StokHistory() {
    const stokState = useSelector(state => state.stok);
    const userState = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleStartDateInputChange = (event) => {
        dispatch(updateStartDateStok(event.target.value))
        
    }

    const handleEndDateInputChange = (event) => {
        dispatch(updateEndDateStok(event.target.value))
        
    }

    const handleSubmitSearchHistory = (event) => {
        event.preventDefault();
        const dataPrep = {
            token: userState.data.token,
            currentPage: stokState.historyData?.currentPage,
            startDate: stokState.historyData?.startDate,
            endDate: stokState.historyData?.endDate
        }
        
        dispatch(historyStok(dataPrep))
    }

    const handleHistoryNextPage = (event) => {
        dispatch(updateCurrentPageStok(stokState.historyData.currentPage + 1))
        const dataPrep = {
            token: userState.data.token,
            currentPage: stokState.historyData.paging?.next,
            startDate: stokState.historyData?.startDate,
            endDate: stokState.historyData?.endDate
        }
        dispatch(historyStok(dataPrep))
    }

    const handleHistoryPrevPage = (event) => {
        dispatch(updateCurrentPageStok(stokState.historyData.currentPage - 1))
        const dataPrep = {
            token: userState.data.token,
            currentPage: stokState.historyData.paging?.prev,
            startDate: stokState.historyData?.startDate,
            endDate: stokState.historyData?.endDate
        }
        dispatch(historyStok(dataPrep))
    }
    

    useEffect(() => {
        const dataPrep = {
            token: userState.data.token,
            currentPage: stokState.historyData?.currentPage,
            startDate: stokState.historyData?.startDate,
            endDate: stokState.historyData?.endDate
        }
        dispatch(historyStok(dataPrep))
        
    }, [])

    const handleDonwloadHistory = (event) => {
        const dataPrep = {
            token: userState.data.token,
            startDate: stokState.historyData.startDate,
            endDate: stokState.historyData.endDate
        }
        
        dispatch(downloadHistoryStok(dataPrep)).then(result => {
            if (!result.error) {
                excelExport(result.payload)
            }
        })
        dispatch(historyStok(dataPrep))
    }

    const handleDeleteStok = (id) => {
        const dataPrep = {
            token: userState.data.token,
            stokId: id
        }
        
    }

    const excelExport = (result) => {
        
        const fileName = 'restok';
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const Heading = [
            ['No', 'Penginput', 'Jenis Gas', 'Jumlah', 'Tanggal', 'Informasi']
        ];
        const ws = XLSX.utils.json_to_sheet(result.data.map((data, index)=>[index+1, data.nama_penginput, data.nama_gas, data.jumlah, data.tanggal, data.informasi]), { origin: 'A2'});
        XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A1' });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const filedata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(filedata, fileName + fileExtension);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            if (stokState.error) {
                dispatch(updateErrorStok(false))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [stokState.error])

    return (
        <div className="w-full py-2">
            <div className="flex justify-start">
                <Link to="/stok" className="btn btn-ghost w-fit lg:hidden">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                </Link>
                <div>
                    <h1 className="text-[2em]">Riwayat Stok</h1>
                    <p className="text-[1.2em]">Riwayat Perubahan Stok LPG 3Kg</p>
                </div>
            </div>
            {
                stokState.error && (
                    <div role="alert" className="alert alert-error transition-all ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{stokState.message}</span>
                    </div>
                )
            }
            <div className="grid gap-3">
                <div className="card bg-base-100 shadow-xl overflow-x-auto max-w-5xl ">
                    <Form className="card-body gap-4 flex-col" onSubmit={handleSubmitSearchHistory}>

                        <div className="flex md:flex-row flex-col gap-4">
                            <div className="w-full">
                                <h2 className="card-title">Dari Tanggal</h2>
                                <input defaultValue={stokState.historyData?.startDate} onChange={handleStartDateInputChange} type="datetime-local" className="input input-bordered w-full" />
                            </div>
                            <div className="w-full">
                                <h2 className="card-title">Sampai Tanggal</h2>
                                <input defaultValue={stokState.historyData?.endDate} onChange={handleEndDateInputChange} type="datetime-local" className="input input-bordered w-full" />
                            </div>
                        </div>
                        <button type="submit" className="btn w-full" disabled={stokState?.loading}>
                            {stokState.loading &&
                                <span className="loading loading-spinner"></span>
                            }
                            Cari
                        </button>

                    </Form>
                </div>
                <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body">
                        <div className="flex gap-4 justify-between flex-col sm:flex-row">
                            <h2 className="card-title">Riwayat</h2>
                            <button className="btn" onClick={handleDonwloadHistory}>
                                <span className="material-symbols-outlined">
                                    download
                                </span>
                                Unduh
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>No.</th>
                                        <th>Tanggal</th>
                                        <th>Jumlah</th>
                                        <th>Keterangan</th>
                                        <th>Penginput</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody className={stokState.loading ? "skeleton" : ""}>

                                    {
                                        stokState.error ? (
                                            <tr><td colSpan={6} className="text-center">{stokState.message}</td></tr>
                                        ) : (
                                            stokState.historyData.list?.map((data, index) => {
                                                const dataIndex = (5 * stokState.historyData.currentPage - ((5 - index - 1)))
                                                return (
                                                    <tr key={index}>
                                                        <td>{dataIndex}</td>
                                                        <td>{data.tanggal}</td>
                                                        <td>{data.jumlah}</td>
                                                        <td>{data.informasi}</td>
                                                        <td>{data.nama_penginput}</td>
                                                        <td>
                                                            <button onClick={()=>handleDeleteStok(data.id)} className="btn btn-ghost btn-circle">
                                                                <span className="material-symbols-outlined">
                                                                    delete
                                                                </span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }





                                </tbody>

                            </table>
                        </div>
                        <div className="card-actions justify-center">
                            <div className="join">
                                {
                                    stokState.historyData.paging?.prev &&
                                    <button className="join-item btn" onClick={handleHistoryPrevPage}>«</button>
                                }

                                <button className="join-item btn">{stokState.historyData.currentPage}</button>

                                {
                                    stokState.historyData.paging?.next &&
                                    <button className="join-item btn" onClick={handleHistoryNextPage}>»</button>
                                }

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default StokHistory