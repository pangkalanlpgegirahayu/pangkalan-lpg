import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Link, useNavigate } from "react-router-dom"
import { gasStok, updateErrorStok, updateInputDateStok, updatePriceBuyStok, updatePriceSellStok, updatePriceStok } from "../../../state/StokSlice";

function StokPrice() {
    const stokState = useSelector(state => state.stok);
    const userState = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const handleDateTimeInputChange = (event) => {

        dispatch(updateInputDateStok(event.target.value))
    }

    const handlePriceBuyInputChange = (event) => {
        event.target.value = event.target.value.replace(/^0/g, "")
        event.target.value = event.target.value.replace(/[a-zA-Z]/g, "")
        var value = event.target.value.replace(/\./g, '');


        dispatch(updatePriceBuyStok(Number(value)))
       

        
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        event.target.value = value;

    }

    const handlePriceSellInputChange = (event) => {
        event.target.value = event.target.value.replace(/^0/g, "")
        event.target.value = event.target.value.replace(/[a-zA-Z]/g, "")
        let value = event.target.value.replace(/\./g, '');

        dispatch(updatePriceSellStok(Number(value)))

        
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        event.target.value = value;



    }

    useEffect(() => {

        const prepData = {
            token: userState.data.token
        }

        dispatch(gasStok(prepData))


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

    const handleSubmitUpdatePrice = (event) => {
        event.preventDefault();

        const prepData = {
            token: userState.data.token,
            inputDate: stokState.data.inputDate,
            priceSell: stokState.dataStok.priceSell,
            priceBuy: stokState.dataStok.priceBuy
        }
        dispatch(updatePriceStok(prepData)).then(result => {
            if (!result.error) return navigate("/stok")
        })
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
                    <h1 className="text-[2em]">Atur Harga</h1>
                    <p className="text-[1.2em]">Mengubah harga saat ini dengan harga baru</p>
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
            <Form className="grid gap-3" onSubmit={handleSubmitUpdatePrice}>
                <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body ">
                        <h2 className="card-title">Tanggal</h2>
                        <input defaultValue={stokState.data.inputDate} onChange={handleDateTimeInputChange} required disabled type="datetime-local" className="input input-bordered" />
                    </div>
                </div>
                <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body">
                        <h2 className="card-title">Harga Jual</h2>
                        
                        <label className="input truncate border-none flex items-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                            <span>Rp</span>
                            <input defaultValue={stokState.dataStok.priceSell} onChange={handlePriceSellInputChange} type="text" className="w-full" placeholder="" required />
                        </label>

                    </div>
                </div>
                <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body">
                        <h2 className="card-title">Harga Beli</h2>
                        
                        <label className="input truncate border-none flex items-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                            <span>Rp</span>
                            <input defaultValue={stokState.dataStok.priceBuy} onChange={handlePriceBuyInputChange} type="text" className="w-full" placeholder="" required />
                        </label>

                    </div>
                </div>
                <button className="btn w-full rounded-full" disabled={stokState.loading}>Perbarui Harga</button>
            </Form>
        </div>
    )
}

export default StokPrice