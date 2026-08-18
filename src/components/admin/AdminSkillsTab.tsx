import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillItem } from '../../types';
import {
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const AdminSkillsTab: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill, securitySettings } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<SkillItem | null>(null);

  const categories = [
    'All',
    'LLMs',
    'AI Agents',
    'Deep Learning',
    'Machine Learning',
    'Computer Vision',
    'Backend',
    'Databases',
    'Cloud',
    'DevOps',
    'Frontend'
  ];

  const [newSkill, setNewSkill] = useState<SkillItem>({
    name: '',
    category: 'LLMs',
    proficiency: 95,
    level: 'Expert',
    iconName: 'Cpu',
    yearsExperience: '4 yrs',
    description: 'Deep architectural experience and optimization.'
  });

  const [isAdding, setIsAdding] = useState(false);

  const filteredSkills = skills.filter(
    s => selectedCategory === 'All' || s.category === selectedCategory
  );

  const handleSaveNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    addSkill(newSkill);
    setNewSkill({
      name: '',
      category: 'LLMs',
      proficiency: 90,
      level: 'Expert',
      iconName: 'Cpu',
      yearsExperience: '3 yrs',
      description: ''
    });
    setIsAdding(false);
  };

  const handleDeleteTrigger = (skill: SkillItem) => {
    if (securitySettings?.requireConfirmationForDeletions) {
      setSkillToDelete(skill);
    } else {
      deleteSkill(skill.name);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0a0a0a] border border-[#f0f0f0]/20">
        <div>
          <div className="label-tech text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">
            // Core Competencies
          </div>
          <h2 className="text-lg font-syne font-bold text-white uppercase tracking-tight flex items-center space-x-2">
            <span>Skill Matrix & Proficiency ({skills.length})</span>
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Adjust proficiency metrics, experience timelines, categories, and deep architectural summaries.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#ff4d00] hover:bg-[#ff6622] text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors uppercase tracking-wider border border-[#ff4d00]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Close Form' : 'Add Technical Skill'}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1 font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-[10px] uppercase border transition-all ${
              selectedCategory === cat
                ? 'bg-[#ff4d00] text-white font-bold border-[#ff4d00]'
                : 'bg-transparent text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* New Skill Form Modal / Inset Drawer */}
      {isAdding && (
        <form onSubmit={handleSaveNewSkill} className="p-6 bg-[#0a0a0a] border-2 border-[#ff4d00]/60 space-y-4 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-syne font-bold text-white text-sm uppercase text-[#ff4d00]">Add Competency to Matrix</span>
            <button type="button" onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Skill / Framework Name</label>
              <input
                type="text"
                required
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g. PyTorch Kernel Fusion"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:border-[#ff4d00] focus:outline-none"
              />
            </div>

            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Category</label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:border-[#ff4d00] focus:outline-none"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-tech text-[10px] text-zinc-500 mb-1">Deep Architectural Description</label>
            <input
              type="text"
              value={newSkill.description || ''}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              placeholder="e.g. Custom CUDA kernels, FlashAttention-2 integrations, tensor parallelism."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-[#ff4d00] focus:outline-none font-sans text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff4d00] hover:bg-[#ff6622] text-white font-bold uppercase text-xs border border-[#ff4d00]"
            >
              Save Competency
            </button>
          </div>
        </form>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
        {filteredSkills.map((skill) => {
          const isEditing = editingSkillName === skill.name;
          return (
            <div
              key={skill.name}
              className="p-4 bg-[#0a0a0a] border border-[#f0f0f0]/20 hover:border-[#ff4d00]/60 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-syne font-bold text-sm text-white">{skill.name}</h4>
                  <div className="text-[10px] text-[#ff4d00] uppercase font-bold">{skill.category}</div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingSkillName(isEditing ? null : skill.name)}
                    className="p-1 hover:text-white text-zinc-400"
                    title="Edit Skill"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrigger(skill)}
                    className="p-1 hover:text-red-400 text-zinc-500"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-2 text-xs border-t border-zinc-800">
                  <input
                    type="text"
                    value={skill.description || ''}
                    onChange={(e) => updateSkill(skill.name, { description: e.target.value })}
                    placeholder="Deep architectural description..."
                    className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] font-sans"
                  />
                </div>
              ) : (
                skill.description && (
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-2">
                    {skill.description}
                  </p>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(skillToDelete)}
        title={skillToDelete?.name || 'Skill'}
        itemType="Skill"
        onClose={() => setSkillToDelete(null)}
        onConfirm={() => {
          if (skillToDelete) {
            deleteSkill(skillToDelete.name);
            setSkillToDelete(null);
          }
        }}
      />
    </div>
  );
};
