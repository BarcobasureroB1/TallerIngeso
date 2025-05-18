import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface ReservaData
{
    rut: string;
    fecha: Date;
    hora_inicio: string;
    hora_fin: string;
    id_cancha: number;
    boleta_equipamiento: number;
}


export function useReservas() {     //pa listar las reservas
    return useQuery({
        queryKey: ['reserva'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/reserva');
            return respuesta.data;
        },
    });
}


export function crearReserva (){ 
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({rut, fecha, hora_inicio, hora_fin, id_cancha, boleta_equipamiento}:ReservaData) => {
            const respuesta = await api.post('api/v1/reserva',{rut, fecha, hora_inicio, hora_fin, id_cancha, boleta_equipamiento});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        },
    });
}

export function eliminarReserva(){   
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id_reserva: number) => {
            await api.delete(`api/v1/reserva/${id_reserva}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reserva']});
        },
    });

}