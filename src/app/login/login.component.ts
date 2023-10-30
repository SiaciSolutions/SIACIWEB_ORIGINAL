import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  elevacion = true;
  ruc = ''; // 1791949374001
  password = '';
  empresas;
  empresa;
  public tipo_busqueda : boolean;
  agencia
  agencia_lista
  login_exitoso = false
  datos_perfil
  
  constructor(private router: Router, private srv: ApiService) {
	this.tipo_busqueda = true; //BUSQUEDA POR USUARIO Y PASSWORD
	  }

  ngOnInit() {
    this.srv.empresas().subscribe(data => {
      this.empresas = data;
	  console.log(this.empresas)
    });
  }

  hacer_login() {
	if (this.tipo_busqueda === false) {	
      const datos = {};	  
      datos['ruc'] = this.ruc;
	  console.log(datos['ruc'])
	  console.log(datos)
	  if (datos['ruc'].length === 0){
		  alert("Por favor ingrese el número de RUC..!!");
	  }else { 
		if (isNaN(datos['ruc'])){
			alert(" NUMERO DE INDENTIFICACION SOLO DEBE CONTENER VALORES NUMERICOS..!!");

		}else{
			console.log(datos['ruc'].length)
			if ((datos['ruc'].length > 13)){
				alert(" EL número de Identificación debe contener no debe exceder los 13 caracteres!!");
			}else {
				this.router.navigate(['/starter', datos]);
			}
		}
	  }

    } else {
      const datos = {};
      datos['usuario'] = this.ruc.trim();
      datos['password'] = this.password.trim();
	  datos['empresa'] = this.empresa;
	  console.log("POR USER/PASSWORD")
	  console.log(datos)
	  console.log("COD_EMPRESA")
	  console.log (this.empresa) 
	  
	    


	  if ((datos['usuario'].length === 0) || (datos['password'].length === 0)){
		  alert("Por favor ingrese usuario/password..!!");
	  }else {
		  
		if (this.empresa){
			this.srv.login(datos).subscribe(data => {
			if (data['codus1']) {
				datos['password'] = '';
				datos['empresa'] = this.empresa;
				console.log("RESPUESTA LOGIN")
				console.log (data)
				this.login_exitoso = true
				this.datos_perfil = data
				
				this.srv.seleccion_agencia(datos).subscribe(
					data => {
						console.log ("*** DATOS AGENCIA ***")
						console.log (data)
						this.agencia_lista = data
					}
				)
			
			
			
				// this.srv.carga_perfil(data)
			
			// this.router.navigate(['/admin/crear_pedidos', datos]);

			}else {
				alert("Usuario/Clave no encontrados en SIACI..!!");
			}
			}); 
		}else  { 
			alert("Por favor seleccione una empresa");
		}
	}
	

		  

	
	  
	  

    }

  }
  
  	ingresar() {
		
		console.log (this.agencia)
		let arr_agencia= this.agencia.split("|")
		
		
		
		this.datos_perfil['codagencia'] = arr_agencia[0]
		this.datos_perfil['nom_agencia'] = arr_agencia[1]

		 this.srv.carga_perfil(this.datos_perfil)
		 let datos = {}
		 datos['usuario'] = this.ruc.trim();
		 datos['empresa'] = this.empresa;
			
			this.router.navigate(['/admin/dashboard3', datos]);

		
		
	}
  
  
   tipo_entrada() {
		console.log("tipo de entrada...!!!")
		console.log(this.tipo_busqueda)
		if (this.tipo_busqueda == false){
			this.tipo_busqueda = true;
		}else {
			this.tipo_busqueda = false;
		}
		console.log("tipo de entrada luego del cambio...!!!")
		console.log(this.tipo_busqueda)
	}
  
}
