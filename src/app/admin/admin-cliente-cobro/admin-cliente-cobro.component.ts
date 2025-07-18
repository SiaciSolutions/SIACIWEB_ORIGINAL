import { Component, OnInit,ViewChild,Input  } from '@angular/core';
import { ApiService } from './../../api.service';
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {formatDate} from '@angular/common';
import  pdfMake from 'pdfmake/build/pdfmake';
import  pdfFonts from 'pdfmake/build/vfs_fonts';

declare var AdminLTE: any;

@Component({
  selector: 'app-admin-cliente-cobro',
  templateUrl: './admin-cliente-cobro.component.html',
  styleUrls: ['./admin-cliente-cobro.component.css']
})
export class AdminClienteCobroComponent implements OnInit {

  usuario
   empresa
   nomcli
   codcli
   rucced =''
   dircli
   fecult
   email
   telcli
   telcli2 = null
   fectra
   public today= new Date();
   public success
   status
   ciudad
   public ciudad_lista:any = [];
   clientes
   fecha_status_cartera
   saldo_cliente
   datosCobranza: any[] = [];
   totalCobranza: any[] = [];
   loading: boolean;
   ver_detalle: boolean = false;
   vistaActiva: 'detalle' | 'forma_pago' = 'detalle';
   nombreClienteSeleccionado: string = '';
   listaVendedores: any[] = [];
  


   public provincia_lista:any = [];
   provincia
  
   // clientes = false;
   exist_razon_social = false;
   patron_cliente = undefined;
   razon_social_lista
   
   public tipo_doc_lista = [
        {"tipo": "C", "nom_doc": "CEDULA"},
        {"tipo": "R", "nom_doc": "RUC"},
        {"tipo": "P", "nom_doc": "PASAPORTE"}
      ];
    tipo_doc 
  
   public tipo_cliente_lista = [
        {"tipo": "01", "nom_tipo_cli": "PERSONA NATURAL"},
        {"tipo": "02", "nom_tipo_cli": "EMPRESA"}
      ];
    tipo_cliente
  
    constructor(  
    private router: Router, 
    private srv: ApiService, 
    private route: ActivatedRoute) 
    {
    this.success = false
    
    
    // this.ciudad = 'NO DISPONIBLE'
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
      // this.status = params['status'] || this.route.snapshot.paramMap.get('status') || 0;
        });
    console.log(this.usuario)
    console.log(this.empresa)
    
    // console.log(this.date)
    
    this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
    this.fecha_status_cartera = this.fectra
      console.log(this.fectra )
    this.lista_vendedores();
    // this.busca_cliente()
    
    // console.log(this.status)
    // if (this.status=='success'){
      
      // this.success = true
    // }
      
    
    AdminLTE.init();
    
    }

    lista_vendedores(){
      let datos =  {
        codemp: this.empresa
      };
      this.srv.lista_vendedores(datos).subscribe(
        data => {
          console.log("OBTENIENDO data reporte")
          this.listaVendedores = data
          console.log(this.listaVendedores)
  
            if ( this.listaVendedores.length == 0){
                alert ("No existe vendedores")
                this.loading = false
            }
        }
      );
    }
    
    consulta_saldo_cartera(){
    
      console.log("CONSULTO SALDO")
      let fec_cartera = formatDate(this.fecha_status_cartera, 'yyyy-MM-dd', 'en-US', '-0500');
      console.log(fec_cartera)
      
    //PARA BUSCAR SALDO_CLIENTE
    if (this.codcli){
  
    let datos_saldo_cliente = {};
    datos_saldo_cliente['codemp'] = this.empresa;
    datos_saldo_cliente['fecha_cartera'] = fec_cartera;
    datos_saldo_cliente['codcli'] = this.codcli;
    console.log (datos_saldo_cliente)
    this.srv.saldo_cartera(datos_saldo_cliente).subscribe(
       data => {
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
    
      busqueda_razon_social() { 
    console.log ("##### BUSCAR POR PATRON  ####")
    if (this.patron_cliente){
      const datos = {};
      datos['codemp'] = this.empresa;
      datos['patron_cliente'] = this.patron_cliente;
        this.srv.busqueda_razon_social2(datos).subscribe(data => {
          // console.log(data)
          
          
          let longitud_data = data.length
  
        if (longitud_data > 0 ) {
          console.log(data)
  
          this.razon_social_lista = data;
          this.exist_razon_social = true;
          // this.searching_articulo = false
          
      
          
        }else {
          alert("Cliente no encontrado con la palabra clave ingresada <<"+this.patron_cliente+">>");
          // this.searching_articulo = false
          this.exist_razon_social = false;
        }
          
  
        }); 
      }else  { 
        alert("Por favor llenar el campo Cliente");
      }
     }
     
     select_razon_social(ident,ruc,rz,correo,codcli,dircli) {
       console.log ("Seleccion de cliente")
      
      // this.dato_cliente= {"nomcli":rz,"rucced":ruc,"email":correo,"codcli":codcli,"dircli":dircli}
       // // ['codemp', 'nomcli','rucced','codcli','email','dircli','ciucli','telcli','telcli2']
      // this.tipo_doc = ident 
      // this.ruc = ruc
      // this.razon_social = rz
      
      // if (correo=== null){
        // alert("Favor llenar el correo electronico en la ficha del cliente..!!!")
        // this.email_cliente = undefined
      // }else {
        // this.email_cliente = correo
      // }
      // // this.email_cliente = correo
      // this.clientes = true;
      this.nombreClienteSeleccionado = rz;
      this.rucced = ruc
      this.tipo_doc = ident
      this.busca_cliente()
      this.exist_razon_social = false;
      this.patron_cliente = undefined;
     }
    
    
    busca_cliente() { 
    if (this.rucced && this.tipo_doc){
      console.log("#### BUSCO CLIENTE ###")
      const datos = {};
      datos['ruc'] = this.rucced;
      datos['codemp'] = this.empresa;
      datos['tpIdCliente'] = this.tipo_doc;
        this.srv.clientes(datos).subscribe(data => {
          // console.log(data)
        // this.dato_cliente = data
        if (data['rucced']) {
          console.log(data)
          // console.log(data['nomcli'])
          this.nomcli = data['nomcli']
          this.dircli = data['dircli']
          this.email = data['email']
          this.ciudad = data['ciucli']
          this.telcli = data['telcli']
          this.telcli2 = data['telcli2']
          this.codcli = data['codcli']
          if (data['tipo'] == null){
            this.tipo_cliente = '01'
          }else {
             this.tipo_cliente = data['tipo']
          }
          this.provincia = data['codprov']
  
          
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
          alert("Cliente con "+documento+" "+this.rucced+" no encontrado");
          // alert("Cliente no encontrado");
        }
        }); 
      }else  { 
        alert("Por favor ingrese TIPO DOC / IDENTIFICACION del cliente");
      }
     
    }

    consulta_detalle_cartera(){
      let datos_reporte =  {
        codemp: this.empresa,
        //fecha_inicio: this.fecha_desde,
        //fecha_fin: this.fecha_hasta,
        codcen: '',
        clase: '',
        codcli: this.codcli,
        tipo: ''
      };
      this.srv.cobranza(datos_reporte).subscribe(
        data => {
          console.log("OBTENIENDO data reporte")
          this.datosCobranza = data.clientes;
          this.totalCobranza = data.sumas_totales;
  
            if ( this.datosCobranza.length == 0){
                alert ("No existe datos para estas fechas")
                this.loading = false
            }else {
              //this.modificarJsonComision()
              this.ver_detalle = true
              this.loading = false
            }
        }
      );
    }
    calcularTotalSeleccionado() {
      this.datosCobranza.forEach((cliente) => {
        let venta = 0;
        let abono = 0;
        let saldo = 0;
    
        const renglonesSeleccionados = cliente.renglones.filter(r => r.selected);
    
        const fuente = renglonesSeleccionados.length > 0 ? renglonesSeleccionados : cliente.renglones;
    
        fuente.forEach(r => {
          venta += parseFloat(r[6] || 0);  // Valor facturado
          abono += parseFloat(r[7] || 0);  // Abono
          saldo += parseFloat(r[8] || 0);  // Saldo
        });
    
        // Nuevas propiedades que usamos en el HTML
        cliente.suma_venta_filtrada = venta;
        cliente.suma_abono_filtrada = abono;
        cliente.suma_total_filtrada = saldo;
      });
    }
    toggleSeleccionarTodos(cliente: any) {
      const selectAll = cliente.selectAll;
    
      cliente.renglones.forEach(r => {
        r.selected = selectAll;
      });
    
      this.calcularTotalSeleccionado();
    } 
    getTotalDetalleCobro(): number {
      let total = 0;
      for (const d of this.datosCobranza) {
        for (const x of d.renglones) {
          if (x.selected) {
            total += Number(x[8]) || 0;
          }
        }
      }
      return total;
    }
    
  
  }
  
