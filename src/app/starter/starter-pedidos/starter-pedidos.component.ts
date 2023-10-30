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
  selector: 'app-starter-pedidos',
  templateUrl: './starter-pedidos.component.html',
  styleUrls: ['./starter-pedidos.component.css']
})



	

export class StarterPedidosComponent implements OnInit {
	
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
	
	articulos_pedido: any = []
	
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

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  
  { 
  this.clientes = false;
  this.exist_articulo = false;
  this.edit_cant = false;
  this.masterSelected = false;
  this.cantidad_nueva = '1';


     this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
    console.log("Subtotal: ", this.subtotal)
	

	
    
  }

 
   ngOnInit() {
	   
	   
	    // this.parametros = {
      // usuario: this.route.snapshot.params.usuario,
      // empresa: this.route.snapshot.params.empresa
    // };
	
	
	this.usuario = this.route.snapshot.params.usuario;
	this.empresa = this.route.snapshot.paramMap.get('empresa');
	// this.route.queryParams.subscribe(params => {
        // // Defaults to 0 if no query param provided.
        // // this.ruc = +params['ruc'] || 0;
		// this.usuario = +params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
      // });
	
	
	// +params['ruc']
    // this.empresa = this.route.snapshot.paramMap.get('empresa');
	
	// this.route.params.subscribe(
      // (params: Params) => {
        // // this.coche.modelo = params.modelo;
        // // this.coche.marca = params.marca;
		// this.parametros.usuario = params.usuario;
        // this.parametros.empresa = params.empresa;
      // }
    // );
	
	// console.log(this.parametros.usuario)
	// console.log(this.parametros.empresa)
	
	console.log(this.usuario)
	console.log(this.empresa)

	this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	
	
	this.srv.iva().subscribe(data => {
      this.iva_siaci = data;
	  
	 let iva_defecto 
	  
	this.iva_siaci.map(function(dato){
	  if(dato.codiva == 'S'){
		  console.log("SETEANDO IVA DEFECTO")
		iva_defecto = dato.poriva;
		}
	  return dato;
	});
	
	console.log(iva_defecto)
	this.iva_porcentaje = iva_defecto
	  
	  
	  
	  
	  
	  
    });
	// console.log("#####  IVA DEFECTO   #####")
	// console.log(this.iva_porcentaje)
	AdminLTE.init();
	
	}
	

	
	edit_art (el) {
		console.log("ENTRADA ARTICULO A EDITAR")
		// console.log(el)
        this.editART = el
		this.edit_cant = true;
		console.log(this.editART)
    }
	
	
	delete_art (el) {
		console.log("ENTRADA ARTICULO A ELIMINAR")
		console.log(el)

	 let json_eliminar = this.articulos_pedido
	 var nomart = el
	 
	json_eliminar = json_eliminar.filter(function(dato){
	  if(dato.nomart == nomart){
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
	
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant	
	
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
	if (this.ruc){
		const datos = {};
		datos['ruc'] = this.ruc;
		datos['codemp'] = this.empresa;
			this.srv.clientes(datos).subscribe(data => {
				// console.log(data)
			this.dato_cliente = data
			if (data['rucced']) {
				console.log(data)
				console.log(data['nomcli'])
				this.razon_social = data['nomcli']
				this.clientes = true;
			}else {
				alert("Cliente no encontrado");
			}
			}); 
		}else  { 
			alert("Por favor ingrese RUC del cliente");
		}
	 }
	 
	 
	 
	 
	busca_articulo() { 
	if (this.patron_articulo){
		let datos = {};
		datos['nomart']  = this.patron_articulo;
		datos['codemp']  = this.empresa;
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
				
				this.filteredarticulo = this.myControl2.valueChanges.pipe(
				startWith(''),
				map(value => this._filter2(value))
				); 
	  
				
				
				
			}else {
				alert("Antículo no encontrado con la palabra clave ingresada <<"+this.patron_articulo+">>");
			}
			}); 
		}else  { 
			alert("Por favor llene el campo artículo");
		}
	 }
	 
	public update (codart, cant) {
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
	  if(dato.codart == codart){
		  console.log("ACTUALIZANDO CANTIDAD")
		dato.cant = cant_new;
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		
	  }
	  
	  return dato;
	});
	// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant
	this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)
	}

	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
	this.cantidad_nueva = '1';
   }
   
	public validaNumericos(event: any) {
    if((event.charCode >= 48 && event.charCode <= 57) ||(event.charCode == 46)){
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
   
   
   
   
   
   	public update_art_desc (codart, desc_art) {
		console.log("ACTUALIZAR LISTA DESCUENTO ARTICULO")
		console.log("####  NOMBRE ########")
		console.log(codart)
		console.log("####  DESCUENTO A APLICAR A ARTICULO ########")
		console.log(desc_art)
		var desc_art_new =desc_art

	if 	(codart && desc_art_new ){
	this.articulos_pedido.map(function(dato){
		console.log("VOY ACTUALIZAR DESC % y Valor de descuento")
	  if(dato.codart == codart){
		  console.log("ACTUALIZANDO DESC")
		dato.punreo = desc_art_new;
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		
	  }
	  
	  return dato;
	});
	
	
	this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	this.total = (this.subtotal - this.desc_cant) + this.iva_cant
	this.update_total_desc (this.desc_porcentaje) 
    console.log("subtotal: ", this.subtotal)
	
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
		this.total = (this.subtotal - this.desc_cant) + this.iva_cant
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
	  
	  
	  // 150 ---100%
	    // X  ---12%
	  	   
	   
	   
   }
   
   	public update_observ (codart, obsev) {
		console.log("####  observacion ########")
		console.log(obsev)
		if 	(codart && obsev ){
		this.articulos_pedido.map(function(dato){
			console.log("VOY ACTUALIZAR OBSERVACION ARTICULO")
		  if(dato.codart == codart){
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
		// console.log (this.elements_checkedList)
		// this.elements_checkedList = this.artSelectionList.selectedOptions.selected.map(s => s.value);
		if (this.elements_checkedList.length > 0) {
		
	for (checked_json of this.elements_checkedList) {
		console.log("NOMBRE DE ARTICULO A INSERTAR")	
		console.log(checked_json['codart'])
		
		this.articulos_pedido.map(function(dato){
			if(dato.codart == checked_json['codart']){
				console.log ("SUMO 1 a ITEM y no DEBERIA AGREGAR")
				// parseFloat("10.00")
			dato.cant = parseFloat(dato.cant) + 1;
			dato.v_desc_art = ((checked_json['punreo']*checked_json['prec01'])/100)*dato.cant;
			dato.subtotal_art = (checked_json['prec01']*dato.cant)-dato.v_desc_art
			// this.subtotal = dato.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			duplicado = true
			}
	  
		return dato;
		});
		
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			// this.total = (this.subtotal - this.desc_cant) + this.iva_cant
			// this.update_total_desc (this.desc_porcentaje) 
		
		
		
				// 117.7 ---100%
				   // X      10%
		
		if (!duplicado) {
		// console.log ("VOY A AGREGAR")
		checked_json['cant'] = '1';
		checked_json['observ'] = 'Puede agregar detalles del artículo';
		checked_json['subtotal_art'] = checked_json['prec01']
		checked_json['v_desc_art'] = (checked_json['punreo']*checked_json['prec01'])/100;
		this.articulos_pedido.push(checked_json)
		}
	
		}	
			console.log ("####  INSERTA PEDIDO CON IVA  ######")
			console.log (this.iva_porcentaje)
		
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
			this.total = (this.subtotal - this.desc_cant) + this.iva_cant
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
	 console.log ("GENERAR PEDIDO")
	
	console.log ("DATOS CLIENTE")
	console.log (this.dato_cliente)
	
	console.log ("ARTICULOS PEDIDO")
	console.log (this.articulos_pedido.length)
	
	
	if ((this.dato_cliente) && (this.articulos_pedido.length > 0)){
	 let encabezado_pedido= this.dato_cliente
	 encabezado_pedido['codus1'] = this.usuario;
	 encabezado_pedido['codemp'] = this.empresa;
	 encabezado_pedido['fectra'] = this.fectra
	 encabezado_pedido['totnet'] = this.redondear(this.subtotal)
	 encabezado_pedido['iva_cantidad'] = this.redondear(this.iva_cant)
	 encabezado_pedido['iva_pctje'] = this.iva_porcentaje
	 encabezado_pedido['observ']  = this.observacion_pedido

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
				
					for (renglones_pedido of this.articulos_pedido) {
					renglones_pedido['numren'] = numren++
					renglones_pedido['numtra'] = numtra
					renglones_pedido['codemp']= this.empresa
					
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_renglones_pedido(renglones_pedido).subscribe(
						result => {
								console.log(result)

								},
						error => {
									console.error(error)
								}
						

						)
					}//FIN RECORRIDO RENGLONES PEDIDOS
				
			
			
			
					}
			
			
			
			
				}
	
			); 
		
	}else {
			
			alert("Por favor llenar el campo Datos del cliente o Artículos del pedido..!!!")
		}
	
	}

	
	
	
	
	
  
  
}
