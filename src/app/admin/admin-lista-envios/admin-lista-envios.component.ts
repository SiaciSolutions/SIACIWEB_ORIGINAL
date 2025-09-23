import { Component, OnInit,ViewChild } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'
import {DataTableDirective} from 'angular-datatables';
import { from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

// import { Subject } from 'rxjs';



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-envios',
  templateUrl: './admin-lista-envios.component.html',
  styleUrls: ['./admin-lista-envios.component.css']
})



	

export class AdminListaEnviosComponent implements OnInit {
	@ViewChild(DataTableDirective) 
	datatableElement: DataTableDirective;
	  // dtOptions: DataTables.Settings = {};
    dtOptions:any = {};
	 // @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;

	usuario;
	empresa;
	lista_pedidos
	lista_pedidos_tabla
	public loading : boolean;
	public espera_correo_facturacion : boolean;
	public espera_exitoso_facturacion : boolean;
	public espera_correo_pedido : boolean;
	public espera_exitoso_pedido : boolean;
	public success
	public success_act
	venta_status
	public edit_ruta
	lista_rutas
	fecha_entrega_busqueda
	listado_original
	fecha_desde
	fecha_hasta
	error_sri
	url_visor_pdf= undefined
	loading_iframe : boolean = false;
	ver_iframe : boolean = false;
	total_usd = null
	total_cajas = null
	masterSelected:boolean;
	elements_checkedList:any = [];
	//CONTADOR GUIAS ENVIADA BARRA ENVIO
	progreso_reporte = 0+'%'
	enviando_guias = false;
	CANTIDAD_A_ENVIAR= 0
    CONTADOR_GUIAS = 0

	
	lista_couriers = [
	{
      name: 'TODAS',
      value: '%'
    },
    {
      name: 'SERVIENTREGA',
      value: 'SERV'
    },
    {
      name: 'LAARCOURIER',
      value: 'LAAR',
    }
  	];
	courier = '%'


	lista_tipo_trans = [
	{
      name: 'TODAS',
      value: '%'
    },
    {
      name: 'CON FACTURA',
      value: '01'
    },
    {
      name: 'SIN FACTURA',
      value: 'GR',
    }
  	];
	tipo_trans = '%'



	
	lista_status_transmision = [
	{
      name: 'TODAS',
      value: 'T'
    },
    {
      name: 'TRANSMITIDAS',
      value: 'S'
    },
    {
      name: 'PENDIENTE TRANSMITIR',
      value: 'N',
    }
  	];
	status_transmision ='T'


	// Puedes cargar este objeto desde un servicio si lo deseas
/*     shipment = {
      noGuia: 'SISLC10000121',
      ciudadOrigen: 'GUAYAQUIL',
      ciudadDestino: 'FLAVIO ALFARO',
      producto: 'Servicio de Carga Express',
      para: 'ELENA CUSME',
      direccionDestino: 'VIA PRINCIPALlllll',
      telefonoDestino: '0999999999',
      telefonoDestino2: '0999999999',
      numeroEnvios: 1,
      pesoKilos: 200.00,
      estadoActual: 'Pendiente'
    }; */
	shipment = {};


  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute)
  
  { this.loading = true;
    this.espera_correo_facturacion = false;
	this.espera_exitoso_facturacion = false;
	this.espera_correo_pedido = false;
	this.espera_exitoso_pedido = false;
  
  }
  
  
  title = 'Example of Angular 8 DataTable';
  isMobile: boolean = false;

  
  // dtTrigger: Subject<any> = new Subject();
  // public dtTrigger: Subject<any> = new Subject();
	 
   ngOnInit() {
	
	   
	   	if (!this.srv.isLoggedIn()){
	this.router.navigateByUrl('/')};
	   
	this.route.queryParams.subscribe(params => {
		console.log(params)
        // Defaults to 0 if no query param provided.
        // this.ruc = +params['ruc'] || 0;
		this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
		this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
		this.venta_status = params['venta'] || this.route.snapshot.paramMap.get('venta');
      });
	   
	 if (this.venta_status == 'success'){
		 this.success = true
	 }else if (this.venta_status == 'success_act'){
		 this.success_act = true
	 }
	 console.log("SUCCESS STATUS")
	 console.log(this.success)
	// this.usuario = this.route.snapshot.params.usuario;
	// this.empresa = this.route.snapshot.paramMap.get('empresa');	
	const datos = {};
	datos['codemp'] = this.empresa;	
	// datos['codalm'] = '01';	
    datos['codalm'] = this.srv.getCodAgencia();	
	datos['usuario'] = this.usuario;
	datos['api_url'] = this.srv.apiUrl+':'+this.srv.port;
	datos['tipacc'] = this.srv.getTipacc()
	console.log (this.usuario)
	console.log (this.empresa)
	console.log (datos)
	// console.log ("##### DATATABLELEMENT  #####")
	// console.log(this.datatableElement)
	
			// // ### Obtener fecha de día de 7 dias atras  
	var newdate = new Date();
	newdate.setDate(newdate.getDate() -30 ); //
	// this.fecha_desde  = new FormControl(new Date(newdate))
	
	this.fecha_desde  = formatDate(newdate, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.fecha_desde)
	// new FormControl(new Date());
	// this.fecha_hasta  = new Date()
	this.fecha_hasta  = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '-0500');
	datos['fecha_desde'] = this.fecha_desde
	datos['fecha_hasta'] = this.fecha_hasta
	datos['courier'] = this.courier
	datos['tipotrans'] = this.tipo_trans
	datos['status_trans'] = this.status_transmision
	
	
	
	
	// localStorage.removeItem('listado_original')
	
	
	this.srv.lista_envios_courier(datos).subscribe(
	   data => {
		   // if (data){
			   // this.loading = false;
		   // }
		   console.log(data)
		   console.log ("EJECUTADA DATA")
			this.lista_pedidos_tabla = data
			// this.buildDtOptions(this.lista_pedidos)
		}); 
		
		setTimeout(()=> {	
			console.log("TIME OUT")
			// console.log(this.lista_pedidos)
			this.lista_pedidos = this.lista_pedidos_tabla
			// localStorage.setItem('listado_original', this.lista_pedidos)
			this.listado_original = this.lista_pedidos
			this.total_usd = this.listado_original.reduce((acc,obj,) => acc + (obj.totfac),0);
			this.total_usd = this.redondear(this.total_usd)
			this.total_cajas = this.listado_original.reduce((acc,obj,) => acc + (obj.nopiezas),0);
			
			
			
		this.dtOptions = {
			// ajax: 'data/data.json',
			order: [1, 'desc'],
			dom: 'Bfrtip',
			// buttons: ['print','excel'],  ///SI SIRVEEE
			buttons: [{
                extend: 'print',
                filename: 'lista_envios_courier_SIACI_WEB'+this.usuario
            },
            {
                extend: 'excel',
                filename: 'lista_envios_courier_SIACI_WEB'+this.usuario
            }],
			columnDefs: [
            // { width: 200, targets: 0 }
			 { "width": "200px", "targets": 0 }
			],
			fixedColumns: true,
			pageLength: 10,
			processing: true

		};

			this.loading = false;
			// this.rerender();
			
			
			}, 3000)




	
	
	AdminLTE.init();
	this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	
	}//FIN ONINIT
	

	onIframeLoad() {
		console.log ("**** LOADING FRAME FALSO ****")
  		this.loading_iframe = false;
	}

	transmision_masiva_sin_delay() {
		console.log ("**** TRANSMISION MASIVA****")
  		if (confirm("Vas a transmitir varias guias a la vez, estas seguro !!!!")){
			 let cont_transm=0
			 this.loading = true;
				for (let guia of this.elements_checkedList){
					console.log (guia)
					this.srv.transmision_masiva_courier(guia).subscribe(
						result => {
							console.log(result)

							if (result['resultado']=="EXITOSO"){
								cont_transm = cont_transm+1
							}
							console.log(cont_transm)
							if (cont_transm == this.elements_checkedList.length){
								this.elements_checkedList= []
								alert("✅ Comprobantes transmitidos con Exito...!!")
								this.buscar_factura_fecha()
							}else{
								this.elements_checkedList= []
								alert(" ❌ Algunas guias no fueron generadas en el Courier")
								this.buscar_factura_fecha()
							}
							
						}
					) 


				}



		}else{
			alert ("NO TRASMITIDO")
		}
		
		//this.loading_iframe = false;
	}

	transmision_masiva() {
		console.log ("**** TRANSMISION MASIVA****")
  		if (confirm("Vas a transmitir varias guias a la vez, estas seguro !!!!")){
			this.CONTADOR_GUIAS = 0;
			this.loading = true;
			this.CANTIDAD_A_ENVIAR = this.elements_checkedList.length
			this.enviando_guias = true

			from(this.elements_checkedList).pipe(
				concatMap(guia =>
				this.srv.transmision_masiva_courier(guia).pipe(
					// Cuando termine este request, esperamos 2 segundos antes del siguiente
					concatMap(result => {
					console.log(result);

					if (result['resultado'] === "EXITOSO") {
						this.CONTADOR_GUIAS++;
						this.progreso_reporte = (this.CONTADOR_GUIAS*100)/this.CANTIDAD_A_ENVIAR+'%'
					}
					console.log(this.CONTADOR_GUIAS);

					return of(result).pipe(delay(100)); // DELAY ENTRE requests
					})
				)
				)
			).subscribe({
				complete: () => {
				// Cuando ya procesó todas las guías
				if (this.CONTADOR_GUIAS === this.CANTIDAD_A_ENVIAR) {
					this.elements_checkedList = [];
					this.CONTADOR_GUIAS = 0
					this.progreso_reporte = 0+'%'
					this.enviando_guias = false
					alert("✅ Comprobantes transmitidos con Éxito...!!");
				} else {
					this.elements_checkedList = [];
					this.CONTADOR_GUIAS = 0
					this.progreso_reporte = 0+'%'
					this.enviando_guias = false
					alert("❌ Algunas guías no fueron generadas en el Courier");
				}
				this.buscar_factura_fecha();
				}
			});




		}else{
			alert ("NO TRASMITIDO")
		}
		
		//this.loading_iframe = false;
	}
 
  
    buscar_factura_fecha(): void {
		let datos = {};
		this.loading = true;
		datos['codemp'] = this.empresa;	
		datos['codagencia'] = this.srv.getCodAgencia();	
		datos['usuario'] = this.usuario;
		datos['fecha_desde'] = this.fecha_desde
		datos['fecha_hasta'] = this.fecha_hasta
	    datos['codalm'] = this.srv.getCodAgencia();	
		datos['tipacc'] = this.srv.getTipacc()
		datos['api_url'] = this.srv.apiUrl+':'+this.srv.port;
		datos['courier'] = this.courier
		datos['tipotrans'] = this.tipo_trans
		datos['status_trans'] = this.status_transmision
		console.log (this.courier)
	
	
	this.srv.lista_envios_courier(datos).subscribe(
	   data => {
		   // if (data){
			   // this.loading = false;
		   // }
		   console.log(data)
		   console.log ("EJECUTADA DATA")
			this.lista_pedidos_tabla = data
			// this.buildDtOptions(this.lista_pedidos)
		}); 
		
		setTimeout(()=> {	
			console.log("TIME OUT")
			// console.log(this.lista_pedidos)
			this.lista_pedidos = this.lista_pedidos_tabla
			// localStorage.setItem('listado_original', this.lista_pedidos)
			this.listado_original = this.lista_pedidos
			this.total_usd = this.listado_original.reduce((acc,obj,) => acc + (obj.totfac),0);
			this.total_usd = this.redondear(this.total_usd)
			this.total_cajas = this.listado_original.reduce((acc,obj,) => acc + (obj.nopiezas),0);
			
			
			
		this.dtOptions = {
			// ajax: 'data/data.json',
			order: [1, 'desc'],
			dom: 'Bfrtip',
			// buttons: ['print','excel'],  ///SI SIRVEEE
			buttons: [{
                extend: 'print',
                filename: 'lista_envios_courier_SIACI_WEB'
            },
            {
                extend: 'excel',
                filename: 'lista_envios_courier_SIACI_WEB'
            }],
			columnDefs: [
            // { width: 200, targets: 0 }
			 { "width": "200px", "targets": 0 }
			],
			fixedColumns: true,
			pageLength: 10,
			processing: true

		};

			this.loading = false;
			// this.rerender();
			
			
			}, 3000)
		
  
  
  
  }
  
  
   ver_listado_completo(): void {
	   
	   const datos = {};
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;
	datos['tipacc'] = this.srv.getTipacc()

	this.srv.lista_pedidos(datos).subscribe(
	   data => {
		   // if (data){
			   // this.loading = false;
		   // }
		   console.log(data)
		   console.log ("EJECUTADA DATA")
			this.lista_pedidos_tabla = data
			this.render_table(this.lista_pedidos_tabla);
			// this.buildDtOptions(this.lista_pedidos)
		}); 

 
	   
   
	// this.render_table(this.listado_original);
  
  }
  
  
  
    render_table(new_list): void {

		this.loading = true
		this.lista_pedidos = undefined
		setTimeout(()=> {	
			console.log("TIME OUT")
			this.lista_pedidos = new_list
		
			this.dtOptions = {
				order: [1, 'desc'],
				dom: 'Bfrtip',
				// buttons: ['print','excel'],  ///SI SIRVEEE
				buttons: [{
					extend: 'print',
					filename: 'LISTA_INGRESOS_SIACI_WEB'+this.usuario
				},
				{
					extend: 'excel',
					filename: 'LISTA_INGRESOS_SIACI_WEB'+this.usuario
				}],
				columnDefs: [
				 { "width": "200px", "targets": 0 }
				],
				fixedColumns: true,
				pageLength: 10,
				 processing: true
			
			};
			
			this.loading = false;
		}, 2000)
  }
  
      reprocesar_auth(numfac): void {
		  
		  if (confirm("Va proceder a realizar el proceso de autorizar esta factura en el SRI, Esta seguro??")){
		  
		    let datos_fe = {}
			datos_fe['numfac'] = numfac
			datos_fe['codemp'] = this.empresa
											
			this.srv.aplicar_fact_electronica(datos_fe).subscribe(
				result => {
					alert("Proceso de Reprocesamiento realizado con Exito..!!!")
					
				}
			)
		  }
	
	}
	
	   regenerar_pdf(auth): void {
		  
		  if (confirm("SE VA PROCEDER A REGENERAR EL PDF DE LA FACTURA AUTORIZADA ..EL PROCESO PUEDE DEMORAR UNOS SEGUNDOS..")){
		  
		    let datos_fe = {}
			datos_fe['auth'] = auth
			datos_fe['codemp'] = this.empresa
											
			this.srv.regenerar_pdf(datos_fe).subscribe(
				result => {
					alert("Regeneracion del PDF iniciado..!!!")
					
				}
			)
			this.buscar_factura_fecha()
		  }
	
	}

	transmitir_courier(numfac): void {
		
		  
		  if (confirm("SE VA PROCEDER A GENERAR LA GUIA, ESTA SEGUROS DE GENERARLA")){
		    this.loading = true;
		    let datos_guia = {}
			datos_guia['numfac'] = numfac
			datos_guia['codemp'] = this.empresa
											
 			this.srv.transmitir_datos_courier(datos_guia).subscribe(
				result => {
					console.log(result)
					if (result['resultado']=="FALLIDO"){
						alert(" ❌ Ocurrio un error en la transmisión")
					}
					if (result['resultado']=="EXITOSO"){
						alert("✅ Transmitido con exito...!!")
					}
					this.buscar_factura_fecha()
					
				}
			) 
			
		  }
	
	}

	transmitir_courier_servientrega(numfac): void {
		
		  
		  if (confirm("SE VA PROCEDER A GENERAR LA GUIA, ESTA SEGUROS DE GENERARLA")){
		    this.loading = true;
		    let datos_guia = {}
			datos_guia['numfac'] = numfac
			datos_guia['codemp'] = this.empresa
											
 			this.srv.transmitir_datos_courier_servientrega(datos_guia).subscribe(
				result => {
					console.log(result)
					if (result['resultado']=="FALLIDO"){
						alert(" ❌ Ocurrio un error en la transmisión")
					}
					if (result['resultado']=="EXITOSO"){
						alert("✅ Transmitido con exito...!!")
					}
					

					this.buscar_factura_fecha()
					
				}
			) 
			
		  }
	
	}

	revision_guia_courier(guia,courier): void {
		
		if (courier == 'LAARCOURIER'){
			this.loading_iframe = true
 			this.srv.revision_guia_laar(guia).subscribe(
				data => {
						console.log(data)
					this.shipment = data
					this.shipment['courier'] = courier
					this.shipment['link_courier'] = "https://fenixoper.laarcourier.com/Tracking/Guiacompleta.aspx?guia="+guia
					this.loading_iframe = false
				}
			) 
			
		}

		if (courier == 'SERVIENTREGA'){
			this.loading_iframe = true

			let data = {
				"guia": guia
			}
  			this.srv.revision_guia_serv(data).subscribe(
				data => {
					console.log(data)
					this.shipment = data
					this.shipment['courier'] = courier
					this.shipment['ciudadOrigen'] = data['Origen']
					this.shipment['ciudadDestino'] = data['Destino']
					this.shipment['estadoActual'] = data['Estado_actual']
					this.shipment['destinatarioFecha'] = data['Fecha_entrega']
					
					this.shipment['noGuia'] = guia
                	this.shipment['link_courier'] ="https://www.servientrega.com.ec/Tracking/?guia=9008931603&tipo=GUIA" 
					this.loading_iframe = false
				})  

				
			
			
		}
	}

	
	
	
	// ver_ticket(numfac): void {
		  
		  // // if (confirm("Va proceder a realizar el proceso de autorizar esta factura en el SRI, Esta seguro??")){
		  
		    // let datos_fe = {}
			// datos_fe['numfac'] = numfac
			// datos_fe['codemp'] = this.empresa
			
			// alert("######  Ver Ticket  ####")
											
			// // this.srv.aplicar_fact_electronica(datos_fe).subscribe(
				// // result => {
					// // alert("Proceso de Reprocesamiento realizado con Exito..!!!")
					
				// // }
			// // )
			
		  // // }
	
	// }
	
		anular_factura(numfac): void {
		  
		  if (confirm("Va proceder a *** ANULAR *** esta factura, además se debe anular la factura en el SRI..Esta seguro de anular??")){
		  
		    let datos_fe = {}
			datos_fe['numfac'] = numfac
			datos_fe['codemp'] = this.empresa
			
			// alert("######  Ver Ticket  ####")
											
			this.srv.anular_factura(datos_fe).subscribe(
				result => {
					alert("Proceso de anulacion realizado con Exito..!!!")
					this.buscar_factura_fecha()
					
				}
			)
			

			
		  }
	
	}

	anular_guia(numfac): void {
		if (confirm("Va proceder a *** ANULAR *** esta factura, además se debe anular la factura en el SRI..Esta seguro de anular??")){
		let datos_guia_anular= {
			numtra_guia : numfac,
			tipodocumento: 'GR',
			status: 'A',
			codemp: this.empresa
		}
		this.srv.anulacion_guia_convert_fac(datos_guia_anular).subscribe(
				result => {
					alert("Proceso de anulacion de guia realizado con Exito..!!!")
					this.buscar_factura_fecha()
						//this.router.navigate(['/admin/lista_envios', datos]);
				})
		}

	}


	traducir_chino_status(){
     // this.shipment

	  

	  	let datos_trad = {
    		"q": "casa",
    		"source": "es",
   			 "target": "zh"
		}

	// alert("######  Ver Ticket  ####")
											
		this.srv.traducir_palabra_chino(datos_trad).subscribe(
				result => {
					console.log(result)
				
					
				}
			)

	}

	redondear (el) {
		// console.log("ENTRADA ARTICULO REDONDEAR")
		// console.log(el)
	return Math.round(el * 100) / 100;
    }

  isAllSelected() {
	  console.log ("############  ISALLSELECT  ############")
	  console.log (this.lista_pedidos)
  
    this.masterSelected = this.lista_pedidos.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }


  checkUncheckAll() {
    for (var i = 0; i < this.lista_pedidos.length; i++) {
	  console.log (this.lista_pedidos[i].status)
 	  if (this.lista_pedidos[i].tracking == null){
		this.lista_pedidos[i].isSelected = this.masterSelected;
	  } 
	  //this.lista_pedidos[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  getCheckedItemList(){
	this.elements_checkedList = [];

	for (var i = 0; i < this.lista_pedidos.length; i++) {
			// console.log ('dentro de checkItemlist');
		if(this.lista_pedidos[i].isSelected){
			this.elements_checkedList.push(this.lista_pedidos[i]);
		}
		
  
    }

	console.log ('Elementos checkeados');
	console.log (this.elements_checkedList);


  }
  
  


	
	
}
