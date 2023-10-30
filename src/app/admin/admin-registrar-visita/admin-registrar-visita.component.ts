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
  selector: 'app-admin-registrar-visita',
  templateUrl: './admin-registrar-visita.component.html',
  styleUrls: ['./admin-registrar-visita.component.css']
})


	
	// }//FIN ONINIT
	
export class AdminRegistrarVisitaComponent implements OnInit {
	
 usuario
 empresa
 nomcli
 rucced =''
 dircli
 fecult
 email
 telcli
 telcli2
 fectra
 public today= new Date();
 public success
 status
 ciudad
 codcli
 nombre_cliente
 cliente_datos
 patron
 public cliente_lista

 public ciudad_lista:any = [];
 
 lat:any;
 lng:any;
 hora
 private geoCoder;
 address: string;
 
 public tipo_doc_lista = [
			{"tipo": "C", "nom_doc": "CEDULA"},
			{"tipo": "R", "nom_doc": "RUC"},
			{"tipo": "P", "nom_doc": "PASAPORTE"}
		];
  tipo_doc

 public tipo_cliente_lista = [
			{"tipo": "C", "nom_tipo_cli": "PERSONA NATURAL"},
			{"tipo": "E", "nom_tipo_cli": "EMPRESA"}
		];
  tipo_cliente

  constructor(  
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute,
  private ngZone: NgZone
  
  ) 
  {
	this.success = false
	this.ciudad = 'NO DISPONIBLE'
	
	
	  // if (navigator)
    // {
    // navigator.geolocation.getCurrentPosition( pos => {
        // this.lng = +pos.coords.longitude;
        // this.lat = +pos.coords.latitude;
      // });
    // }
	
	
	  }

  ngOnInit() {
	
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
	// this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	// this.hora = new Date().getHours()
	
	this.hora = formatDate(this.today, 'hh:mm:ss', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');

	
	console.log(this.hora)
	
	AdminLTE.init();
  }
  
    buscar_cliente_nombre(){
  		////PARA BUSCAR CLIENTE POR NOMBRE
	
	if (this.patron){
		

	let datos_nombres = {};
	datos_nombres['codemp'] = this.empresa;	
	datos_nombres['patron'] = this.patron; 
	// 'PINTO RODRIGUEZ';
	
	console.log (datos_nombres)
	this.srv.clientes_nombre(datos_nombres).subscribe(
	   data => {
		   console.log("OBTENIENDO LISTA ")
		   if (data.length == 0){
			   alert("Cliente o Empresa no encontrado con el patron << "+this.patron+" >>");
				   
		   }else {
			   console.log(data)
				this.cliente_lista = data
		   }

			});
		}else  { 
			alert("Por favor ingrese Nombre ó Apellido/Razón Social del cliente");
			}

	
	}
	
  	findMe() {
		console.log("*****DENTRO DE FINDME***")
		if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(
		  (position) => {
			  console.log("*****SE LOCALIZA COORDENADAS***")
			  
			this.lat = position.coords.latitude
			 this.lng  = position.coords.longitude
			console.log(this.lng+" / "+this.lat)
			
			let geocoder = new google.maps.Geocoder();
			let latlng = new google.maps.LatLng(this.lat, this.lng);
			let request = {
				latLng: latlng
			  };

		  geocoder.geocode(request, (results, status) => {
			if (status == google.maps.GeocoderStatus.OK) {
			  if (results[0] != null) {
				this.address = results[0].formatted_address;  //<<<=== DOES NOT WORK, when I output this {{ address }} in the html, it's empty
				console.log(this.address);  //<<<=== BUT here it Prints the correct value to the console !!!
			  } else {
				alert("No address available");
			  }
			}
		  });
			
		
		  });//FIN POSICION    
		} else {
		  alert("Geolocation is not supported by this browser.");
		}
  }
       
  	registrar_visita() {
		console.log ("##### DENTRO DE REGISTRAR VISITA #####")
		console.log (this.cliente_datos)
		// this.findMe()
		let res = this.cliente_datos.split("|");
		let codcli=res[0]
		let nombres=res[1]
		
		// let datos_ciudad = {};
		let datos_registro = {};
		datos_registro['codemp'] = this.empresa
		datos_registro['usuario'] = this.usuario.toUpperCase();
		datos_registro['codcli'] = codcli
		datos_registro['nombres'] = nombres
		datos_registro['fectra'] = this.fectra
		datos_registro['latitud'] = this.lat
		datos_registro['longitud'] = this.lng
		datos_registro['direccion'] = this.address
		
		console.log(codcli+" "+nombres+" "+this.fectra+" "+this.usuario+" "+this.empresa+" "+this.lat+" "+this.lng+" "+this.address)
		
		this.srv.registrar_visita(datos_registro).subscribe(
		   data => {
			   console.log("RECIBIDO DE REGISTRAR VISITA")
			   console.log (data)
			   if (data['status'] == 'REGISTRO EXITOSO'){
				   alert ("Registro de visita EXITOSO...!!!!")
					this.patron = ''
					this.cliente_lista = undefined
					this.cliente_datos = undefined
					this.address = ''					
				   
			   }
  
		});
	}
  
  
   
   

}
	
	
  

