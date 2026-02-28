/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductInput {
  nombre: string;
  unidades: number;
  subtotalFactura: number;
  ivaFactura: number;
  ibuaFactura: number;
  gravadoVenta: boolean;
  margenPct?: number;
  precioFijado?: number;
}

export interface CalculationResult {
  nombre: string;
  costoAdquisicion: number;
  precioVentaSinIva: number;
  ivaGenerado: number;
  precioFinalPVP: number;
  utilidadNeta: number;
  pctRentabilidad: number;
  ivaNetoAPagar: number;
}

export function calculateProfitability(input: ProductInput): CalculationResult {
  const {
    nombre,
    unidades,
    subtotalFactura,
    ivaFactura,
    ibuaFactura,
    gravadoVenta,
    margenPct = 0,
    precioFijado = 0,
  } = input;

  const costoNetoUn = subtotalFactura / unidades;
  const ivaDescontableUn = ivaFactura / unidades;
  const ibuaUn = ibuaFactura / unidades;
  const costoTotalCompra = costoNetoUn + ibuaUn;

  let precioVentaPublico = 0;
  let precioSugeridoSinIva = 0;

  if (precioFijado > 0) {
    // Caso 2: El usuario da el precio final y calculamos el margen
    precioVentaPublico = precioFijado;
    if (gravadoVenta) {
      precioSugeridoSinIva = precioVentaPublico / 1.19;
    } else {
      precioSugeridoSinIva = precioVentaPublico;
    }
  } else {
    // Caso 1: El usuario da el margen y calculamos el precio
    const m = margenPct >= 1 ? margenPct / 100 : margenPct;
    precioSugeridoSinIva = costoTotalCompra * (1 + m);
    const ivaV = gravadoVenta ? precioSugeridoSinIva * 0.19 : 0;
    precioVentaPublico = precioSugeridoSinIva + ivaV;
  }

  const ivaVentaUn = precioVentaPublico - precioSugeridoSinIva;
  const utilidadRealUn = precioSugeridoSinIva - costoTotalCompra;
  const pctUtilidadSobrePvp = precioVentaPublico === 0 ? 0 : (utilidadRealUn / precioVentaPublico) * 100;
  const ivaAPagarDian = ivaVentaUn - ivaDescontableUn;

  return {
    nombre,
    costoAdquisicion: costoTotalCompra,
    precioVentaSinIva: precioSugeridoSinIva,
    ivaGenerado: ivaVentaUn,
    precioFinalPVP: precioVentaPublico,
    utilidadNeta: utilidadRealUn,
    pctRentabilidad: pctUtilidadSobrePvp,
    ivaNetoAPagar: ivaAPagarDian,
  };
}
