import Pertamina from "../../assets/Pertamina.svg"
import PertaminaPNG from "../../assets/PertaminaPNG.png"
import { useDispatch, useSelector } from "react-redux"
import { Form, Link, redirect, useNavigate } from "react-router-dom"
import { loginUser, updateErrorUser, updateMessageUser, updatePasswordUser, updateSuccessLogoutUser, updateUsernameUser } from "../../state/UserSlice";
import { useEffect, useRef } from "react";
import axios from "axios";

import EgiRahayu from "../../assets/EgiRahayu.svg"


export async function actionLogin() {
    const user = JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"));
    try {
        const response = await axios.get(import.meta.env.VITE_APP_API_URI, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": user?.token
            }
        })
        const result = await response.data;
        return redirect("/")
    } catch (error) {
        localStorage.removeItem("user")||sessionStorage.removeItem("user")
        return null;
    }
}

function Login() {
    const userState = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const rememberMe = useRef(false);

    const handleUsernameInputChange = (event) => {
        event.target.value = event.target.value.replace(/[^a-z0-9]/g, '');

        dispatch(updateUsernameUser(event.target.value))
    }

    const handlePasswordInputChange = (event) => {
        dispatch(updatePasswordUser(event.target.value))
    }

    const handleLoginSubmit = (event) => {
        event.preventDefault();

        if (userState.login.username === "" || userState.login.password === "") {
            dispatch(updateErrorUser(true));
            dispatch(updateMessageUser("Isian tidak boleh kosong"));
            return false;
        }

        const prepData = {
            username: userState.login.username,
            password: userState.login.password,
            rememberMe: rememberMe.current
        }

        dispatch(loginUser(prepData)).then(result => {
            if (!result.error) {
                navigate("/")
            }
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userState.error) {
                dispatch(updateErrorUser(false))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [userState.error])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userState.successLogout) {
                dispatch(updateSuccessLogoutUser(null))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [userState.successLogout == true])

    useEffect(() => {
        document.title = "Pangkalan LPG Egi Rahayu - Login"
    }, [])

    const handleRememberMeChange = (event) => {
        rememberMe.current = event.target.checked 
    }

    return (
        <>
            <div className="bg-gradient-to-45 from-white to-[#a8f0bb] ">
                <section className="flex min-h-screen justify-center w-full items-center flex-col lg:flex-row ">
                    <div className="flex items-center">
                        <img src={EgiRahayu} className="max-w-96 p-10" alt="" />
                        {/* <div>
                            <h1 className="font-semibold text-3xl">Pangkalan LPG</h1>
                            <h1 className="font-semibold text-3xl">Egi Rahayu</h1>
                        </div> */}
                    </div>

                    <div className="h-[40rem] w-0.5 bg-white rounded-md mx-10 hidden lg:block"></div>
                    <div className="card w-full max-w-lg bg-base-100 shadow-xl">
                        <Form onSubmit={handleLoginSubmit} className="card-body items-center">
                            <h2 className="text-[2em] font-semibold text-center text-[#4AAE64]">Login</h2>
                            {
                                userState.error && (
                                    <div role="alert" className="alert alert-warning transition-all ease-in">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>{userState.message.split(". ")[0]}</span>
                                    </div>
                                )
                            }
                            <p className="w-full text-start max-w-96">Nama Pengguna</p>
                            <label className="input input-bordered flex items-center gap-2 rounded-full w-full max-w-96 overflow-x-auto">
                                <span className="material-symbols-outlined">
                                    person
                                </span>
                                <input onChange={handleUsernameInputChange} type="text" className="grow" placeholder="Username" />
                            </label>
                            <p className="w-full text-start max-w-96 pt-2">Kata Sandi</p>
                            <label className="input input-bordered flex items-center gap-2 rounded-full w-full max-w-96 overflow-x-auto">
                                <span className="material-symbols-outlined">
                                    lock
                                </span>
                                <input onChange={handlePasswordInputChange} type="password" className="grow" placeholder="●●●●●●" />
                            </label>
                            <div className="flex justify-between w-full max-w-96">
                                <div className="form-control">
                                    <label className="label gap-2 cursor-pointer">
                                        <input type="checkbox" onChange={handleRememberMeChange} name="remember-me" className="checkbox checkbox-sm" />
                                        <span className="label-text">Ingat saya?</span>
                                    </label>
                                </div>

                                <Link to="/lupa-sandi" className="max-w-96 my-auto text-end text-sm place-self-end mr-5">Lupa Kata Sandi?</Link>
                            </div>
                            <div className="card-actions justify-center w-full p-4">
                                <button type="submit" className="btn rounded-full w-full max-w-80 bg-[#4AAE64] text-white hover:text-black" disabled={userState.loading}>
                                    <span className={userState.loading ? "loading loading-spinner" : ""}></span>
                                    LOGIN
                                </button>
                            </div>
                        </Form>

                    </div>


                </section>
            </div>
            {
                userState.successLogout===true &&
                <div className="toast toast-end">
                    <div role="alert" className="alert alert-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Berhasil Logout</span>
                    </div>
                </div>
            }
        </>
    )
}

export default Login