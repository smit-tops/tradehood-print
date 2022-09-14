import axios from 'axios';
import { Config } from '../constant/ApiConstant';
import { sendPrintersFormData } from './utils/getFormData';

export const sendPrinters = async (printers: any) => {
  try {
    const formData = sendPrintersFormData(printers);

    return await axios.post(`${Config.BaseUrl}${Config.SetPrinters}`, formData);
  } catch (error) {
    return false;
  }
};
