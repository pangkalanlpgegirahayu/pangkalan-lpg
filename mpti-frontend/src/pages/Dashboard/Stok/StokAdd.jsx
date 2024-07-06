import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Link, useNavigate } from "react-router-dom"
import { addStok, updateCountStok, updateErrorStok, updateInformationStok, updateInputDateStok, updateMessageStok, updateSuccessStok } from "../../../state/StokSlice";

function StokAdd() {
    const userState = useSelector(state => state.user);
    const stokState = useSelector(state => state.stok);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDateTimeInputChange = (event) => {
        dispatch(updateInputDateStok(event.target.value))
    }

    const handleInformationInputChange = (event) => {
        dispatch(updateInformationStok(event.target.value))
    }

    const handleCountStokInputChange = (event) => {
        dispatch(updateCountStok(event.target.value))
    }

    const handleSubmitNewStok = (event) => {
        event.preventDefault();

        if (stokState.data.countStok == 0 || stokState.data.inputDate == "") {
            dispatch(updateErrorStok(true))
            dispatch(updateMessageStok("Data tidak boleh kosong"));
            return
        }

        const prepData = {
            token: userState.data.token,
            inputDate: stokState.data.inputDate,
            countStok: stokState.data.countStok,
            information: stokState.data.information
        }

        dispatch(addStok(prepData)).then(result => {
            if (!result.error) {
                dispatch(updateSuccessStok(true));
                dispatch(updateMessageStok("Berhasil menambah stok"))
                navigate("/stok/riwayat");
            } else {
                
                dispatch(updateSuccessStok(false));
                
            }
        })

    }


    useEffect(() => {
        
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
                    <h1 className="text-[2em]">ReStok</h1>
                    <p className="text-[1.2em]">Melengkapi Stok saat ini dengan stok baru</p>
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
            <Form onSubmit={handleSubmitNewStok} className="grid gap-3">
                <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body ">
                        <h2 className="card-title">Pilih Tanggal</h2>
                        <input defaultValue={stokState.data.inputDate} onChange={handleDateTimeInputChange} type="datetime-local" className="input input-bordered" required />
                    </div>
                </div>
                <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body justify-between md:flex-row">
                        <h2 className="card-title">Jumlah stok yang ditambahkan</h2>
                        
                        <label className="input truncate border-none flex place-self-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                            <input defaultValue={stokState.data.countStok} onChange={handleCountStokInputChange} type="number" className="w-full text-center" placeholder="Stok" required />
                        </label>

                    </div>
                </div>
                <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                    <div className="card-body">
                        <h2 className="card-title">Keterangan</h2>
                        
                        <textarea defaultValue={stokState.data?.information} onChange={handleInformationInputChange} className="textarea textarea-bordered" placeholder="Informasi"></textarea>

                    </div>
                </div>
                <button type="submit" className="btn w-full rounded-full">Perbarui Stok</button>
            </Form>
        </div>
    )
}

export default StokAdd