import { Component, OnInit,ViewChild,ElementRef, Renderer2} from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'
import {AdminClienteComponent} from './../admin-cliente/admin-cliente.component';



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-pos',
  templateUrl: './admin-pos.component.html',
  styleUrls: ['./admin-pos.component.css']
})



	

export class AdminPosComponent implements OnInit {
	
	  parametros: {usuario: string, empresa: string};
	
	 myControl = new FormControl();
	 myControl2 = new FormControl();
	filteredOptions: Observable<string[]>;
	filteredarticulo: Observable<string[]>;
	public clientes : boolean;
	public exist_articulo : boolean;
	public razon_social : string;
	public email_cliente : string;
	public subtotal;
	public total = 0;
	public totalBaseIva = 0;
	public today= new Date();
	public edit_cant: boolean
	public desc_cant = 0
	public iva_cant = 0
	public iva_cant_new = 0
	desc_porcentaje = 0;
	public iva_porcentaje = 0;
	subtotal_desc = 0;
	public iva_siaci
	public ciudad_lista:any = [];
	public observacion_pedido = ''
	public cambiar_email:boolean;
	public lista_prec
	public nuevo_precio_renglon
//#############   RETENCIONES DE IVA	
	public retencion_iva_lista;
	public retencion_iva = 0
	public retencion_iva_select = undefined
	public retencion_iva_codigo
//#############   RETENCIONES DE FUENTE
	public retencion_fuente_lista;
	public retencion_fuente = 0;
	public retencion_fuente_select= undefined
	public retencion_fuente_codigo
	
	
	public bancos_lista;
	public codban
	public tarjetas_lista;
	public cuentas_lista
	public codtar
	public total_recibido = 0;
	public cambio = 0;
	public check_efectivo = false
	public check_cheque = false
	public check_tarjeta = false
	public check_credito = false
	public check_trasf_dep = false
	public almacen
	public almacen_nombre
	public caja
	public turno
	public tipo_busqueda : boolean;
	public aplicar_retencion : boolean;
	public habilitar_descuento : boolean;
	public ret_iva_aplicar = 0
	public ret_fuente_aplicar = 0
	
	public monto_efectivo = 0
	public monto_cheque = 0
	public monto_tarjeta = 0
	public monto_credito = 0
	public monto_transferencia = 0
	public num_pagos_credito = 1
	public plazo_dias_pagos = 1
	
	public num_cheque = ''
	public num_tarjeta = ''
	public num_tranf = ''
	lista_pedidos
	numplaca = null
	public observacion_factura = null
	
	loading_modulo = false
	
	patron_razon_social_pedido
	
	coddep
	exist_pedido = false

	
	// public now: Date = new Date();
	// public date_real

	
	
	jstoday = '';
	fectra = '';
	// public date : string;
	// clientes;
	usuario = ''
	empresa = ''
	ruc = '';
	patron_articulo = '';
	cantidad_nueva = '';
	ciudad

	// editART: ARTICULO
	editART: any = []
	dato_cliente
	
	options: any = []
	articulo: any = []
	articulos_seleccionado
	elements_checkedList:any = [];
	 masterSelected:boolean;
	serie
	articulos_pedido: any = []
	// #### PARA MARCAR LA EDICION DEL PRECIO DEL ARTICULO
	public edit_articulos
	numtra_pedido = undefined
	tiptra_pedido = undefined
	busqueda_cliente = 'RZ'
	
	
	// public getConfAbrirCierreCaja(): string {
	  // return localStorage.getItem('act_abrir_cierre_caja')
    // }
// public getConfRetencionesPdv(): string {
	  // return localStorage.getItem('act_retenciones_pdv')
   // }
	
	 
	 @ViewChild('facturacion') facturacion: ElementRef;
	 @ViewChild('crear_cliente') crear_cliente: ElementRef;
	 @ViewChild('importar_pedido') importar_pedido: ElementRef;
	 @ViewChild('tab_facturacion') tab_facturacion: ElementRef;
	 @ViewChild('tab_crear_cliente') tab_crear_cliente: ElementRef;
	 @ViewChild('tab_importar_pedido') tab_importar_pedido: ElementRef;
	 
   @ViewChild("cliente_contenido")  cliente_contenido: AdminClienteComponent;

  
  public tipo_doc_lista = [
			{"tipo": "C", "nom_doc": "CEDULA"},
			{"tipo": "R", "nom_doc": "RUC"},
			{"tipo": "P", "nom_doc": "PASAPORTE"},
			{"tipo": "F", "nom_doc": "CONSUMIDOR FINAL"}
			// {"tipo": "R", "nom_doc": "CONSUMIDOR FINAL"} //PARA LIDERSCHOOL R
		];
  tipo_doc
  
  patron_cliente;
  razon_social_lista;
  exist_razon_social;
  accion_actualizar
  numtra
  ver_factura
  total_neto = 0

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute,
  private renderer: Renderer2
  ) 
  
  {

  if (this.srv.getConfBusquedaDefecto() == 'ART'){
  this.tipo_busqueda = true
  }
  if (this.srv.getConfBusquedaDefecto() == 'SERV'){
  this.tipo_busqueda = false
  }
  
	//ARTICULO = TRUE
	//SERVICIO = FALSE
	
	
	
  this.clientes = false;
  this.exist_articulo = false;
  this.edit_cant = false;
  this.masterSelected = false;
  this.cantidad_nueva = '1';
  this.cambiar_email = false;
  this.aplicar_retencion = false;


     this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
    console.log("Subtotal: ", this.subtotal)
	
		this.route.params.subscribe(val => {
				if (!this.srv.isLoggedIn()){
				this.router.navigateByUrl('/')};
				
				this.route.queryParams.subscribe(params => {
					console.log(params)
					// location.reload()
					// Defaults to 0 if no query param provided.
					// this.ruc = +params['ruc'] || 0;
					this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
					this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
					this.numtra = params['numfac'] || this.route.snapshot.paramMap.get('numfac') || 0;
					this.ver_factura = params['verfactura'] || this.route.snapshot.paramMap.get('verfactura') || 0;
					console.log("LUEGO DE ENTRADA")
					
					this.configuracion_inicial()
					
					if (this.numtra == 0){
						this.factura_nueva()
						this.accion_actualizar = false
						this.reset()
						
					}else {
						this.factura_actualizar()
						this.accion_actualizar = true
					}
				  });
				
				console.log(this.usuario)
				console.log(this.empresa)
				console.log(this.numtra)

		 }
		 ); //FIN ROUTING
	
	
	
	

	
    
  }
  

   ngOnInit() {
	   AdminLTE.init();
   }
	
	
	public configuracion_inicial(){
			const datos_caja = {};
			datos_caja['codemp'] = this.empresa;
			datos_caja['usuario'] = this.usuario;
	
			// console.log (this.content_cliente.nativeElement.classList)
	
			this.srv.status_caja(datos_caja).subscribe(
			data => {
				   console.log("OBTENIENDO STATUS_CAJA")
				   console.log(data)
				   console.log(data["tipo_caja"])
				   this.almacen_nombre = data["nomalm"]
				   this.almacen = data["almacen"]
				   this.caja = data["caja"]
				   this.turno = data["turno"]
				   this.serie = data["serie"]
		   
		

				   if ((data["tipo_caja"] == 'C')  || (data["tipo_caja"] == 'N')){
				   
					   let caja_param = {}
					   caja_param['status_caja'] = data["tipo_caja"] 
					   this.srv.seteo_caja(caja_param)
					   
					   let param = {}
						param['usuario'] = this.usuario;
						param['empresa'] = this.empresa;
						console.log("##### PARAMETROS PARA CAJA #####")
						console.log(param)
					   
						this.router.navigate(['/admin/conciliacion-caja', param]);

				   }
				   if (data["tipo_caja"] == 'A'){
					   let caja_param = {}
					   caja_param['status_caja'] = data["tipo_caja"] 
					   caja_param['caja'] = data["caja"]
					   caja_param['nomalm'] = data["nomalm"]
					   caja_param['almacen'] = data["almacen"]
					   caja_param['turno'] = data["turno"]
					   this.srv.seteo_caja(caja_param)
				   }
		  

				}); 
	
	
	
	

				this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
				this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
				console.log (this.jstoday)
				console.log (this.fectra)
	
			////PARA BUSCAR IVA Y SETEAR IVA DEFECTO
				this.srv.iva().subscribe(data => {
					console.log (data)
				  this.iva_siaci = data;
				  
				 let iva_defecto 
				  
				this.iva_siaci.map(function(dato){
				  if(dato.codiva == 'S'){
					  console.log("SETEANDO IVA DEFECTO")
					iva_defecto = dato.poriva;
					}
				  return dato;
				});
				
				console.log(iva_defecto)
				this.iva_porcentaje = iva_defecto

				});
			////PARA BUSCAR CIUDAD
				const datos = {};
				datos['codemp'] = this.empresa;
				datos['usuario'] = this.usuario;	
				console.log (datos)
				
				this.srv.ciudad(datos).subscribe(
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
		
				 // BLOQUE PARA OBTENER RETENCIONES
					let datos_retenciones_iva = {};
					datos_retenciones_iva['codemp'] = this.empresa;
					datos_retenciones_iva['tipo'] = 'RT_IVA'	
						
					this.srv.retenciones(datos_retenciones_iva).subscribe(
					   data => {
						   console.log("OBTENIENDO RETENCION IVA")
						   console.log(data)
						   this.retencion_iva_lista = data
						}); 
						
					let datos_retenciones_fuente = {};
					datos_retenciones_fuente['codemp'] = this.empresa;
					datos_retenciones_fuente['tipo'] = 'RT_COM'	
						
					this.srv.retenciones(datos_retenciones_fuente).subscribe(
					   data => {
						   console.log("OBTENIENDO RETENCION FUENTE")
						   console.log(data)
						   this.retencion_fuente_lista = data
						}); 
						
					this.srv.bancos(datos_retenciones_fuente).subscribe(
					   data => {
						   console.log("OBTENIENDO BANCOS")
						   console.log(data)
						   this.bancos_lista = data
						});
					this.srv.tarjetascredito(datos_retenciones_fuente).subscribe(
					   data => {
						   console.log("OBTENIENDO TARJETAS DE CREDITO")
						   console.log(data)
						   this.tarjetas_lista = data
						});  
						
					this.srv.cuentas_bancarias(datos_retenciones_fuente).subscribe(
					   data => {
						   console.log("OBTENIENDO CUENTAS BANCARIAS")
						   console.log(data)
						   this.cuentas_lista = data
						});  
		
		
		
	}
	
	
	//############### INICIO FACTURA NUEVA  ##############
    
	public factura_nueva(){
			////PARA BUSCAR VALIDAR APERTURA_CIERRE_CAJA
		console.log ("########### FACTURA NUEVA   ################### ")

	}
	//############### FIN FACTURA NUEVA  ##############
	
	//############### FACTURA ACTUALIZAR  ##############
	factura_actualizar(){
		console.log ("########### FACTURA ACTUALIZAR  ################### ")
		
	let datos = {};
	datos['codemp'] = this.empresa;
	datos['usuario'] = this.usuario;	
	datos['numfac'] = this.numtra;	
	console.log (datos)
		
		
	this.srv.get_encabezado_pdv(datos).subscribe(
	   data => {
		   console.log("##### OBTENIENDO ENCABEZADO FACTURA  ######")
		   console.log(data)
		   // this.select_razon_social(ident,ruc,rz,correo,codcli,dircli)
		   this.select_razon_social(data['tpIdCliente'],data['rucced'],data['razon_social'],data['email'],data['codcli'],data['dircli'])
		   //FORMAS DE PAGO
		   
		   	// public check_efectivo = false
			// public check_cheque = false
			// public check_tarjeta = false
			// public check_credito = false
			// public check_trasf_dep = false
			
		   if (data['tipefe'] == 'E'){
		       this.check_efectivo = true
			   this.monto_efectivo = data['valefe']
		   }
		   	if (data['tiptrans'] == 'B'){
		       this.check_trasf_dep = true
			   this.monto_transferencia = data['valtrans']
			   this.num_tranf = data['numtrans']
			   this.coddep = data['coddep']

		   }
		   	if (data['tiptar'] == 'T'){
		       this.check_tarjeta = true
			   this.monto_tarjeta = data['valtar']
			   this.num_tarjeta = data['numtar']
			   this.codtar = data['codtar']
		   }
		    if (data['tipche'] == 'C'){
		       this.check_cheque = true
			   this.monto_cheque = data['valche']
			   this.num_cheque = data['numche']
			   this.codban = data['codban']
		   }
		   	if (data['tipcre'] == 'R'){
		       this.check_credito = true
			   this.monto_credito = data['valcre']
			   this.num_pagos_credito = data['numpag']
			   this.plazo_dias_pagos = data['plapag']

		   }
		   
		   this.total= data['totfac']
		   this.iva_cant_new= data['totiva']
		   this.desc_cant = data['totdes']
		   this.desc_porcentaje = data['pordes']
		   this.subtotal = data['totnet'] - data['totdes']
		   this.total_neto = data['totnet']
		   this.fectra = data['fecfac']
		   this.totalBaseIva = data['totbas']
		   this.numplaca=data['numplaca']
		   this.observacion_factura = data['observ']
		   console.log ("##### TOTAL BASE ####")
		   console.log (data['totbas'])

		});  
		
		
		
		
	this.srv.get_renglones_pdv(datos).subscribe(
	   data => {
		   console.log ("##### OBTENIENDO RENGLONES ####")
		   console.log(data)
		   this.articulos_pedido = data
	   }
	   
	   )
		

	}
	//############### FIN FACTURA ACTUALIZAR  ##############
	
		//############### FACTURA ACTUALIZAR  ##############
	cargar_encabezado_pedido(numtra,tiptra){
		console.log ("########### CARGAR ENCABEZADO PEDIDO ################### ")
		// console.log ("########### "+numtra+" ################### ")
		// console.log ("########### "+tiptra+" ################### ")
		
	let datos = {};
	datos['codemp'] = this.empresa;
	datos['usuario'] = this.usuario;	
	datos['pedido'] = numtra
	datos['tiptra'] = tiptra
	datos['consulta_renglon'] = 1
	console.log (datos)
	this.numtra_pedido = numtra
	this.tiptra_pedido = tiptra
		
		
	this.srv.get_encabezado_pedido(datos).subscribe(
	   data => {
		   console.log("##### OBTENIENDO ENCABEZADO PEDIDO A FACTURA  ######")
		   console.log(data)
		   if (data['email'] == null ){
		       data['email'] = 'NN'
		   }

		   this.select_razon_social(data['tpIdCliente'],data['identificacion'],data['cliente'],data['email'],data['codcli'],data['direccion'])
		   //FORMAS DE PAGO
		   
		   	// public check_efectivo = false
			// public check_cheque = false
			// public check_tarjeta = false
			// public check_credito = false
			// public check_trasf_dep = false
			
			   
		   
		   this.iva_cant_new = data['iva_cantidad']
		   this.total = data['total_pedido']
		   this.desc_cant = data['descuento']
		   if (data['descuento_pctje'] === null ){
		       this.desc_porcentaje = 0
		   }else {
		       this.desc_porcentaje = data['descuento_pctje']
		   }
		   this.subtotal = data['totnet'] - data['descuento']
		   this.total_neto = data['totnet']
		   // this.fectra = data['fecfac']
		   // this.totalBaseIva = data['totbas']
		   // console.log ("##### TOTAL BASE ####")
		   // console.log (data['totbas'])

		});  
		
		
		
		
	this.srv.get_renglones_pedido(datos).subscribe(
	   data => {
		   console.log ("##### OBTENIENDO RENGLONES ####")
		   console.log(data)
			// this.elements_checkedList = data
			// this.inserta_pedido()
			
		   this.articulos_pedido = data
		   
		  
		   	this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
			this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			setTimeout(()=> {	
				this.desc_cant = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.v_desc_art),0));
				this.total_neto = this.subtotal + this.desc_cant
			}, 500)
			this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new

			let lista_base_iva = this.articulos_pedido.filter(function(e) {return e['codiva'] == 'S';});
			let subtotalBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			let descBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.v_desc_art),0);

			this.totalBaseIva = this.redondear(subtotalBaseIva+descBaseIva)
			console.log ("########### TOTAL BASE CON IVA ###########")
			console.log (lista_base_iva)
			console.log (this.totalBaseIva)
			console.log (this.desc_cant)
			this.desc_porcentaje = this.redondear(this.desc_cant*100/this.total_neto)

			
			


		   
		  //pedido
		  // campos = ['codart','nomart','coduni','codiva','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant','numren']
		  //get_renglones_pdv
		  // campos = ['index','codart','nomart','coduni','cant','prec01','totren','punreo','codiva','poriva','precio_iva','v_desc_art','subtotal_art']
	   
	   }
	   
	   )
		

	}
	//############### FIN FACTURA ACTUALIZAR  ##############
	
	
	

	public switchtab(){
		console.log("***** cambiar pestaña*****")
		
		 // console.log(<HTMLInputElement>document.getElementById('tab1head').class);
		 // console.log (this.tab1head.nativeElement.classList)
		 
		 // this.tab1head.nativeElement.classList.remove("active")
		 // this.tab2head.nativeElement.classList.add("active")
		 // this.tab_1.nativeElement.classList.remove("active")
		 // this.tab_2.nativeElement.classList.add("active")
		 
		 this.facturacion.nativeElement.classList.remove("active")
		 this.crear_cliente.nativeElement.classList.add("active")
		 this.tab_facturacion.nativeElement.classList.remove("active")
		 this.tab_crear_cliente.nativeElement.classList.add("active")
		 
		 
		 	 
	 // @ViewChild('facturacion') facturacion: ElementRef;
	 // @ViewChild('crear_cliente') crear_cliente: ElementRef;
	 // @ViewChild('tab_facturacion') tab_facturacion: ElementRef;
	 // @ViewChild('tab_crear_cliente') tab_crear_cliente: ElementRef;
		 
		 // console.log (this.cliente_contenido)
		 
		 


		
	}
	
	
	forma_pago(forma){
		console.log("### FORMA_PAGO  ##")
		console.log(forma)
		console.log("### CHECK_CREDITO  ##")
		console.log(this.check_credito)
		console.log("### CHECK_CHEQUE ##")
		console.log(this.check_cheque)
		console.log("### CHECK_TARJETA ##")
		console.log(this.check_tarjeta)
		console.log("### CHECK_EFECTIVO ##")
		console.log(this.check_efectivo)
		console.log("### CHECK_TRANSF ##")
		console.log(this.check_trasf_dep)
		// console.log("### ESTATUS_CHECK_EFECTIVO  ##")
		// console.log(this.check_efectivo)

		if (this.check_credito==true){
			this.monto_credito = this.redondear(this.total)
			this.check_efectivo = false
			this.check_cheque = false
			this.check_tarjeta = false
			this.check_trasf_dep = false
			this.check_credito = true
			this.monto_efectivo = 0
			this.monto_cheque = 0
			this.monto_tarjeta = 0
			this.monto_transferencia = 0
		}
		if (this.check_credito==false)
		 {
			 this.monto_credito = 0


			// this.check_efectivo = true
			// this.monto_credito = 0
			// this.check_cheque = false
			// this.check_tarjeta = false
			// this.check_credito = false
		}
		if (this.check_efectivo==true)
		 {
			 this.monto_efectivo = this.redondear(this.total-this.monto_tarjeta-this.monto_cheque-this.monto_transferencia)
			 console.log ("#### MONTO_EFECTIVO ####")
			 console.log (this.monto_efectivo)


			// this.check_efectivo = true
			// this.monto_credito = 0
			// this.check_cheque = false
			// this.check_tarjeta = false
			// this.check_credito = false
		}
		if (this.check_efectivo==false){
			this.monto_efectivo=0
			console.log ("#### MONTO_EFECTIVO ####")
			 console.log (this.monto_efectivo)
		}
		if (this.check_cheque==false){
			this.monto_cheque=0
			console.log ("#### MONTO_CHEQUE ####")
			 console.log (this.monto_cheque)
		}
		if (this.check_tarjeta==false){
			this.monto_tarjeta=0
			console.log ("#### MONTO_TARJETA ####")
			 console.log (this.monto_tarjeta)
		}
		if (this.check_trasf_dep==false){
			this.monto_transferencia=0
			console.log ("#### MONTO_TRANFERENCIA ####")
			 console.log (this.monto_transferencia)
		}
	
	
	
	
	
	
	}

	
	cierre_caja(){
		console.log("### CIERRE_CAJA ##")
		////PARA BUSCAR CIUDAD
		const datos = {};
		datos['empresa'] = this.empresa;
		datos['usuario'] = this.usuario;	
		datos['accion'] = 'C'
		console.log (datos)
		this.router.navigate(['/admin/conciliacion-caja', datos]);
	}
	
   busqueda_razon_social() { 
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
	 
	 
	busqueda_razonsocial_placa() { 
	if (this.numplaca){
		const datos = {};
		datos['codemp'] = this.empresa;
		datos['patron_placa'] = this.numplaca;
			this.srv.busqueda_razon_social_placa(datos).subscribe(data => {
				// console.log(data)
				
				
				let longitud_data = data.length

			if (longitud_data > 0 ) {
				console.log(data)

				this.razon_social_lista = data;
				this.exist_razon_social = true;
				// this.searching_articulo = false
				
		
				
			}else {
				alert("Razon Social no encontrado con la palabra PLACA ingresada <<"+this.numplaca+">>");
				// this.searching_articulo = false
				this.exist_razon_social = false;
			}
				

			}); 
		}else  { 
			alert("Por favor llenar el campo PLACA");
		}
	 }
	 
	 select_razon_social(ident,ruc,rz,correo,codcli,dircli) {
		 console.log ("Seleccion de cliente")
		
		this.dato_cliente= {"nomcli":rz,"rucced":ruc,"email":correo,"codcli":codcli,"dircli":dircli}
		 // ['codemp', 'nomcli','rucced','codcli','email','dircli','ciucli','telcli','telcli2']
		 console.log (this.dato_cliente)
		this.tipo_doc = ident 
		this.ruc = ruc
		this.razon_social = rz
		
		if (correo=== null){
			alert("Favor llenar el correo electronico en la ficha del cliente..!!!")
			this.email_cliente = undefined
		}else {
			this.email_cliente = correo
		}
		// this.email_cliente = correo
		this.clientes = true;
		this.exist_razon_social = false;
		this.patron_cliente = undefined;
	 }
	
	tipo_busqueda_cliente() {
		console.log("tipo de entrada...!!!")
		console.log(this.busqueda_cliente)
		if (this.busqueda_cliente == 'IDENT'){
			this.busqueda_cliente = 'RZ';
		}else {
			this.busqueda_cliente = 'IDENT';
		}
		console.log("tipo de entrada luego del cambio...!!!")
		console.log(this.busqueda_cliente)
	}
	
	tipo_entrada() {
		console.log("tipo de entrada...!!!")
		console.log(this.tipo_busqueda)
		if (this.tipo_busqueda == false){
			this.tipo_busqueda = true;
		}else {
			this.tipo_busqueda = false;
		}
		console.log("tipo de entrada luego del cambio...!!!")
		console.log(this.tipo_busqueda)
	}
	
	set_aplicar_retencion() {
		console.log("SET RETENCION...!!!")
		console.log(this.aplicar_retencion)
		if (this.aplicar_retencion == false){
			this.aplicar_retencion = true;
		}else {
			this.aplicar_retencion = false;
			this.retencion_iva = 0
			this.retencion_fuente= 0
			this.retencion_iva_select = undefined
			this.retencion_fuente_select = undefined
			this.ret_iva_aplicar = 0
			this.ret_fuente_aplicar = 0
			this.total = ((this.subtotal) + this.iva_cant_new) 
		}
		console.log("SET RETENCION luego del cambio...!!!")
		console.log(this.aplicar_retencion)
	}
	
		
	set_retencion_iva() {
		console.log("SET RETENCION IVA...!!!")
		console.log (this.retencion_iva_select)
		if (this.retencion_iva_select){
			let retencion_iva_select_array = this.retencion_iva_select.split("|",2)
			console.log(retencion_iva_select_array[0])
			this.retencion_iva = retencion_iva_select_array[0]
			this.retencion_iva_codigo=retencion_iva_select_array[1]
			// CALCULO EL 30 del iva
			this.ret_iva_aplicar = (this.retencion_iva*this.iva_cant_new)/100
			this.total = (((this.subtotal) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
		}else{
			this.retencion_iva = 0
			this.retencion_iva_codigo=0
			this.ret_iva_aplicar = (this.retencion_iva*this.iva_cant_new)/100
			this.total = (((this.subtotal) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
		}


	}
	
	set_retencion_fuente() {
		console.log("SET RETENCION FUENTE...!!!")
		console.log (this.retencion_fuente_select)
		if (this.retencion_fuente_select != 0){		
			let retencion_fuente_select_array = this.retencion_fuente_select.split("|",2)
			console.log(retencion_fuente_select_array[0])
			this.retencion_fuente = retencion_fuente_select_array[0]
			this.retencion_fuente_codigo=retencion_fuente_select_array[1]
			this.ret_fuente_aplicar = (this.retencion_fuente*this.subtotal)/100
			this.total = (((this.subtotal) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
		}
			
		else{
			this.retencion_fuente = 0
			this.retencion_fuente_codigo=0
			this.ret_fuente_aplicar = (this.retencion_fuente*this.subtotal)/100
			this.total = (((this.subtotal) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
			
			
			
		}
	}
	
	
	
	consumidor_final(){
		console.log("VALIDAR SI ES CONSUMIDOR FINAL ES ESCOGIDO")
		console.log(this.tipo_doc)
		if (this.tipo_doc == 'F'){
			this.ruc = '9999999999999'
			this.busca_cliente()
		}
	}
	
	calc_cambio(){
		console.log("CALCULAR CAMBIO")
		this.cambio= this.total_recibido-this.total
		// console.log(this.tipo_doc)
		// if (this.tipo_doc == 'F'){
			// this.ruc = '9999999999999'
			// this.busca_cliente()
		// }
	}
	

	
	edit_art (el) {
		console.log("ENTRADA ARTICULO A EDITAR")
		// console.log(el)
        this.editART = el
		this.edit_cant = true;
		console.log(this.editART)
    }
	
	
		// delete_art (el,index) {
		// console.log("ENTRADA ARTICULO A ELIMINAR")
		// console.log(el)

	 // let json_eliminar = this.articulos_pedido
	 // // var nomart = el
	 
	// json_eliminar = json_eliminar.filter(function(dato){
	  // if(dato.index == index){
		  // return false
	  // }else {
		 // return true 
		  
	  // }
	  // // return dato;
	// });	 
	
	// console.log(json_eliminar);//json original
	// this.articulos_pedido = json_eliminar	
	// this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));	
	// this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	// this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));	
	// this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new	
	
    // }
	
	
	delete_art (el,index) {
		console.log("ENTRADA ARTICULO A ELIMINAR")
		console.log(el)

	 let json_eliminar = this.articulos_pedido
	 var nomart = el
	 
	json_eliminar = json_eliminar.filter(function(dato){
	  if(dato.index == index){
		  return false
	  }else {
		 return true 
		  
	  }
	  // return dato;
	});	 
	
	console.log(json_eliminar);//json original
	this.articulos_pedido = json_eliminar	
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));	
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));	
	this.total = (this.subtotal) + this.iva_cant_new	
	let lista_base_iva = this.articulos_pedido.filter(function(e) {return e['codiva'] == 'S';});
	let subtotalBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
	let descBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.v_desc_art),0);

	this.totalBaseIva = this.redondear(subtotalBaseIva+descBaseIva)
	console.log ("########### TOTAL BASE CON IVA ###########")
	console.log (lista_base_iva)
	console.log (this.totalBaseIva)
	this.calc_cambio()
	
    }
	
	delete_art_todo () {
		console.log("ENTRADA ARTICULO A ELIMINAR TODOOOOO")
			this.articulos_pedido = []
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
			this.iva_porcentaje = 0
			this.iva_cant = 0
			this.total = 0
			this.total_recibido = 0
			this.cambio = 0
			this.totalBaseIva = 0
	
    }
	
	
	redondear (el) {
		// console.log("ENTRADA ARTICULO REDONDEAR")
		// console.log(el)
	return Math.round(el * 100) / 100;
    }
	
	
	busca_cliente() { 
	if (this.ruc && this.tipo_doc ){
		const datos = {};
		datos['ruc'] = this.ruc;
		datos['codemp'] = this.empresa;
		datos['tpIdCliente'] = this.tipo_doc;
			this.srv.clientes(datos).subscribe(data => {
				// console.log(data)
			this.dato_cliente = data
			if (data['rucced']) {
				console.log ("#### DATO CLIENTE ####")
				console.log(data)
				console.log(data['nomcli'])
				this.razon_social = data['nomcli']
				if (data['email'] === null){
					alert("Favor llenar el correo electronico en la ficha del cliente..!!!")
					this.email_cliente = undefined
				}else {
					this.email_cliente = data['email']
				}
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
					
				
				alert("Cliente con "+documento+" "+this.ruc+" no encontrado");
			}
			}); 
		}else  { 
			alert("Por favor ingrese el Tipo de Documento/ Num de documento del cliente");
		}
	 }
	 
	 
	 
	 
	busca_articulo() {
	if (this.dato_cliente){
		if (this.patron_articulo){
			let datos = {};
			datos['nomart']  = this.patron_articulo;
			datos['codemp']  = this.empresa;
			datos['codcli']  = this.dato_cliente['codcli'];
				this.srv.articulos(datos).subscribe(data => {
					// console.log(data)
					// console.log (data[1]['nomart'])
					
				let longitud_data = data.length

				if (longitud_data > 0 ) {
					console.log(data)
					// console.log(data['nomart'])
					
					// console.log (data[1]['nomart'])
					this.articulo = data;
					this.exist_articulo = true;
					
					// this.filteredarticulo = this.myControl2.valueChanges.pipe(
					// startWith(''),
					// map(value => this._filter2(value))
					// ); 
		  
					
					
					
				}else {
					alert("Artículo no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
				}
				}); 
			}else  { 
				alert("Por favor llene el campo artículo");
			}
	}else{
			alert("Por favor seleccionar el cliente")
	}
  }
	 
	
	public update_precio (codart, index,prec) {
		console.log("ACTUALIZAR LISTA PARA PRECIO")
		console.log("####  CODIGO ########")
		console.log(codart)
		console.log("####  CANTIDAD NUEVA ########")
		console.log(prec)
		// var cant_new =cant
		
	if 	(codart && prec){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR PRECIO")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO PRECIO")
		dato.prec01 = prec;
		
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal_art
		dato.subtotal_art =  Math.round(dato.subtotal_art* 1000) / 1000;  //PARA REDONDEAR 3 DECIMALES Y SETEAR CO MAS EXACTITUD LOS TOTALES
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  }
	  
	  return dato;
	});

	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	
				
	this.desc_cant = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.v_desc_art),0));

	
	
	let lista_base_iva = this.articulos_pedido.filter(function(e) {return e['codiva'] == 'S';});
	let subtotalBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
	let descBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.v_desc_art),0);

	this.totalBaseIva = this.redondear(subtotalBaseIva+descBaseIva)
	console.log ("########### TOTAL BASE CON IVA ###########")
	console.log (lista_base_iva)
	console.log (this.totalBaseIva)
	this.total_neto = this.subtotal + this.desc_cant
	this.desc_porcentaje = this.redondear(this.desc_cant*100/this.total_neto)
	
	this.total = (this.subtotal) + this.iva_cant_new
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)
	console.log("PORCENTAJE DESCUENTO: ", this.desc_porcentaje)
	
	if (this.check_credito){
		this.monto_credito=this.total
	}


	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
   }
	
	 
	 
	 
	 
	busca_servicio() { 
	
	if (this.dato_cliente){
	if (this.patron_articulo){
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		datos['codcli']  = this.dato_cliente['codcli'];
		console.log ("BUSCO SERVICIO")
			this.srv.servicios(datos).subscribe(data => {
				// console.log(data)
				// console.log (data[1]['nomart'])
				
			let longitud_data = data.length

			if (longitud_data > 0 ) {
				console.log(data)
				// console.log(data['nomart'])
				
				// console.log (data[1]['nomart'])
				this.articulo = data;
				this.exist_articulo = true;
				
				// this.filteredarticulo = this.myControl2.valueChanges.pipe(
				// startWith(''),
				// map(value => this._filter2(value))
				// ); 
	  
				
				
				
			}else {
				alert("Servicio no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
			}
			}); 
		}else  { 
			alert("Por favor llene el campo artículo");
		}
	}else{
		alert("Por favor seleccionar cliente");
	}
	
	
	
	}
	 
	 
	public get_prec_produc(codart){
		console.log("###creado lista de precios##")
		console.log (codart)
		// 6Q0199517A
		let datos = {};
		datos['codart']  = codart
		datos['codemp']  = this.empresa;
		datos['codcli']  = this.dato_cliente['codcli']
		this.srv.get_prec_product(datos).subscribe(
			data => {
				console.log(data)
				// console.log(data['prec02'])
				// console.log(data[0].prec01)
		// [
			// {"tipo": "C", "nom_doc": "CEDULA"},
			// {"tipo": "R", "nom_doc": "RUC"},
			// {"tipo": "P", "nom_doc": "PASAPORTE"}
		// ];
			this.lista_prec=data
			// this.lista_prec =[{"prec": data[0].prec01},{"prec": data[0].prec02},{"prec": data[0].prec03},{"prec": data[0].prec04},{"prec": data[0].prec05}];
			console.log(this.lista_prec )
			}
			); 
		return "01"
	}
	
	public get_prec_servicio(codart){
		console.log("###creado lista de precios servicio##")
		console.log (codart)
		// 6Q0199517A
		let datos = {};
		datos['codart']  = codart
		datos['codemp']  = this.empresa;
		this.srv.get_prec_servicio(datos).subscribe(
			data => {
				console.log(data)
				// console.log(data['prec02'])
				// console.log(data[0].prec01)
		// [
			// {"tipo": "C", "nom_doc": "CEDULA"},
			// {"tipo": "R", "nom_doc": "RUC"},
			// {"tipo": "P", "nom_doc": "PASAPORTE"}
		// ];
				
			this.lista_prec =[{"prec": data[0].prec01},{"prec": data[0].prec02},{"prec": data[0].prec03},{"prec": data[0].prec04}];
			console.log(this.lista_prec)
			}
			); 
		return "01"
	}
	
	
	public edit_prec(articulos){
		
		console.log ("##### EDIT PREC  ####")
		console.log (articulos)
		console.log (articulos["codart"])
		this.edit_articulos=articulos
		console.log ("##### TIPO BUSQUEDA  ####")
		console.log (this.tipo_busqueda)
		if (this.tipo_busqueda){
			this.get_prec_produc(articulos["codart"])	
		}else{
			this.get_prec_servicio(articulos["codart"])
		}

		

		
		
	}
	public edit_prec_renglon(cod){
		console.log ("##### CAMBIAR PRECIO RENGLON ####")
		console.log (this.nuevo_precio_renglon)
		if (!this.nuevo_precio_renglon){
			
			this.nuevo_precio_renglon = 0
			
		}
		console.log (cod)
		let nuevo_precio_renglon_1 = parseFloat(this.nuevo_precio_renglon)
		
		console.log ("#### ARREGLO DE ARTICULOS  ###")
		console.log (this.articulo)

		
		
		this.articulo.map(function(dato){
			console.log("VOY ARREGLO DE ARTICULOS ")
			if(dato.codart == cod){
				dato.prec01 = nuevo_precio_renglon_1;
				//ACTUALIZO EL MONTO DEL IVA
				dato.precio_iva= (dato.prec01*dato['poriva'])/100
				//REDONDEADO PRECIO IVA
				dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
				
				
		}
			return dato;
		});
		
				console.log ("#### ARREGLO DE ARTICULOS LUEGO DEL CAMBIO  ###")
		console.log (this.articulo)
		
		
		
		
		this.edit_articulos = undefined  //para desmarcar renglon
		this.lista_prec = []  // para eliminar array de consulta de precios
		this.nuevo_precio_renglon = undefined  //para reiniciar el nuevo precio
		
		
	}
	
	
	
	 
	public update (codart,index,cant) {
		console.log("ACTUALIZAR LISTA CANTIDAD")
		console.log("####  NOMBRE ########")
		console.log(codart)
		console.log("####  CANTIDAD NUEVA ########")
		console.log(cant)
		var cant_new =cant
		
	if 	(codart && cant_new){
		if (cant_new === '0'){
			alert ("Cantidad del código << "+codart+" >> debe ser mayor a 0..por favor validar")
	
		}else{
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR NUMERO")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO CANTIDAD")
		dato.cant = cant_new;
		
		// dato.precio_iva =  ((dato['poriva']*dato['prec01'])/100)*dato.cant;
		//REDONDEADO PRECIO IVA
		// dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;

		
		
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal_art
		dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  }
	  
	  return dato;
	});
	// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	
	this.desc_cant = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.v_desc_art),0));

	this.total_neto = this.subtotal + this.desc_cant
	
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = (this.subtotal) + this.iva_cant_new
	
	let lista_base_iva = this.articulos_pedido.filter(function(e) {return e['codiva'] == 'S';});
	let subtotalBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
	let descBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.v_desc_art),0);

	this.totalBaseIva = this.redondear(subtotalBaseIva+descBaseIva)

	console.log ("########### TOTAL BASE CON IVA ###########")
	console.log (lista_base_iva)
	console.log (this.totalBaseIva)
	this.desc_porcentaje = this.redondear(this.desc_cant*100/this.total_neto)
	
	if (this.total_recibido > 0){
		this.calc_cambio()
	}
	
	if (this.check_credito){
		this.monto_credito=this.total
	}
	
	console.log ("Total DESCUENTO: "+this.desc_cant)
	console.log ("DESCUENTO PORCENTAJE: "+this.desc_porcentaje)	
	

    console.log("Total: ", this.subtotal)
	}

	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
	this.cantidad_nueva = '1';
   }
   
	public validaNumericos(event: any) {
    if((event.charCode >= 48 && event.charCode <= 57) ||(event.charCode == 46)){
      return true;
     }
     return false;        
	}
	
	public validaEnter(event: any) {
		
    if(event.key !== "Enter"){
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
   
   
   
   
   
   	public update_art_desc (codart,index,desc_art) {
		console.log("ACTUALIZAR LISTA DESCUENTO ARTICULO")
		console.log("####  NOMBRE ########")
		console.log(codart)
		console.log("####  DESCUENTO A APLICAR A ARTICULO ########")
		console.log(desc_art)
		var desc_art_new =Number(desc_art)

	if 	(codart && Number(desc_art_new+1)){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR DESC % y Valor de descuento")
	 if(dato.index == index){
		  console.log("ACTUALIZANDO DESC")
		dato.punreo = desc_art_new;
		// dato.precio_iva =  ((dato['poriva']*dato['prec01'])/100)*dato.cant;
		// //REDONDEADO PRECIO IVA
		// dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal articulo
		dato.subtotal_art = Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
	  }
	  
	  return dato;
	});
	
	
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	
	this.desc_cant = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.v_desc_art),0));

	this.total_neto = this.subtotal + this.desc_cant
	this.desc_porcentaje = this.redondear(this.desc_cant*100/this.total_neto)
	
	
	// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	 console.log("IVA_NEW ", this.iva_cant_new)
	this.total = (this.subtotal) + this.iva_cant_new
	 console.log("TOTAL_LUEGO_DESC_ART: ", this.total)
	 
	let lista_base_iva = this.articulos_pedido.filter(function(e) {return e['codiva'] == 'S';});
	let subtotalBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
	let descBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.v_desc_art),0);

	this.totalBaseIva = this.redondear(subtotalBaseIva+descBaseIva)
	

	console.log ("########### TOTAL BASE CON IVA ###########")
	console.log (lista_base_iva)
	console.log (this.totalBaseIva)
	
	if (this.check_credito){
		this.monto_credito=this.total
	}
	 	
	if (this.total_recibido > 0){
		this.calc_cambio()
	}
	// this.update_total_desc (this.desc_porcentaje) 
    // console.log("subtotal: ", this.subtotal)
	console.log ("######## DESCUENTO SUMADO TOTAL  ##########")
	console.log (this.desc_cant)
	
	console.log ("######## PORCENTAJE DESCUENTO ##########")
	console.log (this.desc_porcentaje)
	
	}
	else {
		alert ("Descuento del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
	// this.cantidad_nueva = '1';
   }
   
   
   
   
   
   
   	
	public update_total_desc (desc) {
		console.log("####  DESCUENTO ########")
		console.log(desc)
		this.desc_porcentaje = desc
		this.desc_cant = (this.subtotal*desc)/100
		// return Math.round(el * 100) / 100;
		
		this.desc_cant = Math.round(this.desc_cant * 100)/100
		this.subtotal_desc = this.subtotal - this.desc_cant
		this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
		console.log("####  TOTAL CON DESC  ########")
		console.log(this.total)
		console.log("####  DESC CANTIDAD  ########")
		console.log(this.desc_cant)
		console.log("####  DESC PORCENTAJE  ########")
		console.log(this.desc_porcentaje)
		console.log("####  SUBTOTAL_CON_DESCUENTO ########")
		console.log(this.subtotal_desc)
		// return (this.desc_cant)
   }
   
   public update_total_iva(iva){
	  console.log("####  IVA INGRESADO ########")
	  this.iva_porcentaje = iva
	  console.log("IVA INGRESADO= "+this.iva_porcentaje)
	  
	  this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
	  
	  this.total = this.subtotal + this.iva_cant

   }
   
    public update_ciudad(ciudad){
	  console.log("#### CIUDAD SELECCIONADA ########")
	  console.log (ciudad)
	  this.ciudad = ciudad
   }//FIN UPDATE_CIUDAD
   
    public update_email(email){
	  console.log("#### EMAIL NUEVO ########")
	  console.log(email)
	  
	  if (this.validateEmail(email)) {
	  this.email_cliente=email
	  console.log(this.email_cliente)
	} else {
	alert("Formato de Email no válido")
	this.cambiar_email = false
	}
   } //FIN UPDATE_EMAIL
  
  validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
	}
   
   	public update_observ (codart,index,obsev) {
		console.log("####  observacion ########")
		console.log(obsev)
		if 	(codart && obsev ){
		this.articulos_pedido.map(function(dato){
			console.log("VOY ACTUALIZAR OBSERVACION ARTICULO")
		  if(dato.index == index){
			dato.num_docs = obsev;
			}
	  return dato;
		});
	}
		console.log (this.articulos_pedido)

   }
   public update_nomart (codart,index,nomart) {
		console.log("####  nomart nuevo ########")
		console.log(nomart)
		if 	(codart && nomart ){
		this.articulos_pedido.map(function(dato){
			console.log("VOY ACTUALIZAR OBSERVACION ARTICULO")
		  if(dato.index == index){
			dato.nomart = nomart;
			}
	  return dato;
		});
	}
		console.log (this.articulos_pedido)

   }
   
   
    public update_observ_general (obsev_g) {
		console.log("####  observacion general ########")
		console.log(obsev_g)
		this.observacion_pedido = obsev_g
   }
   

 
	 
	 
	inserta_pedido() {
		let checked_json
		let duplicado = false
		// console.log (this.elements_checkedList)
		// this.elements_checkedList = this.artSelectionList.selectedOptions.selected.map(s => s.value);
		
		
		
		
		if (this.elements_checkedList.length > 0) {
		
	for (checked_json of this.elements_checkedList) {
		console.log("NOMBRE DE ARTICULO A INSERTAR")	
		console.log(checked_json['codart'])
		
		// this.get_prec_produc(checked_json['codart'])
		
		//PARA PERMITIR DUPLICADOS
		// this.articulos_pedido.map(function(dato){
			// if(dato.codart == checked_json['codart']){
				// console.log ("SUMO 1 a ITEM y no DEBERIA AGREGAR")
				// // parseFloat("10.00")
			// dato.cant = parseFloat(dato.cant) + 1;
			
		// dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		// dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		// //REDONDEADO subtotal_art
		// dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		// dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		// //REDONDEADO PRECIO IVA
		// dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;

			// duplicado = true
			// }
	  
		// return dato;
		// });
		
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			// this.total = (this.subtotal - this.desc_cant) + this.iva_cant
			// this.update_total_desc (this.desc_porcentaje) 
		
		
		
				// 117.7 ---100%
				   // X      10%
		
		if (!duplicado) {
		// console.log ("VOY A AGREGAR")
		
		
		if (this.articulos_pedido.length == 0){
			checked_json['index'] = this.articulos_pedido.length
		}else {
			console.log (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))
			checked_json['index'] = (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))+1
		}
		
		checked_json['cant'] = '1';
		checked_json['observ'] = 'Puede agregar detalles del artículo';
		checked_json['subtotal_art'] = checked_json['prec01']
		checked_json['v_desc_art'] = (checked_json['punreo']*checked_json['prec01'])/100;
		this.articulos_pedido.push(checked_json)
		console.log("###### REGISTRO INSERTADO #####")
		console.log(this.articulos_pedido)
		
		}
	
		}	
			console.log ("####  INSERTA PEDIDO CON IVA  ######")
			console.log (this.iva_porcentaje)
		
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
			this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			this.desc_cant = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.v_desc_art),0));
			this.total_neto = this.subtotal + this.desc_cant
			this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			// this.totalBaseIva = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			// this.series_ingreso_bodega.filter(function(e) {return e['codart'] == codart;});
			let lista_base_iva = this.articulos_pedido.filter(function(e) {return e['codiva'] == 'S';});
			let subtotalBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			let descBaseIva = lista_base_iva.reduce((acc,obj,) => acc + (obj.v_desc_art),0);

			this.totalBaseIva = this.redondear(subtotalBaseIva+descBaseIva)
			console.log ("########### TOTAL BASE CON IVA ###########")
			console.log (lista_base_iva)
			console.log (this.totalBaseIva)
			this.desc_porcentaje = this.redondear(this.desc_cant*100/this.total_neto)
			
			if (this.check_credito){
				this.monto_credito=this.total
			}

			
			
			this.elements_checkedList = [];
			this.articulo = [];
			this.exist_articulo = false;
			if (this.total_recibido > 0){
				this.calc_cambio()
			}
			
			console.log(this.elements_checkedList)
		
		}else {
			alert("Por favor seleccione algún artículo")
		}

	 }
	 
 
	// public onChange(articulos.nomart) {
		
		// console.log(articulos.nomart)
	// }
	 
	
    private _filter(value: string): string[] {
			console.log (this.options)
			console.log ("filtro 1")
	      return this.options.map(x => x.nomcli).filter(
					option => option.toLowerCase().includes(value.toLowerCase()));
		
	}
	
	private _filter2(value: string): string[] {
			console.log ("filtro 2")
	      return this.articulo.map(y => y.nomart).filter(
					option => option.toLowerCase().includes(value.toLowerCase()));
		
	}
	
	
	 // #################PROCESO CHECKBOX
  checkUncheckAll() {
    for (var i = 0; i < this.articulo.length; i++) {
      this.articulo[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.articulo.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }
 
  getCheckedItemList(){
    this.elements_checkedList = [];
    for (var i = 0; i < this.articulo.length; i++) {
      if(this.articulo[i].isSelected)
      this.elements_checkedList.push(this.articulo[i]);
    }
    // this.elements_checkedList = JSON.stringify(this.elements_checkedList);
	console.log ('getCheckedItemList');
	console.log (this.elements_checkedList);
  
  }
    // #################FIN PROCESO CHECKBOX
	
  // ####### INICIO PARA VALIDAR FORMAS DE PAGOS  #############
   generar_pdv() { 
	 console.log ("######  GENERAR PDV  ########")
	 
	 
	 
	console.log ("MONTO EFECTIVO")
	// if (this.monto_efectivo == 0){
		// this.monto_efectivo = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
	// } 
	console.log(this.monto_efectivo)
	
	
	console.log ("DATOS CLIENTE")
	console.log (this.dato_cliente)
	
	console.log ("ARTICULOS PEDIDO")
	console.log (this.articulos_pedido.length)
	

	if ( confirm ("Esta seguro de generar esta factura ????") && (this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.email_cliente) && 
	(this.validar_totales_formapago() == true)  && (this.validar_campos_cheque_tarjeta_trasf() == true) && (this.validar_campos_credito()== true) &&
	this.validar_subtotal_con_total() && this.validacion_alerta_existencia_correo()){
	this.loading_modulo = true
	 let encabezado_pdv= this.dato_cliente
	 
	 if (!encabezado_pdv['telcli']){
		 encabezado_pdv['telcli'] = ''
	 }
	 encabezado_pdv['codus1'] = this.usuario;
	 encabezado_pdv['codemp'] = this.empresa;
	 encabezado_pdv['fecfac'] = this.fectra
	 encabezado_pdv['totnet'] = this.redondear(this.total_neto)
	 encabezado_pdv['totbase'] = this.redondear(this.totalBaseIva)
	 encabezado_pdv['totiva'] = this.redondear(this.iva_cant_new)
	 if (this.iva_cant_new == 0 ){
		encabezado_pdv['poriva'] = 0 
	 }else {
		encabezado_pdv['poriva'] = this.iva_porcentaje
	 }
	 encabezado_pdv['codalm']  = this.almacen
	 encabezado_pdv['numcaj']  = this.caja
	 encabezado_pdv['turno']  = this.turno
	 encabezado_pdv['serie']  = this.serie
	 encabezado_pdv['totfac']  = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
	 encabezado_pdv['totrec']  = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
	 encabezado_pdv['totdes']  = this.desc_cant
	 encabezado_pdv['pordes']  = this.desc_porcentaje
	 encabezado_pdv['numplaca'] = this.numplaca
	 encabezado_pdv['observ'] = this.observacion_factura
	 
	 // encabezado_pdv['codret'] = '0'
	 // encabezado_pdv['porret'] = '0'
	 // encabezado_pdv['valret'] = '0'
	 
	 // //FORMAS DE PAGO : EFECTIVO
	 if (this.check_efectivo) {

    // PARA PROBAR CREDITO COMENTO ESTA LINEA
	
		 encabezado_pdv['tipefe']  = 'E'
		 encabezado_pdv['valefe']  = this.monto_efectivo
		 
		 encabezado_pdv['conpag']  = 'E'	
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['plapag']  = '0'
		 encabezado_pdv['codtar']  = null
		 encabezado_pdv['codban']  = null
	
	// PARA PROBAR CREDITO COMENTO ESTA LINEA
		 // encabezado_pdv['tipefe']  = 'X'
		 // encabezado_pdv['valefe']  =  '0'
	     // encabezado_pdv['conpag']  = 'C'
	     // encabezado_pdv['tipcre']  = 'R'
		 // encabezado_pdv['numpag']  = '10'
		 // encabezado_pdv['plapag']  = '15'
		 // encabezado_pdv['valcre']  = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
		 // encabezado_pdv['forpag']  = '1'
		 // encabezado_pdv['cuecob']  = '1'

		 
		 
	 }else {
		encabezado_pdv['tipefe']  = 'X'
		encabezado_pdv['valefe']  =  '0'
	 }

	 
	 // // //FORMAS DE PAGO : CHEQUE
	 if (this.check_cheque) {
		 encabezado_pdv['tipche']  = 'C'
		 encabezado_pdv['numche']  =  this.num_cheque
		 encabezado_pdv['valche']  =  this.monto_cheque
		 encabezado_pdv['conpag']  = 'E'
		 
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['codban']  = this.codban
	 } else {
		 encabezado_pdv['tipche']  = 'X'
		 encabezado_pdv['numche']  = '' 
		 encabezado_pdv['valche']  = '0'
		 encabezado_pdv['codban']  = null
	 }

	 
	// //FORMAS DE PAGO : TARJETAS
	 if (this.check_tarjeta) {
		encabezado_pdv['tiptar']  = 'T'
		encabezado_pdv['numtar']  = this.num_tarjeta
		encabezado_pdv['valtar']  = this.monto_tarjeta
		encabezado_pdv['conpag']  = 'E'
		
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['codtar']  = this.codtar
		 
	 } else {
		encabezado_pdv['tiptar']  = 'X'
		encabezado_pdv['numtar']  =  ''
		encabezado_pdv['valtar']  =  '0'
		encabezado_pdv['codtar']  = null
		 
	 }
	 
	// //FORMAS DE PAGO : TRANSFERENCIA / DEPOSITO
	 if (this.check_trasf_dep) {
		encabezado_pdv['tiptrans']  = 'B'
		encabezado_pdv['numtrans']  = this.num_tranf
		encabezado_pdv['valtrans']  = this.monto_transferencia
		encabezado_pdv['conpag']  = 'E'
		
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['coddep']  = this.coddep
		 
	 } else {
		encabezado_pdv['tiptrans']  = 'X'
		encabezado_pdv['numtrans']  =  ''
		encabezado_pdv['valtrans']  =  '0'
		encabezado_pdv['coddep']  = null
		 
	 }
	 
	 	// //FORMAS DE PAGO : CREDITO
	 if (this.check_credito) {
			encabezado_pdv['conpag']  = 'C'
			encabezado_pdv['numpag']  = this.num_pagos_credito
			encabezado_pdv['valcre']  = this.redondear(this.total)
			encabezado_pdv['plapag']  = this.plazo_dias_pagos
 	 }
	 //##############   BLOQUE DE RETENCIONES   ################
	if (this.aplicar_retencion){
	 
		if (this.retencion_iva_select){
			console.log ("SELECCIONADO RETENCION DE IVA")
			encabezado_pdv['codiva'] = 	this.retencion_iva_codigo
			encabezado_pdv['porivar'] = this.retencion_iva 
			encabezado_pdv['valiva'] = this.ret_iva_aplicar
		}else{
			encabezado_pdv['codiva'] = 	''
			encabezado_pdv['porivar'] = ''
			encabezado_pdv['valiva'] = ''
		}
		
		if (this.retencion_fuente_select){
			console.log ("SELECCIONADO RETENCION DE FUENTE")
			console.log(this.retencion_fuente_codigo)
			console.log(this.retencion_fuente)
			console.log(this.ret_fuente_aplicar)
			encabezado_pdv['codret'] = this.retencion_fuente_codigo
			encabezado_pdv['porret'] = this.retencion_fuente 
			encabezado_pdv['valret'] = this.redondear(this.ret_fuente_aplicar)
		}else{
			encabezado_pdv['codret'] = ''
			encabezado_pdv['porret'] = ''
			encabezado_pdv['valret'] = ''
		} 
	} else{
			console.log ("#### NO HAY RETENCIONES A APLICAR  ####")
			encabezado_pdv['codiva'] = 	''
			encabezado_pdv['porivar'] = ''
			encabezado_pdv['valiva'] = ''
			encabezado_pdv['codret'] = 	''
			encabezado_pdv['porret'] = ''
			encabezado_pdv['valret'] = ''
			}
			
		 //##############  FIN BLOQUE DE RETENCIONES   ################
	 

	let status_encabezado
	let numfac
	console.log (encabezado_pdv)
	console.log ("DATO CLIENTE")
	console.log (this.dato_cliente)

	
	
	console.log("ENTRO A GENERAR EL PEDIDO")
	
	if (!this.accion_actualizar){
		
		if (this.numtra_pedido){
			encabezado_pdv['numtra_pedido'] = this.numtra_pedido
			encabezado_pdv['tiptra_pedido'] = this.tiptra_pedido
		}
		this.srv.generar_encabezado_pdv(encabezado_pdv).subscribe(
			data => {
				status_encabezado= data['status']
				numfac= data['numfac']
				console.log(data)
				if (status_encabezado == 'INSERTADO CON EXITO'){
					console.log('SE CREAN LOS RENGLONES')
					let renglones_pedido
					let numren = 1
					var longitud_renglones = this.articulos_pedido.length
					var contador_proceso = 0
					let array_renglones_pdv = []
					
						for (renglones_pedido of this.articulos_pedido) {
						renglones_pedido['numren'] = numren++
						renglones_pedido['numfac'] = numfac
						renglones_pedido['codemp']= this.empresa
						renglones_pedido['numcaj']  = this.caja
						renglones_pedido['codagencia'] = this.srv.getCodAgencia();
						console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
						console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						array_renglones_pdv.push(renglones_pedido)
						}
						
						this.srv.generar_renglones_pdv(array_renglones_pdv).subscribe(
							result => {
									console.log(result)
									console.log("####  CONTADOR PROCESO INICIO #####")
									contador_proceso++
									console.log(contador_proceso)
									  let datos = {};
									  datos['usuario'] = this.usuario;
									  datos['empresa'] = this.empresa;
									  // datos['pedido'] = 'success'
									  // console.log(datos)
										// if (contador_proceso == longitud_renglones){
											// //###### SE VALIDA SI ESTA CONFIGURADO EL ENVIO DE CORREO DE LOS PEDIDOS  ########
											// if (this.srv.getConfCorreoPedCli() == 'SI'){
												// this.correo_pedido(numtra,this.email_cliente)
											// }
											let datos_fe = {}
											datos_fe['numfac'] = numfac
											datos_fe['codemp'] = this.empresa
											datos_fe['venta'] = 'success'
											
											this.srv.aplicar_fact_electronica(datos_fe).subscribe(
												result => {
													this.router.navigate(['/admin/lista_pdv', datos]);
												}
												
												
											)
										// }

									},
							error => {
										console.error(error)
									}
							

							)
					}
				}
		
		); 
	
	}else{
		encabezado_pdv['numfac'] = this.numtra
	
		this.srv.actualizar_encabezado_pdv(encabezado_pdv).subscribe(
			data => {
				status_encabezado= data['status']
				numfac= data['numfac']
				console.log(data)
				if (status_encabezado == 'ACTUALIZADO CON EXITO'){
					console.log('SE CREAN LOS RENGLONES')
					let renglones_pedido
					let numren = 1
					var longitud_renglones = this.articulos_pedido.length
					var contador_proceso = 0
					let array_renglones_pdv = []
					
						for (renglones_pedido of this.articulos_pedido) {
						renglones_pedido['numren'] = numren++
						renglones_pedido['numfac'] = numfac
						renglones_pedido['codemp']= this.empresa
						renglones_pedido['numcaj']  = this.caja
						renglones_pedido['codagencia'] = this.srv.getCodAgencia();
						console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
						console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						array_renglones_pdv.push(renglones_pedido)
						}
						this.srv.generar_renglones_pdv(array_renglones_pdv).subscribe(
							result => {
									console.log(result)
									console.log("####  CONTADOR PROCESO INICIO #####")
									contador_proceso++
									console.log(contador_proceso)
									  let datos = {};
									  datos['usuario'] = this.usuario;
									  datos['empresa'] = this.empresa;
									  // datos['pedido'] = 'success'
									  // console.log(datos)
										// if (contador_proceso == longitud_renglones){
											// //###### SE VALIDA SI ESTA CONFIGURADO EL ENVIO DE CORREO DE LOS PEDIDOS  ########
											// if (this.srv.getConfCorreoPedCli() == 'SI'){
												// this.correo_pedido(numtra,this.email_cliente)
											// }
											let datos_fe = {}
											datos_fe['numfac'] = numfac
											datos_fe['codemp'] = this.empresa
											datos_fe['venta'] = 'success'
											
											this.srv.aplicar_fact_electronica(datos_fe).subscribe(
												result => {
													this.router.navigate(['/admin/lista_pdv', datos]);
												}
												
												
											)
										// }

									},
							error => {
										console.error(error)
									}
							

							)
						// }//FIN RECORRIDO RENGLONES PEDIDOS
					}
			


			}
		
		); 
	}

	}else {
		if (!this.dato_cliente){
			alert("Por favor llenar el campo Datos del cliente..!!!")
		}
		if (this.articulos_pedido.length == 0){
			alert("Por favor llenar los articulo o servicio s a facturar..!!!")
		}
		if (!this.email_cliente){
			alert("Por favor el cliente debe tener correo registrado para generar esta factura.!!!")
		}
	
	}
	
	}//FIN GENERA PEDIDO
	
	validar_totales_formapago() {
		console.log ("### VALIDAR TOTALES FORMAPAGO  ###")
		console.log("###  EFECTIVO  ###")
		console.log (this.monto_efectivo)
		console.log("###  CHEQUE  ###")
		console.log (this.monto_cheque)
		console.log("###  TARJETA  ###")
		console.log (this.monto_tarjeta)
		console.log("###  CREDITO  ###")
		console.log (this.monto_credito)
		console.log("###  TRANSFERENCIA  ###")
		console.log (this.monto_transferencia)
		
		let suma_total_formapago= this.monto_efectivo+this.monto_cheque+this.monto_tarjeta+this.monto_credito+this.monto_transferencia
		let total = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
		console.log (suma_total_formapago)
		console.log (total)
		

		if (suma_total_formapago === total){
			return true
			
		}else {
			alert("Favor validar el monto de las formas de pago sean igual al monto de la factura total..!!!")
			return false
		}
	
	}
	
	validar_subtotal_con_total() {
		console.log ("### VALIDAR TOTALES CON SUBTOTAL  ###")
		let total_validar = (this.subtotal) + this.iva_cant_new
		total_validar = Math.round(total_validar*100)/100
		this.total = Math.round(this.total*100)/100
		console.log (total_validar)
		console.log (this.total)

		if (total_validar === this.total){
			return true
			
		}else {
			alert("Favor validar el monto subtotal con el monto total de la factura.!!!")
			return false
		}
	
	}
	
		
	validar_campos_cheque_tarjeta_trasf() {
		console.log ("### VALIDAR CAMPO CHEQUE TARJETA  ###")
		if (this.check_tarjeta){
			if ((!this.num_tarjeta || this.num_tarjeta.length == 0) || (!this.codtar || this.codtar.length == 0)) {
				alert("Por favor ingresar el codigo de transaccion de tarjeta y tipo de tarjeta")
				return false
			}else{
				return true
			}
		}
		if (this.check_cheque){
			if ((!this.num_cheque || this.num_cheque.length == 0) || (!this.codban ||  this.codban.length == 0) ){
				alert("Por favor ingresar el Numero de cheque y Banco del cheque")
				return false
			}else{
				return true
			}
			
		}
		if (this.check_trasf_dep){
			if ((!this.num_tranf || this.num_tranf.length == 0) || (!this.coddep ||  this.coddep.length == 0) ){
				alert("Por favor ingresar el Numero de tranferencia / Deposito y Cuenta acreditada")
				return false
			}else{
				return true
			}
			
		}
	return true

	
	} 
	
	validar_campos_credito() {
		console.log ("### VALIDAR CAMPO CREDITO###")
		if (this.check_credito){
			if ( this.num_pagos_credito == 0 || this.plazo_dias_pagos == 0) {
				alert("Por favor numero de pagos y plazo dias del credito deben ser superior a 0")
				return false
			}else{
				return true
			}
		}
	return true

	
	} 
	
	validacion_alerta_existencia_correo() {
		console.log ("### VALIDAR CAMPO EMAIL CLIENTE###")
		if (this.email_cliente == 'NN'){
	      confirm ("El cliente no tiene correo electrónico...por favor incluir el correo en la ficha para completar la facturacion??")
    	return false
		}
	return true

	
	} 
	


	
	correo_pedido(numtra,email) {
		console.log("CORREO FACTURACION")
		console.log (numtra)
		console.log (email)
		// alert("Por favor ingrese RUC del cliente");

			const datos = {};
			datos['codemp'] = this.empresa;
			datos['usuario'] = this.usuario;
			datos['num_ped'] = numtra
			datos['asunto'] = 'pedido'
			datos['email'] = email
			
			this.srv.mail(datos).subscribe(
				data => {
					console.log(data)
				}
			)


	}//FIN ENVIO CORREO PEDIDO
	
	busqueda_pedido_razonsocial() {

	
	if (this.patron_razon_social_pedido){
		const datos = {};
		datos['codemp'] = this.empresa;
		datos['patron_cliente'] = this.patron_razon_social_pedido;
		
		
		
			this.srv.busqueda_pedido_razonsocial(datos).subscribe(
			data => {
				// console.log ('lo que viene de bd')
				// console.log(data)
				if (data.length > 0){
					this.exist_pedido = true
					this.lista_pedidos = data
				
				} else{
				    this.exist_pedido = false
					alert ('No existe pedido/proforma/orden que coincida con la razon social ingresada')
				}
				
				
				// let longitud_data = data.length

			// if (longitud_data > 0 ) {
				// console.log(data)

				// this.razon_social_lista = data;
				// this.exist_razon_social = true;
				// // this.searching_articulo = false
				
		
				
			// }else {
				// alert("Razon Social no encontrado con la palabra clave ingresada <<"+this.patron_cliente+">>");
				// // this.searching_articulo = false
				// this.exist_razon_social = false;
			// }
				

			}); 
		}else  { 
			alert("Por favor llenar el campo");
		}
	 
	 }
	 
	 	select_pedido_orden(numtra,tiptra) {
			console.log ("#### CAMBIANDO VENTANA ####")
			console.log (numtra)
			//##########CARGO EL PEDIDO
			this.cargar_encabezado_pedido(numtra,tiptra)
			
			//########## CAMBIO PESTAÑA
			let instacia_li_importar_pedido = this.importar_pedido.nativeElement;
			let instacia_li_facturacion = this.facturacion.nativeElement;
			let instancia_tab_facturacion = this.tab_facturacion.nativeElement;
			let instancia_tab_importar_pedido = this.tab_importar_pedido.nativeElement;
			

			this.renderer.removeClass(instacia_li_importar_pedido,'active')
			this.renderer.addClass(instacia_li_facturacion,'active')
			this.renderer.removeClass(instancia_tab_importar_pedido,'active')
			this.renderer.addClass(instancia_tab_facturacion,'active')
			
		//########### LIMPIO RESULTADO DE LISTA PEDIDOS
			this.lista_pedidos = []
			this.patron_razon_social_pedido = undefined
			this.exist_pedido = false
			
			
			

		}

	
	reset() {
	  this.clientes = false;
	  this.exist_articulo = false;
	  this.edit_cant = false;
	  this.masterSelected = false;
	  this.cantidad_nueva = '1';
	  this.cambiar_email = false;
	  this.razon_social = ''
	  this.email_cliente = ''
	  this.ciudad = ''
	  this.articulo = []
	  this.articulos_pedido = []
	  this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
	  this.iva_porcentaje = 0
	  this.iva_cant = 0
	  this.total = 0
	  this.observacion_pedido = ''
	  this.check_credito = false
	  this.check_tarjeta = false
	  this.check_cheque = false
	  this.check_efectivo = false
	  this.check_trasf_dep = false
	  this.monto_efectivo = 0
	  this.monto_cheque = 0
	  this.monto_tarjeta = 0
	  this.monto_transferencia = 0
	  this.monto_credito = 0
	  this.plazo_dias_pagos = 1
	  this.num_pagos_credito = 1
	  this.ret_iva_aplicar = 0
	  this.ret_fuente_aplicar = 0
	  this.num_cheque = ''
	  this.num_tarjeta = ''
	  this.num_tranf = ''
	  this.lista_pedidos = []
	  this.numplaca = null
	
	}//FIN ENVIO CORREO PEDIDO

	
	
	
	
	
  
  
}
