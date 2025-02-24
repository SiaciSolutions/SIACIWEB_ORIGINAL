import { AdminRoutingModule } from './admin-routing/admin-routing.module';
// import { AdminDashboard1Component } from './admin-dashboard1/admin-dashboard1.component';
import { AdminControlSidebarComponent } from './admin-control-sidebar/admin-control-sidebar.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { AdminLeftSideComponent } from './admin-left-side/admin-left-side.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboard2Component } from './admin-dashboard2/admin-dashboard2.component';
import { AdminDashboard3Component } from './admin-dashboard3/admin-dashboard3.component';
import { AdminPedidosComponent } from './admin-pedidos/admin-pedidos.component';
import { AdminListaPedidosComponent } from './admin-lista-pedidos/admin-lista-pedidos.component';
import { AdminClienteComponent } from './admin-cliente/admin-cliente.component';
import { AdminClienteConsultaComponent } from './admin-cliente-consulta/admin-cliente-consulta.component';
import { AdminViewPedidosComponent } from './admin-view-pedido/admin-view-pedido.component';
import { AdminEditPedidosComponent } from './admin-edit-pedidos/admin-edit-pedidos.component';
import { AdminPosComponent } from './admin-pos/admin-pos.component';
import { AdminConciliacionCaja } from './admin-conciliacion-caja/admin-conciliacion-caja.component';
import { AgmCoreModule } from '@agm/core';
import { AdminRegistrarVisitaComponent } from './admin-registrar-visita/admin-registrar-visita.component';
import { AdminReporteVisitaComponent } from './admin-reporte-visita/admin-reporte-visita.component';
import { AdminCalendarioAgendaComponent } from './admin-calendario-agenda/admin-calendario-agenda.component';
import { AdminReportePedidosComponent } from './admin-reporte-pedidos/admin-reporte-pedidos.component';
import { AdminSucursalesComponent } from './admin-sucursales/admin-sucursales.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { AdminOrdenTallerComponent } from './admin-taller-orden/admin-taller-orden.component';
import { AdminListaOrdenesComponent } from './admin-lista-ordenes/admin-lista-ordenes.component';
import { AdminPosCajaRegistradoraComponent } from './admin-pos-cajaregistradora/admin-pos-cajaregistradora.component';
import { AdminIngresoArticulosComponent } from './admin-ingreso-articulos/admin-ingreso-articulos.component';
import { AdminListaIngresosComponent } from './admin-lista-ingresos/admin-lista-ingresos.component';
import { AdminListaPdvComponent } from './admin-lista-pdv/admin-lista-pdv.component';
import { AdminDespachoArticulosComponent } from './admin-despacho-articulos/admin-despacho-articulos.component';
import { AdminListaDespachosComponent } from './admin-lista-despachos/admin-lista-despachos.component';
import { AdminListaFacDespachadasComponent } from './admin-lista-fact-despachadas/admin-lista-fact-despachadas.component';
import { AdminEgresoArticulosComponent } from './admin-egreso-articulos/admin-egreso-articulos.component';
import { AdminListaEgresosComponent } from './admin-lista-egresos/admin-lista-egresos.component';
import { AdminListaWhatsappComponent } from './admin-lista-msg-whatsapp/admin-lista-msg-whatsapp.component';
import { AdminListaProductosComponent } from './admin-lista-productos/admin-lista-productos.component';
import { AdminArticulosComponent } from './admin-articulos/admin-articulos.component';
import { AdminConteoArticulosComponent } from './admin-conteo-articulos/admin-conteo-articulos.component';
import { AdminMedicionesComponent } from './admin-mediciones/admin-mediciones.component';
import { AdminMedicionesHorizComponent } from './admin-mediciones-horiz/admin-mediciones-horiz.component';
import { AdminListaServiciosComponent } from './admin-lista-servicios/admin-lista-servicios.component';
import { AdminServiciosComponent } from './admin-servicios/admin-servicios.component';
import { AdminConfigComponent } from './admin-config/admin-config.component';
import { AdminPedidosMedicosComponent } from './admin-pedidos-medicos/admin-pedidos-medicos.component';
import { AdminListaPedidosMedicosComponent } from './admin-lista-ped-medicos/admin-lista-ped-medicos.component';
import { AdminTransfBodegaComponent } from './admin-transferencias/admin-transferencias.component';
import { AdminListaTranferenciasComponent } from './admin-lista-transferencia/admin-lista-transferencias.component';






import { NgSelect2Module } from 'ng-select2';



import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { ZXingScannerModule } from '@zxing/ngx-scanner';



import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatTableModule,
  MatToolbarModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatCheckboxModule,
  MatListModule,
  MatAutocompleteModule
} from '@angular/material';

@NgModule({
  imports: [
  	  BrowserModule,
	  DataTablesModule,
      BrowserAnimationsModule,
      MatAutocompleteModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
	  MatSelectModule,
	  MatCheckboxModule,
	  MatListModule,
	  FullCalendarModule, // for FullCalendar!
	  MatDatepickerModule,
	  
	 AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDdtXEK3JAS8o_-ZhtjiyNLaGoJyrMI3tM'
    }),
  
    CommonModule,
    AdminRoutingModule,
	NgSelect2Module,
	ZXingScannerModule
  ],
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminLeftSideComponent,
    AdminContentComponent,
    AdminFooterComponent,
    AdminControlSidebarComponent,
    // AdminDashboard1Component,
    AdminDashboard2Component,
	AdminDashboard3Component,
	AdminPedidosComponent,
	AdminClienteComponent,
	AdminViewPedidosComponent,
	AdminListaPedidosComponent,
	AdminEditPedidosComponent,
	AdminClienteConsultaComponent,
	AdminPosComponent,
	AdminConciliacionCaja,
	AdminRegistrarVisitaComponent,
	AdminReporteVisitaComponent,
	AdminCalendarioAgendaComponent,
	AdminReportePedidosComponent,
	AdminSucursalesComponent,
	AdminOrdenTallerComponent,
	AdminListaOrdenesComponent,
	AdminPosCajaRegistradoraComponent,
	AdminIngresoArticulosComponent,
	AdminListaIngresosComponent,
	AdminListaPdvComponent,
	AdminDespachoArticulosComponent,
	AdminListaDespachosComponent,
	AdminListaFacDespachadasComponent,
	AdminEgresoArticulosComponent,
	AdminListaEgresosComponent,
	AdminListaWhatsappComponent,
	AdminListaProductosComponent,
	AdminArticulosComponent,
	AdminConteoArticulosComponent,
	AdminMedicionesComponent,
	AdminMedicionesHorizComponent,
	AdminListaServiciosComponent,
	AdminServiciosComponent,
	AdminConfigComponent,
	AdminPedidosMedicosComponent,
	AdminListaPedidosMedicosComponent,
	AdminTransfBodegaComponent,
	AdminListaTranferenciasComponent

	
  ],
  exports: [AdminComponent]
})
export class AdminModule { }
