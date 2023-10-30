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

// import { HttpClient, HttpResponse } from '@angular/common/http';

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
	
	
	title = 'Example of Angular 8 DataTable';
  // dtOptions: DataTables.Settings = {};
  
  public lista_pedidos: any = []
  	usuario = ''
	empresa = ''
  
  dtUsers =[
    {"id": 101, "firstName": "Anil", "lastName": "Singh"},
    {"id": 102, "firstName": "Reena", "lastName": "Singh"},
    {"id": 103, "firstName": "Aradhay", "lastName": "Simgh"},
    {"id": 104, "firstName": "Dilip", "lastName": "Singh"},
    {"id": 105, "firstName": "Alok", "lastName": "Singh"},
    {"id": 106, "firstName": "Sunil", "lastName": "Singh"},
    {"id": 107, "firstName": "Sushil", "lastName": "Singh"},
    {"id": 108, "firstName": "Sheo", "lastName": "Shan"},
    {"id": 109, "firstName": "Niranjan", "lastName": "R"},
    {"id": 110, "firstName": "Lopa", "lastName": "Mudra"},
    {"id": 111, "firstName": "Paramanand","lastName": "Tripathi"}
  ];
  
  
  // lista_pedidos: any = [
      // {
      // "numtra": "20000115",
      // "codcli": "CONFIN",
      // "fectra": "2018-08-20",
      // "nomcli": "CONSUMIDOR FINAL",
      // "observ": null,
      // "totnet": 82.64,
      // "iva_cantidad": 9.92,
      // "estado": "P",
      // "total_iva": 92.56,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "20000117",
      // "codcli": "CONFIN",
      // "fectra": "2018-09-18",
      // "nomcli": "CONSUMIDOR FINAL",
      // "observ": null,
      // "totnet": 318.21,
      // "iva_cantidad": 38.19,
      // "estado": "P",
      // "total_iva": 356.4,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "10000212",
      // "codcli": "CONFIN",
      // "fectra": "2019-04-28",
      // "nomcli": "CONSUMIDOR FINAL",
      // "observ": null,
      // "totnet": 14.79,
      // "iva_cantidad": 1.77,
      // "estado": "P",
      // "total_iva": 16.56,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000025",
      // "codcli": "CL010056",
      // "fectra": "2019-09-16",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 62.02,
      // "iva_cantidad": 7.4424,
      // "estado": "P",
      // "total_iva": 69.46,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000026",
      // "codcli": "CL010056",
      // "fectra": "2019-09-16",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 73.64,
      // "iva_cantidad": 8.8368,
      // "estado": "P",
      // "total_iva": 82.48,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000027",
      // "codcli": "CL010056",
      // "fectra": "2019-09-16",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 110.01,
      // "iva_cantidad": 13.2012,
      // "estado": "P",
      // "total_iva": 123.21,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000028",
      // "codcli": "CL010056",
      // "fectra": "2019-09-16",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 125,
      // "iva_cantidad": 15,
      // "estado": "P",
      // "total_iva": 140,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000029",
      // "codcli": "CL010056",
      // "fectra": "2019-09-16",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 144.11,
      // "iva_cantidad": 17.2932,
      // "estado": "P",
      // "total_iva": 161.4,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000030",
      // "codcli": "CL010056",
      // "fectra": "2019-09-16",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 1161.9,
      // "iva_cantidad": 139.43,
      // "estado": "P",
      // "total_iva": 1301.33,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000031",
      // "codcli": "0",
      // "fectra": "2019-09-17",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": null,
      // "totnet": 115.66,
      // "iva_cantidad": 13.88,
      // "estado": "P",
      // "total_iva": 129.54,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000032",
      // "codcli": "CL010056",
      // "fectra": "2019-09-17",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 287.25,
      // "iva_cantidad": 34.47,
      // "estado": "P",
      // "total_iva": 321.72,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000033",
      // "codcli": "CL010056",
      // "fectra": "2019-09-17",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 287.25,
      // "iva_cantidad": 34.47,
      // "estado": "P",
      // "total_iva": 321.72,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000034",
      // "codcli": "CL010056",
      // "fectra": "2019-09-17",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": "OBSERVACION GENERAL",
      // "totnet": 18003.0026,
      // "iva_cantidad": 2160.36,
      // "estado": "P",
      // "total_iva": 20163.36,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000035",
      // "codcli": "CL010056",
      // "fectra": "2019-09-17",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 7661.35,
      // "iva_cantidad": 919.36,
      // "estado": "P",
      // "total_iva": 8580.71,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000036",
      // "codcli": "CL010056",
      // "fectra": "2019-09-17",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": null,
      // "totnet": 7661.35,
      // "iva_cantidad": 919.36,
      // "estado": "P",
      // "total_iva": 8580.71,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000037",
      // "codcli": "0",
      // "fectra": "2019-09-17",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": null,
      // "totnet": 123.34,
      // "iva_cantidad": 14.8,
      // "estado": "P",
      // "total_iva": 138.14,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000038",
      // "codcli": "0",
      // "fectra": "2019-09-17",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "puede ser para mañana, urgente",
      // "totnet": 123.34,
      // "iva_cantidad": 14.8,
      // "estado": "P",
      // "total_iva": 138.14,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000039",
      // "codcli": "0",
      // "fectra": "2019-09-17",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "puede ser para mañana, urgente",
      // "totnet": 123.34,
      // "iva_cantidad": 14.8,
      // "estado": "P",
      // "total_iva": 138.14,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000040",
      // "codcli": "0",
      // "fectra": "2019-09-17",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "puede ser para mañana, urgente",
      // "totnet": 123.34,
      // "iva_cantidad": 14.8,
      // "estado": "P",
      // "total_iva": 138.14,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000041",
      // "codcli": "0",
      // "fectra": "2019-09-17",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "puede ser para mañana, urgente",
      // "totnet": 123.34,
      // "iva_cantidad": 14.8,
      // "estado": "P",
      // "total_iva": 138.14,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000042",
      // "codcli": "0",
      // "fectra": "2019-09-17",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "",
      // "totnet": 123.34,
      // "iva_cantidad": 14.8,
      // "estado": "P",
      // "total_iva": 138.14,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000043",
      // "codcli": "CL010056",
      // "fectra": "2019-09-18",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": "para ayer",
      // "totnet": 36.37,
      // "iva_cantidad": 4.36,
      // "estado": "P",
      // "total_iva": 40.73,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000044",
      // "codcli": "CL010056",
      // "fectra": "2019-09-18",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": "",
      // "totnet": 36.37,
      // "iva_cantidad": 4.36,
      // "estado": "P",
      // "total_iva": 40.73,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000045",
      // "codcli": "CL010056",
      // "fectra": "2019-09-18",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": "URGENTEEEEEEEEE",
      // "totnet": 1548,
      // "iva_cantidad": 185.76,
      // "estado": "P",
      // "total_iva": 1733.76,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000046",
      // "codcli": "CL010056",
      // "fectra": "2019-09-18",
      // "nomcli": "GARNER ESPINOSA S.A",
      // "observ": "tdo bien",
      // "totnet": 106.17,
      // "iva_cantidad": 12.74,
      // "estado": "P",
      // "total_iva": 118.91,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000047",
      // "codcli": "0",
      // "fectra": "2019-09-19",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "puede ser para mañana, urgente",
      // "totnet": 4235,
      // "iva_cantidad": 508.2,
      // "estado": "P",
      // "total_iva": 4743.2,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000048",
      // "codcli": "0",
      // "fectra": "2019-09-19",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "URGENTEEEEEEEEEEEE",
      // "totnet": 71.59,
      // "iva_cantidad": 8.59,
      // "estado": "P",
      // "total_iva": 80.18,
      // "status": "EMITIDO"
   // },
      // {
      // "numtra": "30000049",
      // "codcli": "0",
      // "fectra": "2019-09-19",
      // "nomcli": "PALACIOS VILLAMARIN FRANKLIN",
      // "observ": "URGENTEEEEEE",
      // "totnet": 302.29,
      // "iva_cantidad": 36.27,
      // "estado": "P",
      // "total_iva": 338.56,
      // "status": "EMITIDO"
   // }
// ]
  
    constructor( private renderer: Renderer, private router: Router, private srv: ApiService, private route: ActivatedRoute)  { 
		console.log ('ESTOY EN CONSTRUCTOR LISTAR PEDIDOS')
	} 
	
	
	ngOnInit() {
	   
	   	this.usuario = this.route.snapshot.params.usuario;
		this.empresa = this.route.snapshot.paramMap.get('empresa');
		
		const datos = {};
		datos['codemp'] = this.empresa;
		console.log(datos)
	   this.srv.lista_pedidos(datos).subscribe(
	   data => {

	   
		   // console.log ("COMIENZO DELAY")
		   console.log (data)
		   	this.lista_pedidos = data

		   console.log ("FIN DELAY")
			}); 
			
		// this.dtOptions = {
		// data:this.dtUsers,
		// columns: [{title: 'User ID', data: 'id'},
            // {title: 'First Name', data: 'firstName'},
            // {title: 'Last Name', data: 'lastName' }]
		// };

		AdminLTE.init();
		

	
	
	
	
	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

  // ngOnInit(): void {
	  
	// this.usuario = this.route.snapshot.params.usuario;
	// this.empresa = this.route.snapshot.paramMap.get('empresa');
	// const datos = {};
	// datos['codemp'] = this.empresa;
	// this.srv.lista_pedidos(datos).subscribe(
	   // data => {
   
		   // console.log (data)
		   	// this.lista_pedidos = data
			 // console.log (this.lista_pedidos)
		 
			 
			// }); 
	  

	// console.log (this.lista_pedidos)
		    // this.dtOptions = {
      // data:this.dtUsers,
	  // columns: [{title: 'User ID', data: 'id'},
            // {title: 'First Name', data: 'firstName'},
            // {title: 'Last Name', data: 'lastName' }]
    // };
	
	 // // this.dtOptions = {
      // // data:this.lista_pedidos,
	  // // columns: [{title: 'Codigo_Cliente', data: 'codcli'},
            // // {title: 'Fecha_Transaccion', data: 'fectra'},
            // // {title: 'Nombre_cliente', data: 'nomcli' },
			// // {title: 'Numero_transaccion', data: 'numtra' },
			// // {title: 'Observacion', data: 'observ' },
			// // {title: 'Estado', data: 'status' },
			// // {title: 'Total_iva', data: 'total_iva' }
			// // ]
    // // };
 
// // columns: [{ data: 'codcli' }, { data: 'fectra' },{ data: 'nomcli' },{ data: 'numtra' },{ data: 'observ'},{ data: 'status'},{ data: 'total_iva'}]
 
  
  
  
  // AdminLTE.init();
	// }
	
	
	
	
	  // parametros: {usuario: string, empresa: string};
	
	 // myControl = new FormControl();
	 // myControl2 = new FormControl();
	// filteredOptions: Observable<string[]>;
	// filteredarticulo: Observable<string[]>;
	// public clientes : boolean;
	// public exist_articulo : boolean;
	// public razon_social : string;
	// public subtotal;
	// public total;
	// public today= new Date();
	// public edit_cant: boolean
	// public desc_cant = 0
	// public iva_cant = 0
	// desc_porcentaje = 0;
	// public iva_porcentaje = 0;
	// subtotal_desc = 0;
	// public iva_siaci
	// public observacion_pedido = ''

	
	
	// jstoday = '';
	// fectra = '';
	// // public date : string;
	// // clientes;
	// usuario = ''
	// empresa = ''
	// ruc = '';
	// patron_articulo = '';
	// cantidad_nueva = '';

	// // editART: ARTICULO
	// editART: any = []
	// dato_cliente
	
	// options: any = []
	// articulo: any = []
	// articulos_seleccionado
	// elements_checkedList:any = [];
	 // masterSelected:boolean;
	 
	 	// // articulos_pedido: any = [
	// // { codart: "0 001 121 016", nomart: "MOTOR DE ARRANQUE GOLF IV", prec01: "270", cant: "1" },
	// // { codart: "0001", nomart: "FOCO LUZ DE SALON", prec01: "0.8", cant: "2"  },	
	// // { codart: "0002", nomart: "SPOILER DEL  GOL 2000", prec01: "53.81",cant: "2" },
	// // { codart: "0003", nomart: "JGO SPOILER LATERAL GOL 2000 4 PTAS", prec01: "119.18",cant: "2"},
	// // { codart: "0004", nomart: "JGO  SPOILER LATERAL GOL 2000", prec01: "119.18",cant: "2" },
	// // { codart: "0005", nomart: "SPOILER POSTERIOR  GOL III", prec01: "68", cant: "2" }
	// // ]
	// public lista_pedidos: Lista_pedidos_clase[];

	


	
	
// // http://192.168.0.55:4401/admin/lista_pedidos;usuario=supervisor;password=;empresa=01

	// dtOptions: DataTables.Settings = {};
	// persons: Person[];


  // // constructor( private renderer: Renderer, private router: Router, private srv: ApiService, private route: ActivatedRoute) 
   // constructor( private router: Router, private srv: ApiService, private route: ActivatedRoute, private http: HttpClient) 
  // { 
  // console.log ('ESTOY EN CONSTRUCTOR LISTAR PEDIDOS')

  
  
  // }
 

 
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
	 
  
  
    
   // ngOnInit(){
    // const that = this;

    // this.dtOptions = {
      // pagingType: 'full_numbers',
      // pageLength: 2,
      // serverSide: true,
      // processing: true,
      // ajax: (dataTablesParameters: any, callback) => {
        // that.http
          // .post<DataTablesResponse>(
            // // 'https://angular-datatables-demo-server.herokuapp.com/',
			// 'http://localhost:5001/lista_pedidos',
            // dataTablesParameters, {}
          // ).subscribe(resp => {
			  // console.log (resp.data)
			  // that.lista_pedidos = resp.data
            // // that.persons = resp.data;
			// // that.persons = resp.data;

            // callback({
              // recordsTotal: resp.recordsTotal,
              // recordsFiltered: resp.recordsFiltered,
              // data: [],
            // });
          // });
      // },
      // // columns: [{ data: 'numtra' }, { data: 'codcli' }, { data: 'fectra' }]
	   // // columns: [{ data: 'numtra' }, { data: 'codcli' }, { data: 'fectra' },{ data: 'nomcli' },{ data: 'total_iva'},{ data: 'observ' },{ data: 'status'}]
	   // columns: [{ data: 'codcli' }, { data: 'fectra' },{ data: 'nomcli' },{ data: 'numtra' },{ data: 'observ'},{ data: 'status'},{ data: 'total_iva'}]
	  // // columns: [{ data: 'codcli' }, { data: 'estado' }, { data: 'fectra' },{ data: 'iva_cantidad' },{ data: 'nomcli'},{ data: 'numtra' },{ data: 'observ'},{ data: 'status'},{ data: 'total_iva'},{ data: 'totnet'}]
	  // // this.usuario = this.route.snapshot.params.usuario;
	  // // codemp: this.route.snapshot.paramMap.get('empresa');
	  
	  
    // };
	  // AdminLTE.init();
  // }  ////FIN ONINIT MODELO
  
  
  
  
  
  
  
						
		
}
