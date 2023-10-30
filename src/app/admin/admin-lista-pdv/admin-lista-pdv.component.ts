import { Component, OnInit,ViewChild } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'
import {DataTableDirective} from 'angular-datatables';

// import { Subject } from 'rxjs';



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-pdv',
  templateUrl: './admin-lista-pdv.component.html',
  styleUrls: ['./admin-lista-pdv.component.css']
})



	

export class AdminListaPdvComponent implements OnInit {
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
	
	
	
	// localStorage.removeItem('listado_original')
	
	
	this.srv.lista_ventas_pdv(datos).subscribe(
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
			
			
		this.dtOptions = {
			// ajax: 'data/data.json',
			order: [0, 'desc'],
			dom: 'Bfrtip',
			// buttons: ['print','excel'],  ///SI SIRVEEE
			buttons: [{
                extend: 'print',
                filename: 'LISTA_VENTAS_PDV_SIACI_WEB'+this.usuario
            },
            {
                extend: 'excel',
                filename: 'LISTA_VENTAS_PDV_SIACI_WEB'+this.usuario
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
	
	}//FIN ONINIT
	
 
  
    buscar_factura_fecha(): void {
		let datos = {};
		this.loading = true;
		datos['codemp'] = this.empresa;	
		datos['codagencia'] = this.srv.getCodAgencia();	
		datos['usuario'] = this.usuario;
		datos['fecha_desde'] = this.fecha_desde
		datos['fecha_hasta'] = this.fecha_hasta
	    datos['codalm'] = this.srv.getCodAgencia();	
		datos['api_url'] = this.srv.apiUrl+':'+this.srv.port;
	
	
	this.srv.lista_ventas_pdv(datos).subscribe(
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
			
			
		this.dtOptions = {
			// ajax: 'data/data.json',
			order: [0, 'desc'],
			dom: 'Bfrtip',
			// buttons: ['print','excel'],  ///SI SIRVEEE
			buttons: [{
                extend: 'print',
                filename: 'LISTA_VENTAS_PDV_SIACI_WEB'
            },
            {
                extend: 'excel',
                filename: 'LISTA_VENTAS_PDV_SIACI_WEB'
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
				order: [0, 'desc'],
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
  
  


	
	
}
