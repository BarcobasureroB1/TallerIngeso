import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Logindata {
    rut: string;
    password: string;
}



export function useLogin(onSuccess: (token: string)=> void, onFail:(error:string)=> void) {
    return useMutation<string,AxiosError,Logindata>({
        mutationFn: async ({rut,password}: Logindata): Promise<string> => {
            const respuesta = await api.post('api/v1/auth/Login', {rut,password});
            console.log(respuesta.data);
            return respuesta.data;
        },
        onSuccess: (data) => {
            console.log('Login exitoso', data);
            onSuccess(data);
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }

    });
}