import { Component, OnInit,ViewChild } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-consulta-cliente',
  templateUrl: './admin-cliente-consulta.component.html',
  styleUrls: ['./admin-cliente-consulta.component.css']
})


	
	// }//FIN ONINIT
	
export class AdminClienteConsultaComponent implements OnInit {
	
 usuario
 empresa
 nomcli
 codcli
 rucced =''
 dircli
 fecult
 email
 telcli
 telcli2 = null
 fectra
 public today= new Date();
 public success
 status
 ciudad
 public ciudad_lista:any = [];
 clientes
 fecha_status_cartera
 saldo_cliente
 
 cambiar_email
 cambiar_telcli
 cambiar_telcli2
 cambiar_dircli
 cambiar_ciudad
 cambiar_rz
 cambiar_ident
 cambiar_tipo_cliente
 cambiar_provincia
 public provincia_lista:any = [];
 provincia

 // clientes = false;
 exist_razon_social = false;
 patron_cliente = undefined;
 razon_social_lista
 
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
	this.cambiar_email = false
	this.cambiar_telcli = false
	this.cambiar_telcli2 = false
	this.cambiar_dircli = false
	this.cambiar_ciudad  = false
	this.cambiar_provincia  = false
	this.cambiar_rz = false
	this.cambiar_ident = false
	this.cambiar_tipo_cliente = false
	
	
	// this.ciudad = 'NO DISPONIBLE'
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
	
	// console.log(this.date)
	
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	this.fecha_status_cartera = this.fectra
		console.log(this.fectra )
	// this.busca_cliente()
	
	// console.log(this.status)
	// if (this.status=='success'){
		
		// this.success = true
	// }
	  
	//PARA BUSCAR CIUDAD
	let datos_ciudad = {};
	datos_ciudad['codemp'] = this.empresa;		
	console.log (datos_ciudad)
	this.srv.ciudad(datos_ciudad).subscribe(
	   data => {
		   console.log("OBTENIENDO CIUDAD")
		   console.log(data)
		   let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
		   this.ciudad_lista = data
		   this.ciudad_lista.push(option_defecto_final)
		   console.log("CIUDAD LISTA")
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
			
		
		
		
	
	AdminLTE.init();
  
  }
  
  consulta_saldo_cartera(){
	
	  console.log("CONSULTO SALDO")
	  let fec_cartera = formatDate(this.fecha_status_cartera, 'yyyy-MM-dd', 'en-US', '-0500');
	  console.log(fec_cartera)
	  
  //PARA BUSCAR SALDO_CLIENTE
  if (this.codcli){

	let datos_saldo_cliente = {};
	datos_saldo_cliente['codemp'] = this.empresa;
	datos_saldo_cliente['fecha_cartera'] = fec_cartera;
	datos_saldo_cliente['codcli'] = this.codcli;
	console.log (datos_saldo_cliente)
	this.srv.saldo_cartera(datos_saldo_cliente).subscribe(
	   data => {
		   console.log("OBTENIENDO SALDO")
		   console.log(data)
		   if (data['saldo_cliente']){
		   this.saldo_cliente ="USD "+data['saldo_cliente']
		   }else{
			this.saldo_cliente = "USD "+0
		   }
		   
		   
		}); 
  }else{
	  alert("Se necesita los datos del cliente para obtener su saldo");
	  
  }
	  
	  
	  
	  
  }
  
  	busqueda_razon_social() { 
	console.log ("##### BUSCAR POR PATRON  ####")
	if (this.patron_cliente){
		const datos = {};
		datos['codemp'] = this.empresa;
		datos['patron_cliente'] = this.patron_cliente;
			this.srv.busqueda_razon_social(datos).subscribe(data => {
				// console.log(data)
				
				
				let longitud_data = data.length

			if (longitud_data > 0 ) {
				console.log(data)

				this.razon_social_lista = data;
				this.exist_razon_social = true;
				// this.searching_articulo = false
				
		
				
			}else {
				alert("Razon Social no encontrado con la palabra clave ingresada <<"+this.patron_cliente+">>");
				// this.searching_articulo = false
				this.exist_razon_social = false;
			}
				

			}); 
		}else  { 
			alert("Por favor llenar el campo Razon Social");
		}
	 }
	 
	 select_razon_social(ident,ruc,rz,correo,codcli,dircli) {
		 console.log ("Seleccion de cliente")
		
		// this.dato_cliente= {"nomcli":rz,"rucced":ruc,"email":correo,"codcli":codcli,"dircli":dircli}
		 // // ['codemp', 'nomcli','rucced','codcli','email','dircli','ciucli','telcli','telcli2']
		// this.tipo_doc = ident 
		// this.ruc = ruc
		// this.razon_social = rz
		
		// if (correo=== null){
			// alert("Favor llenar el correo electronico en la ficha del cliente..!!!")
			// this.email_cliente = undefined
		// }else {
			// this.email_cliente = correo
		// }
		// // this.email_cliente = correo
		// this.clientes = true;
		this.rucced = ruc
		this.tipo_doc = ident
		this.busca_cliente()
		this.exist_razon_social = false;
		this.patron_cliente = undefined;
	 }
  
  
  busca_cliente() { 
	if (this.rucced && this.tipo_doc){
		console.log("#### BUSCO CLIENTE ###")
		const datos = {};
		datos['ruc'] = this.rucced;
		datos['codemp'] = this.empresa;
		datos['tpIdCliente'] = this.tipo_doc;
			this.srv.clientes(datos).subscribe(data => {
				// console.log(data)
			// this.dato_cliente = data
			if (data['rucced']) {
				console.log(data)
				// console.log(data['nomcli'])
				this.nomcli = data['nomcli']
				this.dircli = data['dircli']
				this.email = data['email']
				this.ciudad = data['ciucli']
				this.telcli = data['telcli']
				this.telcli2 = data['telcli2']
				this.codcli = data['codcli']
				if (data['tipo'] == null){
					this.tipo_cliente = '01'
				}else {
				   this.tipo_cliente = data['tipo']
				}
				this.provincia = data['codprov']

				
				this.clientes = true;
			}else {
				let documento=''
				if (this.tipo_doc == 'C'){
					documento = 'CEDULA'
				} else if (this.tipo_doc == 'R') {
					documento = 'RUC'
					
				}else if (this.tipo_doc == 'P'){
					documento = 'PASAPORTE'
				}
				alert("Cliente con "+documento+" "+this.rucced+" no encontrado");
				// alert("Cliente no encontrado");
			}
			}); 
		}else  { 
			alert("Por favor ingrese TIPO DOC / IDENTIFICACION del cliente");
		}
	 
	}
	
	public update_datos(tipo_dato,contenido){
	  console.log("#### DATO NUEVO ########")
	  console.log(tipo_dato)
	  console.log(contenido)
	  
	  if (tipo_dato=='correo'){
		    // if (this.validateEmail(contenido)) {
				this.email=contenido
				console.log(this.email)
			// } else {
				// alert("Formato de Email no válido")
				// this.cambiar_email = false
			// }
	  }else if (tipo_dato=='telcli2'){
		  this.telcli2 = contenido
	  }else if (tipo_dato=='telcli'){
		  this.telcli = contenido
	  } else if (tipo_dato=='dircli'){
		  this.dircli = contenido
	  }
	  

   } //FIN UPDATE_DATOS


  
  	update_cliente() {
			
		console.log("#######ACTUALIZO CLIENTE  ####")
		console.log(this.nomcli)
		console.log(this.rucced)
		console.log(this.dircli)
		console.log(this.telcli)
		console.log(this.telcli2)
		console.log(this.email)
		console.log(this.ciudad)
		console.log(this.fectra)
		console.log(this.tipo_doc)


		const datos = {};
		datos['codus1'] = this.usuario.toUpperCase();
		datos['codemp'] = this.empresa;
		datos['codcli'] = this.codcli;
		datos['nomcli'] = this.nomcli.toUpperCase();
		datos['rucced'] = this.rucced.trim();  //validar que sea formato menos de 13 y numerico
		datos['dircli'] = this.dircli.trim();
		datos['telcli'] = this.telcli.trim();  //validar que sea formato de menos de 10 y numerico
		if (this.telcli2 != null){
			datos['telcli2'] = this.telcli2.trim(); //validar que sea formato de menos de 10 (OPCIONAL) y numerico
		}else{
			datos['telcli2'] = null
		}
		datos['email'] = this.email;  //validar formato
		datos['fectra'] = this.fectra;
		
		if (this.ciudad == "*** OTRA CIUDAD ***"){
			this.ciudad = 'OTRA CIUDAD'
		}
		datos['ciucli'] = this.ciudad;
		datos['tipo'] = this.tipo_cliente;
		datos['tpIdCliente'] = this.tipo_doc;
		datos['codprov'] = this.provincia;
		
		
		// // this.validar_campos_obligatorios(datos)
		// // this.validar_formato_campos_numeros(datos)
		
		// console.log ("#### VALIDACION INICIO CAMPOS NUMERICOS ####")
		// console.log (this.validar_formato_campos_numeros(datos))
		
		// if (this.validar_campos_obligatorios(datos) && this.validar_formato_campos_numeros(datos) && this.validateEmail(this.email) && this.validar_longitud_cedula_ruc(datos)){
		if (this.validar_campos_obligatorios(datos) && this.validar_formato_campos_numeros(datos) && this.validar_longitud_cedula_ruc(datos)){
		console.log("*** ACTUALIZO CLIENTE ***")
		this.srv.actualizar_cliente(datos).subscribe(data => {
				console.log("RESPUESTA DE ENVIO PARA CREAR CLIENTES")
				console.log(data)
				// let datos = {};
				// datos['usuario'] = this.usuario;
				// datos['empresa'] = this.empresa;
				// console.log (data["STATUS"])
				// if (data["STATUS"] == 'DUPLICADO'){
					// alert("Cliente con identificación "+this.rucced+" existe en esta empresa..!!");
				// }else{
					// // this.success = true
					alert("Cliente con identificación "+this.rucced+" actualizado con exito..!!");
					// this.ngOnInit() 
					this.router.navigate(['/admin/dashboard3', datos]);
					
					
					// this.router.navigate(['/admin/crear_pedidos', datos]);
					// // this.ngOnInit()
				}
		); //FIN ENVIO CLIENTE
		}

		
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
		}
		// else if ((!datos['tipo']) || (datos['tipo'] == 'N')){
			// alert("Tipo de cliente no seleccionado. Por favor seleccione PERSONA NATURAL/EMPRESA según el caso")
			// STATUS_OBLIGATORIO = false
		// }
		else if ((!datos['dircli']) || (datos['dircli'].length == 0)){
			alert("Dirección de cliente vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}else if (((!datos['telcli']) || (datos['telcli'].length == 0)) && ((!datos['telcli2']) || (datos['telcli2'].length == 0))){
			alert("Por favor llenar al menos un número telefónico")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['ciucli']) || (datos['ciucli'] == 'NO DISPONIBLE')){
			alert("Ciudad no seleccionada. Por favor seleccione alguna ciudad ó OTRA CIUDAD según el caso.")
			STATUS_OBLIGATORIO = false
		}
		// else if (!datos['codprov']){
			// alert("Provincia no seleccionada. Por favor seleccione alguna")
			// STATUS_OBLIGATORIO = false
		// }
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
	
	
  

