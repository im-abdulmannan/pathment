'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Plus, X, Sparkles } from 'lucide-react';
import { skillApi, type Skill } from '@/lib/services/skill-api';
import { extractApiErrorMessage } from '@/lib/utils/api-error';

interface Picked { skillId: string; name: string; proficiencyLevel: number }

// Proficiency presented as 4 clear levels, stored as 1–100.
const LEVELS = [
  { value: 25, label: 'Beginner' },
  { value: 50, label: 'Intermediate' },
  { value: 75, label: 'Advanced' },
  { value: 100, label: 'Expert' },
];
const levelLabel = (n: number) => LEVELS.reduce((best, l) => (Math.abs(l.value - n) < Math.abs(best.value - n) ? l : best), LEVELS[0]).label;
const FIELD = 'px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm';

/**
 * Shared Skills editor for mentor/mentee Settings. Loads the skill catalog + the
 * user's current skills, lets them add (with a proficiency level) / remove, and
 * saves via the bulk-replace endpoint. Self-contained — no hook wiring needed.
 */
export function SkillsTab({ heading = 'Your skills', blurb = 'Add the skills you bring, with how strong you are at each.' }: { heading?: string; blurb?: string }) {
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [picked, setPicked] = useState<Picked[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toAdd, setToAdd] = useState('');
  const [addLevel, setAddLevel] = useState(50);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [allRes, mineRes] = await Promise.all([skillApi.listAll(), skillApi.mine()]);
        if (!active) return;
        const all: Skill[] = allRes?.data ?? allRes ?? [];
        const mineRaw: any[] = mineRes?.data ?? mineRes ?? [];
        setCatalog(all);
        setPicked(mineRaw.map((s) => ({
          skillId: s.id,
          name: s.name,
          proficiencyLevel: Number(s.proficiencyLevel ?? s.UserSkill?.proficiencyLevel ?? 50),
        })));
      } catch {
        toast.error('Could not load skills');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const available = useMemo(
    () => catalog.filter((s) => !picked.some((p) => p.skillId === s.id)).sort((a, b) => a.name.localeCompare(b.name)),
    [catalog, picked]
  );

  const add = () => {
    const skill = catalog.find((s) => s.id === toAdd);
    if (!skill) return;
    setPicked((p) => [...p, { skillId: skill.id, name: skill.name, proficiencyLevel: addLevel }]);
    setToAdd('');
    setAddLevel(50);
  };

  const save = async () => {
    try {
      setSaving(true);
      await skillApi.save(picked.map((p) => ({ skillId: p.skillId, proficiencyLevel: p.proficiencyLevel })));
      toast.success('Skills saved');
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Could not save skills'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" />{heading}</h2>
        <p className="text-slate-600 text-sm mt-1">{blurb}</p>
      </div>

      {/* Current skills */}
      {picked.length === 0 ? (
        <p className="text-sm text-slate-400 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">No skills yet — add your first below.</p>
      ) : (
        <div className="space-y-2">
          {picked.map((p, i) => (
            <div key={p.skillId} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5">
              <span className="flex-1 min-w-0 text-sm font-medium text-slate-800 truncate">{p.name}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">{levelLabel(p.proficiencyLevel)}</span>
              <select
                value={LEVELS.reduce((b, l) => (Math.abs(l.value - p.proficiencyLevel) < Math.abs(b.value - p.proficiencyLevel) ? l : b), LEVELS[0]).value}
                onChange={(e) => setPicked((prev) => prev.map((x, j) => (j === i ? { ...x, proficiencyLevel: Number(e.target.value) } : x)))}
                className={FIELD}
                aria-label={`${p.name} level`}
              >
                {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              <button type="button" onClick={() => setPicked((prev) => prev.filter((_, j) => j !== i))} aria-label={`Remove ${p.name}`} className="p-1.5 text-slate-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      {/* Add a skill */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
        <p className="text-xs font-medium text-slate-600 mb-2">Add a skill</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <select value={toAdd} onChange={(e) => setToAdd(e.target.value)} className={`${FIELD} flex-1`}>
            <option value="">{available.length ? 'Pick a skill…' : 'All catalog skills added'}</option>
            {available.map((s) => <option key={s.id} value={s.id}>{s.name}{s.category ? ` · ${s.category}` : ''}</option>)}
          </select>
          <select value={addLevel} onChange={(e) => setAddLevel(Number(e.target.value))} className={FIELD} aria-label="Proficiency">
            {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <button type="button" onClick={add} disabled={!toAdd} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-indigo-300 disabled:opacity-50">
            <Plus className="w-4 h-4" />Add
          </button>
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl transition-colors">
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}Save skills
      </button>
    </div>
  );
}

export default SkillsTab;
