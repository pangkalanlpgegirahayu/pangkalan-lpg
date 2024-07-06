import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Outlet, redirect, useLocation, useNavigate } from 'react-router-dom'
import { updateErrorStok } from '../../state/StokSlice';
import axios from 'axios';

import PertaminaPNG from "../../assets/PertaminaPNG.png"

import { logoutUser, updateSuccessLoginUser, updateSuccessLogoutUser } from '../../state/UserSlice';



export async function actionDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));

    try {
        const response = await axios.get(import.meta.env.VITE_APP_API_URI, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": user.token
            }
        })
        const result = await response.data;
        return null
    } catch (error) {
        return redirect("/login");
    }
}

function Dashboard() {
    const drawerRef = useRef(null);
    const userState = useSelector(state => state.user);
    const stokState = useSelector(state => state.stok);
    const salesState = useSelector(state => state.sales);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        const timer = setTimeout(() => {
            if (stokState.error) {
                dispatch(updateErrorStok(null))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [stokState.error == true])

    useEffect(() => {

        const timer = setTimeout(() => {
            if (userState.successLogin) {
                dispatch(updateSuccessLoginUser(null))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [userState.successLogin == false])

    useEffect(() => {

        const timer = setTimeout(() => {
            if (userState.successLogout) {
                dispatch(updateSuccessLogoutUser(null))
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [userState.successLogout == false])

    const logout = (event) => {
        const prepData = {
            token: userState.data.token
        }

        dispatch(logoutUser(prepData)).then(result => {
            if (!result.error) {
                navigate("/login")
            }
        })
    }

    return (
        <>
            <div className="flex justify-center items-center flex-col">

                <div className="drawer lg:drawer-open z-0 max-w-7xl">

                    <input ref={drawerRef} id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col items-center">
                        <div className="navbar bg-base-100 max-w-7xl sticky top-0 z-50 shadow-md">

                            <div className="flex-none lg:hidden">
                                <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                </label>
                            </div>
                            <div className="flex-1">
                                <Link className="btn btn-ghost text-xl lg:hidden truncate"><img src={PertaminaPNG} className="w-6" alt="" /> <span className="sm:block hidden">Pangkalan LPG Egi Rahayu</span> </Link>
                            </div>
                            <div className="flex-none hidden md:block">
                                <button className="btn btn-ghost" onClick={logout}>
                                    <span className="material-symbols-outlined">
                                        logout
                                    </span>
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div className="px-2 md:px-7 w-full">
                            <Outlet />
                            {/* <DashboardContent/> */}
                        </div>
                        {/* Page content here */}
                    </div>
                    <div className="drawer-side top-[4rem] lg:top-0 shadow-xl">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-56 min-h-full bg-[#fafafa] text-base-content gap-2">
                            {/* Sidebar content here */}
                            <li className="lg:block hidden">
                                <div>
                                    <img src={PertaminaPNG} className="w-16" alt="" />
                                    <p className="font-medium p-3">Pangkalan LPG Egi Rahayu</p>
                                </div>
                            </li>
                            <li>

                                <NavLink to="/"
                                    className={({ isActive, isPending }) => {
                                        return `justify-start relative ${isActive ? 'text-[#4AAE64]' : ''}`
                                    }}
                                    onClick={() => {
                                        drawerRef.current.checked = false
                                    }}
                                >

                                    <span className="material-symbols-outlined">
                                        dashboard
                                    </span>
                                    Dashboard

                                </NavLink>

                            </li>
                            <li>
                                <NavLink to="/pelanggan"
                                    className={({ isActive, isPending }) => {
                                        return `justify-start relative ${isActive ? 'text-[#4AAE64]' : ''}`
                                    }}
                                    onClick={() => {
                                        drawerRef.current.checked = false
                                    }}>
                                    <span className="material-symbols-outlined">
                                        credit_score
                                    </span>
                                    Cek NIK
                                </NavLink>

                            </li>
                            <li>
                                <NavLink to="/penjualan"
                                    className={({ isActive, isPending }) => {
                                        return `justify-start relative ${isActive ? 'text-[#4AAE64]' : ''}`
                                    }}
                                    onClick={() => {
                                        drawerRef.current.checked = false
                                    }}>
                                    <span className="material-symbols-outlined">
                                        insert_chart
                                    </span>
                                    Laporan Penjualan
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/stok"
                                    className={({ isActive, isPending }) => {
                                        return `justify-start relative ${isActive ? 'text-[#4AAE64]' : ''}`
                                    }}
                                    onClick={() => {
                                        drawerRef.current.checked = false
                                    }}>
                                    <span className="material-symbols-outlined">
                                        deployed_code
                                    </span>
                                    Atur Stok
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profil"
                                    className={({ isActive, isPending }) => {
                                        return `justify-start relative ${isActive ? 'text-[#4AAE64]' : ''}`
                                    }}
                                    onClick={() => {
                                        drawerRef.current.checked = false
                                    }}>
                                    <span className="material-symbols-outlined">
                                        source_environment
                                    </span>
                                    Profil
                                </NavLink>

                            </li>
                            <li className="md:hidden mt-4">
                                <button className="btn btn-ghost" onClick={logout}>
                                    <span className="material-symbols-outlined">
                                        logout
                                    </span>
                                    Logout
                                </button>

                            </li>
                        </ul>
                    </div>
                </div>
            </div >

            {
                userState.successLogin === true &&
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
                        <span>Berhasil Login</span>
                    </div>
                </div>
            }

            {
                userState.successLogout === false &&
                <div className="toast toast-end">
                    <div role="alert" className="alert alert-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Gagal Logout</span>
                    </div>
                </div>
            }
            

        </>
    )
}

export default Dashboard