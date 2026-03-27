import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './../../api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import * as L from 'leaflet';

declare var AdminLTE: any;

@Component({
  selector: 'app-admin-cliente',
  templateUrl: './admin-cliente.component.html',
  styleUrls: ['./admin-cliente.component.css']
})
export class AdminClienteComponent implements OnInit, OnDestroy {

  // ── Datos generales ──────────────────────────────────────────────────────────
  usuario;
  empresa;
  nomcli = null;
  rucced = null;
  dircli = null;    // Dirección manual (ambos: cliente y proveedor)
  dircl1 = null;    // Ubicación Geolocalización (SOLO clientes)
  fecult;
  email = null;
  telcli = null;
  telcli2 = null;
  fectra;
  public today = new Date();
  public success;
  status;
  ciudad;
  loading_modulo = false;
  public ciudad_lista: any = [];
  public provincia_lista: any = [];
  provincia;
  buscarSri = false;
  tipoCreacion = 'Cliente';

  @Input() status_cambio_vista_cliente: string;

  public tipo_doc_lista = [
    { tipo: 'C', nom_doc: 'CEDULA' },
    { tipo: 'R', nom_doc: 'RUC' },
    { tipo: 'P', nom_doc: 'PASAPORTE' }
  ];
  tipo_doc;

  public tipo_cliente_lista = [
    { tipo: '01', nom_tipo_cli: 'PERSONA NATURAL' },
    { tipo: '02', nom_tipo_cli: 'EMPRESA' }
  ];
  tipo_cliente;

  // ── Geolocalización / Mapa (SOLO clientes) ───────────────────────────────────
  latitud: number = null;
  longitud: number = null;
  mostrarMapa = false;
  cargandoDireccionMapa = false;

  mapLat: number = -0.1807;
  mapLng: number = -78.4678;

  private mapInstance: L.Map = null;
  private mapMarker: L.Marker = null;
  private leafletIconDefault: L.Icon = null;

  mapSearchQuery = '';
  mapSearchResultados: any[] = [];
  mapSearchSinResultados = false;
  buscandoDireccion = false;

  geolocalizando = false;
  geoErrorMsg = '';

  constructor(
    private router: Router,
    private srv: ApiService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.success = false;
    this.ciudad = 'NO DISPONIBLE';
    this.status_cambio_vista_cliente = 'false';
  }

  ngOnInit() {
    if (!this.srv.isLoggedIn()) { this.router.navigateByUrl('/'); }

    this.route.queryParams.subscribe(params => {
      this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
      this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
    });

    this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');

    const datos_ciudad = { codemp: this.empresa };
    this.srv.ciudad(datos_ciudad).subscribe(data => {
      this.ciudad_lista = data;
      this.ciudad_lista.push({ codemp: '01', codgeo: '0', nomgeo: '*** OTRA CIUDAD ***' });
    });

    const datos_prov = { codemp: this.empresa };
    this.srv.provincia(datos_prov).subscribe(data => { this.provincia_lista = data; });

    this.leafletIconDefault = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = this.leafletIconDefault;

    AdminLTE.init();
  }

  ngOnDestroy() { this.destruirMapa(); }

  public cambio_vista(modo) { this.status_cambio_vista_cliente = modo; }

  public update_ciudad(ciudad) {
    this.ciudad = ciudad === '*** OTRA CIUDAD ***' ? 'OTRA CIUDAD'
      : ciudad === '*** Seleccione ciudad ***' ? 'NO DISPONIBLE'
      : ciudad;
  }
  public update_tipo_doc(tipo_doc) { this.tipo_doc = tipo_doc; }
  public update_tipo_cliente(tipo_cliente) { this.tipo_cliente = tipo_cliente; }

  // ── MAPA (SOLO clientes) ──────────────────────────────────────────────────────
  abrirModalMapa() {
    this.destruirMapa();
    this.limpiarBusqueda();
    this.geoErrorMsg = '';
    this.mapLat = this.latitud || -0.1807;
    this.mapLng = this.longitud || -78.4678;
    this.mostrarMapa = true;
    setTimeout(() => this.inicializarMapa(), 250);
  }

  cerrarMapaCrear() {
    this.mostrarMapa = false;
    this.limpiarBusqueda();
    this.geoErrorMsg = '';
    this.destruirMapa();
  }

  cerrarModalMapa(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('map-modal-overlay')) {
      this.cerrarMapaCrear();
    }
  }

  private inicializarMapa() {
    if (!this.mostrarMapa) { return; }
    const mapDiv = document.getElementById('mapPickerCrear');
    if (!mapDiv) { setTimeout(() => this.inicializarMapa(), 300); return; }

    this.destruirMapa();
    this.mapInstance = L.map('mapPickerCrear').setView([this.mapLat, this.mapLng], 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.mapInstance);

    this.mapMarker = L.marker([this.mapLat, this.mapLng], {
      draggable: true,
      icon: this.leafletIconDefault
    }).addTo(this.mapInstance);

    this.mapMarker.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      this.mapLat = pos.lat;
      this.mapLng = pos.lng;
    });

    this.mapInstance.on('click', (e: L.LeafletMouseEvent) => {
      this.mapMarker.setLatLng(e.latlng);
      this.mapLat = e.latlng.lat;
      this.mapLng = e.latlng.lng;
    });

    setTimeout(() => { if (this.mapInstance) { this.mapInstance.invalidateSize(); } }, 150);
  }

  buscarDireccionEnMapa() {
    const query = (this.mapSearchQuery || '').trim();
    if (!query) { return; }
    this.buscandoDireccion = true;
    this.mapSearchResultados = [];
    this.mapSearchSinResultados = false;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=es&countrycodes=ec`;
    this.http.get<any[]>(url).subscribe(
      resultados => {
        this.buscandoDireccion = false;
        if (resultados && resultados.length > 0) { this.mapSearchResultados = resultados; }
        else { this.buscarDireccionGlobal(query); }
      },
      () => { this.buscandoDireccion = false; this.mapSearchSinResultados = true; }
    );
  }

  private buscarDireccionGlobal(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=es`;
    this.http.get<any[]>(url).subscribe(
      resultados => {
        if (resultados && resultados.length > 0) { this.mapSearchResultados = resultados; }
        else { this.mapSearchSinResultados = true; }
      },
      () => { this.mapSearchSinResultados = true; }
    );
  }

  seleccionarResultadoBusqueda(resultado: any) {
    const lat = parseFloat(resultado.lat);
    const lng = parseFloat(resultado.lon);
    this.mapLat = lat;
    this.mapLng = lng;
    if (this.mapInstance && this.mapMarker) {
      this.mapMarker.setLatLng([lat, lng]);
      this.mapInstance.setView([lat, lng], 17);
    }
    this.mapSearchResultados = [];
    this.mapSearchQuery = resultado.display_name;
    this.mapSearchSinResultados = false;
  }

  limpiarBusqueda() {
    this.mapSearchQuery = '';
    this.mapSearchResultados = [];
    this.mapSearchSinResultados = false;
  }

  geolocalizarUsuario() {
    if (!navigator.geolocation) { this.geoErrorMsg = 'Tu navegador no soporta geolocalización.'; return; }
    this.geolocalizando = true;
    this.geoErrorMsg = '';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.geolocalizando = false;
        this.mapLat = position.coords.latitude;
        this.mapLng = position.coords.longitude;
        if (this.mapInstance && this.mapMarker) {
          this.mapMarker.setLatLng([this.mapLat, this.mapLng]);
          this.mapInstance.setView([this.mapLat, this.mapLng], 17);
        }
        this.limpiarBusqueda();
      },
      (error) => {
        this.geolocalizando = false;
        switch (error.code) {
          case error.PERMISSION_DENIED: this.geoErrorMsg = 'Permiso de ubicación denegado. Habilítalo en la configuración del navegador.'; break;
          case error.POSITION_UNAVAILABLE: this.geoErrorMsg = 'Ubicación no disponible en este momento.'; break;
          case error.TIMEOUT: this.geoErrorMsg = 'Tiempo de espera agotado al obtener la ubicación.'; break;
          default: this.geoErrorMsg = 'No se pudo obtener la ubicación actual.';
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  confirmarUbicacionCrear() {
    this.cargandoDireccionMapa = true;
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${this.mapLat}&lon=${this.mapLng}&format=json&accept-language=es`;

    this.http.get<any>(url).subscribe(
      res => {
        this.cargandoDireccionMapa = false;
        this.latitud = this.mapLat;
        this.longitud = this.mapLng;
        this.dircl1 = res && res.display_name
          ? res.display_name
          : `${this.mapLat.toFixed(6)}, ${this.mapLng.toFixed(6)}`;
        this.mostrarMapa = false;
        this.destruirMapa();
        this.limpiarBusqueda();
      },
      () => {
        this.cargandoDireccionMapa = false;
        this.latitud = this.mapLat;
        this.longitud = this.mapLng;
        this.dircl1 = `${this.mapLat.toFixed(6)}, ${this.mapLng.toFixed(6)}`;
        this.mostrarMapa = false;
        this.destruirMapa();
        this.limpiarBusqueda();
      }
    );
  }

  private destruirMapa() {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
      this.mapMarker = null;
    }
  }

  // ── CREAR CLIENTE — incluye dircl1, latitud, longitud ─────────────────────────
  crea_cliente() {
    const datos: any = {};
    datos['codus1'] = this.usuario.toUpperCase();
    datos['codemp'] = this.empresa;
    datos['nomcli'] = this.nomcli.toUpperCase();
    datos['rucced'] = this.rucced;
    datos['dircli'] = this.dircli;
    datos['dircl1'] = this.dircl1;       // Geolocalización
    datos['telcli'] = this.telcli;
    datos['telcli2'] = this.telcli2;
    datos['email'] = this.email;
    datos['fectra'] = this.fectra;
    datos['latitud'] = this.latitud;     // Coordenadas
    datos['longitud'] = this.longitud;

    if (this.ciudad === '*** OTRA CIUDAD ***') { this.ciudad = 'OTRA CIUDAD'; }
    datos['ciucli'] = this.ciudad;
    datos['codprov'] = this.provincia;
    datos['tipo'] = this.tipo_cliente;
    datos['tpIdCliente'] = this.tipo_doc;

    if (this.validar_campos_obligatorios(datos) &&
      this.validar_formato_campos_numeros(datos) &&
      this.validar_longitud_cedula_ruc(datos)) {
      this.loading_modulo = true;
      this.srv.crear_cliente(datos).subscribe(data => {
        const nav = { usuario: this.usuario, empresa: this.empresa };
        if (data['STATUS'] === 'DUPLICADO') {
          alert('ATENCION: EL CLIENTE CON IDENTIFICACION ' + this.rucced + ' EXISTE EN ESTA EMPRESA..!!');
          this.loading_modulo = false;
        } else {
          alert('Cliente con identificación ' + this.rucced + ' creado con éxito..!!');
          if (this.status_cambio_vista_cliente === 'false') {
            this.router.navigate(['/admin/dashboard3', nav]);
          }
          this.loading_modulo = false;
        }
      });
    }
  }

  // ── CREAR PROVEEDOR — SIN dircl1, latitud, longitud ───────────────────────────
  crea_proveedor() {
    const datos: any = {};
    datos['codus1'] = this.usuario.toUpperCase();
    datos['codemp'] = this.empresa;
    datos['nomcli'] = this.nomcli.toUpperCase();
    datos['rucced'] = this.rucced;
    datos['dircli'] = this.dircli;
    // dircl1, latitud y longitud NO se envían para proveedores
    datos['telcli'] = this.telcli;
    datos['telcli2'] = this.telcli2;
    datos['email'] = this.email;
    datos['fectra'] = this.fectra;

    if (this.ciudad === '*** OTRA CIUDAD ***') { this.ciudad = 'OTRA CIUDAD'; }
    datos['ciucli'] = this.ciudad;
    datos['codprov'] = this.provincia;
    datos['tipo'] = this.tipo_cliente;
    datos['tpIdCliente'] = this.tipo_doc;

    if (this.validar_campos_obligatorios(datos) &&
      this.validar_formato_campos_numeros(datos) &&
      this.validar_longitud_cedula_ruc(datos)) {
      this.loading_modulo = true;
      this.srv.crear_proveedor(datos).subscribe(data => {
        const nav = { usuario: this.usuario, empresa: this.empresa };
        if (data['STATUS'] === 'DUPLICADO') {
          alert('ATENCION: EL PROVEEDOR CON IDENTIFICACION ' + this.rucced + ' EXISTE EN ESTA EMPRESA..!!');
          this.loading_modulo = false;
        } else {
          alert('Proveedor con identificación ' + this.rucced + ' creado con éxito..!!');
          if (this.status_cambio_vista_cliente === 'false') {
            this.router.navigate(['/admin/dashboard3', nav]);
          }
          this.loading_modulo = false;
        }
      });
    }
  }

  // ── VALIDACIONES ──────────────────────────────────────────────────────────────
  validar_campos_obligatorios(datos): boolean {
    let ok = true;
    if (!datos['nomcli'] || datos['nomcli'].length === 0) {
      alert('Nombre/Razón social vacío. Por favor llenar.'); ok = false;
    } else if (!datos['rucced'] || datos['rucced'].length === 0) {
      alert('Número de Identificación vacío. Por favor llenar.'); ok = false;
    } else if (!datos['tpIdCliente'] || datos['tpIdCliente'] === 'N') {
      alert('Tipo de Identificación no seleccionado. Por favor seleccione CEDULA/RUC/PASAPORTE.'); ok = false;
    } else if ((!datos['tipo'] || datos['tipo'] === 'N') && this.tipoCreacion === 'Cliente') {
      alert('Tipo de cliente no seleccionado. Por favor seleccione PERSONA NATURAL/EMPRESA.'); ok = false;
    } else if (!datos['dircli'] || datos['dircli'].length === 0) {
      alert('Dirección vacía. Por favor llenar.'); ok = false;
    } else if ((!datos['telcli'] || datos['telcli'].length === 0) && (!datos['telcli2'] || datos['telcli2'].length === 0)) {
      alert('Por favor llenar al menos un número telefónico.'); ok = false;
    } else if (!datos['ciucli'] || datos['ciucli'] === 'NO DISPONIBLE') {
      alert('Ciudad no seleccionada. Por favor seleccione alguna ciudad.'); ok = false;
    } else if (!datos['codprov']) {
      alert('Provincia no seleccionada. Por favor seleccione alguna.'); ok = false;
    } else if (!datos['email'] || datos['email'].length === 0) {
      alert('Correo electrónico vacío. Por favor llenar.'); ok = false;
    }
    return ok;
  }

  validar_formato_campos_numeros(datos): boolean {
    let ok = true;
    if (isNaN(datos['rucced'])) {
      alert('NÚMERO DE IDENTIFICACIÓN SOLO DEBE CONTENER VALORES NUMÉRICOS..!!'); ok = false;
    } else if (isNaN(datos['telcli'])) {
      alert('NÚMERO DE TELÉFONO DEBE CONTENER SOLO VALORES NUMÉRICOS..!!'); ok = false;
    } else if (datos['telcli2'] && isNaN(datos['telcli2'])) {
      alert('NÚMERO DE TELÉFONO MÓVIL DEBE CONTENER SOLO VALORES NUMÉRICOS..!!'); ok = false;
    }
    return ok;
  }

  validar_longitud_cedula_ruc(datos): boolean {
    let ok = true;
    if (datos['tpIdCliente'] === 'C' && datos['rucced'].length !== 10) {
      alert('EL NÚMERO DE CÉDULA DEBE CONTENER 10 DÍGITOS...!!!'); ok = false;
    } else if (datos['tpIdCliente'] === 'R' && datos['rucced'].length !== 13) {
      alert('EL NÚMERO DE RUC DEBE CONTENER 13 DÍGITOS..!!!'); ok = false;
    }
    return ok;
  }

  public validaNumericosCantidad(event: any) {
    return event.charCode >= 48 && event.charCode <= 57;
  }

  validateEmail(email): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) { alert('FORMATO DE CORREO ELECTRÓNICO NO VÁLIDO...!!!'); return false; }
    return true;
  }

  revision_sri_ruc(): void {
    const dato_sri = { ruc: this.rucced };
    this.buscarSri = true;
    this.srv.sri_ruc(dato_sri).subscribe(data => {
      this.buscarSri = false;
      if (data['status'] === 'ENCONTRADO') {
        alert('Datos Encontrados...!!!');
        this.nomcli = data['razonsocial'].toUpperCase();
        if (data['direccion'] !== 'No disponible') { this.dircli = data['direccion']; }
      } else {
        alert('Datos NO Encontrados...!!!');
      }
    });
  }
}
