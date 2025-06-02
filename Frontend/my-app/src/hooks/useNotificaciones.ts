import {useQuery} from '@tanstack/react-query';
import api from '../api/axios';

export function useNotis(rutUser: string) {    //listar notificaciones.
    return useQuery({
        queryKey: ['notificacion', rutUser],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/notificacion',{params:{rut_usuario: rutUser}});
            return respuesta.data;
        }
    });
}