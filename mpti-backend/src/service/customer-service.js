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

    if(resultData3.length == 0){
        throw new ResponseError(400, "Harga belum di set");
    }

    query = "SELECT * FROM `detail_pengiriman` WHERE nama_gas = ? ORDER BY id DESC LIMIT 1"
    params = [namaGas];
    const [resultData2, field2] = await databaseQuery(query, params)

    if(resultData2.at(0).sisa == 0){
        throw new ResponseError(400, "Stok habis")
    }

    if (resultUser.at(0).tipe == "RUMAH_TANGGA") {
        
        query = "SELECT count(*) AS jumlah FROM pembelian_gas AS a JOIN detail_pembelian AS b ON a.id = b.id_pembelian WHERE a.id_konsumen = ? AND b.id_detail_pengiriman = ?"
        
        params = [resultUser.at(0).id, resultData2.at(0).id]
        
        let [resultCount, fieldCekup] = await databaseQuery(query, params);
        
        if (resultCount.at(0).jumlah == 1) {
            throw new ResponseError(400, "Pelanggan sudah melakukan pembelian maksimal")
        }
    }

    if (resultUser.at(0).tipe == "USAHA") {
        
        query = "SELECT SUM(b.jumlah) AS jumlah FROM pembelian_gas AS a JOIN detail_pembelian AS b ON a.id = b.id_pembelian WHERE a.id_konsumen = ? AND b.id_detail_pengiriman = ?"
        
        params = [resultUser.at(0).id, resultData2.at(0).id]
        
        let [resultCount, fieldCekup] = await databaseQuery(query, params);
        
        if (resultCount.at(0).jumlah == 5) {
            throw new ResponseError(400, "Pelanggan sudah melakukan pembelian maksimal")
        }
    }

    return resultUser.at(0)
}

const countType = async (request) => {
    let query = "SELECT tipe, COUNT(*) AS jumlah FROM `konsumen` GROUP BY tipe";
    let [result, field] = await databaseQuery(query);

    if(result.length<1){
        throw new ResponseError(400, "Tidak ada data")
    }

    return{
        rumahTangga: result.at(0).jumlah??0,
        usaha: result.at(1).jumlah??0
    }
}

const register = async (request) => {
    if(!request.files?.ktp){
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
    return "Berhasil Mendaftarkan Pelanggan"
}


export default {
    cekNik,
    register,
    countType
}