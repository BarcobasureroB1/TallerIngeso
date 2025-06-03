import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface EquipData{
    nombre: string;
    stock: number;
    tipo: string;
    costo: number;
}

export function useEquipamiento() {     //pa listar el equipamiento
    return useQuery({
        queryKey: ['equipamento'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/equipamento');
            return respuesta.data;
        }
    });
}

export function useCrearEquipamiento(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({nombre, stock, tipo, costo}:EquipData)  => {
            const respuesta = await api.post('api/v1/equipamento',{nombre, stock, tipo, costo});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['equipamento']});
        }                           
    });
}