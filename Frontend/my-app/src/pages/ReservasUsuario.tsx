import React, {SyntheticEvent, useState} from 'react';
import { useReservas, useEliminarReserva, useModificarCancha, useModificarFechaHora } from '../hooks/useReservas';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useCanchas } from '../hooks/useCanchas';


export const Reserva = () => 
{
    
    const {token, setToken} = useAuth();
    const eliminarReser = useEliminarReserva();
    const modificarCancha = useModificarCancha();
    const modificarFechaHora = useModificarFechaHora();
    const navigate = useNavigate();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: reservas,isLoading: cargaReserva} = useReservas(user?.rut);
    const { data: canchas, isLoading: cargaCanchas } = useCanchas();

    const [modificandoCanchaId, setModificandoCanchaId] = useState<number | null>(null);
    const [modificandoFechaHoraId, setModificandoFechaHoraId] = useState<number | null>(null);

    const [nuevaCancha, setNuevaCancha] = useState(0);
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevaHoraInicio, setNuevaHoraInicio] = useState('');
    const [nuevaHoraFin, setNuevaHoraFin] = useState('');
    const [error, setError] = useState<string | null>(null);

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
    
    //para cerrar otros formularios abiertos.
    const iniciarModificacionCancha = (reserva: any) => {
        setModificandoCanchaId(reserva.id_reserva);
        setNuevaCancha(reserva.cancha.id_cancha);
        setModificandoFechaHoraId(null); 
        setError(null);
    };

    const iniciarModificacionFechaHora = (reserva: any) => {
        setModificandoFechaHoraId(reserva.id_reserva);
        setNuevaFecha(reserva.fecha.split('T')[0]);
        setNuevaHoraInicio(reserva.hora_inicio);
        setNuevaHoraFin(reserva.hora_fin);
        setModificandoCanchaId(null);
        setError(null);
    };

    const cancelarModificacion = () => {
        setModificandoCanchaId(null);
        setModificandoFechaHoraId(null);
        setError(null);
    };

    const handleModificarCancha = (idReserva: number) => {
        if (!nuevaCancha) {
            setError('Debe seleccionar una cancha válida');
            return;
        }

        modificarCancha.mutate(
            { id_reserva: idReserva, id_cancha: nuevaCancha, admin: user.admin },
            {
                onError: (error: any) => {
                    setError(error.response?.data?.message || 'Error al modificar la cancha');
                },
                onSuccess: () => {
                    cancelarModificacion();
                }
            }
        );
    };

    const handleModificarFechaHora = (idReserva: number) => {
        if (!nuevaFecha || !nuevaHoraInicio || !nuevaHoraFin) {
            setError('Todos los campos son requeridos');
            return;
        }

        modificarFechaHora.mutate(
            { 
                id_reserva: idReserva, 
                fecha: new Date(nuevaFecha),
                hora_inicio: nuevaHoraInicio,
                hora_fin: nuevaHoraFin,
                admin: user.admin
            },
            {
                onError: (error: any) => {
                    setError(error.response?.data?.message || 'Error al modificar fecha/hora');
                },
                onSuccess: () => {
                    cancelarModificacion();
                }
            }
        );
    };

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
                        <li key = {p.id_reserva} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
                            <p><strong>Rut del cliente:</strong> {p.cliente.rut}</p>
                            <p><strong>Fecha:</strong> {p.fecha}</p>
                            <p><strong>Hora:</strong> {p.hora_inicio} - {p.hora_fin}</p>
                            <p><strong>Cancha:</strong> {p.cancha.id_cancha}</p>
                            <p><strong>Equipamiento:</strong></p>

                            {p.equipamientoAsignado?.length > 0 ? (
                                <ul>
                                    {p.equipamientoAsignado.map((e: any) => (
                                        <li key = {e.nombre}>
                                            {e.nombre} - {e.cantidad}
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p>No hay equipamiento.</p>)
                            }
                            <p>Jugadores: </p>
                            {p.jugadores?.length > 0 ? (
                                <ul>
                                    {p.jugadores.map((j: any) => (
                                        <li key = {j.nombre}>
                                            {j.nombre} {j.apellidos} (Rut: {j.rut}, Edad: {j.edad})
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p>No hay jugadores.</p>)
                            }
                            
                            <div>
                                    <button 
                                        onClick={() => eliminarReser.mutate({id_reserva: p.id_reserva,admin: user.admin})}
                                        style={{ marginRight: '10px', padding: '5px 10px' }}
                                    >
                                        Cancelar Reserva
                                    </button>
                                    <button 
                                        onClick={() => iniciarModificacionCancha(p)}
                                        style={{ marginRight: '10px', padding: '5px 10px' }}
                                        disabled={modificandoCanchaId === p.id_reserva}
                                    >
                                        Modificar Cancha
                                    </button>
                                    <button 
                                        onClick={() => iniciarModificacionFechaHora(p)}
                                        style={{ padding: '5px 10px' }}
                                        disabled={modificandoFechaHoraId === p.id_reserva}
                                    >
                                        Modificar Fecha/Hora
                                    </button>
                            </div>

                            {modificandoCanchaId === p.id_reserva && (
                                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                                    <h3>Modificar Cancha</h3>
                                    {cargaCanchas ? (
                                        <p>Cargando canchas disponibles...</p>
                                    ) : (
                                        <div>
                                            <select
                                                value={nuevaCancha}
                                                onChange={(e) => setNuevaCancha(Number(e.target.value))}
                                                style={{ padding: '5px', marginRight: '10px' }}
                                            >
                                                {canchas?.map((cancha: any) => (
                                                    <option key={cancha.id_cancha} value={cancha.id_cancha}>
                                                        Cancha {cancha.id_cancha} - ${cancha.costo} (Capacidad: {cancha.capacidad})
                                                    </option>
                                                ))}
                                            </select>
                                                
                                            <button 
                                                onClick={() => handleModificarCancha(p.id_reserva)}
                                                style={{ marginRight: '10px', padding: '5px 10px' }}
                                                disabled={modificarCancha.isPending}
                                            >
                                                {modificarCancha.isPending ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button 
                                                onClick={cancelarModificacion}
                                                style={{ padding: '5px 10px' }}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {modificandoFechaHoraId === p.id_reserva && (
                                    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                                        <h3>Modificar Fecha y Hora</h3>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Nueva Fecha: </label>
                                            <input
                                                type="date"
                                                value={nuevaFecha}
                                                onChange={(e) => setNuevaFecha(e.target.value)}
                                                style={{ padding: '5px' }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Hora de Inicio: </label>
                                            <input
                                                type="time"
                                                value={nuevaHoraInicio}
                                                onChange={(e) => setNuevaHoraInicio(e.target.value)}
                                                style={{ padding: '5px' }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Hora de Fin: </label>
                                            <input
                                                type="time"
                                                value={nuevaHoraFin}
                                                onChange={(e) => setNuevaHoraFin(e.target.value)}
                                                style={{ padding: '5px' }}
                                            />
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleModificarFechaHora(p.id_reserva)}
                                            style={{ marginRight: '10px', padding: '5px 10px' }}
                                            disabled={modificarFechaHora.isPending}
                                        >
                                            {modificarFechaHora.isPending ? 'Guardando...' : 'Guardar'}
                                        </button>
                                        <button 
                                            onClick={cancelarModificacion}
                                            style={{ padding: '5px 10px' }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}

                                {error && modificandoCanchaId === p.id_reserva || modificandoFechaHoraId === p.id_reserva ? (
                                    <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay reservas</p>)}
            </>
            )}
        <button onClick={()=> navigate('/Home')}>Volver a Home</button>
    </div>
  );
};