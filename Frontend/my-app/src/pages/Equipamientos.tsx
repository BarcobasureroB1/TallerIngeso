import React, {SyntheticEvent, useState} from 'react'
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useEquipamiento, useCrearEquipamiento} from '../hooks/useEquipamiento'; 

export const Equipamientos = () => {
    
    const {token, setToken} = useAuth();
        const navigate = useNavigate();
        const {data: user, isLoading: cargauser, isError} = useUserProfile();
        const {data: equipamientos, isLoading: cargaEquip} = useEquipamiento();
        const [name, setNombre] = useState('');
        const [stoc, setStock] = useState('');
        const [type, setTipo] = useState('');
        const [cost, setCosto] = useState('');
        const crearEquipamiento = useCrearEquipamiento();
    
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
    
        const crearEquip = (e: SyntheticEvent) => {
            e.preventDefault();
            crearEquipamiento.mutate({nombre: name , stock: Number(stoc), tipo: type, costo: Number(cost)});
            setNombre('');
            setStock('');
            setTipo('');
            setCosto('');
        };  
    
        return (
        <div> 
            <h1>Menú de Equipamiento</h1>
            {cargaEquip ? (<p>Cargando Equipamiento...</p>)
            : (
            <>
                <h2>Equipamiento en el sistema: </h2>
                {equipamientos?.length > 0 ? (
                    <ul>
                        {equipamientos.map((e: any) => (
                            <li key = {e.nombre}>
                                Nombre: {e.nombre} - 
                                Stock: {e.stock} - 
                                Tipo: {e.tipo} - 
                                Costo: {e.costo} - 
                                 <p>------------</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p> No hay Equipamiento</p>)
                }
            </>
            )}
            
            <h3>Ingresar nuevo equipamiento: </h3>
            <form onSubmit={crearEquip}>
                <p>Ingrese nombre: </p>
                <input type = "text" placeholder='Nombre' value={name} onChange={(e)=> setNombre(e.target.value)} required/>

                <p>Ingrese Stock del equipamiento: </p>
                <input type = "number" placeholder='Stock' value={stoc} onChange={(e)=> setStock(e.target.value)} required/>

                <p>Ingrese tipo: </p>
                <input type = "text" placeholder='tipo' value={type} onChange={(e)=> setTipo(e.target.value)} required/>

                <p>Ingrese Costo del equipamiento: </p>
                <input type = "number" placeholder='costo' value={cost} onChange={(e)=> setCosto(e.target.value)} required/>
    
                <button type = "submit"> Agregar</button>
            </form>
    
        </div>
        );
    
};