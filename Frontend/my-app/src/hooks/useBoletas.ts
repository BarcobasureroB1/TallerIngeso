import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';
import { error } from 'console';

interface BoletaData
{
    numero_boleta: number;
    nombre_equipamiento: string;
    cantidad: number; 
}

interface BoletaResponse
{
    message : string;
}

export function useCrearBoleta (onSuccess: () => void, onFail:(error:string)=>void){ 
    const clienteQuery = useQueryClient();
    return useMutation<BoletaResponse,AxiosError,BoletaData>({
        mutationFn: async ({numero_boleta,nombre_equipamiento,cantidad}:BoletaData): Promise<BoletaResponse>  => {
            const respuesta = await api.post('api/v1/boletas',{numero_boleta, nombre_equipamiento, cantidad});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['boletas']});
            onSuccess();
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error...';
            onFail(mensaje);
        }                           
    });
}