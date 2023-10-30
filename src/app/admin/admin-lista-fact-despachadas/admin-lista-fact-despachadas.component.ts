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
  selector: 'app-admin-despachos',
  templateUrl: './admin-lista-fact-despachadas.component.html',
  styleUrls: ['./admin-lista-fact-despachadas.component.css']
})



	

export class AdminListaFacDespachadasComponent implements OnInit {
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
	pedido_status
	public edit_ruta
	lista_rutas
	fecha_entrega_busqueda
	listado_original
	
    public tipo_doc_origen = [
			{"tipo": "FAC", "descripcion": "FACTURA DE VENTA"},
			{"tipo": "EGR", "descripcion": "EGRESO DE BODEGA"}
		];
	tipo_origen = 'FAC'
	ver_factura = true
	ver_egreso = false
	
	fecha_desde
	fecha_hasta


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
		this.pedido_status = params['pedido'] || this.route.snapshot.paramMap.get('pedido');
      });
	   
	 if (this.pedido_status == 'success'){
		 this.success = true
	 }else if (this.pedido_status == 'success_act'){
		 this.success_act = true
	 }
	 console.log("SUCCESS STATUS")
	 console.log(this.success)
	// this.usuario = this.route.snapshot.params.usuario;
	// this.empresa = this.route.snapshot.paramMap.get('empresa');	
	const datos = {};
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;
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
	
	
	this.srv.lista_egresos_facturas_despachadas(datos).subscribe(
	   data => {
		   this.loading = true
		   // if (data){
			   // this.loading = false;
		   // }
		   console.log(data)
		   console.log ("EJECUTADA DATA")
			this.lista_pedidos_tabla = data
			// this.buildDtOptions(this.lista_pedidos)
			this.ver_egreso = false
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
                filename: 'LISTA_INGRESOS_SIACI_WEB'+this.usuario
            },
            {
                extend: 'excel',
                filename: 'LISTA_INGRESOS_SIACI_WEB'+this.usuario
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
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;
	datos['fecha_desde'] = this.fecha_desde
	datos['fecha_hasta'] = this.fecha_hasta
	
	
		this.srv.lista_egresos_facturas_despachadas(datos).subscribe(
	   data => {
		   // if (data){
			   // this.loading = false;
		   // }
		   this.loading = true
		   console.log(data)
		   console.log ("EJECUTADA DATA")
			this.lista_pedidos_tabla = data
			// this.buildDtOptions(this.lista_pedidos)
			this.ver_egreso = false
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
                filename: 'LISTA_FACTURAS_PENDIENTE_DESPACHO_'+this.fecha_desde+'_'+this.fecha_desde
            },
            {
                extend: 'excel',
                filename: 'LISTA_FACTURAS_PENDIENTE_DESPACHO_'+this.fecha_desde+'_'+this.fecha_desde
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
  
  autorizar_factura(idfactura): void {
	  if (confirm("Esta seguro de autozizar factura")){
		  console.log ("#####  Autorizar factura  ##########")
		  let datos = {}
		  datos ['idfactura'] = idfactura
		  datos['codemp'] = this.empresa
		  
		  	this.srv.autorizar_facturas_despachadas(datos).subscribe(
			   data => {
				   alert ("Factura enviada a Autorizar con exito...!!!")
				   console.log (data)
				   this.ngOnInit()
			   }
	   
			)
		  
		  
		  
		  
	  }
  
  
  }
  
  
   ver_listado_completo(): void {
	   
	   const datos = {};
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;
	datos['tipacc'] = this.srv.getTipacc()

	this.srv.lista_egresos_facturas(datos).subscribe(
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
  
    busqueda_egreso(): void {
		
	let datos = {}
	datos['fecha_desde'] = this.fecha_desde
	datos['fecha_hasta'] = this.fecha_hasta
	datos['codemp'] = this.empresa;
	
	
	this.loading = true
		
		
	if (this.tipo_origen == 'FAC'){
	this.srv.lista_egresos_facturas(datos).subscribe(
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
                filename: 'LISTA_ING_FAC_SIACI_WEB'+this.usuario
            },
            {
                extend: 'excel',
                filename: 'LISTA_ING_FAC_SIACI_WEB'+this.usuario
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
			this.ver_egreso = false
			this.ver_factura = true
			// this.rerender();
			
			
			}, 3000)
			
	}
	if (this.tipo_origen == 'EGR'){
			this.srv.lista_egresos_bodega(datos).subscribe(
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
                filename: 'LISTA_EGR_BODEGA_SIACI_WEB'+this.usuario
            },
            {
                extend: 'excel',
                filename: 'LISTA_EGR_BODEGA_SIACI_WEB'+this.usuario
            }],
			columnDefs: [
            // { width: 200, targets: 0 }
			 { "width": "200px", "targets": 0 }
			],
			fixedColumns: true,
			pageLength: 10,
			processing: true

		};
			this.ver_factura = false
			this.ver_egreso = true
			this.loading = false;
			// this.rerender();
			
			
			}, 3000)
		
		
	}

	
  }

	
	
}
