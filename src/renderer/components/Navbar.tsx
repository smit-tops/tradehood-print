import React, { useContext } from 'react';
import { LoginContext } from './Context';
import LoginImage from '../../images/navbar-logo.svg';
import { Link } from 'react-router-dom';

function Navbar() {
  const { setLogin, cookies, removeCookie } = useContext(LoginContext);
  const logout = () => {
    localStorage.clear();
    removeCookie('userDetail');
    removeCookie('lastLogin');
    setLogin(false);
    window.location.reload();
  };

  return (
    <div className="navbar-tab p-2 px-5">
      <Link to={'/print'}>
        <img
          src={LoginImage}
          alt="user-img"
          width="75"
          className="mx-1 logo-img"
        />
      </Link>
      <div className="w-100 mx-auto">
        <h4>Printer Application</h4>
      </div>

      <div className="dropdown animated flipIY  me-3">
        <button
          className="bg-transparent border-0 dropdown-toggle p-0"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="text-white">{localStorage.getItem("user_name")}</span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <Link to={'/print'}>
            <li className="dropdown-item">
              <button type='button' className="bg-transparent border-0 p-0">
                <i className="fa fa-print"></i> Print
              </button>
            </li>
          </Link>
          <Link to={'/settings'}>
            <li className="dropdown-item">
              <button type='button' className="bg-transparent border-0 p-0">
                <i className="fa fa-gear"></i> Settings
              </button>
            </li>
          </Link>
          <li className="dropdown-item" onClick={logout}>
            <button className="bg-transparent border-0 p-0">
              <i className="fa fa-power-off"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
