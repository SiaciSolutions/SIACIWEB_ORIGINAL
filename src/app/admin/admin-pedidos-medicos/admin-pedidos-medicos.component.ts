import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
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
  selector: 'app-admin-pedidos-medicos',
  templateUrl: './admin-pedidos-medicos.component.html',
  styleUrls: ['./admin-pedidos-medicos.component.css']
})



	

export class AdminPedidosMedicosComponent implements OnInit {
	
	  parametros: {usuario: string, empresa: string};
	
	 myControl = new FormControl();
	 myControl2 = new FormControl();
	filteredOptions: Observable<string[]>;
	filteredarticulo: Observable<string[]>;
	public clientes : boolean;
	public exist_articulo : boolean;
	public exist_razon_social : boolean;
	public razon_social : string;
	public email_cliente : string;
	public subtotal;
	public today= new Date();
	public edit_cant: boolean
	public desc_cant = 0
	public total=0
	public iva_cant = 0
	public iva_cant_new = 0
	desc_porcentaje = 0;
	public iva_porcentaje = 0;
	subtotal_desc = 0;
	public iva_siaci
	public ciudad_lista:any = [];
	public vendedores_lista:any = [];
	public observacion_pedido = null
	public cambiar_email:boolean;
	public lista_prec = []
	public nuevo_precio_renglon
	public lista_rutas
	public lista_surcursales
	public change_iva = false
	public tipo_busqueda : boolean;
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
	public searching_articulo = false
	public patron_cliente
	public razon_social_lista
	public edit_iva_art
	exist_fecha_entrega = true
	// fecha_entrega = undefined
	fecha_entrega = new FormControl(new Date());
	// date = new FormControl(new Date());

	
	
	jstoday = '';
	fectra =  new FormControl(new Date());
	// public date : string;
	// clientes;
	usuario = ''
	empresa = ''
	ruc = '';
	patron_articulo = '';
	cantidad_nueva = '';
	ciudad
	vendedor = '01'

	// editART: ARTICULO
	editART: any = []
	dato_cliente
	
	options: any = []
	articulo: any = []
	articulos_seleccionado
	elements_checkedList:any = [];
	 masterSelected:boolean;
	
	articulos_pedido: any = []
	// #### PARA MARCAR LA EDICION DEL PRECIO DEL ARTICULO
	public edit_articulos
	
	numtra
	accion_actualizar = false
	
	especialidad
	cod_especialidad
	estado
	
  @ViewChild('facturacion') facturacion: ElementRef;
  @ViewChild('crear_cliente') crear_cliente: ElementRef;
  @ViewChild('tab_facturacion') tab_facturacion: ElementRef;
  @ViewChild('tab_crear_cliente') tab_crear_cliente: ElementRef;
  
  // DATOS CREACION DE PACIENTE DATOS
  tipo_doc_paciente
  rucced_paciente = null
  nomcli_paciente
  apecli
  num_historia
  fecha_nacimiento
  // FIN DATOS CREACION DE PACIENTE DATOS	
  
  public tipo_doc_lista = [
			{"tipo": "C", "nom_doc": "CEDULA"},
			{"tipo": "R", "nom_doc": "RUC"},
			{"tipo": "X", "nom_doc": "SIN CEDULA"},
			{"tipo": "P", "nom_doc": "PASAPORTE"}
		];
  tipo_doc

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  
  { 
  this.tipo_busqueda = false;
  this.clientes = false;
  this.exist_articulo = false;
  this.exist_razon_social = false;
  this.edit_cant = false;
  this.masterSelected = false;
  this.cantidad_nueva = '1';
  this.cambiar_email = false;
  this.check_agencia = false
  // this.check_agencia_sucursal = false
  this.val_exist_ppal = true
  this.val_exist_sucursal = true
  this.edit_dir_agencia_ppal = false
  this.habilitar_crear_nueva_sucursal = false
 

     this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
    console.log("Subtotal: ", this.subtotal)
	
		  
	this.route.params.subscribe(val => {
		if (!this.srv.isLoggedIn()){
		this.router.navigateByUrl('/')};
		
		this.route.queryParams.subscribe(params => {
			console.log(params)
			// Defaults to 0 if no query param provided.
			// this.ruc = +params['ruc'] || 0;
			this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
			this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
			this.numtra = params['pedido'] || this.route.snapshot.paramMap.get('pedido') || 0;
			this.estado = params['estado'] || this.route.snapshot.paramMap.get('estado') || 0;
			
			console.log("LUEGO DE ENTRADA")
		if (this.numtra == 0){
			this.numtra = undefined
			this.accion_actualizar = false
			window.scrollTo(0,0);
			this.pedido_nuevo()
		}else {
			window.scrollTo(0,0);
			this.accion_actualizar = true
			this.reload_pedido()
			
		}
			
		  });
		
		console.log(this.usuario)
		console.log(this.empresa)
		console.log(this.numtra)
		
		
		
		

	   }
	); //FIN ROUTING
  } //FIN COSNTRUCTOR
  

   ngOnInit() {
	   

	AdminLTE.init();
	
	}
	
	// ######## PEDIDO NUEVO   ##########
	
	public pedido_nuevo(){
		// this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
		this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
		// this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
		console.log (this.jstoday)
		console.log (this.fectra)

		console.log (this.today)
		console.log (this.fecha_entrega)
		
		this.reset()
		
		
	////PARA BUSCAR IVA Y SETEAR IVA DEFECTO
		this.srv.iva().subscribe(data => {
			console.log ("**** IVA DE SIACI ***")
			console.log (data)
		  this.iva_siaci = data;
		  
		

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
			   let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
			   this.ciudad_lista = data
			   this.ciudad_lista.push(option_defecto_final)
			   console.log("CIUDAD LISTA")
			   console.log(this.ciudad_lista)
			});
			
		this.srv.vendedores(datos).subscribe(
		   data => {
			   console.log("OBTENIENDO VENDEDORES")
			   console.log(data)
			   this.vendedores_lista = data
			   if (this.vendedores_lista.length == 1){
					this.vendedor = this.vendedores_lista[0]['codven']
						
			   }else{
				   this.vendedor = "01"
			   }
			
			});
		
		this.srv.especialidades(datos).subscribe(
		   data => {
			   console.log("OBTENIENDO ESPECIALIDAD")
			   console.log(data)
			   this.especialidad = data ['nomcla']
			   this.cod_especialidad = data ['codcla'] 
			});

		console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
		console.log (this.srv.getConfCorreoPedCli())
			
	}
	
	
		// ########RECARGA PEDIDO   ##########
	
	public reload_pedido(){
		// this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
		this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');

		
		////PARA BUSCAR IVA Y SETEAR IVA DEFECTO
		this.srv.iva().subscribe(data => {
			console.log ("**** IVA DE SIACI ***")
			console.log (data)
		  this.iva_siaci = data;
		  
		

		});
	////PARA BUSCAR CIUDAD
		const datos = {};
		datos['codemp'] = this.empresa;
		datos['usuario'] = this.usuario;
		console.log (datos)
		
		// especialidades
			
		// this.srv.ciudad(datos).subscribe(
		   // data => {
			   // console.log("OBTENIENDO CIUDAD")
			   // console.log(data)
			   // let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
			   // this.ciudad_lista = data
			   // this.ciudad_lista.push(option_defecto_final)
			   // console.log("CIUDAD LISTA")
			   // console.log(this.ciudad_lista)
			// });
			
		this.srv.vendedores(datos).subscribe(
		   data => {
			   console.log("OBTENIENDO VENDEDORES")
			   console.log(data)
			   this.vendedores_lista = data
			   // this.vendedor = "01"
			
			});
		
		this.srv.especialidades(datos).subscribe(
		   data => {
			   console.log("OBTENIENDO ESPECIALIDAD")
			   console.log(data)
			   this.especialidad = data ['nomcla']
			   this.cod_especialidad = data ['codcla'] 
			});
		
		

		
		// console.log("#####  IVA DEFECTO   #####")
		// console.log(this.iva_porcentaje)
		console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
		console.log (this.srv.getConfCorreoPedCli())
		
		this.buscar_encabezado_recibo();
			
	
	}

	
	buscar_encabezado_recibo() {
	const datos = {};
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;
	datos['pedido'] = this.numtra;
	
	this.srv.get_encabezado_pedido(datos).subscribe(
	   data => {
		   console.log(data)
		console.log ("EJECUTADA DATA CONSULTA PEDIDO")
		   
		// usuario = data['num_pedido']
		this.clientes = true;

		// this.fectra = data['fectra']
		let fecha = new Date(data['fectra'])
		//PARA COLOCAR LA FECHA CORRECTA Y NO LA FECHA -1
		fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
		console.log("***** FECHA DE BASE DE DATOS CORREGIDA *****")
		console.log(fecha)
		
		this.fectra = new FormControl(fecha);
		// this.fectra_msg = formatDate(this.fectra['value'], 'yyyy-MM-dd', 'en-US', '-0500')
		
		
		
		console.log (data['fectra'])
		
		// this.fectra = new Date(data['fectra'])
		
		// this.fecult = data['fecult']
		this.ruc = data['identificacion']
		this.razon_social = data['cliente']
		this.email_cliente = data['email']
		this.ciudad = data['ciucli']
		this.observacion_pedido = data['observ']
		// if (this.observacion_pedido == 'null'){
			// console.log ("CONVIRTIENDO NULL EN ESPACION EN BLANCO")
			// this.observacion_pedido = ''
		// }
		// this.subtotal = this.format_number(data['totnet']) 
		// this.iva_cant_new = this.format_number(data['iva_cantidad'])  
		// this.total= this.format_number(data['total_pedido'])
		
		this.subtotal = data['totnet'] 
		this.iva_cant_new = data['iva_cantidad']  
		this.total= data['total_pedido']
		this.vendedor = data['codven']
		
		console.log ("****** COD VENDEDOR *******")
		console.log (this.vendedor)
		
		this.dato_cliente= {"nomcli":this.razon_social,"codcli":data['codcli'],"dircli":data['direccion']}
		console.log ("****** DATO CLIENTE *******")
		console.log (this.dato_cliente)
		   
		}); 
	
	
	this.srv.get_renglones_pedido(datos).subscribe(
	   data => {
		   console.log ("ARREGLO DE BASE DE DATOS")
		   console.log(data)
		   
		   // console.log ("### RENGLONES ###")
		   let data_traduccion_lista: any = [];
	
		   
		   for (let data_traduccion of data) {
			   console.log ("### RENGLON ###")
			   console.log(data_traduccion)
			
			   data_traduccion.​​preuni = data_traduccion.​​preuni
			   data_traduccion.cant_iva = data_traduccion.cant_iva
			   data_traduccion.des_cant = data_traduccion.des_cant
			   data_traduccion.​​totren = data_traduccion.​​totren
			   data_traduccion.desren = data_traduccion.desren
			   data_traduccion.cantid = data_traduccion.cantid
			   
		
			   let index_art 
			   if (this.articulos_pedido.length == 0){
					index_art = this.articulos_pedido.length
				}else {
					console.log (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))
					index_art = (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))+1
				}

				let data_traduccion_renglon = 
							{index: index_art, codart: ""+data_traduccion.codart+"", ​​coduni: ""+data_traduccion.​​coduni+"", 
							 nomart: ""+data_traduccion.​​nomart+"", poriva: data_traduccion.​​poriva,  codiva: ""+data_traduccion.codiva+"",
							 precio_iva: data_traduccion.cant_iva, ​​cant: ""+data_traduccion.cantid+"",
							 ​v_desc_art: data_traduccion.des_cant, punreo: data_traduccion.desren,
							 num_docs: data_traduccion.num_docs, ​​prec01: data_traduccion.​​preuni,
							​​ subtotal_art:data_traduccion.​​totren};
			 
			 
			console.log ("### RENGLON TRADUCCION###")
			console.log (data_traduccion_renglon)
			
			this.articulos_pedido.push(data_traduccion_renglon)
		   }
		   console.log ("### ARMADO TRADUCCION ARTICULO PEDIDO ###")
		   console.log (this.articulos_pedido)
		   // this.articulos_pedido = data_traduccion

		   // this.renglones_pedido = data
		}); 
	

	}//  FIN BUSCAR RECIBOS
	
	formato_fecha (fecha){
		return formatDate(fecha, 'dd-MM-yyyy', 'en-US', '-0500')
		
		
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
	
	
	set_id_nombre_rutas(tipo_agencia){
		console.log(this.id_nombre_ruta_seleccionado)
		// this.id_direccion_sucursal_seleccionado=undefined
		console.log (this.id_direccion_sucursal_seleccionado)
			
		let id_nombre_ruta_seleccionado_array = this.id_nombre_ruta_seleccionado.split("|",2)
		// console.log(id_nombre_ruta_seleccionado_array[0])
		this.idruta = id_nombre_ruta_seleccionado_array[0]
		this.nombre_ruta=id_nombre_ruta_seleccionado_array[1]
		
		if (tipo_agencia == 'S'){
			console.log("BUSCANDO SUCURSALES EN RUTA "+this.nombre_ruta)
			
			let datos_sucurdales = {};
			
			datos_sucurdales['empresa'] = this.empresa;	
			datos_sucurdales['codcli'] = this.dato_cliente['codcli'];
			datos_sucurdales['tipo_agencia'] = tipo_agencia;
			datos_sucurdales['idruta'] = this.idruta;
			
			console.log (datos_sucurdales)
			
		this.srv.get_sucursales(datos_sucurdales).subscribe(
		data => {
		   console.log("OBTENIENDO DIRECCIONES RUTAS SUCURSALES")
		   console.log(data)
		   this.lista_surcursales = data
		   
			}); 
		
		
		}
		
		// this.id_direccion_sucursal_seleccionado = ""
		
		
		
		
		
	}
	
	set_id_dir_sucursal(){
		console.log(this.id_direccion_sucursal_seleccionado)
			
		let id_direccion_sucursal_seleccionado_array = this.id_direccion_sucursal_seleccionado.split("|",2)
		// console.log(id_nombre_ruta_seleccionado_array[0])
		this.id_agencia = id_direccion_sucursal_seleccionado_array[0]
		this.dir_agencia=id_direccion_sucursal_seleccionado_array[1]
		
		// if (tipo_agencia == 'S'){
			// console.log("BUSCANDO SUCURSALES EN RUTA "+this.nombre_ruta)
			
			// let datos_sucurdales = {};
			
			// datos_sucurdales['empresa'] = this.empresa;	
			// datos_sucurdales['codcli'] = this.dato_cliente['codcli'];
			// datos_sucurdales['tipo_agencia'] = tipo_agencia;
			// datos_sucurdales['idruta'] = this.idruta;
			
			// console.log (datos_sucurdales)
			
		// this.srv.get_sucursales(datos_sucurdales).subscribe(
		// data => {
		   // console.log("OBTENIENDO DIRECCIONES RUTAS SUCURSALES")
		   // console.log(data)
		   // this.lista_surcursales = data
		   
			// }); 
		
		
		// }
		
		
		
		
		
	}
	
	
	validar_exist_agencia(tipo_agencia){
		console.log("check_agencia")
		console.log(this.check_agencia)
		// console.log("check_agencia_sucursal")
		// console.log(this.check_agencia_sucursal)
		
	if (this.dato_cliente){
		console.log("validar_AGENCIA")
		let datos_val_ppal = {};
		datos_val_ppal['codemp'] = this.empresa;	
		datos_val_ppal['codcli'] = this.dato_cliente['codcli'];
		datos_val_ppal['tipo_agencia'] = tipo_agencia
		console.log (datos_val_ppal)
		
	this.srv.validar_exist_agencia(datos_val_ppal).subscribe(
	   data => {
		   console.log("OBTENIENDO DATOS AGENCIA")
		   console.log(data)
		   
		   if (data['idruta']){

				if (tipo_agencia == 'P'){
					this.idruta = data['idruta']
					this.nombre_ruta = data['nombre_ruta']
					this.id_agencia = data['id_agencia']
					this.dir_agencia = data['dir_agencia'] 
					this.val_exist_ppal = true
				}
				if (tipo_agencia == 'S'){
					console.log("SETEANDO VALORES DE RUTAS Y DIRECCION EN UNDEFINED")
					this.idruta = undefined
					this.nombre_ruta = undefined
					this.id_agencia = undefined
					this.dir_agencia = undefined
					this.val_exist_sucursal = true
				}
					
			}else {
				console.log("NO HAY SEDE PRINCIPAL DEFINIDA, POR FAVOR DEFINIRLA")
				if (tipo_agencia == 'P'){
					console.log("NO HAY SEDE PRINCIPAL DEFINIDA, POR FAVOR DEFINIRLA")
					this.val_exist_ppal = false
					this.dir_agencia = this.dato_cliente['dircli']
				}
				if (tipo_agencia == 'S'){
					console.log("NO HAY SEDE SUCURSAL DEFINIDA, POR FAVOR DEFINIRLA")
					this.val_exist_sucursal = false
					this.dir_agencia = ''
				}
				
				// this.val_exist_ppal = false
			
			
			}
		   

		   
		   
		   
	  }); 
		}else {
			alert ("Por favor ingrese los datos del cliente...!!!")
			this.check_agencia = false
			
		}

	}  //####  FIN VALIDAR PRINCIPAL
	
	
	
	guardar_nueva_agencia(tipo_agencia){
		console.log("ENTRADA CREAR AGENCIA")
		console.log (tipo_agencia)
		
		if (this.idruta && (this.dir_agencia.length > 0)){
		let datos_crear_agencia = {};
		datos_crear_agencia['empresa'] = this.empresa;
		datos_crear_agencia['tipo_agencia'] = tipo_agencia;	
		datos_crear_agencia['codcli'] = this.dato_cliente['codcli'];	
		datos_crear_agencia['nomcli'] = this.dato_cliente['nomcli'];
		datos_crear_agencia['dir_agencia'] = this.dir_agencia;
		datos_crear_agencia['idruta'] = this.idruta;

		console.log('##### DATOS CREAR AGENCIA #######')
		console.log (datos_crear_agencia)
		
		
	this.srv.crear_nueva_agencia(datos_crear_agencia).subscribe(
	   data => {
		   console.log("CREANDO NUEVA AGENCIA")
		   console.log(data)
		   this.id_agencia = data['id_agencia']
		   if (tipo_agencia == 'P'){
				   this.val_exist_ppal = true
				   this.id_nombre_ruta_seleccionado = undefined
					alert("Nueva agencia principal generada con éxito")				   
		   }
		   if (tipo_agencia == 'S'){
			      this.val_exist_sucursal = true
				  this.id_nombre_ruta_seleccionado = undefined
				  alert("Nueva agencia sucursal generada con éxito")	
			   
		   }
		   

		   
		   // if (data['idruta']){
				// this.idruta = data['idruta']
				// this.nombre_ruta = data['nombre_ruta']
				// this.id_agencia = data['id_agencia']
				// this.dir_agencia = data['dir_agencia'] 
				
				// this.val_exist_ppal = true
			// }else {
				// console.log("NO HAY SEDE PRINCIPAL DEFINIDA, POR FAVOR DEFINIRLA")
				// this.val_exist_ppal = false
				// this.dir_agencia = this.dato_cliente['dircli']
			
			// }

		   
	  }); 
	
	}else{
		alert("Por favor seleccionar ruta en donde se encuentra la agencia, y llenar la direccion de la agencia principal o sucursal a crear")
		
	}
		
		
		
	}
	

	
	edit_art (el) {
		console.log("ENTRADA ARTICULO A EDITAR")
		// console.log(el)
        this.editART = el
		this.edit_cant = true;
		console.log(this.editART)
    }
	
	
	delete_art (el,index) {
		console.log("ENTRADA ARTICULO A ELIMINAR")
		console.log(el)

	 let json_eliminar = this.articulos_pedido
	 // var nomart = el
	 
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
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new	
	
    }
	
	delete_art_todo () {
		console.log("ENTRADA ARTICULO A ELIMINAR TODOOOOO")
			this.articulos_pedido = []
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
			this.iva_porcentaje = 0
			this.iva_cant = 0
			this.total = 0
	
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
				console.log(data)
				console.log(data['nomcli'])
				this.razon_social = data['nomcli']
				this.email_cliente = data['email']
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
	 
	 
	 
	 
	busqueda_razon_social() { 
	if (this.patron_cliente){
		const datos = {};
		datos['codemp'] = this.empresa;
		datos['patron_cliente'] = this.patron_cliente;
			this.srv.busqueda_paciente(datos).subscribe(data => {
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
		
		this.dato_cliente= {"nomcli":rz,"rucced":ruc,"email":correo,"codcli":codcli,"dircli":dircli}
		 // ['codemp', 'nomcli','rucced','codcli','email','dircli','ciucli','telcli','telcli2']
		this.tipo_doc = ident 
		this.ruc = ruc
		this.razon_social = rz
		this.email_cliente = correo
		this.clientes = true;
		this.exist_razon_social = false;
		this.patron_cliente = undefined;
	 }
	 
	 
	 
	 
	 
	 
	busca_articulo() { 
	if (this.patron_articulo && this.dato_cliente){
		this.searching_articulo = true
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		datos['codcli']  = this.dato_cliente["codcli"];
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
				this.searching_articulo = false
				
				// this.filteredarticulo = this.myControl2.valueChanges.pipe(
				// startWith(''),
				// map(value => this._filter2(value))
				// ); 
	  
				
				
				
			}else {
				alert("Antículo no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
				this.searching_articulo = false
				this.exist_articulo = false;
			}
			}); 
		}else  { 
			alert("Por favor llene el campo artículo, y datos del cliente");
		}
	 }
	 
	busca_servicio() { 
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		datos['codcla']  = this.cod_especialidad;
		
		if (this.dato_cliente){
			datos['codcli']  = this.dato_cliente["codcli"];
		if (this.patron_articulo){

			console.log ("BUSCO SERVICIO")
				this.srv.servicios_medicos(datos).subscribe(data => {
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
				alert("Por favor llene el campo artículo/servicio");
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
		datos['codcli']  = this.dato_cliente["codcli"];
		this.srv.get_prec_product(datos).subscribe(
			data => {
				console.log(data)
				this.lista_prec = data
				
				// for (checked_json of this.elements_checkedList)
				// for (let precios of data[0]){
					// console.log ("LISTA DE PRECIOS BD")
					// console.log (precios)
					
					
				// }
				// console.log(data['prec02'])
				// console.log(data[0].prec01)
		// [
			// {"tipo": "C", "nom_doc": "CEDULA"},
			// {"tipo": "R", "nom_doc": "RUC"},
			// {"tipo": "P", "nom_doc": "PASAPORTE"}
		// ];
				
			// this.lista_prec =[{"prec": data[0].prec1},
							  // {"prec": data[0].prec2},
							  // {"prec": data[0].prec3},
							  // {"prec": data[0].prec4},
							  // {"prec": data[0].prec5}];
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
		datos['codcli']  = this.dato_cliente["codcli"];
		this.srv.get_prec_servicio(datos).subscribe(
			data => {
				console.log(data)
			// this.lista_prec =[{"prec": data[0].prec01},{"prec": data[0].prec02},{"prec": data[0].prec03},{"prec": data[0].prec04}];
			this.lista_prec =data ;
			console.log(this.lista_prec)
			}
			); 
		return "01"
	}
	
	
	
	
	
	
	// public edit_prec(articulos){
		
		// console.log ("##### EDIT PREC  ####")
		// console.log (articulos)
		// console.log (articulos["codart"])
		// this.edit_articulos=articulos
		// this.get_prec_produc(articulos["codart"])
		

		
		
	// }
	
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
	
	public update_iva_art(codart,index,value_iva_new){
		console.log("ACTUALIZAR IVA PARA ARTICULO")
		console.log("####  CODIDO ART ########")
		console.log(codart)
		console.log("####  IVA NUEVO ########")
		console.log(value_iva_new)
		let value_iva_new_array = value_iva_new.split("|")
		let poriva_new = value_iva_new_array[0]
		let codiva_new = value_iva_new_array[1]
		
		// console.log("####  CODIGO IVA ########")
		// console.log(codiva_new)
		
	if 	(codart){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR PRECIO")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO PORIVA")
		dato.poriva = poriva_new;
		dato.codiva = codiva_new;
		
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

	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)


	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.edit_iva_art = undefined
		
	}
	
	
	public edit_iva_articulo(el){
		
		console.log ("##### EDIT IVA ART  ####")
		console.log (el)
		console.log (el["codart"])
		this.edit_iva_art=el
		// this.get_prec_produc(articulos["codart"])
		

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
		dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  }
	  
	  return dato;
	});

	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)


	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
   }
	
	
	
	 
	public update (codart,index,cant) {
		console.log("ACTUALIZAR LISTA")
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
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)
	}

	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
	this.cantidad_nueva = '1';
   }
   
	public validaNumericos(event: any,value) {
		console.log ("validando_numero")
		console.log (event)
		// console.log (event.key)
		// console.log (event.explicitOriginalTarget.value)
		
		// console.log (event.explicitOriginalTarget.value.indexOf("."))
		// if (event.explicitOriginalTarget.value.indexOf(".") == -1){
			// console.log ("deberia escribir el punto")
		// }else{
			// console.log ("NO deberia escribir el punto")
			// return false;     
		// }
		
    if((event.charCode >= 48 && event.charCode <= 57) ||(event.charCode == 46)){
		////si hay otra punto como separador decimal, no escribir ese punto
		if ((value.indexOf(".") != -1) && (event.key == ".")){
			return false;
		}
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
		var desc_art_new =desc_art

	if 	(codart && desc_art_new ){
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
	// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	 console.log("IVA_NEW ", this.iva_cant_new)
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	 console.log("TOTAL_LUEGO_DESC_ART: ", this.total)
	// this.update_total_desc (this.desc_porcentaje) 
    // console.log("subtotal: ", this.subtotal)
	
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
		if (obsev_g == ""){
			obsev_g = null
		}
		this.observacion_pedido = obsev_g
   }
   

 
	 
	 
	inserta_pedido() {
		let checked_json
		let duplicado = false
		this.patron_articulo = undefined
		// console.log (this.elements_checkedList)
		// this.elements_checkedList = this.artSelectionList.selectedOptions.selected.map(s => s.value);
		
		
		
		
		if (this.elements_checkedList.length > 0) {
		
	for (checked_json of this.elements_checkedList) {
		console.log("NOMBRE DE ARTICULO A INSERTAR")	
		console.log(checked_json['codart'])
		
		// this.get_prec_produc(checked_json['codart'])
		
		//COMENTADO VALIDACION DUPLICADO GUADAPRODUC....!!!! 
		// this.articulos_pedido.map(function(dato){
			// if(dato.codart == checked_json['codart']){
				// console.log ("SUMO 1 a ITEM y no DEBERIA AGREGAR")
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

		
		if (!duplicado) {
		console.log ("VOY A AGREGAR")
		console.log (this.articulos_pedido.length)
		
		if (this.articulos_pedido.length == 0){
			checked_json['index'] = this.articulos_pedido.length
		}else {
			console.log (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))
			checked_json['index'] = (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))+1
		}
		


		
		
		checked_json['cant'] = '1';
		checked_json['num_docs'] = null;
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
			this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			this.elements_checkedList = [];
			this.articulo = [];
			this.exist_articulo = false;
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
	

   generar_pedido() {


	console.log (this.fecha_entrega)
	console.log (this.fecha_entrega['value'])
	let fecha_entrega = formatDate(this.fecha_entrega['value'], 'yyyy-MM-dd', 'en-US', '-0500')
	let fecha_entrega_msg = formatDate(this.fecha_entrega['value'], 'dd-MM-yyyy', 'en-US', '-0500')
	console.log (fecha_entrega);

	// ### Obtener fecha de día de mañana para validacion
	var newdate = new Date();
	newdate.setDate(newdate.getDate() +1 ); //
	var nd = new Date(newdate);
	// alert('the new date is ' + nd);
	var nd_manana_formateado = formatDate(nd, 'yyyy-MM-dd', 'en-US', '-0500')



	   
	 console.log ("GENERAR PEDIDO")
	
	console.log ("DATOS CLIENTE")
	console.log (this.dato_cliente)
	
	console.log ("ARTICULOS PEDIDO")
	console.log (this.articulos_pedido.length)
	
	
	// if ((this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.email_cliente) ){
	if ((this.dato_cliente) && (this.articulos_pedido.length > 0)){

	 let encabezado_pedido= this.dato_cliente
	 encabezado_pedido['codus1'] = this.usuario;
	 encabezado_pedido['codemp'] = this.empresa;
	 encabezado_pedido['email'] = this.email_cliente;
	 // encabezado_pedido['fectra'] = this.fectra
	 
	// if (this.fectra == this.jstoday){
		// encabezado_pedido['fectra'] = this.fectra
	// }else{
		encabezado_pedido['fectra'] = formatDate(this.fectra['value'], 'yyyy-MM-dd', 'en-US', '-0500');
	// }
	 encabezado_pedido['codven'] = this.vendedor
	 encabezado_pedido['totnet'] = this.redondear(this.subtotal)
	 encabezado_pedido['iva_cantidad'] = this.redondear(this.iva_cant_new)
	 encabezado_pedido['iva_pctje'] = this.iva_porcentaje
	 encabezado_pedido['observ']  = this.observacion_pedido
	 encabezado_pedido['estado']  = 'I'
	 encabezado_pedido['cod_secuencia']  = 'VC_PED' 
	 encabezado_pedido['tiptra']  = '1' 
	 encabezado_pedido['rz'] = this.razon_social.trim()
	 encabezado_pedido['especialidad'] = this.especialidad
	 
	 
	 
	 if (!encabezado_pedido['email']) {
		 encabezado_pedido['email'] = null
	 }
	 if (!this.ciudad) {
		 this.ciudad="NO DISPONIBLE"
	 }
	 encabezado_pedido['ciucli']  = this.ciudad

	let status_encabezado
	let numtra
	console.log (encabezado_pedido)
	console.log ("DATO CLIENTE")
	console.log (this.dato_cliente)
	
	
	console.log("ENTRO A GENERAR EL PEDIDO")
	this.srv.generar_pedido_medico(encabezado_pedido).subscribe(
		data => {
			status_encabezado= data['status']
			numtra= data['numtra']
			console.log(data)
			if (status_encabezado == 'INSERTADO CON EXITO'){
				console.log('SE CREAN LOS RENGLONES')
				let renglones_pedido
				let numren = 1
				var longitud_renglones = this.articulos_pedido.length
				var contador_proceso = 0
				
					for (renglones_pedido of this.articulos_pedido) {
					renglones_pedido['numren'] = numren++
					renglones_pedido['numite'] = numren++
					renglones_pedido['numtra'] = numtra
					renglones_pedido['codemp']= this.empresa
					renglones_pedido['tiptra']  = '1'
					
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_renglones_pedido_medico(renglones_pedido).subscribe(
						result => {
								console.log(result)
								console.log("####  CONTADOR PROCESO INICIO #####")
								contador_proceso++
								console.log(contador_proceso)
								  let datos = {};
								  datos['usuario'] = this.usuario;
								  datos['empresa'] = this.empresa;
								  datos['pedido'] = 'success'
								  
								  		// let datos = {}
										// datos['pedido'] = numtra;	
										// datos['usuario'] = this.usuario;
										// datos['empresa'] = this.empresa;
								  console.log(datos)
								    if (contador_proceso == longitud_renglones){
										// alert ("Orden de facturación registrada con EXITO...!!!!")
										//###### SE VALIDA SI ESTA CONFIGURADO EL ENVIO DE CORREO DE LOS PEDIDOS  ########
										// if (this.srv.getConfCorreoPedCli() == 'SI'){
											// this.correo_pedido(numtra,this.email_cliente)
										// }
										
										this.router.navigate(['/admin/lista_ped_medicos', datos]);
										// this.router.navigate(['/admin/admin_pedidos_medicos', datos]);
									}

								},
						error => {
									console.error(error)
								}
						

						)
					}//FIN RECORRIDO RENGLONES PEDIDOS
				
			
			
			
					}
			
			
			
			
				}
	
			); 
	}else {
			
			alert("Por favor llenar el campo Datos del cliente/Artículos del pedido/Correo electrónico..!!!")
		}
	
	}//FIN GENERA PEDIDO
	
	
	
	actualizar_pedido() {


	console.log (this.fecha_entrega)
	console.log (this.fecha_entrega['value'])
	// console.log (formatDate(this.fecha_entrega['value'], 'yyyy-MM-dd', 'en-US', '-0500'))
	let fecha_entrega = formatDate(this.fecha_entrega['value'], 'yyyy-MM-dd', 'en-US', '-0500')
	let fecha_entrega_msg = formatDate(this.fecha_entrega['value'], 'dd-MM-yyyy', 'en-US', '-0500')
	console.log (fecha_entrega);

	// ### Obtener fecha de día de mañana para validacion
	var newdate = new Date();
	newdate.setDate(newdate.getDate() +1 ); //
	var nd = new Date(newdate);
	// alert('the new date is ' + nd);
	var nd_manana_formateado = formatDate(nd, 'yyyy-MM-dd', 'en-US', '-0500')



	   
	 console.log ("ACTUALIZAR PEDIDO")
	
	console.log ("DATOS CLIENTE")
	console.log (this.dato_cliente)
	
	console.log ("ARTICULOS PEDIDO")
	console.log (this.articulos_pedido.length)
	
	
	// if ((this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.email_cliente) ){
	if ((this.dato_cliente) && (this.articulos_pedido.length > 0)){

	 let encabezado_pedido= this.dato_cliente
	 encabezado_pedido['codus1'] = this.usuario;
	 encabezado_pedido['codemp'] = this.empresa;
	 encabezado_pedido['email'] = this.email_cliente;
	 // encabezado_pedido['fectra'] = this.fectra
	 
	// if (this.fectra == this.jstoday){
		// encabezado_pedido['fectra'] = this.fectra
	// }else{
		console.log (this.fectra)
		encabezado_pedido['fectra'] = formatDate(this.fectra['value'], 'yyyy-MM-dd', 'en-US', '-0500');
		encabezado_pedido['fecult'] = formatDate(this.jstoday, 'yyyy-MM-dd', 'en-US', '-0500');
	// }
	 encabezado_pedido['codven'] = this.vendedor
	 encabezado_pedido['totnet'] = this.redondear(this.subtotal)
	 encabezado_pedido['iva_cantidad'] = this.redondear(this.iva_cant_new)
	 encabezado_pedido['iva_pctje'] = this.iva_porcentaje
	 encabezado_pedido['observ']  = this.observacion_pedido
	 encabezado_pedido['estado']  = 'I'
	 encabezado_pedido['cod_secuencia']  = 'VC_PED' 
	 encabezado_pedido['tiptra']  = '1' 
	 encabezado_pedido['numtra']  = this.numtra
	 
	 
	 if (!encabezado_pedido['email']) {
		 encabezado_pedido['email'] = null
	 }
	 if (!this.ciudad) {
		 this.ciudad="NO DISPONIBLE"
	 }
	 encabezado_pedido['ciucli']  = this.ciudad

	let status_encabezado
	let numtra
	console.log (encabezado_pedido)
	console.log ("DATO CLIENTE")
	console.log (this.dato_cliente)
	console.log ("NUMTRA")
	console.log (this.numtra)
	
	
	console.log("ENTRO A GENERAR EL PEDIDO")
	this.srv.actualizar_encabezado_pedido(encabezado_pedido).subscribe(
		data => {
			status_encabezado= data['status']
			console.log(data)
			if (status_encabezado == 'ACTUALIZADO CON EXITO'){
				console.log('SE CREAN LOS RENGLONES')
				let renglones_pedido
				let numren = 1
				var longitud_renglones = this.articulos_pedido.length
				var contador_proceso = 0
				
					for (renglones_pedido of this.articulos_pedido) {
					renglones_pedido['numren'] = numren++
					renglones_pedido['numite'] = numren++
					renglones_pedido['numtra'] = this.numtra
					renglones_pedido['codemp']= this.empresa
					renglones_pedido['tiptra']  = '1'
					
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_renglones_pedido(renglones_pedido).subscribe(
						result => {
								console.log(result)
								console.log("####  CONTADOR PROCESO INICIO #####")
								contador_proceso++
								console.log(contador_proceso)
								  let datos = {};
								  datos['usuario'] = this.usuario;
								  datos['empresa'] = this.empresa;
								  datos['pedido'] = 'success_act'
								  console.log(datos)
								  
								 if (contador_proceso == longitud_renglones){
										alert ("Orden de facturación actualizada con EXITO...!!!!")

									}


								},
						error => {
									console.error(error)
								}
						

						)
					}//FIN RECORRIDO RENGLONES PEDIDOS
				
			
			
			
					}
			
			
			
			
				}
	
			); 
	}else {
			
			alert("Por favor llenar el campo Datos del cliente/Artículos del pedido/Correo electrónico..!!!")
		}
	
	}//FIN GENERA PEDIDO
	
	enviar_orden_facturacion() {
		console.log("CAMBIAR ESTATUS A EMITIDO")
		console.log (this.numtra)
		if (confirm("Está seguro de enviar esta orden a FACTURACION.?? NO PODRÁ EDITARLA LUEGO DE ACEPTAR")){

			const datos = {};
			datos['empresa'] = this.empresa;
			datos['usuario'] = this.usuario;
			datos['numtra'] = this.numtra

			
			this.srv.enviar_orden_facturacion(datos).subscribe(
				data => {
					console.log(data)
					alert("Orden enviada a Facturación con EXITO...!!!!!")
					this.router.navigate(['/admin/lista_ped_medicos', datos]);
				}
			)	
		}


	}//FIN ENVIO CORREO PEDIDO
	
	
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
	  this.observacion_pedido = null
	  this.vendedor = '01'

  this.tipo_busqueda = false
  this.exist_articulo = false;
  this.exist_razon_social = false;
  this.check_agencia = false
  this.val_exist_ppal = true
  this.val_exist_sucursal = true
  this.edit_dir_agencia_ppal = false
  this.habilitar_crear_nueva_sucursal = false
	

	}//FIN ENVIO CORREO PEDIDO
	
	public validaEnter(event: any) {
		
    if(event.key !== "Enter"){
      return true;
     }
     return false;        
	}
	
	
	public switchtab(){
		console.log("***** cambiar pestaña*****")

		 this.facturacion.nativeElement.classList.remove("active")
		 this.crear_cliente.nativeElement.classList.add("active")
		 this.tab_facturacion.nativeElement.classList.remove("active")
		 this.tab_crear_cliente.nativeElement.classList.add("active")

	}
	
    guardar_paciente() {
		console.log("CAMBIAR ESTATUS A EMITIDO")
		console.log (this.numtra)

		let datos = {};
		datos['rucced'] = this.rucced_paciente;
		datos['tpIdCliente'] = this.tipo_doc_paciente;
		datos['codemp'] = this.empresa;
		datos['codus1'] = this.usuario;
		datos['nomcli'] = this.nomcli_paciente;
		datos['apecli'] = this.apecli;
		datos['num_historia'] = this.num_historia;
		datos['fecha_nacimiento'] = this.fecha_nacimiento;
		datos['fectra'] = formatDate(this.fectra['value'], 'yyyy-MM-dd', 'en-US', '-0500');


		if (this.validar_campos_obligatorios(datos) && this.validar_longitud_cedula_ruc(datos)){
			this.srv.crear_paciente(datos).subscribe(
				data => {
					console.log(data)
					
					if (data['STATUS'] == 'EXITOSO'){
						alert("Paciente creado con EXITO...!!!!!")
					}
					if (data['STATUS'] == 'DUPLICADO'){
						alert("DUPLICADO..!!! Paciente ya existe en el Sistema")
					}
					

				}
			)	
		}
	
	
	}//FIN GUARDAR PACIENTE
	
	validar_campos_obligatorios (datos){
		console.log("VALIDANDO CAMPOS OBLIGATORIOS")
		// console.log(datos['nomcli'])
		// console.log(datos['rucced'])
		// console.log(datos['tpIdCliente'])
		// console.log(datos['ciucli'])
		let STATUS_OBLIGATORIO = true
		if ((!datos['nomcli']) || (datos['nomcli'].length == 0)){
			alert("Nombre vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}
		else if ((!datos['apecli']) || (datos['apecli'].length == 0)){
			alert("Apellido vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}
		else if (((!datos['rucced']) || (datos['rucced'].length == 0) ) && (datos['tpIdCliente'] != 'X')){
			alert("Número de Identificacion vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}
		else if ((!datos['tpIdCliente']) || (datos['tpIdCliente'] == 'N')){
			alert("Tipo de Identificacion no seleccionado. Por favor seleccione CEDULA/RUC/PASAPORTE según el caso.")
			STATUS_OBLIGATORIO = false
		}
		else if ((!datos['num_historia']) || (datos['num_historia'].length == 0)){
			alert("Número de historia vacia. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}
		else if ((!datos['fecha_nacimiento']) || (datos['fecha_nacimiento'].length == 0)){
			alert("Fecha Nacimiento incompleta. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}
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

	
	
	
	
	
  
  
}
