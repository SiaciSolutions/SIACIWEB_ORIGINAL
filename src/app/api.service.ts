import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { of as observableOf, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { catchError } from 'rxjs/operators';

// import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // public apiUrl = 'http://192.168.0.55';
  
  // public apiUrl = 'http://192.168.101.4';
  //public apiUrl = 'http://192.168.100.11';
    // public apiUrl = 'https://192.168.100.11';
 
  // public apiUrl = 'https://192.168.101.2';
    // public apiUrl = 'https://192.168.0.24';
	public apiUrl = 'https://127.0.0.1';
		// public apiUrl = 'https://192.168.101.6';
	
  // public apiUrl = 'https://192.168.0.13';
  // public apiUrl = 'https://192.168.101.7';
    
	// public apiUrl = 'https://192.168.101.5';
	// public apiUrl = 'https://192.168.101.2';
	 // public apiUrl = 'https://192.168.133.214';
  
    // public apiUrl = 'https://192.168.100.112';
  fecha_hora
  public port = '5009';
  

  empresa
  usuario
  geoloc
  
  
  
  
  
  constructor(private http: HttpClient,private router: Router) { 
    console.log(this.apiUrl)
  console.log(this.port)
  }
  
  // private getUser(): string {
	  // let usuario='supervisor'
	  // console.log("DENTRO DE GET USER")
	  // console.log(this.empresa)
	  // console.log(this.usuario)
        // // if (!this.ruc) {
            // // this.ruc = localStorage.getItem('ruc_recv')
        // // }
		// // {ruc: this.ruc}
		// // let datos = {supervisor: 'supervisor'}
        // return usuario
    // }/////
	
   private getUsuario(): string {
	  let usuario=localStorage.getItem('usuario_recv')
      return usuario.toUpperCase()
    }
   private getEmpresa(): string {
	  let usuario=localStorage.getItem('empresa_recv')
      return usuario
    }
   private getConfGeoloc(): string {
	  let geoloc=localStorage.getItem('geoloc_recv')
      return geoloc
    }
   private getConfPV(): string {
	  return localStorage.getItem('punto_venta_recv')
    }
   public getConfCorreoPedCli(): string {
	  return localStorage.getItem('correo_ped_cli_recv')
    }
   public getConfCorreoFact(): string {
	  return localStorage.getItem('correo_fact_recv')
    }
   public getConfEditPedido(): string {
	  return localStorage.getItem('edit_ped_recv')
    }
  public getTipacc(): string {
	  return localStorage.getItem('tipacc_recv')
    }
  public getNomemp(): string {
	  return localStorage.getItem('nomemp_recv')
    }
 public getStatusCaja(): string {
	  return localStorage.getItem('status_caja')
    }
 public getCaja(): string {
	  return localStorage.getItem('caja')
    }
 public getTurno(): string {
	  return localStorage.getItem('turno')
    }
 public getAlmacen(): string {
	  return localStorage.getItem('almacen')
    }
 public getNomAlmacen(): string {
	  return localStorage.getItem('nomalm')
    }
	
 public getCajaReg(): string {
	  return localStorage.getItem('act_caja_reg')
    }
 public getCalendario(): string {
	  return localStorage.getItem('act_calendario')
    }
 public getIngresoBodega(): string {
	  return localStorage.getItem('act_ing_bod')
    }
 public getTalleres(): string {
	  return localStorage.getItem('act_talleres')
    }
	
public getAgencia(): string {
	  return localStorage.getItem('nom_agencia')
    }
public getCodAgencia(): string {
	  return localStorage.getItem('codagencia')
    }
	
public getPedidos(): string {
	  return localStorage.getItem('act_pedidos')
    }
public getClientes(): string {
	  return localStorage.getItem('act_clientes')
    }
	
public getWhatsapp(): string {
	  return localStorage.getItem('act_whatsapp')
    }
public getNotifAutoFac(): string {
	  return localStorage.getItem('act_notif_auto_fac')
    }
public getConfAbrirCierreCaja(): string {
	  return localStorage.getItem('act_abrir_cierre_caja')
    }
public getConfRetencionesPdv(): string {
	  return localStorage.getItem('act_retenciones_pdv')
   }
public getConfTotalRecibidoCambioPdv(): string {
	  return localStorage.getItem('act_total_recibido_cambio')
   }
public getConfSeleccArtServPdv(): string {
	  return localStorage.getItem('act_selecc_articulo_servicio_pdv')
   }
public getConfPagoEfectivo(): string {
	  return localStorage.getItem('act_pago_efectivo_pdv')
   }
public getConfPagoTarjeta(): string {
	  return localStorage.getItem('act_pago_tarjeta_pdv')
   }
public getConfPagoCheque(): string {
	  return localStorage.getItem('act_pago_cheque_pdv')
   }
public getConfPagoTrans(): string {
	  return localStorage.getItem('act_pago_trans_pdv')
   }
public getConfPagoCredito(): string {
	  return localStorage.getItem('act_pago_credito_pdv')
   }
public getConfEdicionPlazoCredito(): string {
	  return localStorage.getItem('act_edicion_plazo_credito_pdv')
   }
   
public getConfConsultaEstadoCartera(): string {
	  return localStorage.getItem('consultar_estado_cartera')
   }
   
public getEgresoBodega(): string {
	  return localStorage.getItem('act_egr_bod')
   }
public getConfArticulos(): string {
	  return localStorage.getItem('act_articulos')
   }
   
public getConfServicios(): string {
	  return localStorage.getItem('act_servicios')
   }
   
public getConfBusquedaDefecto(): string {
	  return localStorage.getItem('busqueda_defecto_pdv')
   }

public getConfCambioVendedorPed(): string {
	  return localStorage.getItem('cambio_vendedor_ped')
   }
   
 public getConfGenerarTicket(): string {
	  return localStorage.getItem('generar_ticket')
   }
   
  public getConfAnularFactura(): string {
	  return localStorage.getItem('anular_factura')
   }
   
  public getConfAjustes(): string {
	  return localStorage.getItem('act_config')
   }

  public getConfGenerarPdf(): string {
	  return localStorage.getItem('regenerar_pdf')
   }
   
  public getConfPedidoMedico(): string {
	  return localStorage.getItem('pedido_medico')
   }
   
  public getConfPerfilParcial(codmodulo){
	  // return localStorage.getItem('perfil_parcial')
	  		// this.serie_renglon =  this.series_ingreso_bodega.filter(function(e) {return e['codart'] == codart;});
		// this.codart_renglon = codart
		
		// this.cant_art_renglon = cant_art
		// this.coduni_renglon =  coduni
		
		// if (this.serie_renglon.length == 0){
		// console.log ("######  VALIDACION PERFIL PARCIAL  #######") 
		// console.log (codmodulo) 
		// console.log (localStorage.getItem('perfil_parcial'))
		// console.log (JSON.parse(localStorage.getItem('perfil_parcial')))
		
		if (localStorage.getItem('perfil_parcial') === null){
			return true
		}else {
		    let filtro_perfil = JSON.parse(localStorage.getItem('perfil_parcial')).filter(function(e) {return e['nommod'] == codmodulo;});
			if (filtro_perfil.length > 0){
			   console.log ("SI PUEDE VER MODULO "+codmodulo)
			   return true
			}else{
			console.log ("NO PUEDE VER MODULO "+codmodulo)
			   return false
			}
		}
	  
	  
	  // return true
   }
  public getActLineaArticulo(): string {
	  return localStorage.getItem('act_linea_art')
   }
  
  public getModInventario(): string {
	  return localStorage.getItem('act_mod_inventario')
 }

  public getTipoRutaTalleres(): string {
	  return localStorage.getItem('act_tipo_ruta_talleres')
 }

  public getActConteoFisico(): string {
	  return localStorage.getItem('act_conteo_fisico')
 }
 
   public getActImportPedidoPdv(): string {
	  return localStorage.getItem('import_ped_pdv')
 }
 
    public getActRegPlacaPDV(): string {
	  return localStorage.getItem('reg_placa_pdv')
 }
 
     public getActTransfBodega(): string {
	  return localStorage.getItem('transf_bodega')
 }
 
 
 
   

   
   

   

   
   
   	  // localStorage.setItem('act_articulos', param['act_articulos'])
	  // localStorage.setItem('act_servicios', param['act_servicios'])
	  // localStorage.setItem('act_egr_bod', param['act_egr_bod'])
   
   

   	  // localStorage.setItem('act_pago_tarjeta_pdv', param['act_pago_tarjeta_pdv'])
   
   
 
 
	  // localStorage.setItem('act_pago_efectivo_pdv', param['act_pago_efectivo_pdv'])
	  // localStorage.setItem('act_pago_cheque_pdv', param['act_pago_cheque_pdv'])
	  // localStorage.setItem('act_pago_trans_pdv', param['act_pago_trans_pdv'])
	  // localStorage.setItem('act_pago_credito_pdv', param['act_pago_credito_pdv'])
	  // localStorage.setItem('act_edicion_plazo_credito_pdv', param['act_edicion_plazo_credito_pdv'])


	
	

  reporte(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/reporte', param);
  }
  
  public isLoggedIn (): boolean {
        let usuario = localStorage.getItem('usuario_recv')
		
        if (usuario) {
            return true
        } else {
            return false
        }
    }
	
	
		  // localStorage.setItem('act_tipo_ruta_talleres', param['act_tipo_ruta_talleres'])
   public logout (): void {
        this.usuario = ''
		window.localStorage.removeItem('usuario_recv')
		window.localStorage.removeItem('empresa_recv')
		window.localStorage.removeItem('geoloc_recv')
		window.localStorage.removeItem('punto_venta_recv')
		window.localStorage.removeItem('correo_ped_cli_recv')
		window.localStorage.removeItem('correo_fact_recv')
		window.localStorage.removeItem('edit_ped_recv')
		window.localStorage.removeItem('tipacc_recv')
		window.localStorage.removeItem('nomemp_recv')
		window.localStorage.removeItem('status_caja')
		window.localStorage.removeItem('caja')
		window.localStorage.removeItem('turno')
		window.localStorage.removeItem('almacen')
		window.localStorage.removeItem('nomalm')
		window.localStorage.removeItem('act_caja_reg')
		window.localStorage.removeItem('act_calendario')
		window.localStorage.removeItem('act_ing_bod')
		window.localStorage.removeItem('act_talleres')
		window.localStorage.removeItem('nom_agencia')
		window.localStorage.removeItem('codagencia')
		window.localStorage.removeItem('act_whatsapp')
		window.localStorage.removeItem('act_notif_auto_fac')
		window.localStorage.removeItem('act_abrir_cierre_caja')
		window.localStorage.removeItem('act_retenciones_pdv')
		window.localStorage.removeItem('act_total_recibido_cambio')
		window.localStorage.removeItem('act_selecc_articulo_servicio_pdv')
		window.localStorage.removeItem('act_pago_efectivo_pdv')
		window.localStorage.removeItem('act_pago_tarjeta_pdv')
		window.localStorage.removeItem('act_pago_cheque_pdv')
		window.localStorage.removeItem('act_pago_trans_pdv')
		window.localStorage.removeItem('act_pago_credito_pdv')
		window.localStorage.removeItem('act_edicion_plazo_credito_pdv')
		window.localStorage.removeItem('consultar_estado_cartera')
		window.localStorage.removeItem('act_servicios')
		window.localStorage.removeItem('act_articulos')
		window.localStorage.removeItem('act_egr_bod')
		window.localStorage.removeItem('busqueda_defecto_pdv')
		window.localStorage.removeItem('cambio_vendedor_ped')
		window.localStorage.removeItem('generar_ticket')
		window.localStorage.removeItem('anular_factura')
		window.localStorage.removeItem('act_config')
		window.localStorage.removeItem('regenerar_pdf')
		window.localStorage.removeItem('pedido_medico')
		window.localStorage.removeItem('perfil_parcial')
		window.localStorage.removeItem('act_mod_inventario')
		window.localStorage.removeItem('act_linea_art')
		window.localStorage.removeItem('act_tipo_ruta_talleres')
		window.localStorage.removeItem('act_conteo_fisico')
	    window.localStorage.removeItem('import_ped_pdv')
		window.localStorage.removeItem('reg_placa_pdv')
		window.localStorage.removeItem('transf_bodega')
		
		

		
		
		
		
		
		
        this.router.navigateByUrl('/')
    }
	

  login(param): Observable<any> {
	console.log ('#### DENTRO DE LOGIN  #######')
	console.log(param)
	let usuario_recv= param['usuario']
	let empresa_recv= param['empresa']

	
	localStorage.setItem('usuario_recv', usuario_recv)
	localStorage.setItem('empresa_recv', empresa_recv)
	
	this.empresa= localStorage.getItem('empresa_recv')
	this.usuario= localStorage.getItem('usuario_recv')
	console.log ('USUARIO_LOGIN')
	console.log (this.usuario)
	console.log ('EMPRESA_LOGIN')
	console.log (this.empresa)
	
	let resp_login = this.http.post(this.apiUrl + ':' + this.port + '/login', param);
    return resp_login
  }

  reporteu(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/reporteu', param);
  }

  empresas(): Observable<any> {
    return this.http.get(this.apiUrl + ':' + this.port + '/empresas');
  }
  
  iva(): Observable<any> {
    return this.http.get(this.apiUrl + ':' + this.port + '/iva');
  }
  
  // clientes(): Observable<any> {
    // return this.http.get(this.apiUrl + ':' + this.port + '/clientes');
  // }
  
  clientes(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/clientes', param);
  }
    
  saldo_cartera(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/saldo_cartera', param);
  }
  generar_encabezado_pdv(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_encabezado_pdv', param);
  }
  
  generar_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_pedido', param);
  }
  
  generar_renglones_pdv(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_renglones_pdv', param);
  }
  
  generar_renglones_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_renglones_pedido', param);
  }
  
  generar_renglones_talleres(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_renglones_talleres', param);
  }

//#######   REPORTE 5002  
  reporte_lista_pedidos_ruta(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + '5002' + '/reporte_lista_pedidos_ruta', param);
  }
  
  reporte_lista_articulos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + '5002' + '/reporte_lista_articulos', param);
  }
  reporte_renglones_pedidos_ruta(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + '5002' + '/reporte_renglones_pedidos_ruta', param);
  }
  
  
  reporte_lista_articulos_todas_rutas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + '5002' + '/reporte_lista_articulos_todas_rutas', param);
  }
  
  reporte_lista_pedidos_ruta_todas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + '5002' + '/reporte_lista_pedidos_ruta_todas', param);
  }
  reporte_renglones_pedidos_ruta_todas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + '5002' + '/reporte_renglones_pedidos_ruta_todas', param);
  }
  
  
  
  
  
  // articulos(): Observable<any> {
    // return this.http.get(this.apiUrl + ':' + this.port + '/articulos');
  // }
  
  articulos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/articulos', param);
  }
  servicios(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/servicios', param);
  }
  
  busqueda_razon_social(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_razon_social', param);
  }
  get_sucursal_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_sucursal_pedido', param);
  }
  
  update_sucursal_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/update_sucursal_pedido', param);
  }
  
  
  cosulta_sucursales(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/cosulta_sucursales', param);
  }
  
  update_dato_sucursal(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/update_dato_sucursal', param);
  }
  
  lista_pedidos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_pedidos', param);
  }
  
  lista_servicios(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_servicios', param);
  }
  
  
  lista_ordenes(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_ordenes', param);
  }
  
  
  lista_visitas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_visitas', param);
  }
  
  ciudad(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/ciudad', param);
  }
  
  paises(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/paises', param);
  }
  vendedores(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/vendedores', param);
  }
  generar_pedido_ruta(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_pedido_ruta', param);
  }
  get_rutas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_rutas', param);
  }
  get_sucursales(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_sucursales', param);
  }
  get_pedidos_ruta(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_pedidos_ruta', param);
  }
  get_pedidos_ruta_programada(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_pedidos_ruta_programada', param);
  }
  set_fecha_hora_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/set_fecha_hora_pedido', param);
  }
  crear_nueva_agencia(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/crear_nueva_agencia', param);
  }
  validar_exist_agencia(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/validar_exist_agencia', param);
  }
  status_caja(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/status_caja', param);
  }
  retenciones(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/retenciones', param);
  }
  bancos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/bancos', param);
  }
  tarjetascredito(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/tarjetascredito', param);
  }
  cuentas_bancarias(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/cuentas_bancarias', param);
  }
  
  get_renglones_pdv(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_renglones_pdv', param);
  }
  actualizar_encabezado_pdv(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_encabezado_pdv', param);
  }
  
  
  
  get_prec_product(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_prec_product', param);
  }
  get_prec_servicio(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_prec_servicio', param);
  }
  almacen(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/almacen', param);
  }
  caja(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/caja', param);
  }
  
  mail(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/mail', param);
  }
  get_encabezado_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_encabezado_pedido', param);
  }
  get_renglones_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_renglones_pedido', param);
  }
  
  get_encabezado_orden(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_encabezado_orden', param);
  }
  get_renglones_orden(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_renglones_orden', param);
  }
  crear_cliente(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/crear_cliente', param);
  }
  actualizar_cliente(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_cliente', param);
  }
  
  actualizar_encabezado_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_encabezado_pedido', param);
  }
  actualizar_renglones_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_renglones_pedido', param);
  }
  
  actualizar_encabezado_orden(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_encabezado_orden', param);
  }
  actualizar_renglones_orden(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_renglones_orden', param);
  }
  
  clientes_nombre(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/clientes_nombre', param);
  }
  
  registrar_visita(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/registrar_visita', param);
  }
  
  consulta_citas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/consulta_citas', param);
  }
  
  guardar_detalle_vehiculo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/guardar_detalle_vehiculo', param);
  }
  get_detalle_vehiculo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_detalle_vehiculo', param);
  }
  
  guardar_datos_vehiculo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/guardar_datos_vehiculo', param);
  }
  get_datos_vehiculo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_datos_vehiculo', param);
  }
  articulos_index(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/articulos_index', param);
  }
  
  
  
  
  
  
  
  
  
  
  carga_perfil(param) {
	  console.log ("##### CARGA DE PERFIL  #####")
	  console.log (param)
	  let resp='EXITOSO'
	  localStorage.setItem('geoloc_recv', param['geoloc'])
	  localStorage.setItem('punto_venta_recv', param['punto_venta'])
	  localStorage.setItem('correo_ped_cli_recv', param['correo_ped_cli'])
	  localStorage.setItem('correo_fact_recv', param['correo_fact'])
	  localStorage.setItem('edit_ped_recv', param['edit_ped'])
	  localStorage.setItem('tipacc_recv', param['tipacc'])
	  localStorage.setItem('nomemp_recv', param['nomemp'])
	  localStorage.setItem('act_caja_reg', param['act_caja_reg'])
	  localStorage.setItem('act_calendario', param['act_calendario'])
	  localStorage.setItem('act_ing_bod', param['act_ing_bod'])
	  localStorage.setItem('act_talleres', param['act_talleres'])
	  localStorage.setItem('nom_agencia', param['nom_agencia'])
	  localStorage.setItem('codagencia', param['codagencia'])
	  localStorage.setItem('act_clientes', param['act_clientes'])
	  localStorage.setItem('act_pedidos', param['act_pedidos'])
	  localStorage.setItem('act_whatsapp', param['act_whatsapp'])
	  localStorage.setItem('act_notif_auto_fac', param['act_notif_auto_fac'])
	  localStorage.setItem('act_abrir_cierre_caja', param['act_abrir_cierre_caja'])
	  localStorage.setItem('act_retenciones_pdv', param['act_retenciones_pdv'])
	  localStorage.setItem('act_total_recibido_cambio', param['act_total_recibido_cambio'])
	  localStorage.setItem('act_selecc_articulo_servicio_pdv', param['act_selecc_articulo_servicio_pdv'])
	  localStorage.setItem('act_pago_efectivo_pdv', param['act_pago_efectivo_pdv'])
	  localStorage.setItem('act_pago_tarjeta_pdv', param['act_pago_tarjeta_pdv'])
	  localStorage.setItem('act_pago_cheque_pdv', param['act_pago_cheque_pdv'])
	  localStorage.setItem('act_pago_trans_pdv', param['act_pago_trans_pdv'])
	  localStorage.setItem('act_pago_credito_pdv', param['act_pago_credito_pdv'])
	  localStorage.setItem('act_edicion_plazo_credito_pdv', param['act_edicion_plazo_credito_pdv'])
	  localStorage.setItem('consultar_estado_cartera', param['consultar_estado_cartera'])
	  localStorage.setItem('act_articulos', param['act_articulos'])
	  localStorage.setItem('act_servicios', param['act_servicios'])
	  localStorage.setItem('act_egr_bod', param['act_egr_bod'])
	  localStorage.setItem('busqueda_defecto_pdv', param['busqueda_defecto_pdv'])
	  localStorage.setItem('cambio_vendedor_ped', param['cambio_vendedor_ped'])
	  localStorage.setItem('generar_ticket', param['generar_ticket'])
	  localStorage.setItem('anular_factura', param['anular_factura'])
	  localStorage.setItem('act_config', param['act_config'])
	  localStorage.setItem('regenerar_pdf', param['regenerar_pdf'])
	  localStorage.setItem('pedido_medico', param['pedido_medico'])
	  localStorage.setItem('perfil_parcial', JSON.stringify(param['tipacc_parcial']))
	  localStorage.setItem('act_mod_inventario', param['act_mod_inventario'])
	  localStorage.setItem('act_linea_art', param['act_linea_art'])
	  localStorage.setItem('act_tipo_ruta_talleres', param['act_tipo_ruta_talleres'])
	  localStorage.setItem('act_conteo_fisico', param['act_conteo_fisico'])
	  localStorage.setItem('import_ped_pdv', param['import_ped_pdv'])
	  localStorage.setItem('reg_placa_pdv', param['reg_placa_pdv'])
	  localStorage.setItem('transf_bodega', param['transf_bodega'])
	  
	  
	  // servicio_defecto_pdv: "PEM"
	  // 'act_articulos','act_servicios','act_egr_bod'
	  
	  // insert into parametros_siaciweb (codemp,parametro,valor,descripcion,clave_json) values ('01','ACTIVAR_TRANSFERENCIAS','NO','Valores permitido SI/NO. Habilita la funcionalidad de las tranferencias entre bodegas','transf_bodega');
	  

	  
	  
	  
	  // ACTIVAR_TOTAL_RECIBIDO_CAMBIO
	  
	  
	  this.geoloc= localStorage.getItem('geoloc_recv')
	  console.log(this.geoloc)
	  return resp
    // return this.http.post(this.apiUrl + ':' + this.port + '/registrar_visita', param);
  }
  
  seteo_caja(param) {
	  console.log ("##### SETEO EL STATUS DE LA CAJA #####")
	  console.log (param)
	  
	  localStorage.setItem('status_caja', param['status_caja'])
	  localStorage.setItem('caja', param['caja'])
	  localStorage.setItem('turno', param['turno'])
	  localStorage.setItem('almacen', param['almacen'])
	  localStorage.setItem('nomalm', param['nomalm'])
	  let resp='EXITOSO'
	  return resp
    // return this.http.post(this.apiUrl + ':' + this.port + '/registrar_visita', param);
  }

  
   cajapost(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/cajapost', param);
  }
  
  
  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });

  }
  ////  ##### SERVICIOS DE SUBA DE ARCHIVO (FOTOS)   //////
   uploadFile(formData) {
    // let urlAPI = 'http://localhost:3000/api/upload';
    // return this.http.post(urlAPI, formData);
	return this.http.post(this.apiUrl + ':' + this.port + '/uploader', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }
  
   upload_imagen_art_serv(formData) {
    // let urlAPI = 'http://localhost:3000/api/upload';
    // return this.http.post(urlAPI, formData);
	return this.http.post(this.apiUrl + ':' + this.port + '/upload_imagen_art_serv', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }
  
  eliminar_imagen(param) {
	return this.http.post(this.apiUrl + ':' + this.port + '/eliminar_imagen',param)
  }
  
   lista_img(param) {
	return this.http.post(this.apiUrl + ':' + this.port + '/lista_img',param)
  }
  
   errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  
  // upload_imagen_art_serv
  
  
  
  busqueda_proveedor(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_proveedor', param);
  }
  
  articulos_ingresos_san_jose(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/articulos_ingresos_san_jose', param);
  }
  
  generar_encabezado_ingreso_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_encabezado_ingreso_bodega', param);
  }
    generar_renglones_ingreso_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_renglones_ingreso_bodega', param);
  }
      guardar_series_ingreso_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/guardar_series_ingreso_bodega', param);
  }
  
        guardar_cod_barra_lote(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/guardar_cod_barra_lote', param);
  }
    lista_ingresos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_ingresos', param);
  }
    get_encabezado_ingreso(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_encabezado_ingreso', param);
  }
  get_renglones_ingreso(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_renglones_ingreso', param);
  }
  get_series_ingreso_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_series_ingreso_bodega', param);
  }
  get_series_egreso_bodega (param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_series_egreso_bodega', param);
  }
  lista_ventas_pdv(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_ventas_pdv', param);
  }
  aplicar_fact_electronica(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/aplicar_fact_electronica', param);
  }
  seleccion_agencia(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/seleccion_agencia', param);
  }
  
  lista_bodegas_centro_costo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_bodegas_centro_costo', param);
  }
  
  busqueda_orden_produccion(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_orden_produccion', param);
  }
  
  busqueda_orden_compra(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_orden_compra', param);
  }
  actualizar_encabezado_ingreso(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_encabezado_ingreso', param);
  }
  
  lista_egresos_facturas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_egresos_facturas', param);
  }
  lista_egresos_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_egresos_bodega', param);
  }
  
    get_renglones_facturas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_renglones_facturas', param);
  }
  
    get_encabezado_factura(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_encabezado_factura', param);
  }
  
      get_encabezado_egreso(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_encabezado_egreso', param);
  }
      get_renglones_egreso(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_renglones_egreso', param);
  }
  
  
    
    valida_serie_articulo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/valida_serie_articulo', param);
  }
  
   guardar_series_egreso_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/guardar_series_egreso_bodega', param);
  }
  
    lista_egresos_facturas_despachadas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_egresos_facturas_despachadas', param);
  }
  
  
      autorizar_facturas_despachadas(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/autorizar_facturas_despachadas', param);
  }
  
        articulos_egresos_san_jose(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/articulos_egresos_san_jose', param);
  }
  
    generar_encabezado_egreso_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_encabezado_egreso_bodega', param);
  }
    generar_renglones_egreso_bodega(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_renglones_egreso_bodega', param);
  }
  
  
      busqueda_ordenes_produccion_pendientes(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_ordenes_produccion_pendientes', param);
  }
  
  
        busqueda_ordenes_compra_pendientes(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_ordenes_compra_pendientes', param);
  }
  
  conf_codbarra_art(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/conf_codbarra_art', param);
  }
  
  crear_dbf(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/crear_dbf', param);
  }
  
  
  datos_panel_control(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/datos_panel_control', param);
  }
  
  lista_msg_whatsapp(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_msg_whatsapp', param);
  }
  
    reenviar_msg_ws(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/reenviar_msg_ws', param);
  }
  
  
  usuario_defecto_produccion(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/usuario_defecto_produccion', param);
  }
  
  envio_notif_msg_ws(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/envio_notif_msg_ws', param);
  }
  
  get_renglones_orden_compra(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_renglones_orden_compra', param);
  }
  
    lista_audios(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_audios', param);
  }
  
      eliminar_audio(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/eliminar_audio', param);
  }
    lista_productos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_productos', param);
  }
  buscar_articulos_conteo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/buscar_articulos_conteo', param);
  }
  
  generar_conteo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_conteo', param);
  }
  
    articulos_ingresos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/articulos_ingresos', param);
  }
  
    generar_encabezado_ingreso_bodega_simple(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_encabezado_ingreso_bodega_simple', param);
  }
    generar_renglones_ingreso_bodega_simple(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_renglones_ingreso_bodega_simple', param);
  }
  
      articulos_egresos_simple(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/articulos_egresos_simple', param);
  }
  
      generar_encabezado_egreso_bodega_simple(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_encabezado_egreso_bodega_simple', param);
  }
  
        get_encabezado_pdv(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_encabezado_pdv', param);
  }
  
  crear_articulo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/crear_articulo', param);
  }
  
  articulo_detalle(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/articulo_detalle', param);
  }
  actualizar_articulo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_articulo', param);
  }
 crear_servicios (param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/crear_servicios', param);
  }
   actualizar_servicio (param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/actualizar_servicio', param);
  }
     servicio_detalle (param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/servicio_detalle', param);
  }
  
  unidades (param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/unidades', param);
  }
  
    anular_factura (param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/anular_factura', param);
  }
  regenerar_pdf (param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/regenerar_pdf', param);
  }
  
  
  // SERVICIOS PARA MODULO MEDICO
 servicios_medicos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/servicios_medicos', param);
  }
  
 especialidades(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/especialidades', param);
  }

  busqueda_paciente(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_paciente', param);
  }
  
    generar_renglones_pedido_medico(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_renglones_pedido_medico', param);
  }
  
    generar_pedido_medico(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_pedido_medico', param);
  }

    enviar_orden_facturacion(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/enviar_orden_facturacion', param);
  }
  
      crear_paciente(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/crear_paciente', param);
  }
  
        lista_pedidos_medicos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/lista_pedidos_medicos', param);
  }
  
   eliminar_articulo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/eliminar_articulo', param);
  }
     eliminar_servicio(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/eliminar_servicio', param);
  }
  
   buscar_articulos_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/buscar_articulos_pedido', param);
  }
  generar_pdf_pedido(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_pdf_pedido', param);
  }
    provincia(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/provincia', param);
  }
  
      linea_articulos(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/linea_articulos', param);
  }
  
        linea_subclase_articulo(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/linea_subclase_articulo', param);
  }
  
   get_datos_vehiculo_placa(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/get_datos_vehiculo_placa', param);
  }
  
     generar_pdf_orden(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/generar_pdf_orden', param);
  }
  
        busqueda_pedido_razonsocial(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_pedido_razonsocial', param);
  }
  
          almacen_origen_destino(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/almacen_origen_destino', param);
  }
  
  busqueda_razon_social_placa(param): Observable<any> {
    return this.http.post(this.apiUrl + ':' + this.port + '/busqueda_razon_social_placa', param);
  }
  
  

  
  
  
  
  
  
  
  
  


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  
  
}
