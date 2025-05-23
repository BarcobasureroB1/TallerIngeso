import React, {SyntheticEvent, useState} from 'react';
import { useReservasGenerales} from '../hooks/useReservas';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const HistorialReservas = () => 
{
    
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: reservas,isLoading: cargaReserva} = useReservasGenerales();

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
        <h1>Historial de reservas</h1>
        {cargaReserva ? (<p>Cargando reservas...</p>)
        : (
        <>
            <h2>Reservas pedidas: </h2>
            {reservas?.length > 0 ? (
                <ul>
                    {reservas.map((p: any) => (
                        <li key = {p.id_reserva}>
                            <p>Rut del cliente: </p> {p.rut}
                            <p>Fecha: </p> {p.fecha}
                            <p>Hora de inicio de la reserva - Hora final de la reserva: </p> {p.hora_inicio} - {p.hora_fin}
                            <p>Cancha de la reserva: </p> {p.id_cancha}
                            <p>Equipamiento de la reserva: </p>

                            {p.equipamientos?.length > 0 ? (
                                <ul>
                                    {p.equipamientos.map((e: any) => (
                                        <li key = {e.nombre}>
                                            <p></p> {e.nombre}
                                            <p></p> {e.tipo}
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p>No hay equipamiento.</p>)
                            }
                        </li>
                    ))}
                </ul>
            ) : (<p>No hay reservas</p>)
            }
        </>
        )}
        
        <button onClick={()=> navigate('/Home')}>Volver a Home</button>
    </div>
  );
};