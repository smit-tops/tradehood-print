import axios from 'axios';
import { Config } from '../constant/ApiConstant';
import {  getTokenFormData } from './utils/getFormData';
// import { mockData } from "../constant/mockData"

export const fetchPrintLabel = async () => {
  // return mockData
  try {
    const formData = getTokenFormData()
    let res = await axios.post(
      `${Config.BaseUrl}${Config.PrintList}`,
      formData
    );
    if (res.data.status_code === 200) {
      return res.data.data;
    }

    if (
      res.data.status_code === 204 &&
      res.data.message.includes('No records found')
    ) {
      return [];
    }
  } catch (error) {
    console.log('Error in Getlist', error);
  }
};
