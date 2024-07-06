import { useDispatch, useSelector } from "react-redux";
import { Form, Link } from "react-router-dom"
import { forgetPasswordSendEmail, updateEmailForgotPassword, updateErrorForgotPassword, updateMessageForgotPassword } from "../../state/ForgetPasswordSlice";
import Alert from "../../components/Alert";
import { useEffect } from "react";

function ForgetPasswordEmail() {
    const forgetPasswordState = useSelector(state => state.forgetPassword)
    const dispatch = useDispatch();
    const handleEmailInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^a-z0-9.@]/g, '');
        event.target.value = event.target.value.replace(/(^)\./g, '');
        event.target.value = event.target.value.replace(/(\.)\./g, '');
        event.target.value = event.target.value.replace(/\s/g, '');
        dispatch(updateEmailForgotPassword(event.target.value))
    }

    const handleEmailSubmit = (event) => {
        event.preventDefault();
        const emailRegex = /^[a-z0-9]+@gmail\.com$/;
        const emailValid = emailRegex.test(forgetPasswordState.data.email)
        if (!emailValid) {
            dispatch(updateErrorForgotPassword(!emailValid ? true : false))
            dispatch(updateMessageForgotPassword("Email Tidak Valid"))
            return
        }
        const prepData = {
            email: forgetPasswordState.data.email
        }
        dispatch(forgetPasswordSendEmail(prepData))
    }

    return (
        <Form onSubmit={handleEmailSubmit} className="card-body items-center">
            <h2 className="text-[2em] font-semibold text-center text-[#4AAE64]">Lupa Kata Sandi</h2>
            <p>Masukkan email terdaftar untuk menerima kode</p>
            {
                forgetPasswordState.error && (
                    <div role="alert" className="alert alert-warning transition-all ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>{forgetPasswordState.message}</span>
                    </div>
                )
            }
            <label className="input w-full max-w-96 flex items-center gap-2 rounded-full input-bordered">
                <input onChange={handleEmailInputChange} type="email" className="w-full" placeholder="Masukkan Email" required />
                <span className="material-symbols-outlined">
                    person
                </span>
            </label>

            <Link to="/login" className="text-center text-sm hover:text-[#4AAE64] underline">Ingat Kata Sandi?</Link>
            <div className="card-actions justify-center w-full p-4">
                <button type="submit" className="btn rounded-full w-full max-w-80 bg-[#4AAE64] text-white hover:text-black" disabled={forgetPasswordState.loading}>
                    <span className={forgetPasswordState.loading ? "loading loading-spinner" : ""}></span>
                    KIRIM EMAIL
                </button>
            </div>
        </Form >
    )
}

export default ForgetPasswordEmail