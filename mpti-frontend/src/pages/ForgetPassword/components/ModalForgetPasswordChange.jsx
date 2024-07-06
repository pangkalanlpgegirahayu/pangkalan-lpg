
function ModalForgetPasswordChange() {
    return (
        <dialog id="forgetPassword_success_modal" className="modal">
            <div className="modal-box">
                <div className="grid justify-items-center py-14">
                    <span className="material-symbols-outlined w-48 h-48 bg-[#4AAE64] text-9xl rounded-full flex justify-center items-center text-white">
                        check
                    </span>
                    <h2 className="font-bold text-2xl px-16 mt-12 text-center">Kata Sandi Berhasil diubah</h2>
                </div>
            </div>
        </dialog>
    )
}

export default ModalForgetPasswordChange