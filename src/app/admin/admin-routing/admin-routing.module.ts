import { AdminDashboard2Component } from './../admin-dashboard2/admin-dashboard2.component';
import { AdminDashboard3Component } from './../admin-dashboard3/admin-dashboard3.component';
import { AdminPedidosComponent } from './../admin-pedidos/admin-pedidos.component';
import { AdminClienteComponent } from './../admin-cliente/admin-cliente.component';
// import { AdminDashboard1Component } from './../admin-dashboard1/admin-dashboard1.component';
import { AdminComponent } from './../admin.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminListaPedidosComponent } from './../admin-lista-pedidos/admin-lista-pedidos.component';
import { AdminViewPedidosComponent } from './../admin-view-pedido/admin-view-pedido.component';
import { AdminClienteConsultaComponent } from './../admin-cliente-consulta/admin-cliente-consulta.component';
import { AdminEditPedidosComponent } from './../admin-edit-pedidos/admin-edit-pedidos.component';
import { AdminPosComponent } from './../admin-pos/admin-pos.component';
import { AdminConciliacionCaja } from './../admin-conciliacion-caja/admin-conciliacion-caja.component';
import { AdminRegistrarVisitaComponent } from './../admin-registrar-visita/admin-registrar-visita.component';
import { AdminReporteVisitaComponent } from './../admin-reporte-visita/admin-reporte-visita.component';
import { AdminCalendarioAgendaComponent } from './../admin-calendario-agenda/admin-calendario-agenda.component';
import { AdminReportePedidosComponent } from './../admin-reporte-pedidos/admin-reporte-pedidos.component';
import { AdminSucursalesComponent } from './../admin-sucursales/admin-sucursales.component';
import { AdminOrdenTallerComponent } from './../admin-taller-orden/admin-taller-orden.component';
import { AdminListaOrdenesComponent } from './../admin-lista-ordenes/admin-lista-ordenes.component';
import { AdminPosCajaRegistradoraComponent } from './../admin-pos-cajaregistradora/admin-pos-cajaregistradora.component';
import { AdminIngresoArticulosComponent } from './../admin-ingreso-articulos/admin-ingreso-articulos.component';
import { AdminListaIngresosComponent } from './../admin-lista-ingresos/admin-lista-ingresos.component';
import { AdminListaPdvComponent } from './../admin-lista-pdv/admin-lista-pdv.component';
import { AdminDespachoArticulosComponent } from './../admin-despacho-articulos/admin-despacho-articulos.component';
import { AdminListaDespachosComponent } from './../admin-lista-despachos/admin-lista-despachos.component';
import {AdminListaFacDespachadasComponent} from './../admin-lista-fact-despachadas/admin-lista-fact-despachadas.component';
import { AdminEgresoArticulosComponent } from './../admin-egreso-articulos/admin-egreso-articulos.component';
import { AdminListaEgresosComponent } from './../admin-lista-egresos/admin-lista-egresos.component';
import { AdminListaWhatsappComponent } from './../admin-lista-msg-whatsapp/admin-lista-msg-whatsapp.component';
import { AdminListaProductosComponent } from './../admin-lista-productos/admin-lista-productos.component';
import { AdminArticulosComponent } from './../admin-articulos/admin-articulos.component';
import { AdminConteoArticulosComponent } from './../admin-conteo-articulos/admin-conteo-articulos.component';
import { AdminMedicionesComponent } from './../admin-mediciones/admin-mediciones.component';
import { AdminMedicionesHorizComponent } from './../admin-mediciones-horiz/admin-mediciones-horiz.component';
import { AdminListaServiciosComponent } from './../admin-lista-servicios/admin-lista-servicios.component';
import { AdminServiciosComponent } from './../admin-servicios/admin-servicios.component';
import { AdminConfigComponent } from './../admin-config/admin-config.component';
import { AdminPedidosMedicosComponent } from './../admin-pedidos-medicos/admin-pedidos-medicos.component';
import { AdminListaPedidosMedicosComponent } from './../admin-lista-ped-medicos/admin-lista-ped-medicos.component';
import { AdminTransfBodegaComponent } from './../admin-transferencias/admin-transferencias.component';
import { AdminListaTranferenciasComponent } from './../admin-lista-transferencia/admin-lista-transferencias.component';


















@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'admin',
        component: AdminComponent,
        children: [
          {
            path: '',
            redirectTo: 'dashboard1',
            pathMatch: 'full'
          },
          {
            path: 'dashboard1',
            component: AdminDashboard2Component
			// component: AdminDashboard1Component
          },
          {
            path: 'dashboard2',
            component: AdminDashboard2Component
          },
		  {
            path: 'dashboard3',
            component: AdminDashboard3Component
          },
		  {
            path: 'crear_pedidos',
            component: AdminPedidosComponent
          },
		  {
            path: 'crear_clientes',
            component: AdminClienteComponent
          },
		  {
            path: 'consulta_clientes',
            component: AdminClienteConsultaComponent
          },
		  {
            path: 'consulta_sucursales',
            component: AdminSucursalesComponent
          },
		  {
            path: 'taller_orden',
            component: AdminOrdenTallerComponent
          },
		  {
            path: 'lista_pedidos',
            component: AdminListaPedidosComponent
			// children: [
				// {
				// path: 'ver_pedidos',
				// component: AdminViewPedidosComponent
				// }
			
			
			// ]
          },
		  {
            path: 'ver_pedidos',
            component: AdminViewPedidosComponent
          },		  
		  {
            path: 'editar_pedidos',
            component: AdminEditPedidosComponent
          },
		  {
            path: 'registrar_visita',
            component: AdminRegistrarVisitaComponent
          },
		  {
            path: 'reporte_visita',
            component: AdminReporteVisitaComponent
          },		  
		  {
            path: 'pos',
            component: AdminPosComponent
          },		  
		  {
            path: 'pos-cajaregistradora',
            component: AdminPosCajaRegistradoraComponent
          },	
		  {
            path: 'conciliacion-caja',
            component: AdminConciliacionCaja
          },
			{
            path: 'agenda_calendario',
            component: AdminCalendarioAgendaComponent
          },
		  {
            path: 'admin-reporte-pedidos',
            component: AdminReportePedidosComponent
          },
		  {
            path: 'lista_ordenes',
            component: AdminListaOrdenesComponent
          },
		  {
            path: 'ingreso_articulos',
            component: AdminIngresoArticulosComponent
          },
		  {
            path: 'lista_ingresos',
            component: AdminListaIngresosComponent
          },
		  {
            path: 'lista_pdv',
            component: AdminListaPdvComponent
          },		  
		  {
            path: 'despacho',
            component: AdminDespachoArticulosComponent
          },		  
		  {
            path: 'lista_fac_pend_despachos',
            component: AdminListaDespachosComponent
          },		  
		  {
            path: 'lista_fac_despachadas',
            component: AdminListaFacDespachadasComponent
          },		  
		  {
            path: 'egreso_articulos',
            component: AdminEgresoArticulosComponent
          },
		  {
            path: 'lista_egresos',
            component: AdminListaEgresosComponent
          },	
		  {
            path: 'lista_msg_whatsapp',
            component: AdminListaWhatsappComponent
          },
		  {
            path: 'lista_productos',
            component: AdminListaProductosComponent
          },			  
		  {
            path: 'crear_productos',
            component: AdminArticulosComponent
          },	
		  {
            path: 'conteo_productos',
            component: AdminConteoArticulosComponent
          },	
		  {
            path: 'mediciones',
            component: AdminMedicionesComponent
          },	
		  
		  {
            path: 'mediciones_horiz',
            component: AdminMedicionesHorizComponent
          }	,	
		  {
            path: 'lista_servicios',
            component: AdminListaServiciosComponent
          }	,
		  {
            path: 'admin_servicios',
            component: AdminServiciosComponent
          }	
		  ,
		  {
            path: 'admin_config',
            component: AdminConfigComponent
          }
		  ,
		  {
            path: 'admin_pedidos_medicos',
            component: AdminPedidosMedicosComponent
          }
		  ,
		  {
            path: 'lista_ped_medicos',
            component: AdminListaPedidosMedicosComponent
          }
		  ,
		  {
            path: 'transf_bodegas',
            component: AdminTransfBodegaComponent
          }
		  ,
		  {
            path: 'lista_transferencias',
            component: AdminListaTranferenciasComponent
          }
		  
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
