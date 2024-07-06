import Joi from "joi"


const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required().messages({
        "string.empty": "Nama pengguna tidak boleh kosong",
        "string.base": "Nama pengguna tidak sesuai",
        "string.max": "Maksimal nama pengguna 100 karakter",
        "any.required": "Nama pengguna tidak boleh kosong"
    }),
    password: Joi.string().max(100).required().messages({
        "string.empty": "Kata sandi tidak boleh kosong",
        "string.base": "Kata sandi tidak sesuai",
        "string.max": "Maksimal kata sandi 100 karakter",
        "any.required": "Kata sandi tidak boleh kosong"
    }),
})

const emailUserValidation = Joi.object({
    email: Joi.string().max(100).pattern(new RegExp("^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@gmail\.com$")).required().messages({
        "string.base": "Email tidak boleh kosong",
        "string.empty": "Email tidak boleh kosong",
        "string.max": "Maksimal email 100 karakter",
        "any.required": "Email tidak boleh kosong",
        "string.pattern.base": "Bukan akun gmail"
    }),
})

const codeOtpUserValidation = Joi.object({
    code: Joi.string().min(6).max(6).required().messages({
        "string.base": "Wajib diisi",
        "string.empty": "Wajib diisi",
        "string.max": "Maksimal 6 karakter",
        "string.min": "Minimal 6 karakter",
        "any.required": "Kode wajib terisi",
    }),
    email: Joi.string().max(100).pattern(new RegExp("^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@gmail\.com$")).required().messages({
        "string.base": "Email tidak boleh kosong",
        "string.empty": "Email tidak boleh kosong",
        "string.max": "Maksimal email 100 karakter",
        "any.required": "Email tidak boleh kosong",
        "string.pattern.base": "Bukan akun gmail"
    }),
})

const repassUserValidation = Joi.object({
    code: Joi.string().min(6).max(6).required().messages({
        "string.base": "Wajib diisi",
        "string.empty": "Wajib diisi",
        "string.max": "Maksimal 6 karakter",
        "string.min": "Minimal 6 karakter",
        "any.required": "Kode wajib terisi",
    }),
    email: Joi.string().max(100).pattern(new RegExp("^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@gmail\.com$")).required().messages({
        "string.base": "Email tidak boleh kosong",
        "string.empty": "Email tidak boleh kosong",
        "string.max": "Maksimal email 100 karakter",
        "any.required": "Email tidak boleh kosong",
        "string.pattern.base": "Bukan akun gmail"
    }),
    newPass: Joi.string().min(6).max(100).required().messages({
        "string.empty": "Kata sandi tidak boleh kosong",
        "string.base": "Kata sandi tidak boleh kosong",
        "string.min": "Minimal kata sandi 6 karakter",
        "string.max": "Maksimal kata sandi 100 karakter",
        "any.required": "Kata sandi tidak boleh kosong",
    }),
    reNewPass: Joi.string().min(6).max(100).required().messages({
        "string.empty": "Kata sandi tidak boleh kosong",
        "string.base": "Kata sandi tidak boleh kosong",
        "string.min": "Minimal kata sandi 6 karakter",
        "string.max": "Maksimal kata sandi 100 karakter",
        "any.required": "Kata sandi konfirmasi tidak boleh kosong",
    }),
})

const logoutUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    token: Joi.string().max(100).required(),
})

export {
    loginUserValidation,
    emailUserValidation,
    codeOtpUserValidation,
    repassUserValidation,
    logoutUserValidation
}