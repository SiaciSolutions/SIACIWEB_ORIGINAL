import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './../../api.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import * as L from 'leaflet';

declare var AdminLTE: any;

@Component({
  selector: 'app-admin-consulta-cliente',
  templateUrl: './admin-cliente-consulta.component.html',
  styleUrls: ['./admin-cliente-consulta.component.css']
})
export class AdminClienteConsultaComponent implements OnInit, OnDestroy {

  // ── Datos generales ──────────────────────────────────────────────────────────
  usuario;
  empresa;
  nomcli;
  codcli;
  rucced = '';
  dircli;       // Dirección manual (ambos: cliente y proveedor)
  dircl1;       // Ubicación Geolocalización (SOLO clientes)
  fecult;
  email;
  telcli;
  telcli2 = null;
  fectra;
  public today = new Date();
  public success;
  status;
  ciudad;
  public ciudad_lista: any = [];
  clientes;
  fecha_status_cartera;
  saldo_cliente;

  cambiar_email = false;
  cambiar_telcli = false;
  cambiar_telcli2 = false;
  cambiar_dircli = false;
  cambiar_dircl1 = false;
  cambiar_ciudad = false;
  cambiar_rz = false;
  cambiar_ident = false;
  cambiar_tipo_cliente = false;
  cambiar_provincia = false;
  public provincia_lista: any = [];
  provincia;

  exist_razon_social = false;
  patron_cliente = undefined;
  razon_social_lista;
  tipoCreacion = 'Cliente';

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
  mostrarMapaActualizar = false;
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

  // ── Selector de app de navegación (SOLO clientes) ────────────────────────────
  mostrarSelectorNavegacion = false;
  esIOS = false;
  esMovil = false;

  constructor(
    private router: Router,
    public srv: ApiService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.srv.isLoggedIn()) { this.router.navigateByUrl('/'); }

    this.route.queryParams.subscribe(params => {
      this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
      this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
    });

    this.fectra = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');
    this.fecha_status_cartera = this.fectra;

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

    this.esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.esMovil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    AdminLTE.init();
  }

  ngOnDestroy() { this.destruirMapa(); }

  // ── Cartera ──────────────────────────────────────────────────────────────────
  consulta_saldo_cartera() {
    const fec_cartera = formatDate(this.fecha_status_cartera, 'yyyy-MM-dd', 'en-US', '-0500');
    if (this.codcli) {
      this.srv.saldo_cartera({ codemp: this.empresa, fecha_cartera: fec_cartera, codcli: this.codcli }).subscribe(data => {
        this.saldo_cliente = data['saldo_cliente'] ? 'USD ' + data['saldo_cliente'] : 'USD 0';
      });
    } else {
      alert('Se necesita los datos del cliente para obtener su saldo');
    }
  }

  // ── Búsqueda ─────────────────────────────────────────────────────────────────
  busqueda_razon_social() {
    if (!this.patron_cliente) { alert('Por favor llenar el campo Razón Social'); return; }
    this.srv.busqueda_razon_social({ codemp: this.empresa, patron_cliente: this.patron_cliente, tipacc:this.srv.getTipacc() , usuario:this.usuario }).subscribe(data => {
      if (data.length > 0) { this.razon_social_lista = data; this.exist_razon_social = true; }
      else { alert('Razón Social no encontrada <<' + this.patron_cliente + '>>'); this.exist_razon_social = false; }
    });
  }

  busqueda_razon_social_proveedor() {
    if (!this.patron_cliente) { alert('Por favor llenar el campo Razón Social'); return; }
    this.srv.busqueda_razon_social_prov({ codemp: this.empresa, patron_cliente: this.patron_cliente }).subscribe(data => {
      if (data.length > 0) { this.razon_social_lista = data; this.exist_razon_social = true; }
      else { alert('Razón Social no encontrada <<' + this.patron_cliente + '>>'); this.exist_razon_social = false; }
    });
  }

  select_razon_social(ident, ruc, rz, correo, codcli, dircli) {
    this.rucced = ruc;
    this.tipo_doc = ident;
    if (this.tipoCreacion === 'Cliente') { this.busca_cliente(); }
    if (this.tipoCreacion === 'Proveedor') { this.busca_proveedor(); }
    this.exist_razon_social = false;
    this.patron_cliente = undefined;
  }

  busca_cliente() {
    if (!this.rucced || !this.tipo_doc) { alert('Por favor ingrese TIPO DOC / IDENTIFICACIÓN'); return; }
    this.srv.clientes({ ruc: this.rucced, codemp: this.empresa, tpIdCliente: this.tipo_doc }).subscribe(data => {
      if (data['rucced']) {
        this.nomcli = data['nomcli'];
        this.dircli = data['dircli'];
        this.dircl1 = data['dircl1'] || null;   // Geolocalización solo en clientes
        this.email = data['email'];
        this.ciudad = data['ciucli'];
        this.telcli = data['telcli'];
        this.telcli2 = data['telcli2'];
        this.codcli = data['codcli'];
        this.tipo_cliente = data['tipo'] || '01';
        this.provincia = data['codprov'];
        this.latitud = data['latitud'] ? parseFloat(data['latitud']) : null;
        this.longitud = data['longitud'] ? parseFloat(data['longitud']) : null;
        this.clientes = true;
      } else {
        const doc = this.tipo_doc === 'C' ? 'CEDULA' : this.tipo_doc === 'R' ? 'RUC' : 'PASAPORTE';
        alert('Cliente con ' + doc + ' ' + this.rucced + ' no encontrado');
      }
    });
  }

  busca_proveedor() {
    if (!this.rucced || !this.tipo_doc) { alert('Por favor ingrese TIPO DOC / IDENTIFICACIÓN'); return; }
    this.srv.proveedores({ ruc: this.rucced, codemp: this.empresa, tpIdCliente: this.tipo_doc }).subscribe(data => {
      if (data['rucced']) {
        this.nomcli = data['nomcli'];
        this.dircli = data['dircli'];
        this.email = data['email'];
        this.ciudad = data['ciucli'];
        this.telcli = data['telcli'];
        this.telcli2 = data['telcli2'];
        this.codcli = data['codcli'];
        this.tipo_cliente = data['tipo'] || '01';
        this.provincia = data['codprov'];
        this.clientes = true;
      } else {
        const doc = this.tipo_doc === 'C' ? 'CEDULA' : this.tipo_doc === 'R' ? 'RUC' : 'PASAPORTE';
        alert('Proveedor con ' + doc + ' ' + this.rucced + ' no encontrado');
      }
    });
  }

  public update_datos(tipo_dato, contenido) {
    if (tipo_dato === 'correo') { this.email = contenido; }
    else if (tipo_dato === 'telcli2') { this.telcli2 = contenido; }
    else if (tipo_dato === 'telcli') { this.telcli = contenido; }
    else if (tipo_dato === 'dircli') { this.dircli = contenido; }
  }

  // ── MAPA (SOLO clientes) ──────────────────────────────────────────────────────
  abrirModalMapaActualizar() {
    this.destruirMapa();
    this.limpiarBusqueda();
    this.geoErrorMsg = '';
    this.mapLat = this.latitud || -0.1807;
    this.mapLng = this.longitud || -78.4678;
    this.mostrarMapaActualizar = true;
    setTimeout(() => this.inicializarMapaActualizar(), 250);
  }

  private inicializarMapaActualizar() {
    if (!this.mostrarMapaActualizar) { return; }
    const mapDiv = document.getElementById('mapPickerActualizar');
    if (!mapDiv) { setTimeout(() => this.inicializarMapaActualizar(), 300); return; }

    this.destruirMapa();
    this.mapInstance = L.map('mapPickerActualizar').setView([this.mapLat, this.mapLng], 16);

    // ✅ OpenStreetMap — más estable
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
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

    // viewbox cubre todo Ecuador continental + Galápagos
    // bounded=1 restringe resultados DENTRO del viewbox
    // countrycodes=ec filtra por país
    const viewbox = '-92.0,-5.5,-75.0,1.5'; // lon_min,lat_min,lon_max,lat_max
    const url = `https://nominatim.openstreetmap.org/search`
      + `?q=${encodeURIComponent(query)}`
      + `&format=json&limit=6&accept-language=es`
      + `&countrycodes=ec`
      + `&viewbox=${viewbox}`
      + `&bounded=1`;   // ← solo resultados dentro del viewbox

    this.http.get<any[]>(url).subscribe(
      resultados => {
        this.buscandoDireccion = false;
        if (resultados && resultados.length > 0) {
          this.mapSearchResultados = resultados;
        } else {
          // Fallback: buscar en Ecuador sin bounded (más flexible)
          this.buscarDireccionEcuadorSinBounds(query);
        }
      },
      () => { this.buscandoDireccion = false; this.mapSearchSinResultados = true; }
    );
  }

  private buscarDireccionEcuadorSinBounds(query: string) {
    const url = `https://nominatim.openstreetmap.org/search`
      + `?q=${encodeURIComponent(query)}`
      + `&format=json&limit=6&accept-language=es`
      + `&countrycodes=ec`;

    this.http.get<any[]>(url).subscribe(
      resultados => {
        if (resultados && resultados.length > 0) {
          this.mapSearchResultados = resultados;
        } else {
          // Último fallback: búsqueda global
          this.buscarDireccionGlobal(query);
        }
      },
      () => { this.mapSearchSinResultados = true; }
    );
  }

  private buscarDireccionGlobal(query: string) {
    const url = `https://nominatim.openstreetmap.org/search`
      + `?q=${encodeURIComponent(query)}`
      + `&format=json&limit=5&accept-language=es`;

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

  confirmarUbicacionActualizar() {
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
        this.cambiar_dircl1 = true;
        this.mostrarMapaActualizar = false;
        this.destruirMapa();
        this.limpiarBusqueda();
      },
      () => {
        this.cargandoDireccionMapa = false;
        this.latitud = this.mapLat;
        this.longitud = this.mapLng;
        this.dircl1 = `${this.mapLat.toFixed(6)}, ${this.mapLng.toFixed(6)}`;
        this.cambiar_dircl1 = true;
        this.mostrarMapaActualizar = false;
        this.destruirMapa();
        this.limpiarBusqueda();
      }
    );
  }

  cerrarMapaActualizar() {
    this.mostrarMapaActualizar = false;
    this.limpiarBusqueda();
    this.geoErrorMsg = '';
    this.destruirMapa();
  }

  cerrarModalMapaActualizar(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('map-modal-overlay')) {
      this.cerrarMapaActualizar();
    }
  }

  private destruirMapa() {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
      this.mapMarker = null;
    }
  }

  // ── NAVEGACIÓN GPS (SOLO clientes — el HTML ya filtra con *ngIf) ──────────────
  navegarUbicacion() {
    if (!this.latitud || !this.longitud) {
      alert('Este cliente no tiene coordenadas GPS. Use "Cambiar en mapa" para agregar.');
      return;
    }

    const lat = this.latitud;
    const lng = this.longitud;
    const label = encodeURIComponent(this.nomcli || 'Destino');
    const urlGoogleWeb = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
      window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
      setTimeout(() => { window.open(urlGoogleWeb, '_blank'); }, 2500);
    } else if (this.esIOS) {
      window.location.href = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
      setTimeout(() => { window.open(urlGoogleWeb, '_blank'); }, 2500);
    } else {
      window.open(urlGoogleWeb, '_blank');
    }
  }

  cerrarSelectorNavegacion(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('map-modal-overlay')) {
      this.mostrarSelectorNavegacion = false;
    }
  }

  abrirEnWaze() {
    const lat = this.latitud, lng = this.longitud;
    this.mostrarSelectorNavegacion = false;
    window.location.href = `waze://?ll=${lat},${lng}&navigate=yes`;
    setTimeout(() => { window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank'); }, 2000);
  }

  abrirEnGoogleMaps() {
    const lat = this.latitud, lng = this.longitud;
    const urlWeb = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const isAndroid = /Android/i.test(navigator.userAgent);
    this.mostrarSelectorNavegacion = false;

    if (isAndroid) {
      window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(this.nomcli || 'Destino')})`;
      setTimeout(() => { window.open(urlWeb, '_blank'); }, 2500);
    } else if (this.esIOS) {
      window.location.href = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
      setTimeout(() => { window.open(urlWeb, '_blank'); }, 2500);
    } else {
      window.open(urlWeb, '_blank');
    }
  }

  abrirEnAppleMaps() {
    this.mostrarSelectorNavegacion = false;
    window.location.href = `maps://maps.apple.com/?daddr=${this.latitud},${this.longitud}&dirflg=d`;
  }

  abrirEnBrowser() {
    this.mostrarSelectorNavegacion = false;
    window.open(`https://www.google.com/maps/search/?api=1&query=${this.latitud},${this.longitud}`, '_blank');
  }

  // ── ACTUALIZAR CLIENTE — incluye dircl1, latitud, longitud ───────────────────
  update_cliente() {
    const datos: any = {};
    datos['codus1'] = this.usuario.toUpperCase();
    datos['codemp'] = this.empresa;
    datos['codcli'] = this.codcli;
    datos['nomcli'] = this.nomcli.toUpperCase();
    datos['rucced'] = this.rucced.trim();
    datos['dircli'] = this.dircli.trim();
    datos['dircl1'] = this.dircl1 || null;    // Geolocalización
    datos['telcli'] = this.telcli.trim();
    datos['telcli2'] = this.telcli2 != null ? this.telcli2.trim() : null;
    datos['email'] = this.email;
    datos['fectra'] = this.fectra;
    datos['latitud'] = this.latitud;          // Coordenadas
    datos['longitud'] = this.longitud;

    if (this.ciudad === '*** OTRA CIUDAD ***') { this.ciudad = 'OTRA CIUDAD'; }
    datos['ciucli'] = this.ciudad;
    datos['tipo'] = this.tipo_cliente;
    datos['tpIdCliente'] = this.tipo_doc;
    datos['codprov'] = this.provincia;

    if (this.validar_campos_obligatorios(datos) &&
      this.validar_formato_campos_numeros(datos) &&
      this.validar_longitud_cedula_ruc(datos)) {
      this.srv.actualizar_cliente(datos).subscribe(() => {
        alert('Cliente con identificación ' + this.rucced + ' actualizado con éxito..!!');
        this.router.navigate(['/admin/dashboard3', datos]);
      });
    }
  }

  // ── ACTUALIZAR PROVEEDOR — SIN dircl1, latitud, longitud ─────────────────────
  update_proveedor() {
    const datos: any = {};
    datos['codus1'] = this.usuario.toUpperCase();
    datos['codemp'] = this.empresa;
    datos['codcli'] = this.codcli;
    datos['nomcli'] = this.nomcli.toUpperCase();
    datos['rucced'] = this.rucced.trim();
    datos['dircli'] = this.dircli.trim();
    // dircl1, latitud y longitud NO se envían para proveedores
    datos['telcli'] = this.telcli.trim();
    datos['telcli2'] = this.telcli2 != null ? this.telcli2.trim() : null;
    datos['email'] = this.email;
    datos['fectra'] = this.fectra;

    if (this.ciudad === '*** OTRA CIUDAD ***') { this.ciudad = 'OTRA CIUDAD'; }
    datos['ciucli'] = this.ciudad;
    datos['tipo'] = this.tipo_cliente;
    datos['tpIdCliente'] = this.tipo_doc;
    datos['codprov'] = this.provincia;

    if (this.validar_campos_obligatorios(datos) &&
      this.validar_formato_campos_numeros(datos) &&
      this.validar_longitud_cedula_ruc(datos)) {
      this.srv.actualizar_proveedor(datos).subscribe(() => {
        alert('Proveedor con identificación ' + this.rucced + ' actualizado con éxito..!!');
        this.router.navigate(['/admin/dashboard3', datos]);
      });
    }
  }

  // ── VALIDACIONES ──────────────────────────────────────────────────────────────
  validar_campos_obligatorios(datos): boolean {
    let ok = true;
    if (!datos['nomcli'] || datos['nomcli'].length === 0) {
      alert('Nombre/Razón social vacío.'); ok = false;
    } else if (!datos['rucced'] || datos['rucced'].length === 0) {
      alert('Número de Identificación vacío.'); ok = false;
    } else if (!datos['tpIdCliente'] || datos['tpIdCliente'] === 'N') {
      alert('Tipo de Identificación no seleccionado.'); ok = false;
    } else if (!datos['dircli'] || datos['dircli'].length === 0) {
      alert('Dirección vacía.'); ok = false;
    } else if ((!datos['telcli'] || datos['telcli'].length === 0) && (!datos['telcli2'] || datos['telcli2'].length === 0)) {
      alert('Por favor llenar al menos un número telefónico.'); ok = false;
    } else if (!datos['ciucli'] || datos['ciucli'] === 'NO DISPONIBLE') {
      alert('Ciudad no seleccionada.'); ok = false;
    } else if (!datos['email'] || datos['email'].length === 0) {
      alert('Correo electrónico vacío.'); ok = false;
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
}
