import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface CanchaData{
    costo: number;
    capacidad: number;
}

export function useCanchas() {     //pa listar las canchas
    return useQuery({
        queryKey: ['cancha'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/cancha');
            return respuesta.data;
        }
    });
}

export function useCrearCancha(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({costo, capacidad}:CanchaData)  => {
            const respuesta = await api.post('api/v1/cancha',{costo, capacidad});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['cancha']});
        }                           
    });
}