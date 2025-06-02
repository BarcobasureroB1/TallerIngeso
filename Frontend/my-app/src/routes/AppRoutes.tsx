import {Routes , Route} from 'react-router-dom';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';
import {Home} from '../pages/Home';
import {PrivateRoute} from './PrivateRoute';
import {Reserva} from '../pages/ReservasUsuario';
import { Reservar } from '../pages/Reservar';
import { HistorialReservas } from '../pages/reservasHistorial';
import { Canchas } from '../pages/Canchas';
import { Equipamientos } from '../pages/Equipamientos';
import Notificacion from '../pages/Notificacion';
import { Noautorizado } from '../pages/Noautorizado';


export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/Login' element = {<Login/>}/>
      <Route path = '/Register' element = {<Register/>}/>

      <Route path='/Home'element = {<PrivateRoute> <Home/> </PrivateRoute>}/>
      <Route path='/ReservasUsuario'element = {<PrivateRoute> <Reserva/> </PrivateRoute>}/>
      <Route path='/Reservar'element = {<PrivateRoute> <Reservar/> </PrivateRoute>}/>
      <Route path='/reservasHistorial'element = {<PrivateRoute requiereAdmin={true}><HistorialReservas/></PrivateRoute>}/>
      <Route path='/Canchas'element = {<PrivateRoute requiereAdmin={true}><Canchas/></PrivateRoute>}/>
      <Route path='/Equipamientos'element = {<PrivateRoute requiereAdmin={true}><Equipamientos/></PrivateRoute>}/>
      <Route path='/Notificacion'element = {<PrivateRoute><Notificacion/></PrivateRoute>}/>
      <Route path='/Noautorizado'element = {<PrivateRoute><Noautorizado/></PrivateRoute>}/>
    </Routes>
  );
};