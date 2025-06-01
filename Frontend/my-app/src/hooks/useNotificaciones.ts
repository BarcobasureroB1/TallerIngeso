import {useQuery} from '@tanstack/react-query';
import api from '../api/axios';


export function useNotis() {     //pa listar las canchas
    return useQuery({
        queryKey: ['notificacion'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/notificacion');
            return respuesta.data;
        }
    });
}