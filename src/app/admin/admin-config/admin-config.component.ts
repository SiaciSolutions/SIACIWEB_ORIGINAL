import { Component, OnInit,ViewChild,Input  } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.css']
})


	
	// }//FIN ONINIT
	
export class AdminConfigComponent implements OnInit {
	
 usuario
 id_prov
 nomcli
 rucced =''
 dircli
 porc_merma
 fecult
 email
 telcli
 telcli2
 fectra
 public today= new Date();
 public success
 status
 ciudad
 
 @Input() status_cambio_vista_cliente: string;
 porc_comision
 
 articulos_proveedor: any = []
 patron_articulo = '';
 searching_articulo = false;
 articulo
 exist_articulo
 elements_checkedList:any = [];
 masterSelected:boolean;
 tab_habilitar_lista_precio

 comisiona_producto = false

 
 
 searching_ciudad = false
 exist_ciudad = false
 patron_ciudad
 public ciudad_lista:any = [];
 elements_checkedList_ciudad:any = [];
 lista_comision_prov : any = []


 
 public encriptacion_lista = [
			{"tipo": "None", "nomencrypt": "None"},
			{"tipo": "SSL", "nomencrypt": "SSL"},
			{"tipo": "TLS", "nomencrypt": "TLS"}
		];
  encriptacion
  
 public tipo_cuenta_lista = [
			{"tipo": "AHO", "nom_cta": "AHORRO"},
			{"tipo": "CTE", "nom_cta": "CORRIENTE"}
  ];
  tipo_cuenta

 public comisionista_lista = [];
 comisionista

 public banco_lista;
 cod_banco
 numero_cuenta
 
 edit_articulos = undefined

 public tipo_cliente_lista = [
			{"tipo": "C", "nom_tipo_cli": "PERSONA NATURAL"},
			{"tipo": "E", "nom_tipo_cli": "EMPRESA"}
		];
  tipo_cliente

  constructor(  
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute
  ) 
  {
	this.success = false
	this.ciudad = 'NO DISPONIBLE'
	this.status_cambio_vista_cliente = 'false'

	  }

  ngOnInit() {
	
	if (!this.srv.isLoggedIn()){
	this.router.navigateByUrl('/')};
	   
	this.route.queryParams.subscribe(params => {
		console.log(params)
		this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
		this.id_prov = params['id'] || this.route.snapshot.paramMap.get('id') || 0;
		this.tab_habilitar_lista_precio = true
      });
	console.log(this.usuario)
	
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');

	  
	////PARA PROVEEDOR
	
		

	AdminLTE.init();
  
  }
  

  
  
  
 



}
	
	
  

