import React, {SyntheticEvent, useState} from 'react'
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useReservasGenerales,useCrearReserva } from '../hooks/useReservas';
import {useAgregarSaldo} from '../hooks/useUsuarios';

export const Reservar = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: reservas,isLoading: cargaReserva} = useReservasGenerales();
    const crearReserv = useCrearReserva();
    const [rut_cliente, setRut] = useState('');
    const [fecha,setFecha] = useState('');
    const [hora_inicio, setHoraInicio] = useState('');
    const [hora_fin,setHoraFin] = useState('')
    const [id_cancha,setIDCancha] = useState('')
    const [boleta_equipamiento,setBoleta] = useState('')
    
    /*const crear = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProd.mutate({name: nombre, price: Number(precio), description: descripcion, method: metodo});
        setNombre('');
        setPrecio('');
        setDescripcion('');
        setMetodo('');
    };
    */

    if(!token)
    {
        navigate('/Login');
        return null;
    }
    
    if(cargauser)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/Login');
        return null;
    }

    return (
    <div> 
        
        <h2> Bienvenido: {user?.rut}, tu saldo actual es: ${user?.saldo} </h2>
        

        <button onClick={()=> navigate('/ReservasUsuario')}>Ver tus reservas</button>
        
    </div>
    );
    
};

