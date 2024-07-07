import { useDispatch, useSelector } from "react-redux"
import { Form } from "react-router-dom"
import { gasRetur, gasStok, historyStok, updateCountReturMoney, updateCountReturNew,  updateNikRetur} from "../../../../state/StokSlice";

function ModalReturStok() {
    const stokState = useSelector(state => state.stok)
    const userState = useSelector(state => state.user)
    const dispatch = useDispatch();

    const handleCountReturNewInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        dispatch(updateCountReturNew(event.target.value))
    }

    const handleCountReturMoneyInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        dispatch(updateCountReturMoney(event.target.value))
    }

    const handleCountReturNikInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        dispatch(updateNikRetur(event.target.value))
    }

    const handleSubmitRetur = (event) => {
        event.preventDefault();

        const prepData = {
            token: userState.data.token,
            nik: stokState.dataRetur.nik,
            countReturNew: stokState.dataRetur.countReturNew,
            countReturMoney: stokState.dataRetur.countReturMoney,
        }

        dispatch(gasRetur(prepData)).then(result => {
            if (!result.error) {
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
                dispatch(historyStok(prepData))
                
            } 
        })
    }
    return (
        <dialog id="stok_retur_modal" className="modal">
            <div className="modal-box">
                {stokState.successRetur===true ? (
                    <div className="grid justify-items-center py-14">
                        <span className="material-symbols-outlined w-48 h-48 bg-[#4AAE64] text-9xl rounded-full flex justify-center items-center text-white">
                            check
                        </span>
                        <h2 className="font-bold text-2xl px-16 mt-12 text-center">Berhasil Retur</h2>
                    </div>
                ) : (
                    <>
                        <h3 className="font-bold text-lg">Retur</h3>
                        {stokState.successRetur=== false ? (
                            <div role="alert" className="alert alert-warning mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>

                                <span>{stokState.messageRetur?.split(". ")[0]}</span>
                            </div>
                        ) : ""}
                        <Form className="grid gap-5" onSubmit={handleSubmitRetur}>
                            <div className="grid items-center md:grid-cols-2">
                                <h2 className="font-medium">NIK</h2>
                                <label className="input truncate border-none flex place-self-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                                    <input defaultValue={stokState.dataRetur.nik} onChange={handleCountReturNikInputChange} type="text" className="input border-none rounded-none w-full text-center" placeholder="NIK" required />
                                </label>
                            </div>
                            <div className="grid items-center md:grid-cols-2">
                                <h2 className="font-medium">Jumlah Retur Baru</h2>
                                <label className="input truncate border-none flex place-self-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                                    <input defaultValue={stokState.dataRetur.countReturNew} onChange={handleCountReturNewInputChange} type="text" className="input border-none rounded-none w-full text-center" placeholder="Jumlah Retur"/>
                                </label>
                            </div>
                            <div className="grid items-center md:grid-cols-2">
                                <h2 className="font-medium">Jumlah Retur Uang</h2>
                                <label className="input truncate border-none flex place-self-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                                    <input defaultValue={stokState.dataRetur.countReturMoney} onChange={handleCountReturMoneyInputChange} type="text" className="input border-none rounded-none w-full text-center" placeholder="Jumlah Retur"/>
                                </label>
                            </div>
                            <div className="modal-action">

                                
                                <button className="btn" type="button" onClick={() => document.getElementById("stok_retur_modal").close()}>Batal</button>
                                <button type="submit" className="btn bg-[#4AAE64] text-white hover:text-black">Retur</button>
                            </div>
                        </Form>


                    </>
                )}

            </div>
        </dialog>
    )
}

export default ModalReturStok