import { Component, OnInit,ViewChild,ElementRef, ViewEncapsulation } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'
import {AdminClienteComponent} from './../admin-cliente/admin-cliente.component';
// import { Select2OptionData } from './../ng2-select2';
// import { Select2OptionData } from 'ng2-select2';
// import {jsPDF} from 'jspdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


declare var AdminLTE: any;


@Component({
  selector: 'app-admin-pos-cajaregistradora',
  templateUrl: './admin-pos-cajaregistradora.component.html',
  styleUrls: ['./admin-pos-cajaregistradora.component.css'],
  encapsulation: ViewEncapsulation.None
  // encapsulation: ViewEncapsulation.ShadowDom
})



	

export class AdminPosCajaRegistradoraComponent implements OnInit {
	

	
	  parametros: {usuario: string, empresa: string};
	
	 myControl = new FormControl();
	 myControl2 = new FormControl();
	filteredOptions: Observable<string[]>;
	filteredarticulo: Observable<string[]>;
	public clientes : boolean;
	public exist_articulo : boolean;
	public razon_social : string;
	public email_cliente : string;
	public subtotal;
	public total = 0;
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
	public observacion_pedido = ''
	public cambiar_email:boolean;
	public lista_prec
	public nuevo_precio_renglon
//#############   RETENCIONES DE IVA	
	public retencion_iva_lista;
	public retencion_iva = 0
	public retencion_iva_select = undefined
	public retencion_iva_codigo
//#############   RETENCIONES DE FUENTE
	public retencion_fuente_lista;
	public retencion_fuente = 0;
	public retencion_fuente_select= undefined
	public retencion_fuente_codigo
	
	
	public bancos_lista;
	public codban
	public banco_cheque
	public tarjetas_lista;
	public cuentas_lista
	public codtar
	public banco_tarjeta
	public total_recibido = 0;
	public cambio = 0;
	public check_efectivo = true
	public check_cheque = false
	public check_tarjeta = false
	public check_credito = false
	public check_trasf_dep = false
	public almacen
	public almacen_nombre
	public caja
	public turno
	public tipo_busqueda : boolean;
	public aplicar_retencion : boolean;
	public habilitar_descuento : boolean;
	public ret_iva_aplicar = 0
	public ret_fuente_aplicar = 0
	articulos_index: any = []
	loading = true
	
	
	
	public monto_efectivo = 0
	public monto_cheque = 0
	public monto_tarjeta = 0
	public monto_transferencia = 0
	public monto_credito = 0
	
	public num_pagos_credito = 1
	public plazo_dias_pagos = 1
	
	public num_cheque = ''
	public num_tarjeta = ''
	public num_tranf = ''
	public codigo_recab = ''
	fruit = 'CONSUMDOR FINAL'
	public patron_cliente
	
    total_neto = 0
	public razon_social_lista
	public exist_razon_social : boolean;
	FLAG_BUSQUEDA_CLIENTE = false;
	public searching_articulo = false
	articulos_suma_cant = 0
	// public now: Date = new Date();
	// public date_real

	coddep
	
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

	// editART: ARTICULO
	editART: any = []
	dato_cliente
	
	options: any = []
	articulo: any = []
	articulos_seleccionado
	elements_checkedList:any = [];
	 masterSelected:boolean;
	serie
	articulos_pedido: any = []
	// #### PARA MARCAR LA EDICION DEL PRECIO DEL ARTICULO
	public edit_articulos
	
	 
	 @ViewChild('facturacion') facturacion: ElementRef;
	 @ViewChild('crear_cliente') crear_cliente: ElementRef;
	 @ViewChild('tab_facturacion') tab_facturacion: ElementRef;
	 @ViewChild('tab_crear_cliente') tab_crear_cliente: ElementRef;
	 
   @ViewChild("cliente_contenido")  cliente_contenido: AdminClienteComponent;
   
   	// @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
		@ViewChild('pdfTable') pdfTable: ElementRef;
		@ViewChild('closeBtnVenta') closeBtnVenta: ElementRef;
		@ViewChild('closeBtnCliente') closeBtnCliente: ElementRef;
		
	 
	 
	// typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers','Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
	
	
		
  // onSelectionChange() {
	  
    // console.log(this.getSelected());
    // // console.log(this.getUnselected());
  // }

  // getSelected() {
	    // return this.artSelectionList.selectedOptions.selected.map(s => s.value);
  // }

  // getUnselected() {
    // const differ = [];
    // const selected = this.getSelected();
    // for(let i = 0; i < this.typesOfShoes.length; i ++) {
      // if (selected.indexOf(this.typesOfShoes[i]) === -1) {
        // differ.push(this.typesOfShoes[i])
      // }
    // }
    // return differ;
  // }
  
  // public lista_cliente_demo = [
			// {"tipo": "Francisco", "nom_doc": "CEDULA"},
			// {"tipo": "Ramon", "nom_doc": "RUC"},
			// {"tipo": "Paola", "nom_doc": "PASAPORTE"},
			// {"tipo": "Florinda", "nom_doc": "CONSUMIDOR FINAL"}
		// ];
		
  // public exampleData: Array<Select2OptionData>;
  
  
  public tipo_doc_lista = [
			{"tipo": "C", "nom_doc": "CEDULA"},
			{"tipo": "R", "nom_doc": "RUC"},
			{"tipo": "P", "nom_doc": "PASAPORTE"}
		];
  tipo_doc
  
  
  forma_pago_lista = [
			{"tipo": "E", "nom_forma": "EFECTIVO"},
			{"tipo": "T", "nom_forma": "TARJETA"},
			{"tipo": "C", "nom_forma": "CHEQUE"}
		];
  
  
  forma_pago_seleccionada = "E"
  
   public tipo_cliente_lista = [
			{"tipo": "C", "nom_tipo_cli": "PERSONA NATURAL"},
			{"tipo": "E", "nom_tipo_cli": "EMPRESA"}
		];
  tipo_cliente
  
 nomcli
 rucced
 dircli
 telcli
 email
 
  
  

  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute) 
  
  { 
  this.tipo_busqueda = true
	//ARTICULO = TRUE
	//SERVICIO = FALSE
  this.clientes = false;
  this.exist_articulo = false;
  this.edit_cant = false;
  this.masterSelected = false;
  this.cantidad_nueva = '1';
  this.cambiar_email = false;
  this.aplicar_retencion = false;


     this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
    console.log("Subtotal: ", this.subtotal)
	
	
	        // setInterval(() => {
          // this.date_real = new Date();
		  
		  // this.jstoday = formatDate(this.date_real, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
		  // // console.log (this.date_real)
        // }, 5);
		
	

	
    
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
	
	////PARA BUSCAR VALIDAR APERTURA_CIERRE_CAJA
	const datos_caja = {};
	datos_caja['codemp'] = this.empresa;
	datos_caja['usuario'] = this.usuario;
	
	// console.log (this.content_cliente.nativeElement.classList)
	
	this.srv.status_caja(datos_caja).subscribe(
	   data => {
		   console.log("OBTENIENDO STATUS_CAJA")
		   console.log(data)
		   console.log(data["tipo_caja"])
		   this.almacen_nombre = data["nomalm"]
		   this.almacen = data["almacen"]
		   this.caja = data["caja"]
		   this.turno = data["turno"]
		   this.serie = data["serie"]
		   
		   
		   
		   	// this.status_caja = this.srv.getStatusCaja()
	// console.log ("####### STATUS CAJA  #######")
		// console.log (this.status_caja)


	

		   if ((data["tipo_caja"] == 'C')  || (data["tipo_caja"] == 'N')){
		   
			   let caja_param = {}
			   caja_param['status_caja'] = data["tipo_caja"] 
			   this.srv.seteo_caja(caja_param)
			   
			   let param = {}
				param['usuario'] = this.usuario;
				param['empresa'] = this.empresa;
			    console.log("##### PARAMETROS PARA CAJA #####")
				console.log(param)
			   
				this.router.navigate(['/admin/conciliacion-caja', param]);

		   }
		   if (data["tipo_caja"] == 'A'){
			   let caja_param = {}
			   caja_param['status_caja'] = data["tipo_caja"] 
			   caja_param['caja'] = data["caja"]
			   caja_param['nomalm'] = data["nomalm"]
			   caja_param['almacen'] = data["almacen"]
			   caja_param['turno'] = data["turno"]
			   this.srv.seteo_caja(caja_param)
		   }
		  

		}); 
	
	
	
	

	this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0500');
	this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
	console.log (this.jstoday)
	console.log (this.fectra)
	
////PARA BUSCAR IVA Y SETEAR IVA DEFECTO
	this.srv.iva().subscribe(data => {
		console.log (data)
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
////PARA BUSCAR CIUDAD
	const datos = {};
	datos['codemp'] = this.empresa;
	datos['usuario'] = this.usuario;	
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
		

	this.srv.articulos_index(datos).subscribe(
	   data => {
		   console.log("OBTENIENDO ARTICULOS INDEX")
		   console.log(data)
		   this.articulos_index = data
		   this.loading = false
		   // let option_defecto = {"codemp": "01", "codgeo": "0", "nomgeo": "*** Seleccione ciudad ***"};
		   // let option_defecto_final = {"codemp": "01", "codgeo": "0", "nomgeo": "*** OTRA CIUDAD ***"};
		   // this.ciudad_lista = data
		   // // this.ciudad_lista.unshift(option_defecto)
		   // this.ciudad_lista.push(option_defecto_final)
		   // console.log("CIUDAD LISTA")
		   // console.log(this.ciudad_lista)
		   // this.ciudad_lista = option_defecto
		}); 
		
		
		
		
 // BLOQUE PARA OBTENER RETENCIONES
	let datos_retenciones_iva = {};
	datos_retenciones_iva['codemp'] = this.empresa;
	datos_retenciones_iva['tipo'] = 'RT_IVA'	
		
	this.srv.retenciones(datos_retenciones_iva).subscribe(
	   data => {
		   console.log("OBTENIENDO RETENCION IVA")
		   console.log(data)
		   this.retencion_iva_lista = data
		}); 
		
	let datos_retenciones_fuente = {};
	datos_retenciones_fuente['codemp'] = this.empresa;
	datos_retenciones_fuente['tipo'] = 'RT_COM'	
		
	this.srv.retenciones(datos_retenciones_fuente).subscribe(
	   data => {
		   console.log("OBTENIENDO RETENCION FUENTE")
		   console.log(data)
		   this.retencion_fuente_lista = data
		}); 
		
	this.srv.bancos(datos_retenciones_fuente).subscribe(
	   data => {
		   console.log("OBTENIENDO BANCOS")
		   console.log(data)
		   this.bancos_lista = data
		});
	this.srv.tarjetascredito(datos_retenciones_fuente).subscribe(
	   data => {
		   console.log("OBTENIENDO TARJETAS DE CREDITO")
		   console.log(data)
		   this.tarjetas_lista = data
		}); 
	this.srv.cuentas_bancarias(datos_retenciones_fuente).subscribe(
   data => {
	   console.log("OBTENIENDO CUENTAS BANCARIAS")
	   console.log(data)
	   this.cuentas_lista = data
	});  
	console.log ("#### CONFIGURACION CORREO PEDIDOS ####")
	console.log (this.srv.getConfCorreoPedCli())

	
	let body = document.getElementsByTagName('body')[0];
	// body.classList.remove("className");   //remove the class
	body.classList.add("sidebar-collapse");   //add the class
	body.classList.remove("sidebar-open");  
	
	this.patron_cliente = 'CONSUMIDOR FINAL'
	this.busqueda_razon_social()
	
	
	AdminLTE.init();
	}
	
  	crea_cliente() {
			
		console.log("CREA CLIENTE")
		console.log(this.nomcli)
		console.log(this.ruc)
		console.log(this.dircli)
		console.log(this.telcli)
		// console.log(this.telcli2)
		console.log(this.email)
		console.log(this.fectra)

	// if (this.ruc){
		const datos = {};
		datos['codus1'] = this.usuario.toUpperCase();
		datos['codemp'] = this.empresa;
		datos['nomcli'] = this.nomcli.toUpperCase();
		datos['rucced'] = this.ruc;  //validar que sea formato menos de 13 y numerico
		datos['dircli'] = this.dircli;
		datos['telcli'] = this.telcli;  //validar que sea formato de menos de 10 y numerico
		datos['telcli2'] = null;
		// datos['telcli2'] = this.telcli2; //validar que sea formato de menos de 10 (OPCIONAL) y numerico
		datos['email'] = this.email;  //validar formato
		datos['fectra'] = this.fectra;
		
		// if (this.ciudad == "*** OTRA CIUDAD ***"){
			// this.ciudad = 'OTRA CIUDAD'
		// }
		this.ciudad = 'NO DISPONIBLE'
		datos['ciucli'] = this.ciudad;
		datos['tipo'] = this.tipo_cliente;
		datos['tpIdCliente'] = this.tipo_doc;
		
		// this.validar_campos_obligatorios(datos)
		// this.validar_formato_campos_numeros(datos)
		
		if (this.validar_campos_obligatorios(datos) && this.validar_formato_campos_numeros(datos) && this.validateEmail(this.email)){
		console.log("*** CREO CLIENTE ***")
		this.srv.crear_cliente(datos).subscribe(data => {
				console.log("RESPUESTA DE ENVIO PARA CREAR CLIENTES")
				// console.log(data)
				let datos = {};
				datos['usuario'] = this.usuario;
				datos['empresa'] = this.empresa;
				console.log (data["STATUS"])
				if (data["STATUS"] == 'DUPLICADO'){
					alert("Cliente con identificación "+this.ruc+" existe en esta empresa..!!");
				}else{
					alert("Cliente con identificación "+this.ruc+" creado con exito..!!");
					this.closeBtnCliente.nativeElement.click();
					this.busca_cliente()
					
					this.ruc = undefined
					this.telcli = undefined
					this.email = undefined
					this.nomcli = undefined
					this.dircli = undefined
					// this.tipo_cliente = undefined
					// this.tipo_doc = undefined
					
					
					
					
					
				}
	
			}
		); //FIN ENVIO CLIENTE
		}
	 }//FIN FUNCION CREAR CLIENTE
	
public captureScreen()  
  {
    let fecha_hora= formatDate(this.today, 'dd-MM-yyyy-hhmmss', 'en-US', '-0500');	  
  
  
    var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('Ticket_'+fecha_hora+'.pdf'); // Generated PDF   
    });  
  }
	
	public downloadAsPDF() {
		// const doc = new jsPDF();
		// const doc = new jsPDF('p','pt','a4');
		
		//RECIBOS 
		// const doc = new jsPDF('p', 'mm', [82, 300]);
		const doc = new jsPDF('p', 'mm', [82, 100]);
		
		
		    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      },
    };

//*******BOQUE Q SIRVEEEEEEE
	doc.setFontSize(5);
    const pdfTable = this.pdfTable.nativeElement;
	console.log (pdfTable.innerHTML)

    doc.fromHTML(pdfTable.innerHTML, 1, 1, {
      width: 80,
      elementHandlers: specialElementHandlers,
    }
	// // , function  (dispose) { 
                // // doc.save('Puppetboard.pdf');
        // // }
		);

    doc.save('recibo.pdf')
	// ;}
	
//*****FIN BOQUE Q SIRVEEEEEEE

		// const specialElementHandlers = {
		  // '#editor': function (element, renderer) {
			// return true;
		  // }
		// };

		// const pdfTable = this.pdfTable.nativeElement;

		// console.log (pdfTable.innerHTML)
		// doc.fromHTML(pdfTable.innerHTML, 15, 15, {
            // width: 190,
			// 'elementHandlers': specialElementHandlers
			// });
	
		// // doc.text("esto es una prueba", 15, 15, {
            // // width: 190,
			// // });
		// doc.save('savePDF.pdf');

		// doc.fromHTML(pdfTable.innerHTML, 15, 15, {
		  // width: 190,
		  // 'elementHandlers': specialElementHandlers
		// });
		
		// doc.html(document.body, {
		   // callback: function (doc) {
			 // doc.save();
		   // }
		// });
		
		// doc.html(document.body, {
		   // callback: function (doc) {
			 // doc.save();
		   // }
		// });
		
		// doc.fromHTML(pdfTable.innerHTML, {
		   // callback: function (doc) {
			 // doc.save('recibo.pdf');
		   // }
		// });
		
		// doc.html(pdfTable.innerHTML, {
		   // callback: (doc)=> {
			 // doc.save('recibo.pdf');
		   // }
		// });
		
		// doc.html(pdfTable.innerHTML);
		// doc.text("esto es una prueba",10,10);

		// doc.save('recibo.pdf');
		
		////******DEMO DE COMPROBANTE RECIBO DIMENSIONES ********
		// var doc = new jsPDF('p', 'mm', [82, 210]);
		// doc.setFontSize(10);
		// left,top
		// doc.text("Octonyan loves jsPDF\n                HOLA MUNDO", 5, 8);
		// doc.save('recibo.pdf');
		// doc.addImage('examples/images/Octonyan.jpg', 'JPEG', 15, 40, 180, 180);
		
		
		
		
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
				console.log(data[0].nomcli)

				if (data[0].nomcli == 'CONSUMIDOR FINAL'){
					console.log ("voy a seleccionar cliente")
					
						this.select_razon_social(data[0].tpIdCliente,data[0].rucced,data[0].nomcli,data[0].email,data[0].codcli,data[0].dircli)
				}else{
				
				this.razon_social_lista = data;
				this.exist_razon_social = true;
				// this.searching_articulo = false
				}
				
				
		
				
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
		 console.log (this.dato_cliente)
		 
		 // if (correo == null)
		if (this.dato_cliente['email'] == null)
		 {
			 
			alert("Este cliente no posee correo electrónico. Por favor asignar un correo para generar factura electrónica..!!!!") 
		 }
		 
		this.tipo_doc = ident 
		this.ruc = ruc
		this.razon_social = rz
		this.email_cliente = correo
		this.clientes = true;
		this.exist_razon_social = false;
		this.FLAG_BUSQUEDA_CLIENTE = false;
		this.patron_cliente = undefined;
	 }
	
	

	public switchtab(){
		console.log("***** cambiar pestaña*****")
		
		 // console.log(<HTMLInputElement>document.getElementById('tab1head').class);
		 // console.log (this.tab1head.nativeElement.classList)
		 
		 // this.tab1head.nativeElement.classList.remove("active")
		 // this.tab2head.nativeElement.classList.add("active")
		 // this.tab_1.nativeElement.classList.remove("active")
		 // this.tab_2.nativeElement.classList.add("active")
		 
		 this.facturacion.nativeElement.classList.remove("active")
		 this.crear_cliente.nativeElement.classList.add("active")
		 this.tab_facturacion.nativeElement.classList.remove("active")
		 this.tab_crear_cliente.nativeElement.classList.add("active")
		 
		 
		 	 
	 // @ViewChild('facturacion') facturacion: ElementRef;
	 // @ViewChild('crear_cliente') crear_cliente: ElementRef;
	 // @ViewChild('tab_facturacion') tab_facturacion: ElementRef;
	 // @ViewChild('tab_crear_cliente') tab_crear_cliente: ElementRef;
		 
		 // console.log (this.cliente_contenido)
		 
		 


		
	}
	
	
	forma_pago(forma){
		console.log("### FORMA_PAGO  ##")
		console.log(forma)
		console.log("### ESTATUS_CHECK_EFECTIVO  ##")
		console.log(this.check_efectivo)
	}
	
	cierre_caja(){
		console.log("### CIERRE_CAJA ##")
		////PARA BUSCAR CIUDAD
		const datos = {};
		datos['empresa'] = this.empresa;
		datos['usuario'] = this.usuario;	
		datos['accion'] = 'C'
		console.log (datos)
		this.router.navigate(['/admin/conciliacion-caja', datos]);
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
	
	set_aplicar_retencion() {
		console.log("SET RETENCION...!!!")
		console.log(this.aplicar_retencion)
		if (this.aplicar_retencion == false){
			this.aplicar_retencion = true;
		}else {
			this.aplicar_retencion = false;
			this.retencion_iva = 0
			this.retencion_fuente= 0
			this.retencion_iva_select = undefined
			this.retencion_fuente_select = undefined
			this.ret_iva_aplicar = 0
			this.ret_fuente_aplicar = 0
			this.total = ((this.subtotal - this.desc_cant) + this.iva_cant_new) 
		}
		console.log("SET RETENCION luego del cambio...!!!")
		console.log(this.aplicar_retencion)
	}
	
		
	set_retencion_iva() {
		console.log("SET RETENCION IVA...!!!")
		console.log (this.retencion_iva_select)
		if (this.retencion_iva_select){
			let retencion_iva_select_array = this.retencion_iva_select.split("|",2)
			console.log(retencion_iva_select_array[0])
			this.retencion_iva = retencion_iva_select_array[0]
			this.retencion_iva_codigo=retencion_iva_select_array[1]
			// CALCULO EL 30 del iva
			this.ret_iva_aplicar = (this.retencion_iva*this.iva_cant_new)/100
			this.total = (((this.subtotal - this.desc_cant) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
		}else{
			this.retencion_iva = 0
			this.retencion_iva_codigo=0
			this.ret_iva_aplicar = (this.retencion_iva*this.iva_cant_new)/100
			this.total = (((this.subtotal - this.desc_cant) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
		}


	}
	
	set_retencion_fuente() {
		console.log("SET RETENCION FUENTE...!!!")
		console.log (this.retencion_fuente_select)
		if (this.retencion_fuente_select != 0){		
			let retencion_fuente_select_array = this.retencion_fuente_select.split("|",2)
			console.log(retencion_fuente_select_array[0])
			this.retencion_fuente = retencion_fuente_select_array[0]
			this.retencion_fuente_codigo=retencion_fuente_select_array[1]
			this.ret_fuente_aplicar = (this.retencion_fuente*this.subtotal)/100
			this.total = (((this.subtotal - this.desc_cant) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
		}
			
		else{
			this.retencion_fuente = 0
			this.retencion_fuente_codigo=0
			this.ret_fuente_aplicar = (this.retencion_fuente*this.subtotal)/100
			this.total = (((this.subtotal - this.desc_cant) + this.iva_cant_new) - this.ret_iva_aplicar) - this.ret_fuente_aplicar
			
			
			
		}
	}
	
	
	
	consumidor_final(){
		console.log("VALIDAR SI ES CONSUMIDOR FINAL ES ESCOGIDO")
		console.log(this.tipo_doc)
		if (this.tipo_doc == 'F'){
			this.ruc = '9999999999999'
			this.busca_cliente()
		}
	}
	
	calc_cambio(){
		console.log("CALCULAR CAMBIO")
		console.log(this.monto_efectivo)
		console.log(this.monto_tarjeta)
		console.log(this.monto_cheque)
		
		this.total_recibido = this.monto_efectivo+this.monto_tarjeta+this.monto_cheque
		this.cambio= this.redondear(this.total_recibido-this.total)
		// console.log(this.tipo_doc)
		// if (this.tipo_doc == 'F'){
			// this.ruc = '9999999999999'
			// this.busca_cliente()
		// }
	}
	

	
	edit_art (el) {
		console.log("ENTRADA ARTICULO A EDITAR")
		// console.log(el)
        this.editART = el
		this.edit_cant = true;
		console.log(this.editART)
    }
	
	
	// delete_art (el) {
		// console.log("ENTRADA ARTICULO A ELIMINAR")
		// console.log(el)

	 // let json_eliminar = this.articulos_pedido
	 // var nomart = el
	 
	// json_eliminar = json_eliminar.filter(function(dato){
	  // if(dato.nomart == nomart){
		  // return false
	  // }else {
		 // return true 
		  
	  // }
	  // // return dato;
	// });	 
	
	// console.log(json_eliminar);//json original
	// this.articulos_pedido = json_eliminar	
	// this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));	
	// this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	// this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));	
	// this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new	
	// this.calc_cambio()
	
    // }
	
	// delete_art_todo () {
		// console.log("ENTRADA ARTICULO A ELIMINAR TODOOOOO")
			// this.articulos_pedido = []
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
			// this.iva_porcentaje = 0
			// this.iva_cant = 0
			// this.total = 0
			// this.total_recibido = 0
			// this.cambio = 0
	
    // }
	
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
	this.articulos_suma_cant = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.cant),0);
	
    }
	
	delete_art_todo () {
		console.log("ENTRADA ARTICULO A ELIMINAR TODOOOOO")
			this.articulos_pedido = []
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);	
			this.iva_porcentaje = 0
			this.iva_cant = 0
			this.total = 0
			this.articulos_suma_cant = 0
	
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
		
		document.getElementById('busca_art').blur();
		// document.getElementById('objeto').focus();///colocar foco
		
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
	
	
	
	 
	// public update (codart, cant) {
		// console.log("ACTUALIZAR LISTA")
		// console.log("####  NOMBRE ########")
		// console.log(codart)
		// console.log("####  CANTIDAD NUEVA ########")
		// console.log(cant)
		// var cant_new =cant
		
	// if 	(codart && cant_new){
		// if (cant_new === '0'){
			// alert ("Cantidad del código << "+codart+" >> debe ser mayor a 0..por favor validar")
	
		// }else{
	// this.articulos_pedido.map(function(dato){
		// console.log("VOY ACTUALIZAR NUMERO")
	  // if(dato.codart == codart){
		  // console.log("ACTUALIZANDO CANTIDAD")
		// dato.cant = cant_new;
		
		// // dato.precio_iva =  ((dato['poriva']*dato['prec01'])/100)*dato.cant;
		// //REDONDEADO PRECIO IVA
		// // dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;

		
		
		// dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		// dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		// //REDONDEADO subtotal_art
		// dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		// dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		// //REDONDEADO PRECIO IVA
		// dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;
		
	  // }
	  
	  // return dato;
	// });
	// // this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
	// this.subtotal = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0));
	// this.iva_cant = this.redondear((this.subtotal*this.iva_porcentaje)/100)
	// this.iva_cant_new = this.redondear(this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0));
	// this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
	
	// if (this.total_recibido > 0){
		// this.calc_cambio()
	// }
	
	// // this.update_total_desc (this.desc_porcentaje) 
    // console.log("Total: ", this.subtotal)
	// }

	// }else {
		// alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	// }
	
	// console.log(this.articulos_pedido)
   	// this.editART = undefined
	// this.cantidad_nueva = '1';
   // }
   
   	public update (codart,index,cant) {
		console.log("ACTUALIZAR LISTA")
		console.log("####  NOMBRE ########")
		console.log(codart)
		console.log("####  CANTIDAD NUEVA ########")
		console.log(cant)
		var cant_new =parseFloat(cant)
		
	if 	(codart && cant_new){
		if (cant_new === 0){
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
	this.articulos_suma_cant = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.cant),0);
	
	// this.update_total_desc (this.desc_porcentaje) 
    console.log("Total: ", this.subtotal)
	}

	}else {
		alert ("Cantidad del código << "+codart+" >> debe contener un valor...por favor validar")		
		
	}
	
	console.log(this.articulos_pedido)
   	this.editART = undefined
	this.cantidad_nueva = '1';
	
	
	// let body = document.getElementsByTagName('body')[0];
	// // body.classList.remove("className");   //remove the class
	// body.classList.add("sidebar-collapse");   //add the class
	document.getElementById('cant'+index).blur();
	
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
	 	
	if (this.total_recibido > 0){
		this.calc_cambio()
	}
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
		


		
		
		checked_json['cant'] = 1;
		checked_json['observ'] = 'Puede agregar detalles del artículo';
		checked_json['subtotal_art'] = this.redondear(checked_json['prec01'])
		checked_json['v_desc_art'] = (checked_json['punreo']*checked_json['prec01'])/100;
		this.articulos_pedido.push(checked_json)
		console.log("###### REGISTRO INSERTADO #####")
		console.log(this.articulos_pedido)
		
		}
	
		}	
			console.log ("####  INSERTA PEDIDO CON IVA  ######")
			// console.log (this.iva_porcentaje)
		
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
			this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
			this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			this.elements_checkedList = [];
			this.articulo = [];
			this.exist_articulo = false;
			this.articulos_suma_cant = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.cant),0);
			console.log(this.elements_checkedList)
		
		}else {
			alert("Por favor seleccione algún artículo")
		}

	 }
	 
	 
	inserta_pedido_grid(art) {
		let checked_json
		let duplicado = false
		this.patron_articulo = undefined
		
		
		this.elements_checkedList.push(art)
		
		// if (this.elements_checkedList.length > 0) {
		
	for (checked_json of this.elements_checkedList) {
		console.log("NOMBRE DE ARTICULO A INSERTAR")	
		console.log(checked_json['codart'])
		
		// this.get_prec_produc(checked_json['codart'])
		
		//COMENTADO VALIDACION DUPLICADO GUADAPRODUC....!!!! 
		this.articulos_pedido.map(function(dato){
			if(dato.codart == checked_json['codart']){
				console.log ("SUMO 1 a ITEM y no DEBERIA AGREGAR")
			dato.cant = parseFloat(dato.cant) + 1;
			
		dato.v_desc_art = ((dato['punreo']*dato['prec01'])/100)*dato.cant;
		
		dato.subtotal_art = (dato['prec01']*dato.cant)-dato.v_desc_art
		//REDONDEADO subtotal_art
		dato.subtotal_art =  Math.round(dato.subtotal_art* 100) / 100;
		
		dato.precio_iva= (dato.subtotal_art*dato['poriva'])/100
		//REDONDEADO PRECIO IVA
		dato.precio_iva = Math.round(dato.precio_iva* 100) / 100;

			duplicado = true
			}
	  
		return dato;
		});

		
		if (!duplicado) {
		console.log ("VOY A AGREGAR")
		console.log (this.articulos_pedido.length)
		
		if (this.articulos_pedido.length == 0){
			checked_json['index'] = this.articulos_pedido.length
		}else {
			console.log (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))
			checked_json['index'] = (Math.max.apply(Math, this.articulos_pedido.map(function(o) { return o.index; })))+1
		}
		


		
		
		checked_json['cant'] = 1;
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
			this.articulos_suma_cant = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.cant),0);
			console.log(this.elements_checkedList)
		
		// }else {
			// alert("Por favor seleccione algún artículo")
		// }

	 }
   

 
	 
	 
	// inserta_pedido() {
		// let checked_json
		// let duplicado = false
		// // console.log (this.elements_checkedList)
		// // this.elements_checkedList = this.artSelectionList.selectedOptions.selected.map(s => s.value);
		
		
		
		
		// if (this.elements_checkedList.length > 0) {
		
	// for (checked_json of this.elements_checkedList) {
		// console.log("NOMBRE DE ARTICULO A INSERTAR")	
		// console.log(checked_json['codart'])
		
		// // this.get_prec_produc(checked_json['codart'])
		
		
		// this.articulos_pedido.map(function(dato){
			// if(dato.codart == checked_json['codart']){
				// console.log ("SUMO 1 a ITEM y no DEBERIA AGREGAR")
				// // parseFloat("10.00")
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
		
			// // this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			// // this.total = (this.subtotal - this.desc_cant) + this.iva_cant
			// // this.update_total_desc (this.desc_porcentaje) 
		
		
		
				// // 117.7 ---100%
				   // // X      10%
		
		// if (!duplicado) {
		// // console.log ("VOY A AGREGAR")
		// checked_json['cant'] = '1';
		// checked_json['observ'] = 'Puede agregar detalles del artículo';
		// checked_json['subtotal_art'] = checked_json['prec01']
		// checked_json['v_desc_art'] = (checked_json['punreo']*checked_json['prec01'])/100;
		// this.articulos_pedido.push(checked_json)
		// console.log("###### REGISTRO INSERTADO #####")
		// console.log(this.articulos_pedido)
		
		// }
	
		// }	
			// console.log ("####  INSERTA PEDIDO CON IVA  ######")
			// console.log (this.iva_porcentaje)
		
			// // this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.prec01 * obj.cant),0);
			// this.subtotal = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.subtotal_art),0);
			// this.iva_cant = (this.subtotal*this.iva_porcentaje)/100
			// this.iva_cant_new = this.articulos_pedido.reduce((acc,obj,) => acc + (obj.precio_iva),0);
			// this.total = (this.subtotal - this.desc_cant) + this.iva_cant_new
			// this.elements_checkedList = [];
			// this.articulo = [];
			// this.exist_articulo = false;
			// if (this.total_recibido > 0){
				// this.calc_cambio()
			// }
			
			// console.log(this.elements_checkedList)
		
		// }else {
			// alert("Por favor seleccione algún artículo")
		// }

	 // }
	 
 
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
	
  // ####### INICIO PARA VALIDAR FORMAS DE PAGOS  #############
   generar_pdv() { 
	 console.log ("######  GENERAR PDV  ########")
	 
	 
	 
	console.log ("MONTO EFECTIVO")
	if (this.monto_efectivo == 0){
		this.monto_efectivo = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
	} 
	console.log(this.monto_efectivo)
	
	
	console.log ("DATOS CLIENTE")
	console.log (this.dato_cliente)
	
	console.log ("ARTICULOS PEDIDO")
	console.log (this.articulos_pedido.length)
	
	
	// if (confirm ("Esta seguro de generar esta factura ????") &&  (this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.dato_cliente['email'] != null)){
	if (confirm ("Esta seguro de generar esta factura ????") &&  (this.dato_cliente) && (this.articulos_pedido.length > 0) && (this.email_cliente) && 
	(this.validar_totales_formapago() == true)  && (this.validar_campos_cheque_tarjeta_trasf() == true) && (this.validar_campos_credito()== true)
		
	)
	{
	 let encabezado_pdv= this.dato_cliente
	 
	 if (!encabezado_pdv['telcli']){
		 encabezado_pdv['telcli'] = ''
	 }
	 encabezado_pdv['codus1'] = this.usuario;
	 encabezado_pdv['codemp'] = this.empresa;
	 encabezado_pdv['fecfac'] = this.fectra
	 
	 encabezado_pdv['totnet'] = this.redondear(this.subtotal)
	 encabezado_pdv['totiva'] = this.redondear(this.iva_cant_new)
	 encabezado_pdv['poriva'] = this.iva_porcentaje
	 encabezado_pdv['codalm']  = this.almacen
	 encabezado_pdv['numcaj']  = this.caja
	 encabezado_pdv['turno']  = this.turno
	 encabezado_pdv['serie']  = this.serie
	 encabezado_pdv['totfac']  = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
	 encabezado_pdv['totrec']  = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
     encabezado_pdv['totdes']  = this.desc_cant
	 encabezado_pdv['pordes']  = this.desc_porcentaje
	 // encabezado_pdv['codret'] = '0'
	 // encabezado_pdv['porret'] = '0'
	 // encabezado_pdv['valret'] = '0'
	 
	 // //FORMAS DE PAGO : EFECTIVO
	 if (this.check_efectivo) {

    // PARA PROBAR CREDITO COMENTO ESTA LINEA
	
		 encabezado_pdv['tipefe']  = 'E'
		 encabezado_pdv['valefe']  = this.monto_efectivo
		 
		 encabezado_pdv['conpag']  = 'E'	
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['plapag']  = '0'
		 encabezado_pdv['codtar']  = null
		 encabezado_pdv['codban']  = null
	
	// PARA PROBAR CREDITO COMENTO ESTA LINEA
		 // encabezado_pdv['tipefe']  = 'X'
		 // encabezado_pdv['valefe']  =  '0'
	     // encabezado_pdv['conpag']  = 'C'
	     // encabezado_pdv['tipcre']  = 'R'
		 // encabezado_pdv['numpag']  = '10'
		 // encabezado_pdv['plapag']  = '15'
		 // encabezado_pdv['valcre']  = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
		 // encabezado_pdv['forpag']  = '1'
		 // encabezado_pdv['cuecob']  = '1'

		 
		 
	 }else {
		encabezado_pdv['tipefe']  = 'X'
		encabezado_pdv['valefe']  =  '0'
	 }

	 
	 // // //FORMAS DE PAGO : CHEQUE
	 if (this.check_cheque) {
		 encabezado_pdv['tipche']  = 'C'
		 encabezado_pdv['numche']  =  this.num_cheque
		 encabezado_pdv['valche']  =  this.monto_cheque
		 encabezado_pdv['conpag']  = 'E'
		 
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['codban']  = this.codban
	 } else {
		 encabezado_pdv['tipche']  = 'X'
		 encabezado_pdv['numche']  = '' 
		 encabezado_pdv['valche']  = '0'
		 encabezado_pdv['codban']  = null
	 }

	 
	// //FORMAS DE PAGO : TARJETAS
	 if (this.check_tarjeta) {
		encabezado_pdv['tiptar']  = 'T'
		encabezado_pdv['numtar']  = this.codigo_recab
		encabezado_pdv['valtar']  = this.monto_tarjeta
		encabezado_pdv['conpag']  = 'E'
		
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['codtar']  = this.codtar
		 
	 } else {
		encabezado_pdv['tiptar']  = 'X'
		encabezado_pdv['numtar']  =  ''
		encabezado_pdv['valtar']  =  '0'
		encabezado_pdv['codtar']  = null
		 
	 }
	 
	// //FORMAS DE PAGO : TRANSFERENCIA / DEPOSITO
	 if (this.check_trasf_dep) {
		encabezado_pdv['tiptrans']  = 'B'
		encabezado_pdv['numtrans']  = this.num_tranf
		encabezado_pdv['valtrans']  = this.monto_transferencia
		encabezado_pdv['conpag']  = 'E'
		
		 encabezado_pdv['tipcre']  = 'X'
		 encabezado_pdv['numpag']  = '1'
		 encabezado_pdv['valcre']  = '0'
		 encabezado_pdv['forpag']  = '0'
		 encabezado_pdv['cuecob']  = '0'
		 encabezado_pdv['coddep']  = this.coddep
		 
	 } else {
		encabezado_pdv['tiptrans']  = 'X'
		encabezado_pdv['numtrans']  =  ''
		encabezado_pdv['valtrans']  =  '0'
		encabezado_pdv['coddep']  = null
		 
	 }
	 
	 	// //FORMAS DE PAGO : CREDITO
	 if (this.check_credito) {
			encabezado_pdv['conpag']  = 'C'
			encabezado_pdv['numpag']  = this.num_pagos_credito
			encabezado_pdv['valcre']  = this.redondear(this.total)
			encabezado_pdv['plapag']  = this.plazo_dias_pagos
 	 }
	 //##############   BLOQUE DE RETENCIONES   ################
	if (this.aplicar_retencion){
	 
		if (this.retencion_iva_select){
			console.log ("SELECCIONADO RETENCION DE IVA")
			encabezado_pdv['codiva'] = 	this.retencion_iva_codigo
			encabezado_pdv['porivar'] = this.retencion_iva 
			encabezado_pdv['valiva'] = this.ret_iva_aplicar
		}else{
			encabezado_pdv['codiva'] = 	''
			encabezado_pdv['porivar'] = ''
			encabezado_pdv['valiva'] = ''
		}
		
		if (this.retencion_fuente_select){
			console.log ("SELECCIONADO RETENCION DE FUENTE")
			console.log(this.retencion_fuente_codigo)
			console.log(this.retencion_fuente)
			console.log(this.ret_fuente_aplicar)
			encabezado_pdv['codret'] = this.retencion_fuente_codigo
			encabezado_pdv['porret'] = this.retencion_fuente 
			encabezado_pdv['valret'] = this.redondear(this.ret_fuente_aplicar)
		}else{
			encabezado_pdv['codret'] = ''
			encabezado_pdv['porret'] = ''
			encabezado_pdv['valret'] = ''
		} 
	} else{
			console.log ("#### NO HAY RETENCIONES A APLICAR  ####")
			encabezado_pdv['codiva'] = 	''
			encabezado_pdv['porivar'] = ''
			encabezado_pdv['valiva'] = ''
			encabezado_pdv['codret'] = 	''
			encabezado_pdv['porret'] = ''
			encabezado_pdv['valret'] = ''
			}
			
		 //##############  FIN BLOQUE DE RETENCIONES   ################
	 
	 // datos[tipefe],datos['valefe'],'tipche',datos['numche'],datos['valche'],datos['tiptar'],datos['numtar'],datos['valtar']
	 
	 
	 // if (!this.ciudad) {
		 // this.ciudad="NO DISPONIBLE"
	 // }
	 // encabezado_pdv['ciucli']  = this.ciudad
	 


	let status_encabezado
	let numfac
	console.log (encabezado_pdv)
	console.log ("DATO CLIENTE")
	console.log (this.dato_cliente)
	
	
	console.log("ENTRO A GENERAR EL PEDIDO")
	this.srv.generar_encabezado_pdv(encabezado_pdv).subscribe(
		data => {
			status_encabezado= data['status']
			numfac= data['numfac']
			console.log(data)
			if (status_encabezado == 'INSERTADO CON EXITO'){
				console.log('SE CREAN LOS RENGLONES')
				let renglones_pedido
				let numren = 1
				var longitud_renglones = this.articulos_pedido.length
				var contador_proceso = 0
				
					for (renglones_pedido of this.articulos_pedido) {
					renglones_pedido['numren'] = numren++
					renglones_pedido['numfac'] = numfac
					renglones_pedido['codemp']= this.empresa
					renglones_pedido['numcaj']  = this.caja
					
					console.log("JSON a INSERTAR DE LOS ARTICULOS DEL PEDIDO");
					console.log(renglones_pedido); //{ COMPROBANTE: "Factura", SERIE_COMPROBANTE: "033-115-000071888", RUC_EMISOR: "1790016919001", RAZON_SOCIAL_EMISOR: "CORPORACION FAVORITA C.A.", FECHA_EMISION: "28/02/2019", FECHA_AUTORIZACION: "28/02/2019 17:32:27", TIPO_EMISION: "NORMAL", IDENTIFICACION_RECEPTOR: "", CLAVE_ACCESO: "0903132538", NUMERO_AUTORIZACION: "2802201901179001691900120331150000718880713001612", … }
						
					this.srv.generar_renglones_pdv(renglones_pedido).subscribe(
						result => {
								console.log(result)
								console.log("####  CONTADOR PROCESO INICIO #####")
								contador_proceso++
								console.log(contador_proceso)
								  let datos = {};
								  datos['usuario'] = this.usuario;
								  datos['empresa'] = this.empresa;
								  // datos['pedido'] = 'success'
								  // console.log(datos)
								    if (contador_proceso == longitud_renglones){
										// //###### SE VALIDA SI ESTA CONFIGURADO EL ENVIO DE CORREO DE LOS PEDIDOS  ########
										// if (this.srv.getConfCorreoPedCli() == 'SI'){
											// this.correo_pedido(numtra,this.email_cliente)
										// }
										this.closeBtnVenta.nativeElement.click();
										
										
										let datos_fe = {}
										datos_fe['numfac'] = numfac
										datos_fe['codemp'] = this.empresa
										datos_fe['venta'] = 'success'
										
										this.srv.aplicar_fact_electronica(datos_fe).subscribe(
											result => {
												this.router.navigate(['/admin/lista_pdv', datos]);
											}
											
											
										)
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
		
	}else {
			// alert("Por favor llenar el campo Datos del cliente/Artículos del pedido/Correo electrónico..!!!")
			
			if (this.dato_cliente['email'] == null ){
				alert("Por favor llenar ingresar Correo Electrónico del cliente !!!")
			}
			if (this.articulos_pedido.length == 0){
				alert("Por favor ingresar articulos a facturar !!!")
			}
		
	}
	
	}//FIN GENERA PEDIDO
	
	
	validar_totales_formapago() {
		console.log ("### VALIDAR TOTALES FORMAPAGO  ###")
		console.log("###  EFECTIVO  ###")
		console.log (this.monto_efectivo)
		console.log("###  CHEQUE  ###")
		console.log (this.monto_cheque)
		console.log("###  TARJETA  ###")
		console.log (this.monto_tarjeta)
		console.log("###  CREDITO  ###")
		console.log (this.monto_credito)
		console.log("###  TRANSFERENCIA  ###")
		console.log (this.monto_transferencia)
		
		let suma_total_formapago= this.monto_efectivo+this.monto_cheque+this.monto_tarjeta+this.monto_credito+this.monto_transferencia
		let total = this.redondear(this.redondear(this.subtotal)+this.redondear(this.iva_cant_new))
		console.log (suma_total_formapago)
		console.log (total)
		

		if (suma_total_formapago === total){
			return true
			
		}else {
			alert("Favor validar el monto de las formas de pago sean igual al monto de la factura total..!!!")
			return false
		}
	
	}
	validar_campos_credito() {
		console.log ("### VALIDAR CAMPO CREDITO###")
		if (this.check_credito){
			if ( this.num_pagos_credito == 0 || this.plazo_dias_pagos == 0) {
				alert("Por favor numero de pagos y plazo dias del credito deben ser superior a 0")
				return false
			}else{
				return true
			}
		}
	return true

	
	} 
	
		
	validar_campos_cheque_tarjeta_trasf() {
		console.log ("### VALIDAR CAMPO CHEQUE TARJETA  ###")
		if (this.check_tarjeta){
			if ((!this.num_tarjeta || this.num_tarjeta.length == 0) || (!this.codtar || this.codtar.length == 0)) {
				alert("Por favor ingresar el codigo de transaccion de tarjeta y tipo de tarjeta")
				return false
			}else{
				return true
			}
		}
		if (this.check_cheque){
			if ((!this.num_cheque || this.num_cheque.length == 0) || (!this.codban ||  this.codban.length == 0) ){
				alert("Por favor ingresar el Numero de cheque y Banco del cheque")
				return false
			}else{
				return true
			}
			
		}
		if (this.check_trasf_dep){
			if ((!this.num_tranf || this.num_tranf.length == 0) || (!this.coddep ||  this.coddep.length == 0) ){
				alert("Por favor ingresar el Numero de tranferencia / Deposito y Cuenta acreditada")
				return false
			}else{
				return true
			}
			
		}
	return true

	} 
	
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
	
	center (){
		
		window.scrollTo( 0, 0 );
	}

	validar_campos_obligatorios (datos){
		console.log("VALIDANDO CAMPOS OBLIGATORIOS")
		console.log(datos['nomcli'])
		console.log(datos['rucced'])
		console.log(datos['tpIdCliente'])
		console.log(datos['ciucli'])
		let STATUS_OBLIGATORIO = true
		if ((!datos['nomcli']) || (datos['nomcli'].length == 0)){
			alert("Nombre/Razón social vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['rucced']) || (datos['rucced'].length == 0)){
			alert("Número de Indentificacion vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['tpIdCliente']) || (datos['tpIdCliente'] == 'N')){
			alert("Tipo de Identificacion no seleccionado. Por favor seleccione CEDULA/RUC/PASAPORTE según el caso.")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['tipo']) || (datos['tipo'] == 'N')){
			alert("Tipo de cliente no seleccionado. Por favor seleccione PERSONA NATURAL/EMPRESA según el caso")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['dircli']) || (datos['dircli'].length == 0)){
			alert("Dirección de cliente vacio. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}else if (((!datos['telcli']) || (datos['telcli'].length == 0))){
			alert("Por favor llenar al menos un número telefónico")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['ciucli'])){
			alert("Ciudad no seleccionada. Por favor seleccione alguna ciudad ó OTRA CIUDAD según el caso.")
			STATUS_OBLIGATORIO = false
		}else if ((!datos['email']) || (datos['email'].length == 0)){
			alert("Correo electrónico vacío. Por favor llenar.")
			STATUS_OBLIGATORIO = false
		}
		// console.log(datos['rucced'])
		return (STATUS_OBLIGATORIO)
	}
	
	validar_formato_campos_numeros (datos){
		console.log("#######VALIDANDO CAMPOS NUMERICO #####")
		
		// console.log(datos['nomcli'])
		
		console.log(datos['rucced'])
		console.log(datos['telcli'])
		// console.log(datos['telcli2'])
		let STATUS = true
		if (isNaN(datos['rucced'])){
			alert(" NUMERO DE INDENTIFICACION SOLO DEBE CONTENER VALORES NUMERICOS..!!");
			let STATUS = false
		}else if (isNaN(datos['telcli'])){
			alert(" NUMERO DE TELEFONO DE CONTENER SOLO VALORES NUMERICOS..!!");
			let STATUS = false
		}
		// else if (isNaN(datos['telcli2'])){
			// alert(" NUMERO DE TELEFONO MOVIL DE CONTENER SOLO VALORES NUMERICOS..!!");
			// let STATUS = false
		// }
		return (STATUS)
	}
	
	
	
	
	
  
  
}
