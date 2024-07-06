import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Profile() {
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
    useEffect(()=>{
        document.title = "Pangkalan LPG Egi Rahayu - Profil"
        
    }, [])
    return (
        <div className="w-full py-2">
            <div className="card bg-base-100  shadow-sm rounded-md">
                <div className="card-body gap-5">
                    <div role="tablist" className="tabs tabs-bordered overflow-x-scroll overflow-y-visible">
                        <button role='tab' className={
                            `tab font-medium ${tab == 0 ? 'tab-active text-[#4AAE64] !border-b-[#4AAE64]' : ''}`
                        } onClick={()=>setTab(0)}>Pangkalan</button>
                        <button role='tab' className={
                            `tab font-medium ${tab == 1 ? 'tab-active text-[#4AAE64] !border-b-[#4AAE64]' : ''}`
                        } onClick={()=>setTab(1)}>Pemilik</button>
                    </div>
                    {tab == 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 gap-5 ">
                                <div className="grid gap-1">
                                    <h4>Nama Pangkalan</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white">Egi Rahayu</p>
                                </div>
                                <div className="grid gap-1">
                                    <h4>Agen</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white">791732 - PT. GRAHA GAS NIAGA</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="grid gap-1">
                                    <h4>Kontak</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white">081329031131</p>
                                </div>
                                <div className="grid gap-1">
                                    <h4>Mid</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white">LPG_021035</p>
                                </div>
                            </div>
                            <div className="grid gap-1">
                                <h4>Alamat</h4>
                                <p className="p-3 bg-[#4AAE64] rounded-lg text-white">Gledeg Rt 002 Rw 003, Gledeg, Karanganom, Klaten, JawaTengah, 57475</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 gap-5 ">
                                <div className="grid gap-1">
                                    <h4>Nama Pemilik</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white">Egi Rahayu</p>
                                </div>
                                <div className="grid gap-1">
                                    <h4>NIK</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white">3310185802690001</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="grid gap-1">
                                    <h4>Kontak</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white">081329031131</p>
                                </div>
                                <div className="grid gap-1">
                                    <h4>Email</h4>
                                    <p className="p-3 bg-[#4AAE64] rounded-lg text-white overflow-x-scroll">rahayuegi18@gmail.com</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile