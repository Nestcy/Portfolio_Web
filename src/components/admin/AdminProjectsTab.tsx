import React, { useState } from 'react';
import { Project } from '../../types';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Plus,
  Upload,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Github,
  Youtube,
  Star,
  CheckCircle2,
  Layers,
  Copy,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { ProjectEditorModal } from './ProjectEditorModal';
import { ProjectUploadModal } from './ProjectUploadModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { processImageFile } from '../../utils/imageUtils';

export const AdminProjectsTab: React.FC = () => {
  const { projects, deleteProject, updateProject, addProject, securitySettings } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const categories = ['All', 'RAG', 'Multi-Agent', 'LLM Platform', 'MLOps', 'Edge AI'];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleQuickImageUpload = async (projectId: string, file: File) => {
    try {
      const dataUrl = await processImageFile(file);
      updateProject(projectId, { coverImage: dataUrl });
      showNotification('Project cover image updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process image';
      showNotification(`Upload error: ${msg}`);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleDuplicate = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `project-${Date.now()}`,
      slug: `${project.slug}-copy`,
      title: `${project.title} (Copy)`,
      featured: false,
    };
    addProject(duplicated);
    showNotification(`Cloned "${project.title}" successfully`);
  };

  const handleExportSingleJSON = (project: Project) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.slug || 'project'}-spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification(`Exported ${project.slug}-spec.json`);
  };

  const handleDeleteTrigger = (project: Project) => {
    if (securitySettings?.requireConfirmationForDeletions) {
      setProjectToDelete(project);
    } else {
      executeDelete(project);
    }
  };

  const executeDelete = (project: Project) => {
    deleteProject(project.id);
    showNotification(`Deleted "${project.title}" successfully`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-[#ff4d00]/10 border border-[#ff4d00]/40 text-[#ff4d00] text-xs flex items-center space-x-2 font-mono shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0a0a0a] border border-[#f0f0f0]/20">
        <div>
          <div className="label-tech text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">
            // Artifact Registry
          </div>
          <h2 className="text-lg font-syne font-bold text-white uppercase tracking-tight flex items-center space-x-2">
            <span>AI Project Artifacts ({projects.length})</span>
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Architect, configure, benchmark, and deploy deep technical system case studies.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 bg-transparent hover:bg-zinc-900 border border-[#f0f0f0]/30 text-zinc-200 text-xs font-bold flex items-center space-x-1.5 transition-colors uppercase"
          >
            <Upload className="w-3.5 h-3.5 text-[#ff4d00]" />
            <span>Import / Spec</span>
          </button>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="px-4 py-2 bg-[#ff4d00] hover:bg-[#ff6622] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors uppercase tracking-wider border border-[#ff4d00]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, stack, or problem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0a0a0a] border border-[#f0f0f0]/20 text-zinc-200 placeholder-zinc-600 text-xs focus:outline-none focus:border-[#ff4d00] transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1">
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
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-800 bg-[#0a0a0a]/40 space-y-3 font-mono">
          <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="text-sm font-bold text-white uppercase">No Projects Found</div>
          <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
            Try adjusting your search criteria or click "Add Project" / "Import" to create a new artifact.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-5 bg-[#0a0a0a] border border-[#f0f0f0]/20 hover:border-[#ff4d00]/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[9px] uppercase bg-zinc-950 border border-zinc-800 text-[#ff4d00] font-bold">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="px-2 py-0.5 text-[9px] uppercase bg-[#ff4d00]/10 border border-[#ff4d00]/40 text-[#ff4d00] font-bold flex items-center space-x-1">
                        <Star className="w-2.5 h-2.5 fill-[#ff4d00] text-[#ff4d00]" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-zinc-400">
                    <button
                      onClick={() => handleExportSingleJSON(project)}
                      className="p-1.5 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                      title="Export Project JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(project)}
                      className="p-1.5 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                      title="Clone / Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-1.5 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                      title="Edit / Refine Details"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrigger(project)}
                      className="p-1.5 hover:text-red-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Project Cover Image with Quick Upload */}
                <div className="relative group/cover w-full h-32 bg-zinc-950 border border-zinc-800/90 rounded overflow-hidden flex items-center justify-center">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 space-y-1">
                      <ImageIcon className="w-5 h-5 text-zinc-700" />
                      <span className="text-[10px] font-mono uppercase">No Cover Image</span>
                    </div>
                  )}

                  {/* Quick Upload Hover Overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <label className="px-2.5 py-1.5 bg-[#ff4d00] hover:bg-[#ff5e1a] text-black text-[10px] font-mono font-bold uppercase rounded flex items-center space-x-1 cursor-pointer transition-colors shadow">
                      <Upload className="w-3 h-3" />
                      <span>{project.coverImage ? 'Upload / Replace Cover' : 'Upload Cover'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleQuickImageUpload(project.id, f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-syne font-bold text-lg text-white tracking-tight leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2 mt-1 leading-relaxed">
                    {project.subtitle || project.description}
                  </p>
                </div>

                {/* Metrics Badges */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 font-mono">
                    {project.metrics.slice(0, 3).map((m, idx) => (
                      <div key={idx} className="p-2 bg-zinc-950/80 border border-zinc-800/80">
                        <div className="text-[9px] text-zinc-500 uppercase truncate">{m.label}</div>
                        <div className="text-xs font-bold text-[#ff4d00] truncate">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1 font-mono">
                  {project.technologies.slice(0, 5).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 text-zinc-400 text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="px-1.5 py-0.5 text-[9px] text-zinc-600">
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Controls */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center space-x-2 text-zinc-400">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white flex items-center space-x-1"
                    >
                      <Github className="w-3 h-3" />
                      <span className="text-[10px]">Code</span>
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-[10px]">Demo</span>
                    </a>
                  )}
                  {project.videoDemoUrl && (
                    <a
                      href={project.videoDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ff4d00] flex items-center space-x-1"
                    >
                      <Youtube className="w-3 h-3 text-[#ff4d00]" />
                      <span className="text-[10px]">Video</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      updateProject(project.id, { featured: !project.featured });
                      showNotification(`Project marked as ${!project.featured ? 'Featured' : 'Standard'}`);
                    }}
                    className={`px-2 py-0.5 text-[10px] uppercase border transition-colors ${
                      project.featured
                        ? 'border-[#ff4d00] text-[#ff4d00]'
                        : 'border-zinc-800 text-zinc-500 hover:text-white'
                    }`}
                  >
                    {project.featured ? 'Featured ★' : 'Feature'}
                  </button>

                  <button
                    onClick={() => setEditingProject(project)}
                    className="px-3 py-1 bg-white hover:bg-zinc-200 text-black text-[10px] uppercase font-bold transition-colors"
                  >
                    Edit Artifact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {(editingProject || isCreatingNew) && (
        <ProjectEditorModal
          project={editingProject}
          isNew={isCreatingNew}
          onClose={() => {
            setEditingProject(null);
            setIsCreatingNew(false);
          }}
          onDelete={(projectToDeleteFromEditor) => {
            setEditingProject(null);
            handleDeleteTrigger(projectToDeleteFromEditor);
          }}
          onSave={(savedProject) => {
            if (isCreatingNew) {
              addProject(savedProject);
              showNotification(`Created "${savedProject.title}" successfully`);
            } else {
              updateProject(savedProject.id, savedProject);
              showNotification(`Updated "${savedProject.title}" successfully`);
            }
            setEditingProject(null);
            setIsCreatingNew(false);
          }}
        />
      )}

      {/* Upload/Import JSON Modal */}
      {isUploadModalOpen && (
        <ProjectUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onImportProject={(importedProject) => {
            addProject(importedProject);
            showNotification(`Imported "${importedProject.title}" into catalog`);
            setIsUploadModalOpen(false);
          }}
        />
      )}

      {/* Reusable Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(projectToDelete)}
        title={projectToDelete?.title || 'Project'}
        itemType="Project"
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (projectToDelete) {
            executeDelete(projectToDelete);
            setProjectToDelete(null);
          }
        }}
      />
    </div>
  );
};
