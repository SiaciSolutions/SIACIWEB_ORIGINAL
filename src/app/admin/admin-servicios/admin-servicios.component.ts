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
  selector: 'app-admin-servicios',
  templateUrl: './admin-servicios.component.html',
  styleUrls: ['./admin-servicios.component.css']
})



	

export class AdminServiciosComponent implements OnInit {
	

	
	
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
 codser
 codser_old
 codalt
 scan_value
 patron_articulo
 
 estado_art = true
 precio_servicio = 0
 desc_art = 0
 iva_art
 
 iva_siaci
 existencia=0
 nomser
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
		this.codser = params['codser'] || this.route.snapshot.paramMap.get('codser') || 0;
		console.log("LUEGO DE ENTRADA")
		this.accion_actualizar = false
		if (this.codser != 0){
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
	console.log(this.codser)

		 
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
		AdminLTE.init();
	}
	
	
   crea_servicio() {	
   
   let data={}
   data['codemp'] = this.empresa
   data['nomser'] = this.nomser
   data['codser'] = this.codser
   data['codiva'] = this.codiva
   data['preser'] = this.precio_servicio
   // data['punreo'] = this.desc_art
   data['codusu'] = this.usuario

	  
		if (this.validar_datos()){
		this.srv.crear_servicios(data).subscribe(data => {
			
			if (data['STATUS'] == 'EXITOSO'){
				console.log ("CREACION EXITOSA")
			
				let datos={}
				datos['empresa'] = this.empresa
				datos['usuario'] = this.usuario
				
				if (this.uploadedFiles){
					if (this.upload()){
						alert ("Servicio creado con exito..!!")
						this.router.navigate(['/admin/lista_servicios', datos]);
					}
				}else{
					alert ("Servicio creado con exito..!!")
					this.router.navigate(['/admin/lista_servicios', datos]);
					
				}
			}
			if (data['STATUS'] == 'DUPLICADO'){
				alert ("ERROR..!! Un servicio ha sido creado con el código << "+this.codser+" >>. Utilizar otro código para crear el servicio.")
			}
		
		
		});
		}
   
   }
   
   	
   actualiza_producto() {	
   
   let data={}
   data['codemp'] = this.empresa
   data['nomser'] = this.nomser
   data['codser'] = this.codser

   data['codiva'] = this.codiva
   data['preser'] = this.precio_servicio
   data['punreo'] = this.desc_art
   data['codusu'] = this.usuario
   // data['codser_old'] = this.codser_old
   
  if (this.validar_datos()){
		this.srv.actualizar_servicio(data).subscribe(data => {


			if (data['STATUS'] == 'EXITOSO'){
				console.log ("ACTUALIZACION EXITOSA")
			
				let datos={}
				datos['empresa'] = this.empresa
				datos['usuario'] = this.usuario
				
				if (this.uploadedFiles){
					if (this.upload()){
						alert ("Servicio actualizado con exito..!!")
						this.router.navigate(['/admin/lista_servicios', datos]);
					}
				}else{
					alert ("Servicio actualizado con exito..!!")
					this.router.navigate(['/admin/lista_servicios', datos]);
					
				}
			}

		});
		}
   
   }
   
   
   
   
   get_detalle_articulo(){
	   
	   let data={}
	      data['codemp'] = this.empresa
		  data['codser'] = this.codser
		
	   this.srv.servicio_detalle(data).subscribe(data => {
			console.log ("OBTENIENDO DATOS ARTICULO")
			console.log (data)
			this.nomser = data['nomser']
			this.precio_servicio = data['precio']
			this.codiva =data['codiva']
			this.codser_old=this.codser
			this.src = data['src']
		
			

		});
	   // 

   }
   
   
   	validar_datos() {
		console.log ("### VALIDAR DATOS ###")
		console.log (this.precio_servicio)
		let precio_servicio_validacion = this.precio_servicio+""
		let descuento_validacion = this.desc_art+""
		console.log (descuento_validacion)

		if (!this.nomser || this.nomser.length == 0) {
			alert("Por favor ingresar el nombre del producto")
			return false
		}else if (!this.codser || this.codser.length == 0){
			alert("Por favor ingresar el codigo principal artículo")
			return false
		}else if (!this.codiva || this.codiva.length == 0){
			alert("Por favor seleccione el codigo de IVA")
			return false
		}else if (!precio_servicio_validacion || precio_servicio_validacion.length == 0){
			alert("Por favor ingrese el precio de venta")
			return false
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
	this.formData.append("codser",this.codser);
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
