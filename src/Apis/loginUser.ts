import axios from "axios";
import { Config } from "../constant/ApiConstant";
import { getAuthFormData } from "./utils/getFormData";

export const loginUser = async (params : {email : string , password : string}) => {
    const formData = getAuthFormData(params)
    return await axios.post(`${Config.BaseUrl}${Config.Login}`, formData);
}