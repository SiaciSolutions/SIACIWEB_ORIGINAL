import { Component, OnInit,ViewChild } from '@angular/core';
// Variable in assets/js/scripts.js file
import { Router,ActivatedRoute,Params,RouterEvent } from '@angular/router';
import { ApiService } from './../../api.service';
import { FormControl } from "@angular/forms";
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {MatSelectionList} from '@angular/material'
import {DataTableDirective} from 'angular-datatables';

declare var AdminLTE: any;
@Component({
  selector: 'app-admin-lista-cobros',
  templateUrl: './admin-lista-cobros.component.html',
  styleUrls: ['./admin-lista-cobros.component.css']
})
export class AdminListaCobrosComponent implements OnInit {
  @ViewChild(DataTableDirective) 
  datatableElement: DataTableDirective;
    dtOptions:any = {};

  usuario;
  empresa;
  lista_cobros
  lista_cobros_tabla
  public loading : boolean;
  public espera_correo_facturacion : boolean;
  public espera_exitoso_facturacion : boolean;
  public espera_correo_pedido : boolean;
  public espera_exitoso_pedido : boolean;
  public espera_generar_pdf : boolean;
  public success
  public success_act
  pedido_status
  public edit_ruta
  lista_rutas
  fecha_entrega_busqueda
  listado_original
  fecha_desde
  fecha_hasta


  constructor(
  private router: Router, 
  private srv: ApiService, 
  private route: ActivatedRoute)
  
  { this.loading = true;
    this.espera_correo_facturacion = false;
  this.espera_exitoso_facturacion = false;
  this.espera_correo_pedido = false;
  this.espera_exitoso_pedido = false;
  
  }
  
  
  title = 'Example of Angular 8 DataTable';

   
   ngOnInit() {
    if (!this.srv.isLoggedIn()) {
        this.router.navigateByUrl('/');
      }
           
      this.route.queryParams.subscribe(params => {
        this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
        this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
      });   
        
      const datos = {};
      datos['codemp'] = this.empresa;	
      datos['usuario'] = this.usuario;
      
      var newdate = new Date();
      newdate.setDate(newdate.getDate() -30 ); 
      
      this.fecha_desde  = formatDate(newdate, 'yyyy-MM-dd', 'en-US', '-0500');
      console.log (this.fecha_desde)
      this.fecha_hasta  = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '-0500');
      datos['fecha_desde'] = this.fecha_desde
      datos['fecha_hasta'] = this.fecha_hasta

      this.srv.lista_cobros(datos).subscribe(
      data => {
        
        console.log(data)
        console.log ("EJECUTADA DATA")
        this.lista_cobros_tabla = data
      }); 
    
    setTimeout(()=> {	
      console.log("TIME OUT")
      this.lista_cobros = this.lista_cobros_tabla
      this.listado_original = this.lista_cobros
      
      
      this.dtOptions = {
        order: [1, 'desc'],
        dom: 'Bfrtip',
        buttons: [{
                  extend: 'print',
                  filename: 'LISTA_COBROS_SIACI_WEB'+this.usuario
              },
              {
                  extend: 'excel',
                  filename: 'LISTA_COBROS_SIACI_WEB'+this.usuario
              }],
        columnDefs: [
        { "width": "200px", "targets": 0 }
        ],
        fixedColumns: true,
        pageLength: 10,
           
        processing: true
      };
        
        this.loading = false;
        }, 3000)

   
      AdminLTE.init();
    } 
  
   buscar_ordenes_fecha(): void {
    let datos = {};
    this.loading = true;
    datos['codemp'] = this.empresa;	
    datos['fecha_desde'] = this.fecha_desde
    datos['fecha_hasta'] = this.fecha_hasta
    datos['codalm'] = this.srv.getCodAgencia();	
  
    this.srv.lista_cobros(datos).subscribe(
      data => {
        console.log(data)
        console.log ("EJECUTADA DATA")
        this.lista_cobros_tabla = data
      }); 
      
      setTimeout(()=> {	
        console.log("TIME OUT")
        this.lista_cobros = this.lista_cobros_tabla
        this.listado_original = this.lista_cobros
        
        
      this.dtOptions = {
        order: [1, 'desc'],
        dom: 'Bfrtip',
        buttons: [{
                  extend: 'print',
                  filename: 'LISTA_COBROS_SIACI_WEB'
              },
              {
                  extend: 'excel',
                  filename: 'LISTA_COBROS_SIACI_WEB'
              }],
        columnDefs: [
        { "width": "200px", "targets": 0 }
        ],
        fixedColumns: true,
        pageLength: 10,
        processing: true

      };

        this.loading = false;
        
        }, 3000)
      
    }
    
  
    buscar_fecha_entrega(): void {

    
    console.log ('RENDER')
    console.log (this.fecha_entrega_busqueda)
    if (this.fecha_entrega_busqueda){
      let fecha_entrega_busqueda = formatDate(this.fecha_entrega_busqueda, 'dd-MM-yyyy', 'en-US', '-0500')
      console.log (fecha_entrega_busqueda);
      console.log (this.lista_cobros)
      
        var newArray = this.listado_original.filter(function (el) {
        return el.fecha_entrega == fecha_entrega_busqueda
      });
      
      if (newArray.length > 0){
      console.log (newArray)
      this.render_table(newArray);
      }else {
        alert ("No existen pedidos cargados para la fecha de entrega ingresada")
        this.loading = false
      }
      
      
    }else {
      alert ("Por favor ingrese fecha de entrega")
      this.loading = false
    }
  
  
  
  }
  
  
   ver_listado_completo(): void {
     
      const datos = {};
      datos['codemp'] = this.empresa;	
      datos['usuario'] = this.usuario;

      this.srv.lista_pedidos(datos).subscribe(
        data => {
          console.log(data)
          console.log ("EJECUTADA DATA")
          this.lista_cobros_tabla = data
          this.render_table(this.lista_cobros_tabla);
        }); 

      
  }
  
  
  
    render_table(new_list): void {

    this.loading = true
    this.lista_cobros = undefined
    setTimeout(()=> {	
      console.log("TIME OUT")
      this.lista_cobros = new_list
    
      this.dtOptions = {
        order: [1, 'desc'],
        dom: 'Bfrtip',
        buttons: [{
          extend: 'print',
          filename: 'LISTA_COBROS_SIACI_WEB'+this.usuario
        },
        {
          extend: 'excel',
          filename: 'LISTA_COBROS_SIACI_WEB'+this.usuario
        }],
        columnDefs: [
         { "width": "200px", "targets": 0 }
        ],
        fixedColumns: true,
        pageLength: 10,
         processing: true
      
      };
      
      this.loading = false;
    }, 2000)
  }
  
  eliminarCobro(numcco: string): void {
    const datos: any = {
      codemp: this.empresa,
      usuario: this.usuario,
      numcco: numcco   
    };

    if (confirm(`¿Seguro deseas eliminar el cobro ${numcco}?`)) {
      this.srv.eliminar_cobro(datos).subscribe(
        (resp: any) => {
          console.log("Cobro eliminado:", resp);
          alert(resp.STATUS); 
          this.buscar_ordenes_fecha();
        },
        (error: any) => {
          console.error("Error al eliminar el cobro:", error);
          alert("Ocurrió un error al eliminar el cobro.");
        }
      );
    }
  }
  
}

