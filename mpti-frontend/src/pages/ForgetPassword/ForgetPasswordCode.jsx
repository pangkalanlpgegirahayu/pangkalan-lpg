import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Link } from 'react-router-dom'
import { forgetPasswordSendCode, updateCodeForgotPassword, updateErrorForgotPassword, updateMessageForgotPassword } from '../../state/ForgetPasswordSlice';

function ForgetPasswordCode() {
    const forgetPasswordState = useSelector(state=>state.forgetPassword);
    const dispatch = useDispatch();

    const handleCodeInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        dispatch(updateCodeForgotPassword(event.target.value))
    }

    const handleSubmitCode = (event) => {
        event.preventDefault();
        
        if([...forgetPasswordState.data.code].length < 6){
            dispatch(updateErrorForgotPassword(true))
            dispatch(updateMessageForgotPassword("Kode tidak sesuai"))
            return
        }

        const prepData = {
            email: forgetPasswordState.data.email,
            code: forgetPasswordState.data.code
        }

        dispatch(forgetPasswordSendCode(prepData))
    }
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (forgetPasswordState.error) {
    //             dispatch(updateErrorForgotPassword(false))
    //         }
    //     }, 5000)
    //     return () => clearTimeout(timer)
    // }, [forgetPasswordState.error])
    return (
        <Form onSubmit={handleSubmitCode} className="card-body items-center">
            <h2 className="text-[2em] font-semibold text-center text-[#4AAE64]">INPUT KODE</h2>
            <p>Masukkan Kode yang dikirim melalui email</p>
            {
                forgetPasswordState.error && (
                    <div role="alert" className="alert alert-warning transition-all ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>{forgetPasswordState.message}</span>
                    </div>
                )
            }
            <label className="input border-none w-full max-w-60 flex items-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
                <input type="text" maxLength={6} size={6} minLength={6} onChange={handleCodeInputChange} value={forgetPasswordState.code} className="w-full text-center" placeholder="Masukkan 6 Digit Kode" required/>
            </label>
            <div className="card-actions justify-center w-full p-4">
            <button type="submit" className="btn rounded-full w-full max-w-80 bg-[#4AAE64] text-white hover:text-black" disabled={forgetPasswordState.loading}>
                    <span className={forgetPasswordState.loading ? "loading loading-spinner" : ""}></span>
                    KIRIM KODE
                </button>
            </div>
        </Form>
    )
}

export default ForgetPasswordCode