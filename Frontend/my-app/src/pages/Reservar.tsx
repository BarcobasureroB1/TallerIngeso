import React, {SyntheticEvent, useState} from 'react'
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useReservasGenerales,useCrearReserva } from '../hooks/useReservas';
import {useAgregarSaldo} from '../hooks/useUsuarios';
import { useCanchas } from '../hooks/useCanchas';


export const Reservar = () => {
    //token y usuario
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();

    //mostrar reservas y reservar
    const {data: reservas,isLoading: cargaReserva} = useReservasGenerales();
    const [errorMsg,setErrorMsg] = useState('');
    const crearReserv = useCrearReserva(() => {
    },
    (error) => {
      setErrorMsg(error);
    });
    
    const [fechaA,setFecha] = useState('');
    const [hora_Inicio, setHoraInicio] = useState('');
    const [hora_Fin,setHoraFin] = useState('');
    const [id_Cancha,setIDCancha] = useState('');
    const [equipamientoO,setEquipamiento] = useState(false);
    
    //añadir a Saldo
    const [saldoAgregado,setSaldo] = useState('');
    const agregarMonto = useAgregarSaldo();

    //mostrar canchas
    const {data: canchas,isLoading: cargaCanchas} = useCanchas();


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

    if(cargaCanchas)
    {
        return <div>Cargando canchas...</div>
    }

    const enviarSuma = (e: SyntheticEvent) => {
        e.preventDefault();
        agregarMonto.mutate(Number(saldoAgregado));
        setSaldo('');
    };

    const crearRes = (e: SyntheticEvent) => {
        e.preventDefault();
        
        if (!user?.rut) {
            setErrorMsg('No se pudo obtener el RUT del usuario');
            return;
        }

        crearReserv.mutate({rut_cliente: user.rut ,fecha: new Date(fechaA) ,hora_inicio: hora_Inicio ,hora_fin: hora_Fin,id_cancha: Number(id_Cancha),equipamiento: equipamientoO});
        setFecha('');
        setHoraInicio('');
        setHoraFin('');
        setIDCancha('');
        setEquipamiento(false);
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEquipamiento(e.target.checked);
    };

    return (
    <div> 
        
        <h2> Bienvenido: {user?.rut}, tu saldo actual es: ${user?.saldo} </h2>
        
        <h3>Agregar Saldo a tu cuenta: </h3>
        <form onSubmit={enviarSuma}>

            <input type = "number" placeholder='Ingresa dinero a agregar' value={saldoAgregado} onChange={(e)=> setSaldo(e.target.value)} required/>

            <button type = "submit"> Agregar</button>
        </form>


        <h3>COMPLETE LOS DATOS DE SU RESERVA: </h3>
            <form onSubmit={crearRes}>
                
                <input type="date" placeholder='Fecha' required value={fechaA} onChange={(e) => setFecha(e.target.value)} />
                <input type="time" placeholder='Hora inicio' required value={hora_Inicio} onChange={(e) => setHoraInicio(e.target.value)} />
                <input type="time" placeholder='Hora fin' required value={hora_Fin} onChange={(e) => setHoraFin(e.target.value)} />
                <h3>INGRESE UNA DE ESTAS CANCHAS: </h3>

                {canchas?.length > 0 ? (
                <ul>
                    {canchas.map((c: any) => (
                        <li key = {c.id}>
                            {c.id} -<p>Precio de Cancha: </p> ${c.costo} 
                            <p>---------------------------------------------------</p>
                        </li>
                    ))}
                </ul>
                    ) : (<p> No hay productos</p>)
                }

                <input type="number" placeholder='ID Cancha' required value={id_Cancha} onChange={(e) => setIDCancha(e.target.value)} />
                
                <div>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={equipamientoO} 
                            onChange={handleCheckboxChange}
                        />
                        ¿Necesita equipamiento?
                    </label>
                </div>

                <button type="submit">Confirmar Reserva</button>
            </form>

            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}


        <button onClick={()=> navigate('/ReservasUsuario')}>Ver tus reservas</button>
        <button onClick={()=> navigate('/Home')}>Volver a Home</button>
    </div>
    );
    
};

