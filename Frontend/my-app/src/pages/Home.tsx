import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useReservasVigentes } from '../hooks/useReservas';

export const Home = () => {
    
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();

    const {data: reservas, isLoading: cargaReservas} = useReservasVigentes();     

    useEffect(() => {
        if (!token) {
            navigate('/Login');
        }
    }, [token, navigate]);

    
    useEffect(() => {
        if (isError) {
            setToken(null);
            navigate('/login');
        }
    }, [isError, setToken, navigate]);
    
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
    }


    if(cargauser || !user)
    {
        return <div> Cargando... </div>;
    }
    

    return (
    <div> 
        <h3> Bienvenido: {user?.nombre}</h3>
        <button onClick={()=> navigate('/Reservar')}>Reservar Canchas</button>
        {user.admin === false && (
            <>
                <button onClick={()=> navigate('/ReservasUsuario')}>Ver tus reservas</button>
                <button onClick={()=> navigate('/Notificacion')}>Revisa tus notificaciones</button>
            
            </>
        )}

        {user.admin === true && (
            <>
                <button onClick={()=> navigate('/reservasHistorial')}>Ver historial de reservas</button>
                <button onClick={()=> navigate('/Canchas')}>Gestionar canchas</button>
                <button onClick={()=> navigate('/Equipamientos')}>Gestionar Equipamiento</button>
            </>
        )}
        <button onClick={logout}>Cerrar la sesion 🤑</button>

        <h2>Reservas tomadas:  </h2>
        <h5>Porfavor, revise las reservas vigentes antes de reservar.</h5>
       
        <div>
            {cargaReservas ? (<div>Cargando reservas...</div>) 
            : (
                <>
                {reservas?.length > 0 ?(
                    <ul>
                           
                        {reservas.map((reserva: any) => (
                            <li key={reserva.id_reserva}>
                                Cancha: {reserva.cancha.id_cancha} - Fecha: {reserva.fecha} - Hora de inicio: {reserva.hora_inicio} - Hora de salida: {reserva.hora_fin}
                                <p>---------------------------------------------------</p>
                            </li>
                        ))}
                    </ul>
                ):(<>No hay reservas</>)}

                </>
            )}
        </div>

    </div>
    );
    
};

export default Home;