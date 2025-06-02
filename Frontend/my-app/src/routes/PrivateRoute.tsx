import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";

interface PropRutaspriv {
    children: React.ReactNode;
    requiereAdmin?: boolean;
}

export const PrivateRoute = ({children,requiereAdmin = false}: PropRutaspriv) => {
    const {token} = useAuth();
    const {data: user, isLoading} = useUserProfile();

    if(!token)
    {
        return <Navigate to = '/Login' replace/>;
    }
    if(isLoading) {
        return <div>cargando datos del usuario...</div>
    }
    if (requiereAdmin && (!user || user.admin !== true)) {
        return <Navigate to="/Noautorizado" replace />;
    }

    return <>{children}</>;
}