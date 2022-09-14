export const getTokenFormData = () => {
  const formData = new FormData();
  formData.append('token_data', localStorage.getItem('token_data') || '');
  return formData;
};

export const getAuthFormData = (params: {
  email: string;
  password: string;
}) => {
  const formData = new FormData();
  formData.append('email', params.email);
  formData.append('password', params.password);
  return formData;
};

export const getUpdateLabelFormData = (ids: string[]) => {
  const formData = getTokenFormData();
  ids.map((id: string) => {
    formData.append('id[]', id);
  });
  return formData;
};

export const sendPrintersFormData = (printers: any) => {
  const formData = getTokenFormData();
  printers.map((printer: any, index: number) => {
    formData.append(`printer[${index}][deviceid]`, (index + 1).toString());
    formData.append(`printer[${index}][printer_name]`, printer.label);
  });
  return formData;
};
