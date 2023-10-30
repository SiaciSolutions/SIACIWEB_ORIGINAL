import { Component, OnInit,ViewChild,Input  } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-cliente',
  templateUrl: './admin-cliente.component.html',
  styleUrls: ['./admin-cliente.component.css']
})


	
	// }//FIN ONINIT
	
export class AdminClienteComponent implements OnInit {
	
 usuario
 empresa
 nomcli = null
 rucced = null
 dircli = null
 fecult 
 email = null
 telcli = null
 telcli2 = null
 fectra
 public today= new Date();
 public success
 status
 ciudad
 loading_modulo = false
 public ciudad_lista:any = [];
 public provincia_lista:any = [];
 provincia
 @Input() status_cambio_vista_cliente: string;

 
 public tipo_doc_lista = [
			{"tipo": "C", "nom_doc": "CEDULA"},
			{"tipo": "R", "nom_doc": "RUC"},
			{"tipo": "P", "nom_doc": "PASAPORTE"}
		];
  tipo_doc

 public tipo_cliente_lista = [
			{"tipo": "01", "nom_tipo_cli": "PERSONA NATURAL"},
			{"tipo": "02", "nom_tipo_cli": "EMPRESA"}
		];
  tipo_cliente

  constructor(  
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  {
	this.success = false
	this.ciudad = 'NO DISPONIBLE'
	this.status_cambio_vista_cliente = 'false'

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
	
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	// console.log(this.status)
	// if (this.status=='success'){
		
		// this.success = true
	// }
	  
	////PARA BUSCAR CIUDAD
	let datos_ciudad = {};
	datos_ciudad['codemp'] = this.empresa;		
	console.log (datos_ciudad)
	this.srv.ciudad(datos_ciudad).subscribe(
	   data => {
		   console.log("OBTENIENDO CIUDAD")
		   console.log(data)
		   // let option_defecto = {"codemp": "01", "codgeo": "0", "nomgeo": "*** Seleccione ciudad ***"};
		   let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
		   this.ciudad_lista = data
		   // this.ciudad_lista.unshift(option_defecto)
		   this.ciudad_lista.push(option_defecto_final)
		   console.log("CIUDAD LISTA")
		   console.log(this.ciudad_lista)
		   // this.ciudad_lista = option_defecto
		});
		
	////PARA BUSCAR PROVINCIA
	let datos_prov = {};
	datos_prov['codemp'] = this.empresa;		
	this.srv.provincia(datos_prov).subscribe(
	   data => {
		   console.log("OBTENIENDO PROVINCIA")
		   console.log(data)
		   this.provincia_lista = data
		});
		

		

		console.log ("#### CAMBIO DE VISTA ####")
		console.log(this.status_cambio_vista_cliente)

		
		
	
	AdminLTE.init();
  
  }
  
  
  
   public cambio_vista(modo){
	  console.log("#### CAMBIO VISTA ########")
	  console.log (modo)
	  this.status_cambio_vista_cliente = modo
	  
   }//FIN UPDATE_CIUDAD
   
   public update_ciudad(ciudad){
	  console.log("#### CIUDAD SELECCIONADA ########")
	  console.log (ciudad)
	  if (ciudad === "*** OTRA CIUDAD ***"){
		  this.ciudad = 'OTRA CIUDAD'
	  }else if (ciudad === "*** Seleccione ciudad ***"){
		   this.ciudad = 'NO DISPONIBLE'
	  }else{
		  this.ciudad = ciudad
	  }
	   console.log (this.ciudad)
   }//FIN UPDATE_CIUDAD
    
	public update_tipo_doc(tipo_doc){
	  console.log("#### TIPO DOC ########")
	  console.log (tipo_doc)
	  this.tipo_doc = tipo_doc
	  // if (ciudad === "*** OTRA CIUDAD ***"){
		  // this.ciudad = 'OTRA CIUDAD'
	  // }else if (ciudad === "*** Seleccione ciudad ***"){
		   // this.ciudad = 'NO DISPONIBLE'
	  // }else{
		  // this.ciudad = ciudad
	  // }
	   // console.log (this.ciudad)
	  
	   
	  
   }//FIN UPDATE_CIUDAD
   	public update_tipo_cliente(tipo_cliente){
	  console.log("#### TIPO CLIENTE ########")
	  console.log (tipo_cliente)
	  this.tipo_cliente = tipo_cliente
	  // if (ciudad === "*** OTRA CIUDAD ***"){
		  // this.ciudad = 'OTRA CIUDAD'
	  // }else if (ciudad === "*** Seleccione ciudad ***"){
		   // this.ciudad = 'NO DISPONIBLE'
	  // }else{
		  // this.ciudad = ciudad
	  // }
	   // console.log (this.ciudad)
	  
	   
	  
   }//FIN UPDATE_CIUDAD
  
  	crea_cliente() {

			
		console.log("CREA CLIENTE")
		console.log(this.nomcli)
		console.log(this.rucced)
		console.log(this.dircli)
		console.log(this.telcli)
		console.log(this.telcli2)
		console.log(this.email)
		console.log(this.fectra)

	// if (this.ruc){
		const datos = {};
		datos['codus1'] = this.usuario.toUpperCase();
		datos['codemp'] = this.empresa;
		datos['nomcli'] = this.nomcli.toUpperCase();
		datos['rucced'] = this.rucced;  //validar que sea formato menos de 13 y numerico
		datos['dircli'] = this.dircli;
		datos['telcli'] = this.telcli;  //validar que sea formato de menos de 10 y numerico
		datos['telcli2'] = this.telcli2; //validar que sea formato de menos de 10 (OPCIONAL) y numerico
		datos['email'] = this.email;  //validar formato
		datos['fectra'] = this.fectra;
		
		if (this.ciudad == "*** OTRA CIUDAD ***"){
			this.ciudad = 'OTRA CIUDAD'
		}
		datos['ciucli'] = this.ciudad;
		datos['codprov'] = this.provincia;
		datos['tipo'] = this.tipo_cliente;
		datos['tpIdCliente'] = this.tipo_doc;
		
		// this.validar_campos_obligatorios(datos)
		// this.validar_formato_campos_numeros(datos)
		
		// if (this.validar_campos_obligatorios(datos) && this.validar_formato_campos_numeros(datos) && this.validateEmail(this.email) && this.validar_longitud_cedula_ruc(datos)){
		if (this.validar_campos_obligatorios(datos) && this.validar_formato_campos_numeros(datos) && this.validar_longitud_cedula_ruc(datos)){
		console.log("*** CREO CLIENTE ***")
		this.loading_modulo = true
		this.srv.crear_cliente(datos).subscribe(data => {
				console.log("RESPUESTA DE ENVIO PARA CREAR CLIENTES")
				// console.log(data)
				let datos = {};
				datos['usuario'] = this.usuario;
				datos['empresa'] = this.empresa;
				console.log (data["STATUS"])
				if (data["STATUS"] == 'DUPLICADO'){
					// alert("Cliente con identificación "+this.rucced+" existe en esta empresa..!!");
					alert("ATENCION : EL CLIENTE CON IDENTIFICACION "+this.rucced+" EXISTE EN ESTA EMPRESA..!!");
					this.loading_modulo = false
				}else{
					// this.success = true
					alert("Cliente con identificación "+this.rucced+" creado con exito..!!");
					if (this.status_cambio_vista_cliente == 'false'){
						// location.reload()
						this.router.navigate(['/admin/dashboard3', datos]);
					}
					this.loading_modulo = false

					

					// this.router.navigate(['/admin/crear_pedidos', datos]);
					// this.ngOnInit()
				}
	
			}
		); //FIN ENVIO CLIENTE
		}
		
		
		//#############################EJEMPLO
		  // if (datos['ruc'].length === 0){
		
		// if ((datos['rucced'].length > 13 || datos['rucced'].length === 0)){
			// alert(" EL número de Identificación debe tener valor y contener no debe exceder los 13 caracteres!!");
		// }else {
				// console.log("VALIDADO RUC")
		// }
		//#############################FIN EJEMPLO

		


	 }//FIN FUNCION CREAR CLIENTE
	 
	// validar_campos_obligatorios (nombre,ident,dircli,telcli,telcli2,email,ciudad,tipo_cliente,tipo_doc){
	validar_campos_obligatorios (datos){
		console.log("VALIDANDO CAMPOS OBLIGATORIOS")
		console.log(datos['nomcli'])
		console.log(datos['rucced'])
		console.log(datos['tpIdCliente'])
		console.log(datos['ciucli'])
		let STATUS_OBLIGATORIO = true
		if ((!datos['nomcli']) || (datos['nomcli'].length == 0)){
			alert("Nombre/Razón social vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['rucced']) || (datos['rucced'].length == 0)){
			alert("Número de Indentificacion vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['tpIdCliente']) || (datos['tpIdCliente'] == 'N')){
			alert("Tipo de Identificacion no seleccionado. Por favor seleccione CEDULA/RUC/PASAPORTE según el caso.")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['tipo']) || (datos['tipo'] == 'N')){
			alert("Tipo de cliente no seleccionado. Por favor seleccione PERSONA NATURAL/EMPRESA según el caso")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['dircli']) || (datos['dircli'].length == 0)){
			alert("Dirección de cliente vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}else if (((!datos['telcli']) || (datos['telcli'].length == 0)) && ((!datos['telcli2']) || (datos['telcli2'].length == 0))){
			alert("Por favor llenar al menos un número telefónico")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['ciucli']) || (datos['ciucli'] == 'NO DISPONIBLE')){
			alert("Ciudad no seleccionada. Por favor seleccione alguna ciudad ó OTRA CIUDAD según el caso.")
			STATUS_OBLIGATORIO = false
		}else if (!datos['codprov']){
			alert("Provincia no seleccionada. Por favor seleccione alguna")
			STATUS_OBLIGATORIO = false
		}
		else if ((!datos['email']) || (datos['email'].length == 0)){
			alert("Correo electrónico vacío. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}
		// console.log(datos['rucced'])
		return (STATUS_OBLIGATORIO)
	}
	
	validar_formato_campos_numeros (datos){
		console.log("#######VALIDANDO CAMPOS NUMERICO #####")
		
		// console.log(datos['nomcli'])
		
		console.log(datos['rucced'])
		console.log(datos['telcli'])
		console.log(datos['telcli2'])
		let STATUS = true
		if (isNaN(datos['rucced'])){
			alert(" NUMERO DE INDENTIFICACION SOLO DEBE CONTENER VALORES NUMERICOS..!!");
			STATUS = false
		}else if (isNaN(datos['telcli'])){
			alert(" NUMERO DE TELEFONO DE CONTENER SOLO VALORES NUMERICOS..!!");
			STATUS = false
		}else if (isNaN(datos['telcli2'])){
			alert(" NUMERO DE TELEFONO MOVIL DE CONTENER SOLO VALORES NUMERICOS..!!");
			STATUS = false
		}
		return (STATUS)
	}
	
	validar_longitud_cedula_ruc (datos){
		console.log("####### VALIDAR LOGITUD CEDULA/RUC #######")
		
		 // public tipo_doc_lista = [
			// {"tipo": "C", "nom_doc": "CEDULA"},
			// {"tipo": "R", "nom_doc": "RUC"},
			// {"tipo": "P", "nom_doc": "PASAPORTE"}
		// ];

		console.log(datos['rucced'])
		console.log(datos['tpIdCliente'])
		let STATUS = true
		
		if (datos['tpIdCliente'] == 'C' && datos['rucced'].length != 10){
			alert(" EL NUMERO DE CEDULA DEBE CONTENER 10 DIGITOS...!!!");
			STATUS = false
		}else if (datos['tpIdCliente'] == 'R' && datos['rucced'].length != 13){
			alert("EL NUMERO DE RUC DEBE CONTENER 13 DIGITOS..!!!");
			STATUS = false
		}
		return (STATUS)
	}
	 
	public validaNumericosCantidad(event: any) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
	}
	
	validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let STATUS = true
	if (!re.test(email)){
		alert("FORMATO DE CORREO ELECTRONICO NO VALIDO...!!!");
		STATUS = false
	}
	console.log(STATUS)
  return STATUS;
  	}


// http://localhost:4401/admin/crear_clientes?usuario=SUPERVISOR&empresa=01


}
	
	
  

