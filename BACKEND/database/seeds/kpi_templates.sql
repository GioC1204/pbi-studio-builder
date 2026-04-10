-- KPI Templates Seed
-- Power BI Studio Builder — Initial KPI Library
-- Sectors: retail, finanzas, logistica

INSERT INTO kpi_templates (sector, name, description_template, format, default_target, aggregation, keywords, is_approved) VALUES

-- ══════════════════════════════════════════════════
-- RETAIL (12 KPIs)
-- ══════════════════════════════════════════════════

('retail', 'Ventas Totales',
 'Suma total de todas las ventas realizadas en el período seleccionado.',
 '$ Moneda', 1000000, 'SUM',
 ARRAY['venta','sale','amount','monto','total','valor','ingreso','revenue'], true),

('retail', 'Ticket Promedio',
 'Valor promedio por transacción o pedido en el período.',
 '$ Moneda', 50000, 'AVG',
 ARRAY['ticket','order','pedido','monto','promedio','average'], true),

('retail', 'Número de Transacciones',
 'Conteo total de transacciones o pedidos registrados en el período.',
 '# Número', 5000, 'COUNT',
 ARRAY['transaccion','transaction','orden','order','pedido','id','codigo'], true),

('retail', 'Margen Bruto %',
 'Porcentaje de margen bruto: diferencia entre precio de venta y costo, sobre el precio.',
 '% Porcentaje', 0.35, 'DIVIDE',
 ARRAY['margen','margin','utilidad','profit','ganancia'], true),

('retail', 'Devoluciones',
 'Monto total o cantidad de productos devueltos por clientes en el período.',
 '# Número', 100, 'SUM',
 ARRAY['devolucion','return','devuelto','reembolso','refund'], true),

('retail', 'Rotación de Inventario',
 'Número de veces que el inventario se renueva en el período. Indica eficiencia del stock.',
 '# Número', 12, 'DIVIDE',
 ARRAY['inventario','inventory','stock','rotacion','rotation'], true),

('retail', 'Clientes Únicos',
 'Número de clientes distintos que realizaron al menos una compra en el período.',
 '# Número', 2000, 'COUNTD',
 ARRAY['cliente','customer','client','usuario','user','id_cliente'], true),

('retail', 'Ventas por Categoría',
 'Suma de ventas agrupadas por categoría de producto. Permite comparar rendimiento por línea.',
 '$ Moneda', NULL, 'SUM',
 ARRAY['categoria','category','linea','line','producto','product'], true),

('retail', 'Crecimiento MoM %',
 'Variación porcentual de ventas respecto al mes anterior (Month over Month).',
 '% Porcentaje', 0.05, 'DIVIDE',
 ARRAY['crecimiento','growth','mes','month','variacion','cambio'], true),

('retail', 'Cumplimiento de Meta',
 'Porcentaje de cumplimiento de la meta de ventas establecida para el período.',
 '% Porcentaje', 1.0, 'DIVIDE',
 ARRAY['meta','target','objetivo','goal','cuota','quota'], true),

('retail', 'Stock Disponible',
 'Cantidad total de unidades disponibles en inventario al cierre del período.',
 '# Número', NULL, 'SUM',
 ARRAY['stock','inventario','inventory','unidades','units','disponible'], true),

('retail', 'Top Productos',
 'Ranking de productos con mayor volumen de ventas en el período.',
 '# Número', NULL, 'SUM',
 ARRAY['producto','product','sku','articulo','item','nombre'], true),

-- ══════════════════════════════════════════════════
-- FINANZAS (10 KPIs)
-- ══════════════════════════════════════════════════

('finanzas', 'Ingresos Totales',
 'Suma total de todos los ingresos registrados en el período.',
 '$ Moneda', 5000000, 'SUM',
 ARRAY['ingreso','income','revenue','entrada','venta','total'], true),

('finanzas', 'Gastos Operacionales',
 'Suma total de gastos operativos del período (administración, ventas, operación).',
 '$ Moneda', 2000000, 'SUM',
 ARRAY['gasto','expense','costo','cost','egreso','operacional'], true),

('finanzas', 'EBITDA',
 'Ganancias antes de intereses, impuestos, depreciación y amortización.',
 '$ Moneda', 1500000, 'SUM',
 ARRAY['ebitda','utilidad','ganancia','profit','operacional'], true),

('finanzas', 'Flujo de Caja Neto',
 'Diferencia entre ingresos y egresos de efectivo en el período.',
 '$ Moneda', 500000, 'SUM',
 ARRAY['flujo','cash','caja','flow','neto','efectivo'], true),

('finanzas', 'Rentabilidad %',
 'Porcentaje de rentabilidad neta sobre los ingresos totales del período.',
 '% Porcentaje', 0.20, 'DIVIDE',
 ARRAY['rentabilidad','profitability','margen','margin','neto','net'], true),

('finanzas', 'Liquidez Corriente',
 'Ratio entre activos corrientes y pasivos corrientes. Indica capacidad de pago a corto plazo.',
 '# Número', 1.5, 'DIVIDE',
 ARRAY['liquidez','liquidity','activo','asset','pasivo','liability'], true),

('finanzas', 'Deuda sobre Patrimonio',
 'Ratio de apalancamiento financiero: deuda total dividida entre el patrimonio.',
 '# Número', 0.5, 'DIVIDE',
 ARRAY['deuda','debt','patrimonio','equity','pasivo','liability'], true),

('finanzas', 'Gastos vs Presupuesto %',
 'Porcentaje de ejecución del presupuesto de gastos en el período.',
 '% Porcentaje', 1.0, 'DIVIDE',
 ARRAY['presupuesto','budget','gasto','expense','ejecucion','execution'], true),

('finanzas', 'Margen Neto %',
 'Utilidad neta como porcentaje de los ingresos totales.',
 '% Porcentaje', 0.15, 'DIVIDE',
 ARRAY['margen','margin','neto','net','utilidad','profit'], true),

('finanzas', 'Cuentas por Cobrar',
 'Monto total pendiente de cobro a clientes al cierre del período.',
 '$ Moneda', NULL, 'SUM',
 ARRAY['cobrar','receivable','cliente','customer','cartera','pendiente'], true),

-- ══════════════════════════════════════════════════
-- LOGÍSTICA (10 KPIs)
-- ══════════════════════════════════════════════════

('logistica', 'Pedidos a Tiempo %',
 'Porcentaje de pedidos entregados dentro del tiempo comprometido con el cliente.',
 '% Porcentaje', 0.95, 'DIVIDE',
 ARRAY['tiempo','time','entrega','delivery','pedido','order','puntual'], true),

('logistica', 'Costo por Entrega',
 'Costo promedio incurrido por cada entrega realizada en el período.',
 '$ Moneda', 15000, 'AVG',
 ARRAY['costo','cost','entrega','delivery','envio','shipping','gasto'], true),

('logistica', 'Tiempo Promedio de Entrega',
 'Promedio de días transcurridos desde la orden hasta la entrega al cliente.',
 '# Número', 3, 'AVG',
 ARRAY['tiempo','time','dias','days','entrega','delivery','demora'], true),

('logistica', 'Tasa de Devoluciones %',
 'Porcentaje de pedidos devueltos sobre el total de pedidos despachados.',
 '% Porcentaje', 0.03, 'DIVIDE',
 ARRAY['devolucion','return','devuelto','rechazado','rejected','tasa'], true),

('logistica', 'Utilización de Flota %',
 'Porcentaje de utilización de los vehículos de la flota sobre su capacidad total.',
 '% Porcentaje', 0.85, 'DIVIDE',
 ARRAY['flota','fleet','vehiculo','vehicle','camion','truck','utilizacion'], true),

('logistica', 'Inventario en Tránsito',
 'Valor o cantidad de unidades actualmente en proceso de transporte o tránsito.',
 '# Número', NULL, 'SUM',
 ARRAY['transito','transit','transporte','transport','movimiento','en camino'], true),

('logistica', 'Pedidos Pendientes',
 'Número de pedidos recibidos que aún no han sido despachados o procesados.',
 '# Número', NULL, 'COUNT',
 ARRAY['pendiente','pending','backlog','sin despachar','cola','queue'], true),

('logistica', 'Exactitud de Inventario %',
 'Porcentaje de coincidencia entre el inventario físico y el sistema de registro.',
 '% Porcentaje', 0.99, 'DIVIDE',
 ARRAY['exactitud','accuracy','inventario','inventory','fisico','conteo'], true),

('logistica', 'Roturas de Stock',
 'Número de veces que un producto se quedó sin stock en el período (stockout).',
 '# Número', 0, 'COUNT',
 ARRAY['rotura','stockout','agotado','sin stock','quiebre','ruptura'], true),

('logistica', 'NPS de Entregas',
 'Net Promoter Score relacionado con la experiencia de entrega del cliente.',
 '# Número', 70, 'AVG',
 ARRAY['nps','satisfaccion','satisfaction','calificacion','rating','score','cliente'], true);
