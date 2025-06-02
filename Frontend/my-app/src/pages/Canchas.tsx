import React, {SyntheticEvent, useState} from 'react'
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCanchas,useCrearCancha } from '../hooks/useCanchas';

export const Canchas = () => {
    
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: canchas, isLoading: cargaCanchas} = useCanchas();
    const [cost, setCosto] = useState('');
    const [capacida, setCapacidad] = useState('');
    const crearCanchas = useCrearCancha();

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

    const crearCancha = (e: SyntheticEvent) => {
        e.preventDefault();
        crearCanchas.mutate({costo: Number(cost), capacidad: Number(capacida)});
        setCosto('');
        setCapacidad('');
    };  

    return (
    <div> 
        <h1>Menú de canchas</h1>
        {cargaCanchas ? (<p>Cargando canchas...</p>)
        : (
        <>
            <h2>Canchas en el sistema: </h2>
            {canchas?.length > 0 ? (
                <ul>
                    {canchas.map((c: any) => (
                        <li key = {c.id_cancha}>
                            Número: {c.id_cancha} 
                            Capacidad: {c.capacidad}
                            Costo: {c.costo}
                             <p>------------</p>
                        </li>
                    ))}
                </ul>
            ) : (<p> No hay canchas</p>)
            }
        </>
        )}
        
        <h3>Ingresar nueva cancha: </h3>
        <form onSubmit={crearCancha}>
            <p>Ingrese capacidad de la cancha: </p>
            <input type = "number" placeholder='capacidad' value={capacida} onChange={(e)=> setCapacidad(e.target.value)} required/>

            <p>Ingrese costo de la cancha:</p>
            <input type = "number" placeholder='costo' value={cost} onChange={(e)=> setCosto(e.target.value)} required/>

            <button type = "submit"> Agregar</button>
        </form>

    </div>
    );
    
};