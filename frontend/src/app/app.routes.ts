import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'solicitudes',
        children: [
            {
                path: '',
                loadComponent: () => import('./features/solicitudes/solicitudes').then(m => m.Solicitudes)
            },
            {
                path: ':id',
                loadComponent: () => import('./features/solicitudes/pages/solicitud-detail/solicitud-detail').then(m => m.SolicitudDetailComponent)
            }
        ]
    },
    {
        path: '',
        redirectTo: 'solicitudes',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'solicitudes'
    }
];

