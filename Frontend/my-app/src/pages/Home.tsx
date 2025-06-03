import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useReservasVigentes } from '../hooks/useReservas';

export const Home = () => {
    
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const fecha = new Date();
    const {data: reservas, isLoading: cargaReservas} = useReservasVigentes(fecha);
    //filtro para canchas 
    const [canchaFilter, setCanchaFilter] = useState<string>('all');        

    if(!token)
    {
        
        navigate('/Login');
        return null;
    }
    
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
    }


    if(cargauser)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/login');
        return null;
    }
    
    const canchasUnicas = Array.from(new Set<number>(reservas?.map((reserva: any) => reserva.id_cancha) || [])).sort((a: number, b: number) => a - b);

    const filteredReservas = reservas?.filter((reserva: any) => {
        if (canchaFilter === 'all') return true;
        return reserva.id_cancha.toString() === canchaFilter;
    });



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

        <div style={{margin: '20px 0'}}>
            <label htmlFor="cancha-filter">Filtrar por cancha: </label>
            <select 
                id="cancha-filter"
                value={canchaFilter}
                onChange={(e) => setCanchaFilter(e.target.value)}
            >
                <option value="all">Todas las canchas</option>
                {canchasUnicas?.map(id_cancha => (
                    <option key={id_cancha} value={id_cancha}>
                        Cancha {id_cancha}
                    </option>
                ))}
            </select>
        </div>
            
        <div>
            {cargaReservas ? (<div>Cargando reservas...</div>) 
            : (
                <>
                {filteredReservas?.length > 0 ?(
                    <ul>
                           
                        {filteredReservas.map((reserva: any) => (
                            <li key={reserva.id}>
                                Cancha: {reserva.id_cancha} - Fecha: {reserva.fecha} - Hora de inicio: {reserva.hora_inicio} - Hora de salida: {reserva.hora_fin}
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