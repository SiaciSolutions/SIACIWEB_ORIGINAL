import { Component, OnDestroy, OnInit,ViewChild,Renderer,AfterViewInit } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'
// import { mapTo, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { HttpClient, HttpResponse } from '@angular/common/http';

class Person {
  id: number;
  firstName: string;
  lastName: string;
}



class Lista_pedidos_clase {
  codcli: string;
  fectra: string;
  nomcli:string;
  numtra: string;
  observ: string;
  status: string;
  total_iva: number;
  
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

// import 'rxjs/add/operator/map';

declare var AdminLTE: any;


@Component({
  selector: 'app-admin-lista-pedidos',
  templateUrl: './admin-lista-pedidos.component.html',
  styleUrls: ['./admin-lista-pedidos.component.css']
})



	

export class AdminListaPedidosComponent implements OnInit {
	
	  parametros: {usuario: string, empresa: string};
	
	 myControl = new FormControl();
	 myControl2 = new FormControl();
	filteredOptions: Observable<string[]>;
	filteredarticulo: Observable<string[]>;
	public clientes : boolean;
	public exist_articulo : boolean;
	public razon_social : string;
	public subtotal;
	public total;
	public today= new Date();
	public edit_cant: boolean
	public desc_cant = 0
	public iva_cant = 0
	desc_porcentaje = 0;
	public iva_porcentaje = 0;
	subtotal_desc = 0;
	public iva_siaci
	public observacion_pedido = ''

	
	
	jstoday = '';
	fectra = '';
	// public date : string;
	// clientes;
	usuario = ''
	empresa = ''
	ruc = '';
	patron_articulo = '';
	cantidad_nueva = '';

	// editART: ARTICULO
	editART: any = []
	dato_cliente
	
	options: any = []
	articulo: any = []
	articulos_seleccionado
	elements_checkedList:any = [];
	 masterSelected:boolean;
	 
	 	// articulos_pedido: any = [
	// { codart: "0 001 121 016", nomart: "MOTOR DE ARRANQUE GOLF IV", prec01: "270", cant: "1" },
	// { codart: "0001", nomart: "FOCO LUZ DE SALON", prec01: "0.8", cant: "2"  },	
	// { codart: "0002", nomart: "SPOILER DEL  GOL 2000", prec01: "53.81",cant: "2" },
	// { codart: "0003", nomart: "JGO SPOILER LATERAL GOL 2000 4 PTAS", prec01: "119.18",cant: "2"},
	// { codart: "0004", nomart: "JGO  SPOILER LATERAL GOL 2000", prec01: "119.18",cant: "2" },
	// { codart: "0005", nomart: "SPOILER POSTERIOR  GOL III", prec01: "68", cant: "2" }
	// ]
	public lista_pedidos: Lista_pedidos_clase[];

	


	
	
// http://192.168.0.55:4401/admin/lista_pedidos;usuario=supervisor;password=;empresa=01

	dtOptions: DataTables.Settings = {};
	persons: Person[];


  // constructor( private renderer: Renderer, private router: Router, private srv: ApiService, private route: ActivatedRoute) 
   constructor( private router: Router, private srv: ApiService, private route: ActivatedRoute, private http: HttpClient) 
  { 
  console.log ('ESTOY EN CONSTRUCTOR LISTAR PEDIDOS')

  
  
  }
 

 
   // ngOnInit() {
	   
	   	// this.usuario = this.route.snapshot.params.usuario;
		// this.empresa = this.route.snapshot.paramMap.get('empresa');
		
		// const datos = {};
		// datos['codemp'] = this.empresa;
	   // let celdas_pedidos
	   // this.srv.lista_pedidos(datos).subscribe(
	   // data => {
		   
		   // for (celdas_pedidos of data) {
			   // console.log(celdas_pedidos)
			   
		   // }
		   
		   // // console.log ("COMIENZO DELAY")
		   // // console.log (data)
		   	// this.lista_pedidos = data
			
			
		 // // setTimeout(() => {
           	// // this.lista_pedidos = data
            // // }, 5000);
		   // console.log ("FIN DELAY")
			// }); 
		// this.getPedidos();
		// AdminLTE.init();
	
	
	// }
	
	
	
	// ngOnInit(): void {
		
		// const that = this
		
		// this.usuario = this.route.snapshot.params.usuario;
		// this.empresa = this.route.snapshot.paramMap.get('empresa');
		// const datos = {};
		// datos['codemp'] = this.empresa;
	
	// this.dtOptions = {
      // pagingType: 'full_numbers',
      // pageLength: 2
    // };
	
	// this.srv.lista_pedidos(datos).map(this.extractData).subscribe(
	   // data => {
		   
		   // // // console.log ("COMIENZO DELAY")
		   // console.log (data)
		   // this.lista_pedidos = data
		   // this.dtTrigger.next();
		   // // this.persons = persons;
		   
	// // this.http.get('data/data.json').map(this.extractData).subscribe(
		// // persons => {
        // // this.persons = persons;
        // // // Calling the DT trigger to manually render the table
        // // this.dtTrigger.next();
      // // });
		   
		   
		   
		   

			// }); 
	
	
	
  // AdminLTE.init();
  // }
  
  
  
  
   // ngOnInit(): void {
    // const that = this;

    // this.dtOptions = {
      // pagingType: 'full_numbers',
      // pageLength: 12,
      // serverSide: true,
      // processing: true,
      // ajax: (dataTablesParameters: any, callback) => {
        // that.http
          // .post<DataTablesResponse>(
            // 'https://angular-datatables-demo-server.herokuapp.com/',
            // dataTablesParameters, {}
          // ).subscribe(resp => {
			  // console.log (resp.data)
			  // console.log (resp.recordsTotal)
			  // console.log (resp.recordsFiltered)
			  
            // that.persons = resp.data;

            // callback({
              // recordsTotal: resp.recordsTotal,
              // recordsFiltered: resp.recordsFiltered,
              // data: []
            // });
          // });
      // },
      // columns: [{ data: 'id' }, { data: 'firstName' }, { data: 'lastName' }]
    // };
	  // AdminLTE.init();
  // }  ////FIN ONINIT MODELO
  
  	  // { data: 'numtra' }, { data: 'codcli' }, { data: 'fectra' },{ data: 'nomcli' },{ data: 'observ' },{ data: 'totnet' },{ data: 'iva_cantidad' },{ data: 'estado'},{ data: 'estado'},{ data: 'total_iva'},{ data: 'status'}
	 
  
  
    
   ngOnInit(){
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            // 'https://angular-datatables-demo-server.herokuapp.com/',
			'http://localhost:5001/lista_pedidos',
            dataTablesParameters, {}
          ).subscribe(resp => {
			  console.log (resp.data)
			  that.lista_pedidos = resp.data
            // that.persons = resp.data;
			// that.persons = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      // columns: [{ data: 'numtra' }, { data: 'codcli' }, { data: 'fectra' }]
	   // columns: [{ data: 'numtra' }, { data: 'codcli' }, { data: 'fectra' },{ data: 'nomcli' },{ data: 'total_iva'},{ data: 'observ' },{ data: 'status'}]
	   columns: [{ data: 'codcli' }, { data: 'fectra' },{ data: 'nomcli' },{ data: 'numtra' },{ data: 'observ'},{ data: 'status'},{ data: 'total_iva'}]
	  // columns: [{ data: 'codcli' }, { data: 'estado' }, { data: 'fectra' },{ data: 'iva_cantidad' },{ data: 'nomcli'},{ data: 'numtra' },{ data: 'observ'},{ data: 'status'},{ data: 'total_iva'},{ data: 'totnet'}]
	  // this.usuario = this.route.snapshot.params.usuario;
	  // codemp: this.route.snapshot.paramMap.get('empresa');
	  
	  
    };
	  AdminLTE.init();
  }  ////FIN ONINIT MODELO
  
  
  
  
  
  
  
						
		
}
