import { Component, OnInit,ViewChild } from '@angular/core';
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
import interactionPlugin from '@fullcalendar/interaction';
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

  calendarVisible = true;           
  calendarPlugins = [dayGridPlugin, timeGridPlugin,listPlugin, interactionPlugin];
  calendarWeekends = true;
  
  usuario
  empresa
  // calendarEvents: EventInput[] = [
    // { title: 'Event Now', start: new Date() }
  // ];
  
    // calendarEvents: EventInput[] = [
    // { title: 'Carlos Ledezma', start: '2019-12-13T08:15:05-05:00' ,end: '2019-12-13T08:30:05-05:00'}
	// { title: 'Maria Ledezma', start: '2019-12-13T10:30:05-05:00' ,end: '2019-12-13T10:45:05-05:00'}
  // ];
  
  calendarEvents: EventInput[]
  
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
	this.srv.consulta_citas(datos).subscribe(
	   data => {
		   console.log ("CONSULTAS EJECUTADA DATA") 
		   console.log(data)
		   this.calendarEvents = data
		   

			// this.lista_visitas_tabla = data
		}); 
	
	
	
	AdminLTE.init();
  
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
	
	
  

