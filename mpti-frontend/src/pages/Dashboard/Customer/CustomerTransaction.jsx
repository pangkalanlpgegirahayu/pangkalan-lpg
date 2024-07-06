import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Link, useNavigate } from "react-router-dom"
import { customerCheckNik, transactionCustomer, updateCountBuyCustomer, updateInputDateCustomer, updateSuccessCustomer } from "../../../state/CustomerSlice";
import { gasStok } from "../../../state/StokSlice";
import ModalTransactionCustomer from "./Components/ModalTransactionCustomer";
import axios from "axios";

function CustomerTransaction() {
    const userState = useSelector(state => state.user);
    const stokState = useSelector(state => state.stok);
    const customerState = useSelector(state => state.customer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (customerState.data.nik == null || !customerState.success) {
            
            return navigate("/pelanggan")
        }

        let prepData = {
            token: userState.data.token
        }
        dispatch(gasStok(prepData))

        prepData = {
            nik: customerState.data.nik,
            token: userState.data.token,
        }
        dispatch(customerCheckNik(prepData)).then(result=>{
            if(result.error){
                return navigate("/pelanggan")
            }
        })

        fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
            .then(response => response.json())
            .then(data => {
                dispatch(updateInputDateCustomer(data.datetime.slice(0, 16)))
                
            })
            
        setInterval(() => {
            fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
                .then(response => response.json())
                .then(data => {
                    dispatch(updateInputDateCustomer(data.datetime.slice(0, 16)))
                    
                })
                
        }, 60000)
    }, [])

    const handleCountBuyInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        event.target.value = event.target.value.replace(/^0/g, '');
        dispatch(updateCountBuyCustomer(event.target.value))
    }

    const handleSubmitTransaction = (event) => {
        event.preventDefault();
        const prepData = {
            token: userState.data.token,
            nik: customerState.data.nik,
            countBuy: customerState.transactionData.countBuy,
            inputDate: customerState.data.inputDate
        }
        dispatch(transactionCustomer(prepData)).then(result=>{
            document.getElementById('customer_transaction_modal').showModal()
        })
    }
    return (
        <>
            <div className="w-full py-2">
                <div className="flex justify-start">
                    <Link to="/pelanggan" className="btn btn-ghost w-fit lg:hidden">
                        <span className="material-symbols-outlined">
                            arrow_back_ios
                        </span>
                    </Link>
                    <div>
                        <h1 className="text-[2em]">Transaksi</h1>
                        <p className="text-[1.2em]">Pembelian Gas LPG 3Kg</p>
                    </div>
                </div>

                <Form className="grid gap-3" onSubmit={handleSubmitTransaction}>
                    <div className="card max-w-5xl bg-base-100 shadow-sm rounded-md overflow-x-auto">
                        <div className="card-body ">
                            <h2 className="card-title">Tanggal</h2>
                            <input defaultValue={customerState.data.inputDate} readOnly type="datetime-local" className="input" />
                        </div>
                    </div>
                    {customerState.data.type == 'USAHA' && (
                        <div className="card max-w-5xl bg-base-100 shadow-sm rounded-md overflow-x-auto">
                            <div className="card-body ">
                                <h2 className="card-title">Jumlah Pembelian</h2>
                                <input defaultValue={customerState.transactionData.countBuy} onChange={handleCountBuyInputChange} type="text" className="input input-bordered" />
                            </div>
                        </div>
                    )}


                    <div className="card max-w-5xl bg-base-100 shadow-sm rounded-md overflow-x-auto">
                        <div className="card-body">
                            <h2 className="card-title">Informasi Pembelian</h2>
                            <div >
                                <div className="grid grid-cols-2">
                                    <p>NIK</p>
                                    <p className="truncate">{customerState.data.nik}</p>
                                </div>
                                <hr className="my-2 border border-blue-gray-50" />
                                <div className="grid grid-cols-2">
                                    <p>Nama</p>
                                    <p>{customerState.data.name}</p>
                                </div>
                                <hr className="my-2 border border-blue-gray-50" />
                                <div className="grid grid-cols-2">
                                    <p>Jenis Subsidi</p>
                                    <p>{customerState.data.type=="RUMAH_TANGGA"?"Rumah Tangga": "Usaha"}</p>
                                </div>
                                <hr className="my-2 border border-blue-gray-50" />

                            </div>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th>Item</th>
                                            <th>Jumlah</th>
                                            <th>Satuan</th>
                                            <th>Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>LPG 3Kg</td>
                                            <td>{customerState.transactionData.countBuy}</td>
                                            <td>{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.priceSell)}</td>
                                            <td>{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.priceSell * customerState.transactionData.countBuy)}</td>
                                        </tr>
                                        <tr className="bg-base-300">
                                            <th colSpan={3}>Total</th>
                                            <td className="text-[1.2em]">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.priceSell * customerState.transactionData.countBuy)}</td>
                                        </tr>

                                    </tbody>

                                </table>
                            </div>

                        </div>
                    </div>

                    <button className="btn place-self-center my-3 bg-[#4AAE64] text-white hover:text-black" disabled={customerState.loading}>{customerState.loading?<span className="loading loading-spinner"></span>:""}Melakukan Pembelian</button>
                </Form>
            </div>
            <ModalTransactionCustomer/>
        </>
    )
}

export default CustomerTransaction