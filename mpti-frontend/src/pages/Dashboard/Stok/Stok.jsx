import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Form, Link, useLocation, useNavigate } from "react-router-dom"
import { gasStok, updateInputDateStok, updateSuccessGetdataStok, updateSuccessPriceChangeStok, updateSuccessRetur, updateSuccessStok } from "../../../state/StokSlice";
import ModalAddStock from "./components/ModalAddStock";
import TableStokHistory from "./components/TableHistoryStok";
import ModalPriceStok from "./components/ModalPriceStok";
import ModalReturStok from "./components/ModalReturStok";
import axios from "axios";

function Stok() {
    const stokState = useSelector(state => state.stok)
    const userState = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const prepData = {
            token: userState.data.token
        }
        dispatch(gasStok(prepData))
    }, [])

    useEffect(() => {
        document.title = "Pangkalan LPG Egi Rahayu - Atur Stok"

        fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
            .then(response => response.json())
            .then(data => {
                const tanggal = new Date(data.datetime.slice(0, 16))

                dispatch(updateInputDateStok(data.datetime.slice(0, 16)))
            })

        setInterval(() => {
            fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
                .then(response => response.json())
                .then(data => {
                    const tanggal = new Date(data.datetime.slice(0, 16))

                    dispatch(updateInputDateStok(data.datetime.slice(0, 16)))
                })

        }, 60000)
    }, [])
    useEffect(() => {
        console.log("ini berubah pas modal")
        const timer = setTimeout(() => {
            if (stokState.success) {
                
                document.getElementById('stok_add_modal').close()
                document.getElementById('stok_price_modal').close()
            }
            dispatch(updateSuccessStok(null))

        }, 3000)
        return () => clearTimeout(timer)
    }, [stokState.success])
    

    useEffect(() => {
        console.log("ini berubah pas modal")
        const timer = setTimeout(() => {
            if (stokState.successPriceChange) {
                document.getElementById('stok_price_modal').close()
            }
            dispatch(updateSuccessPriceChangeStok(null))
        }, 3000)
        return () => clearTimeout(timer)
    }, [stokState.successPriceChange])

    useEffect(() => {
        console.log("ini berubah pas modal")
        const timer = setTimeout(() => {
            if (stokState.successRetur) {
                document.getElementById('stok_retur_modal').close()
            }
            dispatch(updateSuccessRetur(null))
        }, 3000)
        return () => clearTimeout(timer)
    }, [stokState.successRetur])

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(updateSuccessGetdataStok(null))
        }, 5000)
        return () => clearTimeout(timer)
    }, [stokState.successGetData])
    return (
        <>
            <div className="w-full py-2">
                <div className="py-4 flex justify-between">
                    <p className="card-title">Detail</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => document.getElementById('stok_add_modal').showModal()} className="btn bg-[#4AAE64] text-white hover:text-black">
                            <span className="material-symbols-outlined">
                                add
                            </span>
                            Tambah
                        </button>
                        <button onClick={() => document.getElementById('stok_retur_modal').showModal()} className="btn bg-[#4AAE64] text-white hover:text-black">Retur</button>
                    </div>
                </div>

                <div className="flex gap-6 flex-col md:flex-row">

                    <div className="card max-w-5xl w-full bg-base-100 shadow-sm rounded-md overflow-x-auto">
                        <div className="card-body justify-between">
                            <div className="flex justify-between items-center">
                                <div className="flex justify-between items-center gap-5">
                                    <span className="material-symbols-outlined text-4xl min-w-14 w-14 h-14 flex justify-center items-center text-white bg-[#4AAE64] rounded-md">
                                        deployed_code
                                    </span>
                                    <p className="font-semibold">Total Stok</p>
                                </div>
                                <h2 className="text-[3em] px-4">{stokState.dataStok.stok}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card max-w-5xl w-full bg-base-100 shadow-sm rounded-md overflow-x-auto">
                        <div className="card-body justify-between">
                            <div className="flex justify-between items-center">
                                <div className="flex justify-between items-center gap-5">
                                    <span className="material-symbols-outlined text-4xl w-14 h-14 flex justify-center items-center text-white bg-[#4AAE64] rounded-md">
                                        check_box
                                    </span>
                                    <p className="font-semibold">Terjual</p>
                                </div>
                                <h2 className="text-[3em] px-4">{stokState.dataStok.countSold}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card max-w-5xl w-full bg-base-100 shadow-sm rounded-md overflow-x-auto">
                        <div className="card-body justify-between">
                            <div className="flex justify-between items-center">
                                <div className="flex justify-between items-center gap-5">
                                    <span className="material-symbols-outlined text-4xl w-14 h-14 flex justify-center items-center text-white bg-[#4AAE64] rounded-md">
                                        disabled_by_default
                                    </span>
                                    <p className="font-semibold">Retur</p>
                                </div>
                                <h2 className="text-[3em] px-4">{stokState.dataStok.countRetur}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-4">
                    <div className="flex justify-between items-center py-2">
                        <p className="card-title">Harga Produk</p>
                        <button className="btn bg-[#4AAE64] text-white hover:text-black" onClick={() => document.getElementById('stok_price_modal').showModal()}>
                            <span className="material-symbols-outlined">
                                edit
                            </span>
                            Ubah Harga
                        </button>
                    </div>
                    <div className="flex gap-6 flex-col md:flex-row">

                        <div className="card max-w-5xl w-full bg-base-100 shadow-sm rounded-md overflow-x-auto">
                            <p className="py-1.5 px-3 bg-[#f9fafb]">Harga Beli</p>
                            <div className="card-body text-center items-center">
                                <h2 className="text-[2em]">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.priceBuy)}</h2>
                            </div>
                        </div>
                        <div className="card max-w-5xl w-full bg-base-100 shadow-sm rounded-md overflow-x-auto">
                            <p className="py-1.5 px-3 bg-[#f9fafb]">Harga Jual</p>
                            <div className="card-body text-center items-center">
                                <h2 className="text-[2em]">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.priceSell)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-4">
                    <p className="card-title">Riwayat Stok</p>
                    <TableStokHistory />
                </div>

                <ModalAddStock />
                <ModalPriceStok />
                <ModalReturStok />
            </div>
            {
                stokState.successGetData === false &&
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
                        <span>Tidak ada riwayat restok</span>
                    </div>
                </div>
            }
            {
                stokState.successGetData === true &&
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
                        <span>Sukses mengambil riwayat restok</span>
                    </div>
                </div>
            }
        </>
    )
}

export default Stok