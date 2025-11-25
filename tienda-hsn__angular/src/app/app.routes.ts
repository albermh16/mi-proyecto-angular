import { Routes } from '@angular/router';
import { Registro } from './componentes/zonaCliente/Registro/registro';
import { Login } from './componentes/zonaCliente/Login/login';

// en los objeto Routes definimos las rutas de la aplicacion, prop. Principales:
// -path:la ruta url
// -component: el componente a cargar cuando se accede a esa ruta
// -children: rutas hijas para definir rutas anidadas
// -loadComponent: para lazy loading de componentes (carga bajo demanda)
// -redirectTo: para redirigir a otra ruta

//dos propiedades opcionales muy poderorsas en la configuracion de rutas(no usadas aqui):
// -resolve: SIRVE PARA DEFINIR LOS REOSOLVERS QUE PERMITEN CARGAR DATOS ANTES DE ACTIVAR UNA RUTA
// - canActivate, canActivateChild, canLoad, ....: para proteger rutas y controlar acceso(autenticacion, autorizacion)

export const routes: Routes = [
    {path: "Cliente",
        children: [
            //Precarga de componentes de la zona cliente nada mas arrancar la api, aunque no se usen
            // puedes evitar la precarga si usas lazy loading(carga segun demanda dle cliente)
            //{path: "Registro", component: Registro},
            //{path: "Login", component: Login}
            {path: "Registro", loadComponent: () => import('./componentes/zonaCliente/Registro/registro').then(m => m.Registro)},
            {path: "Login", loadComponent: () => import('./componentes/zonaCliente/Login/login').then(m => m.Login)}

    ]
}
];
