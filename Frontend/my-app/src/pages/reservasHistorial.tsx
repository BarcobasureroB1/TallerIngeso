import React, {SyntheticEvent, useState} from 'react';
import { useReservas, eliminarReserva } from '../hooks/useReservas';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Reserva = () => 
{
    const {data: reservas,isLoading: cargaReserva} = useReservas();
    const {data: equipamientos,isLoading: cargaEquipamiento} = reservas.equipamientos;

    const eliminarReser = eliminarReserva();

    const navigate = useNavigate();
      
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
                            {cargaEquipamiento ? (<p>Cargando equipamiento...</p>) 
                            : (
                                <>
                                    {equipamientos?.length > 0 ? (
                                        <ul>
                                            {equipamientos.map((e: any) => (
                                                <li key = {e.nombre}>
                                                    <p></p> {e.nombre}
                                                    <p></p> {e.tipo}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (<p>No hay equipamiento</p>)
                                    }
                                </>
                            )}
                            
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