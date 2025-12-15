import { FileText, Download, ExternalLink, MoreVertical, Pencil, Trash2, History, X } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '../ui';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ImagePreview = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity object-cover"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setIsOpen(false)}>
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  );
};

const VideoPreview = ({ src }) => (
  <video src={src} controls className="max-w-full max-h-48 rounded-lg" preload="metadata">
    Your browser does not support the video tag.
  </video>
);

const DocumentPreview = ({ attachment }) => {
  const { path, name, size } = attachment;
  const [downloading, setDownloading] = useState(false);
  
  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (downloading) return;
    
    setDownloading(true);
    const token = localStorage.getItem('token');
    const filePath = path.replace('attachments/', '');
    const downloadUrl = `${API_URL}/download/${filePath}`;
    
    try {
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors w-full text-left ${downloading ? 'opacity-70 cursor-wait' : ''}`}
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-[var(--accent-primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-sm">{name}</p>
        {size && <p className="text-xs text-[var(--text-muted)]">{formatSize(size)}</p>}
      </div>
      {downloading ? (
        <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : (
        <Download className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
      )}
    </button>
  );
};

const UrlPreview = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    className="flex items-center gap-2 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--accent-primary)] group">
    <ExternalLink className="w-4 h-4 flex-shrink-0" />
    <span className="truncate text-sm underline group-hover:no-underline">{url}</span>
  </a>
);

const AttachmentItem = ({ attachment }) => {
  const { type, url, name } = attachment;
  switch (type) {
    case 'image': return <ImagePreview src={url} alt={name || 'Image'} />;
    case 'video': return <VideoPreview src={url} />;
    case 'url': return <UrlPreview url={url} />;
    default: return <DocumentPreview attachment={attachment} />;
  }
};

const AttachmentsGrid = ({ attachments }) => {
  if (!attachments?.length) return null;
  const images = attachments.filter((a) => a.type === 'image');
  const videos = attachments.filter((a) => a.type === 'video');
  const others = attachments.filter((a) => a.type !== 'image' && a.type !== 'video');

  return (
    <div className="space-y-2">
      {images.length > 0 && (
        <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
          {images.map((img, i) => <AttachmentItem key={i} attachment={img} />)}
        </div>
      )}
      {videos.map((vid, i) => <AttachmentItem key={i} attachment={vid} />)}
      {others.map((item, i) => <AttachmentItem key={i} attachment={item} />)}
    </div>
  );
};

const EditHistoryModal = ({ history, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[var(--bg-card)] rounded-xl max-w-md w-full max-h-[70vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        <h3 className="font-semibold flex items-center gap-2">
          <History className="w-4 h-4" /> Edit History
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-[var(--bg-secondary)] rounded"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-4 overflow-y-auto max-h-[50vh] space-y-3">
        {history.map((item, i) => (
          <div key={i} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{item.content}</p>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {new Date(item.edited_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ChatMessage = ({ message, isOwn, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const rawRole = message.user?.role;

  const normalizeRoleLabel = (role) => {
    if (!role) return '';

    // If full object, prefer display_name then name
    if (typeof role === 'object') {
      return role.display_name || normalizeRoleLabel(role.name);
    }

    // String role codes → nice labels
    const code = String(role).toLowerCase();
    if (code === 'admin') return 'Admin';
    if (code === 'incharge') return 'In-Charge';
    if (code === 'user') return 'User';

    // Fallback: capitalize first letter
    return code.charAt(0).toUpperCase() + code.slice(1);
  };

  const roleLabel = normalizeRoleLabel(rawRole);

  if (message.is_system_message) {
    return (
      <div className="message-system py-2">
        <span>{message.content}</span>
        <span className="text-xs ml-2">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    );
  }

  const hasAttachments = message.attachments?.length > 0;
  const hasContent = message.content?.trim();
  const hasHistory = message.edit_history?.length > 0;

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(message.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <p className="text-xs text-[var(--text-muted)] mb-1 ml-3">
            {message.user?.full_name}
            {!!roleLabel && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs capitalize">
                {roleLabel}
              </span>
            )}
          </p>
        )}
        
        <div className="relative">
          <div className={`px-4 py-3 ${isOwn ? 'message-own' : 'message-other'}`}>
            {hasAttachments && <div className={hasContent ? 'mb-2' : ''}><AttachmentsGrid attachments={message.attachments} /></div>}
            
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white border-2 border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-primary)] resize-none shadow-inner"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={handleCancelEdit} className="px-3 py-1.5 text-sm rounded-lg bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-[var(--text-primary)]">Cancel</button>
                  <button onClick={handleSaveEdit} className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-amber-500 text-teal-600 dark:text-slate-900 font-medium hover:opacity-90">Save</button>
                </div>
              </div>
            ) : (
              hasContent && <p className="break-words whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {/* Action menu for own messages */}
          {isOwn && !isEditing && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10">
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-6 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] z-50 py-1 min-w-[120px]">
                      <button onClick={() => { setIsEditing(true); setShowMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-secondary)] text-sm">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      {hasHistory && (
                        <button onClick={() => { setShowHistory(true); setShowMenu(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-secondary)] text-sm">
                          <History className="w-3 h-3" /> History
                        </button>
                      )}
                      <button onClick={handleDeleteClick}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-secondary)] text-sm text-[var(--error)]">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 text-xs text-[var(--text-muted)] mt-1 ${isOwn ? 'justify-end mr-3' : 'ml-3'}`}>
          <span>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.edited_at && (
            <button onClick={() => hasHistory && setShowHistory(true)} className={`${hasHistory ? 'hover:underline cursor-pointer' : ''}`}>
              (edited)
            </button>
          )}
        </div>
      </div>

      {showHistory && hasHistory && <EditHistoryModal history={message.edit_history} onClose={() => setShowHistory(false)} />}
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default ChatMessage;
