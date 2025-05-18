import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';
import { error } from 'console';
import { useUserProfile } from '../hooks/useUserProfile';

interface ReservaData
{
    rut: string;
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

const { data: user, isLoading: cargauser, isError} = useUserProfile();

export function useReservas(rutUser: string) {     //pa listar las reservas
    return useQuery({
        queryKey: ['reserva', rutUser],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/reserva',{params:{rut_cliente: rutUser}});
            return respuesta.data;
        }
    });
}


export function crearReserva (onSuccess: () => void, onFail:(error:string)=>void){ 
    const clienteQuery = useQueryClient();
    return useMutation<ReservarResponse,AxiosError,ReservaData>({
        mutationFn: async ({rut, fecha, hora_inicio, hora_fin, id_cancha, boleta_equipamiento}:ReservaData): Promise<ReservarResponse> => {
            const respuesta = await api.post('api/v1/reserva',{rut, fecha, hora_inicio, hora_fin, id_cancha, boleta_equipamiento});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error...';
            onFail(mensaje);
        }

    });
}

export function eliminarReserva(){   
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id_reserva: number) => {
            await api.patch(`api/v1/reserva/${id_reserva}`, {cancelado: true});
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        }
    });

}