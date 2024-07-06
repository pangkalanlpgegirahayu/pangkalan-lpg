import { request } from "http";
import { databaseQuery } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { addCustomerValidation, nikValidation } from "../validation/customer-validation.js"
import { validate_object } from "../validation/validation-util.js"
import path from "path";

const cekNik = async (request) => {
    const namaGas = "LPG3KG";
    const customerRequest = validate_object(nikValidation, request)
    let query = "SELECT * FROM konsumen WHERE nik=?";
    let params = [customerRequest.nik];
    let [resultUser, field] = await databaseQuery(query, params);

    if (resultUser.length == 0) {
        throw new ResponseError(400, "Pelanggan tidak ditemukan")
    }

    query = "SELECT * FROM `gas` WHERE nama = ? ORDER BY id DESC LIMIT 1"
    params = [namaGas];
    const [resultData3, field3] = await databaseQuery(query, params)

    if (resultData3.length == 0) {
        throw new ResponseError(400, "Harga belum di set");
    }

    query = "SELECT * FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1"
    params = [namaGas];
    const [resultData2, field2] = await databaseQuery(query, params)

    if (!resultData2.at(0)) {
        throw new ResponseError(400, "Stok belum diperbarui")
    }

    if (resultData2.at(0).sisa==0) {
        throw new ResponseError(400, "Stok habis")
    }

    if (resultUser.at(0).tipe == "RUMAH_TANGGA") {

        query = "SELECT count(*) AS jumlah FROM pembelian_gas AS a JOIN detail_pembelian AS b ON a.id = b.id_pembelian WHERE a.id_konsumen = ? AND b.id_detail_pengiriman = ?"

        params = [resultUser.at(0).id, resultData2.at(0).id]

        let [resultCount, fieldCekup] = await databaseQuery(query, params);

        if (resultCount.at(0).jumlah == 1) {
            throw new ResponseError(400, "Pelanggan sudah melakukan pembelian maksimal")
        }

        query = "SELECT SUM(a.jumlah) AS jumlah FROM `detail_pembelian` AS a JOIN `pembelian_gas` AS b JOIN `konsumen` AS c ON a.id_pembelian = b.id AND b.id_konsumen = c.id WHERE c.tipe = 'RUMAH_TANGGA'";
        // params = [resultData.at(0).id, resultData3.at(0).id];
        const [resultData4, field4] = await databaseQuery(query);

        const dataHouse = !resultData4.at(0) ? 0 : resultData4.at(0).jumlah

        if(((!resultData4.at(0) ? 0 : resultData4.at(0).jumlah)/resultData2.at(0).jumlah*100) >= 80){
            throw new ResponseError(400, "Pembelian Rumah Tangga sudah mencapai maksimal");
        }
    }

    if (resultUser.at(0).tipe == "USAHA") {

        query = "SELECT SUM(b.jumlah) AS jumlah FROM pembelian_gas AS a JOIN detail_pembelian AS b ON a.id = b.id_pembelian WHERE a.id_konsumen = ? AND b.id_detail_pengiriman = ?"

        params = [resultUser.at(0).id, resultData2.at(0).id]

        let [resultCount, fieldCekup] = await databaseQuery(query, params);

        if (resultCount.at(0).jumlah == 5) {
            throw new ResponseError(400, "Pelanggan sudah melakukan pembelian maksimal")
        }

        query = "SELECT SUM(a.jumlah) AS jumlah FROM `detail_pembelian` AS a JOIN `pembelian_gas` AS b JOIN `konsumen` AS c ON a.id_pembelian = b.id AND b.id_konsumen = c.id WHERE c.tipe = 'USAHA'";
        // params = [resultData.at(0).id, resultData3.at(0).id];
        const [resultData4, field4] = await databaseQuery(query);

        const dataHouse = !resultData4.at(0) ? 0 : resultData4.at(0).jumlah

        if(((!resultData4.at(0) ? 0 : resultData4.at(0).jumlah)/resultData2.at(0).jumlah*100) >= 20){
            throw new ResponseError(400, "Pembelian Usaha sudah mencapai maksimal");
        }
    }

    return resultUser.at(0)
}

const countTypeSell = async (request) => {
    let query = "SELECT SUM(a.jumlah) AS jumlah FROM `detail_pembelian` AS a JOIN `pembelian_gas` AS b JOIN `konsumen` AS c ON a.id_pembelian = b.id AND b.id_konsumen = c.id WHERE c.tipe = 'RUMAH_TANGGA'";
    const [result, field] = await databaseQuery(query);

    query = "SELECT SUM(a.jumlah) AS jumlah FROM `detail_pembelian` AS a JOIN `pembelian_gas` AS b JOIN `konsumen` AS c ON a.id_pembelian = b.id AND b.id_konsumen = c.id WHERE c.tipe = 'USAHA'";
    const [result2, field2] = await databaseQuery(query);

    return {
        rumahTangga: !result.at(0) ? 0 : result.at(0).jumlah,
        usaha: !result2.at(0) ?  0 : result2.at(0).jumlah 
    }
}

const register = async (request) => {
    if (!request.files?.ktp) {
        throw new ResponseError(400, "Membutuhkan File KTP")
    }
    const customerRequest = validate_object(addCustomerValidation, request.body)

    let query = "SELECT * FROM konsumen WHERE nik=? limit 1";
    let params = [customerRequest.nik];
    let [resultUser, field] = await databaseQuery(query, params);

    if (resultUser.length != 0) throw new ResponseError(400, "Pelanggan sudah terdaftar")

    const file = request.files.ktp
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const newName = file.md5 + ext
    const imageUrl = `${request.protocol}://${request.get("host")}/images/${newName}`

    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });

    if (fileSize > 1000000) throw new ResponseError(413, "File terlalu ebih dari 1 MB")

    const customerType = customerRequest.type == 1 ? 'RUMAH_TANGGA' : "USAHA"

    try {
        file.mv(`./src/images/ktp/${newName}`)
    } catch (error) {
        throw new ResponseError(400, "Failed to process")
    }

    query = "INSERT INTO `konsumen`(`nik`, `nama`, `alamat`, `tipe`, `ktp_name`) VALUES (?,?,?,?,?)"
    params = [customerRequest.nik, customerRequest.name, customerRequest.address, customerRequest.type, newName]
    const [resultUser2, field2] = await databaseQuery(query, params);

    if (resultUser2.affectedRows < 1) throw new ResponseError(400, "Gagal Mendaftarkan pelanggan baru")

    query = "SELECT * FROM konsumen WHERE nik=?";
    params = [customerRequest.nik];
    const [resultUser3, field3] = await databaseQuery(query, params);

    return resultUser3.at(0)
}


export default {
    cekNik,
    register,
    countTypeSell
}