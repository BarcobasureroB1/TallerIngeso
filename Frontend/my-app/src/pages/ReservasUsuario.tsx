import React, {SyntheticEvent, useState} from 'react';
import { useReservas, useEliminarReserva } from '../hooks/useReservas';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const Reserva = () => 
{
    
    const {token, setToken} = useAuth();
    const eliminarReser = useEliminarReserva();
    const navigate = useNavigate();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: reservas,isLoading: cargaReserva} = useReservas(user.rut);

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
                            <p>Rut del cliente: </p> {p.cliente.rut}
                            <p>Fecha: </p> {p.fecha}
                            <p>Hora de inicio de la reserva - Hora final de la reserva: </p> {p.hora_inicio} - {p.hora_fin}
                            <p>Cancha de la reserva: </p> {p.cancha.id_cancha}
                            <p>Equipamiento de la reserva: </p>

                            {p.equipamientoAsignado?.length > 0 ? (
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
                            
                            <button onClick={() => eliminarReser.mutate(p.id_reserva)}>Cancelar Reserva</button>
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