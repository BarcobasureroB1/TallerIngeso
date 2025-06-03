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
    equipamiento: boolean;
    cantidad_jugadores: number;
    admin: boolean;
}

interface CancelarResponse
{
    message : string;
}

interface ReservarResponse
{
    message : string;
    id_boleta: number;
    cantidadJugadores: number;
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

export function useReservasVigentes(fechaActual: Date) {     //pa listar las reservas que estén después de la fecha actual.
    return useQuery({
        queryKey: ['reserva', fechaActual],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/reserva',{params:{fecha: fechaActual}});
            return respuesta.data;
        }
    });
}

export function useCrearReserva (onSuccess: (data: ReservarResponse) => void, onFail:(error:string)=>void){ 
    const clienteQuery = useQueryClient();
    return useMutation<ReservarResponse,AxiosError,ReservaData>({
        mutationFn: async ({rut_cliente, fecha, hora_inicio, hora_fin, id_cancha,equipamiento,cantidad_jugadores,admin}:ReservaData): Promise<ReservarResponse>  => {
            const respuesta = await api.post('api/v1/reserva',{rut_cliente, fecha, hora_inicio, hora_fin, id_cancha, equipamiento,cantidad_jugadores,admin});

            if (!respuesta.data || !respuesta.data.id_boleta) {
                throw new Error('La respuesta del servidor no contiene id_boleta');
            }
            
            return respuesta.data;
        },
        onSuccess: (data) => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
            onSuccess(data);
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error...';
            onFail(mensaje);
        }                           
    });
}

export function useEliminarReserva(){   
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (eliminacion:{id_reserva: number, admin: boolean}) => {
            await api.patch(`api/v1/reserva/${eliminacion.id_reserva}`, {eliminacion})
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        }                            
    });

}

export function useModificarCancha(){   
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (modificacionCancha:{id_reserva: number, id_cancha: number, admin: boolean}) => {
            await api.patch(`api/v1/reserva`,modificacionCancha)

        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        }                          
    });

}

export function useModificarFechaHora(){   
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (modificacionCanchaF:{id_reserva: number, fecha: Date, hora_inicio: string, hora_fin: string, admin: boolean}) => {
            await api.patch(`api/v1/reserva`,modificacionCanchaF)

        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        }                          
    });

}