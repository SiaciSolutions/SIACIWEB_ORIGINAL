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
import { BarcodeFormat } from '@zxing/library';


declare var AdminLTE: any;


@Component({
  selector: 'app-admin-conteo-articulos',
  templateUrl: './admin-conteo-articulos.component.html',
  styleUrls: ['./admin-conteo-articulos.component.css']
})



	

export class AdminConteoArticulosComponent implements OnInit {
	
	  parametros: {usuario: string, empresa: string};
	  

	
	 myControl = new FormControl();
	 myControl2 = new FormControl();
	filteredOptions: Observable<string[]>;
	filteredarticulo: Observable<string[]>;
	public proveedores : boolean;
	public exist_articulo : boolean;
	public exist_razon_social : boolean;
	public razon_social : string;
	public email_proveedor : string;
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
	public observacion_pedido = ''
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
	
	// scan = false
	// scan_result = false
	scan_value
	scan_patron_articulo = false
	scan_valor_serie = false
	
	patron_orden_prod = null
	exist_orden_produccion
	lista_orden_produccion_pendientes
	
	loading_modulo = false

	
	
	jstoday = '';
	fectra = '';
	// public date : string;
	// proveedores;
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
	
	// hideModalscanner = false
	
	
	@ViewChild('datos_orden') datos_orden: ElementRef;
	 @ViewChild('datos_vehiculo') datos_vehiculo: ElementRef;
	  @ViewChild('datos_detalle_vehiculo') datos_detalle_vehiculo: ElementRef;
	  @ViewChild('fotos_vehiculo') fotos_vehiculo: ElementRef;
	 @ViewChild('tab_datos_orden') tab_datos_orden: ElementRef;
	 @ViewChild('tab_datos_vehiculo') tab_datos_vehiculo: ElementRef;
	 @ViewChild('tab_datos_detalle_vehiculo') tab_datos_detalle_vehiculo: ElementRef;
	 @ViewChild('tab_fotos_vehiculo') tab_fotos_vehiculo: ElementRef;
	 
	 
	  @ViewChild('closeBtnScan') closeBtnScan: ElementRef;
	
	
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

  
  ///////VARIABLE PARA SUBIDA DE FOTOS ///////////
  progress: number = 0;
  subida_exitosa = false
  uploadedFiles: Array < File > ;
  nombre_archivo = 'Seleccione archivo';
  localUrl: any;
  imageFile:any
  formData:any
  loading: boolean;
  sizeOfOriginalImage
  imgResultAfterCompress
  localCompressedURl
  sizeOFCompressedImage
  fotos
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

///////FORMULARIO MANEJO DE SERIES///////////	
	serie_renglon = []
	series_ingreso_bodega = []
	serie_lote_form
    fecha_cad_form
	cantidad_form : number
	ubicacion
	codart_renglon
	cant_art_renglon 
	cant_art_serie_renglon
///////FIN FORMULARIO MANEJO DE SERIES///////////

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
  public tipo_ingreso_lista = [
			{"tipo": "E", "descripcion": "AJUSTE INVENTARIO"},
			{"tipo": "I", "descripcion": "IMPORTACIONES"}
		];
	tipo_ingreso= "E"
	
  public almacenes_lista = [
			// {"codalm": "01", "nomalm": "PRINCIPAL"}
			// {"tipo": "I", "descripcion": "IMPORTACIONES"}
		];		
  // almacen = "01"
  almacen
  almacen_arr
  nombre_almacen
  accion_actualizar = false
  orden_produccion
  
  nomcli
  disponible_lote
	
	// location.reload()
	
  // allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX, BarcodeFormat.AZTEC,BarcodeFormat.CODABAR,  BarcodeFormat.CODE_39, BarcodeFormat.CODE_93, BarcodeFormat.EAN_8, BarcodeFormat.ITF, BarcodeFormat.MAXICODE, BarcodeFormat.PDF_417, BarcodeFormat.RSS_14, BarcodeFormat.RSS_EXPANDED   ];
  
  
   // formatsEnabled: BarcodeFormat[] = [
    // BarcodeFormat.CODE_128,
    // BarcodeFormat.DATA_MATRIX,
    // BarcodeFormat.EAN_13,
    // BarcodeFormat.QR_CODE,
  // ];
  
   formatsEnabled: BarcodeFormat[] = [
  	BarcodeFormat.AZTEC,
	BarcodeFormat.CODABAR,
	BarcodeFormat.CODE_39,
	BarcodeFormat.CODE_93,
	BarcodeFormat.CODE_128,
	BarcodeFormat.DATA_MATRIX,
	BarcodeFormat.EAN_8,
	BarcodeFormat.EAN_13,
	BarcodeFormat.ITF,
	BarcodeFormat.MAXICODE,
	BarcodeFormat.PDF_417,
	BarcodeFormat.QR_CODE,
	BarcodeFormat.RSS_14,
	BarcodeFormat.RSS_EXPANDED,
	BarcodeFormat.UPC_A,
	BarcodeFormat.UPC_E,
	BarcodeFormat.UPC_EAN_EXTENSION,
  ];
  tryHarder = false
  
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  
  	// BarcodeFormat.AZTEC,
	// BarcodeFormat.CODABAR,
	// BarcodeFormat.CODE_39,
	// BarcodeFormat.CODE_93,
	// BarcodeFormat.CODE_128,
	// BarcodeFormat.DATA_MATRIX,
	// BarcodeFormat.EAN_8,
	// BarcodeFormat.EAN_13,
	// BarcodeFormat.ITF,
	// BarcodeFormat.MAXICODE,
	// BarcodeFormat.PDF_417,
	// BarcodeFormat.QR_CODE,
	// BarcodeFormat.RSS_14,
	// BarcodeFormat.RSS_EXPANDED,
	// BarcodeFormat.UPC_A,
	// BarcodeFormat.UPC_E,
	// BarcodeFormat.UPC_EAN_EXTENSION,
  
  	
	
	
  // allowedFormats = [ BarcodeFormat.EAN_13  ];
  
  // [formats]="['UPC_EAN_EXTENSION','UPC_E','UPC_A','QR_CODE', 'EAN_13', 'CODE_128', 'DATA_MATRIX', 'AZTEC', 'CODABAR', 'CODE_39', 'CODE_93', 'EAN_8', 'ITF', 'MAXICODE' ,'PDF_417' ,'RSS_14','RSS_EXPANDED']"

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute,
  private imageCompress: NgxImageCompressService
  ) 
  
  {
	  
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
		console.log("LUEGO DE ENTRADA")
		if (this.numtra == 0){
			this.reload_orden_nueva()
			this.accion_actualizar = false
			
		}else {
			this.reload_orden()
			this.accion_actualizar = true
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
	
	
		
// ////PARA BUSCAR IVA Y SETEAR IVA DEFECTO
	// this.srv.iva().subscribe(data => {
		// console.log ("**** IVA DE SIACI ***")
		// console.log (data)
      // this.iva_siaci = data;
	  
	 
    // });
// ////PARA BUSCAR CIUDAD 17000012
	// const datos = {};
	// datos['codemp'] = this.empresa;		
	// console.log (datos)

	
	// this.srv.ciudad(datos).subscribe(
	   // data => {
		   // console.log("OBTENIENDO CIUDAD")
		   // console.log(data)
		   // // let option_defecto = {"codemp": "01", "codgeo": "0", "nomgeo": "*** Seleccione ciudad ***"};
		   // let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
		   // this.ciudad_lista = data
		   // // this.ciudad_lista.unshift(option_defecto)
		   // this.ciudad_lista.push(option_defecto_final)
		   // console.log("CIUDAD LISTA")
		   // console.log(this.ciudad_lista)
		   // // this.ciudad_lista = option_defecto
		// });
		
	// this.srv.vendedores(datos).subscribe(
	   // data => {
		   // console.log("OBTENIENDO VENDEDORES")
		   // console.log(data)
		   // this.vendedores_lista = data
		   // this.vendedor = "01"
		 // });

	
	

	
	// if (this.numtra){
		// this.reset()
		// datos['numtra'] = this.numtra;	
		// datos['usuario'] = this.usuario;
		// this.buscar_encabezado_egreso(datos);
		// this.buscar_renglones_ingresos(datos);
		// this.lista_imagenes();
		// this.get_detalle_vehiculo();
		// this.get_datos_vehiculo();
		// this.tab_habilitar_datos_orden=true
	
	// }else{
		// this.reset()
		
	// }
	

	// console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
	// console.log (this.srv.getConfCorreoPedCli())			 
		 
		 }
		 ); //FIN ROUTING
 
  }//FIN CONSTRUCTOR
  

   ngOnInit() {
	AdminLTE.init();
	}
	
	handleQrCodeResult(event,param){

			//this.scan_result = true
			this.scan_value = event
			if (param=='art'){
				// this.scan_value = '7862109177580'
				this.patron_articulo=this.scan_value
				this.busca_articulo()
			}
			if (param=='serie'){
				// this.scan_value = '7862109177580'
				this.serie_lote_form=this.scan_value
				
				let datos = {}
				datos ['codemp'] = this.empresa
				datos['codart'] = this.codart_renglon
				datos['codbarra'] = this.scan_value
				
				this.srv.conf_codbarra_art(datos).subscribe(
				   data => {
					   console.log("OBTENIENDO CONF CODBARRA")
					   console.log (data)
					   
					   	// let fecha_cad_barra = this.scan_value.substring(18,24)
						// let anio = '20'+fecha_cad_barra.substring(0,2)
						// let mes = fecha_cad_barra.substring(2,4)
						// let dia =fecha_cad_barra.substring(4,6)
						
						//para llenar formulario de los lotes
						// this.serie_lote_form=this.scan_value.substring(26,32)
						// this.fecha_cad_form = anio+'-'+mes+'-'+dia
					   if (data['lote_ini'] != 'NO'){
						   
						let codart_barra = this.scan_value.substring(data['codart_ini'],data['codart_ini']+data['codart_cant'])
						if (codart_barra == this.codart_renglon){
							let fecha_cad_barra = this.scan_value.substring(data['caduca_ini'],data['caduca_ini']+data['caduca_cant'])
							let anio = '20'+fecha_cad_barra.substring(0,2)
							let mes = fecha_cad_barra.substring(2,4)
							let dia =fecha_cad_barra.substring(4,6)
							
							this.serie_lote_form=this.scan_value.substring(data['lote_ini'],data['lote_ini']+data['lote_cant'])
							this.fecha_cad_form = anio+'-'+mes+'-'+dia
							
							
							this.valida_serie_articulo()
						}else {
							alert ("Articulo escaneado COD ARTICULO << "+codart_barra+" >>  no posee el mismo código del producto a registrar. Es el articulo correcto ??")
							this.serie_lote_form = undefined
						}
						
					   }else{
						   alert ("No se pudo obtener LOTE/FECHA..Favor validar Cod Barra en la ficha de este artículo")
						   this.serie_lote_form = undefined
					   }
					   
					    // alert (data['num_uni_present']+'-'+data['presentacion']+'-'+data['codart_ini']+'-'+data['codart_cant']+'-'+data['lote_ini']+'-'+data['lote_cant']+'-'+data['caduca_ini']+'-'+data['caduca_cant'])
					 });
			}
			
			var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
			snd.play();
			window.navigator.vibrate([1000]);
			this.closeBtnScan.nativeElement.click();
		
	}
	scanErrorHandler(event){
			// this.scan_result = true
			// this.scan_value = event
			alert("ScanErrorHandler")
			alert(event)
		
	}
	
	scanFailureHandler(event){
			// this.scan_result = true
			// this.scan_value = event
			alert("scanFailure")
			alert(event)
		
	}
	scanCompleteHandler(event){
		alert("scanCompleteHandler")
		alert(event)
		
		
	}
	scannerEnabled = false
	
	// ######## RELOAD ORDEN NUEVA   ##########
	
	public reload_orden_nueva(){
		this.tab_habilitar_datos_orden=false
		window.scrollTo(0,0)
		this.reset()
	
	let datos = {};
	datos['codemp'] = this.empresa;
	// datos['patron_cliente'] = 'CONSUMIDOR FINAL';
	datos['codagencia'] = this.srv.getCodAgencia();
	datos['usuario'] = this.usuario;
	datos['tipo_accion'] = 'EGRESO';
	
	
	
	console.log (datos)
		//Variables originales  
	  this.tipo_busqueda = true
	  this.proveedores = false;
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
	
		 
	// this.srv.lista_bodegas_centro_costo(datos).subscribe(
	   // data => {
		   // console.log("OBTENIENDO LISTA DE ALMACENES EN ESTE CENTRO DE COSTO")
		   // console.log(data)
		   // this.almacenes_lista = data
		   
		 // });
		 
	this.srv.almacen(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO LISTA DE ALMACENES EN ESTE CENTRO DE COSTO")
		   console.log(data)
		   this.almacenes_lista = data
		   
		 });
	
		 
	
	// this.srv.usuario_defecto_produccion(datos).subscribe(
	   // data => {
		   // console.log("OBTENIENDO USUARIO DEFECTO")
		   // console.log(data)
		   // let datos = {}
		   // datos ['codemp'] = this.empresa
		   	// if (data['razon_social'] != 'NO DISPONIBLE') {
			   // datos ['patron_cliente'] = data['razon_social']
				// this.srv.busqueda_razon_social(datos).subscribe(
					// data => {
				   // console.log("OBTENIENDO CLIENTE DEFECTO")
				   // console.log(data)
				   // // select_razon_social(ident,ruc,rz,correo,codpro,dirpro)
					// this.select_razon_social(data[0].tpIdCliente,data[0].rucced,data[0].nomcli,data[0].email,data[0].codcli,data[0].dircli)
				 // });

			// }
		// });
		 
	
	  
	
		
			


	}
	
	//#################  CARGAR ORDEN PARA ACTUALIZAR ##################
	public reload_orden(){
	
	let datos = {};
	datos['codemp'] = this.empresa;		
	console.log (datos)
		//Variables originales  
	  this.tipo_busqueda = true
	  this.proveedores = false;
	  this.exist_articulo = false;
	  this.exist_razon_social = false;
	  this.edit_cant = false;
	  this.masterSelected = false;
	  this.cambiar_email = false;
	  
	  
	this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	this.fecult_new = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.today)
	console.log (this.fecha_entrega)

		
	// this.reset()
	datos['numfac'] = this.numtra;	
	datos['usuario'] = this.usuario;
	datos['codagencia'] = this.srv.getCodAgencia();

	this.buscar_encabezado_egreso(datos);
	
		this.srv.lista_bodegas_centro_costo(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO LISTA DE ALMACENES EN ESTE CENTRO DE COSTO")
		   console.log(data)
		   this.almacenes_lista = data
		   
		   // select_razon_social(ident,ruc,rz,correo,codpro,dirpro)

		   
		   
		   // this.vendedores_lista = data
		   // this.vendedor = "01"
		 });

	
	}
	
	
	set_tipo_ingreso(){
		console.log ("SET TIPO DE INGRESO")
		
		let almacen_arr= this.almacen_arr.split("|")
		this.almacen = almacen_arr[0]
		this.nombre_almacen = almacen_arr[1]
		
		this.articulos_pedido = []
		if (almacen_arr[1] == 'Producto terminado'){
			this.nomcli = undefined
			this.orden_produccion = undefined
			this.patron_orden_prod = null
			

		}
		
		
		// let datos = {}
		// datos['usuario'] = this.usuario;
		// datos['empresa'] = this.empresa;
		
		// this.router.navigate(['/admin/ingreso_articulos', datos]);
	}
	
	busqueda_orden_produccion(){
		console.log ("BUSCANDO ORDEN DE PRODUCCION")
		let datos = {}
		datos['orden_produccion'] = this.orden_produccion
		datos['codemp'] = this.empresa
	this.srv.busqueda_orden_produccion(datos).subscribe(
	   data => {
			console.log (data)
			if (data['nomcli'] != 'NO EXISTE'){
				this.nomcli = data['nomcli']
				
			}else {
				alert ("Orden de produccion no existe o no esta procesada")
			}
		   
	   }
	   
	   )

	
	}
	
	busqueda_ordenes_produccion_pendientes(){
		console.log ("SET TIPO DE INGRESO")
		let datos = {}
		datos['patron_orden_prod'] = this.patron_orden_prod
		datos['codemp'] = this.empresa
		datos['estado_orden'] = null
		console.log (this.patron_orden_prod)
		// if (this.patron_orden_prod){
			this.srv.busqueda_ordenes_produccion_pendientes(datos).subscribe(
			   data => {
					console.log (data)
					if (data.length > 0 ){
						this.exist_orden_produccion = true
						this.lista_orden_produccion_pendientes = data
						
					}else {
						alert ("Orden de produccion no existe con patron << "+this.patron_orden_prod+" >>ingresado")
						this.exist_orden_produccion = false
						this.patron_orden_prod = undefined
					}
				   
			   }
			   
				)
		// }else{
			// alert ("Por favor ingresar Orden de produccion en el egreso de Materia Prima")
		// }
	
	
	}
	
	select_orden_produccion(numtra,clientes){
		
		this.orden_produccion = numtra
		this.nomcli = clientes
		this.exist_orden_produccion = false
		

	
	}
	
	
	test_reenvio(){
		let datos = {}
		datos['usuario'] = this.usuario;
		datos['empresa'] = this.empresa;
		
		this.router.navigate(['/admin/ingreso_articulos', datos]);
	}
	
	
	buscar_encabezado_egreso(datos) {
		
	this.srv.get_encabezado_egreso(datos).subscribe(
	   data => {
		   this.reset()

		   console.log ("ENCABEZADO_ORDEN")
		   console.log(data)
		   this.ruc = data['identificacion']
		   this.tipo_doc = data['tpIdCliente']
		   

			this.vendedor=data['codven']
			
	
		this.fectra = data['fecfac']
		this.subtotal = data['totnet']
		this.iva_cant_new = data['iva_cantidad']
		this.total= data['totfac']
		this.almacen = data['codalm']
		this.nombre_almacen = data['nomalm']
		this.almacen_arr = this.almacen+'|'+this.nombre_almacen
		this.observacion_pedido = data['observ']
		if (this.nombre_almacen == 'Materia prima'){
			console.log ("#######  INSTANCIANDO BUSQUEDA ORDEN PRODUCCION ########")
			this.orden_produccion =  data['numtra']
			this.busqueda_orden_produccion()
		}
		
		
	   let datos = {}
		datos['numtra'] = this.numtra;	
		datos['usuario'] = this.usuario;
		datos['codemp'] = this.empresa;
		datos['codalm'] = this.almacen;
		// this.select_razon_social(ident,ruc,rz,correo,codpro,dirpro)
		this.select_razon_social(data['tipo_identifica'],data['rucced'],data['nompro'],data['email'],data['codpro'],data['dirpro'])
		this.buscar_renglones_ingresos(datos);
		
		
		
		   
		}); 

	}
	
	buscar_renglones_ingresos(datos) {
		let data_traduccion = {}
		
	this.srv.get_renglones_egreso(datos).subscribe(
	   data => {
		   
		   

		   console.log ("****RENGLONES ORDEN *****")
		   console.log(data)
		   
	  this.articulos_pedido = []
	  let articulos_pedido_temporal = []
	  this.subtotal = 0	
	  this.iva_porcentaje = 0
	  this.iva_cant = 0
	  // this.total = 0
		   
		for (let data_traduccion of data) {
			   console.log ("### RENGLON ###")
			   console.log(data_traduccion)
		   
			// let index_art 
			// if (articulos_pedido_temporal.length == 0){
				// index_art = articulos_pedido_temporal.length
			// }else {
				// console.log (Math.max.apply(Math, articulos_pedido_temporal.map(function(o) { return o.index; })))
				// index_art = (Math.max.apply(Math, articulos_pedido_temporal.map(function(o) { return o.index; })))+1
			// }

			console.log ("### RENGLON TRADUCCION###")
			console.log (data_traduccion)
			articulos_pedido_temporal.push(data_traduccion)
		}
		this.articulos_pedido = articulos_pedido_temporal
		this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
		this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
		// this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
		this.exist_articulo = false;
		console.log ("### ARMADO TRADUCCION ARTICULO PEDIDO ###")
		console.log (this.articulos_pedido)
		}); 
		
	this.srv.get_series_egreso_bodega(datos).subscribe(
	   data => {
		   console.log ("****SERIE ORDEN *****")
		   console.log(data)
			this.series_ingreso_bodega = data
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
			datos_sucurdales['codpro'] = this.dato_cliente['codpro'];
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
		datos_val_ppal['codpro'] = this.dato_cliente['codpro'];
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
					this.dir_agencia = this.dato_cliente['dirpro']
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
		datos_crear_agencia['codpro'] = this.dato_cliente['codpro'];	
		datos_crear_agencia['nompro'] = this.dato_cliente['nompro'];
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
				// this.dir_agencia = this.dato_cliente['dirpro']
			
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
				// console.log(data['nompro'])
				this.razon_social = data['nompro']
				this.email_proveedor = data['email']
				this.proveedores = true;
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
		 // ['codemp', 'nompro','rucced','codpro','email','dirpro','ciucli','telcli','telcli2']
		this.tipo_doc = ident 
		this.ruc = ruc
		this.razon_social = rz
		this.email_proveedor = correo
		console.log (rz)
		this.proveedores = true;
		this.exist_razon_social = false;
		this.patron_cliente = undefined;
	 }
	 
	 
	 
	 
	 
	 
	busca_articulo() { 
	
	
	console.log ("##############  BUSCAR ARTICULO #######")
	console.log (this.almacen)
	if (this.patron_articulo && this.almacen) {
		this.searching_articulo = true
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		// datos['numtra']  = this.orden_produccion
		// datos['nombre_almacen'] = this.nombre_almacen
		
		
		// if ((this.nombre_almacen == 'Materia prima' && this.orden_produccion) || (this.nombre_almacen == 'Producto terminado')){
			// this.srv.articulos_egresos_san_jose(datos).subscribe(data => {
			this.srv.buscar_articulos_conteo(datos).subscribe(data => {
				// console.log(data)
				// console.log (data[1]['nomart'])
				
			let longitud_data = data.length

			if (longitud_data > 0 ) {
				console.log(data)
				// console.log(longitud_data)
				// console.log(data[0])

				this.articulo = data;
				this.exist_articulo = true;
				this.searching_articulo = false
				
				
				// if (data.length == 1){
					// this.articulos_pedido.push[data[0]]
					// console.log(this.articulos_pedido)
				
				// }
				if (this.articulo.length == 1){
					console.log ("inserto de una vez")
				this.elements_checkedList.push(this.articulo[0])
				this.inserta_pedido()
				
				
				}	

	  
				
				
				
			}else {
				alert("Antículo no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
				this.searching_articulo = false
				this.exist_articulo = false;
				this.patron_articulo = undefined;
			}
			}); 
		// }else {
				// alert ("Para MATERIA PRIMA favor ingresar ORDEN DE PRODUCCION")
				// this.searching_articulo = false
			// }
			
			
			
		}else  { 
			alert ("Por favor seleccione Almacen y Articulo a buscar")
			this.searching_articulo = false
		}
	
	






	}
	 
	busca_servicio() { 
	if (this.patron_articulo){
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		datos['codpro']  = this.dato_cliente["codpro"];
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
	 }
	 
	public get_prec_produc(codart){
		console.log("###creado lista de precios##")
		console.log (codart)
		// 6Q0199517A
		let datos = {};
		datos['codart']  = codart
		datos['codemp']  = this.empresa;
		datos['codpro']  = this.dato_cliente["codpro"];
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
		datos['codpro']  = this.dato_cliente["codpro"];
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
	
	
	
	
	
	
	
	
	
	
	
	public update_costo (codart, index,costo) {
		console.log("ACTUALIZAR LISTA PARA PRECIO")
		console.log("####  CODIGO ########")
		console.log(codart)
		console.log("####  CANTIDAD NUEVA ########")
		console.log(costo)
		// var cant_new =cant
		
	if 	(codart && costo){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR PRECIO")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO PRECIO")
		dato.cospro = costo;
		
		dato.v_desc_art = ((dato['punreo']*dato['cospro'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['cospro']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal_art
		dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  }
	  
	  return dato;
	});

	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	// this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	// this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = this.subtotal
	
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
		var cant_new = Number(cant)
		
	if 	(codart && cant_new){
		if (cant_new === 0){
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

		
		
		dato.v_desc_art = ((dato['punreo']*dato['cospro'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['cospro']*dato.cant)-dato.v_desc_art
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
	// this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	// this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = this.subtotal 
	
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
		
		dato.v_desc_art = ((dato['punreo']*dato['cospro'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['cospro']*dato.cant)-dato.v_desc_art
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
	  this.email_proveedor=email
	  console.log(this.email_proveedor)
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
			dato.observ = obsev;
			}
	  return dato;
		});
	}
		console.log (this.articulos_pedido)

   }
   
   
    public update_observ_general (obsev_g) {
		console.log("####  observacion general ########")
		console.log(obsev_g)
		this.observacion_pedido = 'AAAAAAAAAAA'
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
			checked_json['index'] = this.articulos_pedido.length+1
		}else {
			console.log (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))
			checked_json['index'] = (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))+1
		}
		


		
		
		checked_json['cant'] = 1;
		checked_json['observ'] = 'Puede agregar detalles del artículo';
		checked_json['subtotal_art'] = checked_json['cospro']
		checked_json['v_desc_art'] = (checked_json['punreo']*checked_json['cospro'])/100;
		this.articulos_pedido.push(checked_json)
		console.log("###### REGISTRO INSERTADO #####")
		console.log(this.articulos_pedido)
		// checked_json['serie'] = [{serie:"2108B1011A",caducidad:"00/00/0000",cant:20,ubicacion:"EJIDO"}]
		
		}
	
		}	
			console.log ("####  INSERTA PEDIDO CON IVA  ######")
			console.log (this.iva_porcentaje)
			
			// seccion vieja pedidos
			// this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			// this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			this.total = this.subtotal
			
			
			
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
	      return this.options.map(x => x.nompro).filter(
					option => option.toLowerCase().includes(value.toLowerCase()));
		
	}
	
	private _filter2(value: string): string[] {
			console.log ("filtro 2")
	      return this.articulo.map(y => y.nomart).filter(
					option => option.toLowerCase().includes(value.toLowerCase()));
		
	}
	
	view_serie_renglon(codart,cant_art) {
		

		// 1H1422055
		
		
		
		  // return array.filter(function(e) {
    // return e[key] == value;
  // });
  

		
		// this.series_ingreso_bodega[]
		
		
		
		this.serie_renglon =  this.series_ingreso_bodega.filter(function(e) {return e['codart'] == codart;});
		this.codart_renglon = codart
		
		this.cant_art_renglon = cant_art
		
		if (this.serie_renglon.length == 0){
			this.cant_art_serie_renglon = cant_art
		}else{
		this.cant_art_serie_renglon = this.cant_art_renglon-this.serie_renglon.reduce((acc,obj,) => acc + (obj.cant),0)
		}
		console.log (this.cant_art_serie_renglon)
			// cant
		// }
		
	}
	
	
	
	
	close_serie_renglon() {
		this.serie_renglon = []
		
		this.serie_lote_form = undefined
		this.fecha_cad_form = undefined
		this.cantidad_form = undefined
		this.ubicacion = undefined
		this.codart_renglon = undefined
		this.cant_art_renglon = undefined
		this.cant_art_serie_renglon = undefined
		this.disponible_lote = undefined
		
		
	}
	
	close_scanner() {
		// this.scan=false;
		this.scan_valor_serie=false;
		this.scan_patron_articulo=false
		
		
	}
	
	valida_serie_articulo() {
		
		let datos = {}
		datos['codemp'] = this.empresa
		datos['numserie'] = this.serie_lote_form
		datos['codart']=this.codart_renglon
		datos['codalm']=this.almacen
		
			if (this.serie_lote_form ){
			this.srv.valida_serie_articulo(datos).subscribe(
			data => {
			   console.log("OBTENIENDO DATOS DE SERIE ARTICULO")
			   console.log(data)
			   
			   if (data['numfac_org'] != 'NO EXISTE'){
					this.disponible_lote = data['disponible']
					
					
					this.fecha_cad_form = data ['feccad']
			   
			   }else {
					alert ("Serie a descargar no registrada en el sistema")
					this.serie_lote_form = undefined
					this.disponible_lote = undefined
					this.fecha_cad_form = undefined
					this.cantidad_form = undefined
			   }
			   
			   
			}
			)
		}
	   
	   
	
		
	}
	
	
	
	
	insertar_serie_renglon() {
		console.log (this.cantidad_form)
		console.log (this.cant_art_renglon)
		
		let datos = {}
		datos['codemp'] = this.empresa
		datos['numserie'] = this.serie_lote_form
		datos['codart']=this.codart_renglon
		datos['codalm']=this.almacen
		
		
		this.srv.valida_serie_articulo(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO DATOS DE SERIE ARTICULO")
		   console.log(data)
		   if (data['numfac_org'] != 'NO EXISTE'){
			   
			   	let serie_buscar = this.serie_lote_form
				let busca_serie =  this.serie_renglon.filter(function(e) {return e['serie'] == serie_buscar;});
				console.log (busca_serie)
					
							
				// --CUANDO ES DESPACHO FACTURA
				 // ---numfac_des : NUMFAC_ORG DE DESCARGA numero interno de la factura
				 // ---codart_: por ficha
				 // ---codserie: traerlo del serie articulo del lote descargado
				 // ---numserie: el del formulario
				 // --tipo: por table
				 // ---CANT: FORMULARIO
				 // ---TIPO_DES = TIPO DE SERIE ARTICULO
		
				if (busca_serie.length == 0) {
				if (this.fecha_cad_form && this.serie_lote_form && this.cantidad_form){
					if (this.cantidad_form <= this.cant_art_serie_renglon){
						
						if (this.cantidad_form <= data['disponible']){
						
									let datos = {codart: this.codart_renglon,
									serie: this.serie_lote_form,caducidad:this.fecha_cad_form,
									cant:this.cantidad_form,codalm:data['codalm'],codserie:data['codserie'],tipo:'EGR',tipo_des:data['tipo'],numfac_des:data['numfac_org']} 
									
									
									// if (this.serie_renglon.length == 0){
										// datos['codserie'] = this.serie_renglon.length+1
									// }else {
										// // console.log (Math.max.apply(Math, this.serie_renglon.map(function(o) { return o.index; })))
										// datos['codserie'] = (Math.max.apply(Math, this.serie_renglon.map(function(o) { return o.codserie; })))+1
									// }
									this.serie_renglon.push(datos)
									console.log(this.serie_renglon)
									this.series_ingreso_bodega.push(datos)
									console.log (this.cant_art_serie_renglon)
									console.log (this.serie_renglon.reduce((acc,obj,) => acc + (obj.cant),0))
									
									this.cant_art_serie_renglon = this.cant_art_renglon-this.serie_renglon.reduce((acc,obj,) => acc + (obj.cant),0)
						console.log (this.cant_art_serie_renglon)
						this.serie_lote_form = undefined
						this.cantidad_form =undefined
						this.fecha_cad_form = undefined
						this.disponible_lote = undefined
						
						
						}else{
							alert("Solo existe "+data['disponible']+" artículos en este Lote a descargar")
						}
						
							}else{
								alert("La cantidad ingresada para esta serie excede a la cantidad a ingresar en la bodega")
							}
						}else {
							alert ("Favor llenar todos los campos")
						}
						}else{
							alert ("La serie "+this.serie_lote_form+" ya exite en este ingreso de series")
							this.serie_lote_form = undefined
							this.disponible_lote = undefined
							this.fecha_cad_form = undefined
							this.cantidad_form = undefined
						}

		   }else{
			   alert ("Serie a descargar no registrada en el sistema")
				this.serie_lote_form = undefined
				this.disponible_lote = undefined
				this.fecha_cad_form = undefined
				this.cantidad_form = undefined
			   
		   }

		 });
		

	

		
	}
	// insertar_serie_renglon() {
		// console.log (this.cantidad_form)
		// console.log (this.cant_art_renglon)
		
		// // if (this.serie_renglon.length > 0){
			// // this.cant_art_renglon   = this.cant_art_serie_renglon
		// // }
		// let serie_buscar = this.serie_lote_form
		// let busca_serie =  this.serie_renglon.filter(function(e) {return e['serie'] == serie_buscar;});
		// console.log (busca_serie)
		
		// if (busca_serie.length == 0) {
		// if (this.fecha_cad_form && this.serie_lote_form && this.cantidad_form && this.ubicacion){
			// if (this.cantidad_form <= this.cant_art_serie_renglon){
				// let datos = {codart: this.codart_renglon,serie: this.serie_lote_form,caducidad:this.fecha_cad_form,cant:this.cantidad_form,ubicacion:this.ubicacion.toUpperCase() } 
				
				
				// if (this.serie_renglon.length == 0){
					// datos['codserie'] = this.serie_renglon.length+1
				// }else {
					// // console.log (Math.max.apply(Math, this.serie_renglon.map(function(o) { return o.index; })))
					// datos['codserie'] = (Math.max.apply(Math, this.serie_renglon.map(function(o) { return o.codserie; })))+1
				// }
				// this.serie_renglon.push(datos)
				// console.log(this.serie_renglon)
				// this.series_ingreso_bodega.push(datos)
				// console.log (this.cant_art_serie_renglon)
				// console.log (this.serie_renglon.reduce((acc,obj,) => acc + (obj.cant),0))
				
				// this.cant_art_serie_renglon = this.cant_art_renglon-this.serie_renglon.reduce((acc,obj,) => acc + (obj.cant),0)
				// console.log (this.cant_art_serie_renglon)
				
			// }else{
				// alert("La cantidad ingresada para esta serie excede a la cantidad a ingresar en la bodega")
			// }
		// }else {
			// alert ("Favor llenar todos los campos")
		// }
		// }else{
			// alert ("La serie "+this.serie_lote_form+" ya exite en este ingreso de series")
		// }
		
		
		
		
		// // this.serie_lote_form = undefined
		// // this.fecha_cad_form = undefined
		// // this.cantidad_form = undefined
		// // this.ubicacion = undefined
		
		
		
						// // this.series_ingreso_bodega= [{codart:"1H1422055",serie:"11223344",caducidad:"00/00/0000",cant:20,ubicacion:"EJIDO",codserie:1},
									 // // {codart:"1H1422055",serie:"11223344",caducidad:"00/00/0000",cant:10,ubicacion:"GATAZO",codserie:2},
									 // // {codart:"JZW615301D",serie:"00000001",caducidad:"00/00/0000",cant:10,ubicacion:"CUENCA",codserie:1},
									 // // {codart:"JZW615301D",serie:"00000001",caducidad:"00/00/0000",cant:10,ubicacion:"GUAYAQUIL",codserie:2}
									// // ]
		
		
		// // this.serie_renglon = []
		
	// }
	
	delete_renglon_serie (codserie,codart,cant) {
		console.log("ENTRADA ARTICULO A ELIMINAR")
		console.log (codserie)
		console.log (codart)
		 let json_eliminar = this.series_ingreso_bodega
		 let json_eliminar_view = this.serie_renglon

		json_eliminar = json_eliminar.filter(function(dato){
		  if(dato.codserie == codserie && dato.codart == codart ){
			   console.log ("NO ELIMINO")
			  return false
		  }else {
			 
				console.log ("ELIMINO")
			 return true 
			  
		  }
		  // return dato;
		});	 
		
		json_eliminar_view = json_eliminar_view.filter(function(dato){
		  if(dato.codserie == codserie && dato.codart == codart ){

			  return false
		  }else {
			 return true 
			  
		  }
		  // return dato;
		});	 
		
		
		this.series_ingreso_bodega = json_eliminar
		this.serie_renglon = json_eliminar_view
		// console.log (this.series_ingreso_bodega)	
		this.cant_art_serie_renglon = this.cant_art_serie_renglon+cant
		

	
    }
	
	edit_renglon_serie (codserie,codart,serie,caducidad,ubicacion,cant) {
		console.log("ENTRADA ARTICULO A ELIMINAR")
		console.log (codserie)
		console.log (codart)
		console.log (cant)
		console.log (caducidad)
		console.log (serie)
		this.delete_renglon_serie(codserie,codart,cant)
	 
	 // let json_eliminar_view = this.serie_renglon
	 // let json_eliminar = this.series_ingreso_bodega
	// json_eliminar_view = json_eliminar_view.filter(function(dato){
	  // if(dato.codserie == codserie && dato.codart == codart ){

		  // return false
	  // }else {
		 // return true 
		  
	  // }
	  // // return dato;
	// });	 
	// this.serie_renglon = json_eliminar_view
	
	 this.codart_renglon = codart
	 this.serie_lote_form = serie
	 this.fecha_cad_form = caducidad
	 this.ubicacion = ubicacion
	 this.cantidad_form = cant
	 console.log (this.cantidad_form)
	 this.disponible_lote = undefined
	 this.valida_serie_articulo()
	
   }
	
	
	delete_serie () {
	let codart = this.codart_renglon
	 let json_eliminar = this.series_ingreso_bodega
	 let json_eliminar_view = this.serie_renglon

	json_eliminar = json_eliminar.filter(function(dato){
	  if(dato.codart == codart ){
		   console.log ("NO ELIMINO")
		  return false
	  }else {
		 
		    console.log ("ELIMINO")
		 return true 
		  
	  }
	  // return dato;
	});	 
	
	json_eliminar_view = json_eliminar_view.filter(function(dato){
	  if(dato.codart == codart ){
		  return false
	  }else {
		 return true 
		  
	  }
	  // return dato;
	});	 
	
	
	this.series_ingreso_bodega = json_eliminar
	this.serie_renglon = json_eliminar_view
	// console.log (this.series_ingreso_bodega)	
	this.cant_art_serie_renglon = this.cant_art_renglon

	
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
	
	
	
	validar_cantidades_totales_series(){
		//OBTENGO LOS ARTICULOS QUE MANEJEN SERIES/LOTES Y QUE TENGAN REGISTRADO LOTES
		let articulos_pedido_maneja_serie =  this.articulos_pedido.filter(function(e) {return (e['maneja_serie'] == 'S' && e['registra_serie'] > 0);});
		console.log ("######  FILTRADO MANEJA SERIE ######")
		console.log (articulos_pedido_maneja_serie)
		let suma_cant_egreso= articulos_pedido_maneja_serie.reduce((acc,obj,) => acc + (obj.cant),0);
		console.log ("######  SUMA CANT EGRESO ######")
		console.log (suma_cant_egreso)
		//OBTENGO LA SUMA DE LOS QUE TENGA LOTES
		let suma_cant_series= this.series_ingreso_bodega.reduce((acc,obj,) => acc + (obj.cant),0);
		console.log ("######  SUMA CANT SERIE ######")
		console.log (suma_cant_series)
		
		if (suma_cant_egreso != suma_cant_series){
			// alert ("EGRESO INCOMPLETO: Favor validar las cantidades de los renglones del egresos con las cantidades de las series/lotes a descargar")
			return false
		}else {
			return true
		}
		
		
		
		
	}
	

   generar_conteo() {
	   this.loading_modulo = true

	 // console.log ("GENERAR EGRESO")
	
	// console.log ("DATOS CLIENTE")
	// console.log (this.dato_cliente)
	
	// console.log ("ARTICULOS PEDIDO")
	// console.log (this.articulos_pedido.length)
	// // console.log (this.validar_cantidades_totales_series())
	

	// // if ((this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.validar_cantidades_totales_series()){
	// // if (this.validar_cantidades_totales_series()){
	
	
	 // let encabezado_ingreso= this.dato_cliente
	 // encabezado_ingreso['usuario'] = this.usuario;
	 // encabezado_ingreso['codemp'] = this.empresa;
	 // encabezado_ingreso['codalm'] =  this.almacen
	 // encabezado_ingreso['codagencia'] =  this.srv.getCodAgencia();
	 // // encabezado_ingreso['conpag'] =  this.tipo_ingreso
	 
	 // if (this.nomcli){
	// encabezado_ingreso['orden_produccion'] =  this.orden_produccion 
	 // }else{
		 // encabezado_ingreso['orden_produccion'] =  null
	 // }
	 

	 
	// // if (this.fectra == this.jstoday){
		// // encabezado_ingreso['fectra'] = this.fectra
	// // }else{
	 // encabezado_ingreso['fecfac'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500');
	// // }
	 // encabezado_ingreso['totfac'] = this.redondear(this.total)
	 // encabezado_ingreso['observ']  = this.observacion_pedido

	// let status_encabezado
	// let numtra
	// console.log (encabezado_ingreso)
	// console.log ("DATO CLIENTE")
	// console.log (this.dato_cliente)
	
	
	console.log("ENTRO A GENERAR EL CONTEO")

	let array_renglones_pedido = []
	let renglones_pedido
	for (renglones_pedido of this.articulos_pedido) {
	// renglones_pedido['numren'] = numren++
	renglones_pedido['codemp']= this.empresa
	renglones_pedido['fectra']= formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500');
	renglones_pedido['usuario']=  this.usuario;
	renglones_pedido['codalm']= this.almacen;
	renglones_pedido['estado']= 'A';
	array_renglones_pedido.push(renglones_pedido)
	}
					
	console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
	console.log(array_renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_conteo(array_renglones_pedido).subscribe(
						result => {
								console.log(result)
								console.log("####  CONTADOR PROCESO INICIO #####")
								// contador_proceso++
								// console.log(contador_proceso)
								  // let datos = {};
								  // datos['usuario'] = this.usuario;
								  // datos['empresa'] = this.empresa;
								  // datos['pedido'] = 'success'
								  // console.log(datos)
								    // if (contador_proceso == longitud_renglones){
														

										// if (this.series_ingreso_bodega.length > 0){
											// for (let rs of this.series_ingreso_bodega) {
												// // rs['codclipro'] = this.dato_cliente['codpro']
												// // rs['estado'] = 'D'
												// // rs['tipo'] = 'ING'
												// // rs['disponible'] = rs['cant']
									
												// rs['numfac'] = numtra
												// rs['usuario'] = this.usuario
												// rs['codemp'] = this.empresa
												// rs['codalm'] = this.almacen
												// this.srv.guardar_series_egreso_bodega(rs).subscribe(
													// result => {
														// contador_series++
														// console.log (result)
														// if (contador_series == this.series_ingreso_bodega.length){
															// alert ("EGRESO DE BODEGA  GUARDADA EXITOSAMENTE....!!!!")
															// let datos = {}
															// // datos['numfac'] = numtra;	
															// datos['usuario'] = this.usuario;
															// datos['empresa'] = this.empresa;
															// this.router.navigate(['/admin/lista_egresos', datos]);
															// this.loading_modulo = false
														// }
								
														
														
													// }
													
													
												// )
												
											
											
											
											// }
											
											
											
											
										// }else{
											alert ("CONTEO DE PRODUCTOS GUARDADO EXITOSAMENTE....!!!!")
												let datos = {}
												// datos['numfac'] = numtra;	
												datos['usuario'] = this.usuario;
												datos['empresa'] = this.empresa;
											this.router.navigate(['/admin/dashboard3', datos]);
											this.loading_modulo = false
											
										// }
										

										
									// }

								},
						error => {
									console.error(error)
								}
						

						)
					// }//FIN RECORRIDO RENGLONES PEDIDOS
				
			
			
			
					// }//FIN EGRESO EXITOSO
					

			
			
			
			
				// }
	
			// ); 
	 
		
	// }else {
			
			// alert("EGRESO INCOMPLETO: Por favor validar las cantidades de series/lotes a descargar con las cantidades de los articulos registradas en el egreso")
			// this.loading_modulo = false
		// }
	
	}//FIN GENERA PEDIDO
	
	
		// registrar_descarga() {
		
	// let contador_series = 0
	// if (this.series_ingreso_bodega.length > 0){
			// for (let rs of this.series_ingreso_bodega) {
				// rs['codemp'] = this.empresa
				// rs['usuario'] = this.usuario
				// rs['numfac'] = this.numtra
				// this.srv.guardar_series_egreso_bodega(rs).subscribe(
					// result => {
						// contador_series++
						// console.log (result)
						// if (contador_series == this.series_ingreso_bodega.length){
							// alert ("DESPACHO REGISTRADO EXITOSAMENTE....!!!!")
							// let datos = {}
							// datos['usuario'] = this.usuario;
							// datos['empresa'] = this.empresa;
							// this.router.navigate(['/admin/lista_fac_pend_despachos', datos]);
						// }

						
						
					// }
					
					
				// )
				
			
			
			
			// }
			
			
			
			
		// }else{
			// alert ('No se ha registrado series a descargar')
		// }

		
		
		
	// }
	
	
	
	
	
	actualizar_pedido() {

	 console.log ("GENERAR INGRESO")
	
	console.log ("DATOS CLIENTE")
	console.log (this.dato_cliente)
	
	console.log ("ARTICULOS PEDIDO")
	console.log (this.articulos_pedido.length)
	
	
	// if ((this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.email_proveedor) ){
	if ((this.dato_cliente) && (this.articulos_pedido.length > 0)){
	
		// if (confirm(msg_fecha)){
	 let encabezado_ingreso= this.dato_cliente
	 encabezado_ingreso['numfac'] = this.numtra;
	 encabezado_ingreso['codusu'] = this.usuario;
	 encabezado_ingreso['codemp'] = this.empresa;
	 encabezado_ingreso['codalm'] =  this.almacen
	 encabezado_ingreso['conpag'] =  this.tipo_ingreso
	 
	 if (this.nomcli){
		encabezado_ingreso['orden_produccion'] =  this.orden_produccion 
	 }else{
		 encabezado_ingreso['orden_produccion'] =  null
	 }
	 

	 
	// if (this.fectra == this.jstoday){
		// encabezado_ingreso['fectra'] = this.fectra
	// }else{
	 encabezado_ingreso['fecfac'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500');
	// }
	 encabezado_ingreso['totfac'] = this.redondear(this.total)
	 encabezado_ingreso['observ']  = this.observacion_pedido

	let status_encabezado
	let numtra
	console.log (encabezado_ingreso)
	console.log ("DATO CLIENTE")
	console.log (this.dato_cliente)
	
	
	console.log("ENTRO A GENERAR EL PEDIDO")
	this.srv.actualizar_encabezado_ingreso(encabezado_ingreso).subscribe(
		data => {
			status_encabezado= data['status']
			// numtra= data['numtra']
			console.log(data)
			if (status_encabezado == 'ACTUALIZADO CON EXITO'){
				console.log('SE CREAN LOS RENGLONES')
				let renglones_pedido
				let numren = 1
				let numite = 1
				var longitud_renglones = this.articulos_pedido.length
				var contador_proceso = 0
				var contador_series = 0
				
					for (renglones_pedido of this.articulos_pedido) {
					renglones_pedido['numren'] = numren++
					renglones_pedido['numfac'] = this.numtra
					renglones_pedido['codemp']= this.empresa
					// renglones_pedido['serie']= 'N'
					
					// renglones_pedido['tiptra'] = 7
					// if (renglones_pedido['codart'].indexOf("\\") != -1) { //if hay / en el codigo de articulo
						// renglones_pedido['numite']= numite++
						
					// }
					
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_renglones_ingreso_bodega(renglones_pedido).subscribe(
						result => {
								console.log(result)
								console.log("####  CONTADOR PROCESO INICIO #####")
								contador_proceso++
								console.log(contador_proceso)
								  let datos = {};
								  datos['usuario'] = this.usuario;
								  datos['empresa'] = this.empresa;
								  datos['pedido'] = 'success'
								  console.log(datos)
								    if (contador_proceso == longitud_renglones){
														

										if (this.series_ingreso_bodega.length > 0){
											for (let rs of this.series_ingreso_bodega) {
												rs['codclipro'] = this.dato_cliente['codpro']
												rs['estado'] = 'D'
												rs['tipo'] = 'ING'
												rs['disponible'] = rs['cant']
												rs['numfac'] = this.numtra
												rs['codemp'] = this.empresa
												rs['codalm'] = this.almacen
												this.srv.guardar_series_ingreso_bodega(rs).subscribe(
													result => {
														contador_series++
														console.log (result)
														if (contador_series == this.series_ingreso_bodega.length){
															alert ("INGRESO DE BODEGA  GUARDADA EXITOSAMENTE....!!!!")
															let datos = {}
															datos['numfac'] = this.numtra;	
															datos['usuario'] = this.usuario;
															datos['empresa'] = this.empresa;
															this.router.navigate(['/admin/ingreso_articulos', datos]);
														}
								
														
														
													}
													
													
												)
												
											
											
											
											}
											
											
											
											
										}else{
											alert ("INGRESO DE BODEGA  GUARDADA EXITOSAMENTE....!!!!")
												let datos = {}
												datos['numfac'] = this.numtra;	
												datos['usuario'] = this.usuario;
												datos['empresa'] = this.empresa;
											this.router.navigate(['/admin/ingreso_articulos', datos]);
											
										}
										

										
									}

								},
						error => {
									console.error(error)
								}
						

						)
					}//FIN RECORRIDO RENGLONES PEDIDOS
				
			
			
			
					}//FIN INGRESO EXITOSO
			
			
			
			
				}
	
			); 
	   // } // FIN CONFIRMA FECHA DE ENTREGA
		
	}else {
			
			alert("Por favor llenar el campo Datos del cliente/Artículos del pedido/Correo electrónico..!!!")
		}
	
	}//FIN ACTUALIZAR PEDIDO
	

	
   // actualizar_pedido() { 
		// console.log ("ACTUALIZAR PEDIDO")

	
	// if ((this.articulos_pedido.length > 0)){
	// // if ((this.articulos_pedido.length > 0) && (this.email_proveedor)){
	 // let encabezado_ingreso= {}
	 // encabezado_ingreso['numtra'] = this.numtra;
	 // encabezado_ingreso['codus1'] = this.usuario;
	 // encabezado_ingreso['codemp'] = this.empresa;
	 // encabezado_ingreso['fecult'] = this.fecult_new
	  // encabezado_ingreso['codven'] = this.vendedor

	 // // if (this.edit_fecha_creacion){
		 // // encabezado_ingreso['fectra'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500')
	 // // }else{
		 // // console.log (this.fectra.replace( /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1"))
		 // let fectra_format = this.fectra.replace( /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
		 // console.log (fectra_format)
		 
	 // encabezado_ingreso['fectra'] = fectra_format
	 // // }
	 // encabezado_ingreso['totnet'] = this.redondear(this.subtotal)
	 // encabezado_ingreso['iva_cantidad'] = this.redondear(this.iva_cant_new)
	 // encabezado_ingreso['observ']  = this.observacion_pedido
	 // encabezado_ingreso['codpro']  = this.dato_cliente['codpro']
	 // if (!this.ciudad) {
		 // this.ciudad="NO DISPONIBLE"
	 // }
	 // encabezado_ingreso['ciucli']  = this.ciudad
	
	// console.log ("#### encabezado_ingreso ########")
	// console.log (encabezado_ingreso)
	// let status_encabezado
	// // let numtra
	// // console.log (encabezado_ingreso)
	// // console.log ("DATO CLIENTE")
	// // console.log (this.dato_cliente)
	
	
	// // console.log("ENTRO A GENERAR EL PEDIDO")
	// this.srv.actualizar_encabezado_ingreso(encabezado_ingreso).subscribe(
		// data => {
			// status_encabezado= data['status']
			// // numtra= data['numtra']
			// console.log(data)
			// if (status_encabezado == 'ACTUALIZADO CON EXITO'){
				// console.log(' ###### SE ACTULIZAN LOS RENGLONES ######')
				// let renglones_pedido
				// let numren = 1
				// let numite = 1
				// var longitud_renglones = this.articulos_pedido.length
				// var contador_proceso = 0
				
					// for (renglones_pedido of this.articulos_pedido) {
					// renglones_pedido['numren'] = numren++
					// renglones_pedido['numtra'] = this.numtra
					// renglones_pedido['codemp']= this.empresa
					// if (renglones_pedido['codart'].indexOf("\\") != -1) { //if hay / en el codigo de articulo
						// renglones_pedido['numite']= numite++
						
					// }


					
					
					// console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					// console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					// this.srv.actualizar_renglones_orden(renglones_pedido).subscribe(
						// result => {
								// console.log("####  CONTADOR PROCESO INICIO #####")
								// contador_proceso++
								// console.log(contador_proceso)
								// console.log(result)
								  // let datos = {};
								  // datos['usuario'] = this.usuario;
								  // datos['empresa'] = this.empresa;
								  // datos['numtra'] = this.numtra;
								  // console.log(datos)
								  
								  // console.log("####  CONTADOR PROCESO #####")
								  // console.log(contador_proceso)
								   // console.log("####  LONGITUD PROCESO #####")
								  // console.log(longitud_renglones)
								  // if (contador_proceso == longitud_renglones){
											
									// if (this.srv.getConfCorreoPedCli() == 'SI'){
											  // console.log("### HABILITADO CORREO###")
										  	  // this.correo_pedido(this.numtra,this.email_proveedor)
										  
									  // }
									  // alert ("INGRESO DE BODEGA  GUARDADA EXITOSAMENTE....!!!!")
									  // // this.router.navigate(['/admin/taller_orden', datos]);
									// // this.router.navigate(['/admin/lista_ordenes', datos]);
								  
								  
								  // }

								// },
						// error => {
									// console.error(error)
								// }
						

						// )
					// }//FIN RECORRIDO RENGLONES PEDIDOS
				// }
			
			
				// }
	
			// ); 
		
	// }else {
			
			// alert("Por favor llenar el campo Artículos del pedido/Correo electrónico..!!!")
		// }
	
	// }//FIN ACTUALIZAR PEDIDO
	
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
	  this.proveedores = false;
	  this.exist_articulo = false;
	  this.edit_cant = false;
	  this.masterSelected = false;
	  this.cantidad_nueva = '';
	  this.cambiar_email = false;
	  this.razon_social = undefined
	  this.email_proveedor = undefined
	  this.ciudad = undefined
	  this.articulo = []
	  this.articulos_pedido = []
	  this.subtotal = 0	
	  this.iva_porcentaje = 0
	  this.iva_cant = 0
	  this.total = 0
	  this.observacion_pedido = undefined
	  this.dato_cliente = undefined
	  this.series_ingreso_bodega=[]
	  this.serie_renglon = []
	  this.almacen_arr = undefined
	  this.nombre_almacen = undefined
	  this.nomcli = undefined
	  this.orden_produccion = undefined
	  // this.numtra = undefined

	

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

				// console.log (this.localUrl)
				this.compressFile(this.localUrl,this.nombre_archivo)
			}
		console.log (element.target.files[0])
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
	  this.subida_exitosa = false
    this.formData = new FormData();
	this.formData.append("uploads", this.uploadedFiles, this.nombre_archivo);
	this.formData.append("dir",this.empresa+"_"+this.numtra);
	
	console.log ("#### FORMDATA  #####")
	console.log (this.formData)
	
  
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
          console.log('Archivo subido con exito!', event.body);
		  	  this.lista_imagenes();
          setTimeout(() => {
            this.progress = 0;
			this.subida_exitosa = true
			this.imageFile = false
			this.nombre_archivo = 'Seleccione archivo'


          }, 1500);


      }
    });
	}

	eliminar_imagen(nombre) {

		let datos = {};
		datos['nombre']  = nombre;
		datos['dir'] = this.empresa+'_'+this.numtra
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
	   // console.log (data["modelo"])

	  

	});
		
	}

	
	
	
	
	
  
  
}
