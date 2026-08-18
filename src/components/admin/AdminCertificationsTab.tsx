import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certification } from '../../types';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  X,
  Check
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const AdminCertificationsTab: React.FC = () => {
  const { certifications, addCertification, updateCertification, deleteCertification, securitySettings } = usePortfolio();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Certification | null>(null);
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);

  const [newCert, setNewCert] = useState<Certification>({
    id: `cert-${Date.now()}`,
    title: '',
    institution: '',
    issueDate: '2026-02',
    credentialId: '',
    credentialUrl: 'https://',
    badgeImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    skillsVerified: ['Distributed LLMs', 'CUDA Optimization']
  });

  const [skillsInput, setSkillsInput] = useState('Distributed LLMs, CUDA Optimization');

  const handleStartEdit = (cert: Certification) => {
    setEditingCertId(cert.id);
    setEditForm({ ...cert });
  };

  const handleCancelEdit = () => {
    setEditingCertId(null);
    setEditForm(null);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editForm && editingCertId) {
      updateCertification(editingCertId, editForm);
      setEditingCertId(null);
      setEditForm(null);
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title.trim()) return;
    const formattedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    addCertification({
      ...newCert,
      skillsVerified: formattedSkills.length > 0 ? formattedSkills : ['AI Architecture']
    });
    setNewCert({
      id: `cert-${Date.now()}`,
      title: '',
      institution: '',
      issueDate: '2026-03',
      credentialId: '',
      credentialUrl: 'https://',
      badgeImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      skillsVerified: []
    });
    setSkillsInput('');
    setIsAdding(false);
  };

  const handleDeleteTrigger = (cert: Certification) => {
    if (securitySettings?.requireConfirmationForDeletions) {
      setCertToDelete(cert);
    } else {
      deleteCertification(cert.id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0a0a0a] border border-[#f0f0f0]/20">
        <div>
          <div className="label-tech text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">
            // Verified Credentials
          </div>
          <h2 className="text-lg font-syne font-bold text-white uppercase tracking-tight flex items-center space-x-2">
            <span>Verified AI Certifications ({certifications.length})</span>
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Manage industry certifications from NVIDIA, AWS, DeepLearning.AI, and Google Cloud.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            if (editingCertId) handleCancelEdit();
          }}
          className="px-4 py-2 bg-[#ff4d00] hover:bg-[#ff6622] text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors uppercase tracking-wider border border-[#ff4d00]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Close Form' : 'Add Certification'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAddCert} className="p-6 bg-[#0a0a0a] border-2 border-[#ff4d00]/60 space-y-4 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-syne font-bold text-white text-sm uppercase text-[#ff4d00]">Add Verified Credential</span>
            <button type="button" onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Certification Title *</label>
              <input
                type="text"
                value={newCert.title}
                onChange={(e) => setNewCert(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. NVIDIA Certified Specialist - LLMs"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-sans text-xs focus:border-[#ff4d00] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Issuing Institution *</label>
              <input
                type="text"
                value={newCert.institution}
                onChange={(e) => setNewCert(prev => ({ ...prev, institution: e.target.value }))}
                placeholder="e.g. NVIDIA Deep Learning Institute"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-sans text-xs focus:border-[#ff4d00] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Issue Date</label>
              <input
                type="text"
                value={newCert.issueDate}
                onChange={(e) => setNewCert(prev => ({ ...prev, issueDate: e.target.value }))}
                placeholder="e.g. 2026-03"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-[#ff4d00] font-mono text-xs focus:border-[#ff4d00] focus:outline-none"
              />
            </div>

            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Credential ID</label>
              <input
                type="text"
                value={newCert.credentialId || ''}
                onChange={(e) => setNewCert(prev => ({ ...prev, credentialId: e.target.value }))}
                placeholder="e.g. NV-DLI-99482"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs focus:border-[#ff4d00] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Verification URL</label>
              <input
                type="url"
                value={newCert.credentialUrl || ''}
                onChange={(e) => setNewCert(prev => ({ ...prev, credentialUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs focus:border-[#ff4d00] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Verified Skills (comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Distributed LLMs, CUDA Optimization, PyTorch"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs focus:border-[#ff4d00] focus:outline-none"
              />
            </div>
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
              Save Credential
            </button>
          </div>
        </form>
      )}

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {certifications.map((cert) => {
          const isEditing = editingCertId === cert.id;

          if (isEditing && editForm) {
            return (
              <form
                key={cert.id}
                onSubmit={handleSaveEdit}
                className="p-5 bg-[#0a0a0a] border-2 border-[#ff4d00]/70 space-y-3 flex flex-col justify-between font-mono text-xs animate-fade-in"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-syne font-bold text-[#ff4d00] text-xs uppercase flex items-center space-x-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editing Verified Credential</span>
                    </span>
                    <button type="button" onClick={handleCancelEdit} className="text-zinc-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Title *</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-white text-xs font-sans focus:border-[#ff4d00] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Institution *</label>
                        <input
                          type="text"
                          value={editForm.institution}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, institution: e.target.value } : null)}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-white text-xs font-sans focus:border-[#ff4d00] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Issue Date</label>
                        <input
                          type="text"
                          value={editForm.issueDate}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, issueDate: e.target.value } : null)}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-[#ff4d00] text-xs focus:border-[#ff4d00] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Credential ID</label>
                        <input
                          type="text"
                          value={editForm.credentialId || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, credentialId: e.target.value } : null)}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs focus:border-[#ff4d00] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Verification URL</label>
                        <input
                          type="url"
                          value={editForm.credentialUrl || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, credentialUrl: e.target.value } : null)}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs focus:border-[#ff4d00] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-0.5">Verified Skills (comma separated)</label>
                      <input
                        type="text"
                        value={editForm.skillsVerified ? editForm.skillsVerified.join(', ') : ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const skills = raw.split(',').map(s => s.trimStart());
                          setEditForm(prev => prev ? { ...prev, skillsVerified: skills } : null);
                        }}
                        onBlur={(e) => {
                          const raw = e.target.value;
                          const skills = raw.split(',').map(s => s.trim()).filter(Boolean);
                          setEditForm(prev => prev ? { ...prev, skillsVerified: skills } : null);
                        }}
                        placeholder="e.g. Distributed LLMs, CUDA Optimization"
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:border-[#ff4d00] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 border border-zinc-800 text-zinc-400 hover:text-white text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff6622] text-white font-bold text-xs uppercase border border-[#ff4d00] flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            );
          }

          return (
            <div
              key={cert.id}
              className="p-5 bg-[#0a0a0a] border border-[#f0f0f0]/20 hover:border-[#ff4d00]/60 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-syne font-bold text-base text-white">{cert.title}</h3>
                    <div className="text-xs text-[#ff4d00] uppercase font-bold mt-0.5">{cert.institution}</div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStartEdit(cert)}
                      className="p-1.5 hover:text-white text-zinc-400 hover:bg-zinc-800 rounded transition-colors"
                      title="Edit Credential"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrigger(cert)}
                      className="p-1.5 hover:text-red-400 text-zinc-500 hover:bg-zinc-800 rounded transition-colors"
                      title="Delete Credential"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-zinc-400">
                  <span>Issued: {cert.issueDate}</span>
                  {cert.credentialId && <span>&bull; ID: {cert.credentialId}</span>}
                </div>

                {cert.skillsVerified && cert.skillsVerified.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cert.skillsVerified.map((sk, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {cert.credentialUrl && (
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-zinc-500">Official Verification</span>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff4d00] hover:underline flex items-center space-x-1"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(certToDelete)}
        title={certToDelete?.title || 'Certification'}
        itemType="Certification"
        onClose={() => setCertToDelete(null)}
        onConfirm={() => {
          if (certToDelete) {
            deleteCertification(certToDelete.id);
            setCertToDelete(null);
          }
        }}
      />
    </div>
  );
};

