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
  selector: 'app-admin-pedidos',
  templateUrl: './admin-lista-pedidos.component.html',
  styleUrls: ['./admin-lista-pedidos.component.css']
})



	

export class AdminListaPedidosComponent implements OnInit {
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
	datos['tipacc'] = this.srv.getTipacc()
	console.log (this.usuario)
	console.log (this.empresa)
	console.log (datos)
	// console.log ("##### DATATABLELEMENT  #####")
	// console.log(this.datatableElement)
	
	
	
	// localStorage.removeItem('listado_original')
	
	
	this.srv.lista_pedidos(datos).subscribe(
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
			order: [1, 'desc'],
			dom: 'Bfrtip',
			// buttons: ['print','excel'],  ///SI SIRVEEE
			buttons: [{
                extend: 'print',
                filename: 'LISTA_PEDIDOS_SIACI_WEB'+this.usuario
            },
            {
                extend: 'excel',
                filename: 'LISTA_PEDIDOS_SIACI_WEB'+this.usuario
            }],
			columnDefs: [
            // { width: 200, targets: 0 }
			 { "width": "200px", "targets": 0 }
			],
			fixedColumns: true,
			pageLength: 10,
			
			
			
			

			
			 processing: true
		  // data:this.dtUsers,
		  // columns: [{title: 'User ID', data: 'id'},
				// {title: 'First Name', data: 'firstName'},
				// {title: 'Last Name', data: 'lastName' }]
		};
		
			// this.dtOptions = {
			  // data:this.lista_pedidos,
			  // columns: [{title: 'Codigo_Cliente', data: 'codcli'},
					// {title: 'Fecha_Transaccion', data: 'fectra'},
					// {title: 'Nombre_cliente', data: 'nomcli' },
					// {title: 'Numero_transaccion', data: 'numtra' },
					// {title: 'Observacion', data: 'observ' },
					// {title: 'Estado', data: 'status' },
					// {title: 'Total_iva', data: 'total_iva' }
					// ]
				// };
			this.loading = false;
			// this.rerender();
			
			
			}, 3000)

	this.srv.get_rutas(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO RUTAS")
		   console.log(data)
		   this.lista_rutas = data
		}); 
		
	// let filtro = this.lista_pedidos.filter(Element.key == '27-05-2021');


	
	
	AdminLTE.init();
	
	}//FIN ONINIT
	
  // ngAfterViewInit(): void {
    // this.dtTrigger.next();
  // }

  // ngOnDestroy(): void {
    // // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  // }

  // rerender(): void {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // // Destroy the table first
      // dtInstance.destroy();
      // // Call the dtTrigger to rerender again
      // // this.dtTrigger.next();
    // });
  // }
  
  
    buscar_fecha_entrega(): void {

		
		console.log ('RENDER')
		console.log (this.fecha_entrega_busqueda)
		if (this.fecha_entrega_busqueda){
			let fecha_entrega_busqueda = formatDate(this.fecha_entrega_busqueda, 'dd-MM-yyyy', 'en-US', '-0500')
			console.log (fecha_entrega_busqueda);
			console.log (this.lista_pedidos)
			
			  var newArray = this.listado_original.filter(function (el) {
			  // return el.fecha_entrega == '27-05-2021'
			  return el.fecha_entrega == fecha_entrega_busqueda
			});
			
			if (newArray.length > 0){
			console.log (newArray)
			this.render_table(newArray);
			}else {
				alert ("No existen pedidos cargados para la feche de entrega ingresada")
				this.loading = false
			}
			
			
		}else {
			alert ("Por favor ingrese fecha de entrega")
			this.loading = false
		}
  
  
  
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
					filename: 'LISTA_PEDIDOS_SIACI_WEB'+this.usuario
				},
				{
					extend: 'excel',
					filename: 'LISTA_PEDIDOS_SIACI_WEB'+this.usuario
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

	  // After(): void {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // dtInstance.columns().every(function () {
        // const that = this;
        // $('input', this.footer()).on('keyup change', function () {
          // if (that.search() !== this['value']) {
            // that
              // .search(this['value'])
              // .draw();
          // }
        // });
      // });
    // });
  // }
	
	
	
	
	
	public update_ruta(numtra,id_agencia,id_ruta_new){
		console.log ("##### EDIT DIR SUCURSAL  ####")
		
		
		
		let datos_pedido_ruta = {};
										
		datos_pedido_ruta['empresa'] = this.empresa
		datos_pedido_ruta['numtra_pedido'] = numtra
		datos_pedido_ruta['idruta'] = id_ruta_new
		datos_pedido_ruta['id_agencia'] = id_agencia
		
		console.log ("ACTUALIZANDO PEDIDO RUTA")
		console.log (datos_pedido_ruta)
		this.srv.update_sucursal_pedido(datos_pedido_ruta).subscribe(
			result => {
				console.log(result)
			
			},
			error => {
				console.error(error)
			}
		)
		

		
		// this.buscar_sucursales(this.dato_cliente['nomcli'],this.dato_cliente['codcli'])
		
			// alert("Se recargará la página para reflejar los cambios")
		let opcion = confirm("Esta seguro de cambiar la ruta? La sucursal puede no estar en nueva ruta seleccionada");
		 
		if (opcion == true) {

			this.edit_ruta=undefined
			let datos = {}
		datos["usuario"] = this.usuario
		datos["empresa"] = this.empresa

		
		this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
		this.router.navigate(['/admin/lista_pedidos',datos]);
		}); 
			
		} else {
			// mensaje = "Has clickado Cancelar";
			this.edit_ruta=undefined
		}
		
		



		

	}
	
	public edit_ruta_pedido(pedido){
		console.log ("##### EDIT RUTA SUCURSAL  ####")
		console.log (pedido)
		this.edit_ruta=pedido
	
	}
	
	correo_facturacion(numtra,nomcli) {
		
		let confirm_facturacion = confirm('Usted va a enviar correo para ordenar la facturación del pedido, está seguro en enviar?.');
		
		if (confirm_facturacion){
				console.log("CORREO FACTURACION")	
				console.log (numtra)
				console.log (nomcli)
				
				
				const datos = {};
				datos['codemp'] = this.empresa;
				datos['usuario'] = this.usuario;
				datos['nomcli'] = nomcli
				datos['num_ped'] = numtra
				datos['asunto'] = 'facturacion'
				
				this.espera_correo_facturacion = true;
				this.espera_exitoso_facturacion = false;
				this.srv.mail(datos).subscribe(
					data => {
						
							this.espera_correo_facturacion = false;
							this.espera_exitoso_facturacion = true;
							console.log(data)
					}
				)
			
		}else{
			console.log("NO ENVIO NADA")	
		}

		

	}//FIN ENVIO CORREO FACTURACION
	
	
	// confirm_(){

		// return confirm('Usted va a enviar correo para ordenar la facturación del pedido, está seguro en enviar?.');
		
		
	// }
	
	correo_pedido(numtra,nomcli,email) {
		
		let confirm_pedido = confirm('Usted va a reenviar correo del pedido a su cliente, está seguro de reenviar?');
		if (confirm_pedido){
		
		console.log("CORREO FACTURACION")
		console.log (numtra)
		console.log (nomcli)
		console.log (email)
		// alert("Por favor ingrese RUC del cliente");
			if (email) {
				const datos = {};
				datos['codemp'] = this.empresa;
				datos['usuario'] = this.usuario;
				datos['nomcli'] = nomcli
				datos['num_ped'] = numtra
				datos['asunto'] = 'pedido'
				datos['email'] = email
				
				this.espera_correo_pedido = true;
				this.espera_exitoso_pedido = false;
				this.srv.mail(datos).subscribe(
					data => {
						this.espera_correo_pedido = false;
						this.espera_exitoso_pedido = true;
						console.log(data)
					}
				)
			}else {
				alert("Correo del cliente a enviar no disponible. Favor modificar agregar correo en la ficha del cliente.");
				
			}
		}else{
				console.log("NO ENVIO NADA")	
			}

	}//FIN ENVIO CORREO PEDIDO
	
	
}
