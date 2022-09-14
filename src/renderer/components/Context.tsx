import React, { createContext, ReactElement, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface ILoginContext {
  login?: boolean;
  setLogin?: any;
  cookies?: any;
  setCookie?: any;
  removeCookie?: any;
  selectedPrinter: {
    boxPrinter: string;
    labelPrinter: string;
  };
  setSelectedPrinter?: any;
  printers?: any;
  setPrinters?: any;
}

const LoginContext = createContext<ILoginContext>({
  selectedPrinter: {
    boxPrinter: '',
    labelPrinter: '',
  },
});

function Context({ children }: { children: ReactElement }) {
  const [login, setLogin] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [selectedPrinter, setSelectedPrinter] = useState({
    boxPrinter: '',
    labelPrinter: '',
  });
  const [printers, setPrinters] = useState([]);
  useEffect(() => {
    if (cookies.userDetail) {
      setLogin(true);
    }
  }, []);

  return (
    <LoginContext.Provider
      value={{
        login,
        setLogin,
        cookies,
        setCookie,
        removeCookie,
        selectedPrinter,
        setSelectedPrinter,
        printers,
        setPrinters,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export { LoginContext };
export default Context;
