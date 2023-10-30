import { StarterContentComponent } from './../starter-content/starter-content.component';
import { StarterPedidosComponent } from './../starter-pedidos/starter-pedidos.component';
import { StarterComponent } from './../starter.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';


// const routes: Routes = [
  // { path: 'lista', component: ListaComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'panelusuario', component: PanelusuarioComponent },
  // { path: '', component: LoginComponent },
  // { path: '**', component: RutaNoExisteComponent }
// ];

const routes: Routes = [
    {path: 'starter',component: StarterComponent
		,children: 
		[
			{ path: '',redirectTo: 'pedidos',pathMatch: 'full'},
			{ path: 'pedidos', component: StarterPedidosComponent}
		]
	}
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
	// RouterModule.forRoot(routes)

	
  ],
  exports: [
    RouterModule
  ]
})
export class StarterRoutingModule { }
