import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';
import { error } from 'console';


export function useAgregarSaldo(){   
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (saldoAgregado: number) => {
            await api.post(`api/v1/usuarios/agregar-saldo`, {saldo: saldoAgregado});	
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuarios/agregar-saldo']});
        }                            //revisar como mostrar el error de agregar saldo
    });

}

export function useSaldoUsuario(rutUser: string) {     //pa listar las reservas
    return useQuery({
        queryKey: ['saldo', rutUser],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/usuarios/saldo/${rutUser}`);
            return respuesta.data;
        }
    });
}