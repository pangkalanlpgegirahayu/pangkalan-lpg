import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { downloadHistoryStok, gasStok } from "../../state/StokSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { updateSuccessLogoutUser } from "../../state/UserSlice";
import { Chart } from "chart.js";

function DashboardContent() {
    const stokState = useSelector(state => state.stok)
    const userState = useSelector(state => state.user)
    const dateEnd = useRef();
    const customerGraf = useRef();
    
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "Pangkalan LPG Egi Rahayu - Dashboard"
        let chartjes

        const prepData = {
            token: userState.data.token
        }
        dispatch(gasStok(prepData))
        fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
            .then(response => response.json())
            .then(data => {
                dateEnd.current = data.datetime.slice(0, 16)
                const startDate = new Date(data.datetime.slice(0, 16));
                startDate.setDate(startDate.getDate() - 30 * 1);
                const prepData = {
                    token: userState.data.token,
                    startDate: startDate.toISOString().slice(0, 11) + "00:00",
                    endDate: data.datetime.slice(0, 11) + "23:59"
                }
                dispatch(downloadHistoryStok(prepData)).then(result => {
                    if (result.payload === "Unauthorized") {
                        dispatch(updateSuccessLogoutUser(true))
                        navigate("/login")
                    }
                })
            })
        axios.get(import.meta.env.VITE_APP_API_URI + "customer", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': prepData.token
            }
        }).then(result => {

            chartjes = new Chart(
                customerGraf.current,
                {
                    type: 'doughnut',
                    data: {

                        labels: [`${result.data.data.rumahTangga ?? 0} Rumah Tangga`, `${result.data.data.usaha ?? 0} Usaha Mikro`],
                        datasets: [
                            {
                                label: 'Jumlah penjualan',
                                data: [result.data.data.rumahTangga, result.data.data.usaha],
                                backgroundColor: [
                                    '#4AAE64',
                                    '#a6e8b8',
                                ],
                                hoverOffset: 4,
                                

                            }

                        ]
                    },
                    plugins: [
                        {
                            id: "doughnutLabel",
                            beforeDatasetsDraw(chart, args, pluginOptions) {
                                const { ctx, data } = chart;
                                ctx.save();
                                const xCoor = chart.getDatasetMeta(0).data[0].x;
                                const yCoor = chart.getDatasetMeta(0).data[0].y;
                                ctx.font = 'bold 36px sans-serif';
                                ctx.fillStyle = '#4AAE64';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(Number(result.data.data.rumahTangga) + Number(result.data.data.usaha), xCoor, yCoor);
                            },

                        },

                    ]

                    ,
                    options: {
                        cutout: "80%",
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
                            }
                        }

                    }

                }
            );
        })




    }, [])

    const handleSelectMonthStokHistory = (event) => {
        const startDate = new Date(dateEnd.current);
        startDate.setDate(startDate.getDate() - 30 * event.target.value);
        const prepData = {
            token: userState.data.token,
            startDate: startDate.toISOString().slice(0, 11) + "00:00",
            endDate: dateEnd.current.slice(0, 11) + "23:59"
        }
        dispatch(downloadHistoryStok(prepData)).then(result => {
            if (result.payload === "Unauthorized") {
                dispatch(updateSuccessLogoutUser(true))
                navigate("/login")
            }
        })
    }
    return (
        <>
            <h1 className="text-4xl py-5 md:py-10 font-medium truncate">Dashboard</h1>
            <div className="w-full py-2 gap-3 flex flex-col md:flex-row ">
                <div className="card md:max-w-xl w-full bg-base-100 shadow-sm rounded-md">
                    <p className="py-1.5 px-3 bg-[#f9fafb]">Distribusi Konsumen</p>
                    <div className="card-body max-w-3xl justify-center items-center overflow-auto">
                        <canvas ref={customerGraf} className="max-h-64"></canvas>
                    </div>
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <div className="card max-w-5xl w-full bg-base-100 shadow-sm rounded-md">
                        <p className="py-1.5 px-3 bg-[#f9fafb]">Keuntungan Kotor Keseluruhan</p>
                        <div className="card-body text-center items-center overflow-auto">
                            <span className="material-symbols-outlined text-4xl w-14 h-14 flex justify-center items-center text-white bg-[#4AAE64] rounded-md">
                                account_balance_wallet
                            </span>
                            <h2 className="text-[1em] font-medium px-4">{new Intl.NumberFormat('id-ID', { style: "currency", currency: "IDR" }).format(stokState?.dataStok?.dirtyRevenue)}</h2>
                        </div>
                    </div>

                    <div className="card max-w-5xl w-full bg-base-100 shadow-sm rounded-md">
                        <p className="py-1.5 px-3 bg-[#f9fafb]">Stok saat ini</p>
                        <div className="card-body overflow-auto">
                            <div className="flex items-center gap-5">
                                <span className="material-symbols-outlined text-4xl min-w-14 w-14 h-14 flex justify-center items-center text-white bg-[#4AAE64] rounded-md">
                                    deployed_code
                                </span>
                                <h2 className="font-semibold text-[2em]">{stokState.dataStok.stok}<span className="pl-2 text-sm">tabung</span></h2>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            <div className="w-full py-2">
                <div className="grid gap-3">
                    <div className="card max-w-5xl bg-base-100 shadow-sm rounded-md overflow-x-auto">
                        <div className="card-body">
                            <div className="flex gap-4 justify-between flex-col sm:flex-row">
                                <h2 className="card-title">Riwayat Stok</h2>
                                <select className="select select-bordered w-full max-w-40" onChange={handleSelectMonthStokHistory}>
                                    <option value={1}>1 bulan</option>
                                    <option value={2}>2 bulan</option>
                                    <option value={3}>3 bulan</option>
                                </select>

                            </div>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th>No.</th>
                                            <th>Tanggal</th>
                                            <th>Jumlah</th>
                                            <th>Sisa</th>
                                            <th>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className={stokState.loading ? "skeleton" : ""}>

                                        {
                                            stokState.dataPrint?.length == 0 ? (
                                                <tr><td colSpan={6} className="text-center">Tidak Ada Data</td></tr>
                                            ) : (
                                                stokState.dataPrint?.map((data, index) => {

                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{data.tanggal}</td>
                                                            <td>{data.jumlah}</td>
                                                            <td>{data.sisa}</td>
                                                            <td>{data.informasi}</td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardContent