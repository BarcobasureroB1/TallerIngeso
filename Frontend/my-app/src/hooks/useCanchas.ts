import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';



export function useCanchas() {     //pa listar las canchas
    return useQuery({
        queryKey: ['cancha'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/cancha');
            return respuesta.data;
        }
    });
}