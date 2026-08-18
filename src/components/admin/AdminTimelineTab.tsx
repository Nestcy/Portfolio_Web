import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TimelineItem } from '../../types';
import {
  Calendar,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Search,
  Copy,
  ExternalLink,
  Briefcase,
  Trophy,
  BookOpen,
  ShieldCheck,
  Award,
  Sparkles,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

const parseTimelineYear = (yearStr: string): number => {
  if (!yearStr) return 0;
  const isPresent = /present|current|now/i.test(yearStr);
  const numbers = yearStr.match(/\d{4}/g);
  
  if (numbers && numbers.length > 0) {
    const start = parseInt(numbers[0], 10);
    return start * 1000 + (isPresent ? 999 : 0);
  }
  
  if (isPresent) {
    return 999999;
  }
  
  return 0;
};

export const AdminTimelineTab: React.FC = () => {
  const { timeline, addTimelineItem, updateTimelineItem, deleteTimelineItem, securitySettings } = usePortfolio();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // State for adding or editing
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [timelineToDelete, setTimelineToDelete] = useState<TimelineItem | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Form State
  const emptyForm: TimelineItem = {
    id: '',
    year: '2026',
    title: '',
    organization: '',
    type: 'Career',
    description: '',
    impact: '',
    skillsUsed: [],
    link: ''
  };

  const [formData, setFormData] = useState<TimelineItem>(emptyForm);
  const [skillsInput, setSkillsInput] = useState<string>('');

  const triggerNotification = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormData({
      ...emptyForm,
      id: `timeline-${Date.now()}`
    });
    setSkillsInput('');
    setIsAdding(true);
  };

  const handleOpenEditForm = (item: TimelineItem) => {
    setIsAdding(false);
    setEditingItem(item);
    setFormData({ ...item });
    setSkillsInput(item.skillsUsed ? item.skillsUsed.join(', ') : '');
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingItem(null);
    setFormData(emptyForm);
    setSkillsInput('');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const finalItem: TimelineItem = {
      ...formData,
      skillsUsed: parsedSkills
    };

    if (editingItem) {
      updateTimelineItem(editingItem.id, finalItem);
      triggerNotification(`Updated milestone: "${finalItem.title}"`);
    } else {
      addTimelineItem(finalItem);
      triggerNotification(`Added milestone: "${finalItem.title}"`);
    }

    handleCloseForm();
  };

  const handleDuplicate = (item: TimelineItem) => {
    const duplicated: TimelineItem = {
      ...item,
      id: `timeline-${Date.now()}`,
      title: `${item.title} (Copy)`
    };
    addTimelineItem(duplicated);
    triggerNotification(`Duplicated milestone: "${item.title}"`);
  };

  const handleDeleteTrigger = (item: TimelineItem) => {
    if (securitySettings?.requireConfirmationForDeletions) {
      setTimelineToDelete(item);
    } else {
      deleteTimelineItem(item.id);
      triggerNotification(`Deleted milestone: "${item.title}"`);
    }
  };

  // Filtered & Chronologically Sorted List
  const filteredTimeline = timeline
    .filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'All' || item.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const yearA = parseTimelineYear(a.year);
      const yearB = parseTimelineYear(b.year);
      return sortDirection === 'desc' ? yearB - yearA : yearA - yearB;
    });

  const CATEGORY_OPTIONS: Array<TimelineItem['type']> = ['Career', 'Research', 'Hackathon', 'Certification', 'Achievement'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Career': return Briefcase;
      case 'Research': return BookOpen;
      case 'Hackathon': return Trophy;
      case 'Certification': return ShieldCheck;
      case 'Achievement': return Award;
      default: return Award;
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Toast Notification */}
      {savedNotification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center justify-between font-mono animate-fade-in shadow-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs">{savedNotification}</span>
          </div>
          <span className="text-[10px] text-emerald-500 uppercase">// PERSISTED TO MEMORY</span>
        </div>
      )}

      {/* Top Header & Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161514] border border-[#2a2826]">
        <div>
          <div className="flex items-center space-x-2 text-[#ff4d00] font-bold">
            <Calendar className="w-4 h-4" />
            <h2 className="font-syne uppercase text-sm tracking-wider">Career Timeline & Track Record Manager</h2>
          </div>
          <p className="text-[11px] text-zinc-400 font-geist mt-0.5">
            Add, update, or reorganize career roles, hackathon championships, publications, and milestone telemetry.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isAdding || editingItem) {
              handleCloseForm();
            } else {
              handleOpenAddForm();
            }
          }}
          className="px-4 py-2 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-bold font-mono text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors border border-[#ff4d00] shrink-0"
        >
          {isAdding || editingItem ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add New Milestone</span>
            </>
          )}
        </button>
      </div>

      {/* ADD / EDIT FORM DRAWER */}
      {(isAdding || editingItem) && (
        <form onSubmit={handleSaveForm} className="p-5 bg-[#161514]/90 border-2 border-[#ff4d00] space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#2a2826] pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#ff4d00]" />
              <span className="font-syne font-bold text-white text-sm uppercase">
                {editingItem ? `Edit Milestone: "${editingItem.title}"` : '// ADD_NEW_CAREER_MILESTONE'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCloseForm}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Year / Duration */}
            <div>
              <label className="label-tag text-[#ff4d00] mb-1">Year / Timeline Range *</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="e.g. 2026 - Present"
                className="tactical-input text-xs text-[#ff4d00] font-bold"
                required
              />
            </div>

            {/* Title */}
            <div>
              <label className="label-tag mb-1">Milestone / Role Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Lead AI Systems Architect"
                className="tactical-input text-xs font-sans text-white font-bold"
                required
              />
            </div>

            {/* Organization */}
            <div>
              <label className="label-tag mb-1">Organization / Institution</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g. Google Cloud & Anthropic"
                className="tactical-input text-xs font-sans text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="label-tag mb-1">Category Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="tactical-input text-xs bg-[#0d0c0b] text-white"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="label-tag mb-1">Milestone Description & Role Summary</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detail your responsibilities, technical leadership, architectures shipped, or research findings..."
              className="tactical-input text-xs font-sans text-zinc-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Impact Highlight */}
            <div>
              <label className="label-tag text-emerald-400 mb-1">Key Impact Metric / Highlight</label>
              <input
                type="text"
                value={formData.impact || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                placeholder="e.g. Reduced vector search query latency from 240ms to 42ms for 10M vectors"
                className="tactical-input text-xs text-emerald-400 font-bold"
              />
            </div>

            {/* Skills / Tech Used */}
            <div>
              <label className="label-tag text-cyan-400 mb-1">Technologies & Skills Used (Comma-Separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. LangGraph, PyTorch, CUDA, vLLM, Qdrant"
                className="tactical-input text-xs text-cyan-300"
              />
            </div>

          </div>

          {/* Optional Reference Link */}
          <div>
            <label className="label-tag text-zinc-400 mb-1">Reference Link / Paper URL (Optional)</label>
            <input
              type="url"
              value={formData.link || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://github.com/or-arxiv-link..."
              className="tactical-input text-xs text-zinc-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-[#2a2826]">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 border border-[#2a2826] bg-[#0d0c0b] text-zinc-400 hover:text-white uppercase text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-bold uppercase text-xs tracking-wider transition-colors border border-[#ff4d00]"
            >
              {editingItem ? 'Save Milestone Changes' : 'Publish Milestone'}
            </button>
          </div>
        </form>
      )}

      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="p-4 bg-[#161514] border border-[#2a2826] flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title, org, year..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d0c0b] border border-[#2a2826] text-white text-xs focus:border-[#ff4d00] focus:outline-none"
          />
        </div>

        {/* Category Pills & Chronological Sort Toggle */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-2.5 py-1 bg-[#0d0c0b] text-[#ff4d00] hover:bg-[#ff4d00] hover:text-[#0d0c0b] border border-[#ff4d00]/50 text-[10px] font-bold uppercase transition-colors flex items-center space-x-1 shrink-0"
            title="Toggle Chronological Sort Order"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>{sortDirection === 'asc' ? 'Chronological (Past → Present)' : 'Reverse (Present → Past)'}</span>
          </button>

          <span className="text-[10px] text-zinc-500 uppercase mx-1 flex items-center space-x-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Type:</span>
          </span>
          {['All', ...CATEGORY_OPTIONS].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors whitespace-nowrap ${
                filterType === cat
                  ? 'bg-[#ff4d00] text-[#0d0c0b]'
                  : 'bg-[#0d0c0b] text-zinc-400 hover:text-white border border-[#2a2826]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* TIMELINE LISTING */}
      <div className="space-y-3 font-mono">
        {filteredTimeline.length === 0 ? (
          <div className="p-8 text-center bg-[#161514] border border-[#2a2826] text-zinc-500 space-y-2">
            <p className="uppercase text-xs font-bold">// NO_MATCHING_MILESTONES_FOUND</p>
            <p className="text-[11px] font-geist">Try adjusting your search query or category filters.</p>
          </div>
        ) : (
          filteredTimeline.map((item) => {
            const IconComp = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                className="p-4 bg-[#161514]/70 border border-[#2a2826] hover:border-[#ff4d00]/60 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a2826] pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#0d0c0b] border border-[#ff4d00]/50 text-[#ff4d00] font-bold text-xs">
                      {item.year}
                    </span>
                    <div className="flex items-center space-x-1.5 text-white font-syne font-bold text-sm">
                      <IconComp className="w-4 h-4 text-[#ff4d00]" />
                      <span>{item.title}</span>
                    </div>
                    {item.organization && (
                      <>
                        <span className="text-zinc-600">&bull;</span>
                        <span className="text-zinc-400 font-geist text-xs">{item.organization}</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-[#0d0c0b] border border-[#2a2826] text-[10px] text-zinc-400 uppercase font-bold">
                      {item.type}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenEditForm(item)}
                      title="Edit Milestone"
                      className="p-1.5 bg-[#0d0c0b] hover:bg-[#ff4d00] text-zinc-400 hover:text-[#0d0c0b] border border-[#2a2826] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(item)}
                      title="Duplicate Milestone"
                      className="p-1.5 bg-[#0d0c0b] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#2a2826] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTrigger(item)}
                      title="Delete Milestone"
                      className="p-1.5 bg-[#0d0c0b] hover:bg-red-950 text-zinc-500 hover:text-red-400 border border-[#2a2826] hover:border-red-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 font-geist leading-relaxed">
                  {item.description}
                </p>

                {/* Impact Highlight */}
                {item.impact && (
                  <div className="p-2.5 bg-[#0d0c0b] border border-emerald-900/50 text-xs text-emerald-400 flex items-center space-x-2 font-geist">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="font-mono text-[10px] text-zinc-400 uppercase">Impact //</strong> {item.impact}</span>
                  </div>
                )}

                {/* Skill Chips */}
                {item.skillsUsed && item.skillsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skillsUsed.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-[#0d0c0b] border border-[#2a2826] text-[10px] text-zinc-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reference Link */}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[10px] text-[#ff4d00] hover:underline"
                  >
                    <span>View Milestone Artifact / Paper</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(timelineToDelete)}
        title={timelineToDelete?.title || 'Timeline Item'}
        itemType="Timeline Item"
        onClose={() => setTimelineToDelete(null)}
        onConfirm={() => {
          if (timelineToDelete) {
            deleteTimelineItem(timelineToDelete.id);
            triggerNotification(`Deleted milestone: "${timelineToDelete.title}"`);
            setTimelineToDelete(null);
          }
        }}
      />

    </div>
  );
};
