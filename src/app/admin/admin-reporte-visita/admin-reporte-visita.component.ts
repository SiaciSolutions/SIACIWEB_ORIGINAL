import { Component, OnInit,ViewChild,NgZone  } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'



declare const google: any;
declare var AdminLTE: any;


@Component({
  selector: 'app-admin-reporte-visita',
  templateUrl: './admin-reporte-visita.component.html',
  styleUrls: ['./admin-reporte-visita.component.css']
})


	
	// }//FIN ONINIT
	
export class AdminReporteVisitaComponent implements OnInit {
	
 usuario
 empresa
 public today= new Date();
 public loading : boolean;

 lat:number;
 lng:number;
 hora
 address: string;
 lista_visitas
 lista_visitas_tabla
 // buttons: any[];


  constructor(  
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute,
  private ngZone: NgZone
  ) 
  {
	this.loading = true;
	// this.lat=-0.20768118945978148;
	// this.lng=-78.50071878070973
  }

  // dtOptions: DataTables.Settings = {};
  dtOptions:any = {};

  ngOnInit() {
	
	if (!this.srv.isLoggedIn()){
	this.router.navigateByUrl('/')};
	   
	this.route.queryParams.subscribe(params => {
		console.log(params)
        // Defaults to 0 if no query param provided.
        // this.ruc = +params['ruc'] || 0;
		this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
		this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
      });
	console.log(this.usuario)
	console.log(this.empresa)

	const datos = {};
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;	
	console.log (this.usuario)
	console.log (this.empresa)
	console.log (datos)
	this.srv.lista_visitas(datos).subscribe(
	   data => {
		   console.log(data)
		   console.log ("EJECUTADA DATA") 
			this.lista_visitas_tabla = data
		}); 
		
		setTimeout(()=> {	
			console.log("TIME OUT")
			this.lista_visitas = this.lista_visitas_tabla
			this.dtOptions = {
				order: [[0, 'desc'],[1,'desc']],
				lengthMenu : [5, 10, 25, 50],
				 dom: 'Bfrtip',
				// buttons: [
        // 'columnsToggle',
        // 'colvis',
        // 'copy',
        // 'print',
        // 'excel',
        // {
          // text: 'Some button',
          // key: '1',
          // action: function (e, dt, node, config) {
            // alert('Button activated');
          // }
        // }
      // ]
			buttons: ['print','excel'],
			processing: true
			};
		this.loading = false;
		
		}, 3000)	
	
	AdminLTE.init();
  }
  
   	ubicar(lat,lng) {
		console.log("*****DENTRO DE UBICAR***")
		
		console.log("LAT: "+lat+",LONG: "+lng)
		
		this.lat = parseFloat(lat)
		this.lng = parseFloat(lng)
		
		
	}
  
	
  	// findMe() {
		// console.log("*****DENTRO DE FINDME***")
		// if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(
		  // (position) => {
			  // console.log("*****SE LOCALIZA COORDENADAS***")
			  
			// this.lat = position.coords.latitude
			 // this.lng  = position.coords.longitude
			// console.log(this.lng+" / "+this.lat)
			
			// let geocoder = new google.maps.Geocoder();
			// let latlng = new google.maps.LatLng(this.lat, this.lng);
			// let request = {
				// latLng: latlng
			  // };

		  // geocoder.geocode(request, (results, status) => {
			// if (status == google.maps.GeocoderStatus.OK) {
			  // if (results[0] != null) {
				// this.address = results[0].formatted_address;  //<<<=== DOES NOT WORK, when I output this {{ address }} in the html, it's empty
				// console.log(this.address);  //<<<=== BUT here it Prints the correct value to the console !!!
			  // } else {
				// alert("No address available");
			  // }
			// }
		  // });
			
		
		  // });//FIN POSICION    
		// } else {
		  // alert("Geolocation is not supported by this browser.");
		// }
	// }
       
}
	
	
  

