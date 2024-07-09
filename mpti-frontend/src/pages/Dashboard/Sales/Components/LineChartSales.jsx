import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react"

const dataHour = [
    { id: 0, jumlah: 0 },
    { id: 1, jumlah: 0 },
    { id: 2, jumlah: 0 },
    { id: 3, jumlah: 0 },
    { id: 4, jumlah: 0 },
    { id: 5, jumlah: 0 },
    { id: 6, jumlah: 0 },
    { id: 7, jumlah: 0 },
    { id: 8, jumlah: 0 },
    { id: 9, jumlah: 0 },
    { id: 10, jumlah: 0 },
    { id: 11, jumlah: 0 },
    { id: 12, jumlah: 0 },
    { id: 13, jumlah: 0 },
    { id: 14, jumlah: 0 },
    { id: 15, jumlah: 0 },
    { id: 16, jumlah: 0 },
    { id: 17, jumlah: 0 },
    { id: 18, jumlah: 0 },
    { id: 19, jumlah: 0 },
    { id: 20, jumlah: 0 },
    { id: 21, jumlah: 0 },
    { id: 22, jumlah: 0 },
    { id: 23, jumlah: 0 },
]

const dataDay = [
    { id: 0, nama: 'Minggu', jumlah: 0 },
    { id: 1, nama: 'Senin', jumlah: 0 },
    { id: 2, nama: 'Selasa', jumlah: 0 },
    { id: 3, nama: 'Rabu', jumlah: 0 },
    { id: 4, nama: 'Kamis', jumlah: 0 },
    { id: 5, nama: 'Jumat', jumlah: 0 },
    { id: 6, nama: 'Sabtu', jumlah: 0 },
]

const dataMonth = [
    { id: 0, nama: 'Januari', jumlah: 0 },
    { id: 1, nama: 'Februari', jumlah: 0 },
    { id: 2, nama: 'Maret', jumlah: 0 },
    { id: 3, nama: 'April', jumlah: 0 },
    { id: 4, nama: 'Mei', jumlah: 0 },
    { id: 5, nama: 'Juni', jumlah: 0 },
    { id: 6, nama: 'Juli', jumlah: 0 },
    { id: 7, nama: 'Agustus', jumlah: 0 },
    { id: 8, nama: 'September', jumlah: 0 },
    { id: 9, nama: 'Oktober', jumlah: 0 },
    { id: 10, nama: 'November', jumlah: 0 },
    { id: 11, nama: 'Desember', jumlah: 0 },
]


function LineChartSales({ print }) {
    const [stateArea, setStateArea] = useState(0);
    const canvas = useRef();
    let result = []

    useEffect(() => {
        let xLable
        let chartjes
        if (!print || print.length == 0) {
            return
        }

        if (stateArea == 3) {
            xLable = 'Tahun'

            const clonePrint = print.map(item => { return { ...item } })

            clonePrint.reduce(function (res, value) {
                if (!res[Number(value.tanggal.slice(6, 10))]) {
                    res[Number(value.tanggal.slice(6, 10))] = { nama: Number(value.tanggal.slice(6, 10)), jumlah: 0 };
                    result.push(res[Number(value.tanggal.slice(6, 10))])
                }
                res[Number(value.tanggal.slice(6, 10))].jumlah += Number(value.jumlah);

                return res;

            }, {})

            result.sort((a, b) => parseFloat(a.tahun) - parseFloat(b.tahun));


        }

        if (stateArea == 2) {
            xLable = 'Bulan'
            const clonePrint = print.map(item => { return { ...item } })

            result = dataMonth.map(item => { return { ...item } })

            clonePrint.reduce(function (res, value) {

                result.map((data) => {
                    if (data.id == new Date(`${value.tanggal.slice(6, 10)}-${value.tanggal.slice(3, 5)}-${value.tanggal.slice(0, 2)}`).getMonth()) {
                        data.jumlah += value.jumlah
                    }
                })
            }, {})

        }

        if (stateArea == 1) {
            xLable = 'Hari'
            const clonePrint = print.map(item => { return { ...item } })

            result = dataDay.map(item => { return { ...item } })

            clonePrint.reduce(function (res, value) {

                result.map((data) => {
                    if (data.id == new Date(`${value.tanggal.slice(6, 10)}-${value.tanggal.slice(3, 5)}-${value.tanggal.slice(0, 2)}`).getDay()) {
                        data.jumlah += value.jumlah
                    }
                })
            }, {})
        }
        if (stateArea == 0) {
            xLable = 'Jam'
            const clonePrint = print.map(item => { return { ...item } })
            result = dataHour.map(item => { return { ...item } })
            clonePrint.reduce(function (res, value) {
                result.map((data) => {
                    if (data.id == Number(value.tanggal.slice(11, 13))) {
                        data.jumlah += value.jumlah
                    }
                })
            }, {})
        }
        chartjes = new Chart(
            canvas.current,
            {
                type: 'line',
                data: {
                    labels: result.map(row => !row.nama ? row.id : row.nama),
                    datasets: [
                        {
                            label: 'Jumlah penjualan',
                            data: result.map(row => row.jumlah)
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 5,
                            },
                            grace: '5%'
                        },
                        x: {
                            title: {
                                display: true,
                                text: xLable
                            }
                        }
                    },
                }
            }
        );

        return () => chartjes.destroy()

    }, [print, stateArea])

    return (
        <div className="card max-w-5xl overflow-x-auto rounded-none">
            <div className="card-body bg-base-100 rounded-md shadow-sm">
                <div className="flex gap-4 justify-between flex-col sm:flex-row">
                    <h2 className="text-md font-semibold">Grafik Penjualan</h2>
                    <select className="select select-bordered w-full max-w-52" onChange={(event) => setStateArea(event.target.value)}>
                        <option value={0} defaultChecked>Jam</option>
                        <option value={1}>Hari</option>
                        <option value={2}>Bulan</option>
                        <option value={3}>Tahun</option>
                    </select>
                </div>
                {print.length == 0 ? <p className="text-center">Tidak ada data</p> :
                    <canvas ref={canvas}>
                    </canvas>
                }
            </div>
        </div>

    )
}

export default LineChartSales