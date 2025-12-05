import { Routes } from '@angular/router';
import { Registro } from './componentes/zonaCliente/Registro/registro';
import { Login } from './componentes/zonaCliente/Login/login';
import { Productos } from './componentes/zonaTienda/Productos/productos';
import { productosResolver } from './resolvers/productos-resolver';
import { checkTokenGuard } from './guards/check-token-guard';


//en los objeto Routes definimos las rutas de la aplicacion, prop. principales:
// -path: la ruta url
// -component: el componente que se carga cuando se accede a esa ruta
// -loadComponent: para lazy loading de componentes (carga bajo demanda del cliente)
// -children: rutas hijas para agrupar rutas bajo una ruta padre
// -redirectTo: para redirigir una ruta a otra

//dos propiedades opcionales muy poderosas en la configuracion de rutas (no usadas aqui):
// - resolve: SIRVE PARA DEFINIR LOS RESOLVERS QUE PERMITEN CARGAR DATOS ANTES DE ACTIVAR UNA RUTA
//           { prop: resolver, prop: resolver, ..... }
// - canActivate, canActivateChild, canLoad, .....,: GUARDS para proteger rutas y controlar acceso (autenticacion, autorizacion) 
export const routes: Routes = [
    { path:'Cliente',
      children:[
        //precarga de componentes de la zona cliente nada mas arrancar la aplicacion, aunque no se usen
        //puedes evitar la precarga si usas lazy loading (carga segun demanda del cliente)
        //{ path: 'Registro', component: Registro },
        //{ path: 'Login', component: Login}
        { path: 'Registro', loadComponent: () => import('./componentes/zonaCliente/Registro/registro').then(m => m.Registro) },
        { path: 'Login', loadComponent: () => import('./componentes/zonaCliente/Login/login').then(m => m.Login) },
        { path: 'Cuenta',
          canActivate: [ checkTokenGuard], //<--- guard de control de acceso a la zona Cuenta del Cliente (verificar si hay token de acceso en state global)
          children:[
            //rutas hijas de la zona Cuenta/Panel del Cliente: Mis datos, Mis direcciones, Mis pedidos, ...
            { path: 'MisDatos',  loadComponent: () => import('./componentes/zonaCliente/Cuenta/MisDatos/misdatos').then(m => m.Misdatos) },
          ]
        }
      ]
    },
    { path: 'Tienda',
        children:[
            { path: 'Productos/:pathCategoria', component: Productos, resolve: { productos: productosResolver }}
        ]
    }
];
