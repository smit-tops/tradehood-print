import axios from "axios"
import { Config } from "../constant/ApiConstant"
import { getUpdateLabelFormData } from "./utils/getFormData";

export const updateLabelFlag = async (ids : string[]) => {
    try {
        const formData = getUpdateLabelFormData(ids)

        return axios.post(
            `${Config.BaseUrl}${Config.UpdateList}`,
            formData,
        );
    } catch (error) {
        return false
    }
}