import React, {SyntheticEvent, useState} from 'react'
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useReservasGenerales,useCrearReserva } from '../hooks/useReservas';
import {useAgregarSaldo} from '../hooks/useUsuarios';
import { useCanchas } from '../hooks/useCanchas';
import { useEquipamiento } from '../hooks/useEquipamiento';
import { useCrearBoleta } from '../hooks/useBoletas';
import { useCrearJugador } from '../hooks/useJugadores';

export const Reservar = () => {
    //GESTION DE DATOS PARA SELECCIONAR EQUIPAMIENTOS

    const [idBoletaReserva, setIdBoletaReserva] = useState<number | null>(null);
    const [equipamientosSeleccionados, setEquipamientosSeleccionados] = useState<{
        nombre_equipamiento: string;
        cantidad: number;
    }[]>([]);

    const [currentEquipamiento, setCurrentEquipamiento] = useState('');
    const [currentCantidad, setCurrentCantidad] = useState(1);
    const [mostrarFormEquipamiento, setMostrarFormEquipamiento] = useState(false);

    //-------------------------------------------//

    //token y usuario
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();

    //mostrar reservas y reservar
    const {data: reservas,isLoading: cargaReserva} = useReservasGenerales();
    const [errorMsg,setErrorMsg] = useState('');
    const [errormsg,seterrorMSG] = useState('');
    const [fechaA,setFecha] = useState('');
    const [hora_Inicio, setHoraInicio] = useState('');
    const [hora_Fin,setHoraFin] = useState('');
    const [idCancha,setIDCancha] = useState('');
    const [equipamientoO,setEquipamiento] = useState(false);
    const [cantidad,setCantidadJugadores] = useState('');

    // Estados para jugadores
    const [mostrarFormJugador, setMostrarFormJugador] = useState(false);
    const [jugadoresRegistrados, setJugadoresRegistrados] = useState(0);
    const [jugadorActual, setJugadorActual] = useState({
        nombres: '',
        apellidos: '',
        rut: '',
        edad: ''
    });
    const crearJugador = useCrearJugador();

    //añadir a Saldo
    const [saldoAgregado,setSaldo] = useState('');
    const agregarMonto = useAgregarSaldo();

    //mostrar canchas
    const {data: canchas,isLoading: cargaCanchas} = useCanchas();

    //mostrar equipamiento
    const {data: ListaEquipamiento, isLoading: cargaEquipamiento} = useEquipamiento();

    

    //Crear reserva
    const crearReserv = useCrearReserva((data) => {
        console.log('Reserva creada con la boleta: ', data.id_boleta);
        setIdBoletaReserva(data.id_boleta);
        setCantidadJugadores(data.cantidadJugadores.toString());

        if (data.cantidadJugadores > 0) {
            setMostrarFormJugador(true);
        }

        if (equipamientoO) {
            setMostrarFormEquipamiento(true);
        }
    },
    (error) => {
      setErrorMsg(error);
    });

    //Crear Boleta
    const crearBolet = useCrearBoleta(() => {
        console.log('Boleta creada.');
    },
    (error) => {
      seterrorMSG(error);
    });

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


    // Agregar equipamiento a una lista
    const agregarEquipamiento = (e: SyntheticEvent) => {
        e.preventDefault();
        if (!currentEquipamiento) {
            setErrorMsg('Seleccione un equipamiento');
            return;
        }
        
        setEquipamientosSeleccionados(prev => [
            ...prev,
            {
                nombre_equipamiento: currentEquipamiento,
                cantidad: currentCantidad
            }
        ]);
        
        setCurrentEquipamiento('');
        setCurrentCantidad(1);
    };



    //Suma de saldo
    const enviarSuma = (e: SyntheticEvent) => {
        e.preventDefault();
        agregarMonto.mutate(Number(saldoAgregado));
        setSaldo('');
    };

    //Crear reserva
    const crearRes = (e: SyntheticEvent) => {
        e.preventDefault();
        
        if (!user?.rut) {
            setErrorMsg('No se pudo obtener el RUT del usuario');
            return;
        }

        crearReserv.mutate({rut_cliente: user.rut ,fecha: new Date(fechaA) ,hora_inicio: hora_Inicio ,hora_fin: hora_Fin,id_cancha: Number(idCancha),equipamiento: equipamientoO,cantidad_jugadores: Number(cantidad)});
        setFecha('');
        setHoraInicio('');
        setHoraFin('');
        setIDCancha('');
        setCantidadJugadores('');
    };
    

    // Crear todas las boletas en orden
    const crearBoletasEquipamiento = async () => {
        if (!idBoletaReserva || equipamientosSeleccionados.length === 0) return;
        
        try {
            
            for (const equip of equipamientosSeleccionados) {
                await crearBolet.mutateAsync({
                    numero_boleta: idBoletaReserva,
                    nombre_equipamiento: equip.nombre_equipamiento,
                    cantidad: equip.cantidad
                });
            }
            
            //resetea estas cosas
            setEquipamientosSeleccionados([]);
            setMostrarFormEquipamiento(false);
            setIdBoletaReserva(null);
            setEquipamiento(false);
        } catch (error) {
            setErrorMsg('Error al crear boletas de equipamiento');
        }
    };

    // Crear jugadores en orden
    const registrarJugador = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!idBoletaReserva) return;

        try {
            await crearJugador.mutateAsync({
                numero_boleta: idBoletaReserva,
                nombres_jugador: jugadorActual.nombres,
                apellidos_jugador: jugadorActual.apellidos,
                rut_jugador: jugadorActual.rut,
                edad_jugador: Number(jugadorActual.edad)
            });

            
            setJugadoresRegistrados(prev => prev + 1);
            setJugadorActual({
                nombres: '',
                apellidos: '',
                rut: '',
                edad: ''
            });

            
            if (jugadoresRegistrados + 1 >= Number(cantidad)) {
                setMostrarFormJugador(false);
                alert('Todos los jugadores han sido registrados!');
            }
        } catch (error) {
            setErrorMsg('Error al registrar jugador');
        }
    };


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEquipamiento(e.target.checked);
    };

    const handleJugadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setJugadorActual(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
    <div> 
        
        <h2> Bienvenid@ {user?.nombre}, tu saldo actual es: ${user?.saldo} </h2>
        
        <h3>Agregar Saldo a tu cuenta: </h3>
        <form onSubmit={enviarSuma}>

            <input type = "number" placeholder='Ingresa dinero a agregar' value={saldoAgregado} onChange={(e)=> setSaldo(e.target.value)} required/>

            <button type = "submit"> Agregar</button>
        </form>


        <h3>COMPLETE LOS DATOS DE SU RESERVA: </h3>
            <form onSubmit={crearRes}>
                <p>Fecha, ejemplo: 2023-11-15</p>
                <input type="date" placeholder='Fecha (ej: 2023-11-15)' required value={fechaA} onChange={(e) => setFecha(e.target.value)} />
                <p>Hora de inicio de la reserva, ejemplo: 09:30</p>
                <input type="time" placeholder='Hora inicio (ej: 09:30)' required value={hora_Inicio} onChange={(e) => setHoraInicio(e.target.value)} />
                <p>Hora de finalizacion de la reserva, ejemplo: 14:45</p>
                <input type="time" placeholder='Hora fin (ej: 14:45)' required value={hora_Fin} onChange={(e) => setHoraFin(e.target.value)} />
                <h3>INGRESE UNA DE ESTAS CANCHAS: </h3>

                {canchas?.length > 0 ? (
                <ul>
                    {canchas.map((c: any) => (
                        <li key = {c.id_cancha}>
                            {c.id_cancha} - <p>Precio de Cancha: </p>  ${c.costo} - <p>Capacidad de la cancha:</p> {c.capacidad} -
                            <p>---------------------------------------------------</p>
                        </li>
                    ))}
                </ul>
                    ) : (<p> No hay canchas</p>)
                }

                <p>Ingrese cantidad de jugadores</p>
                <input type="number" placeholder='cantidad de jugadores' required value={cantidad} onChange={(e) => setCantidadJugadores(e.target.value)}min="1"/>
                
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

            {mostrarFormJugador && idBoletaReserva && (
                <div>
                    <h3>REGISTRO DE JUGADORES ({jugadoresRegistrados + 1}/{cantidad})</h3>
                    <form onSubmit={registrarJugador}>
                        <input
                            type="text"
                            name="nombres"
                            placeholder="Nombres del jugador"
                            value={jugadorActual.nombres}
                            onChange={handleJugadorChange}
                            required
                        />
                        <input
                            type="text"
                            name="apellidos"
                            placeholder="Apellidos del jugador"
                            value={jugadorActual.apellidos}
                            onChange={handleJugadorChange}
                            required
                        />
                        <input
                            type="text"
                            name="rut"
                            placeholder="RUT del jugador"
                            value={jugadorActual.rut}
                            onChange={handleJugadorChange}
                            required
                        />
                        <input
                            type="number"
                            name="edad"
                            placeholder="Edad del jugador"
                            min="1"
                            value={jugadorActual.edad}
                            onChange={handleJugadorChange}
                            required
                        />
                        <button type="submit">
                            {jugadoresRegistrados + 1 < Number(cantidad) ? 
                                'Registrar y continuar' : 
                                'Registrar último jugador'}
                        </button>
                    </form>
                </div>
            )}

            {/* FORMULARIO EQUIPAMENTO OPCIONAL*/}
            {mostrarFormEquipamiento && idBoletaReserva && (
                <div>
                    <h3>SELECCIONE EQUIPAMIENTO</h3>
                    <form onSubmit={agregarEquipamiento}>
                        <select
                            value={currentEquipamiento}
                            onChange={(e) => setCurrentEquipamiento(e.target.value)}
                            required
                        >
                            <option value="">Seleccione equipamiento</option>
                            {ListaEquipamiento?.map((equip: any) => (
                                <option key={equip.id_equipamiento} value={equip.nombre}>
                                    {equip.nombre} (Disponibles: {equip.cantidad_disponible})
                                </option>
                            ))}
                        </select>
                        
                        <input
                            type="number"
                            min="1"
                            value={currentCantidad}
                            onChange={(e) => setCurrentCantidad(Number(e.target.value))}
                            required
                        />
                        
                        <button type="submit">Agregar Equipamiento</button>
                    </form>

                    {/* SE MUESTRAN LOS EQUIPAMIENTOS SELECCIONADOS PARA CONFIRMAR*/}
                    {equipamientosSeleccionados.length > 0 && (
                        <div>
                            <h4>Equipamiento seleccionado:</h4>
                            <ul>
                                {equipamientosSeleccionados.map((equip, index) => (
                                    <li key={index}>
                                        {equip.nombre_equipamiento} - Cantidad: {equip.cantidad}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={crearBoletasEquipamiento}>
                                Confirmar Equipamiento
                            </button>
                        </div>
                    )}
                </div>
            )}

            {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}

        <button onClick={()=> navigate('/ReservasUsuario')}>Ver tus reservas</button>
        <button onClick={()=> navigate('/Home')}>Volver a Home</button>
    </div>
    );
    
};

