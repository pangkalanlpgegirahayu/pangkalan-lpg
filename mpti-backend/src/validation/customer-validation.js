import Joi from "joi";


const nikValidation = Joi.object({
    nik: Joi.string().max(16).min(16).pattern(new RegExp("^[0-9]")).required().messages({
        "string.base": "NIK wajib diisi",
        "string.empty": "NIK wajib diisi",
        "string.min": "NIK minimal 16 karakter",
        "string.max": "NIK maksimal 16 karakter",
        "string.pattern.base": "Format NIK wajib berisi angka",
        "any.required": "NIK wajib diisi"
    }),
})

const addCustomerValidation = Joi.object({
    nik: Joi.string().max(16).min(16).pattern(new RegExp("^[0-9]")).required().messages({
        "string.base": "NIK wajib diisi",
        "string.empty": "NIK wajib diisi",
        "string.min": "NIK minimal 16 karakter",
        "string.max": "NIK maksimal 16 karakter",
        "string.pattern.base": "Format NIK wajib berisi angka",
        "any.required": "NIK wajib diisi"
    }),
    name: Joi.string().max(100).min(1).required().messages({
        "string.base": "Nama wajib diisi",
        "string.empty": "Nama wajib diisi",
        "string.min": "Nama minimal 1 karakter",
        "string.max": "Nama maksimal 100 karakter",
        "any.required": "Nama wajib diisi"
    }),
    address: Joi.string().max(100).min(1).required().messages({
        "string.base": "Alamat wajib diisi",
        "string.empty": "Alamat wajib diisi",
        "string.min": "Alamat minimal 1 karakter",
        "string.max": "Alamat maksimal 100 karakter",
        "any.required": "Alamat wajib diisi"
    }),
    type: Joi.number().positive().default(1).max(2).required().messages({
        "number.positive": "Tipe wajib bernilai positif",
        "number.max": "Tipe tidak sesuai format",
        "number.base": "Tipe tidak sesuai format",
        "number.empty": "Tipe konsumen wajib diisi",
        "any.required": "Tipe konsumen wajib diisi"
    }),
})


export {
    nikValidation,
    addCustomerValidation
}