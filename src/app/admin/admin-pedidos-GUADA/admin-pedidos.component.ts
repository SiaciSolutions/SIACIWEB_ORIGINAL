import { Component, OnInit,ViewChild } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'



declare var AdminLTE: any;


@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})



	

export class AdminPedidosComponent implements OnInit {
	
	  parametros: {usuario: string, empresa: string};
	
	 myControl = new FormControl();
	 myControl2 = new FormControl();
	filteredOptions: Observable<string[]>;
	filteredarticulo: Observable<string[]>;
	public clientes : boolean;
	public exist_articulo : boolean;
	public exist_razon_social : boolean;
	public razon_social : string;
	public email_cliente : string;
	public subtotal;
	public total;
	public today= new Date();
	public edit_cant: boolean
	public desc_cant = 0
	public iva_cant = 0
	public iva_cant_new = 0
	desc_porcentaje = 0;
	public iva_porcentaje = 0;
	subtotal_desc = 0;
	public iva_siaci
	public ciudad_lista:any = [];
	public vendedores_lista:any = [];
	public observacion_pedido = ''
	public cambiar_email:boolean;
	public lista_prec = []
	public nuevo_precio_renglon
	public lista_rutas
	public lista_surcursales
	public change_iva = false
	public tipo_busqueda : boolean;
	public check_agencia
	public val_exist_ppal:boolean
	public val_exist_sucursal:boolean
	// public check_agencia_sucursal:boolean
	public edit_dir_agencia_ppal:boolean
	public habilitar_crear_nueva_sucursal:boolean
// PARA DEFINIR LA RUTA DE LOS PEDIDOS
    public id_nombre_ruta_seleccionado
	public id_direccion_sucursal_seleccionado
	public idruta
	public nombre_ruta
	public id_agencia
	public dir_agencia
	public searching_articulo = false
	public patron_cliente
	public razon_social_lista
	public edit_iva_art
	exist_fecha_entrega = true
	// fecha_entrega = undefined
	fecha_entrega = new FormControl(new Date());
	// date = new FormControl(new Date());

	
	
	jstoday = '';
	fectra = '';
	// public date : string;
	// clientes;
	usuario = ''
	empresa = ''
	ruc = '';
	patron_articulo = '';
	cantidad_nueva = '';
	ciudad
	vendedor

	// editART: ARTICULO
	editART: any = []
	dato_cliente
	
	options: any = []
	articulo: any = []
	articulos_seleccionado
	elements_checkedList:any = [];
	 masterSelected:boolean;
	
	articulos_pedido: any = []
	// #### PARA MARCAR LA EDICION DEL PRECIO DEL ARTICULO
	public edit_articulos
	
	@ViewChild('art') artSelectionList: MatSelectionList;
	typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
	
	
		
  onSelectionChange() {
	  
    console.log(this.getSelected());
    // console.log(this.getUnselected());
  }

  getSelected() {
	    return this.artSelectionList.selectedOptions.selected.map(s => s.value);
  }

  getUnselected() {
    const differ = [];
    const selected = this.getSelected();
    for(let i = 0; i < this.typesOfShoes.length; i ++) {
      if (selected.indexOf(this.typesOfShoes[i]) === -1) {
        differ.push(this.typesOfShoes[i])
      }
    }
    return differ;
  }
  

	
	
	// articulos_pedido: any = [
	// { codart: "0 001 121 016", nomart: "MOTOR DE ARRANQUE GOLF IV", prec01: "270", cant: "1" },
	// { codart: "0001", nomart: "FOCO LUZ DE SALON", prec01: "0.8", cant: "2"  },	
	// { codart: "0002", nomart: "SPOILER DEL  GOL 2000", prec01: "53.81",cant: "2" },
	// { codart: "0003", nomart: "JGO SPOILER LATERAL GOL 2000 4 PTAS", prec01: "119.18",cant: "2"},
	// { codart: "0004", nomart: "JGO  SPOILER LATERAL GOL 2000", prec01: "119.18",cant: "2" },
	// { codart: "0005", nomart: "SPOILER POSTERIOR  GOL III", prec01: "68", cant: "2" }
	// ]
	
	// var autos = [{
    // "Modelo": "Mazda",
    // "Referencia": "Mazda 6",
    // "Precio": 73710
	// }, {
    // "Modelo": "Audi",
    // "Referencia": "R8",
    // "Precio": 73710
	// }];

	// var precioDescuento = 6120;
	// var modelo = "Mazda";



	// console.log(articulos_pedido)
	
	
	
	
	// interface cliente {
    // codemp: string
	// nomcli : string
	// rucced : string
	// }
	
	// options: options [];


	 // options = [
	 // { codemp: "01", nomcli: "PALACIOS VILLAMARIN FRANKLIN", rucced: "1713102752001" },
	 // { codemp: "01", nomcli: "FIERRO DANNY", rucced: "0401611215" },
	 // { codemp: "01", nomcli: "CEVALLOS RUBIO JUAN", rucced: "1715866727" }
    // // { color: 'One', forma: 'circulo' },
    // // { color: 'Two', forma: 'cuadrado' },
    // // { color: 'Three', forma: 'triangulo'  },
  // ];
  
  public tipo_doc_lista = [
			{"tipo": "C", "nom_doc": "CEDULA"},
			{"tipo": "R", "nom_doc": "RUC"},
			{"tipo": "P", "nom_doc": "PASAPORTE"}
		];
  tipo_doc

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  
  { 
  this.tipo_busqueda = true
  this.clientes = false;
  this.exist_articulo = false;
  this.exist_razon_social = false;
  this.edit_cant = false;
  this.masterSelected = false;
  this.cantidad_nueva = '1';
  this.cambiar_email = false;
  this.check_agencia = false
  // this.check_agencia_sucursal = false
  this.val_exist_ppal = true
  this.val_exist_sucursal = true
  this.edit_dir_agencia_ppal = false
  this.habilitar_crear_nueva_sucursal = false

     this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
    console.log("Subtotal: ", this.subtotal)
	

	
    
  }
  

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
	
	console.log(this.usuario)
	console.log(this.empresa)

	// this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	this.jstoday = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	// this.fecha_entrega = this.fectra
	// this.fecha_entrega = new FormControl(new Date())
	// let serializedDate = new FormControl((new Date()).toISOString());
	console.log (this.today)
	console.log (this.fecha_entrega)
	// console.log (serializedDate)
	
	
	
	
	// this.fecha_entrega_defecto = new FormControl(new Date())
	// console.log (this.fecha_entrega_defecto)
	
////PARA BUSCAR IVA Y SETEAR IVA DEFECTO
	this.srv.iva().subscribe(data => {
		console.log ("**** IVA DE SIACI ***")
		console.log (data)
      this.iva_siaci = data;
	  
	 // let iva_defecto 
	  
	// this.iva_siaci.map(function(dato){
	  // if(dato.codiva == 'S'){
		  // console.log("SETEANDO IVA DEFECTO")
		// iva_defecto = dato.poriva;
		// }
	  // return dato;
	// });
	
	// console.log(iva_defecto)
	// this.iva_porcentaje = iva_defecto

    });
////PARA BUSCAR CIUDAD
	const datos = {};
	datos['codemp'] = this.empresa;		
	console.log (datos)
	
	// for (let i = 1; i <= 200; i++) {
      // this.elements.push({"id": i.toString(), "first": "Wpis " + i, "last": "Last " + i, "handle": "Handle " + i,"id": i.toString(), "first": "Wpis " + i, "last": "Last " + i, "handle": "Handle " + i,"id": i.toString(), "first": "Wpis " + i, "last": "Last " + i, "handle": "Handle " + i});
    // }
	
	this.srv.ciudad(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO CIUDAD")
		   console.log(data)
		   // let option_defecto = {"codemp": "01", "codgeo": "0", "nomgeo": "*** Seleccione ciudad ***"};
		   let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
		   this.ciudad_lista = data
		   // this.ciudad_lista.unshift(option_defecto)
		   this.ciudad_lista.push(option_defecto_final)
		   console.log("CIUDAD LISTA")
		   console.log(this.ciudad_lista)
		   // this.ciudad_lista = option_defecto
		});
		
	this.srv.vendedores(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO VENDEDORES")
		   console.log(data)
		   this.vendedores_lista = data
		   this.vendedor = "01"
		   // let option_defecto = {"codemp": "01", "codgeo": "0", "nomgeo": "*** Seleccione ciudad ***"};
		   // let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
		   // this.ciudad_lista = data
		   // this.ciudad_lista.unshift(option_defecto)
		   // this.ciudad_lista.push(option_defecto_final)
		   // console.log("CIUDAD LISTA")
		   // console.log(this.ciudad_lista)
		   // this.ciudad_lista = option_defecto
		});

	this.srv.get_rutas(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO RUTAS")
		   console.log(data)
		   this.lista_rutas = data
		   // // let option_defecto = {"codemp": "01", "codgeo": "0", "nomgeo": "*** Seleccione ciudad ***"};
		   // let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
		   // this.ciudad_lista = data
		   // // this.ciudad_lista.unshift(option_defecto)
		   // this.ciudad_lista.push(option_defecto_final)
		   // console.log("CIUDAD LISTA")
		   // console.log(this.ciudad_lista)
		   // this.ciudad_lista = option_defecto
		}); 
			
	
	
	
	
	
	// console.log("#####  IVA DEFECTO   #####")
	// console.log(this.iva_porcentaje)
	console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
	console.log (this.srv.getConfCorreoPedCli())
	AdminLTE.init();
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
	
	
	set_id_nombre_rutas(tipo_agencia){
		console.log(this.id_nombre_ruta_seleccionado)
		// this.id_direccion_sucursal_seleccionado=undefined
		console.log (this.id_direccion_sucursal_seleccionado)
			
		let id_nombre_ruta_seleccionado_array = this.id_nombre_ruta_seleccionado.split("|",2)
		// console.log(id_nombre_ruta_seleccionado_array[0])
		this.idruta = id_nombre_ruta_seleccionado_array[0]
		this.nombre_ruta=id_nombre_ruta_seleccionado_array[1]
		
		if (tipo_agencia == 'S'){
			console.log("BUSCANDO SUCURSALES EN RUTA "+this.nombre_ruta)
			
			let datos_sucurdales = {};
			
			datos_sucurdales['empresa'] = this.empresa;	
			datos_sucurdales['codcli'] = this.dato_cliente['codcli'];
			datos_sucurdales['tipo_agencia'] = tipo_agencia;
			datos_sucurdales['idruta'] = this.idruta;
			
			console.log (datos_sucurdales)
			
		this.srv.get_sucursales(datos_sucurdales).subscribe(
		data => {
		   console.log("OBTENIENDO DIRECCIONES RUTAS SUCURSALES")
		   console.log(data)
		   this.lista_surcursales = data
		   
			}); 
		
		
		}
		
		// this.id_direccion_sucursal_seleccionado = ""
		
		
		
		
		
	}
	
	set_id_dir_sucursal(){
		console.log(this.id_direccion_sucursal_seleccionado)
			
		let id_direccion_sucursal_seleccionado_array = this.id_direccion_sucursal_seleccionado.split("|",2)
		// console.log(id_nombre_ruta_seleccionado_array[0])
		this.id_agencia = id_direccion_sucursal_seleccionado_array[0]
		this.dir_agencia=id_direccion_sucursal_seleccionado_array[1]
		
		// if (tipo_agencia == 'S'){
			// console.log("BUSCANDO SUCURSALES EN RUTA "+this.nombre_ruta)
			
			// let datos_sucurdales = {};
			
			// datos_sucurdales['empresa'] = this.empresa;	
			// datos_sucurdales['codcli'] = this.dato_cliente['codcli'];
			// datos_sucurdales['tipo_agencia'] = tipo_agencia;
			// datos_sucurdales['idruta'] = this.idruta;
			
			// console.log (datos_sucurdales)
			
		// this.srv.get_sucursales(datos_sucurdales).subscribe(
		// data => {
		   // console.log("OBTENIENDO DIRECCIONES RUTAS SUCURSALES")
		   // console.log(data)
		   // this.lista_surcursales = data
		   
			// }); 
		
		
		// }
		
		
		
		
		
	}
	
	
	validar_exist_agencia(tipo_agencia){
		console.log("check_agencia")
		console.log(this.check_agencia)
		// console.log("check_agencia_sucursal")
		// console.log(this.check_agencia_sucursal)
		
	if (this.dato_cliente){
		console.log("validar_AGENCIA")
		let datos_val_ppal = {};
		datos_val_ppal['codemp'] = this.empresa;	
		datos_val_ppal['codcli'] = this.dato_cliente['codcli'];
		datos_val_ppal['tipo_agencia'] = tipo_agencia
		console.log (datos_val_ppal)
		
	this.srv.validar_exist_agencia(datos_val_ppal).subscribe(
	   data => {
		   console.log("OBTENIENDO DATOS AGENCIA")
		   console.log(data)
		   
		   if (data['idruta']){

				if (tipo_agencia == 'P'){
					this.idruta = data['idruta']
					this.nombre_ruta = data['nombre_ruta']
					this.id_agencia = data['id_agencia']
					this.dir_agencia = data['dir_agencia'] 
					this.val_exist_ppal = true
				}
				if (tipo_agencia == 'S'){
					console.log("SETEANDO VALORES DE RUTAS Y DIRECCION EN UNDEFINED")
					this.idruta = undefined
					this.nombre_ruta = undefined
					this.id_agencia = undefined
					this.dir_agencia = undefined
					this.val_exist_sucursal = true
				}
					
			}else {
				console.log("NO HAY SEDE PRINCIPAL DEFINIDA, POR FAVOR DEFINIRLA")
				if (tipo_agencia == 'P'){
					console.log("NO HAY SEDE PRINCIPAL DEFINIDA, POR FAVOR DEFINIRLA")
					this.val_exist_ppal = false
					this.dir_agencia = this.dato_cliente['dircli']
				}
				if (tipo_agencia == 'S'){
					console.log("NO HAY SEDE SUCURSAL DEFINIDA, POR FAVOR DEFINIRLA")
					this.val_exist_sucursal = false
					this.dir_agencia = ''
				}
				
				// this.val_exist_ppal = false
			
			
			}
		   

		   
		   
		   
	  }); 
		}else {
			alert ("Por favor ingrese los datos del cliente...!!!")
			this.check_agencia = false
			
		}

	}  //####  FIN VALIDAR PRINCIPAL
	
	
	
	guardar_nueva_agencia(tipo_agencia){
		console.log("ENTRADA CREAR AGENCIA")
		console.log (tipo_agencia)
		
		if (this.idruta && (this.dir_agencia.length > 0)){
		let datos_crear_agencia = {};
		datos_crear_agencia['empresa'] = this.empresa;
		datos_crear_agencia['tipo_agencia'] = tipo_agencia;	
		datos_crear_agencia['codcli'] = this.dato_cliente['codcli'];	
		datos_crear_agencia['nomcli'] = this.dato_cliente['nomcli'];
		datos_crear_agencia['dir_agencia'] = this.dir_agencia;
		datos_crear_agencia['idruta'] = this.idruta;

		console.log('##### DATOS CREAR AGENCIA #######')
		console.log (datos_crear_agencia)
		
		
	this.srv.crear_nueva_agencia(datos_crear_agencia).subscribe(
	   data => {
		   console.log("CREANDO NUEVA AGENCIA")
		   console.log(data)
		   this.id_agencia = data['id_agencia']
		   if (tipo_agencia == 'P'){
				   this.val_exist_ppal = true
				   this.id_nombre_ruta_seleccionado = undefined
					alert("Nueva agencia principal generada con éxito")				   
		   }
		   if (tipo_agencia == 'S'){
			      this.val_exist_sucursal = true
				  this.id_nombre_ruta_seleccionado = undefined
				  alert("Nueva agencia sucursal generada con éxito")	
			   
		   }
		   

		   
		   // if (data['idruta']){
				// this.idruta = data['idruta']
				// this.nombre_ruta = data['nombre_ruta']
				// this.id_agencia = data['id_agencia']
				// this.dir_agencia = data['dir_agencia'] 
				
				// this.val_exist_ppal = true
			// }else {
				// console.log("NO HAY SEDE PRINCIPAL DEFINIDA, POR FAVOR DEFINIRLA")
				// this.val_exist_ppal = false
				// this.dir_agencia = this.dato_cliente['dircli']
			
			// }

		   
	  }); 
	
	}else{
		alert("Por favor seleccionar ruta en donde se encuentra la agencia, y llenar la direccion de la agencia principal o sucursal a crear")
		
	}
		
		
		
	}
	

	
	edit_art (el) {
		console.log("ENTRADA ARTICULO A EDITAR")
		// console.log(el)
        this.editART = el
		this.edit_cant = true;
		console.log(this.editART)
    }
	
	
	delete_art (el,index) {
		console.log("ENTRADA ARTICULO A ELIMINAR")
		console.log(el)

	 let json_eliminar = this.articulos_pedido
	 // var nomart = el
	 
	json_eliminar = json_eliminar.filter(function(dato){
	  if(dato.index == index){
		  return false
	  }else {
		 return true 
		  
	  }
	  // return dato;
	});	 
	
	console.log(json_eliminar);//json original
	this.articulos_pedido = json_eliminar	
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));	
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));	
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new	
	
    }
	
	delete_art_todo () {
		console.log("ENTRADA ARTICULO A ELIMINAR TODOOOOO")
			this.articulos_pedido = []
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
			this.iva_porcentaje = 0
			this.iva_cant = 0
			this.total = 0
	
    }
	
	
	redondear (el) {
		// console.log("ENTRADA ARTICULO REDONDEAR")
		// console.log(el)
	return Math.round(el * 100) / 100;
    }
	
	
	busca_cliente() { 
	if (this.ruc && this.tipo_doc ){
		const datos = {};
		datos['ruc'] = this.ruc;
		datos['codemp'] = this.empresa;
		datos['tpIdCliente'] = this.tipo_doc;
			this.srv.clientes(datos).subscribe(data => {
				// console.log(data)
			this.dato_cliente = data
			if (data['rucced']) {
				console.log(data)
				console.log(data['nomcli'])
				this.razon_social = data['nomcli']
				this.email_cliente = data['email']
				this.clientes = true;
			}else {
				let documento=''
				if (this.tipo_doc == 'C'){
					documento = 'CEDULA'
				} else if (this.tipo_doc == 'R') {
					documento = 'RUC'
					
				}else if (this.tipo_doc == 'P'){
					documento = 'PASAPORTE'
				}
					
				
				alert("Cliente con "+documento+" "+this.ruc+" no encontrado");
			}
			}); 
		}else  { 
			alert("Por favor ingrese el Tipo de Documento/ Num de documento del cliente");
		}
	 }
	 
	 
	 
	 
	busqueda_razon_social() { 
	if (this.patron_cliente){
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
	 
	 select_razon_social(ident,ruc,rz,correo,codcli,dircli) {
		 console.log ("Seleccion de cliente")
		
		this.dato_cliente= {"nomcli":rz,"rucced":ruc,"email":correo,"codcli":codcli,"dircli":dircli}
		 // ['codemp', 'nomcli','rucced','codcli','email','dircli','ciucli','telcli','telcli2']
		this.tipo_doc = ident 
		this.ruc = ruc
		this.razon_social = rz
		this.email_cliente = correo
		this.clientes = true;
		this.exist_razon_social = false;
		this.patron_cliente = undefined;
	 }
	 
	 
	 
	 
	 
	 
	busca_articulo() { 
	if (this.patron_articulo && this.dato_cliente){
		this.searching_articulo = true
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		datos['codcli']  = this.dato_cliente["codcli"];
			this.srv.articulos(datos).subscribe(data => {
				// console.log(data)
				// console.log (data[1]['nomart'])
				
			let longitud_data = data.length

			if (longitud_data > 0 ) {
				console.log(data)
				// console.log(data['nomart'])
				
				// console.log (data[1]['nomart'])
				this.articulo = data;
				this.exist_articulo = true;
				this.searching_articulo = false
				
				// this.filteredarticulo = this.myControl2.valueChanges.pipe(
				// startWith(''),
				// map(value => this._filter2(value))
				// ); 
	  
				
				
				
			}else {
				alert("Antículo no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
				this.searching_articulo = false
				this.exist_articulo = false;
			}
			}); 
		}else  { 
			alert("Por favor llene el campo artículo, y datos del cliente");
		}
	 }
	 
	busca_servicio() { 
	if (this.patron_articulo){
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
		datos['codcli']  = this.dato_cliente["codcli"];
		console.log ("BUSCO SERVICIO")
			this.srv.servicios(datos).subscribe(data => {
				// console.log(data)
				// console.log (data[1]['nomart'])
				
			let longitud_data = data.length

			if (longitud_data > 0 ) {
				console.log(data)
				// console.log(data['nomart'])
				
				// console.log (data[1]['nomart'])
				this.articulo = data;
				this.exist_articulo = true;
				
				// this.filteredarticulo = this.myControl2.valueChanges.pipe(
				// startWith(''),
				// map(value => this._filter2(value))
				// ); 
	  
				
				
				
			}else {
				alert("Servicio no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
			}
			}); 
		}else  { 
			alert("Por favor llene el campo artículo");
		}
	 }
	 
	public get_prec_produc(codart){
		console.log("###creado lista de precios##")
		console.log (codart)
		// 6Q0199517A
		let datos = {};
		datos['codart']  = codart
		datos['codemp']  = this.empresa;
		datos['codcli']  = this.dato_cliente["codcli"];
		this.srv.get_prec_product(datos).subscribe(
			data => {
				console.log(data)
				this.lista_prec = data
				
				// for (checked_json of this.elements_checkedList)
				// for (let precios of data[0]){
					// console.log ("LISTA DE PRECIOS BD")
					// console.log (precios)
					
					
				// }
				// console.log(data['prec02'])
				// console.log(data[0].prec01)
		// [
			// {"tipo": "C", "nom_doc": "CEDULA"},
			// {"tipo": "R", "nom_doc": "RUC"},
			// {"tipo": "P", "nom_doc": "PASAPORTE"}
		// ];
				
			// this.lista_prec =[{"prec": data[0].prec1},
							  // {"prec": data[0].prec2},
							  // {"prec": data[0].prec3},
							  // {"prec": data[0].prec4},
							  // {"prec": data[0].prec5}];
			console.log(this.lista_prec )
			}
			); 
		return "01"
	}
	public get_prec_servicio(codart){
		console.log("###creado lista de precios servicio##")
		console.log (codart)
		// 6Q0199517A
		let datos = {};
		datos['codart']  = codart
		datos['codemp']  = this.empresa;
		datos['codcli']  = this.dato_cliente["codcli"];
		this.srv.get_prec_servicio(datos).subscribe(
			data => {
				console.log(data)
			// this.lista_prec =[{"prec": data[0].prec01},{"prec": data[0].prec02},{"prec": data[0].prec03},{"prec": data[0].prec04}];
			this.lista_prec =data ;
			console.log(this.lista_prec)
			}
			); 
		return "01"
	}
	
	
	
	
	
	
	// public edit_prec(articulos){
		
		// console.log ("##### EDIT PREC  ####")
		// console.log (articulos)
		// console.log (articulos["codart"])
		// this.edit_articulos=articulos
		// this.get_prec_produc(articulos["codart"])
		

		
		
	// }
	
	public edit_prec(articulos){
		
		console.log ("##### EDIT PREC  ####")
		console.log (articulos)
		console.log (articulos["codart"])
		this.edit_articulos=articulos
		console.log ("##### TIPO BUSQUEDA  ####")
		console.log (this.tipo_busqueda)
		if (this.tipo_busqueda){
			this.get_prec_produc(articulos["codart"])	
		}else{
			this.get_prec_servicio(articulos["codart"])
		}

		

		
		
	}
	public edit_prec_renglon(cod){
		console.log ("##### CAMBIAR PRECIO RENGLON ####")
		console.log (this.nuevo_precio_renglon)
		if (!this.nuevo_precio_renglon){
			
			this.nuevo_precio_renglon = 0
			
		}
		console.log (cod)
		let nuevo_precio_renglon_1 = parseFloat(this.nuevo_precio_renglon)
		
		console.log ("#### ARREGLO DE ARTICULOS  ###")
		console.log (this.articulo)
		
		
		this.articulo.map(function(dato){
			console.log("VOY ARREGLO DE ARTICULOS ")
			if(dato.codart == cod){
				dato.prec01 = nuevo_precio_renglon_1;
				//ACTUALIZO EL MONTO DEL IVA
				dato.precio_iva= (dato.prec01*dato['poriva'])/100
				//REDONDEADO PRECIO IVA
				dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
				
				
		}
			return dato;
		});
		
				console.log ("#### ARREGLO DE ARTICULOS LUEGO DEL CAMBIO  ###")
		console.log (this.articulo)
		
		
		
		
		this.edit_articulos = undefined  //para desmarcar renglon
		this.lista_prec = []  // para eliminar array de consulta de precios
		this.nuevo_precio_renglon = undefined  //para reiniciar el nuevo precio
		
		
	}
	
	public update_iva_art(codart,index,value_iva_new){
		console.log("ACTUALIZAR IVA PARA ARTICULO")
		console.log("####  CODIDO ART ########")
		console.log(codart)
		console.log("####  IVA NUEVO ########")
		console.log(value_iva_new)
		let value_iva_new_array = value_iva_new.split("|")
		let poriva_new = value_iva_new_array[0]
		let codiva_new = value_iva_new_array[1]
		
		// console.log("####  CODIGO IVA ########")
		// console.log(codiva_new)
		
	if 	(codart){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR PRECIO")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO PORIVA")
		dato.poriva = poriva_new;
		dato.codiva = codiva_new;
		
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal_art
		dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  }
	  
	  return dato;
	});

	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)


	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.edit_iva_art = undefined
		
	}
	
	
	public edit_iva_articulo(el){
		
		console.log ("##### EDIT IVA ART  ####")
		console.log (el)
		console.log (el["codart"])
		this.edit_iva_art=el
		// this.get_prec_produc(articulos["codart"])
		

		
		
	}
	
	
	
	
	
	
	
	
	
	
	
	public update_precio (codart, index,prec) {
		console.log("ACTUALIZAR LISTA PARA PRECIO")
		console.log("####  CODIGO ########")
		console.log(codart)
		console.log("####  CANTIDAD NUEVA ########")
		console.log(prec)
		// var cant_new =cant
		
	if 	(codart && prec){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR PRECIO")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO PRECIO")
		dato.prec01 = prec;
		
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal_art
		dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  }
	  
	  return dato;
	});

	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)


	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
   }
	
	
	
	 
	public update (codart,index,cant) {
		console.log("ACTUALIZAR LISTA")
		console.log("####  NOMBRE ########")
		console.log(codart)
		console.log("####  CANTIDAD NUEVA ########")
		console.log(cant)
		var cant_new =cant
		
	if 	(codart && cant_new){
		if (cant_new === '0'){
			alert ("Cantidad del código << "+codart+" >> debe ser mayor a 0..por favor validar")
	
		}else{
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR NUMERO")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO CANTIDAD")
		dato.cant = cant_new;
		
		// dato.precio_iva =  ((dato['poriva']*dato['prec01'])/100)*dato.cant;
		//REDONDEADO PRECIO IVA
		// dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;

		
		
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal_art
		dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  }
	  
	  return dato;
	});
	// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)
	}

	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
	this.cantidad_nueva = '1';
   }
   
	public validaNumericos(event: any,value) {
		console.log ("validando_numero")
		console.log (event)
		// console.log (event.key)
		// console.log (event.explicitOriginalTarget.value)
		
		// console.log (event.explicitOriginalTarget.value.indexOf("."))
		// if (event.explicitOriginalTarget.value.indexOf(".") == -1){
			// console.log ("deberia escribir el punto")
		// }else{
			// console.log ("NO deberia escribir el punto")
			// return false;     
		// }
		
    if((event.charCode >= 48 && event.charCode <= 57) ||(event.charCode == 46)){
		////si hay otra punto como separador decimal, no escribir ese punto
		if ((value.indexOf(".") != -1) && (event.key == ".")){
			return false;
		}
	  return true;
	 }
     return false;        
	}
	
	public validaNumericosCantidad(event: any) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
	}
   
   
   
   
   
   	public update_art_desc (codart,index,desc_art) {
		console.log("ACTUALIZAR LISTA DESCUENTO ARTICULO")
		console.log("####  NOMBRE ########")
		console.log(codart)
		console.log("####  DESCUENTO A APLICAR A ARTICULO ########")
		console.log(desc_art)
		var desc_art_new =desc_art

	if 	(codart && desc_art_new ){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR DESC % y Valor de descuento")
	  if(dato.index == index){
		  console.log("ACTUALIZANDO DESC")
		dato.punreo = desc_art_new;
		// dato.precio_iva =  ((dato['poriva']*dato['prec01'])/100)*dato.cant;
		// //REDONDEADO PRECIO IVA
		// dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal articulo
		dato.subtotal_art = Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
	  }
	  
	  return dato;
	});
	
	
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	 console.log("IVA_NEW ", this.iva_cant_new)
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	 console.log("TOTAL_LUEGO_DESC_ART: ", this.total)
	// this.update_total_desc (this.desc_porcentaje) 
    // console.log("subtotal: ", this.subtotal)
	
	}
	else {
		alert ("Descuento del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
	// this.cantidad_nueva = '1';
   }
   
   
   
   
   
   
   	
	public update_total_desc (desc) {
		console.log("####  DESCUENTO ########")
		console.log(desc)
		this.desc_porcentaje = desc
		this.desc_cant = (this.subtotal*desc)/100
		// return Math.round(el * 100) / 100;
		
		this.desc_cant = Math.round(this.desc_cant * 100)/100
		this.subtotal_desc = this.subtotal - this.desc_cant
		this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
		console.log("####  TOTAL CON DESC  ########")
		console.log(this.total)
		console.log("####  DESC CANTIDAD  ########")
		console.log(this.desc_cant)
		console.log("####  DESC PORCENTAJE  ########")
		console.log(this.desc_porcentaje)
		console.log("####  SUBTOTAL_CON_DESCUENTO ########")
		console.log(this.subtotal_desc)
		// return (this.desc_cant)
   }
   
   public update_total_iva(iva){
	  console.log("####  IVA INGRESADO ########")
	  this.iva_porcentaje = iva
	  console.log("IVA INGRESADO= "+this.iva_porcentaje)
	  
	  this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
	  
	  this.total = this.subtotal + this.iva_cant

   }
   
    public update_ciudad(ciudad){
	  console.log("#### CIUDAD SELECCIONADA ########")
	  console.log (ciudad)
	  this.ciudad = ciudad
   }//FIN UPDATE_CIUDAD
   
    public update_email(email){
	  console.log("#### EMAIL NUEVO ########")
	  console.log(email)
	  
	  if (this.validateEmail(email)) {
	  this.email_cliente=email
	  console.log(this.email_cliente)
	} else {
	alert("Formato de Email no válido")
	this.cambiar_email = false
	}
   } //FIN UPDATE_EMAIL
  
  validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
	}
   
   	public update_observ (codart,index,obsev) {
		console.log("####  observacion ########")
		console.log(obsev)
		if 	(codart && obsev ){
		this.articulos_pedido.map(function(dato){
			console.log("VOY ACTUALIZAR OBSERVACION ARTICULO")
		  if(dato.index == index){
			dato.observ = obsev;
			}
	  return dato;
		});
	}
		console.log (this.articulos_pedido)

   }
   
   
    public update_observ_general (obsev_g) {
		console.log("####  observacion general ########")
		console.log(obsev_g)
		this.observacion_pedido = obsev_g
   }
   

 
	 
	 
	inserta_pedido() {
		let checked_json
		let duplicado = false
		this.patron_articulo = undefined
		// console.log (this.elements_checkedList)
		// this.elements_checkedList = this.artSelectionList.selectedOptions.selected.map(s => s.value);
		
		
		
		
		if (this.elements_checkedList.length > 0) {
		
	for (checked_json of this.elements_checkedList) {
		console.log("NOMBRE DE ARTICULO A INSERTAR")	
		console.log(checked_json['codart'])
		
		// this.get_prec_produc(checked_json['codart'])
		
		//COMENTADO VALIDACION DUPLICADO GUADAPRODUC....!!!! 
		// this.articulos_pedido.map(function(dato){
			// if(dato.codart == checked_json['codart']){
				// console.log ("SUMO 1 a ITEM y no DEBERIA AGREGAR")
			// dato.cant = parseFloat(dato.cant) + 1;
			
		// dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		// dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		// //REDONDEADO subtotal_art
		// dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		// dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		// //REDONDEADO PRECIO IVA
		// dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;

			// duplicado = true
			// }
	  
		// return dato;
		// });

		
		if (!duplicado) {
		console.log ("VOY A AGREGAR")
		console.log (this.articulos_pedido.length)
		
		if (this.articulos_pedido.length == 0){
			checked_json['index'] = this.articulos_pedido.length
		}else {
			console.log (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))
			checked_json['index'] = (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))+1
		}
		


		
		
		checked_json['cant'] = '1';
		checked_json['observ'] = 'Puede agregar detalles del artículo';
		checked_json['subtotal_art'] = checked_json['prec01']
		checked_json['v_desc_art'] = (checked_json['punreo']*checked_json['prec01'])/100;
		this.articulos_pedido.push(checked_json)
		console.log("###### REGISTRO INSERTADO #####")
		console.log(this.articulos_pedido)
		
		}
	
		}	
			console.log ("####  INSERTA PEDIDO CON IVA  ######")
			console.log (this.iva_porcentaje)
		
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
			this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			this.elements_checkedList = [];
			this.articulo = [];
			this.exist_articulo = false;
			console.log(this.elements_checkedList)
		
		}else {
			alert("Por favor seleccione algún artículo")
		}

	 }
	 
 
	// public onChange(articulos.nomart) {
		
		// console.log(articulos.nomart)
	// }
	 
	
    private _filter(value: string): string[] {
			console.log (this.options)
			console.log ("filtro 1")
	      return this.options.map(x => x.nomcli).filter(
					option => option.toLowerCase().includes(value.toLowerCase()));
		
	}
	
	private _filter2(value: string): string[] {
			console.log ("filtro 2")
	      return this.articulo.map(y => y.nomart).filter(
					option => option.toLowerCase().includes(value.toLowerCase()));
		
	}
	
	
	 // #################PROCESO CHECKBOX
  checkUncheckAll() {
    for (var i = 0; i < this.articulo.length; i++) {
      this.articulo[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.articulo.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }
 
  getCheckedItemList(){
    this.elements_checkedList = [];
    for (var i = 0; i < this.articulo.length; i++) {
      if(this.articulo[i].isSelected)
      this.elements_checkedList.push(this.articulo[i]);
    }
    // this.elements_checkedList = JSON.stringify(this.elements_checkedList);
	console.log ('getCheckedItemList');
	console.log (this.elements_checkedList);
  
  }
    // #################FIN PROCESO CHECKBOX
	

   generar_pedido() {


console.log (this.fecha_entrega)
console.log (this.fecha_entrega['value'])
// console.log (formatDate(this.fecha_entrega['value'], 'yyyy-MM-dd', 'en-US', '-0500'))
let fecha_entrega = formatDate(this.fecha_entrega['value'], 'yyyy-MM-dd', 'en-US', '-0500')
let fecha_entrega_msg = formatDate(this.fecha_entrega['value'], 'dd-MM-yyyy', 'en-US', '-0500')
console.log (fecha_entrega);

// ### Obtener fecha de día de mañana para validacion
var newdate = new Date();
newdate.setDate(newdate.getDate() +1 ); //
var nd = new Date(newdate);
// alert('the new date is ' + nd);
var nd_manana_formateado = formatDate(nd, 'yyyy-MM-dd', 'en-US', '-0500')



	   
	 console.log ("GENERAR PEDIDO")
	
	console.log ("DATOS CLIENTE")
	console.log (this.dato_cliente)
	
	console.log ("ARTICULOS PEDIDO")
	console.log (this.articulos_pedido.length)
	
	
	if ((this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.email_cliente) ){
		let msg_fecha;
		console.log ("FEHCA DE HOY")
		console.log (this.jstoday)
		if ((this.jstoday == fecha_entrega) && this.exist_fecha_entrega){
			// msg_fecha = "de *** HOY *** "+fecha_entrega_msg
			msg_fecha = "Confirma que la fecha de entrega es el día *** HOY *** "+fecha_entrega_msg+" ??"
			
		}else if ((fecha_entrega == nd_manana_formateado)&& this.exist_fecha_entrega){
			// msg_fecha = " *** de MAÑANA *** "+fecha_entrega_msg
			msg_fecha = "Confirma que la fecha de entrega es el día de*** MAÑANA *** "+fecha_entrega_msg+" ??"
		}
		else if (!this.exist_fecha_entrega){
			msg_fecha = "Confirma que desea PLANIFICAR LUEGO la entrega del pedido ??"
		}
		else {
			msg_fecha =  "Confirma que la fecha de entrega es el día *** "+fecha_entrega_msg+" *** ???"  
		}
	
		if (confirm(msg_fecha)){
	 let encabezado_pedido= this.dato_cliente
	 encabezado_pedido['codus1'] = this.usuario;
	 encabezado_pedido['codemp'] = this.empresa;
	 // encabezado_pedido['fectra'] = this.fectra
	 
	if (this.fectra == this.jstoday){
		encabezado_pedido['fectra'] = this.fectra
	}else{
		encabezado_pedido['fectra'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500');
	}
	 encabezado_pedido['codven'] = this.vendedor
	 encabezado_pedido['totnet'] = this.redondear(this.subtotal)
	 encabezado_pedido['iva_cantidad'] = this.redondear(this.iva_cant_new)
	 encabezado_pedido['iva_pctje'] = this.iva_porcentaje
	 encabezado_pedido['observ']  = this.observacion_pedido
	 
	 
	 if (!encabezado_pedido['email']) {
		 encabezado_pedido['email'] = this.email_cliente
	 }
	 if (!this.ciudad) {
		 this.ciudad="NO DISPONIBLE"
	 }
	 encabezado_pedido['ciucli']  = this.ciudad

	let status_encabezado
	let numtra
	console.log (encabezado_pedido)
	console.log ("DATO CLIENTE")
	console.log (this.dato_cliente)
	
	
	console.log("ENTRO A GENERAR EL PEDIDO")
	this.srv.generar_pedido(encabezado_pedido).subscribe(
		data => {
			status_encabezado= data['status']
			numtra= data['numtra']
			console.log(data)
			if (status_encabezado == 'INSERTADO CON EXITO'){
				console.log('SE CREAN LOS RENGLONES')
				let renglones_pedido
				let numren = 1
				var longitud_renglones = this.articulos_pedido.length
				var contador_proceso = 0
				
					for (renglones_pedido of this.articulos_pedido) {
					renglones_pedido['numren'] = numren++
					renglones_pedido['numtra'] = numtra
					renglones_pedido['codemp']= this.empresa
					
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_renglones_pedido(renglones_pedido).subscribe(
						result => {
								console.log(result)
								console.log("####  CONTADOR PROCESO INICIO #####")
								contador_proceso++
								console.log(contador_proceso)
								  let datos = {};
								  datos['usuario'] = this.usuario;
								  datos['empresa'] = this.empresa;
								  datos['pedido'] = 'success'
								  console.log(datos)
								    if (contador_proceso == longitud_renglones){
										let datos_pedido_ruta = {};
										
											datos_pedido_ruta['empresa'] = this.empresa
											datos_pedido_ruta['numtra_pedido'] = numtra
											// datos_pedido_ruta['fectra'] = this.fectra
											datos_pedido_ruta['idruta'] = this.idruta
											datos_pedido_ruta['id_agencia'] = this.id_agencia
											
											if (this.fectra == this.jstoday){
												datos_pedido_ruta['fectra'] = this.fectra
											}else{
												datos_pedido_ruta['fectra'] = formatDate(this.fectra, 'yyyy-MM-dd', 'en-US', '-0500');
											}
											
											// this.fecha_entrega = formatDate(this.fecha_entrega , 'yyyy-MM-dd', 'en-US', '-0500');
											if (fecha_entrega == this.fectra){
												datos_pedido_ruta['fecha_entrega'] = this.fectra
											}else{
												datos_pedido_ruta['fecha_entrega'] = fecha_entrega
											}
											datos_pedido_ruta['hora_entrega'] = '00:00:00'
											
											if (this.exist_fecha_entrega){
											 datos_pedido_ruta['existe_fecha_entrega'] = 'SI'
											}else{
											 datos_pedido_ruta['existe_fecha_entrega'] = 'NO'
											}
											
											// this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
											
										
										this.srv.generar_pedido_ruta(datos_pedido_ruta).subscribe(
											result => {
												console.log(result)
											
											},
											error => {
												console.error(error)
											}
										)
										
																		
										
										
										//###### SE VALIDA SI ESTA CONFIGURADO EL ENVIO DE CORREO DE LOS PEDIDOS  ########
										if (this.srv.getConfCorreoPedCli() == 'SI'){
											this.correo_pedido(numtra,this.email_cliente)
										}
										
										this.router.navigate(['/admin/lista_pedidos', datos]);
									}

								},
						error => {
									console.error(error)
								}
						

						)
					}//FIN RECORRIDO RENGLONES PEDIDOS
				
			
			
			
					}
			
			
			
			
				}
	
			); 
	   } // FIN CONFIRMA FECHA DE ENTREGA
		
	}else {
			
			alert("Por favor llenar el campo Datos del cliente/Artículos del pedido/Correo electrónico..!!!")
		}
	
	}//FIN GENERA PEDIDO
	
	correo_pedido(numtra,email) {
		console.log("CORREO FACTURACION")
		console.log (numtra)
		console.log (email)
		// alert("Por favor ingrese RUC del cliente");

			const datos = {};
			datos['codemp'] = this.empresa;
			datos['usuario'] = this.usuario;
			datos['num_ped'] = numtra
			datos['asunto'] = 'pedido'
			datos['email'] = email
			
			this.srv.mail(datos).subscribe(
				data => {
					console.log(data)
				}
			)


	}//FIN ENVIO CORREO PEDIDO
	
	reset() {
	  this.clientes = false;
	  this.exist_articulo = false;
	  this.edit_cant = false;
	  this.masterSelected = false;
	  this.cantidad_nueva = '1';
	  this.cambiar_email = false;
	  this.razon_social = ''
	  this.email_cliente = ''
	  this.ciudad = ''
	  this.articulo = []
	  this.articulos_pedido = []
	  this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
	  this.iva_porcentaje = 0
	  this.iva_cant = 0
	  this.total = 0
	  this.observacion_pedido = ''

	

	}//FIN ENVIO CORREO PEDIDO

	
	
	
	
	
  
  
}
