import { useSelector } from "react-redux"
import { Link } from "react-router-dom";

function ModalTransactionCustomer() {
    const customerState = useSelector(state => state.customer);
    const stokState = useSelector(state => state.stok);

    return (
        <dialog id="customer_transaction_modal" className="modal">
            <div className="modal-box">
                {customerState.successTransaction ? (
                    <>
                        <div className="grid justify-items-center py-14">
                            <span className="material-symbols-outlined w-48 h-48 bg-[#4AAE64] text-9xl rounded-full flex justify-center items-center text-white">
                                check
                            </span>
                            <h2 className="font-bold text-2xl px-16 mt-12 text-center">Transaksi berhasil</h2>
                        </div>
                        <div className="card max-w-5xl bg-base-100 shadow-xl overflow-x-auto">
                            <div className="card-body">
                                <h2 className="card-title">Informasi Pembelian</h2>
                                <div >
                                    <div className="grid grid-cols-2">
                                        <p>NIK</p>
                                        <p className="truncate">{customerState.transactionDataDone?.nik}</p>
                                    </div>
                                    <hr className="my-2 border border-blue-gray-50" />
                                    <div className="grid grid-cols-2">
                                        <p>Nama</p>
                                        <p>{customerState.transactionDataDone?.nama}</p>
                                    </div>
                                    <hr className="my-2 border border-blue-gray-50" />
                                    <div className="grid grid-cols-2">
                                        <p>Jenis Subsidi</p>
                                        <p>{customerState.transactionDataDone?.tipe=="RUMAH_TANGGA"?"Rumah Tangga": "Usaha"}</p>
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
                        <div className="modal-action">
                            <Link to={"/penjualan"} className="btn">Kembali</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid justify-items-center py-14">
                            <span className="material-symbols-outlined w-48 h-48 bg-error text-9xl rounded-full flex justify-center items-center text-white">
                                close
                            </span>
                            <h2 className="font-bold text-2xl px-16 mt-12 text-center">Transaksi gagal </h2>
                            <p className="px-16 text-center">{customerState.messageTransaction?.split(". ")[0]}</p>
                        </div>
                        <div className="modal-action">

                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn" type="button" onClick={() => document.getElementById("customer_transaction_modal").close()}>Close</button>
                            {/* <button className="btn bg-[#4AAE64] text-white hover:text-black">Retur</button> */}
                        </div>
                    </>
                )}

            </div>
        </dialog>
    )
}

export default ModalTransactionCustomer