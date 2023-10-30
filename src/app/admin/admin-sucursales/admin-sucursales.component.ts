import { Component, OnInit,ViewChild } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-sucursales',
  templateUrl: './admin-sucursales.component.html',
  styleUrls: ['./admin-sucursales.component.css']
})



	

export class AdminSucursalesComponent implements OnInit {

	usuario;
	empresa;
	public loading : boolean;

	public success
	public success_act
	pedido_status
	patron_cliente
	razon_social_lista;
	exist_razon_social;
	exist_sucursales
	lista_sucursales
	public lista_sucursales_datatable
	public edit_direcc
	public dato_cliente
	public edit_ruta
	public lista_rutas 

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute)
  
  { 
  this.loading = false;

  
  }
  
  
  title = 'Example of Angular 8 DataTable';
  // dtOptions: DataTables.Settings = {};
  dtOptions:any = {};
	 
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
	  
	let datos = {};
	datos['codemp'] = this.empresa;	
	  
	  
	this.srv.get_rutas(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO RUTAS")
		   console.log(data)
		   this.lista_rutas = data
		}); 
	   
	
		// setTimeout(()=> {	
			// console.log("TIME OUT")
			// // console.log(this.lista_pedidos)
			// this.lista_pedidos = this.lista_pedidos_tabla
			
			
		// this.dtOptions = {
			// order: [1, 'desc'],
			// dom: 'Bfrtip',
			// // buttons: ['print','excel'],  ///SI SIRVEEE
			// buttons: [{
                // extend: 'print',
                // filename: 'LISTA_PEDIDOS_SIACI_WEB'+this.usuario
            // },
            // {
                // extend: 'excel',
                // filename: 'LISTA_PEDIDOS_SIACI_WEB'+this.usuario
            // }],
			// columnDefs: [
            // // { width: 200, targets: 0 }
			 // { "width": "200px", "targets": 0 }
			// ],
			// fixedColumns: true,
			// pageLength: 10,
			
			
			
			

			
			 // processing: true
		 
		// };

			// this.loading = false;
			
			
			// }, 3000)	


	
	
	AdminLTE.init();
	
	}//FIN ONINIT
	
	
	busqueda_razon_social() { 
	if (this.patron_cliente){
		
		this.exist_sucursales = false
		
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
	 
	 
	buscar_sucursales(rz,codcli) {
		 console.log ("Seleccion de cliente")
		 this.loading = true;
		
		this.dato_cliente= {"nomcli":rz,"codcli":codcli}
		// console.log (this.dato_cliente)
	
		let datos = {}
		datos['codemp'] = this.empresa;	
		datos['codcli'] = codcli

		this.srv.cosulta_sucursales(datos).subscribe(data => {
				// console.log(data)
				let longitud_data = data.length

			if (longitud_data > 0 ) {
				console.log(data)
				this.lista_sucursales = data
				// this.exist_sucursales = true
				
				// this.loading = false;

				// this.razon_social_lista = data;
				// this.exist_razon_social = true;
				
		setTimeout(()=> {	
			console.log("TIME OUT")
			this.lista_sucursales_datatable = this.lista_sucursales
			
			
		this.dtOptions = {
			order: [0, 'asc'],
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
		
				this.exist_sucursales = true
				this.loading = false;	
			
			
			}, 2000)
			}else {
				alert("Agencias no creadas para esta Razón Social: "+rz);
				// this.searching_articulo = false
				this.exist_sucursales = false;
				this.loading = false;
			}

			}); 

	 }
	 
	public edit_dir_sucursal(sucursal){
		console.log ("##### EDIT DIR SUCURSAL  ####")
		console.log (sucursal)
		// console.log (sucursal["codart"])
		this.edit_direcc=sucursal
		// this.get_prec_produc(articulos["codart"])

	}
	
	public update_dato_sucursal(id_agencia,new_dato,dato){
		console.log ("##### EDIT DIR SUCURSAL  ####")
		
		let datos = {};
		if (dato == 'D'){
			datos['codemp'] = this.empresa;
			datos['dir_agencia'] = new_dato
			datos['id_agencia'] = id_agencia
			datos['dato'] = dato
		}
		if (dato == 'R'){
			datos['codemp'] = this.empresa;
			datos['idruta'] = new_dato
			datos['id_agencia'] = id_agencia
			datos['dato'] = dato
		}


		// (datos['dir_agencia'],datos['id_agencia'])
		this.srv.update_dato_sucursal(datos).subscribe(data => {
				console.log(data)
				
				
				// let longitud_data = data.length

			// if (longitud_data > 0 ) {
				// console.log(data)

				// this.razon_social_lista = data;
				// this.exist_razon_social = true;
				// // this.searching_articulo = false
				
		
				
			// }else {
				// alert("Razon Social no encontrado con la palabra clave ingresada <<"+this.patron_cliente+">>");
				// // this.searching_articulo = false
				// this.exist_razon_social = false;
			// }

			}); 
		
		this.edit_direcc=undefined
		this.buscar_sucursales(this.dato_cliente['nomcli'],this.dato_cliente['codcli'])
		

	}
	
	public edit_ruta_sucursal(sucursal){
		console.log ("##### EDIT RUTA SUCURSAL  ####")
		console.log (sucursal)
		this.edit_ruta=sucursal
	
	}
	
	 
	 
	
	

	

	
	
}
