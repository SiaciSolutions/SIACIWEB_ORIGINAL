import { AdminDashboard2Component } from './admin/admin-dashboard2/admin-dashboard2.component';
// import { AdminDashboard1Component } from './admin/admin-dashboard1/admin-dashboard1.component';
import { StarterPedidosComponent } from './starter/starter-pedidos/starter-pedidos.component';


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListaComponent } from './lista/lista.component';
import { PanelusuarioComponent } from './panelusuario/panelusuario.component';
import { StarterComponent } from './starter/starter.component';
import { AdminComponent } from './admin/admin.component';
import { CommonModule } from '@angular/common';

import { RutaNoExisteComponent } from './ruta-no-existe/ruta-no-existe.component';

const routes: Routes = [
  { path: 'lista', component: ListaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'panelusuario', component: PanelusuarioComponent },
  // { path: 'starter', component: StarterComponent },
  // { path: 'admin', component: AdminComponent },
  { path: '', component: LoginComponent },
  { path: '**', component: RutaNoExisteComponent }
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
