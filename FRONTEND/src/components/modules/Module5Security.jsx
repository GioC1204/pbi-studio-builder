import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Globe, User, Building2, Tag, Map, Pencil, Eye, Lock } from 'lucide-react';

const CRITERIA = [
  { id: 'region',      Icon: Globe,     label: 'Región' },
  { id: 'seller',      Icon: User,      label: 'Vendedor' },
  { id: 'department',  Icon: Building2, label: 'Departamento' },
  { id: 'category',    Icon: Tag,       label: 'Categoría' },
  { id: 'country',     Icon: Map,       label: 'País' },
  { id: 'custom',      Icon: Pencil,    label: 'Otro...' },
];

const PROFILE_ACCENT_COLORS = ['#F2C811', '#3B82F6', '#10B981', '#F2C811', '#8B5CF6', '#F59E0B', '#3B82F6'];

const AccessPreview = ({ profile, criterion }) => {
  if (profile.all_access) {
    return (
      <div className="mt-2 bg-surface-50 border border-surface-100 rounded-lg px-3 py-2 text-xs text-surface-600 leading-relaxed">
        <strong className="text-surface-900 inline-flex items-center gap-1"><User size={11} strokeWidth={2} />director@empresa.com</strong> → verá <strong className="text-surface-900">todos los datos</strong><br />
        <span className="text-surface-400">Sin filtros aplicados</span>
      </div>
    );
  }
  return (
    <div className="mt-2 bg-surface-50 border border-surface-100 rounded-lg px-3 py-2 text-xs text-surface-600 leading-relaxed">
      <strong className="text-surface-900 inline-flex items-center gap-1"><User size={11} strokeWidth={2} />ana@empresa.com</strong> → verá solo sus datos de <strong className="text-surface-900">{criterion}</strong><br />
      <span className="text-brand-600 font-medium text-2xs">✨ POLARIS asignará automáticamente según el correo del usuario</span>
    </div>
  );
};

const ProfileCard = ({ profile, criterion, idx, onChange, onRemove }) => (
  <div className="border border-surface-200 rounded-xl overflow-hidden mb-3 transition-shadow hover:shadow-card animate-fade-in">
    {/* Header */}
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-50 border-b border-surface-100">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${PROFILE_ACCENT_COLORS[idx % PROFILE_ACCENT_COLORS.length]}20` }}>
        <User size={15} color={PROFILE_ACCENT_COLORS[idx % PROFILE_ACCENT_COLORS.length]} strokeWidth={2} />
      </div>
      <input
        className="flex-1 text-sm font-semibold text-surface-900 bg-transparent border-none outline-none"
        placeholder="Nombre del perfil..."
        value={profile.name}
        onChange={e => onChange('name', e.target.value)}
      />
      <button onClick={onRemove} className="text-surface-300 hover:text-surface-600 text-lg leading-none">×</button>
    </div>

    {/* Body */}
    <div className="p-4">
      <div className="mb-1">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-surface-700">
          <input
            type="checkbox"
            className="accent-yellow-400"
            checked={profile.all_access || false}
            onChange={e => onChange('all_access', e.target.checked)}
          />
          Este perfil puede ver <strong>todos los datos</strong> sin restricción
        </label>
      </div>

      {!profile.all_access && (
        <div className="mt-3 animate-fade-in">
          <label className="label">Este perfil solo puede ver datos de su propia:</label>
          <select
            className="input mt-1"
            style={{ maxWidth: '220px' }}
            value={profile.filter_column || criterion}
            onChange={e => onChange('filter_column', e.target.value)}
          >
            {CRITERIA.filter(c => c.id !== 'custom').map(c => (
              <option key={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      )}

      <AccessPreview profile={profile} criterion={profile.filter_column || criterion} />
    </div>
  </div>
);

const Module4Security = () => {
  const { project, saveModule } = useProject();
  const defaults = project?.modules?.[4]?.data || {};

  const [accessType, setAccessType] = useState(defaults.access_type || 'all');
  const [criterion, setCriterion] = useState(defaults.criterion || 'Región');
  const [profiles, setProfiles] = useState(defaults.profiles || [
    { name: 'Gerente Regional', all_access: false, filter_column: 'Región' },
    { name: 'Director General', all_access: true, filter_column: '' },
  ]);

  const addProfile = () =>
    setProfiles(prev => [...prev, { name: '', all_access: false, filter_column: criterion }]);

  const updateProfile = (idx, field, val) =>
    setProfiles(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));

  const removeProfile = (idx) =>
    setProfiles(prev => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    // Build RLS roles for POLARIS (hidden from user)
    const roles = profiles
      .filter(p => !p.all_access && p.name)
      .map(p => ({
        name: p.name.replace(/\s/g, ''),
        filter_table: criterion,
        filter_expression: `[${p.filter_column || criterion}] = USERNAME()`,
      }));
    saveModule(4, { access_type: accessType, criterion, profiles, rls_enabled: accessType === 'filtered', roles });
  };

  return (
    <div style={{ maxWidth: '580px' }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-surface-950">Módulo 4 — Control de Acceso</h2>
        <p className="text-sm text-surface-500 mt-1">Define quién puede ver qué información en tu dashboard.</p>
      </div>

      {/* PASO 1 */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-5 h-5 rounded-full bg-brand-400 text-surface-950 text-2xs font-bold flex items-center justify-center flex-shrink-0">1</div>
        <p className="text-xs font-semibold text-surface-700 uppercase tracking-wide">¿Todos ven la misma información?</p>
      </div>

      {[
        { id: 'all',      Icon: Eye,  title: 'Sí, todos ven todo', desc: 'El dashboard muestra los mismos datos a cualquier persona que lo abra.' },
        { id: 'filtered', Icon: Lock, title: 'No, cada persona ve solo sus datos', desc: 'Un gerente de región verá solo su región. Un vendedor solo sus ventas.' },
      ].map(opt => (
        <div
          key={opt.id}
          onClick={() => setAccessType(opt.id)}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all mb-2 ${
            accessType === opt.id
              ? 'border-brand-400 bg-brand-50'
              : 'border-surface-100 bg-white hover:border-surface-300 hover:-translate-y-px'
          }`}
          style={{ boxShadow: accessType === opt.id ? '0 2px 8px rgba(242,200,17,.15)' : undefined }}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: accessType === opt.id ? 'rgba(242,200,17,0.15)' : '#F4F4F5' }}>
            <opt.Icon size={20} color={accessType === opt.id ? '#F2C811' : '#A1A1AA'} strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-surface-900">{opt.title}</p>
            <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{opt.desc}</p>
          </div>
          <div className={`w-4.5 h-4.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
            accessType === opt.id ? 'border-brand-500 bg-brand-400' : 'border-surface-200'
          }`}>
            {accessType === opt.id && <span className="w-2 h-2 rounded-full bg-surface-950 block" />}
          </div>
        </div>
      ))}

      {/* PASO 2 + 3 — animated in */}
      {accessType === 'filtered' && (
        <div className="animate-slide-up">
          {/* PASO 2 */}
          <div className="flex items-center gap-2.5 mt-5 mb-3">
            <div className="w-5 h-5 rounded-full bg-brand-400 text-surface-950 text-2xs font-bold flex items-center justify-center flex-shrink-0">2</div>
            <p className="text-xs font-semibold text-surface-700 uppercase tracking-wide">¿Por qué criterio filtrar?</p>
          </div>
          <p className="text-xs text-surface-400 mb-2">Selecciona la columna que define a quién pertenece cada dato:</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {CRITERIA.map(c => (
              <button
                key={c.id}
                onClick={() => setCriterion(c.label)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-center ${
                  criterion === c.label
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-surface-100 bg-white hover:border-surface-300'
                }`}
              >
                <c.Icon size={20} color={criterion === c.label ? '#F2C811' : '#A1A1AA'} strokeWidth={1.75} />
                <span className={`text-2xs font-semibold ${criterion === c.label ? 'text-brand-600' : 'text-surface-600'}`}>
                  {c.label}
                </span>
              </button>
            ))}
          </div>

          {/* PASO 3 */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-5 h-5 rounded-full bg-brand-400 text-surface-950 text-2xs font-bold flex items-center justify-center flex-shrink-0">3</div>
            <p className="text-xs font-semibold text-surface-700 uppercase tracking-wide">Define los perfiles de acceso</p>
          </div>
          <p className="text-xs text-surface-400 mb-3">
            Cada perfil agrupa personas que ven los mismos datos. POLARIS configurará la seguridad automáticamente.
          </p>

          {profiles.map((p, idx) => (
            <ProfileCard
              key={idx}
              profile={p}
              criterion={criterion}
              idx={idx}
              onChange={(f, v) => updateProfile(idx, f, v)}
              onRemove={() => removeProfile(idx)}
            />
          ))}

          <button
            onClick={addProfile}
            className="btn-secondary w-full justify-center mt-1"
            style={{ borderStyle: 'dashed' }}
          >
            + Agregar otro perfil
          </button>
        </div>
      )}

      <button onClick={handleSave} className="btn-primary mt-6">
        Guardar y continuar →
      </button>
    </div>
  );
};

export default Module4Security;
