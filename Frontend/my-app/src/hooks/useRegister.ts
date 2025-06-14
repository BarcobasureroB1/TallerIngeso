import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Registerdata
{
    rut: string;
    nombre: string;
    correo: string;
    password: string;
}

interface Registerresponse
{
    message: string;
}

export function useRegister(onSuccess: () => void, onFail:(error:string)=>void) {
    return useMutation<Registerresponse,AxiosError,Registerdata>({
        mutationFn: async ({rut,nombre, correo, password}:Registerdata): Promise<Registerresponse> => {
            const respuesta = await api.post('api/v1/auth/register',{rut,nombre, correo, password});
            return respuesta.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error...';
            onFail(mensaje);
        }
    })
}