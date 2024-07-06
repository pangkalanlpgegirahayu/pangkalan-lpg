import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Form, Link, useLocation, useNavigate } from "react-router-dom"
import { gasStok, updateInputDateStok, updateSuccessStok } from "../../../state/StokSlice";
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
        
        const timer = setTimeout(() => {
            if (stokState.success) {
                dispatch(updateSuccessStok(false))
                document.getElementById('stok_add_modal').close()
                document.getElementById('stok_price_modal').close()
            }

        }, 3000)
        return () => clearTimeout(timer)
    }, [stokState.success])
    return (
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
            <Form className="grid gap-3">

                {/* <Link to="/stok/tambah" className="btn justify-between px-8 py-6 h-auto max-w-5xl bg-base-100 shadow-xl">
                    <div className="justify-between sm:flex-row sm:items-center">
                        <div>
                            <h2 className="card-title">ReStok</h2>
                            <p className="font-normal">Melengkapi Stok saat ini</p>
                        </div>

                    </div>
                    <span className="material-symbols-outlined">
                        arrow_forward_ios
                    </span>
                </Link>
                <Link to="/stok/riwayat" className="btn justify-between px-8 py-6 h-auto max-w-5xl bg-base-100 shadow-xl" disabled={stokState.loading}>
                    <h2 className="card-title">Riwayat Stok</h2>

                    <span className="material-symbols-outlined">
                        arrow_forward_ios
                    </span>
                </Link> */}
                {/* <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body">
                        <h2 className="card-title">Atur Harga Produk</h2>
                        <div className="flex justify-between items-center flex-col sm:flex-row">
                            <h4 className="font-medium">Harga Beli (Harga per Tabung)</h4>
                            <h4 className="font-semibold place-self-center pt-3 sm:pt-0">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.priceBuy)}</h4>
                        </div>
                        <hr className="my-1 border border-blue-gray-50" />
                        <div className="flex justify-between items-center flex-col sm:flex-row">
                            <h4 className="font-medium">Harga Jual (Harga per Tabung)</h4>
                            <h4 className="font-semibold place-self-center pt-3 sm:pt-0">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.priceSell)}</h4>
                        </div>
                        <hr className="my-1 border border-blue-gray-50" />
                        <Link to="/stok/harga" className="btn w-full rounded-full">Atur Harga Beli dan Jual</Link>
                       

                    </div>
                </div> */}

            </Form>
            <ModalAddStock />
            <ModalPriceStok />
            <ModalReturStok />
        </div>
    )
}

export default Stok