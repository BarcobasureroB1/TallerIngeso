import {useQuery} from '@tanstack/react-query';
import api from '../api/axios';


export function useUserProfile(){
    return useQuery({
        queryKey:['user'],
        queryFn: async () => {
            console.log("consultando el perfil");
            const respuesta = await api.get('api/v1/auth/profile');
            
            return respuesta.data;
        },
    });
}