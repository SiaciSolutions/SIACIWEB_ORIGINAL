import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormaPagoModalComponent } from './forma-pago-modal/forma-pago-modal.component';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

declare var AdminLTE: any;

@Component({
  selector: 'app-admin-cliente-cobro',
  templateUrl: './admin-cliente-cobro.component.html',
  styleUrls: ['./admin-cliente-cobro.component.css']
})
export class AdminClienteCobroComponent implements OnInit {

  usuario: string;
  empresa: string;
  nomcli: string;
  codcli: string;
  rucced = '';
  email: string;
  public today = new Date();
  
  // Variables para búsqueda de cliente
  exist_razon_social = false;
  patron_cliente: string;
  razon_social_lista: any[];
  nombreClienteSeleccionado = '';
  
  // Variables para saldo y detalle
  fecha_status_cartera: string;
  saldo_cliente: string;
  datosCobranza: any[] = [];
  ver_detalle = false;
  vistaActiva: 'detalle' | 'forma_pago' | 'detalle_cobro' = 'detalle';
  listaVendedores: any[] = [];
  zoomLevel = 1;

  constructor(
    private router: Router, 
    private srv: ApiService, 
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (!this.srv.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
       
    this.route.queryParams.subscribe(params => {
      this.usuario = params['usuario'] || this.route.snapshot.paramMap.get('usuario') || 0;
      this.empresa = params['empresa'] || this.route.snapshot.paramMap.get('empresa') || 0;
    });
    
    this.fecha_status_cartera = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '-0500');

    
    AdminLTE.init();
  }

  
    
  consulta_saldo_cartera() {
    let fec_cartera = formatDate(this.fecha_status_cartera, 'yyyy-MM-dd', 'en-US', '-0500');
    
    if (this.codcli) {
      let datos_saldo_cliente = {
        codemp: this.empresa,
        fecha_cartera: fec_cartera,
        codcli: this.codcli
      };
      
      this.srv.saldo_cartera(datos_saldo_cliente).subscribe(
        data => {
          if (data['saldo_cliente']) {
            this.saldo_cliente = "USD " + data['saldo_cliente'];
          } else {
            this.saldo_cliente = "USD " + 0;
          }
        }
      ); 
    } else {
      alert("Se necesita los datos del cliente para obtener su saldo");
    }
  }
    
  busqueda_razon_social() { 
    if (this.patron_cliente) {
      const datos = {
        codemp: this.empresa,
        patron_cliente: this.patron_cliente
      };
      
      this.srv.busqueda_razon_social2(datos).subscribe(data => {
        let longitud_data = data.length;

        if (longitud_data > 0) {
          this.razon_social_lista = data;
          this.exist_razon_social = true;
        } else {
          alert("Cliente no encontrado con la palabra clave ingresada <<" + this.patron_cliente + ">>");
          this.exist_razon_social = false;
        }
      }); 
    } else { 
      alert("Por favor llenar el campo Cliente");
    }
  }
     
  select_razon_social(ident: string, ruc: string, rz: string, correo: string, codcli: string, dircli: string) {
    this.nombreClienteSeleccionado = rz;
    this.rucced = ruc;
    this.codcli = codcli;
    this.email = correo;
    this.exist_razon_social = false;
    this.patron_cliente = undefined;

    this.datosCobranza = [];
    this.ver_detalle = false;
    this.saldo_cliente = '';
  }

  consulta_detalle_cartera() {
    let datos_reporte = {
      codemp: this.empresa,
      codcen: '',
      clase: '',
      codcli: this.codcli,
      tipo: ''
    };
    
    this.srv.cobranza(datos_reporte).subscribe(
      data => {
        this.datosCobranza = data.clientes;

        if (this.datosCobranza.length == 0) {
          alert("No existe datos");
        } else {
          this.ver_detalle = true;
        }
      }
    );
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

  getTotalSeleccionado(): number {
    let total = 0;
    for (const d of this.datosCobranza) {
      for (const x of d.renglones) {
        if (x.selected) {
          total += Number(x[6]) || 0; // Valor facturado
        }
      }
    }
    return total;
  }

// Métodos actualizados en tu componente principal

// Método para validar si hay elementos seleccionados con saldo > 0
tieneElementosValidosSeleccionados(): boolean {
  for (const d of this.datosCobranza) {
    for (const x of d.renglones) {
      if (x.selected && Number(x[8]) > 0) { // x[8] es el saldo
        return true;
      }
    }
  }
  return false;
}

// Método para obtener solo documentos con saldo > 0
getDocumentosSeleccionados() {
  const documentos = [];
  for (const d of this.datosCobranza) {
    for (const x of d.renglones) {
      if (x.selected && Number(x[8]) > 0) { // Solo documentos con saldo > 0
        documentos.push({
          tipo: x[1], // FC, NC, etc.
          documento: x[2], // Número de documento
          serie: x[3], // Serie
          fechaEmision: x[4], // Fecha de emisión
          fechaVencimiento: x[5], // Fecha de vencimiento
          valorFacturado: Number(x[6]), // Valor facturado
          abono: Number(x[7]), // Abono actual
          saldo: Number(x[8]), // Saldo actual
          concepto: x[9], // Concepto
          numeroInterno: `${x[1]}-${x[2]}-${x[3]}` // ID único
        });
      }
    }
  }
  return documentos;
}

// Método para obtener total de saldo seleccionado (no valor facturado)
getTotalSaldoSeleccionado(): number {
  let total = 0;
  for (const d of this.datosCobranza) {
    for (const x of d.renglones) {
      if (x.selected && Number(x[8]) > 0) {
        total += Number(x[8]); // Sumar saldo, no valor facturado
      }
    }
  }
  return total;
}

// Método actualizado para abrir el modal con validaciones mejoradas
abrirModalFormaPago() {
  // Validar que hay elementos seleccionados
  if (!this.tieneElementosValidosSeleccionados()) {
    alert('Debe seleccionar al menos un documento con saldo pendiente mayor a cero');
    return;
  }

  // Validar que el cliente esté seleccionado
  if (!this.codcli) {
    alert('Debe seleccionar un cliente antes de procesar el pago');
    return;
  }

  const documentosSeleccionados = this.getDocumentosSeleccionados();
  
  if (documentosSeleccionados.length === 0) {
    alert('No hay documentos válidos para procesar el pago');
    return;
  }

  const dialogRef = this.dialog.open(FormaPagoModalComponent, {
    width: '1000px',
    maxWidth: '95vw',
    disableClose: true,
    data: {
      cliente: this.nombreClienteSeleccionado,
      codcli: this.codcli,
      codemp: this.empresa,
      totalAPagar: this.getTotalSaldoSeleccionado(), // Usar saldo, no valor facturado
      fechaDefault: this.fecha_status_cartera,
      documentosSeleccionados: documentosSeleccionados
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.procesarPago) {
      this.procesarPagoBD(result);
    }
  });
}

// Método actualizado para procesar el pago en la base de datos
procesarPagoBD(dataPago: any) {
  alert('Procesando pago, por favor espere...');

  const datosPago = {
    codemp: this.empresa,
    codcli: this.codcli,
    usuario: this.usuario,
    fechaPago: (dataPago.formasPago && dataPago.formasPago.length > 0 && dataPago.formasPago[0].fecha)
    ? dataPago.formasPago[0].fecha
    : new Date().toISOString().split('T')[0],
    formasPago: dataPago.formasPago.map((pago: any) => ({
      formaPago: pago.formaPago,
      numero: pago.numero || '',
      entidadFinanciera: pago.entidadFinanciera,
      fecha: pago.fecha,
      valor: pago.valor,
      tipo: pago.tipo,
      concepto: pago.concepto
    })),
    documentos: dataPago.documentosConPago.map((doc: any) => ({
      tipo: doc.tipo,
      numero: doc.documento,
      serie: doc.serie,
      concepto: doc.concepto,
      saldoAnterior: doc.saldo,
      valorPagado: doc.valorAPagar,
      abono: doc.abono || 0,
      nuevoSaldo: doc.saldo - doc.valorAPagar,
      numcco: doc.numcco,
      tipcco: doc.tipcco
    }))
  };

  this.srv.procesar_pago(datosPago).subscribe(
    (response: any) => {
      if (response.success) {
        alert(`Pago procesado exitosamente.`);
        this.generarRecibo(datosPago);
        this.limpiarSelecciones();
        this.consulta_detalle_cartera();
        this.consulta_saldo_cartera();
      } else {
        alert(`Error al procesar el pago: ${response.message}`);
      }
    },
    error => {
      alert('Error de conexión al procesar el pago');
      console.error('Error:', error);
    }
  );
}


  // Método para limpiar todas las selecciones después del pago
  limpiarSelecciones() {
    this.datosCobranza.forEach(cliente => {
      cliente.selectAll = false;
      cliente.renglones.forEach(renglon => {
        renglon.selected = false;
      });
    });
    this.calcularTotalSeleccionado();
  }

  // Método actualizado para calcular totales considerando solo saldos
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

      cliente.suma_venta_filtrada = venta;
      cliente.suma_abono_filtrada = abono;
      cliente.suma_total_filtrada = saldo;
    });
  }

  // Método para verificar si el botón debe estar habilitado
  get botonFormaPagoHabilitado(): boolean {
    return this.ver_detalle && this.tieneElementosValidosSeleccionados();
  }

  // Agregar estos métodos al componente AdminClienteCobroComponent

  zoomIn(): void {
    if (this.zoomLevel < 2) {
      this.zoomLevel += 0.1;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.1;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  async cargarFormasPagoConDescripcion(formasPago: any[]) {
    for (let f of formasPago) {
      const resp: any = await this.srv
        .tipos_transaccion({ codemp: '', bandera: 1, tiptra: f.formaPago })
        .toPromise();
      console.log(resp)
      if (resp && resp.length > 0) {
        f.nomtra = resp[0].nomtra;
      } else {
        f.nomtra = f.formaPago;
      }

      if (f.entidadFinanciera) {
        const respBanco: any = await this.srv
          .bancos({ codemp: this.empresa, bandera: 1 ,codban: f.entidadFinanciera }) // pasamos codban
          .toPromise();

        if (respBanco && respBanco.length > 0) {
          f.nomban = respBanco[0].nomban;
        } else {
          f.nomban = f.entidadFinanciera; // fallback si no se encuentra
        }
      } else {
        f.nomban = '';
      }
    }
    return formasPago;
  }

  async generarRecibo(datosPago: any) {
    const fechaHoy = new Date();
    const fecha = fechaHoy.toLocaleDateString();
    const hora = fechaHoy.toLocaleTimeString();

    datosPago.formasPago = await this.cargarFormasPagoConDescripcion(datosPago.formasPago);

    const total = datosPago.formasPago.reduce((sum: number, p: any) => sum + (p.valor || 0), 0);
    console.log(datosPago.formasPago)
    const docDefinition: any = {
      pageSize: { width: 220, height: 'auto' }, // formato ticket
      pageMargins: [10, 10, 10, 10],
      content: [
        { text: 'Comprobante de pago', alignment: 'center', bold: true, margin: [0, 0, 0, 5] },

        { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 } ], margin: [0,5,0,5] },

        { text: `Nombre cliente: ${this.nombreClienteSeleccionado}`, margin: [0, 0, 0, 2] },
        { text: `ID Cliente: ${this.codcli}`, margin: [0, 0, 0, 2] },
        { text: `Fecha de pago: ${fecha}`, margin: [0, 0, 0, 2] },
        { text: `Hora: ${hora}`, margin: [0, 0, 0, 2] },
        {
          text: 'Documentos:',
          margin: [0, 5, 0, 2],
          bold: true
        },
        {
          table: {
            widths: ['*', '*', 'auto'], // 3 columnas
            body: [
              // Cabecera
              [
                { text: 'N° Factura', bold: true },
                { text: 'Concepto', bold: true },
                { text: 'Valor', bold: true }
              ],
              // Filas dinámicas
              ...datosPago.documentos.map((d: any) => [
                d.numero || '',
                d.concepto || '',
                { text: `$${(d.valorPagado || 0).toFixed(2)}`, alignment: 'right' }
              ])
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 5]
        },

        ///
        { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 } ], margin: [0,5,0,5] },
        ////
        {
          text: 'Formas de Pago:',
          margin: [0, 5, 0, 2],
          bold: true
        },
        {
          table: {
            widths: [40, 50, 25, 38],
            body: [
              // Cabecera
              [
                { text: 'Forma Pago', bold: true },
                { text: 'Entidad Financiera', bold: true },
                { text: 'N°', bold: true },
                { text: 'Valor', bold: true }
              ],
              // Filas dinámicas
              ...datosPago.formasPago.map((f: any) => [
                f.nomtra || '',
                f.nomban || '',
                f.numero || '',
                { text: `$${(f.valor || 0).toFixed(2)}`, alignment: 'right' }
              ])
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 5]
        },
        ////

        { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 } ], margin: [0,5,0,5] },

        { text: `Total: $${total.toFixed(2)}`, margin: [0, 0, 0, 10], bold: true },

        { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 } ], margin: [0,20,0,2] },
        { text: 'Firma', alignment: 'center', bold: true }
      ],
      styles: {
        small: { fontSize: 9 }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }

  // 👉 Función para convertir números a letras (simplificada)
  numeroALetras(num: number): string {
    // Aquí puedes usar una librería o lógica más completa
    if (num === 2000) return 'dos mil';
    if (num === 1000) return 'mil';
    return num.toString();
  }
}