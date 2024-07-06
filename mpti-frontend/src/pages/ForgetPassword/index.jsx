import { useSelector } from "react-redux"
import { Form, Link, redirect } from "react-router-dom"
import { FORGET_PASSWORD_PROGRESS } from "../../state/ForgetPasswordSlice";
import ForgetPasswordEmail from "./ForgetPasswordEmail";
import ForgetPasswordCode from "./ForgetPasswordCode";
import ForgetPasswordNewPass from "./ForgetPasswordNewPass";
import Pertamina from "../../assets/Pertamina.svg"
import { useEffect } from "react";
import ModalForgetPasswordChange from "./components/ModalForgetPasswordChange";

export async function actionForgetPassword() {
    const user = JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"));

    try {
        const response = await axios.get(import.meta.env.VITE_APP_API_URI, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": user?.token
            }
        })
        const result = await response.data;
        return redirect("/");
    } catch (error) {
        return null;
    }
}

function ForgetPassword() {
    const forgetPasswordState = useSelector(state => state.forgetPassword.progress);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (forgetPasswordState.error) {
                dispatch(updateErrorForgotPassword(false))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [forgetPasswordState.error == true])
    return (
        <>
            <div className="bg-gradient-to-45">
                <section className="flex min-h-screen justify-center items-center flex-col p-3">
                    <img src={Pertamina} className="fixed w-52 -top-5 left-3" alt="" />

                    <div className="card w-full max-w-lg bg-base-100 shadow-xl">
                        {forgetPasswordState.progress === FORGET_PASSWORD_PROGRESS.EMAIL && <ForgetPasswordEmail />}
                        {forgetPasswordState.progress === FORGET_PASSWORD_PROGRESS.CODE && <ForgetPasswordCode />}
                        {forgetPasswordState.progress === FORGET_PASSWORD_PROGRESS.REPASS && <ForgetPasswordNewPass />}

                    </div>

                </section>
            </div>
            <ModalForgetPasswordChange/>
        </>
    )
}

export default ForgetPassword