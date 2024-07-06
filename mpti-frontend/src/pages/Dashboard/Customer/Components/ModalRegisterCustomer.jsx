import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ModalRegisterCustomer() {
    const customerState = useSelector(state => state.customer);
    return (
        <dialog id="customer_register_modal" className="modal">
            <div className="modal-box">
                {!customerState.success ? (
                    <>
                        <div className="grid justify-items-center py-14">
                            <span className="material-symbols-outlined w-48 h-48 bg-[#4AAE64] text-9xl rounded-full flex justify-center items-center text-white">
                                check
                            </span>
                            <h2 className="font-bold text-2xl px-16 mt-12 text-center">Registrasi Pelanggan Berhasil</h2>
                        </div>
                        
                        <div className="modal-action">
                            <Link to={"/pelanggan"} className="btn">Kembali</Link>
                            <Link to={"/pelanggan/transaksi"} className="btn bg-[#4AAE64]">Lanjutkan Pembelian</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid justify-items-center py-14">
                            <span className="material-symbols-outlined w-48 h-48 bg-error text-9xl rounded-full flex justify-center items-center text-white">
                                close
                            </span>
                            <h2 className="font-bold text-2xl px-16 mt-12 text-center">Registrasi Pelanggan Gagal</h2>
                            <p className="px-16 text-center pt-3">{customerState.message}</p>
                        </div>
                        <div className="modal-action">

                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn" type="button" onClick={() => document.getElementById("customer_register_modal").close()}>Tutup</button>
                            
                        </div>
                    </>
                )}
            </div>
        </dialog>
    )
}

export default ModalRegisterCustomer