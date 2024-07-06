import customerService from "../service/customer-service.js";


const cekNik = async (req, res, next) => {
    try {
        const result = await customerService.cekNik(req.body);
        res.status(200).json({
            data: result,
            ok: true
        });
    } catch (error) {
        
        next(error);
    }
}

const register = async (req, res, next) => {
    try {
       
        const result = await customerService.register(req);
        res.status(200).json({
            data: result,
            ok: true
        });
    } catch (error) {
        
        next(error);
    }
}
const customerType = async (req, res, next) => {
    try {
       
        const result = await customerService.countType();
        res.status(200).json({
            ok: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export default {
    cekNik,
    register,
    customerType
}