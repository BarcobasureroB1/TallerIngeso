import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';
import { error } from 'console';

interface ReservaData
{
    rut_cliente: string;
    fecha: Date;
    hora_inicio: string;
    hora_fin: string;
    id_cancha: number;
    boleta_equipamiento: number;
}

interface CancelarResponse
{
    message : string;
}

interface ReservarResponse
{
    message : string;
}


export function useReservas(rutUser: string) {     //pa listar las reservas
    return useQuery({
        queryKey: ['reserva', rutUser],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/reserva',{params:{rut_cliente: rutUser}});
            return respuesta.data;
        }
    });
}

export function useReservasGenerales() {     //pa listar TODAS las reservas
    return useQuery({
        queryKey: ['reserva'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/reserva');
            return respuesta.data;
        }
    });
}

export function useCrearReserva (){ 
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({rut_cliente, fecha, hora_inicio, hora_fin, id_cancha, boleta_equipamiento}:ReservaData) => {
            const respuesta = await api.post('api/v1/reserva',{rut_cliente, fecha, hora_inicio, hora_fin, id_cancha, boleta_equipamiento});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        }                           //revisar como mostrar el error de crear reservas
    });
}

export function useEliminarReserva(){   
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id_reserva: number) => {
            await api.patch(`api/v1/reserva/${id_reserva}`)
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        }                            //revisar como mostrar el error de eliminar reservas
    });

}