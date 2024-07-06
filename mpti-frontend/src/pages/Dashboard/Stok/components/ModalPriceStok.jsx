import { useDispatch, useSelector } from "react-redux"
import { gasStok, updateErrorStok, updateInputDateStok, updatePriceBuyStok, updatePriceSellStok, updatePriceStok } from "../../../../state/StokSlice";
import { Form, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ModalPriceStok() {
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
        let value = event.target.value.replace(/\./g, '');


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

    const handleSubmitUpdatePrice = (event) => {
        event.preventDefault();

        const prepData = {
            token: userState.data.token,
            inputDate: stokState.data.inputDate,
            priceSell: stokState.data.priceSell,
            priceBuy: stokState.data.priceBuy
        }
        dispatch(updatePriceStok(prepData)).then(result => {
            if (!result.error) {
                const prepData = {
                    token: userState.data.token
                }
                dispatch(gasStok(prepData))
                
            }
        })
    }

    return (
        <dialog id="stok_price_modal" className="modal">
            <div className="modal-box">
                {stokState.success ? (
                    <div className="grid justify-items-center py-14">
                        <span className="material-symbols-outlined w-48 h-48 bg-[#4AAE64] text-9xl rounded-full flex justify-center items-center text-white">
                            check
                        </span>
                        <h2 className="font-bold text-2xl px-16 mt-12 text-center">Harga Berhasil Diubah</h2>
                    </div>
                ) : (
                    <>
                        <h3 className="font-bold text-lg mb-4">Ubah Harga</h3>
                        <Form className="grid gap-5" onSubmit={handleSubmitUpdatePrice}>
                            <div className="grid items-center md:grid-cols-2">
                                <h2 className="font-medium">Tanggal</h2>
                                <input defaultValue={stokState.data.inputDate} onChange={handleDateTimeInputChange} type="datetime-local" className="input input-bordered" required />
                            </div>
                            <div className="grid items-center md:grid-cols-2">
                                <h2 className="font-medium">Harga Beli</h2>
                                <label className="input truncate border-none flex items-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                                    <span>Rp</span>
                                    <input defaultValue={stokState.dataStok.priceBuy} onChange={handlePriceBuyInputChange} type="text" className="w-full" placeholder="" required />
                                </label>
                            </div>
                            <div className="grid items-center md:grid-cols-2">
                                <h2 className="font-medium">Harga Jual</h2>
                                <label className="input truncate border-none flex items-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                                    <span>Rp</span>
                                    <input defaultValue={stokState.dataStok.priceSell} onChange={handlePriceSellInputChange} type="text" className="w-full" placeholder="" required />
                                </label>
                            </div>
                            <div className="modal-action">
                                <button className="btn" type="button" onClick={() => document.getElementById('stok_price_modal').close()}>Batal</button>
                                
                                <button className="btn bg-[#4AAE64] text-white hover:text-black">Ubah Harga</button>
                            </div>
                        </Form>
                    </>
                )}

            </div>
        </dialog>
    )
}

export default ModalPriceStok