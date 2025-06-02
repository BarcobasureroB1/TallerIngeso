import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useNotis } from '../hooks/useNotificaciones';

export const Notificacion = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: Notis, isLoading: cargaNotis} = useNotis(user.rut);

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
    
   
    return (
    <div> 
        <h1>Notificaciones</h1>
            {cargaNotis? (<p>Cargando Notificaciones...</p>)
            : (
            <>
                <p>------------------------------</p>
                {Notis?.length > 0 ? (
                    <ul>
                        {Notis.map((n: any) => (
                            <li key = {n.id}> 
                                <span>{user.nombre}, {n.mensaje}</span>
                                 <p>------------</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p> No hay Equipamiento</p>)
                }
            </>
            )}

    </div>
    );
    
};

export default Notificacion;