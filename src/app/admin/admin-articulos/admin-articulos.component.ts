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
  selector: 'app-admin-articulos',
  templateUrl: './admin-articulos.component.html',
  styleUrls: ['./admin-articulos.component.css']
})



	

export class AdminArticulosComponent implements OnInit {
	

	
	
	@ViewChild('datos_articulo') datos_articulo: ElementRef;
	 @ViewChild('datos_vehiculo') datos_vehiculo: ElementRef;
	  @ViewChild('datos_detalle_vehiculo') datos_detalle_vehiculo: ElementRef;
	  @ViewChild('fotos_vehiculo') fotos_vehiculo: ElementRef;
	 @ViewChild('tab_datos_articulo') tab_datos_articulo: ElementRef;
	 @ViewChild('tab_datos_vehiculo') tab_datos_vehiculo: ElementRef;
	 @ViewChild('tab_datos_detalle_vehiculo') tab_datos_detalle_vehiculo: ElementRef;
	 @ViewChild('tab_fotos_vehiculo') tab_fotos_vehiculo: ElementRef;
	 
	 
	  @ViewChild('closeBtnScan') closeBtnScan: ElementRef;
	
	
	// SELECT * FROM "DBA"."detalle_vehiculo"----EXTINTOR, ACCESORIROS
	// SELECT * FROM "DBA"."adicionales"------MARCA MODELO AÑO DEL CARRO
	// SELECT * FROM "DBA"."mapa_vehiculo"------MAPA VEHICULO
	

  
 
  loading_modulo = false
  
 usuario
 empresa
 codart
 codart_old
 codalt
 scan_value
 patron_articulo
 
 estado_art = true
 precio_venta = 0
 desc_art = 0
 iva_art
 
 iva_siaci
 existencia=0
 nomart
 codiva
 accion_actualizar
 src = "../../assets/img_articulos/subir-imagen.png"
 
 loading
 nombre_archivo
 progress
 subida_exitosa
 imageFile
 uploadedFiles
 localUrl
 sizeOfOriginalImage
 loading_subida
 formData:any
 imgResultAfterCompress
 sizeOFCompressedImage
 localCompressedURl
 unidades_lista
 unidad
 lista_linea_articulos
 linea_articulo
 lista_tipo_subclase
 subclase_articulo



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
		this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
		this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
		this.codart = params['codart'] || this.route.snapshot.paramMap.get('codart') || 0;
		console.log("LUEGO DE ENTRADA")
		this.accion_actualizar = false
		if (this.codart != 0){
			this.get_detalle_articulo()
			this.accion_actualizar = true
			// this.reload_orden_nueva()
			// this.accion_actualizar = false
		}
		// else {
			// this.reload_orden()
			// this.accion_actualizar = true
		// }
      });
	
	console.log(this.usuario)
	console.log(this.empresa)
	console.log(this.codart)

		 
		 }
		 ); //FIN ROUTING
 
  }//FIN CONSTRUCTOR
  

   ngOnInit() {
	   
	   	////PARA BUSCAR IVA Y SETEAR IVA DEFECTO
		this.srv.iva().subscribe(data => {
			console.log ("**** IVA DE SIACI ***")
			console.log (data)
		  this.iva_siaci = data;
		});
		
		let data = {}
		data['codemp'] = this.empresa
		////PARA BUSCAR UNIDADES
		this.srv.unidades(data).subscribe(data => {
			console.log ("**** unidades ***")
			console.log (data)
		  this.unidades_lista = data;
		});
		
		////PARA LINEA DE ARTICULO
		this.srv.linea_articulos(data).subscribe(data => {
			console.log ("**** CLASE ARTICULOS ***")
			console.log (data)
		  this.lista_linea_articulos = data;
		});
		
		
		AdminLTE.init();
	}
	
	
   crear_producto() {	
   
   let data={}
   data['codemp'] = this.empresa
   data['nomart'] = this.nomart.trim()
   data['codart'] = this.codart.trim()
   data['codiva'] = this.codiva
   data['prec01'] = this.precio_venta
   data['punreo'] = this.desc_art
   data['codusu'] = this.usuario
   data['coduni'] = this.unidad
   
   if (this.srv.getActLineaArticulo() == 'SI'){
		data['codcla'] = this.linea_articulo
		data['codsub'] = this.subclase_articulo
   }

   
      if (this.estado_art){
	      data['estado'] = 'A'
	   }else{
			  data['estado'] = 'I'
	   }
	   
	if (!this.codalt || this.codalt== 0){
		data['codalt'] = this.codart
   }else{
	   data['codalt'] = this.codalt.trim()
   }
	  
		if (this.validar_datos()){
		this.srv.crear_articulo(data).subscribe(data => {
			
			if (data['STATUS'] == 'EXITOSO'){
				console.log ("CREACION EXITOSA")
			
				let datos={}
				datos['empresa'] = this.empresa
				datos['usuario'] = this.usuario
				
				if (this.uploadedFiles){
					if (this.upload()){
						alert ("Articulo creado con exito..!!")
						this.router.navigate(['/admin/lista_productos', datos]);
					}
				}else{
					alert ("Articulo creado con exito..!!")
					this.router.navigate(['/admin/lista_productos', datos]);
					
				}
			}
			if (data['STATUS'] == 'DUPLICADO'){
					alert ("Articulo con código << "+this.codart+" >> DUPLICADO ...!!")
			}
		
		
		});
		}
   
   }
   
   	getTipoLinea(){
		this.subclase_articulo = undefined
		let datos_subclase = {};
		console.log("### LINEA ARTICULO DE ENTRADA")
		console.log(this.linea_articulo)
		datos_subclase['codemp'] = this.empresa;
		datos_subclase['codcla'] = this.linea_articulo;	
		console.log("OBTENIENDO TIPO DE SUBCLASE ARTICULO")
		this.srv.linea_subclase_articulo(datos_subclase).subscribe(
		   data => {
			   console.log("OBTENIENDO SUBCLASE ")
		       console.log(data)
			   this.lista_tipo_subclase = data
		   })
	}
   
   	
   actualiza_producto() {	
   
   let data={}
   data['codemp'] = this.empresa
   data['nomart'] = this.nomart
   data['codart'] = this.codart

   data['codiva'] = this.codiva
   data['prec01'] = this.precio_venta
   data['punreo'] = this.desc_art
   data['codusu'] = this.usuario
   data['codart_old'] = this.codart_old
   data['coduni'] = this.unidad
   
   if (this.estado_art){
	      data['estado'] = 'A'
   }else{
		  data['estado'] = 'I'
   }
   
   if (!this.codalt || this.codalt== 0){
		data['codalt'] = this.codart
   }else{
	   data['codalt'] = this.codalt
   }
   
   if (this.srv.getActLineaArticulo() == 'SI'){
		data['codcla'] = this.linea_articulo
		data['codsub'] = this.subclase_articulo
   }else{
   		data['codcla'] = '01'
		data['codsub'] = '0101'
   }
		if (this.validar_datos()){
		this.srv.actualizar_articulo(data).subscribe(data => {
			// console.log ("ACTUALIZACION EXITOSA")
			// alert ("Articulo actualizado con exito..!!")
			// let datos={}
			// datos['empresa'] = this.empresa
			// datos['usuario'] = this.usuario
			// this.router.navigate(['/admin/lista_productos', datos]);

			if (data['STATUS'] == 'EXITOSO'){
				console.log ("ACTUALIZACION EXITOSA")
			
				let datos={}
				datos['empresa'] = this.empresa
				datos['usuario'] = this.usuario
				
				if (this.uploadedFiles){
					if (this.upload()){
						alert ("Articulo actualizado con exito..!!")
						this.router.navigate(['/admin/lista_productos', datos]);
					}
				}else{
					alert ("Articulo actualizado con exito..!!")
					this.router.navigate(['/admin/lista_productos', datos]);
					
				}
			}

		});
		}
   
   }
   
   
   
   
   get_detalle_articulo(){
	   
	   let data={}
	      data['codemp'] = this.empresa
		  data['codart'] = this.codart
		
	   this.srv.articulo_detalle(data).subscribe(data => {
			console.log ("OBTENIENDO DATOS ARTICULO")
			console.log (data)
			this.nomart = data['nomart']
			this.precio_venta = data['precio']
			this.codalt = data['codalt']
			this.existencia =data['existencia']
			this.desc_art =data['punreo']
			this.codiva =data['codiva']
			this.unidad =data['coduni']
			this.codart_old=this.codart
			this.src = data['src']
			if (this.srv.getActLineaArticulo() == 'SI'){
				this.linea_articulo= data['codcla']
				this.getTipoLinea()
				this.subclase_articulo= data['codsub']
			}
			if (data['estado'] == 'A'){
				this.estado_art=true
			}
			if (data['estado'] == 'I'){
				this.estado_art=false
			}
			

		});
	   // 

   }
   
   
   	validar_datos() {
		console.log ("### VALIDAR DATOS ###")
		console.log (this.precio_venta)
		let precio_venta_validacion = this.precio_venta+""
		let descuento_validacion = this.desc_art+""
		console.log (descuento_validacion)

		if (!this.nomart || this.nomart.length == 0) {
			alert("Por favor ingresar el nombre del producto")
			return false
		}else if (!this.codart || this.codart.length == 0){
			alert("Por favor ingresar el codigo principal artículo")
			return false
		}else if (!this.unidad || this.unidad.length == 0){
			alert("Por favor seleccione el codigo de UNIDAD")
			return false
		}
		else if (!this.codiva || this.codiva.length == 0){
			alert("Por favor seleccione el codigo de IVA")
			return false
		}
		else if (!precio_venta_validacion || precio_venta_validacion.length == 0){
			alert("Por favor ingrese el precio de venta")
			return false
		}else if (!descuento_validacion || descuento_validacion.length == 0){
			alert("Por favor ingrese porcentaje de descuento")
			return false
		}
		
		 if (this.srv.getActLineaArticulo() == 'SI'){
			if (!this.linea_articulo){
				alert("Por favor seleccionar Linea artículo")
				return false
			}else if (!this.subclase_articulo){
				alert("Por favor seleccionar tipo artículo")
				return false
			}
		 }
		return true

	
	} 
	
	public validaNumericos(event: any) {
    if((event.charCode >= 48 && event.charCode <= 57) ||(event.charCode == 46)){
      return true;
     }
     return false;        
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
	// this.formData.append("dir",this.empresa+"_"+this.numtra);
	this.formData.append("codemp",this.empresa);
	this.formData.append("codart",this.codart);
	this.loading = true

	
	console.log ("#### FORMDATA  #####")
	console.log (this.formData)
	// this.progress = 10
	let loading_subida = false
  
	this.srv.upload_imagen_art_serv(this.formData).subscribe(
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
		  	  // this.lista_imagenes();
			  loading_subida = true;
			  
			  
			  
          setTimeout(() => {
            this.progress = 0;
			this.subida_exitosa = true
			this.imageFile = false
			this.nombre_archivo = 'Seleccione archivo'
			this.loading = false

          }, 1500);


      }
    });
	console.log ("#### RETORNO  #####") 
	 return true

	
	
	
	
	
	}
   

	
	
	
	
	

	
	
	
  
  
}
