import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent} from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
// import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin , { Draggable }  from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';


declare var AdminLTE: any;


@Component({
  selector: 'app-admin-calendario-agenda',
  templateUrl: './admin-calendario-agenda.component.html',
  styleUrls: ['./admin-calendario-agenda.component.css']
})


	
	// }//FIN ONINIT
	
export class AdminCalendarioAgendaComponent implements OnInit {
	
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
  @ViewChild('external') external: ElementRef;

  calendarVisible = true;           
  calendarPlugins = [dayGridPlugin, timeGridPlugin,listPlugin, interactionPlugin];
  calendarWeekends = true;
  
  usuario
  empresa
  
  public lista_rutas
  public id_nombre_ruta_seleccionado
  public idruta
  public nombre_ruta
  public lista_pedidos_ruta
  public lista_pedidos_ruta_programada
  
  public refresh_page_after_drop = false
  
  // calendarEvents: EventInput[] = [
  // { title: "EXPRESS GRILL CIA LTDA/00004800", start: "2020-03-17"}
  // ]
  
    calendarEvents: EventInput[] = []
  
  // [{ title: "EXPRESS GRILL CIA LTDA/00004800", start: "2020-03-17T00:00:00.000-05:00", end: "2020-12-17T00:30:000-05:00" }]
  
  
    // calendarEvents: EventInput[] = [
    // { title: 'Event Now', start: new Date() }
  // ];
  
    // calendarEvents: EventInput[] = [
    // { title: 'Carlos Ledezma', start: '2019-12-13T08:15:05-05:00' ,end: '2019-12-13T08:30:05-05:00'}
	// { title: 'Maria Ledezma', start: '2019-12-13T10:30:05-05:00' ,end: '2019-12-13T10:45:05-05:00'}
  // ];
  
  constructor(  
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  {}

  ngOnInit() {
	  // console.log(new Date())
	  
	  	if (!this.srv.isLoggedIn()){
	this.router.navigateByUrl('/')};
	   
	this.route.queryParams.subscribe(params => {
		console.log(params)
        // Defaults to 0 if no query param provided.
        // this.ruc = +params['ruc'] || 0;
		this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
		this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
		// this.status = params['status'] || this.route.snapshot.paramMap.get('status') || 0;
      });
	console.log(this.usuario)
	console.log(this.empresa)
	
	this.calendarComponent.locales = [ { code: 'ES' } ];
	
	
	const datos = {};
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;	
	console.log (this.usuario)
	console.log (this.empresa)
	console.log (datos)
	// this.srv.consulta_citas(datos).subscribe(
	   // data => {
		   // console.log ("CONSULTAS EJECUTADA DATA") 
		   // console.log(data)
		   // this.calendarEvents = data
		   

			// // this.lista_visitas_tabla = data
		// }); 
		
	new Draggable(this.external.nativeElement, {
      itemSelector: '.external-event',
      eventData: function(eventEl) {
        return {
          title: eventEl.innerText
        };
      }
  });
  
  
  
  	this.srv.get_rutas(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO RUTAS")
		   console.log(data)
		   this.lista_rutas = data
		}); 
		



			
	// let calendarApi = this.calendarComponent.getApi();
	// console.log ("#### calendar event  #####")
	// console.log (calendarApi.getEventSources());
	
	
	
	AdminLTE.init();
  
  }
  
  // pedidos_ruta(value){
	  // console.log("BUSCANDO PEDIDOS PENDIENTES POR RUTAS")
	  // console.log(value)
	  
	  
  // }
  
  	pedidos_ruta(){
		
		console.log(this.id_nombre_ruta_seleccionado)
		
		// this.ngOnInit()
		
			let datos = {};
			  datos['usuario'] = this.usuario;
			  datos['empresa'] = this.empresa;
			  
			  
		if  (this.refresh_page_after_drop){
			alert("Se recargará la página para reflejar los cambios")
			// refresh_page_after_drop
			
			this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
			this.router.navigate(['/admin/agenda_calendario',datos]);
		}); 

		}


				// this.router.navigate(['/admin/lista_pedidos', datos]);

		
		let calendarApi = this.calendarComponent.getApi();
		calendarApi.refetchEvents();
		// calendarApi.refetchEventSources()
			// calendarApi.getEventSources();
			// calendarApi.removeEvents();
			
		let id_nombre_ruta_seleccionado_array = this.id_nombre_ruta_seleccionado.split("|",2)
		this.idruta = id_nombre_ruta_seleccionado_array[0]
		this.nombre_ruta=id_nombre_ruta_seleccionado_array[1]
		
		console.log("BUSCANDO SUCURSALES EN RUTA "+this.nombre_ruta)
			
			let datos_pedidos = {};
			
			datos_pedidos['empresa'] = this.empresa;	
			datos_pedidos['idruta'] = this.idruta;
			datos_pedidos['nombre_ruta'] = this.nombre_ruta;
			
			console.log (datos_pedidos)
			
		this.srv.get_pedidos_ruta(datos_pedidos).subscribe(
		data => {
		   console.log("OBTENIENDO PEDIDOS PENDIENTE POR RUTA")
		   console.log(data)
		   this.lista_pedidos_ruta = data
		   
			}); 
			
		this.srv.get_pedidos_ruta_programada(datos_pedidos).subscribe(
		data => {
		   console.log("OBTENIENDO PEDIDO PROGRAMADOS")
		   console.log(data)
		   this.lista_pedidos_ruta_programada = data
		   this.calendarEvents = []
		   // this.calendarEvents =  [{ title: "EXPRESS GRILL CIA LTDA/00004800", start: "2020-03-17T00:00:00.000-05:00", end: "2020-12-17T00:30:000-05:00" }]
		   
		       // calendarEvents: EventInput[] = [
    // { title: 'Carlos Ledezma', start: '2019-12-13T08:15:05-05:00' ,end: '2019-12-13T08:30:05-05:00'}
	// { title: 'Maria Ledezma', start: '2019-12-13T10:30:05-05:00' ,end: '2019-12-13T10:45:05-05:00'}
  // ];
		   
		   this.calendarEvents =data
		   console.log (this.calendarEvents)
		   
			}); 
			
			// let calendarApi = this.calendarComponent.getApi();
			// calendarApi.refetchEvents();
			// console.log ("#### calendar event  #####")
			// console.log (calendarApi.getEventSources());
		
		
		// this.ngOnInit()
		// this.calendarComponent.fullCalendar('refetchEvents');
		

		
		
	}
  
  
  
  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }
   doNotRenderEvents(info) {
	   console.log ("##################   SETANDO RENDER EVENT  ########")
	  
    return false
  }

  handleDateClick(arg) {
	  console.log (arg.dateStr)
	  console.log(arg)
    // if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      // this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
	  // // calendar.gotoDate( date )
        // title: 'New Event',
        // start: arg.date,
        // allDay: arg.allDay
      // })
    // }
	
	
	
	// $(".day-highlight").removeClass("day-highlight");
	$(".day-highlight").removeClass("day-highlight");
    $(arg.jsEvent.target).addClass("day-highlight");
	
	
	let calendarApi = this.calendarComponent.getApi();
	// calendarApi.gotoDate('2019-12-13'); // call a method on the Calendar object
	calendarApi.gotoDate(arg.dateStr); // call a method on the Calendar object
	
	// data-goto='{"date":"2019-12-11","type":"day"}'
	
	
  }
 
  
   navLinkDayClick(date,arg) {
    alert('Nav Link clicked')
  }
  
   eventDrop(info) {
	   console.log("#### EVENT DROP ###")
	   console.log(info);
	   console.log("#### Atributo fecha ###")
	   // console.log(Object.getPrototypeOf(info.event._instance))
	   // console.log(info.event._instance.__proto__)
       console.log(info.event._instance.range["start"])
	   
	   
	   
	   	let fecha_entrega = formatDate(info.event._instance.range["start"], 'yyyy-MM-dd', 'en-US', '-0500');
		let hora_entrega = formatDate(info.event._instance.range["start"], 'HH:mm:00', 'en-US', '-0000');
		
		let nombre_numero_pedido = info.event._def["title"]
		
			// this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	// this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
		
		
		console.log (fecha_entrega)
		console.log (hora_entrega)
		console.log (nombre_numero_pedido)
		
		let nombre_numero_pedido_array = nombre_numero_pedido.split("/",2)
		let nombre_cliente = nombre_numero_pedido_array[0]
		let num_pedido=nombre_numero_pedido_array[1]

		let datos_set_fecha_hora = {};
			
			datos_set_fecha_hora['empresa'] = this.empresa;	
			datos_set_fecha_hora['fecha_entrega'] = fecha_entrega;
			datos_set_fecha_hora['hora_entrega'] = hora_entrega;
			datos_set_fecha_hora['num_pedido'] = num_pedido;
			datos_set_fecha_hora['accion'] = 'ARRASTRAR';
			
			console.log (datos_set_fecha_hora)
		
		
		this.srv.set_fecha_hora_pedido(datos_set_fecha_hora).subscribe(
		data => {
		   console.log("SETEANDO_FECHA_HORA_PEDIDO")
		   console.log(data)
	   
			}); 
	
  }
  
  drop(info) {
		 console.log("#### DROP ###")
    console.log(info);
	("###### DATE ####")
	console.log(info.date);
	
	let fecha_entrega  = formatDate(info.date, 'yyyy-MM-dd', 'en-US', '-0500');
	let hora_entrega = formatDate(info.date, 'HH:mm:00', 'en-US', '-0500');
	
	let nombre_numero_pedido = info.draggedEl.innerText
	
	console.log (fecha_entrega)
	console.log (hora_entrega)
	console.log (nombre_numero_pedido)
	console.log (fecha_entrega+"T"+hora_entrega+".000-05:00")
	
		
		let nombre_numero_pedido_array = nombre_numero_pedido.split("/",2)
		let nombre_cliente = nombre_numero_pedido_array[0]
		let num_pedido=nombre_numero_pedido_array[1]

		let datos_set_fecha_hora = {};
			
			datos_set_fecha_hora['empresa'] = this.empresa;	
			datos_set_fecha_hora['fecha_entrega'] = fecha_entrega;
			datos_set_fecha_hora['hora_entrega'] = hora_entrega;
			datos_set_fecha_hora['num_pedido'] = num_pedido;
			datos_set_fecha_hora['accion'] = 'INSERTAR';
			
			console.log (datos_set_fecha_hora)
			
			console.log ("######  CALENDAR EVENT LUEGO DEL DROP ######")
			
		   let nuevo_evento = {title: nombre_numero_pedido, start: fecha_entrega+"T"+hora_entrega+".000-05:00"};
		   
		   // { title: "EXPRESS GRILL CIA LTDA/00004800", start: "2020-04-15T14:00:00.000-05:00" }
		   // this.ciudad_lista = data
		   this.calendarEvents.push(nuevo_evento)
			
			
			// console.log (this.calendarEvents)
			// let calendarApi = this.calendarComponent.getApi();
			
			// let calendarApi = this.calendarComponent.getApi();
			// calendarApi.refetchEvents();
			
			// this.calendarComponent.fullCalendar("refetchEvents");
					// this.calendarComponent.refetchEvents();
			
		  // calendarEvents: EventInput[] = [
			// { title: "EXPRESS GRILL CIA LTDA/00004800", start: "2020-03-17"}
			// ]
		
		
		this.srv.set_fecha_hora_pedido(datos_set_fecha_hora).subscribe(
		data => {
		   console.log("SETEANDO_FECHA_HORA_PEDIDO")
		   console.log(data)
	   
			}); 
			
	this.refresh_page_after_drop = true
	
	
	
	
	
	
	
	
	
	info.draggedEl.parentNode.removeChild(info.draggedEl);
		
		
	
  }
  
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
 // calendarPlugins = [dayGridPlugin, listPlugin,interactionPlugin]; // important!
 
   // calendarEvents = [
    // { title: 'event 1', date: '2019-04-01' }
  // ];
  


	
  // constructor(  
  // private router: Router, 
  // private srv: ApiService, 
  // private route: ActivatedRoute) 
  // {}

  // ngOnInit() {
	
	
	
	// AdminLTE.init();
  
  // }
  
  // addEvent() {
    // this.calendarEvents.push({ title: 'event 2', date: '2019-04-02' });
  // }

  // modifyTitle(eventIndex, newTitle) {
    // this.calendarEvents[eventIndex].title = newTitle;
  // }
 
  // handleDateClick(arg) { // handler method
	// console.log ("ESTOY AQUI")
    // alert(arg.dateStr);
  // }


}
	
	
  

