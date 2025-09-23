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
	 fecha_status_cartera
	 fectra
	 codcli = '00007111'
	 today
	 saldo_cliente
	 loading_saldo = true

  constructor(
 private router: Router, 
  public srv: ApiService, 
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

			setTimeout(() => {
					this.busca_cliente()
					var newdate = new Date();
					newdate.setDate(newdate.getDate() -60 ); 
					this.fecha_desde  = formatDate(newdate, 'yyyy-MM-dd', 'en-US', '-0500');
					console.log (this.fecha_desde)

					this.fecha_hasta  = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '-0500');

					datos['fecha_desde'] = this.fecha_desde
					datos['fecha_hasta'] = this.fecha_hasta
					console.log (this.usuario)
					console.log (this.empresa)
					console.log (datos)

					this.fecha_status_cartera = this.fecha_hasta
					this.consulta_saldo_cartera()


			}, 1500);



	
	
    AdminLTE.init();
 


}
  
  	
 
    ocultar_menu_moviles(){
	    let body = document.getElementsByTagName('body')[0];
		body.classList.remove("sidebar-open"); 
	}


	consulta_saldo_cartera(){
	
	  console.log("CONSULTO SALDO")
	  let fec_cartera = formatDate(this.fecha_status_cartera, 'yyyy-MM-dd', 'en-US', '-0500');
	  console.log(fec_cartera)
	  
	//PARA BUSCAR SALDO_CLIENTE
	if (this.codcli){
		this.loading_saldo = true

		let datos_saldo_cliente = {};
		datos_saldo_cliente['codemp'] = this.empresa;
		datos_saldo_cliente['fecha_cartera'] = fec_cartera;
		datos_saldo_cliente['codcli'] = this.codcli;
		console.log (datos_saldo_cliente)
		this.srv.saldo_cartera(datos_saldo_cliente).subscribe(
		data => {
			this.loading_saldo = false
			console.log("OBTENIENDO SALDO")
			console.log(data)
			if (data['saldo_cliente']){
			this.saldo_cliente ="USD "+data['saldo_cliente']
			}else{
				this.saldo_cliente = "USD "+0
			}
			
			
			}); 
	}else{
		alert("Se necesita los datos del cliente para obtener su saldo");
		
	}

  }


    busca_cliente() { 
	if (this.usuario){
		console.log("#### BUSCO CLIENTE ###")
		const datos = {};
		datos['ruc'] = this.usuario;
		datos['codemp'] = this.empresa;
			
		this.srv.clientes(datos).subscribe(data => {

			if (data['rucced']) {
				console.log(data)
				this.codcli = data['codcli']
			}
			}); 
		}else  { 
			alert("Por favor ingrese TIPO DOC / IDENTIFICACION del cliente");
		}
	 
	}











}
