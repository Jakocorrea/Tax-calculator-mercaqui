/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Percent, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  RefreshCcw,
  Info,
  Plus,
  Download,
  Trash2,
  Table as TableIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateProfitability, ProductInput, CalculationResult } from './types';
import * as XLSX from 'xlsx';

type CalculationMode = 'margin' | 'fixed_price';

export default function App() {
  const [mode, setMode] = useState<CalculationMode>('margin');
  const [formData, setFormData] = useState<any>({
    nombre: '',
    unidades: '1',
    subtotalFactura: '',
    ivaFactura: '',
    ibuaFactura: '',
    gravadoVenta: true,
    margenPct: '30',
    precioFijado: '',
  });

  const [showResults, setShowResults] = useState(false);
  const [productList, setProductList] = useState<CalculationResult[]>([]);

  const results = useMemo(() => {
    if (!formData.nombre || !formData.unidades || parseFloat(formData.unidades) <= 0) return null;
    try {
      const parsedInput: ProductInput = {
        nombre: formData.nombre,
        unidades: parseFloat(formData.unidades) || 0,
        subtotalFactura: parseFloat(formData.subtotalFactura) || 0,
        ivaFactura: parseFloat(formData.ivaFactura) || 0,
        ibuaFactura: parseFloat(formData.ibuaFactura) || 0,
        gravadoVenta: formData.gravadoVenta,
        margenPct: parseFloat(formData.margenPct) || 0,
        precioFijado: parseFloat(formData.precioFijado) || 0,
      };
      return calculateProfitability(parsedInput);
    } catch (e) {
      return null;
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      unidades: '1',
      subtotalFactura: '',
      ivaFactura: '',
      ibuaFactura: '',
      gravadoVenta: true,
      margenPct: '30',
      precioFijado: '',
    });
    setShowResults(false);
  };

  const addProductToList = () => {
    if (results) {
      setProductList(prev => [...prev, results]);
      resetForm();
    }
  };

  const removeProductFromList = (index: number) => {
    setProductList(prev => prev.filter((_, i) => i !== index));
  };

  const exportToExcel = () => {
    if (productList.length === 0) return;

    const dataToExport = productList.map(p => ({
      'Producto': p.nombre,
      'Costo Adquisición': p.costoAdquisicion,
      'Precio Venta (Sin IVA)': p.precioVentaSinIva,
      'IVA Generado': p.ivaGenerado,
      'Precio Final (PVP)': p.precioFinalPVP,
      'Utilidad Neta': p.utilidadNeta,
      'Rentabilidad (%)': p.pctRentabilidad.toFixed(2),
      'IVA Neto a Pagar': p.ivaNetoAPagar
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Análisis de Rentabilidad');
    
    // Auto-size columns
    const maxWidths = Object.keys(dataToExport[0]).map(key => {
      const headerLen = key.length;
      const maxContentLen = Math.max(...dataToExport.map(row => String(row[key as keyof typeof row]).length));
      return { wch: Math.max(headerLen, maxContentLen) + 2 };
    });
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, 'Analisis_Rentabilidad_Tributaria.xlsx');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Calculator size={18} />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-slate-800">Tax & Price Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            {productList.length > 0 && (
              <button 
                onClick={exportToExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all"
              >
                <Download size={16} />
                Exportar Excel ({productList.length})
              </button>
            )}
            <button 
              onClick={resetForm}
              className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <RefreshCcw size={14} />
              Limpiar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="text-indigo-600" size={20} />
                  Configuración del Producto
                </h2>
                <p className="text-slate-500 text-sm mt-1">Ingrese los detalles de la factura y el producto.</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Mode Selector */}
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => {
                      setMode('margin');
                      setFormData(p => ({ ...p, precioFijado: 0 }));
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      mode === 'margin' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Por Margen
                  </button>
                  <button
                    onClick={() => {
                      setMode('fixed_price');
                      setFormData(p => ({ ...p, margenPct: 0 }));
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      mode === 'fixed_price' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Por Precio Fijo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Producto</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej: Café Especial 500g"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unidades en Factura</label>
                    <input
                      type="number"
                      name="unidades"
                      min="1"
                      value={formData.unidades}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subtotal Factura</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        name="subtotalFactura"
                        value={formData.subtotalFactura}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">IVA Total Factura</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        name="ivaFactura"
                        value={formData.ivaFactura}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">IBUA Total Factura</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        name="ibuaFactura"
                        value={formData.ibuaFactura}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                      <Percent size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">¿Cobra IVA al vender?</p>
                      <p className="text-xs text-indigo-700">Aplica el 19% sobre el precio base</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="gravadoVenta"
                      checked={formData.gravadoVenta}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  {mode === 'margin' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Margen de Ganancia Deseado (%)</label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="number"
                          name="margenPct"
                          value={formData.margenPct}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                          placeholder="Ej: 30"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Precio de Venta Actual (PVP)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="number"
                          name="precioFijado"
                          value={formData.precioFijado}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                          placeholder="Ej: 50000"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={() => setShowResults(true)}
                  disabled={!formData.nombre || formData.unidades <= 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  Calcular Análisis
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {showResults && results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Main Result Card */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <TrendingUp size={120} />
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Utilidad Neta por Unidad</p>
                      <h3 className="text-4xl font-bold mb-4">{formatCurrency(results.utilidadNeta)}</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                          <p className="text-white/60 text-[10px] font-bold uppercase mb-1">Rentabilidad</p>
                          <p className="text-xl font-bold">{results.pctRentabilidad.toFixed(2)}%</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                          <p className="text-white/60 text-[10px] font-bold uppercase mb-1">IVA DIAN</p>
                          <p className="text-xl font-bold">{formatCurrency(results.ivaNetoAPagar)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-700">Desglose de Precios</h3>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Análisis Unitario</span>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          Costo Adquisición
                        </span>
                        <span className="font-semibold text-slate-800">{formatCurrency(results.costoAdquisicion)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          Precio Venta (Sin IVA)
                        </span>
                        <span className="font-semibold text-slate-800">{formatCurrency(results.precioVentaSinIva)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          IVA Generado
                        </span>
                        <span className="font-semibold text-slate-800">{formatCurrency(results.ivaGenerado)}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-slate-900 font-bold">Precio Final (PVP)</span>
                        <span className="text-indigo-600 font-black text-lg">{formatCurrency(results.precioFinalPVP)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={addProductToList}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Guardar en Lista
                  </button>

                  {/* Tips/Info */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                    <Info className="text-amber-500 shrink-0" size={20} />
                    <div>
                      <p className="text-amber-900 text-sm font-bold">Nota Tributaria</p>
                      <p className="text-amber-800 text-xs leading-relaxed">
                        El IVA neto a pagar a la DIAN se calcula restando el IVA descontable de la compra al IVA generado en la venta.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <TrendingUp size={32} />
                  </div>
                  <h3 className="text-slate-400 font-medium">Complete los datos para ver el análisis</h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-[240px]">
                    Ingrese el nombre del producto y los valores de la factura para generar el reporte de rentabilidad.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Product List Section */}
        {productList.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <TableIcon size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Lista de Productos</h2>
                  <p className="text-slate-500 text-sm">Resumen de todos los análisis guardados.</p>
                </div>
              </div>
              <button 
                onClick={exportToExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <Download size={18} />
                Exportar a Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Producto</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Costo Unit.</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">PVP Final</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Utilidad</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Rent. %</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">IVA DIAN</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productList.map((product, index) => (
                    <motion.tr 
                      key={`${product.nombre}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{product.nombre}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(product.costoAdquisicion)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">{formatCurrency(product.precioFinalPVP)}</td>
                      <td className="px-6 py-4 text-sm text-emerald-600 font-medium">{formatCurrency(product.utilidadNeta)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">
                          {product.pctRentabilidad.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(product.ivaNetoAPagar)}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeProductFromList(index)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-slate-200 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © 2026 Tax & Price Manager. Diseñado para cumplimiento tributario.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Cálculos Verificados
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <AlertCircle size={12} className="text-indigo-500" />
              DIAN Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
