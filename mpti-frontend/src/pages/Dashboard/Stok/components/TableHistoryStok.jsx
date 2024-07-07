import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Link, useNavigate } from "react-router-dom"
import { downloadHistoryStok, historyStok, updateCurrentPageStok, updateEndDateStok, updateErrorStok, updateStartDateStok, updateSuccessStok } from "../../../../state/StokSlice";
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


function TableHistoryStok() {
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
        fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
            .then(response => response.json())
            .then(data => {

                dispatch(updateStartDateStok(data.datetime.slice(0, 11) + "00:00"))
                dispatch(updateEndDateStok(data.datetime.slice(0, 11) + "23:59"))
                const dataPrep = {
                    token: userState.data.token,
                    currentPage: stokState.historyData?.currentPage,
                    startDate: data.datetime.slice(0, 11) + "00:00",
                    endDate: data.datetime.slice(0, 11) + "23:59"
                }
                dispatch(historyStok(dataPrep))
            })
            .catch(error => {

            });
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
        const fileName = 'apidata';
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const Heading = [
            ['No', 'Penginput', 'Jenis Gas', 'Jumlah', 'Sisa', 'Tanggal', 'Informasi']
        ];
        const ws = XLSX.utils.json_to_sheet(result.data.map((data, index) => [index + 1, data.nama_penginput, data.nama_gas, data.jumlah, data.sisa, data.tanggal, data.informasi]), { origin: 'A2' });
        XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A2' });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const filedata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(filedata, fileName + fileExtension);
    }
    return (
        <div className="w-full py-2">
            <div className="grid gap-3">
                <div className="card bg-base-100 shadow-sm rounded-md overflow-x-auto max-w-5xl ">
                    <Form className="card-body gap-4 flex-col" onSubmit={handleSubmitSearchHistory}>

                        <div className="flex md:flex-row flex-col gap-4">
                            <div className="w-full">

                                <input defaultValue={stokState.historyData?.startDate} onChange={handleStartDateInputChange} type="datetime-local" className="input input-bordered w-full" />
                            </div>
                            <h2 className="card-title justify-center">Sampai</h2>
                            <div className="w-full">

                                <input defaultValue={stokState.historyData?.endDate} onChange={handleEndDateInputChange} type="datetime-local" className="input input-bordered w-full" />
                            </div>
                        </div>
                        <button type="submit" className="btn w-full bg-[#4AAE64] text-white hover:text-black" disabled={stokState?.loading}>
                            {stokState.loading &&
                                <span className="loading loading-spinner"></span>
                            }
                            Cari
                        </button>

                    </Form>
                </div>
                <div className="card max-w-5xl bg-base-100 shadow-sm rounded-md overflow-x-auto">
                    <div className="card-body">
                        <div className="flex gap-4 justify-between flex-col sm:flex-row">
                            <h2 className="card-title">Riwayat</h2>
                            <button className="btn bg-[#4AAE64] text-white hover:text-black" onClick={handleDonwloadHistory}>
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
                                        <th>Sisa</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className={stokState.loading ? "skeleton" : ""}>

                                    {
                                        stokState.historyData.list?.length == 0 ? (
                                            <tr><td colSpan={6} className="text-center">Tidak ada data</td></tr>
                                        ) : (
                                            stokState.historyData.list?.map((data, index) => {
                                                const dataIndex = (5 * stokState.historyData.paging.page - ((5 - index - 1)))
                                                return (
                                                    <tr key={index}>
                                                        <td>{dataIndex}</td>
                                                        <td>{data.tanggal}</td>
                                                        <td>{data.jumlah}</td>
                                                        <td>{data.sisa}</td>
                                                        <td>{data.informasi}</td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        {stokState.historyData.list?.length != 0 &&
                            <div className="card-actions justify-center">
                                <div className="join">
                                    {
                                        stokState.historyData.paging?.prev &&
                                        <button className="join-item btn" onClick={handleHistoryPrevPage}>«</button>
                                    }

                                    <button className="join-item btn">{stokState.historyData.paging.page}</button>

                                    {
                                        stokState.historyData.paging?.next &&
                                        <button className="join-item btn" onClick={handleHistoryNextPage}>»</button>
                                    }

                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableHistoryStok