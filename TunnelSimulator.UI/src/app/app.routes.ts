import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { TunnelComponent } from './views/tunnel/tunnel.component';

export const routes: Routes = [
  {
    path: 'tunnel',
    component: BaseLayoutComponent,
    children: [
      { path: '', component: TunnelComponent },
    ]
  },
  { path: '**', redirectTo: 'tunnel', pathMatch: 'full' },
];
