
function ModalLogout({logoutFunction}) {
    return (
        < dialog id="logout_modal" className="modal" >
            <div className="modal-box">
                <div className="flex gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-info h-6 w-6 shrink-0">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="font-semibold text-lg">Yakin logout?</h3>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Tutup</button>
                    </form>
                    <button className="btn bg-red-500 text-white hover:bg-red-700" onClick={logoutFunction}>Logout</button>
                </div>
            </div>
        </dialog >
    )
}

export default ModalLogout