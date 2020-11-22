import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom'
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import UserContext from './context/UserContext';
import Dashboard from './components/Dashboard/Dashboard';
import Axios from 'axios';
import Board from './components/Dashboard/Board/Board';
require('dotenv').config({
    path: '../.env'
});


export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });
    useEffect(() => {
        const CheckLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                localStorage.setItem("user-name","");
                token = "";
            }
            const tokenRes = await Axios.post
                ( "/api/users/tokenIsValid", null, {
                    headers: { "x-auth-token": token },
                });
            if (tokenRes.data) {
                const userRes = await Axios.get( "/api/users/", { headers: { "x-auth-token": token } });
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        } 

        CheckLoggedIn();
    }, []);

    return (
        <BrowserRouter>
            <UserContext.Provider value={{ userData, setUserData }}>
                <Switch>
                    <Route exact path='/' >
                        <Redirect to='/login'></Redirect>
                    </Route>
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route path='/dashboard' component={Dashboard} />
                    <Route path='/board' component={Board} />
                </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    );
}
