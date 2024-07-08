import { databaseQuery } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { addGasValidation, deleteGasStokValidation, downloadGasSalesHistoryValidation, downloadGasStokHistoryValidation, newTransactionGasValidation, returGasStokValidation, searchGasSalesHistoryValidation, searchGasStokHistoryValidation, updatePriceGasValidation } from "../validation/gas-validation.js"
import { validate_object } from "../validation/validation-util.js"
import mysql from "mysql2/promise"

const update = async (request) => {
    const requestUpdate = validate_object(updatePriceGasValidation, request.body);

    const namaGas = 'LPG3KG';

    let query = "INSERT INTO `gas`(`nama`, `harga_beli`, `harga_jual`, `tanggal`) VALUES (?,?,?,?)"
    let params = [namaGas, requestUpdate.priceBuy, requestUpdate.priceSell, requestUpdate.inputDate];
    const [resultData, field] = await databaseQuery(query, params)

    if (resultData.affectedRows < 1) {
        throw new ResponseError(400, "Gagal mengupdate harga");
    }

    return "Berhasil merubah harga"
}

const transaction = async (user, request) => {
    const transactionRequest = validate_object(newTransactionGasValidation, request);
    const namaGas = 'LPG3KG'
    let query = "SELECT * FROM `konsumen` WHERE nik = ?"
    let params = [transactionRequest.nik];
    const [resultData, field] = await databaseQuery(query, params)

    if (resultData.length < 1) {
        throw new ResponseError(400, "Konsumen tidak ditemukan");
    }

    query = "SELECT * FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1"
    params = [namaGas];
    const [resultData3, field3] = await databaseQuery(query, params)

    if (!resultData3.at(0)) {
        throw new ResponseError(400, "Tidak ada stok");
    }

    if (Number(resultData3.at(0).sisa) < transactionRequest.countBuy) {
        throw new ResponseError(400, "Jumlah pembelian melebihi stok");
    }

    if (resultData.at(0).tipe == 'RUMAH_TANGGA') {
        if (transactionRequest.countBuy > 1) {
            throw new ResponseError(400, "Pembelian tidak valid untuk subsidi Rumah Tangga");
        }
        query = "SELECT count(*) AS jumlah FROM pembelian_gas AS a JOIN detail_pembelian AS b ON a.id = b.id_pembelian WHERE a.id_konsumen = ? AND b.id_detail_pengiriman = ?";
        params = [resultData.at(0).id, resultData3.at(0).id];
        const [resultData7, field7] = await databaseQuery(query, params);

        if (Number(resultData7.at(0).jumlah) >= 1) {
            throw new ResponseError(400, "Pelanggan sudah melakukan pembelian maksimal");
        }

        query = "SELECT SUM(a.jumlah) AS jumlah FROM `detail_pembelian` AS a JOIN `pembelian_gas` AS b JOIN `konsumen` AS c ON a.id_pembelian = b.id AND b.id_konsumen = c.id WHERE c.tipe = 'RUMAH_TANGGA'";
        // params = [resultData.at(0).id, resultData3.at(0).id];
        const [resultData8, field8] = await databaseQuery(query);

        const dataHouse = !resultData8.at(0) ? 0 : Number(resultData8.at(0).jumlah)

        if (((!resultData8.at(0) ? 0 : Number(resultData8.at(0).jumlah)) / Number(resultData3.at(0).jumlah) * 100) >= 80) {
            throw new ResponseError(400, "Pembelian Rumah Tangga sudah mencapai maksimal");
        }

        if ((dataHouse + transactionRequest.countBuy) / resultData3.at(0).jumlah > 80) {
            throw new ResponseError(400, "Jumlah pembelian terlalu besar");
        }
    }

    if (resultData.at(0).tipe == 'USAHA') {
        if (transactionRequest.countBuy > 5) {
            throw new ResponseError(400, "Pembelian tidak valid untuk subsidi Usaha");
        }
        query = "SELECT SUM(b.jumlah) AS jumlah FROM pembelian_gas AS a JOIN detail_pembelian AS b ON a.id = b.id_pembelian WHERE a.id_konsumen = ? AND b.id_detail_pengiriman = ?";
        params = [resultData.at(0).id, resultData3.at(0).id];
        const [resultData7, field7] = await databaseQuery(query, params);

        if (Number(resultData7.at(0).jumlah) >= 5) {
            throw new ResponseError(400, "Pelanggan sudah melakukan pembelian maksimal");
        }

        query = "SELECT SUM(a.jumlah) AS jumlah FROM `detail_pembelian` AS a JOIN `pembelian_gas` AS b JOIN `konsumen` AS c ON a.id_pembelian = b.id AND b.id_konsumen = c.id WHERE c.tipe = 'USAHA'";
        const [resultData8, field8] = await databaseQuery(query);

        const dataBusiness = !resultData8.at(0) ? 0 : Number(resultData8.at(0).jumlah)

        if(Number(resultData7.at(0).jumlah) + transactionRequest.countBuy > 5){
            throw new ResponseError(400, "Jumlah pembelian melebihi batas maksimal konsumen");
        }

        if (((!resultData8.at(0) ? 0 : Number(resultData8.at(0).jumlah)) / Number(resultData3.at(0).jumlah) * 100) >= 20) {
            throw new ResponseError(400, "Pembelian Usaha sudah mencapai maksimal");
        }

        if ((dataBusiness + transactionRequest.countBuy) / Number(resultData3.at(0).jumlah) > 20) {
            throw new ResponseError(400, "Jumlah pembelian terlalu besar");
        }
    }

    query = "SELECT * FROM `gas` WHERE nama = ? ORDER BY id DESC LIMIT 1"
    params = [namaGas];
    const [resultData5, field5] = await databaseQuery(query, params)

    if (resultData5.length == 0) {
        throw new ResponseError(400, "Harga belum di set");
    }

    query = "UPDATE `detail_pengiriman` SET `sisa`=? WHERE `id`=?"
    params = [resultData3.at(0).sisa - transactionRequest.countBuy, resultData3.at(0).id];
    const [resultData6, field6] = await databaseQuery(query, params)

    if (resultData6.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah transaksi");
    }

    query = "INSERT INTO `pembelian_gas`(`tanggal`, `id_konsumen`, `id_user`) VALUES (?,?,?)"
    params = [transactionRequest.inputDate, resultData.at(0).id, user.id];
    const [resultData2, field2] = await databaseQuery(query, params)

    if (resultData2.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah transaksi");
    }

    query = "INSERT INTO `detail_pembelian`(`id_pembelian`, `jumlah`, `id_detail_pengiriman`, `id_gas`) VALUES (?,?,?,?)"
    params = [resultData2.insertId, transactionRequest.countBuy, resultData3.at(0).id, resultData5.at(0).id];
    const [resultData4, field4] = await databaseQuery(query, params)

    if (resultData4.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah transaksi");
    }

    return {
        nik: transactionRequest.nik,
        nama: resultData.at(0).nama,
        tipe: resultData.at(0).tipe,
        jumlah: transactionRequest.countBuy,
        total: transactionRequest.countBuy * resultData5.at(0).harga_jual,
    }
}

const cekRetur = async (request) => {
    const namaGas = 'LPG3KG';
    let query = "SELECT * FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1"
    let params = [namaGas];

    const [resultData, field] = await databaseQuery(query, params)

}

const retur = async (request) => {
    const returRequest = validate_object(returGasStokValidation, request.body);

    if(Number(returRequest.countReturNew)==0 && Number(returRequest.countReturMoney)==0){
        throw new ResponseError(400, "Jumlah retur belum terisi");
    }

    const namaGas = 'LPG3KG';
    
    let query = "SELECT * FROM `konsumen` WHERE nik = ?";
    let params = [returRequest.nik]

    const [resultData, field] = await databaseQuery(query, params)

    if (resultData.length == 0) {
        throw new ResponseError(400, "NIK tidak ada");
    }


    query = "SELECT b.id AS id, b.id_gas AS id_gas, b.jumlah AS jumlah FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c ON a.id = b.id_pembelian AND b.id_gas = c.id WHERE a.id_konsumen = ? AND b.id_detail_pengiriman = (SELECT id FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1) AND c.nama = ? ORDER BY a.id DESC LIMIT 1"
    params = [resultData.at(0).id, namaGas, namaGas];
    const [resultData2, field2] = await databaseQuery(query, params)
    if (resultData2.length == 0) {
        throw new ResponseError(400, "Konsumen belum melakukan pembelian");
    }

    query = "SELECT * FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1"
    params = [namaGas];
    let [resultData3, field3] = await databaseQuery(query, params)
    if ((!resultData3.at(0) ? 0 : Number(resultData3.at(0).sisa)) == 0) {
        throw new ResponseError(400, "Tidak ada gas");
    }


    if (Number(returRequest.countReturNew) > resultData3.at(0).sisa) {
        throw new ResponseError(400, "Stok tidak mencukupi");
    }

    if (Number(returRequest.countReturNew) + Number(returRequest.countReturMoney) > Number(resultData2.at(0).jumlah)) {
        throw new ResponseError(400, "Permintaan jumlah retur tidak sesuai pembelian terakhir");
    }

    if (Number(returRequest.countReturNew) != 0) {
        query = "UPDATE `detail_pengiriman` SET sisa=?, retur=?  WHERE id = ?"
        params = [Number(resultData3.at(0).sisa) - Number(returRequest.countReturNew), Number(resultData3.at(0).retur) + Number(returRequest.countReturNew), resultData3.at(0).id];
        const [resultData4, field4] = await databaseQuery(query, params)
        if (resultData4.affectedRows < 1) {
            throw new ResponseError(400, "Galat");
        }
    }

    query = "SELECT * FROM `detail_pengiriman` WHERE id = ?"
    params = [resultData3.at(0).id];
    [resultData3, field3] = await databaseQuery(query, params)

    if (Number(returRequest.countReturMoney) != 0) {
        query = "UPDATE `detail_pengiriman` SET retur=? WHERE id = ?"
        params = [Number(resultData3.at(0).retur) + Number(returRequest.countReturMoney), resultData3.at(0).id];
        const [resultData4, field4] = await databaseQuery(query, params)
        if (resultData4.affectedRows < 1) {
            throw new ResponseError(400, "Galat");
        }

        query = "UPDATE `detail_pembelian` SET jumlah=? WHERE id = ?"
        params = [Number(resultData2.at(0).jumlah) - Number(returRequest.countReturMoney), resultData2.at(0).id];
        const [resultData5, field5] = await databaseQuery(query, params)
        if (resultData4.affectedRows < 1) {
            throw new ResponseError(400, "Galat");
        }
    }

    query = "SELECT * FROM `gas` WHERE `id` = ?  ORDER BY `id` DESC LIMIT 1"
    params = [resultData2.at(0).id_gas];
    const [resultData6, field6] = await databaseQuery(query, params)

    if(!resultData6.at(0)){
        throw new ResponseError(400, "Gas belum di set up");
    }


    return {
        nik: returRequest.nik,
        nama: resultData.at(0).nama,
        tipe: resultData.at(0).tipe,
        pembelianAwal: resultData2.at(0).jumlah,
        jumlahTukarBaru: returRequest.countReturNew,
        jumlahTukarUang: returRequest.countReturMoney,
        biayaTukarUang: Number(returRequest.countReturMoney) * resultData6.at(0).harga_jual,
    }
}

const stok = async (request) => {
    const namaGas = 'LPG3KG';

    let query = "SELECT * FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1"
    let params = [namaGas];
    const [resultData, field] = await databaseQuery(query, params)

    query = "SELECT harga_beli, harga_jual FROM `gas` WHERE nama=? ORDER BY id DESC LIMIT 1";
    params = [namaGas];
    const [resultData2, field2] = await databaseQuery(query, params)

    query = "SELECT SUM(jumlah) AS total_terjual FROM `detail_pembelian` WHERE id_detail_pengiriman=?";
    params = [!resultData.at(0) ? 0 : resultData.at(0).id];
    const [resultData3, field3] = await databaseQuery(query, params)

    query = "SELECT SUM(a.jumlah*b.harga_jual) AS totalKeuntungan FROM `detail_pembelian` AS a JOIN `gas` AS b ON a.id_gas = b.id WHERE b.nama = ?";
    params = [namaGas];
    const [resultData4, field4] = await databaseQuery(query, params)

    return {
        totalStok: !resultData.at(0) ? 0 : resultData.at(0).jumlah,
        totalKeuntungan: !resultData4.at(0) ? 0 : resultData4.at(0).totalKeuntungan,
        stok: !resultData.at(0) ? 0 : resultData.at(0).sisa,
        retur: !resultData.at(0) ? 0 : resultData.at(0).retur,
        sold: !resultData3.at(0) ? 0 : resultData3.at(0).total_terjual,
        hargaBeli: !resultData2.at(0) ? 0 : resultData2.at(0).harga_beli,
        hargaJual: !resultData2.at(0) ? 0 : resultData2.at(0).harga_jual,
    }
}

const add = async (user, request) => {
    const addRequest = validate_object(addGasValidation, request);
    const idGas = 31200;
    const namaGas = 'LPG3KG';

    let query = "SELECT (SELECT a.jumlah FROM `detail_pengiriman` AS a JOIN `gas` AS b ON a.id_gas = b.id WHERE b.nama = ? ORDER BY a.id DESC LIMIT 1) - (SELECT SUM(a.jumlah) FROM `detail_pembelian` AS a JOIN `detail_pengiriman` AS b JOIN `gas` AS c ON a.id_detail_pengiriman=b.id AND b.id_gas = c.id WHERE c.nama = ? GROUP BY a.id_detail_pengiriman ORDER BY a.id_detail_pengiriman DESC LIMIT 1  ) AS stok"
    let params = [namaGas, namaGas]

    query = "SELECT sisa FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1"
    params = [namaGas]

    const [resultData4, field4] = await databaseQuery(query, params)

    if ((!resultData4.at(0) ? 0 : resultData4.at(0).sisa) > 0) {
        throw new ResponseError(400, "Tidak bisa menambah stok sebelum habis")
    }

    query = "INSERT INTO `pengiriman_gas`(`tanggal`, `informasi`, `id_user`) VALUES (?,?,?)";
    params = [addRequest.inputDate, addRequest.information ?? null, user.id]
    const [resultData, field] = await databaseQuery(query, params)

    if (resultData.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah stok")
    }

    query = "INSERT INTO `detail_pengiriman`(`nama_gas`, `id_pengiriman`, `jumlah`, `sisa`) VALUES (?,?,?,?)";
    params = [namaGas, resultData.insertId, addRequest.countStok, addRequest.countStok]

    const [resultData2, field2] = await databaseQuery(query, params)
    if (resultData2.affectedRows < 1) {
        throw new ResponseError(400, "Gagal menambah stok")
    }
    return "Berhasil menambah Stok";
}

const salesHistory = async (user, request) => {
    const requestHistory = validate_object(searchGasSalesHistoryValidation, request)
    const idGas = 31200;
    const namaGas = 'LPG3KG';

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if (requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem,  SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual, SUM(b.jumlah*c.harga_beli) AS totalModal FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query2 = "SELECT count(*) as totalItem,  SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual, SUM(b.jumlah*c.harga_beli) AS totalModal FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem,  SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual, SUM(b.jumlah*c.harga_beli) AS totalModal FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem,  SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual, SUM(b.jumlah*c.harga_beli) AS totalModal FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND b.jumlah != 0 ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    const totalItem = resultData2.at(0).totalItem
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if (requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal >= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal <= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas]
    }

    const [resultData, field] = await databaseQuery(query, params)

    const paging = {}
    paging.page = requestHistory.page
    paging.total_item = totalItem
    paging.total_page = Math.ceil(totalItem / requestHistory.size)

    if (requestHistory.page > 1) {
        paging.prev = requestHistory.page - 1
    }

    if (requestHistory.page < Math.ceil(totalItem / requestHistory.size)) {
        paging.next = requestHistory.page + 1
    }

    return {
        data: resultData,
        dataSold: {
            modal: resultData2.at(0).totalModal,
            countSold: resultData2.at(0).totalTerjual,
            revenue: resultData2.at(0).totalKeuntungan
        },
        paging: paging
    }
}

const deleteStok = async (stokId) => {
    stokId = validate_object(deleteGasStokValidation, stokId);



    let query = "SELECT id FROM `pengiriman_gas` WHERE id=?"
    let params = [stokId]

    const [resultData, field] = await databaseQuery(query, params)

    if (resultData.length !== 1) {
        throw new ResponseError(400, "Data tidak ada")
    }

    query = "SELECT id FROM `pengiriman_gas` WHERE id>? ORDER BY id ASC LIMIT 1"
    params = [stokId]

    const [resultData2, field2] = await databaseQuery(query, params)

    if (resultData2.length != 0) {
        throw new ResponseError(400, "Tidak bisa dihapus")
    }

    query = "DELETE FROM `pengiriman_gas` WHERE id = ?"
    params = [stokId]

    const [resultData3, field3] = await databaseQuery(query, params)

    if (resultData2.affectedRows < 1) {
        throw new ResponseError(400, "Error");
    }

    return "Berhasil dihapus"
}

const printSalesHistory = async (user, request) => {
    const requestHistory = validate_object(downloadGasSalesHistoryValidation, request)
    const idGas = 31200;
    const namaGas = 'LPG3KG';

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if (requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem, SUM(b.jumlah*c.harga_jual) AS totalKeuntungan, SUM(b.jumlah) AS totalTerjual FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `detail_pengiriman` AS d ON a.id=b.id_pembelian AND b.id_gas=c.id AND b.id_detail_pengiriman = d.id WHERE c.nama = ? AND b.jumlah != 0 ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if (requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal >= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal <= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, f.id_pengiriman, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, e.nama AS nama_pembeli, d.nama AS nama_penginput, b.jumlah, (b.jumlah*c.harga_jual) AS totalBayar, c.harga_jual AS hargaSatuan, c.nama AS nama_gas FROM `pembelian_gas` AS a JOIN `detail_pembelian` AS b JOIN `gas` AS c JOIN `users` AS d JOIN `konsumen` AS e JOIN `detail_pengiriman` AS f ON a.id_user = d.id AND a.id=b.id_pembelian AND b.id_gas=c.id AND a.id_konsumen = e.id AND b.id_detail_pengiriman = f.id WHERE c.nama = ? AND b.jumlah != 0 ORDER BY a.id DESC";
        params = [namaGas]
    }
    const [resultData, field] = await databaseQuery(query, params)
    return {
        data: resultData,
        dataSold: {
            countSold: resultData2.at(0).totalTerjual,
            revenue: resultData2.at(0).totalKeuntungan
        },
    }
}

const history = async (user, request) => {
    const requestHistory = validate_object(searchGasStokHistoryValidation, request);
    const idGas = 31200;
    const namaGas = 'LPG3KG';

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if (requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b ON a.id=b.id_pengiriman WHERE b.nama_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b ON a.id=b.id_pengiriman WHERE b.nama_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b ON a.id=b.id_pengiriman WHERE b.nama_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b ON a.id=b.id_pengiriman WHERE b.nama_gas = ? ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)

    const totalItem = resultData2.at(0).totalItem
    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if (requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.nama_gas, b.sisa FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN  `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.nama_gas, b.sisa FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN  `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.nama_gas, b.sisa FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.nama_gas, b.sisa FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b JOIN  `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? ORDER BY a.id DESC LIMIT " + skip + "," + mysql.escape(requestHistory.size);
        params = [namaGas]
    }



    const [resultData, field] = await databaseQuery(query, params)


    const paging = {}
    paging.page = requestHistory.page
    paging.total_item = totalItem
    paging.total_page = Math.ceil(totalItem / requestHistory.size)

    if (requestHistory.page > 1) {
        paging.prev = requestHistory.page - 1
    }

    if (requestHistory.page < Math.ceil(totalItem / requestHistory.size)) {
        paging.next = requestHistory.page + 1
    }

    return {
        data: resultData,
        paging: paging
    }
}

const printHistory = async (user, request) => {
    const requestHistory = validate_object(downloadGasStokHistoryValidation, request);
    const idGas = 31200;
    const namaGas = 'LPG3KG';

    const skip = (requestHistory.page - 1) * requestHistory.size;
    let query, query2;
    let params, params2;

    if (requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  ON a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  ON a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.endDate]
    }

    if (requestHistory.startDate && requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  ON a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";
        params2 = [namaGas, requestHistory.startDate, requestHistory.endDate]
    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query2 = "SELECT count(*) as totalItem FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  ON a.id=b.id_pengiriman WHERE b.nama_gas = ? ORDER BY a.id DESC";
        params2 = [namaGas]
    }

    const [resultData2, field2] = await databaseQuery(query2, params2)

    if (resultData2.at(0).totalItem == 0) {
        throw new ResponseError(400, "Data tidak dalam rentang");
    }

    if (requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.sisa, b.nama_gas AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal >= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.startDate]
    }

    if (requestHistory.endDate && !requestHistory.startDate) {
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.sisa, b.nama_gas AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal <= ? ORDER BY a.id DESC";
        params = [namaGas, requestHistory.endDate]
    }


    if (requestHistory.startDate && requestHistory.endDate) {

        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.sisa, b.nama_gas AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? AND a.tanggal BETWEEN ? AND ? ORDER BY a.id DESC";

        params = [namaGas, requestHistory.startDate, requestHistory.endDate]


    }
    if (!requestHistory.startDate && !requestHistory.endDate) {
        query = "SELECT a.id, DATE_FORMAT(a.tanggal, '%d/%m/%Y %H:%i') AS tanggal, a.informasi, d.nama AS nama_penginput, b.jumlah, b.sisa, b.nama_gas AS nama_gas FROM `pengiriman_gas` AS a JOIN `detail_pengiriman` AS b  JOIN `users` AS d ON a.id_user = d.id AND a.id=b.id_pengiriman  WHERE b.nama_gas = ? ORDER BY a.id DESC";
        params = [namaGas]
    }
    const [resultData, field] = await databaseQuery(query, params)

    return {
        data: resultData,
    }
}

export default {
    add,
    history,
    salesHistory,
    printHistory,
    printSalesHistory,
    stok,
    update,
    deleteStok,
    retur,
    transaction
}