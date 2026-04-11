import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useProject } from '../../context/ProjectContext';
import api from '../../services/api';
import { Database, Upload, Cloud, Plug, Check, ClipboardList } from 'lucide-react';

// ── Type inference ────────────────────────────────
function inferType(values) {
  const nonNull = values.filter((v) => v !== undefined && v !== null && v !== '');
  if (nonNull.length === 0) return 'text';
  // XLSX with cellDates:true returns Date objects for date columns — check first
  if (nonNull.every((v) => v instanceof Date && !isNaN(v.getTime()))) return 'date';
  // String date patterns (ISO, DD/MM/YYYY, MM-DD-YYYY)
  const dateRe = /^\d{4}-\d{2}-\d{2}|^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/;
  if (nonNull.every((v) => dateRe.test(String(v)))) return 'date';
  if (nonNull.every((v) => !isNaN(Number(v)) && Number.isInteger(Number(v)))) return 'integer';
  if (nonNull.every((v) => !isNaN(Number(v)))) return 'decimal';
  return 'text';
}

// ── Format cell value for display ─────────────────
function formatValue(v) {
  if (v instanceof Date && !isNaN(v.getTime())) {
    return v.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  if (v === null || v === undefined) return '—';
  return String(v);
}

// ── Human-readable type labels ────────────────────
const TYPE_LABELS = { integer: 'Entero', decimal: 'Decimal', date: 'Fecha', text: 'Texto' };

// ── Type badge ────────────────────────────────────
const TypeBadge = ({ type }) => {
  const colors = {
    integer: 'bg-blue-100 text-blue-700',
    decimal: 'bg-purple-100 text-purple-700',
    date:    'bg-green-100 text-green-700',
    text:    'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-2xs font-semibold px-1.5 py-px rounded ${colors[type] || colors.text}`}>
      {TYPE_LABELS[type] || type}
    </span>
  );
};

// ── Data Preview Table ────────────────────────────
const DataPreview = ({ headers, rows, columns }) => (
  <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
      <span className="text-xs font-semibold text-gray-600">Vista previa de datos</span>
      <span className="text-xs text-gray-400">{headers.length} columnas · {rows.length} filas de muestra</span>
    </div>
    <div className="overflow-x-auto">
      <table className="text-xs w-full">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  {String(h)}
                  {columns[i] && <TypeBadge type={columns[i].type} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {headers.map((_, j) => (
                <td key={j} className="px-3 py-1.5 text-gray-700 whitespace-nowrap">
                  {row[j] !== undefined && row[j] !== null ? formatValue(row[j]) : <span className="text-gray-300">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Cloud connection form fields by type ──────────
const CLOUD_SOURCES = [
  { id: 's3',        Icon: Cloud,    label: 'AWS S3' },
  { id: 'postgres',  Icon: Database, label: 'PostgreSQL' },
  { id: 'mysql',     Icon: Database, label: 'MySQL' },
  { id: 'sqlserver', Icon: Database, label: 'SQL Server' },
];

const S3_FIELDS = [
  { key: 'bucket',          label: 'Nombre del Bucket',  placeholder: 'mi-bucket-de-datos', type: 'text' },
  { key: 'region',          label: 'Región AWS',         placeholder: 'us-east-1',           type: 'text' },
  { key: 'accessKeyId',     label: 'Access Key ID',      placeholder: 'AKIA...',             type: 'text' },
  { key: 'secretAccessKey', label: 'Secret Access Key',  placeholder: '••••••••',            type: 'password' },
  { key: 'filePath',        label: 'Ruta del archivo',   placeholder: 'datos/ventas.csv',    type: 'text' },
];

const DB_FIELDS = (type) => [
  { key: 'host',      label: type === 'sqlserver' ? 'Servidor' : 'Host',  placeholder: type === 'sqlserver' ? 'servidor.database.windows.net' : 'localhost', type: 'text' },
  { key: 'port',      label: 'Puerto',     placeholder: type === 'postgres' ? '5432' : type === 'mysql' ? '3306' : '1433', type: 'number' },
  { key: 'database',  label: 'Base de datos', placeholder: 'mi_base_de_datos', type: 'text' },
  { key: 'user',      label: 'Usuario',    placeholder: 'usuario_db',      type: 'text' },
  { key: 'password',  label: 'Contraseña', placeholder: '••••••••',        type: 'password' },
  { key: 'tableName', label: 'Tabla',      placeholder: 'ventas',          type: 'text' },
];

const CloudForm = ({ projectId, onConnected }) => {
  const [sourceType, setSourceType] = useState('postgres');
  const [creds, setCreds] = useState({});
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fields = sourceType === 's3' ? S3_FIELDS : DB_FIELDS(sourceType);

  const handleTest = async () => {
    setTesting(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post(`/projects/${projectId}/modules/1/test-connection`, {
        type: sourceType,
        credentials: creds,
      });
      setSuccess(data.message);
      onConnected(data.tables);
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión. Verifica los datos.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      {/* Source type selector */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {CLOUD_SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSourceType(s.id); setCreds({}); setError(''); setSuccess(''); }}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${sourceType === s.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <s.Icon size={20} color={sourceType === s.id ? '#F2C811' : '#9CA3AF'} strokeWidth={1.75} />
            <span className={`text-xs font-semibold ${sourceType === s.id ? 'text-yellow-700' : 'text-gray-600'}`}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Credentials form */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {fields.map((f) => (
          <div key={f.key} className={f.key === 'secretAccessKey' || f.key === 'password' ? 'col-span-2' : ''}>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
            <input
              type={f.type}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              placeholder={f.placeholder}
              value={creds[f.key] || ''}
              onChange={(e) => setCreds((prev) => ({ ...prev, [f.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {/* Feedback */}
      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
      {success && (
        <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
          <Check size={12} /> {success}
        </div>
      )}

      <button
        onClick={handleTest}
        disabled={testing}
        className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2"
      >
        <Plug size={14} />
        {testing ? 'Probando conexión...' : 'Probar conexión'}
      </button>

      <p className="text-xs text-gray-400 mt-2">Las credenciales se encriptan (AES-256) antes de guardarse. Nunca se exponen al frontend.</p>
    </div>
  );
};

// ── Main Component ────────────────────────────────
const Module1DataSource = () => {
  const { project, saveModule } = useProject();
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'cloud'
  const [tables, setTables] = useState(project?.modules?.[1]?.data?.tables || []);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null); // { headers, rows, columns }
  const [parsing, setParsing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(null);
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: 'array', cellDates: true });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        if (jsonData.length < 2) {
          setParsing(false);
          return;
        }

        const headers = jsonData[0].map((h) => String(h ?? '').trim());
        const dataRows = jsonData.slice(1).filter((r) => r.some((v) => v !== null));
        const sampleRows = dataRows.slice(0, 5);

        // Detect column types from all available data rows (up to 50)
        const typeRows = dataRows.slice(0, 50);
        const columns = headers.map((h, i) => ({
          name: h,
          type: inferType(typeRows.map((r) => r[i])),
          description: '',
        }));

        const tableName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-ZÀ-ÿ0-9 _\-]/g, '');
        const newTable = {
          name: tableName,
          columns,
          is_fact_table: false,
          sample_rows: sampleRows,
        };

        setTables((prev) => {
          // Replace table with same name if it exists
          const exists = prev.findIndex((t) => t.name === tableName);
          if (exists >= 0) {
            const updated = [...prev];
            updated[exists] = newTable;
            return updated;
          }
          return [...prev, newTable];
        });

        setPreview({ headers, rows: sampleRows, columns });
      } catch (err) {
        console.error('Error parsing file:', err);
      } finally {
        setParsing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = () => {
    saveModule(1, { tables, source_type: activeTab === 'cloud' ? 'cloud' : 'file' });
  };

  const handleCloudConnected = (cloudTables) => {
    setTables((prev) => {
      const existing = new Set(prev.map((t) => t.name));
      const newTables = cloudTables.filter((t) => !existing.has(t.name));
      return [...prev, ...newTables];
    });
    // Show preview of first cloud table
    const first = cloudTables[0];
    if (first) {
      const headers = first.columns.map((c) => c.name);
      setPreview({ headers, rows: first.sample_rows || [], columns: first.columns });
    }
  };

  const toggleFactTable = (idx, value) => {
    setTables((prev) => prev.map((t, i) => ({ ...t, is_fact_table: i === idx ? value : false })));
  };

  const removeTable = (idx) => {
    setTables((prev) => prev.filter((_, i) => i !== idx));
    setPreview(null);
  };

  const factTable = tables.find((t) => t.is_fact_table);
  const dims = tables.filter((t) => !t.is_fact_table);

  return (
    <div className="flex gap-5 items-start">
    {/* ── Left: form ── */}
    <div className="flex-1 min-w-0">
      {/* Module header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', color: '#F2C811' }}>
          <Database size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Módulo 1 — Fuente de Datos</h2>
          <p className="text-xs text-gray-500 mt-0.5">Sube tus archivos y define las tablas del modelo.</p>
        </div>
      </div>

      {/* Source tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('file')}
          className={`flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 border-b-2 transition-colors ${activeTab === 'file' ? 'border-yellow-400 text-yellow-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Upload size={14} /> Subir archivo
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 border-b-2 transition-colors ${activeTab === 'cloud' ? 'border-yellow-400 text-yellow-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Cloud size={14} /> Conectar a la nube
        </button>
      </div>

      {/* Cloud connection form */}
      {activeTab === 'cloud' && project?.id && (
        <div className="mb-6">
          <CloudForm projectId={project.id} onConnected={handleCloudConnected} />
        </div>
      )}

      {/* Upload area */}
      {activeTab === 'file' && (
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Upload size={24} color="#F2C811" strokeWidth={1.75} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3">Arrastra archivos o haz clic para seleccionar</p>
        <p className="text-xs text-gray-400 mb-4">CSV, Excel (.xlsx, .xls), JSON</p>
        <label className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2 rounded-lg">
          {parsing ? 'Procesando...' : 'Seleccionar archivo'}
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            className="hidden"
            onChange={handleFileUpload}
            disabled={parsing}
          />
        </label>
        {fileName && !parsing && (
          <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
            <Check size={12} /> {fileName}
          </p>
        )}
      </div>
      )} {/* end activeTab === 'file' */}

      {/* Data Preview */}
      {preview && (
        <DataPreview headers={preview.headers} rows={preview.rows} columns={preview.columns} />
      )}

      {/* Tables */}
      {tables.length > 0 && (
        <div className="space-y-3 mt-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700">
            Tablas detectadas
            <span className="ml-2 text-xs font-normal text-gray-400">({tables.length})</span>
          </h3>
          {tables.map((table, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm text-gray-800">{table.name}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={table.is_fact_table}
                      onChange={(e) => toggleFactTable(i, e.target.checked)}
                    />
                    Tabla de hechos
                  </label>
                  <button
                    onClick={() => removeTable(i)}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(table.columns || []).map((col, j) => (
                  <span key={j} className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 py-0.5 text-xs text-gray-600">
                    {col.name}
                    <TypeBadge type={col.type} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={tables.length === 0 || parsing}
        className="mt-6 px-6 py-2.5 rounded-lg font-bold text-sm disabled:opacity-40 transition-all hover:-translate-y-px"
        style={{ background: 'linear-gradient(90deg,#F2C811,#FCD34D)', color: '#09090B', boxShadow: '0 2px 8px rgba(242,200,17,.3)' }}
      >
        Guardar y continuar →
      </button>
    </div>{/* end left form */}

    {/* ── Right: summary panel ── */}
    <div style={{
      width: 260, flexShrink: 0,
      background: '#0D1117',
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      alignSelf: 'flex-start',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <ClipboardList size={14} color="#F2C811" strokeWidth={1.75} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>Resumen — Datos</span>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { label: 'Formato',          val: fileName ? fileName.split('.').pop().toUpperCase() : '—', color: '#F2C811' },
          { label: 'Tablas',           val: tables.length > 0 ? `${tables.length} detectadas` : '—', color: '#F2C811' },
          { label: 'Tabla de hechos',  val: factTable?.name || '—', color: '#60A5FA' },
          { label: 'Dimensiones',      val: dims.length > 0 ? dims.map((d) => d.name).join(' · ') : '—', color: '#60A5FA' },
          { label: 'Relaciones',       val: dims.length > 0 ? `${dims.length} definida${dims.length !== 1 ? 's' : ''}` : '—', color: '#F2C811' },
          { label: 'Tabla de fechas',  val: tables.some((t) => /date|fecha/i.test(t.name)) ? '✓ Auto-generada' : '—',
            color: tables.some((t) => /date|fecha/i.test(t.name)) ? '#34D399' : '#64748B' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748B', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color, textAlign: 'right' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Module1DataSource;
