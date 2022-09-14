import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
// import { Config } from "../constant/ApiConstant";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { LoginContext } from '../components/Context';
import LoginImage from '../../images/login-logo.svg';
import BGImage from '../../images/loginpage-bg.jpg';
import { loginUser } from '../../Apis/loginUser';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'renderer/components/ErrrorBoundary';

const ipcRenderer = window.electron.ipcRenderer;

const Login = () => {
    const { login, setLogin, setCookie } = useContext(LoginContext);
    const [state, setState] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        login && navigate('print');

        const prevLoggedInCred = async () => {
            let cred = await ipcRenderer.invoke('getLoginDetails');
            if (cred) {
                setState((prev) => {
                    return { ...prev, ...cred };
                });
            }
        };
        prevLoggedInCred();
    }, [login]);

    const handleChange = (e: any) => {
        setState((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (state.email === '') {
                confirmAlert({
                    title: 'Error',
                    message: `Please Enter All The Required Fields`,
                });
            } else {
                const { email, password } = state;

                const loginRes = await loginUser({ email, password });

                if (
                    loginRes.data.data &&
                    loginRes.data.status_code === 200
                ) {
                    loginSucces(loginRes);
                } else {
                    confirmAlert({
                        title: 'Invalid Credentails',
                        message: `Please Enter Correct Email, Password`,
                    });
                }
            }
        } catch (err) {
            confirmAlert({
                title: 'Error',
                message: `Internal Error. Try Again Once Again`,
            });
        }
    };

    const loginSucces = (loginRes: any) => {
        // axios.defaults.headers.common.Authorization = `${loginRes.data.data}`;
        ipcRenderer.sendMessage('setCredentials', {
            email: state.email,
            password: state.password,
        });
        setCookie('lastLogin', new Date());
        setCookie('userDetail', loginRes.data.data);
        localStorage.setItem('token_data', loginRes.data.data?.token_data);
        localStorage.setItem('user_name', loginRes.data.data?.user_name);
        setLogin(true);
    };

    return (
        <ErrorBoundary>
            <Row>
                <Col>
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div style={{ width: '80%' }}>
                            <section className="text-center">
                                <img src={LoginImage} width="250px" className="mb-3 " />
                            </section>
                            {/* <h4>
              <span>Tradehood</span> Printer Application
            </h4> */}
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="exampleEmail">Email</Label>
                                    <Input
                                        id="exampleEmail"
                                        name="email"
                                        placeholder="Enter Email"
                                        type="email"
                                        value={state.email}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="examplePassword">Password</Label>
                                    <Input
                                        id="examplePassword"
                                        name="password"
                                        placeholder="Enter Password"
                                        type="password"
                                        value={state.password}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </FormGroup>

                                <Button type="submit">Login</Button>
                            </form>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="gradient align-items-center  d-flex h-100">
                        <img src={BGImage} className="mb-3 img-fluid h-100" />
                    </div>
                </Col>
            </Row>
        </ErrorBoundary>
    );
};

export default Login;
