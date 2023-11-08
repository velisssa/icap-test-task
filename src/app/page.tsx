'use client'
import React from "react";
import './page.scss'
import {IconButton} from "@mui/material";
import {useEffect, useState} from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from "@mui/material/Button";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {useRouter} from "next/navigation";
import {usePostLoginMutation} from "../redux/features/table.api";
import {ILoginResult} from "../models/interfaces";

export default function Home() {
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [postLogin, {data}] = usePostLoginMutation();
    const [loginResult, setLoginResult] = useState<ILoginResult>({});
    const router = useRouter();

    let [loginData, setLoginData] = useState({
        username: '',
        password: '',
    })

    const handleSetIsVisiblePassword = () => {
        setIsVisiblePassword(!isVisiblePassword);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const result = await postLogin(loginData);
            setLoginResult(result);
            console.log('POST LOGIN RESULT - ', result)
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (loginResult?.data) {
            if (typeof window !== 'undefined') {localStorage.setItem('user', 'exist')}
            router.push('/table');
        }
    }, [loginResult]);

    return (
        <main className='login'>
            <ValidatorForm className='login__form' onSubmit={(event) => handleLogin(event)}>
                <TextValidator
                    className='login__input login__input-username'
                    value={loginData.username}
                    name='username'
                    type='text'
                    label='Username'
                    variant="standard"
                    onChange={(event) => setLoginData({...loginData, username: event.target.value})}
                    validators={['required', 'maxStringLength:150']}
                    errorMessages={['Required field.', 'Max length is 150 characters.']}
                />

                <div className='login__password'>
                    <TextValidator
                        className='login__input login__input-password'
                        value={loginData.password}
                        name='password'
                        type={isVisiblePassword ? 'text' : 'password'}
                        label='Password'
                        variant="standard"
                        onChange={(event) => setLoginData({...loginData, password: event.target.value})}
                        validators={['required', 'maxStringLength:128']}
                        errorMessages={['Required field.', 'Max length is 128 characters.']}
                    />
                    <IconButton aria-label="toggle password visibility" onClick={handleSetIsVisiblePassword}>
                        {isVisiblePassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>

                    {loginResult?.error && (
                        <p className='login__error'>{loginResult.error?.data?.error}</p>
                    )}
                </div>

                <Button type='submit' variant="outlined">Login</Button>
            </ValidatorForm>
        </main>
    )
}