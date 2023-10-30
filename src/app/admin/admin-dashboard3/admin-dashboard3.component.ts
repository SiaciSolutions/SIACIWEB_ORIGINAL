import { Component, OnInit } from '@angular/core';
// Variable in assets/js/scripts.js file
import { ApiService } from './../../api.service';
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import {formatDate} from '@angular/common';
declare var AdminLTE: any;

@Component({
  selector: 'app-admin-dashboard3',
  templateUrl: './admin-dashboard3.component.html',
  styleUrls: ['./admin-dashboard3.component.css']
})
export class AdminDashboard3Component implements OnInit {
	
		usuario;
	empresa;
	fecha_desde;
	fecha_hasta;
	contador_facturas_pendientes_despachar = 0;
	contador_facturas_pendientes_auth = 0;

  constructor(
 private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute
  ) { }

  ngOnInit() {
     // Actualiza la barra latera y el footer
	 console.log("ESTOY EN DASHBOARD 3 COMPONENT")
	 	   	if (!this.srv.isLoggedIn()){
	this.router.navigateByUrl('/')};
	   
	this.route.queryParams.subscribe(params => {
		console.log(params)
        // Defaults to 0 if no query param provided.
        // this.ruc = +params['ruc'] || 0;
		this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
		this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
      });
	  
	  	const datos = {};
	datos['codemp'] = this.empresa;	
	datos['usuario'] = this.usuario;
	
	var newdate = new Date();
	newdate.setDate(newdate.getDate() -60 ); //
	// this.fecha_desde  = new FormControl(new Date(newdate))
	
	this.fecha_desde  = formatDate(newdate, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.fecha_desde)
	// new FormControl(new Date());
	// this.fecha_hasta  = new Date()
	this.fecha_hasta  = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '-0500');
	datos['fecha_desde'] = this.fecha_desde
	datos['fecha_hasta'] = this.fecha_hasta
	console.log (this.usuario)
	console.log (this.empresa)
	console.log (datos)
	 
	 	// this.srv.datos_panel_control(datos).subscribe(
	   // data => {
		   // console.log(data)
		   // console.log ("EJECUTADA DATA")
		   // this.contador_facturas_pendientes_despachar =  data['cont_fact_desp']
		   // this.contador_facturas_pendientes_auth = data['cont_fact_auth']
		    

		// }); 
		
		// this.srv.lista_egresos_facturas_despachadas(datos).subscribe(
		// // this.srv.lista_egresos_facturas_despachadas(datos).subscribe(
	   // data => {
		   // // if (data){
			   // // this.loading = false;
		   // // }
		   // console.log(data)
		   // console.log ("EJECUTADA DATA")
		   // this.contador_facturas_pendientes_auth = data.length
			// // this.lista_pedidos_tabla = data
			// // this.buildDtOptions(this.lista_pedidos)
			// // this.ver_egreso = false
		// }); 
	 
	 

	 
	 
    AdminLTE.init();
  }
  
  	ocultar_menu_moviles(){
	   let body = document.getElementsByTagName('body')[0];
	body.classList.remove("sidebar-open"); 
	}

}
