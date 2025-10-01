import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from './../../../api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface FormaPago {
  formaPago: string;
  entidadFinanciera: string;
  fecha: string;
  valor: number;
  tipo: string;
  concepto: string;
  numero: string;
}


export interface DocumentoConPago {
  tipo: string;
  documento: string;
  serie: string;
  concepto: string; // ✅ Nueva propiedad agregada
  valorFacturado: number;
  saldo: number;
  valorAPagar: number;
  // Campos adicionales que necesitarás para el backend
  codcli?: string;
  numeroInterno?: string; // Si tienes un ID interno del documento
}

export interface DialogData {
  cliente: string;
  totalAPagar: number;
  fechaDefault: string;
  documentosSeleccionados: any[];
  codcli?: string;
  codemp?: string; 
}

@Component({
  selector: 'app-forma-pago-modal',
  templateUrl: './forma-pago-modal.component.html',
  styleUrls: ['./forma-pago-modal.component.css']
})
export class FormaPagoModalComponent implements OnInit {

  formasPago: FormaPago[] = [];
  documentosConPago: DocumentoConPago[] = [];
  conceptoTemporal: string = '';

  formasPagoOpciones: any[] = [];
  tiposPago: any[] = [];
  tiposBanco: any[] = [];

  constructor(
    private srv: ApiService,
    public dialogRef: MatDialogRef<FormaPagoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.inicializarDocumentos();
    this.inicializarFormasPago();
    this.tipos_transaccion();
    this.tipos_forma_pago();
    this.bancos();
  }

  inicializarDocumentos(): void {
    this.documentosConPago = this.data.documentosSeleccionados.map(doc => ({
      tipo: doc.tipo,
      documento: doc.documento,
      serie: doc.serie,
      concepto: doc.concepto || '', // ✅ Agregar el concepto del documento
      valorFacturado: Number(doc.valorFacturado || 0),
      saldo: Number(doc.saldo || 0),
      valorAPagar: Number(doc.saldo || 0), // Por defecto, pagar todo el saldo
      codcli: this.data.codcli,
      numeroInterno: doc.numeroInterno // Si tienes este campo
    }));
  }

  tipos_transaccion() {
    let datos = {
      codemp: '',
      bandera: 0,
    };
    this.srv.tipos_transaccion(datos).subscribe(
      data => {
        this.formasPagoOpciones = data;
        if (this.formasPagoOpciones.length == 0) {
          alert("No existe tipos de transaccion");
        }
      }
    );
  }

  tipos_forma_pago() {
    let datos = {
      codemp: this.data.codemp,
    };
    this.srv.tipos_forma_pago(datos).subscribe(
      data => {
        this.tiposPago = data;
        if (this.tiposPago.length == 0) {
          alert("No existe tipos de forma de pago");
        }
      }
    );
  }

  bancos() {
    let datos = {
      codemp: this.data.codemp,
      bandera: 0,
    };
    this.srv.bancos(datos).subscribe(
      data => {
        this.tiposBanco = data;
        if (this.tiposBanco.length == 0) {
          alert("Error al cargar bancos");
        }
      }
    );
  }


  inicializarFormasPago(): void {
    this.formasPago = [{
      formaPago: '',
      entidadFinanciera: '',
      fecha: this.data.fechaDefault,
      valor: this.getTotalAPagar(),
      tipo: 'completo',
      concepto: '',
      numero: '',
    }];
  }

  validarValorAPagar(index: number): void {
    const documento = this.documentosConPago[index];
    if (documento.valorAPagar > documento.saldo) {
      alert('El valor a pagar no puede ser mayor al saldo');
      documento.valorAPagar = documento.saldo;
    }
    if (documento.valorAPagar < 0) {
      documento.valorAPagar = 0;
    }
  }

  calcularTotalAPagar(): void {
    // Actualizar el valor de la primera forma de pago automáticamente
    if (this.formasPago.length > 0) {
      this.formasPago[0].valor = this.getTotalAPagar();
    }
  }

  getTotalAPagar(): number {
    return this.documentosConPago.reduce((total, doc) => total + (Number(doc.valorAPagar) || 0), 0);
  }

  getTotalFormasPago(): number {
    return this.formasPago.reduce((total, pago) => total + (Number(pago.valor) || 0), 0);
  }

  validarTotalFormasPago(): void {
    const totalFormasPago = this.getTotalFormasPago();
    const totalAPagar = this.getTotalAPagar();
    
    if (totalFormasPago > totalAPagar) {
      alert('El total de formas de pago no puede exceder el total a pagar');
    }
  }

  agregarFormaPago(): void {
    this.formasPago.push({
      formaPago: '',
      entidadFinanciera: '',
      fecha: this.data.fechaDefault,
      valor: 0,
      tipo: 'parcial',
      concepto: '',
      numero: '',  
    });

    this.formasPago = [...this.formasPago];
  }

  eliminarFormaPago(index: number): void {
    this.formasPago.splice(index, 1);
    this.formasPago = [...this.formasPago];
  }


  onCancelar(): void {
    this.dialogRef.close();
  }

  // Método para aplicar el mismo concepto a todos los documentos
  aplicarConceptoATodos(concepto: string): void {
    if (concepto && concepto.trim()) {
      this.documentosConPago.forEach(doc => {
        doc.concepto = concepto.trim();
      });
    }
  }

  // Método para resetear todos los conceptos a "ABONO"
  resetearConceptosAAbono(): void {
    this.documentosConPago.forEach(doc => {
      doc.concepto = 'ABONO';
    });
  }

  // Método para validar que todos los conceptos tengan contenido
  validarConceptos(): boolean {
    return this.documentosConPago.every(doc => 
      doc.concepto && doc.concepto.trim().length > 0
    );
  }

  // Actualizar el método validarPago para incluir validación de conceptos
  validarPago(): boolean {
    if (this.formasPago.length === 0 || this.documentosConPago.length === 0) return false;

    const totalFormasPago = this.getTotalFormasPago();
    const totalAPagar = this.getTotalAPagar();

    // Verificar que hay documentos con valor a pagar
    const hayDocumentosConPago = this.documentosConPago.some(doc => doc.valorAPagar > 0);
    if (!hayDocumentosConPago) return false;

    // Verificar que todos los campos requeridos estén llenos (incluir conceptos)
    const camposCompletos = this.formasPago.every(pago =>
      !!pago.formaPago && !!pago.fecha && pago.valor > 0 && !!pago.tipo
    );

    // ✅ Verificar que todos los documentos tienen concepto
    const conceptosCompletos = this.validarConceptos();

    // Verificar que el total de formas de pago coincida con el total a pagar
    const totalesCoinciden = totalFormasPago === totalAPagar;

    return camposCompletos && conceptosCompletos && totalesCoinciden;
  }

  // Actualizar onProcesarPago para mostrar mensaje específico si faltan conceptos
  onProcesarPago(): void {
  // 🔹 Validar conceptos de documentos
    if (!this.validarConceptos()) {
      alert('Por favor, complete todos los conceptos de los documentos');
      return;
    }

    // 🔹 Validar conceptos en las formas de pago
    if (this.formasPago.some(p => !p.concepto || p.concepto.trim() === '')) {
      alert('Por favor, complete los conceptos en todas las formas de pago');
      return;
    }

    // 🔹 Validar totales
    if (!this.validarPago()) {
      alert('Por favor, complete todos los campos y verifique que el total de formas de pago coincida con el total a pagar');
      return;
    }

    // 🔹 Validar números únicos en BD (numtra + tiptra + bantra)
    const validaciones = this.formasPago.map(pago => {
      return this.srv.validarNumeroFormaPago(
        pago.numero,
        pago.formaPago,
        pago.entidadFinanciera
      ).toPromise();
    });

    Promise.all(validaciones).then(results => {
      const duplicado = results.find(r => !r.success);

      if (duplicado) {
        alert("⚠️ Uno o más números ya existen en la base de datos. Corrige antes de continuar.");
        return;
      }

      // ✅ Si todo pasa, cerrar el modal con la data
      this.dialogRef.close({
        procesarPago: true,
        formasPago: this.formasPago,
        documentosConPago: this.documentosConPago.filter(doc => doc.valorAPagar > 0)
      });
    }).catch(err => {
      alert("❌ Error, campos sin llenar o N° ya existente");
    });
  }


  getLabelFormaPago(value: string): string {
    const opcion = this.formasPagoOpciones.find(opt => opt.value === value);
    return opcion ? opcion.label : value;
  }

  getLabelTipoPago(value: string): string {
    const opcion = this.tiposPago.find(opt => opt.value === value);
    return opcion ? opcion.label : value;
  }
}