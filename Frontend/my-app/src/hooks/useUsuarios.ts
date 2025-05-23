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
            clienteQuery.invalidateQueries({queryKey:['usuarios']});
        }                            //revisar como mostrar el error de agregar saldo
    });

}