import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {NgxImageCompressService} from 'ngx-image-compress';
// import * as $ from "jquery";

import 'round-slider';
// import 'round-slider';




declare const navigator: any;
declare const MediaRecorder: any;
// declare var MediaRecorder: any;

declare var AdminLTE: any;
// declare var $: any;
declare const $: any;


@Component({
  selector: 'app-admin-taller-orden',
  templateUrl: './admin-taller-orden.component.html',
  styleUrls: ['./admin-taller-orden.component.css']
})




	

export class AdminOrdenTallerComponent implements OnInit {
	
	  public isRecording: boolean = false;
  private chunks: any = [];
  private mediaRecorder: any;
	// mediaRecorder:any;
	// chunks = [];
	
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
	public pais_lista:any = [];
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
	fectra = '';
	// public date : string;
	// clientes;
	usuario = ''
	empresa = ''
	ruc = '';
	patron_articulo = '';
	cantidad_nueva = '';
	ciudad
	pais
	vendedor

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
	
	
	@ViewChild('datos_orden') datos_orden: ElementRef;
	 @ViewChild('datos_vehiculo') datos_vehiculo: ElementRef;
	  @ViewChild('datos_detalle_vehiculo') datos_detalle_vehiculo: ElementRef;
	  @ViewChild('fotos_vehiculo') fotos_vehiculo: ElementRef;
	  @ViewChild('audio_orden') audio_orden: ElementRef;
	 @ViewChild('tab_datos_orden') tab_datos_orden: ElementRef;
	 @ViewChild('tab_datos_vehiculo') tab_datos_vehiculo: ElementRef;
	 @ViewChild('tab_datos_detalle_vehiculo') tab_datos_detalle_vehiculo: ElementRef;
	 @ViewChild('tab_fotos_vehiculo') tab_fotos_vehiculo: ElementRef;
	 @ViewChild('tab_audio_orden') tab_audio_orden: ElementRef;
	
	
	// SELECT * FROM "DBA"."detalle_vehiculo"----EXTINTOR, ACCESORIROS
	// SELECT * FROM "DBA"."adicionales"------MARCA MODELO AÑO DEL CARRO
	// SELECT * FROM "DBA"."mapa_vehiculo"------MAPA VEHICULO
	

  
  public tipo_doc_lista = [
			{"tipo": "C", "nom_doc": "CEDULA"},
			{"tipo": "R", "nom_doc": "RUC"},
			{"tipo": "P", "nom_doc": "PASAPORTE"}
		];
  tipo_doc
  
  public tipo_combustible_lista = [
			{"combustible": "GASOLINA"},
			{"combustible": "DIESEL"},
			{"combustible": "ELECTRICO"},
			{"combustible": "HIBRIDO"}
		];
		
  public tipo_orden_lista = [
			{"tipo": "P", "nom_orden": "PREVENTIVO"},
			{"tipo": "C", "nom_orden": "CORRECTIVO"},
			{"tipo": "H", "nom_orden": "CHOQUE"}
		];
		
  tipo_orden = 'P'
  
 public ruta_lista = [
			{"tipo": "T", "nom_ruta": "TROLE"},
			{"tipo": "C", "nom_ruta": "CONVENIO"},
			{"tipo": "M", "nom_ruta": "MICROS"}
		];
		
  ruta = 'T'
  
  // public status_lista = [
			// {"status": "I", "status_nombre": "INICIADA"},
			// {"status": "P", "status_nombre": "EMITIDO"},
			// {"status": "S", "status_nombre": "PROCESADO"},
			// {"status": "F", "status_nombre": "FACTURADO"},
			// {"status": "E", "status_nombre": "EN ESPERA"},
			// {"status": "C", "status_nombre": "COMPRADA"}
		// ];
  
 public status_lista = [
			{"status": "I", "status_nombre": "INICIADA"},
			{"status": "P", "status_nombre": "EMITIDO"}
		];
  status = 'I'

  
  ///////VARIABLE PARA SUBIDA DE FOTOS ///////////
  progress: number = 0;
  subida_exitosa = false
  uploadedFiles: Array < File > ;
  nombre_archivo = 'Seleccione archivo';
  localUrl: any;
  imageFile:any
  // AudioFile:any
  formData:any
  loading: boolean;
  sizeOfOriginalImage
  imgResultAfterCompress
  localCompressedURl
  sizeOFCompressedImage
  fotos
  audios
  /////// FIN VARIABLES SUBIDAS DE FOTOS///////////
  ///////INICIO VARIABLES PARA ACTUALIZAR ORDEN///////////
  numtra
  fecult_new
  
   ///////DETALLE VEHICULO///////////
	antena = false
	llave_rueda = false
	gata = false
	tapagas = false
	matricula = false
	encendedor = false
	plumas = false
	tuerca = false
	botiquin = false
	cubresol =false
	llanta = false
	espejos = false
	compac = false
	emblemas = false
	alarma = false
	radio = false
	herramientas = false
	combustible = false
	cont_puerta = false
	tapacubos = false
	moquetas = false
	extinguidor = false
	triangulos = false
	alogenos = false
	pantalla_radio = false
///////FIN DETALLE VEHICULO///////////

   ///////DATOS VEHICULO///////////
	marca
	modelo
	anio = '2000'
	placa
	num_matricula 
	color
	pais_origen
	km_recorrido
	tipo_combustible
	sn_motor
	sn_chassis
	cilindraje
	ram
	clase
	subclase
	num_pasajeros = '5'

	///////FIN DATOS VEHICULO///////////
	
	tab_habilitar_datos_orden
	hora_ingreso
	nivel_combustible = 0
	
	// location.reload()
	
	// const HOLA = 'Holamundo'
	
	 // onSuccess = stream => {
		// console.log ("####### ONSUCESS AUDIO #####")
		// this.mediaRecorder = new MediaRecorder(stream);
     
		// this.mediaRecorder.onstop = e => {
			// const audio = new Audio();
			// console.log ("##### AUDIO ####") 
			// console.log (audio) 
			// const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
			// this.chunks.length = 0;
			// audio.src = window.URL.createObjectURL(blob);
			
			// // this.nombre_archivo = 'audio_'+(Math.floor(Math.random() * 100000) + 1)+'.ogg'
			// this.nombre_archivo = 'audio_'+formatDate(Date(), 'yyyyMMdd_hhmmss', 'en-US', '-0500')+'.ogg'
			// this.imageFile = new File([blob], this.nombre_archivo, { type: 'audio/ogg; codecs=opus' });
			// console.log (this.imageFile)
			// this.uploadedFiles = this.imageFile
			
			// this.upload()
	
        // // audio.load();
		// // console.log ("####### GUARDANDO SONIDO #####")
		// // console.log(audio.src)
		
        // // audio.play();
      // };
		// console.log ("####### ondataavailable AUDIO #####")
      // this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
    // };

	constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute,
  private imageCompress: NgxImageCompressService
  ) 
  
  {
	  
	this.route.params.subscribe( val => {
	if (!this.srv.isLoggedIn()){
	this.router.navigateByUrl('/')};
	
	this.route.queryParams.subscribe(params => {
		console.log(params)
		// location.reload()
        // Defaults to 0 if no query param provided.
        // this.ruc = +params['ruc'] || 0;
		this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
		this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
		this.numtra = params['numtra'] || this.route.snapshot.paramMap.get('numtra') || 0;
		console.log("LUEGO DE ENTRADA")
		if (this.numtra == 0){
			this.reload_orden_nueva()
		}else {
			this.reload_orden()
		}
      });
	
	console.log(this.usuario)
	console.log(this.empresa)
	console.log(this.numtra)
	


	// // this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	// this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	// this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	// console.log (this.jstoday)
	// console.log (this.fectra)
	// this.fecult_new = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	// // this.fecha_entrega = this.fectra
	// // this.fecha_entrega = new FormControl(new Date())
	// // let serializedDate = new FormControl((new Date()).toISOString());
	// console.log (this.today)
	// console.log (this.fecha_entrega)
	// // console.log (serializedDate)
	
	

		 
		 }
		); //FIN ROUTING
		
		const onSuccess = stream => {
		console.log ("####### ONSUCESS AUDIO #####")
		this.mediaRecorder = new MediaRecorder(stream);
     
		this.mediaRecorder.onstop = e => {
			const audio = new Audio();
			console.log ("##### AUDIO ####") 
			console.log (audio) 
			const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
			this.chunks.length = 0;
			audio.src = window.URL.createObjectURL(blob);
			
			// this.nombre_archivo = 'audio_'+(Math.floor(Math.random() * 100000) + 1)+'.ogg'
			this.nombre_archivo = 'audio_'+formatDate(Date(), 'yyyyMMdd_hhmmss', 'en-US', '-0500')+'.ogg'
			this.imageFile = new File([blob], this.nombre_archivo, { type: 'audio/ogg; codecs=opus' });
			console.log (this.imageFile)
			this.uploadedFiles = this.imageFile
			
			this.upload()
	
        // audio.load();
		// console.log ("####### GUARDANDO SONIDO #####")
		// console.log(audio.src)
		
        // audio.play();
      };
		console.log ("####### ondataavailable AUDIO #####")
      this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
    };
	
	
	    // navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		// navigator.getUserMedia({ audio: true }, onSuccess, e => console.log(e));

	console.log ("####### getUserMedia AUDIO #####")
 
  }//FIN CONSTRUCTOR
  

   ngOnInit() {
   
     
	   
	   

	   
	   
	   
		AdminLTE.init();
	}
	
  public mostrar_slider (){
    (<any>$("#handle1")).roundSlider({
		
		// CLASICO
			// value: 45
		
		// SEMICIRCULO AZUL
		    // radius: 80,
			// width: 30,
			// circleShape: "half-top",
			// sliderType: "min-range",
			// showTooltip: false,
			// handleSize: 0,
			// value: this.nivel_combustible,
			// tooltipFormat: "changeTooltip",
			
		// VELOCIMETRO ROJO
		    // sliderType: "min-range",
			// editableTooltip: false,
			// radius: 105,
			// width: 50,
			// value: this.nivel_combustible,
			// handleSize: 10,
			// handleShape: "square",
			// circleShape: "pie",
			// startAngle: 315,
			// tooltipFormat: "changeTooltip",
			
			
			sliderType: "min-range",
			editableTooltip: false,
			radius: 105,
			width: 45,
			value: this.nivel_combustible,
			handleSize: 10,
			handleShape: "square",
			circleShape: "half-top",
			startAngle: 0,
			tooltipFormat: "changeTooltip",
			
			update: e => {
				this.setVal(e.value);
			  },
			  valueChange: function(e) {
				// console.log(e.value);
				this.nivel_combustible = e.value;
			  }
		});
  
  
  }
  public setVal(value) {
    this.nivel_combustible = value;
  }
	
  public record() {



    this.isRecording = true;
    this.mediaRecorder.start();
  }

  public stop() {
    this.isRecording = false;
	this.loading = true
	this.mediaRecorder.stop();
  }
	
	// ######## RELOAD ORDEN NUEVA   ##########
	
	public reload_orden_nueva(){
		this.tab_habilitar_datos_orden=false
		window.scrollTo(0,0)
		this.reset()
	
	let datos = {};
	datos['codemp'] = this.empresa;		
	datos['usuario'] = this.usuario;	
	console.log (datos)
		//Variables originales  
	  this.tipo_busqueda = false
	  this.clientes = false;
	  this.exist_articulo = false;
	  this.exist_razon_social = false;
	  this.edit_cant = false;
	  this.masterSelected = false;
	  this.cantidad_nueva = '1';
	  this.cambiar_email = false;
	  this.status = 'I'
	  
	  
	this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	this.fecult_new = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.today)
	console.log (this.fecha_entrega)
	  
	  
	this.srv.vendedores(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO VENDEDORES")
		   console.log(data)
		   this.vendedores_lista = data
		   this.vendedor = "01"
		 });
		 
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
	
	this.srv.paises(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO PAISES")
		   console.log(data)
		   let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** DESCONOCIDO***"};
		   this.pais_lista = data
		   this.pais_lista.push(option_defecto_final)
		   console.log("PAIS LISTA")
		   console.log(this.pais_lista)
		});
		
	console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
	console.log (this.srv.getConfCorreoPedCli())			
	}
	
	//#################  CARGAR ORDEN PARA ACTUALIZAR ##################
	public reload_orden(){
	
	let datos = {};
	datos['codemp'] = this.empresa;
	datos['usuario'] = this.usuario;
	console.log (datos)
		//Variables originales  
	  this.tipo_busqueda = true
	  this.clientes = false;
	  this.exist_articulo = false;
	  this.exist_razon_social = false;
	  this.edit_cant = false;
	  this.masterSelected = false;
	  this.cantidad_nueva = '1';
	  this.cambiar_email = false;
	  
	  
	this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	this.fecult_new = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.today)
	console.log (this.fecha_entrega)
	  
	  
	this.srv.vendedores(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO VENDEDORES")
		   console.log(data)
		   this.vendedores_lista = data
		   this.vendedor = "01"
		 });
		 
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
		
	// this.reset()
	datos['numtra'] = this.numtra;	
	datos['usuario'] = this.usuario;
	this.buscar_encabezado_orden(datos);
	// this.buscar_renglones_orden(datos);
	this.lista_imagenes();
	this.lista_audios();
	this.get_detalle_vehiculo();
	this.get_datos_vehiculo();
	this.tab_habilitar_datos_orden=true
	
		
	this.srv.paises(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO PAISES")
		   console.log(data)
		   let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** DESCONOCIDO***"};
		   this.pais_lista = data
		   this.pais_lista.push(option_defecto_final)
		   console.log("PAIS LISTA")
		   console.log(this.pais_lista)
		});
	
	console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
	console.log (this.srv.getConfCorreoPedCli())

	
	}
	
	
	
	
	
	test_reenvio(){
		let datos = {}
		datos['usuario'] = this.usuario;
		datos['empresa'] = this.empresa;
		
		this.router.navigate(['/admin/taller_orden', datos]);
	}
	
	
	buscar_encabezado_orden(datos) {
		
	this.srv.get_encabezado_orden(datos).subscribe(
	   data => {
		   this.reset()
		   console.log ("ENCABEZADO_ORDEN")
		   console.log(data)
		   this.ruc = data['identificacion']
		   this.tipo_doc = data['tpIdCliente']
		   
		   	this.busca_cliente()
			this.observacion_pedido = data['observ']
			// this.update_observ_general(data['observ'])
			this.vendedor=data['codven']
			
			
			if ((data['ciucli']) && (data['ciucli'] != 'NO DISPONIBLE')){
				 // console.log (" ***ENCABEZADO_ORDEN CIUDAD **"+data['ciucli'].length)
				 // console.log (data['ciucli'])
				this.ciudad = data['ciucli']
			}else{
				this.ciudad = undefined
			}
	
		this.fectra = data['fectra']
		this.subtotal = data['totnet']
		this.iva_cant_new = data['iva_cantidad']
		this.total= data['total_pedido']
		this.tipo_orden = data['tipo_orden']
		this.ruta = data['ruta']
		this.hora_ingreso =  data['hora_ingreso'].replace('.000','')
		this.status = data['status']
		if (this.status=='I'){
		   this.tipo_busqueda = false
		}
		
		
	   let datos = {}
		datos['numtra'] = this.numtra;	
		datos['usuario'] = this.usuario;
		datos['codemp'] = this.empresa;
		
		this.buscar_renglones_orden(datos);
		
		
		   
		}); 

	}
	
	buscar_renglones_orden(datos) {
		let data_traduccion = {}
		
	this.srv.get_renglones_orden(datos).subscribe(
	   data => {
		   
		   

		   console.log ("****RENGLONES ORDEN *****")
		   console.log(data)
		   
	  this.articulos_pedido = []
	  let articulos_pedido_temporal = []
	  this.subtotal = 0	
	  this.iva_porcentaje = 0
	  this.iva_cant = 0
	  this.total = 0
		   
		for (let data_traduccion of data) {
			   console.log ("### RENGLON ###")
			   console.log(data_traduccion)
			// if (data_traduccion.num_docs == null){
			// console.log ("CONVIRTIENDO NULL EN ESPACION EN BLANCO")
			// data_traduccion.num_docs  = ''
			// }
			if (!data_traduccion.​​coduni){
			console.log ("CONVIRTIENDO NULL UNIDAD EN N/A")
			data_traduccion.​​coduni  = 'N/A'
			}
			   
			 let index_art 
			   if (articulos_pedido_temporal.length == 0){
					index_art = articulos_pedido_temporal.length
				}else {
					console.log (Math.max.apply(Math, articulos_pedido_temporal.map(function(o) { return o.index; })))
					index_art = (Math.max.apply(Math, articulos_pedido_temporal.map(function(o) { return o.index; })))+1
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
			
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			// this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			// this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			// this.exist_articulo = false;
			articulos_pedido_temporal.push(data_traduccion_renglon)
			

	
			
			
		   }
		    this.articulos_pedido = articulos_pedido_temporal
		   	this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			this.exist_articulo = false;
		   console.log ("### ARMADO TRADUCCION ARTICULO PEDIDO ###")
		   console.log (this.articulos_pedido)
		   
		   
		   	// console.log ("###### NIVEL DEL COMBUSTIBLE LUEGO DEL GET #######")
		// console.log (this.nivel_combustible)
		
		
		
		
		
		}); 

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
	if (this.ruc){
		const datos = {};
		datos['ruc'] = this.ruc;
		datos['codemp'] = this.empresa;
		datos['tpIdCliente'] = this.tipo_doc;
			this.srv.clientes(datos).subscribe(data => {
				// console.log(data)
			this.dato_cliente = data
			if (data['rucced']) {
				// console.log(data)
				// console.log(data['nomcli'])
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
	console.log("########## BUSCAR RAZON SOCIAL ##########")
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
	if (this.patron_articulo){
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		 console.log ("BUSCANDO SERVICIO")
		if (this.dato_cliente){
		
	    	datos['codcli']  = this.dato_cliente["codcli"];
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
				
				
			   }else {
				alert("Servicio no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
			   }
			  });
	    }else{
			alert ("Por favor seleccionar el cliente para luego ingresar el servicio")
		}
	 }else { 
	     alert("Por favor llene el campo servicio");
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
		console.log (value)
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
		// checked_json['observ'] = 'Puede agregar detalles del artículo';
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
	
		// if (confirm(msg_fecha)){
	 let encabezado_pedido= this.dato_cliente
	 encabezado_pedido['codus1'] = this.usuario;
	 encabezado_pedido['codemp'] = this.empresa;
	 encabezado_pedido['tiptra'] = 7
	 
	if (this.fectra == this.jstoday){
		encabezado_pedido['fectra'] = this.fectra
	}else{
		encabezado_pedido['fectra'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500');
	}
	 encabezado_pedido['codven'] = this.vendedor
	 encabezado_pedido['totnet'] = this.redondear(this.subtotal)
	 encabezado_pedido['iva_cantidad'] = this.redondear(this.iva_cant_new)
	 encabezado_pedido['iva_pctje'] = this.iva_porcentaje
	 encabezado_pedido['observ']  = this.observacion_pedido
	 encabezado_pedido['estado']  = 'I'
	 encabezado_pedido['cod_secuencia']  = 'VC_ORT' 
	 encabezado_pedido['tiptra']  = '7'
	 encabezado_pedido['tipo_orden']  = this.tipo_orden
	 
	 if (this.srv.getTipoRutaTalleres() == 'SI'){
	 encabezado_pedido['ruta']  = this.ruta
	 }else {
	 encabezado_pedido['ruta']  = null
	 }
	 
	 
	 if (!encabezado_pedido['email']) {
		 encabezado_pedido['email'] = this.email_cliente
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
	encabezado_pedido['codagencia'] = this.srv.getCodAgencia();
	
	
	console.log("ENTRO A GENERAR EL PEDIDO")
	this.srv.generar_pedido(encabezado_pedido).subscribe(
		data => {
			status_encabezado= data['status']
			numtra= data['numtra']
			console.log(data)
			if (status_encabezado == 'INSERTADO CON EXITO'){
				console.log('SE CREAN LOS RENGLONES')
				let renglones_pedido
				let numren = 1
				let numite = 1
				var longitud_renglones = this.articulos_pedido.length
				var contador_proceso = 0
				let array_renglones = []
				
					for (renglones_pedido of this.articulos_pedido) {
					  renglones_pedido['numren'] = numren++
					  renglones_pedido['numtra'] = numtra
					  renglones_pedido['codemp']= this.empresa
					  renglones_pedido['tiptra'] = 7
					  renglones_pedido['codagencia'] = this.srv.getCodAgencia();
				      renglones_pedido['fechahistorica'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500');
						if (renglones_pedido['codart'].indexOf("\\") != -1) { //if hay / en el codigo de articulo
							renglones_pedido['numite']= numite++
							
						}
						array_renglones.push(renglones_pedido) 
					}
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(array_renglones); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_renglones_talleres(array_renglones).subscribe(
						result => {
								console.log(result)
								console.log("####  CONTADOR PROCESO INICIO #####")
								contador_proceso++
								console.log(contador_proceso)
								  let datos = {};
								  // datos['usuario'] = this.usuario;
								  // datos['empresa'] = this.empresa;
								  // datos['pedido'] = 'success'
								  // console.log(datos)
								    // if (contador_proceso == longitud_renglones){
														
									//###### SE VALIDA SI ESTA CONFIGURADO EL ENVIO DE CORREO DE LOS PEDIDOS  ########
										if (this.srv.getConfCorreoPedCli() == 'SI'){
											this.correo_pedido(numtra,this.email_cliente)
										}
										
										alert ("ORDEN DE TRABAJO GUARDADA EXITOSAMENTE....!!!!")
										// this.ngOnInit();
										
										// this.router.navigate(['/admin/lista_ordenes', datos]);
										
										
										// let datos = {}
										datos['numtra'] = numtra;	
										datos['usuario'] = this.usuario;
										datos['empresa'] = this.empresa;
										datos['pedido'] = 'success'
										
										this.router.navigate(['/admin/taller_orden', datos]);
										
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
	   // } // FIN CONFIRMA FECHA DE ENTREGA
		
	}else {
			
			alert("Por favor llenar el campo Datos del cliente/Artículos del pedido/Correo electrónico..!!!")
		}
	
	}//FIN GENERA PEDIDO
	
	

	
	
	
   actualizar_pedido() { 
		console.log ("ACTUALIZAR PEDIDO")
	 
		// console.log (this.fecha_entrega_nueva)
		// console.log (this.fecha_entrega_original)
   
	 	 // console.log (this.fectra.replace( /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1"))
	 // let fectra_format = new Date(this.fectra)
	// console.log (fectra_format)
	
	// new Date( "13-01-2011" );
	
	if ((this.articulos_pedido.length > 0)){
	// if ((this.articulos_pedido.length > 0) && (this.email_cliente)){
	 let encabezado_pedido= {}
	 encabezado_pedido['numtra'] = this.numtra;
	 encabezado_pedido['codus1'] = this.usuario;
	 encabezado_pedido['codemp'] = this.empresa;
	 encabezado_pedido['fecult'] = this.fecult_new
	  encabezado_pedido['codven'] = this.vendedor

	 // if (this.edit_fecha_creacion){
		 // encabezado_pedido['fectra'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500')
	 // }else{
		 // console.log (this.fectra.replace( /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1"))
		 let fectra_format = this.fectra.replace( /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
		 console.log (fectra_format)
		 
	 encabezado_pedido['fectra'] = fectra_format
	 // }
	 encabezado_pedido['totnet'] = this.redondear(this.subtotal)
	 encabezado_pedido['iva_cantidad'] = this.redondear(this.iva_cant_new)
	 encabezado_pedido['observ']  = this.observacion_pedido
	 encabezado_pedido['codcli']  = this.dato_cliente['codcli']
	 if (!this.ciudad) {
		 this.ciudad="NO DISPONIBLE"
	 }
	 encabezado_pedido['ciucli']  = this.ciudad
	 encabezado_pedido['tipo_orden']  = this.tipo_orden
	 encabezado_pedido['ruta']  = this.ruta
	 encabezado_pedido['estado']  = this.status
	
	
	console.log ("#### ENCABEZADO_PEDIDO ########")
	console.log (encabezado_pedido)
	let status_encabezado
	// let numtra
	// console.log (encabezado_pedido)
	// console.log ("DATO CLIENTE")
	// console.log (this.dato_cliente)
	
	
	// console.log("ENTRO A GENERAR EL PEDIDO")
	this.srv.actualizar_encabezado_orden(encabezado_pedido).subscribe(
		data => {
			status_encabezado= data['status']
			// numtra= data['numtra']
			console.log(data)
			if (status_encabezado == 'ACTUALIZADO CON EXITO'){
				console.log(' ###### SE ACTUALIZAN LOS RENGLONES ######')
				let renglones_pedido
				let numren = 1
				let numite = 1
				var longitud_renglones = this.articulos_pedido.length
				var contador_proceso = 0
				let array_renglones = []
				
					for (renglones_pedido of this.articulos_pedido) {
						renglones_pedido['numren'] = numren++
						renglones_pedido['numtra'] = this.numtra
						renglones_pedido['codemp'] = this.empresa
						renglones_pedido['estado'] = this.status
						renglones_pedido['fechahistorica'] = fectra_format
						renglones_pedido['horahistorica'] = this.hora_ingreso
						renglones_pedido['codagencia'] = this.srv.getCodAgencia();
						
						if (renglones_pedido['codart'].indexOf("\\") != -1) { //if hay / en el codigo de articulo
							renglones_pedido['numite']= numite++
							
						}
						array_renglones.push(renglones_pedido)
					}//FIN RECORRIDO RENGLONES PEDIDOS

					
					
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(array_renglones); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.actualizar_renglones_orden(array_renglones).subscribe(
						result => {
								console.log("####  CONTADOR PROCESO INICIO #####")
								contador_proceso++
								console.log(contador_proceso)
								console.log(result)
								  let datos = {};
								  datos['usuario'] = this.usuario;
								  datos['empresa'] = this.empresa;
								  datos['numtra'] = this.numtra;
								  console.log(datos)
								  
								  console.log("####  CONTADOR PROCESO #####")
								  console.log(contador_proceso)
								   // console.log("####  LONGITUD PROCESO #####")
								  // console.log(longitud_renglones)
								  // if (contador_proceso == longitud_renglones){
											
									if (this.srv.getConfCorreoPedCli() == 'SI'){
											  console.log("### HABILITADO CORREO###")
										  	  this.correo_pedido(this.numtra,this.email_cliente)
										  
									  }
									  alert ("ORDEN DE TRABAJO GUARDADA EXITOSAMENTE....!!!!")
									  // this.router.navigate(['/admin/taller_orden', datos]);
									// this.router.navigate(['/admin/lista_ordenes', datos]);
								  
								  
								  // }

								},
						error => {
									console.error(error)
								}
						

						)

				
			
			
			
				} //FIN ACTUALIZADO ENCABEZADO EXITOSO
			
			
			
			
				}
	
			); 
		
	}else {
			
			alert("Por favor llenar el campo Artículos del pedido/Correo electrónico..!!!")
		}
	
	}//FIN ACTUALIZAR PEDIDO
	
	correo_pedido(numtra,email) {
		console.log("CORREO FACTURACION")
		console.log (numtra)
		console.log (email)
		// alert("Por favor ingrese RUC del cliente");

			const datos = {};
			datos['codemp'] = this.empresa;
			datos['usuario'] = this.usuario;
			datos['num_ped'] = numtra
			datos['asunto'] = 'orden_trabajo'
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
	  this.cantidad_nueva = '';
	  this.cambiar_email = false;
	  this.razon_social = undefined
	  this.email_cliente = undefined
	  this.ciudad = undefined
	  this.articulo = []
	  this.articulos_pedido = []
	  this.subtotal = 0	
	  this.iva_porcentaje = 0
	  this.iva_cant = 0
	  this.total = 0
	  this.observacion_pedido = null
	  this.dato_cliente = undefined
	  this.tipo_orden = 'P'
	  this.ruta = 'T'
	  this.status = undefined
	  this.nivel_combustible = 0


	

	}//FIN ENVIO CORREO PEDIDO
	
	
	
	
	
	// FUNCIONES PARA ADMINISTRAR FOTOS    ////
	
	lista_imagenes() {
		
		let datos_img= {}
		datos_img['dir'] = this.empresa+'_'+this.numtra
	  this.srv.lista_img(datos_img).subscribe(
	  data => {
		console.log ("#######  LISTA DE FOTOS   ##########")
		  console.log(data)
		  this.fotos = data

	  }

	  );
  }
  
  	lista_audios() {
		
		let datos_audio= {}
		datos_audio['dir'] = this.empresa+'_'+this.numtra
	  this.srv.lista_audios(datos_audio).subscribe(
	  data => {
		console.log ("#######  LISTA DE AUDIOS   ##########")
		  console.log(data)
		  this.audios = data

	  }

	  );
  }


	  fileChange(element) {
		this.loading = true
		this.subida_exitosa = false
		this.uploadedFiles = element.target.files;
		console.log ("ARCHIVO CARGADO")
		console.log (this.uploadedFiles)
		this.nombre_archivo = this.uploadedFiles[0].name
		var reader = new FileReader();
		console.log ("ARCHIVO COMPRESION")
		reader.onload = (element: any) => {
				this.localUrl = element.target.result;


				this.compressFile(this.localUrl,this.nombre_archivo)
			}
		console.log (element.target.files[0])
		// this.uploadedFiles = element.target.files[0];
		reader.readAsDataURL(element.target.files[0]);

	  }

  	compressFile(image,fileName) {
				console.log ("INICIO COMPRIMIR ARCHIVO")
		console.log (image)
		console.log (fileName)

		var orientation = -1;
		this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);

		console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);

		this.imageCompress.compressFile(image, orientation, 50, 50).then(
		result => {
			this.imgResultAfterCompress = result;
			this.localCompressedURl = result;
			this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
			console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);// create file from byte
			const imageName = fileName;
			console.log (result)
			// call method that creates a blob from dataUri
			const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
			//imageFile created below is the new compressed file which can be send to API in form data
			// const imageFile = new File([result], imageName, { type: 'image/jpeg' });
			this.imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
			console.log ("imageFile")
			console.log (this.imageFile)
			this.uploadedFiles = this.imageFile
			this.loading = false



		}
		);

	}



  	dataURItoBlob(dataURI) {
		const byteString = window.atob(dataURI);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const int8Array = new Uint8Array(arrayBuffer);for (let i = 0; i < byteString.length; i++) {
		int8Array[i] = byteString.charCodeAt(i);
		}const blob = new Blob([int8Array], { type: 'image/jpeg' });
		return blob;
	}







  upload() {
	  	console.log ("##### UPLOAD #######")
	console.log (this.uploadedFiles)
	console.log (this.nombre_archivo)
	  this.subida_exitosa = false
    this.formData = new FormData();
	this.formData.append("uploads", this.uploadedFiles, this.nombre_archivo);
	this.formData.append("dir",this.empresa+"_"+this.numtra);
	this.loading = true

	
	console.log ("#### FORMDATA  #####")
	console.log (this.formData)
	// this.progress = 10
	let loading_subida = false
  
	this.srv.uploadFile(this.formData).subscribe(
	(event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('Archivo subido con exito!!!!', event.body);
		  	  this.lista_imagenes();
			  loading_subida = true;
			  
			  
			  
          setTimeout(() => {
            this.progress = 0;
			this.subida_exitosa = true
			this.imageFile = false
			this.nombre_archivo = 'Seleccione archivo'
			this.lista_audios();
			this.loading = false

          }, 1500);


      }
    });
	

	
	
	
	
	
	}

	eliminar_imagen(nombre) {

		let datos = {};
		datos['nombre']  = nombre;
		datos['dir'] = this.empresa+'_'+this.numtra
		datos['codemp'] = this.empresa
		datos['numtra'] = this.numtra
		// let datos_img= {}

	this.srv.eliminar_imagen(datos).subscribe((res)=> {
      console.log('response received is ', res);
	   // console.log(res['resultado']);

	  // if (res['resultado'] == 'Archivo subido exitosamente'){
		  // this.subida_exitosa = true
	  // }
	  	 this.lista_imagenes();
	});


	}
	
	eliminar_audio(nombre) {
		
		if (confirm("Esta seguro de eliminar este audio ???")){

			let datos = {};
			datos['nombre']  = nombre;
			datos['dir'] = this.empresa+'_'+this.numtra
			// let datos_img= {}

		this.srv.eliminar_audio(datos).subscribe((res)=> {
		  console.log('response received is ', res);
		   // console.log(res['resultado']);

		  // if (res['resultado'] == 'Archivo subido exitosamente'){
			  // this.subida_exitosa = true
		  // }
			 this.lista_audios();
			});
		}


	}
	
	reset_detalle_vehiculo(){
		   ///////DETALLE VEHICULO///////////
	this.antena = false
	this.llave_rueda = false
	this.gata = false
	this.tapagas = false
	this.matricula = false
	this.encendedor = false
	this.plumas = false
	this.tuerca = false
	this.botiquin = false
	this.cubresol =false
	this.llanta = false
	this.espejos = false
	this.compac = false
	this.emblemas = false
	this.alarma = false
	this.radio = false
	this.herramientas = false
	this.combustible = false
	this.cont_puerta = false
	this.tapacubos = false
	this.moquetas = false
	this.extinguidor = false
	this.triangulos = false
	this.alogenos = false
	this.pantalla_radio = false
///////FIN DETALLE VEHICULO///////////
		
		
		
		
	}
	
	get_detalle_vehiculo(){
		let datos = {};
		datos['codemp'] = this.empresa;
		datos['numtra'] = this.numtra;
		
	
		
		
		
		this.srv.get_detalle_vehiculo(datos).subscribe((data)=> {
      console.log( data);
	  // this.antena = true ?
	  data['antena'] == 1 ? this.antena = true : this.antena = false
	  data['llave_ruedas'] == 1 ? this.llave_rueda = true : this.llave_rueda = false
	  data['gata'] == 1 ? this.gata = true : this.gata = false
	  data['tapagas'] == 1 ? this.tapagas = true : this.tapagas = false
	  data['matricula'] == 1 ? this.matricula = true : this.matricula = false
	  data['encendedor'] == 1 ? this.encendedor = true : this.encendedor = false 
	  data['plumas'] == 1 ? this.plumas = true : this.plumas = false 
	  data['botiquin'] == 1 ? this.botiquin = true : this.botiquin = false 
	  data['cubresol'] == 1 ? this.cubresol = true : this.cubresol = false 
	  data['llanta'] == 1 ? this.llanta = true : this.llanta = false 
	  data['espejos'] == 1 ? this.espejos = true : this.espejos = false 
	  data['compac'] == 1 ? this.compac = true : this.compac = false 
	  data['alarma'] == 1 ? this.alarma = true : this.alarma = false 
	  data['radio'] == 1 ? this.radio = true : this.radio = false 
	  data['herram'] == 1 ? this.herramientas = true : this.herramientas = false 
	  data['combustible'] == 1 ? this.combustible = true : this.combustible = false 
	  data['tapacubos'] == 1 ? this.tapacubos = true : this.tapacubos = false 
	  data['moquetas'] == 1 ? this.moquetas = true : this.moquetas = false 
	  data['extinguidor'] == 1 ? this.extinguidor = true : this.extinguidor = false 
	  data['triangulos'] == 1 ? this.triangulos = true : this.triangulos = false 
	  data['alogenos'] == 1 ? this.alogenos = true : this.alogenos = false 
	  data['pantallaradio'] == 1 ? this.pantalla_radio = true : this.pantalla_radio = false 
	  data['seguro_aros'] == 1 ? this.tuerca = true : this.tuerca = false 
	  data['signos'] == 1 ? this.emblemas = true : this.emblemas = false
	  data['controlpuerta'] == 1 ? this.cont_puerta = true : this.cont_puerta = false 	  
	   // console.log(res['resultado']);

	  // if (res['resultado'] == 'Archivo subido exitosamente'){
		  // this.subida_exitosa = true
	  // }
	  	 // this.lista_imagenes();
	});
		
	}
	
	guardar_detalle_vehiculo(){
	
		let datos = {};
		datos['antena']  = this.antena;
		datos['llave_ruedas']  = this.llave_rueda;
		datos['gata']  = this.gata;
		datos['tapagas']  = this.tapagas;
		datos['matricula']  = this.matricula;
		datos['encendedor']  = this.encendedor;
		datos['plumas']  = this.plumas;
		datos['botiquin'] = this.botiquin;
		datos['cubresol'] = this.cubresol;
		datos['llanta'] = this.llanta;
		datos['espejos'] = this.espejos;
		datos['compac'] = this.compac;
		datos['alarma'] = this.alarma;
		datos['radio'] = this.radio;
		datos['herram'] = this.herramientas;
		datos['combustible'] = this.combustible;
		datos['tapacubos']	= this.tapacubos;
		datos['moquetas'] =  this.moquetas;
		datos['extinguidor'] =	this.extinguidor;
		datos['triangulos'] = this.triangulos;
		datos['alogenos'] =	this.alogenos;
		datos['pantallaradio'] = this.pantalla_radio;
		datos['seguro_aros'] = this.tuerca ;
		datos['signos'] = this.emblemas;
		datos['controlpuerta'] = this.cont_puerta;
		datos['codemp'] = this.empresa;
		datos['numtra'] = this.numtra;

	this.srv.guardar_detalle_vehiculo(datos).subscribe((data)=> {
      console.log('RESULTADO GUARDADO ', data);
	  if (data['resultado'] == 'exitoso'){
		  alert ("Detalles guardado exitosamente")
	  }
	});

	}
	
	guardar_datos_vehiculo(){
	
		let datos = {};
		
		// data['antena'] == 1 ? this.antena = true : this.antena = false
		
		datos['marca'] = this.marca ? this.marca : this.marca=''
		// datos['marca'] = this.marca
		datos['modelo'] = this.modelo ? this.modelo : this.modelo=''
		datos['chasis'] =  this.sn_chassis ? this.sn_chassis : this.sn_chassis=''
		datos['motor'] = this.sn_motor ? this.sn_motor : this.sn_motor=''
		datos['color'] = this.color ? this.color : this.color=''
		datos['ano'] = this.anio ? this.anio : this.anio='2000'
		datos['ram'] = this.ram ? this.ram : this.ram=''
		datos['paisorigen'] = this.pais_origen ? this.pais_origen : this.pais_origen=''
		datos['combustible'] = this.tipo_combustible ? this.tipo_combustible : this.tipo_combustible=''
		datos['klm'] = this.km_recorrido ? this.km_recorrido : this.km_recorrido=''
		datos['cilindraje'] = this.cilindraje ? this.cilindraje : this.cilindraje=''
		datos['pasajeros'] = this.num_pasajeros ? this.num_pasajeros : this.num_pasajeros=''
		datos['clase'] = this.clase ? this.clase : this.clase=''
		datos['subclase'] =this.subclase ? this.subclase : this.subclase=''
		//placa
		datos['torque'] = this.placa ? this.placa : this.placa=''
		//matricula
		datos['caja'] = this.num_matricula  ? this.num_matricula : this.num_matricula=''
		datos['codemp'] = this.empresa
		datos['codart'] = this.numtra
		datos['t_combustible'] = this.nivel_combustible
		
		
		this.srv.guardar_datos_vehiculo(datos).subscribe((data)=> {
      // console.log('RESULTADO GUARDADO ', data);
			  if (data['resultado'] == 'exitoso'){
				  alert ("Datos guardado exitosamente")
			  }
			});

	}
	
	get_datos_vehiculo(){
		let datos = {};
		datos['codemp'] = this.empresa;
		datos['codart'] = this.numtra;

		this.srv.get_datos_vehiculo(datos).subscribe((data)=> {
			  console.log ("######### DATOS VEHICULO ##########")
			  console.log( data);
			  data["marca"] != undefined ? this.​marca = data["marca"] : this.marca = undefined
			  data["modelo"] != undefined ? this.modelo = data["modelo"] : this.modelo = undefined
			  data["ano"] != undefined ? this.anio = data["ano"] : this.anio = '2000'
			  data["torque"] != undefined ? this.placa = data["torque"] : this.placa = undefined
			  data["caja"] != undefined ? this.num_matricula = data["caja"] : this.num_matricula = undefined
			  data["color"] != undefined ? this.color = data["color"] : this.color = undefined
			  data["paisorigen"] != undefined ? this.pais_origen = data["paisorigen"] : this.pais_origen = undefined
			  data["klm"] != undefined ? this.km_recorrido = data["klm"] : this.km_recorrido = undefined
			  data["combustible"] != undefined ? this.tipo_combustible = data["combustible"] : this.tipo_combustible = undefined
			  data["motor"] != undefined ? this.sn_motor = data["motor"] : this.sn_motor = undefined
			  data["chasis"] != undefined ? this.sn_chassis = data["chasis"] : this.sn_chassis = undefined
			  data["cilindarje"] != undefined ? this.cilindraje = data["cilindarje"] : this.cilindraje = undefined
			  data["ram"] != undefined ? this.ram = data["ram"] : this.ram = undefined
			  data["clase"] != undefined ? this.clase = data["clase"] : this.clase = undefined
			  data["subclase"] != undefined ? this.subclase = data["subclase"] : this.subclase = undefined
			  data["pasajeros"] != undefined ? this.num_pasajeros = data["pasajeros"] : this.num_pasajeros = undefined
			  data["t_combustible"] != undefined ? this.nivel_combustible = Number(data["t_combustible"]) : this.nivel_combustible = 0
			  // this.nivel_combustible = 80
			  this.mostrar_slider()
			  // data["t_combustible"] != undefined ? this.nivel_combustible = Number(data["t_combustible"]) : this.nivel_combustible = 0
			   // console.log (data["modelo"])
			   
			   
		// (<any>$("#handle1")).roundSlider({
		
		// // VELOCIMETRO ROJO
		    // sliderType: "min-range",
			// editableTooltip: false,
			// radius: 105,
			// width: 16,
			// value: 80,
			// handleSize: 0,
			// handleShape: "square",
			// circleShape: "pie",
			// startAngle: 315,
			// tooltipFormat: "changeTooltip",
			// update: e => {
				// this.setVal(e.value);
			  // },
			  // valueChange: function(e) {
				// console.log(e.value);
				// this.nivel_combustible = e.value;
			  // }
		// });
	   

	  

	});
		
	}


	buscar_datos_vehiculo_placa(){
		let datos = {};
		datos['codemp'] = this.empresa;
		datos['codart'] = this.numtra;
		datos['torque'] = this.placa;

		this.srv.get_datos_vehiculo_placa(datos).subscribe((data)=> {
			  console.log ("######### DATOS VEHICULO ##########")
			  console.log( data);
			  
			  if (data['resultado'] != 'no hay detalles registrados'){
				  data["marca"] != undefined ? this.​marca = data["marca"] : this.marca = undefined
				  data["modelo"] != undefined ? this.modelo = data["modelo"] : this.modelo = undefined
				  data["ano"] != undefined ? this.anio = data["ano"] : this.anio = '2000'
				  data["torque"] != undefined ? this.placa = data["torque"] : this.placa = undefined
				  data["caja"] != undefined ? this.num_matricula = data["caja"] : this.num_matricula = undefined
				  data["color"] != undefined ? this.color = data["color"] : this.color = undefined
				  data["paisorigen"] != undefined ? this.pais_origen = data["paisorigen"] : this.pais_origen = undefined
				  // data["klm"] != undefined ? this.km_recorrido = data["klm"] : this.km_recorrido = undefined
				  data["combustible"] != undefined ? this.tipo_combustible = data["combustible"] : this.tipo_combustible = undefined
				  data["motor"] != undefined ? this.sn_motor = data["motor"] : this.sn_motor = undefined
				  data["chasis"] != undefined ? this.sn_chassis = data["chasis"] : this.sn_chassis = undefined
				  data["cilindarje"] != undefined ? this.cilindraje = data["cilindarje"] : this.cilindraje = undefined
				  data["ram"] != undefined ? this.ram = data["ram"] : this.ram = undefined
				  data["clase"] != undefined ? this.clase = data["clase"] : this.clase = undefined
				  data["subclase"] != undefined ? this.subclase = data["subclase"] : this.subclase = undefined
				  data["pasajeros"] != undefined ? this.num_pasajeros = data["pasajeros"] : this.num_pasajeros = undefined
			  
			  }else {
			      alert('PLACA NO REGISTRADA EN EL SISTEMA')
				  // this.placa = un
			  }
			 
			 // data["t_combustible"] != undefined ? this.nivel_combustible = Number(data["t_combustible"]) : this.nivel_combustible = 0
			  // this.mostrar_slider()
		});
		
	}
	
	
	
	
	
  
  
}
