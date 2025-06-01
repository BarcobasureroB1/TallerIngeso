import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface JugadorData
{
    numero_boleta: number;
    nombres_jugador: string;
    apellidos_jugador: string;
    rut_jugador: string;
    edad_jugador: number;
}

export function useCrearJugador(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({numero_boleta,nombres_jugador,apellidos_jugador,rut_jugador,edad_jugador}:JugadorData)  => {
            const respuesta = await api.post('api/v1/jugador',{numero_boleta,nombres_jugador,apellidos_jugador,rut_jugador,edad_jugador});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['jugador']});
        }                           
    });
}