import Joi from "joi"
import JoiDate from '@joi/date';

const joi_format = Joi.extend(JoiDate)

const newTransactionGasValidation = Joi.object({
    nik: Joi.string().max(16).min(16).pattern(new RegExp("^[0-9]")).required(),
    inputDate: joi_format.date().format('YYYY-MM-DDTHH:mm').required(),
    countBuy: Joi.number().positive().required()
})