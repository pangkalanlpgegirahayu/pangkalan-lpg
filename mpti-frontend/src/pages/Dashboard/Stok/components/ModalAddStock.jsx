import { useDispatch, useSelector } from "react-redux"
import { Form, useNavigate } from "react-router-dom"
import { addStok, gasStok, historyStok, updateErrorStok, updateInformationStok, updateInputDateStok, updateMessageStok, updateSuccessStok } from "../../../../state/StokSlice";
import { useEffect } from "react";

function ModalAddStock() {
    const stokState = useSelector(state => state.stok);
    const userState = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleDateTimeInputChange = (event) => {
        dispatch(updateInputDateStok(event.target.value))
    }
    const handleCountStokInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        event.target.value = event.target.value.replace(/^(0)/g, '');
        
        dispatch(updateCountStok(event.target.value))
    }
    const handleInformationInputChange = (event) => {
        dispatch(updateInformationStok(event.target.value))
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
                // dispatch(updateSuccessStok(true));
                dispatch(updateMessageStok("Berhasil menambah stok"))
                let prepData = {
                    token: userState.data.token
                }
                dispatch(gasStok(prepData))
                prepData = {
                    token: userState.data.token,
                    currentPage: stokState.historyData?.currentPage,
                    startDate: stokState.historyData?.startDate,
                    endDate: stokState.historyData?.endDate
                }
                dispatch(historyStok(prepData)).then(result=>{
                    console.log("this execute or nah")
                })
                
            } else {
                
                dispatch(updateSuccessStok(false));
                document.getElementById('stok_add_modal').close()
                
            }
        })

    }

    return (
        <>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="stok_add_modal" className="modal">
                <div className="modal-box">
                    {stokState.success ? (
                        <div className="grid justify-items-center py-14">
                            <span className="material-symbols-outlined w-48 h-48 bg-[#4AAE64] text-9xl rounded-full flex justify-center items-center text-white">
                                check
                            </span>
                            <h2 className="font-bold text-2xl px-16 mt-12 text-center">Stok Berhasil Ditambahkan</h2>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-bold text-lg mb-4">Restok</h3>
                            <Form className="grid gap-5" onSubmit={handleSubmitNewStok}>
                                <div className="grid items-center md:grid-cols-2">
                                    <h2 className="font-medium">Tanggal</h2>
                                    <input defaultValue={stokState.data.inputDate} onChange={handleDateTimeInputChange} type="datetime-local" className="input input-bordered" required />
                                </div>
                                <div className="grid items-center md:grid-cols-2">
                                    <h2 className="font-medium">Jumlah</h2>
                                    <label className="input truncate border-none flex place-self-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                                        <input defaultValue={stokState.data.countStok} onChange={handleCountStokInputChange} type="text" className="input border-none rounded-none w-full text-center" placeholder="Stok" required />
                                    </label>
                                </div>
                                <div className="grid md:grid-cols-2">
                                    <h2 className="font-medium">Keterangan</h2>
                                    <textarea defaultValue={stokState.data?.information} onChange={handleInformationInputChange} className="textarea textarea-bordered" placeholder="Informasi"></textarea>

                                </div>
                                <div className="modal-action">
                                    
                                    <button className="btn" type="button" onClick={() => document.getElementById('stok_add_modal').close()}>Batal</button>
                                    
                                    <button className="btn bg-[#4AAE64] text-white hover:text-black" disabled={stokState.loading}>{stokState.loading ? <span className="loading loading-spinner"></span> : ""}Restok</button>
                                </div>
                            </Form>
                        </>
                    )}

                </div>
            </dialog>
        </>
    )
}

export default ModalAddStock