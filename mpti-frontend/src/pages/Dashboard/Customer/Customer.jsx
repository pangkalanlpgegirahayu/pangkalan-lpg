import { useDispatch, useSelector } from "react-redux";
import { Form, Link, useNavigate } from "react-router-dom"
import { customerCheckNik, updateErrorCustomer, updateMessageCustomer, updateNikCustomer } from "../../../state/CustomerSlice";
import { useEffect } from "react";
import axios from "axios";

function Customer() {
    const userState = useSelector(state => state.user);
    const customerState = useSelector(state => state.customer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleNikInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        dispatch(updateNikCustomer(event.target.value))
    }

    useEffect(()=>{
        document.title = "Pangkalan LPG Egi Rahayu - Cek NIK"
        
    }, [])

    const handleNikSubmit = (event) => {
        event.preventDefault();

        if ([...customerState.data.nik].length != 16) {
            dispatch(updateErrorCustomer(true));
            dispatch(updateMessageCustomer("Panjang NIK Tidak Sesuai"));
            return
        }

        const prepData = {
            nik: customerState.data.nik,
            token: userState.data.token
        }

        dispatch(customerCheckNik(prepData)).then(result => {

            if (!result.error) {
                navigate("/pelanggan/transaksi")
            }

            if(result.payload === "Unauthorized"){
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
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


    return (
        <>
            <h2 className="text-2xl mt-5 font-semibold truncate">NIK KTP Pelanggan</h2>
            <p>Cek NIK untuk melakukan transaksi</p>
            <div className="w-full py-5 flex flex-col gap-10">

                <div className="card max-w-5xl bg-base-100 shadow-sm rounded-md overflow-x-auto">
                    <div className="card-body">
                        <h2 className="text-lg font-medium">Masukkan 16 Digit NIK pelanggan</h2>
                        <Form onSubmit={handleNikSubmit}>

                            {
                                customerState.error && (
                                    <div role="alert" className="alert alert-warning transition-all ease-in">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>{customerState.message}</span>
                                    </div>
                                )
                            }
                            <label className="input input-bordered  my-3 truncate flex items-center gap-2">
                                <input defaultValue={customerState.data.nik} onChange={handleNikInputChange} type="text" className="w-full placeholder:text-[#4AAE64]" placeholder="16 digit NIK" required />
                            </label>
                            <div className="card-actions justify-end">
                                <button type="submit" className="btn px-11 bg-[#4AAE64] text-white hover:text-black">Cek</button>
                            </div>
                        </Form>
                    </div>
                </div>

                <div className="card max-w-5xl bg-[#acd2b4] shadow-sm rounded-md overflow-x-auto">
                    <div className="card-body text-center">
                        <h2 className="card-title justify-center">Pelanggan Belum Terdaftar?</h2>
                        <p>Daftarkan pelanggan rumah tangga atau usaha mikro agar dapat melakukan transaksi LPG 3 Kg</p>
                        <div className="card-actions justify-center mt-4">
                            <Link to="/pelanggan/daftar" className="btn border-none bg-[#4AAE64] text-white hover:text-black">
                                Daftarkan Pelanggan Baru
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Customer