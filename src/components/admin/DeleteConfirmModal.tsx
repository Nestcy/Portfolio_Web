import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemType: string;
  itemTitle?: string;
  warningText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemType,
  itemTitle,
  warningText = "This action will immediately remove this artifact from the live portfolio and local database. This cannot be undone unless restored from a backup.",
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#0a0a0a] border-2 border-red-900/80 shadow-2xl overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-red-950/40 border-b border-red-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-400">
            <div className="p-1 bg-red-950 border border-red-800">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="font-syne font-bold text-sm text-white uppercase tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {itemTitle && (
            <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="label-tech text-[10px] text-zinc-500 uppercase">{itemType} to Delete:</div>
              <div className="text-sm font-bold text-white font-sans truncate">{itemTitle}</div>
            </div>
          )}

          <div className="flex items-start space-x-3 p-3 bg-red-950/20 border border-red-900/30 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans text-xs text-zinc-300">
              {warningText}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-[#0a0a0a] border-t border-zinc-800 flex items-center justify-end space-x-2 font-mono">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-transparent hover:bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs uppercase font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase flex items-center space-x-1.5 transition-colors border border-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
