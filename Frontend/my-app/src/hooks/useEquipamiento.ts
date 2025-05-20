import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';


export function useEquipamiento() {     //pa listar el equipamiento
    return useQuery({
        queryKey: ['equipamento'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/equipamento');
            return respuesta.data;
        }
    });
}

