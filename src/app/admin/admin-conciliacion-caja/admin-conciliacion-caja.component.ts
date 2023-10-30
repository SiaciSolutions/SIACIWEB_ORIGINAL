import { Component, OnInit,ViewChild } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-conciliacion-caja',
  templateUrl: './admin-conciliacion-caja.component.html',
  styleUrls: ['./admin-conciliacion-caja.component.css']
})



	

export class AdminConciliacionCaja implements OnInit {


	public today= new Date();
	public caja_escogida: boolean;
	public almacen_lista:any = [];
	public almacen
	public almacen_nombre
	public caja_lista:any = [];
	public caja
	public turno
	public subtotal_dinero_mano = 0
	public dinero_tipo_selecc
	public dinero_denominacion_selecc
	public cant_tipo_dinero
	public total_caja = 0
	public status_caja = undefined
	public accion_caja = undefined

	jstoday = '';
	fectra = '';
	usuario = ''
	empresa = ''
	ruc = '';

	dinero_mano: any = []

	dinero_tipo: any = [
	{ codigo: "0", tipo: "BILLETES"},
	{ codigo: "1", tipo: "MONEDAS"},	
	{ codigo: "2", tipo: "CHEQUES"},
	{ codigo: "3", tipo: "TARJETAS"},
	{ codigo: "4", tipo: "EGRESOS (Se restará al total)"},
	{ codigo: "5", tipo: "OTROS INGRESOS"}
	]
	
	public dinero_denominacion: any = []

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  
  { 
  this.caja_escogida = false;

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
		this.accion_caja = params['accion'] || this.route.snapshot.paramMap.get('accion') || 0;
      });
	
	// this.status_caja = this.srv.getStatusCaja()
	
		////PARA BUSCAR VALIDAR APERTURA_CIERRE_CAJA
	const datos_caja = {};
	datos_caja['codemp'] = this.empresa;
	datos_caja['usuario'] = this.usuario;
	
	
	this.srv.status_caja(datos_caja).subscribe(
	   data => {
		   console.log("OBTENIENDO STATUS_CAJA DE BASE DE DATOS")
		   console.log(data)
		   console.log(data["tipo_caja"])
		   this.status_caja = data["tipo_caja"]
		   // this.almacen = data["nomalm"]
		   // this.caja = data["caja"]
		   // this.turno = data["turno"]

			// let param = {}
			// param['usuario'] = this.usuario;
			// param['empresa'] = this.empresa;
			// console.log("##### PARAMETROS PARA CAJA #####")
			// console.log(param)
	

		   // if (data["tipo_caja"] == 'C'){
			   // let caja_param = {}
			   // caja_param['status_caja'] = data["tipo_caja"] 
			   // this.srv.seteo_caja(caja_param)
			   
				// this.router.navigate(['/admin/conciliacion-caja', param]);

		   // }
		   if (data["tipo_caja"] == 'A'){
			   this.almacen_nombre = data["nomalm"]
			   this.almacen = data["almacen"]
			   this.caja = data["caja"]
			   this.turno = data["turno"]
		   }
		  

		}); 

	
	console.log ("####### STATUS CAJA  #######")
	console.log (this.status_caja)
	
	console.log(this.usuario)
	console.log(this.empresa)
	console.log(this.accion_caja)

	this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	
////PARA BUSCAR ALMACEN
	const datos = {};
	datos['codemp'] = this.empresa;
	datos['codusu'] = this.usuario;		
	datos['codagencia'] = this.srv.getCodAgencia();
	console.log (datos)

	this.srv.almacen(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO ALMACEN")
		   console.log(data)
		   this.almacen_lista = data

		}); 
		

	AdminLTE.init();
	}
	
	
	public update_dinero_mano (tipo, cant) {
		console.log("ACTUALIZAR TIPO_DINERO")
		console.log("####  TIPO DINERO ########")
		console.log(tipo)
		console.log("####  CANTIDAD TIPO NUEVA ########")
		console.log(cant)
		
		// var cant_new =cant
		
	if 	(cant){

	
	this.dinero_mano.map(function(dato){
		console.log("VOY ACTUALIZAR ARRAY DINERO EN MANO")
	  if(dato.tipo == tipo){
		  console.log("ACTUALIZANDO CANTIDAD DE TIPO: "+tipo)
		dato.cant = parseFloat(cant);

	  }
	  return dato;
	});

	if (tipo == 'EGRESOS (Se restará al total)'){
		this.subtotal_dinero_mano = this.redondear(this.dinero_mano.reduce((acc,obj,) => acc + (obj.cant),0))-(parseFloat(cant)*2);
	}else {
		this.subtotal_dinero_mano = this.redondear(this.dinero_mano.reduce((acc,obj,) => acc + (obj.cant),0));
	}

    console.log("Total: ", this.subtotal_dinero_mano)


	}


   }
	
	
	
	
	abrirCaja(){
		console.log("***** ABRIR CAJA *****")
		console.log (this.almacen+" / "+this.caja+" / "+this.turno)
		
	}
	
	
	getcajas(){
		let datos_caja = {};
		console.log("### ALMACEN DE ENTRADA")
		console.log(this.almacen)
		datos_caja['codemp'] = this.empresa;
		datos_caja['codusu'] = this.usuario;	
		datos_caja['codalm'] = this.almacen;	
		console.log("OBTENIENDO CAJA")
		this.srv.caja(datos_caja).subscribe(
		   data => {
			   console.log("OBTENIENDO CAJA ")
		       console.log(data)
			   this.caja_lista = data
		   })
	}
	
	get_denominacion(){
		console.log("### OBTENER TIPO DENOMINACION ###")
		console.log("### TIPO DINERO SELECCIONADO")
		console.log (this.dinero_tipo_selecc)
		
		if (this.dinero_tipo_selecc == 'BILLETES'){
			console.log ("cambiando a billetes")
			
			this.dinero_denominacion = [
			{ monto: "1", tipo: "1 Dolar"},
			{ monto: "2", tipo: "2 Dolares"},	
			{ monto: "5", tipo: "5 Dolares"},
			{ monto: "10", tipo: "10 Dolares"},
			{ monto: "20", tipo: "20 Dolares"},
			{ monto: "50", tipo: "50 Dolares"},
			{ monto: "100", tipo: "100 Dolares"}
			]
		}
		
		if (this.dinero_tipo_selecc == 'MONEDAS'){
			console.log ("cambiando a monedas")
			this.dinero_denominacion = [
			{ monto: "0.01", tipo: "1 centavo"},
			{ monto: "0.05", tipo: "5 centavos"},	
			{ monto: "0.10", tipo: "10 centavos"},
			{ monto: "0.50", tipo: "50 centavos"},
			{ monto: "1", tipo: "1 dolar"}
			]
		}
	
	
	
	}

	insertar_conteo(){
		console.log("### INSERTAR CONTEO ###")
		console.log("### TIPO DINERO###")
		console.log(this.dinero_tipo_selecc)
		console.log("### TIPO DENOMINACION###")
		console.log(this.dinero_denominacion_selecc)
		console.log("### TIPO CANT DINERO###")
		console.log(this.cant_tipo_dinero)
		let validar_insercion = true
		
		
		if (!this.dinero_denominacion_selecc && ((this.dinero_tipo_selecc == 'BILLETES') || (this.dinero_tipo_selecc == 'MONEDAS'))){
			alert("POR FAVOR SELECCIONE DENOMINACIÓN DE LA MONEDA O BILLETE")
			validar_insercion = false
		}else if(!this.cant_tipo_dinero || (this.cant_tipo_dinero.length == 0)) {
			alert("POR FAVOR COLOCAR UNA CANTIDAD/MONTO")
			validar_insercion = false
		}
		
		if (validar_insercion){
		
			let dinero_selecc = {};
			
			if (this.dinero_tipo_selecc == 'EGRESOS (Se restará al total)'){
				this.dinero_tipo_selecc = 'EGRESOS'
			}


			if (this.dinero_tipo_selecc == 'BILLETES'){
				dinero_selecc['id']  = this.dinero_mano.length
				dinero_selecc['tipo']  = this.dinero_tipo_selecc
				dinero_selecc['denominacion']  = this.dinero_denominacion_selecc
				dinero_selecc['cant']  = this.cant_tipo_dinero
				dinero_selecc['valor']  = (this.cant_tipo_dinero*this.dinero_denominacion_selecc)
				this.dinero_mano.push(dinero_selecc)
			}
			if (this.dinero_tipo_selecc == 'MONEDAS'){
				dinero_selecc['id']  = this.dinero_mano.length
				dinero_selecc['tipo']  = this.dinero_tipo_selecc
				dinero_selecc['denominacion']  = this.dinero_denominacion_selecc
				dinero_selecc['cant']  = this.cant_tipo_dinero
				dinero_selecc['valor']  = (this.cant_tipo_dinero*this.dinero_denominacion_selecc)
				this.dinero_mano.push(dinero_selecc)
			}
			if (this.dinero_tipo_selecc == 'CHEQUES'){
				dinero_selecc['id']  = this.dinero_mano.length
				dinero_selecc['tipo']  = this.dinero_tipo_selecc
				dinero_selecc['denominacion']  = 'NO APLICA'
				dinero_selecc['cant']  = 'NO APLICA'
				dinero_selecc['valor']  = parseFloat(this.cant_tipo_dinero)
				this.dinero_mano.push(dinero_selecc)
			}
			if (this.dinero_tipo_selecc == 'TARJETAS'){
				dinero_selecc['id']  = this.dinero_mano.length
				dinero_selecc['tipo']  = this.dinero_tipo_selecc
				dinero_selecc['denominacion']  = 'NO APLICA'
				dinero_selecc['cant']  = 'NO APLICA'
				dinero_selecc['valor']  = parseFloat(this.cant_tipo_dinero)
				this.dinero_mano.push(dinero_selecc)
			}
			if (this.dinero_tipo_selecc == 'EGRESOS'){
				dinero_selecc['id']  = this.dinero_mano.length
				dinero_selecc['tipo']  = this.dinero_tipo_selecc
				dinero_selecc['denominacion']  = 'NO APLICA'
				dinero_selecc['cant']  = 'NO APLICA'
				dinero_selecc['valor']  = parseFloat(this.cant_tipo_dinero)
				this.dinero_mano.push(dinero_selecc)
			}
			if (this.dinero_tipo_selecc == 'OTROS INGRESOS'){
				dinero_selecc['id']  = this.dinero_mano.length
				dinero_selecc['tipo']  = this.dinero_tipo_selecc
				dinero_selecc['denominacion']  = 'NO APLICA'
				dinero_selecc['cant']  = 'NO APLICA'
				dinero_selecc['valor']  = parseFloat(this.cant_tipo_dinero)
				this.dinero_mano.push(dinero_selecc)
			}
			
			let suma_montos = 0
			let resta_montos = 0
			console.log(this.dinero_mano)
			let recorrer_dinero_mano
			for (recorrer_dinero_mano of this.dinero_mano) {
				console.log ("## RECORRE DINERO MANO ##")
				console.log (recorrer_dinero_mano)
				console.log (recorrer_dinero_mano["tipo"])
				
				if (recorrer_dinero_mano["tipo"] != 'EGRESOS'){
					console.log ("SUMA MONTOS")
					suma_montos = suma_montos + parseFloat(recorrer_dinero_mano["valor"])
				}else{
					console.log ("RESTA MONTOS")
					resta_montos = resta_montos + parseFloat(recorrer_dinero_mano["valor"])
				}
				
			}
			// console.log ("SUMA MONTOS= "+suma_montos)
			// console.log ("RESTA MONTOS= "+resta_montos)
			// suma_montos = suma_montos
			// resta_montos = presta_montos)
			this.total_caja = suma_montos - resta_montos
			this.dinero_denominacion_selecc = undefined
			this.cant_tipo_dinero = undefined
			
		
			//EL QUE FUNCIONOOOO
			// this.total_caja = this.redondear(this.dinero_mano.reduce((acc,obj,) => acc + (obj.valor),0));	
		}
		
	}
	
	abrir_cerrar_caja(){
		console.log ("### DENTRO DE ABRIR/CERRAR CAJA #####")
		console.log ("## ALMACEN ##")
		console.log (this.almacen)
		console.log ("## CAJA ##")
		console.log (this.caja)
		console.log ("## TURNO ##")
		console.log (this.turno)
		
		if (this.almacen && this.caja && this.turno && this.dinero_mano.length > 0){
		
		
		// let datos_abrir_cerrar = {};
		// // console.log(this.almacen)
		// datos_abrir_cerrar['codemp'] = this.empresa;
		// datos_abrir_cerrar['codalm'] = this.almacen;
		// datos_abrir_cerrar['codcierre'] = this.caja;
		// datos_abrir_cerrar['tipo'] = 'PV';
		// datos_abrir_cerrar['signo'] = '+';	
		// datos_abrir_cerrar['codusu'] = this.usuario;		
		// datos_abrir_cerrar['cajero'] = this.usuario;
		// datos_abrir_cerrar['tipo_caja'] = 'A';
		// datos_abrir_cerrar['turno'] = this.turno;
		// datos_abrir_cerrar['codmon'] = '01';
		
		
		// datos_abrir_cerrar['fecult'] = /////VERIFICAR FECHA
		// datos_abrir_cerrar['hora'] =  /////VERIFICAR FECHA
		
		
		let recorrer_dinero_mano
		for (recorrer_dinero_mano of this.dinero_mano) {
			console.log ("## RECORRE DINERO MANO PARA ABRIR/CERRAR CAJA##")
			console.log (recorrer_dinero_mano)
			console.log (recorrer_dinero_mano['tipo'])
			let datos_abrir_cerrar = {};
			datos_abrir_cerrar['codemp'] = this.empresa;
			datos_abrir_cerrar['codalm'] = this.almacen;
			datos_abrir_cerrar['codcierre'] = this.caja;
			datos_abrir_cerrar['fecdoc'] = this.fectra;
			datos_abrir_cerrar['tipo'] = 'PV';
			datos_abrir_cerrar['signo'] = '+';	
			datos_abrir_cerrar['descripcion'] = recorrer_dinero_mano['tipo']
			if ((recorrer_dinero_mano['tipo']!= 'BILLETES') && (recorrer_dinero_mano['tipo'] != 'MONEDAS')){
				datos_abrir_cerrar['valor_tipo'] =  1
				datos_abrir_cerrar['cantidad_tipo'] =  recorrer_dinero_mano['valor']
			}else{
				console.log ("BILLETES O MONEDAS")
				datos_abrir_cerrar['valor_tipo'] =  recorrer_dinero_mano['denominacion']
				datos_abrir_cerrar['cantidad_tipo'] =  recorrer_dinero_mano['cant']
			}
			datos_abrir_cerrar['valor_total'] =  recorrer_dinero_mano['valor']
			datos_abrir_cerrar['codusu'] = this.usuario;
			datos_abrir_cerrar['fecult'] = this.fectra;		
			datos_abrir_cerrar['cajero'] = this.usuario;
			
			//PARA DETERMINAR SI ABRIR O CERRAR CAJA
			if (this.status_caja == 'C'){
				datos_abrir_cerrar['tipo_caja'] = 'A';
			}else if (this.status_caja == 'A') {
				datos_abrir_cerrar['tipo_caja'] = 'C';
			}
			
			
			datos_abrir_cerrar['turno'] = this.turno;
			datos_abrir_cerrar['codmon'] = '01';
			
			
			this.srv.cajapost(datos_abrir_cerrar).subscribe(
			   data => {
				   console.log("RESULTADO_ABRIR_CERRAR_CAJA")
				   console.log(data)
				   let param = {}
					param['usuario'] = this.usuario;
					param['empresa'] = this.empresa;
				   this.router.navigate(['/admin/pos', param]);
				   // this.caja_lista = data
			   })

				
			}
				
		}else{
			alert ("Por favor llenar Almacen/Caja/Turno y Dinero a registrar")
		}

	
	}

	delete_item_todo () {
		console.log("ENTRADA ITEM A ELIMINAR TODOOOOO")
			this.dinero_mano = []
		console.log("LIMPIANDO DINERO EN MANO")	
			console.log(this.dinero_mano)
			this.total_caja = this.redondear(this.dinero_mano.reduce((acc,obj,) => acc + (obj.valor),0));	
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
			// this.iva_porcentaje = 0
			// this.iva_cant = 0
			// this.total = 0
	
    }
	
	
	delete_item (el) {
		console.log("ENTRADA ARTICULO A ITEM")
		console.log(el)

	 let json_eliminar = this.dinero_mano
	 var id = el
	 
	json_eliminar = json_eliminar.filter(function(dato){
	  if(dato.id == id){
		  return false
	  }else {
		 return true 
		  
	  }
	  return dato;
	});	 
	
	console.log(json_eliminar);//json original
	this.dinero_mano = json_eliminar
	
	let suma_montos = 0
	let resta_montos = 0
	console.log(this.dinero_mano)
	let recorrer_dinero_mano
	for (recorrer_dinero_mano of this.dinero_mano) {
		console.log ("## RECORRE DINERO MANO ##")
		console.log (recorrer_dinero_mano)
		console.log (recorrer_dinero_mano["tipo"])
		
		if (recorrer_dinero_mano["tipo"] != 'EGRESOS'){
			console.log ("SUMA MONTOS")
			suma_montos = suma_montos + parseFloat(recorrer_dinero_mano["valor"])
		}else{
			console.log ("RESTA MONTOS")
			resta_montos = resta_montos + parseFloat(recorrer_dinero_mano["valor"])
		}
		
	}
	console.log ("SUMA MONTOS= "+suma_montos)
	console.log ("RESTA MONTOS= "+resta_montos)
	this.total_caja = suma_montos - resta_montos
	
	
	
	// this.total_caja = this.redondear(this.dinero_mano.reduce((acc,obj,) => acc + (obj.valor),0));	

	
    }
	
	
	
	redondear (el) {
		// console.log("ENTRADA ARTICULO REDONDEAR")
		// console.log(el)
	return Math.round(el * 100) / 100;
    }
	

   
	public validaNumericos(event: any) {
    if((event.charCode >= 48 && event.charCode <= 57) ||(event.charCode == 46)){
      return true;
     }
     return false;        
	}
	
	public validaNumericosCantidad(event: any) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
	}
   
   
  
}
