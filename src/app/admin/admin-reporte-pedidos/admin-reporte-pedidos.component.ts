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
  selector: 'admin-reporte-pedidos',
  templateUrl: './admin-reporte-pedidos.component.html',
  styleUrls: ['./admin-reporte-pedidos.component.css']
})



	

export class AdminReportePedidosComponent implements OnInit {
	
		  parametros: {usuario: string, empresa: string};
	
	 myControl = new FormControl();
	 myControl2 = new FormControl();
	filteredOptions: Observable<string[]>;
	filteredarticulo: Observable<string[]>;
	public clientes : boolean;
	// public exist_articulo : boolean;
	public razon_social : string;
	public email_cliente : string;
	public subtotal;
	public total;
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
	public lista_rutas
	public lista_surcursales
	
	public progreso_reporte = 0+'%'

	public check_agencia
	public val_exist_ppal:boolean
	public val_exist_sucursal:boolean
	// public check_agencia_sucursal:boolean
	public edit_dir_agencia_ppal:boolean
	public habilitar_crear_nueva_sucursal:boolean
// PARA DEFINIR LA RUTA DE LOS PEDIDOS
    public id_nombre_ruta_seleccionado
	public id_direccion_sucursal_seleccionado
	public idruta
	public nombre_ruta
	public id_agencia
	public dir_agencia
	
	public header_pedidos
	public header_pedidos_front
	public lista_pedidos
	public loading
	public searching = false
	public exist_articulo = false
	public lista_renglones = [] 
	public check_mostrar_num_ped = false
	public check_mostrar_razon_social = false
	// public header_productos
	
	// public header_productos = [
	// {"producto": "AGUACATE"},
	// {"producto": "TOMATE"},
	// {"producto": "CEBOLLA"}
	// ];
	
	public CANTIDAD_PRODUCTOS = 0
	public CONTADOR = 0
	public FLAG_TODAS_RUTAS = false


	
	
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
	
	articulos_pedido: any = []
	public test_object_array :any = [];
	public tipo_doc_lista
	
	fecha_entrega_pedido
	fecha_entrega_pedido_mensaje
	dtOptions:any = {};

	
	// #### PARA MARCAR LA EDICION DEL PRECIO DEL ARTICULO


  

	

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  
  { 
  	this.loading = true;
    
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
      });
	
	console.log(this.usuario)
	console.log(this.empresa)

	this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	

////PARA BUSCAR CIUDAD
	const datos = {};
	datos['codemp'] = this.empresa;		
	console.log (datos)


	this.srv.get_rutas(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO RUTAS")
		   console.log(data)
		   let todas_rutas = {idruta:"TODAS", nombre_ruta: "***TODAS LAS RUTAS***"}
		   this.lista_rutas = data
		   this.lista_rutas.push(todas_rutas)
		});

	console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
	console.log (this.srv.getConfCorreoPedCli())
	AdminLTE.init();
	}
	
	set_id_nombre_rutas(tipo_agencia){
		console.log(this.id_nombre_ruta_seleccionado)
			
		let id_nombre_ruta_seleccionado_array = this.id_nombre_ruta_seleccionado.split("|",2)
		// console.log(id_nombre_ruta_seleccionado_array[0])
		this.idruta = id_nombre_ruta_seleccionado_array[0]
		this.nombre_ruta=id_nombre_ruta_seleccionado_array[1]
		
		if (this.idruta == 'TODAS'){
			this.FLAG_TODAS_RUTAS = true
		}else {
			this.FLAG_TODAS_RUTAS = false
		}
		

	}
	
	consultar_reporte(){
		this.progreso_reporte = 0+'%'
		this.searching = true;
		this.CANTIDAD_PRODUCTOS = 0
		this.CONTADOR = 0
		
		this.lista_renglones = []
		this.header_pedidos = []
		this.header_pedidos_front = []
		
		console.log ("MOSTRAR NUM_PEDIDO")
		console.log (this.check_mostrar_num_ped)
		console.log ("MOSTRAR RAZON SOCIAL")
		console.log(this.check_mostrar_razon_social)
		
		
	if (this.fecha_entrega_pedido && this.idruta){
		
		console.log("##### STATUS LOADING #####")
		this.loading = true;
		console.log(this.loading)
		
		// this.searching = true;
		
	console.log ("##### DENTRO GENERAR_REPORTE  ######")
	
	console.log ("##### RUTA ######")		
	console.log (this.idruta)
	console.log (this.nombre_ruta)
	
	console.log ("##### FECHA DE DESPACHO ######")	
	console.log (formatDate(this.fecha_entrega_pedido, 'yyyy-MM-dd', 'en-US', '-0500'));
	this.fecha_entrega_pedido_mensaje = formatDate(this.fecha_entrega_pedido, 'dd-MM-yyyy', 'en-US', '-0500')

	
	
	
	
	let datos_reporte = {};
	datos_reporte['codemp'] = this.empresa;
	datos_reporte['idruta'] = this.idruta;
	datos_reporte['fecha_entrega'] = formatDate(this.fecha_entrega_pedido, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (datos_reporte)

	
	// let header_exist
    this.srv.reporte_lista_pedidos_ruta(datos_reporte).subscribe(
	   data => {
		   console.log("OBTENIENDO LISTADO HEADER1 PEDIDOS")
		   console.log(data)
		   this.header_pedidos_front.push ({"header_pedido":"PRODUCTO"},{"header_pedido":"UNI"})
		   this.header_pedidos.push ({"header_pedido":"PRODUCTO"},{"header_pedido":"UNI"})
		   for (let encabezado of data){
			   console.log (encabezado)
			   console.log (encabezado.header_pedido)
			   let arr= encabezado.header_pedido.split("*")
			   console.log (arr)
			   let nuevo_encabezado_front = {}
			   let nuevo_encabezado_base= {}
			   if ((encabezado.header_pedido != 'PRODUCTO') && (encabezado.header_pedido != 'UNI')){
				   if (this.check_mostrar_num_ped){
					   nuevo_encabezado_front['header_pedido'] = arr[0]+"-"+arr[2]+"-"+arr[3]
				   }else{
					   nuevo_encabezado_front['header_pedido'] = arr[2]+"-"+arr[3]
				   }
				    
					this.header_pedidos_front.push(nuevo_encabezado_front)
					nuevo_encabezado_base['header_pedido'] = arr[0]+"-"+arr[1]+"-"+arr[3]
					this.header_pedidos.push(nuevo_encabezado_base)
			   }
		   }
		   console.log ("HEADER PEDIDO FRONT")
		   console.log (this.header_pedidos_front)
		   console.log ("HEADER PEDIDO NORMAL")
		   console.log (this.header_pedidos)
		   
		   // this.header_pedidos = data

		   
		});


	 setTimeout(()=> {	
	this.srv.reporte_lista_articulos(datos_reporte).subscribe(
	   data => {
		   console.log("OBTENIENDO LISTADO PRODUCTOS UNITARIO")
		   console.log(data)
		   
		   this.CANTIDAD_PRODUCTOS = data.length
		   this.CONTADOR = 0
		   
		   console.log (this.CANTIDAD_PRODUCTOS)
		   if (this.CANTIDAD_PRODUCTOS > 0){
		   
		   
		   for (let csv_json of data) {
			   
			   csv_json['codemp'] = this.empresa;
			   csv_json['idruta'] = this.idruta;
			   csv_json['fecha_entrega'] = formatDate(this.fecha_entrega_pedido, 'yyyy-MM-dd', 'en-US', '-0500');
			   console.log (csv_json)
			   

			   
	
			   this.srv.reporte_renglones_pedidos_ruta(csv_json).subscribe(
			   data => {
				  console.log("###### RENGLONES PRODUCTO  ##########")
					console.log(data)
					
	
					this.lista_renglones.push(data)
					
					
					console.log("###### CONTADOR ##########")
					this.CONTADOR++
					console.log (this.CONTADOR)
					
					this.progreso_reporte = (this.CONTADOR*100)/this.CANTIDAD_PRODUCTOS+'%'
					
					
					if (this.CANTIDAD_PRODUCTOS == this.CONTADOR){
						
						console.log("###### ARRAY COMPLETO PRODUCTOS  ##########")
					console.log (this.lista_renglones)
						
						
					setTimeout(()=> {	
							console.log("TIME OUT")
							console.log("#### LISTA  ####")
							console.log(this.lista_renglones)
						if ((this.lista_renglones && this.lista_renglones.length > 0)){
							console.log("#### SI HAY INFORMACION ####")
							this.lista_pedidos = this.lista_renglones
								this.dtOptions = {
									order: [1, 'desc'],
									dom: 'Blfrtip',
									// buttons: ['print','excel'],
									// pagingType: 'full_numbers',
									// lengthChange: true,
									// lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
									// pageLength: 2,
									lengthMenu: [[10, 20, 25, 50, -1], [10, 20, 25, 50, 'All']],
									
									buttons: [{
										extend: 'print',
										filename: 'REPORTE_ENTREGAS_'+this.nombre_ruta+'_'+formatDate(this.fecha_entrega_pedido, 'dd-MM-yyyy', 'en-US', '-0500')
									},
									{
										extend: 'excel',
										filename: 'REPORTE_ENTREGAS_'+this.nombre_ruta+'_'+formatDate(this.fecha_entrega_pedido, 'dd-MM-yyyy', 'en-US', '-0500')
									}],
									 processing: true
									 
								};
							
							this.loading = false;
							this.searching = false;
							this.exist_articulo = true
							}else{
								console.log("#### NO HAY INFORMACION ####")
								this.loading = false;
								this.searching = false;
								this.exist_articulo = false
							}
						}, 4000)	
					
					} //FIN IF IGUAL CONTADOR
					
			});

		   }//FIN FOR
		   
	   } else{
		   		console.log("#### NO HAY INFORMACION ####")
				this.loading = false;
				this.searching = false;
				this.exist_articulo = false
	   }//FIN IF -ELSE CONTADOR

		});
	}, 500) 
	
	}else{
		alert ('Por favor seleccionar "Ruta" y Fecha de despacho de los pedidos')
		this.searching = false;
	}
	
	} //FIN CONSULTAR_REPORTE
	
//###################################	REPORTE DE TODAS LAS RUTAS    ##########################
	consultar_reporte_todas_rutas(){
		console.log ("#### REPORTE TODAS LAS RUTAS  ####")
		
		this.progreso_reporte = 0+'%'
		this.searching = true;
		this.CANTIDAD_PRODUCTOS = 0
		this.CONTADOR = 0
		
		this.lista_renglones = []
		this.header_pedidos = []
		this.header_pedidos_front = []
		console.log ("MOSTRAR NUM_PEDIDO")
		console.log (this.check_mostrar_num_ped)
		console.log ("MOSTRAR RAZON SOCIAL")
		console.log(this.check_mostrar_razon_social)
		
		
	if (this.fecha_entrega_pedido && this.idruta){
		
		console.log("##### STATUS LOADING #####")
		this.loading = true;
		console.log(this.loading)
		
		// this.searching = true;
		
	console.log ("##### DENTRO GENERAR_REPORTE  ######")
	
	console.log ("##### RUTA ######")		
	console.log (this.idruta)
	console.log (this.nombre_ruta)
	
	console.log ("##### FECHA DE DESPACHO ######")	
	console.log (formatDate(this.fecha_entrega_pedido, 'yyyy-MM-dd', 'en-US', '-0500'));
	this.fecha_entrega_pedido_mensaje = formatDate(this.fecha_entrega_pedido, 'dd-MM-yyyy', 'en-US', '-0500')

	
	
	
	
	let datos_reporte = {};
	datos_reporte['codemp'] = this.empresa;
	datos_reporte['idruta'] = this.idruta;
	datos_reporte['fecha_entrega'] = formatDate(this.fecha_entrega_pedido, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (datos_reporte)
	
	// let header_exist
    this.srv.reporte_lista_pedidos_ruta_todas(datos_reporte).subscribe(
	   // data => {
		   // console.log("OBTENIENDO LISTADO HEADER1 PEDIDOS")
		   // console.log(data)
		   // this.header_pedidos = data

		   
		// }
		
		
			data => {
		   console.log("OBTENIENDO LISTADO HEADER1 PEDIDOS RUTAS")
		   console.log(data)
		   this.header_pedidos_front.push ({"header_pedido":"PRODUCTO"},{"header_pedido":"UNI"})
		   this.header_pedidos.push ({"header_pedido":"PRODUCTO"},{"header_pedido":"UNI"})
		   for (let encabezado of data){
			   console.log (encabezado)
			   console.log (encabezado.header_pedido)
			   let arr= encabezado.header_pedido.split("*")
			   console.log (arr)
			   let nuevo_encabezado_front = {}
			   let nuevo_encabezado_base= {}
			   if ((encabezado.header_pedido != 'PRODUCTO') && (encabezado.header_pedido != 'UNI')){
				   if (this.check_mostrar_num_ped){
					   nuevo_encabezado_front['header_pedido'] = arr[0]+"-"+arr[2]+"-"+arr[3]+"-"+arr[4]
				   }
				   else{
					   nuevo_encabezado_front['header_pedido'] = arr[2]+"-"+arr[3]+"-"+arr[4]
				   }
					this.header_pedidos_front.push(nuevo_encabezado_front)
					nuevo_encabezado_base['header_pedido'] = arr[0]+"-"+arr[1]+"-"+arr[3]+"-"+arr[4]
					this.header_pedidos.push(nuevo_encabezado_base)
			   }
		   }
		   console.log ("HEADER PEDIDO FRONT")
		   console.log (this.header_pedidos_front)
		   console.log ("HEADER PEDIDO NORMAL")
		   console.log (this.header_pedidos)
		   
		   // this.header_pedidos = data

		   
		}
		
		
		
		
		
		
		
		
		);
		

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		


	 setTimeout(()=> {	
	this.srv.reporte_lista_articulos_todas_rutas(datos_reporte).subscribe(
	   data => {
		   console.log("OBTENIENDO LISTADO PRODUCTOS UNITARIO")
		   console.log(data)
		   
		   this.CANTIDAD_PRODUCTOS = data.length
		   this.CONTADOR = 0
		   
		   console.log (this.CANTIDAD_PRODUCTOS)
		   if (this.CANTIDAD_PRODUCTOS > 0){
		   
		   
		   for (let csv_json of data) {
			   
			   csv_json['codemp'] = this.empresa;
			   csv_json['idruta'] = this.idruta;
			   csv_json['fecha_entrega'] = formatDate(this.fecha_entrega_pedido, 'yyyy-MM-dd', 'en-US', '-0500');
			   console.log (csv_json)
			   

			   
	
			   this.srv.reporte_renglones_pedidos_ruta_todas(csv_json).subscribe(
			   data => {
				  console.log("###### RENGLONES PRODUCTO  ##########")
					console.log(data)
					
	
					this.lista_renglones.push(data)
					
					
					console.log("###### CONTADOR ##########")
					this.CONTADOR++
					console.log (this.CONTADOR)
					
					this.progreso_reporte = (this.CONTADOR*100)/this.CANTIDAD_PRODUCTOS+'%'
					
					
					if (this.CANTIDAD_PRODUCTOS == this.CONTADOR){
						
						console.log("###### ARRAY COMPLETO PRODUCTOS  ##########")
					console.log (this.lista_renglones)
						
						
					setTimeout(()=> {	
							console.log("TIME OUT")
							console.log("#### LISTA  ####")
							console.log(this.lista_renglones)
						if ((this.lista_renglones && this.lista_renglones.length > 0)){
							console.log("#### SI HAY INFORMACION ####")
							this.lista_pedidos = this.lista_renglones
								this.dtOptions = {
									order: [1, 'desc'],
									dom: 'Bfrtip',
									// buttons: ['print','excel'],
									
									buttons: [{
										extend: 'print',
										filename: 'REPORTE_ENTREGAS_'+this.nombre_ruta+'_'+formatDate(this.fecha_entrega_pedido, 'dd-MM-yyyy', 'en-US', '-0500')
									},
									{
										extend: 'excel',
										filename: 'REPORTE_ENTREGAS_'+this.nombre_ruta+'_'+formatDate(this.fecha_entrega_pedido, 'dd-MM-yyyy', 'en-US', '-0500')
									}],
									 processing: true
								};
							
							this.loading = false;
							this.searching = false;
							this.exist_articulo = true
							}else{
								console.log("#### NO HAY INFORMACION ####")
								this.loading = false;
								this.searching = false;
								this.exist_articulo = false
							}
						}, 4000)	
					
					} //FIN IF IGUAL CONTADOR
					
			});

		   }//FIN FOR
		   
	   } else{
		   		console.log("#### NO HAY INFORMACION ####")
				this.loading = false;
				this.searching = false;
				this.exist_articulo = false
	   }//FIN IF -ELSE CONTADOR

		});
	}, 500) 
	
	}else{
		alert ('Por favor seleccionar "Ruta" y Fecha de despacho de los pedidos')
	}
	
	} //FIN CONSULTAR_REPORTE TODO


	
	
	
	
	
  
  
}
