import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';

const SECTOR_LABELS = { retail: '🛍️ Retail', finanzas: '💰 Finanzas', logistica: '🚚 Logística' };
const SECTOR_KEYS = ['retail', 'finanzas', 'logistica'];
const FORMATS = ['$ Moneda', '% Porcentaje', '# Número', '📅 Fecha'];
const AGGREGATIONS = ['SUM', 'AVG', 'COUNT', 'COUNTD', 'MAX', 'MIN', 'DIVIDE'];

const emptyForm = {
  sector: 'retail',
  name: '',
  description_template: '',
  format: '# Número',
  default_target: '',
  aggregation: 'SUM',
  keywords: '',
};

const AdminPanel = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState('retail');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/kpi-templates/admin');
      setTemplates(data);
    } catch {
      setError('Error cargando templates.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.description_template) {
      setError('Nombre y descripción son requeridos.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        default_target: form.default_target ? Number(form.default_target) : null,
        keywords: form.keywords ? form.keywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await api.put(`/kpi-templates/admin/${editingId}`, payload);
        setSuccess('Template actualizado.');
      } else {
        await api.post('/kpi-templates/admin', payload);
        setSuccess('Template creado.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadTemplates();
    } catch (err) {
      setError(err.response?.data?.error || 'Error guardando template.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (t) => {
    setForm({
      sector: t.sector,
      name: t.name,
      description_template: t.description_template,
      format: t.format,
      default_target: t.default_target ?? '',
      aggregation: t.aggregation,
      keywords: (t.keywords || []).join(', '),
    });
    setEditingId(t.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await api.delete(`/kpi-templates/admin/${id}`);
      setSuccess('Template eliminado.');
      await loadTemplates();
    } catch {
      setError('Error eliminando template.');
    }
  };

  const handleToggleApprove = async (id) => {
    try {
      const { data } = await api.patch(`/kpi-templates/admin/${id}/approve`);
      setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, is_approved: data.is_approved } : t)));
    } catch {
      setError('Error cambiando estado.');
    }
  };

  const filteredTemplates = templates.filter((t) => t.sector === activeSector);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-sm text-gray-500 mt-1">Gestión de KPI Templates por sector</p>
          </div>
          <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-700">← Volver al inicio</button>
        </div>

        {/* Feedback */}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            {editingId ? 'Editar Template' : 'Nuevo Template'}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Sector *</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                {SECTOR_KEYS.map(s => <option key={s} value={s}>{SECTOR_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre *</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Ej: Ventas Totales" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción *</label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Describe qué mide este KPI y cómo se calcula." value={form.description_template} onChange={e => setForm(f => ({ ...f, description_template: e.target.value }))} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Formato *</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Agregación</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.aggregation} onChange={e => setForm(f => ({ ...f, aggregation: e.target.value }))}>
                {AGGREGATIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Meta por defecto</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Ej: 1000000" value={form.default_target} onChange={e => setForm(f => ({ ...f, default_target: e.target.value }))} />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Keywords para mapeo automático <span className="font-normal text-gray-400">(separadas por coma)</span></label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Ej: venta, sale, amount, monto, total" value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} />
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg">
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear template'}
            </button>
            {editingId && (
              <button onClick={() => { setForm(emptyForm); setEditingId(null); }} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Template list */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Sector tabs */}
          <div className="flex border-b border-gray-200">
            {SECTOR_KEYS.map((s) => (
              <button key={s} onClick={() => setActiveSector(s)} className={`text-sm font-medium px-5 py-3 border-b-2 transition-colors ${activeSector === s ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {SECTOR_LABELS[s]} <span className="ml-1 text-xs text-gray-400">({templates.filter(t => t.sector === s).length})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-sm text-gray-400 py-12">Cargando...</div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-12">No hay templates en este sector.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Formato</th>
                  <th className="px-4 py-3 text-left">Agregación</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((t) => (
                  <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{t.name}</td>
                    <td className="px-4 py-3 text-gray-500">{t.format}</td>
                    <td className="px-4 py-3 text-gray-500">{t.aggregation}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {t.is_approved ? 'Aprobado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggleApprove(t.id)} className="text-xs text-gray-500 hover:text-gray-700 underline">
                          {t.is_approved ? 'Desaprobar' : 'Aprobar'}
                        </button>
                        <button onClick={() => handleEdit(t)} className="text-xs text-blue-600 hover:text-blue-800 underline">Editar</button>
                        <button onClick={() => handleDelete(t.id, t.name)} className="text-xs text-red-500 hover:text-red-700 underline">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
