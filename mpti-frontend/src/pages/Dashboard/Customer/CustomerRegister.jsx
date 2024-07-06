import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Form, Link, useNavigate } from 'react-router-dom'
import { customerRegister, updateAddressCustomer, updateErrorCustomer, updateKtpCustomer, updateMessageCustomer, updateNameCustomer, updateNikCustomer, updateTypeCustomer } from '../../../state/CustomerSlice';
import ModalRegisterCustomer from './Components/ModalRegisterCustomer';
import axios from 'axios';

function CustomerRegister() {
    const customerState = useSelector(state => state.customer);
    const userState = useSelector(state => state.user);
    const [sourceKtp, setSourceKtp] = useState();
    const [ktpFile, setKtpFile] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNikInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        dispatch(updateNikCustomer(event.target.value));
    }

    const handleNameInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
        dispatch(updateNameCustomer(event.target.value));
    }

    const handleAddressInputChange = (event) => {
        dispatch(updateAddressCustomer(event.target.value));
    }

    const handleCustomerTypeInputChange = (event) => {
        dispatch(updateTypeCustomer(event.target.value));
    }

    const handleKtpInputChange = (event) => {
        if (event.target.files[0]) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setSourceKtp(reader.result)
                setKtpFile(event.target.files[0])
            });
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const handleRegisterCustomerSubmit = (event) => {
        event.preventDefault();

        if(customerState.data.nik.length != 16){
            document.getElementById('customer_register_modal').showModal()
            dispatch(updateErrorCustomer(true))
            dispatch(updateMessageCustomer("Panjang NIK tidak sesuai"))
            return
        }
        const prepData = {
            token: userState.data.token,
            nik: customerState.data.nik,
            name: customerState.data.name,
            address: customerState.data.address,
            type: customerState.data.type,
            ktp: ktpFile
        }
        

        dispatch(customerRegister(prepData)).then(result=>{
            
            document.getElementById('customer_register_modal').showModal()
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (customerState.error) {
                dispatch(updateErrorCustomer(false))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [customerState.error == true])

    useEffect(()=>{
        axios.get(import.meta.env.VITE_APP_API_URI, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userState.data.token
            }
        }).catch(error=>{
            navigate("/login")
        })
    }, [])

    return (
        <>
            <div className="w-full py-2">
                <div className="flex justify-start py-7">
                    <Link to="/pelanggan" className="btn btn-ghost w-fit lg:hidden">
                        <span className="material-symbols-outlined">
                            arrow_back_ios
                        </span>
                    </Link>
                    <div className="">
                        <h1 className="text-[2em] font-medium">Pendaftaran Pelanggan</h1>
                        <p className="text-[1.2em]">Lengkapi Form Di Bawah ini untuk Melakukan Pendaftaran</p>
                    </div>
                </div>


                <Form className="grid gap-3 card bg-base-100 shadow-sm rounded-md" onSubmit={handleRegisterCustomerSubmit}>
                    <div className="card max-w-5xl overflow-x-auto">
                        <div className="card-body p-5">
                            <h2 className="card-title">NIK</h2>
                            
                            <label className="input truncate bg-white flex items-center gap-2 input-bordered">
                                <input defaultValue={customerState.data.nik} minLength={16} onChange={handleNikInputChange} type="text" className="w-full placeholder:text-[#4AAE64]" placeholder="Masukkan 16 digit NIK KTP Pelanggan" required />
                            </label>
                        </div>
                    </div>
                    <div className="card max-w-5xl overflow-x-auto">
                        <div className="card-body p-5 pt-0">
                            <h2 className="card-title">Nama</h2>
                            
                            <label className="input truncate bg-white flex items-center gap-2 input-bordered">
                                <input defaultValue={customerState.data.name} onChange={handleNameInputChange} type="text" className="w-full placeholder:text-[#4AAE64]" placeholder="Masukkan Nama Pelanggan" required />
                            </label>

                        </div>
                    </div>
                    <div className="card max-w-5xl overflow-x-auto">
                        <div className="card-body p-5 pt-0">
                            <h2 className="card-title">Alamat</h2>
                            
                            <label className="input truncate bg-white flex items-center gap-2 input-bordered">
                                <input defaultValue={customerState.data.address} onChange={handleAddressInputChange} type="text" className="w-full placeholder:text-[#4AAE64]" placeholder="Masukkan Alamat Pelanggan" required />
                            </label>
                        </div>
                    </div>
                    <div className="card max-w-5xl overflow-x-auto">
                        <div className="card-body p-5 pt-0">
                            <h2 className="card-title">Pilih Jenis Penggunaan Subsidi</h2>
                            <div className="form-control">
                                <div className="flex justify-between items-center">
                                    <label className="label cursor-pointer justify-start gap-3">

                                        <input onChange={handleCustomerTypeInputChange} value="RUMAH_TANGGA" type="radio" name="typeCustomer" className="radio" defaultChecked />
                                        <span className="label-text">Rumah Tangga</span>
                                    </label>
                                    <span className="label-text">Maksimum pembelian 1/pengiriman</span>
                                </div>
                            </div>
                            <div className="form-control">
                                <div className="flex justify-between items-center">
                                    <label className="label cursor-pointer justify-start gap-3">

                                        <input onChange={handleCustomerTypeInputChange} value="USAHA" type="radio" name="typeCustomer" className="radio" />
                                        <span className="label-text">Usaha Mikro</span>
                                    </label>
                                    
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="card max-w-5xl overflow-x-auto">
                        <div className="card-body p-5 pt-0">
                            <h2 className="card-title">Upload KTP</h2>
                            <input onChange={handleKtpInputChange} type="file" accept="image/jpeg, image/jpg, image/png" className="file-input file-input-bordered w-full" />
                            <img
                                className="w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
                                src={sourceKtp}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn place-self-center my-3 bg-[#4AAE64] text-white hover:text-black" disabled={customerState.loading}>{customerState.loading ? <span className="loading loading-spinner"></span> : ""}Daftarkan Pelanggan</button>
                </Form>
            </div>
            <ModalRegisterCustomer />
        </>
    )
}

export default CustomerRegister