import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ticketsApi, messagesApi } from '../services/api';
import { subscribeToTicket } from '../services/pusher';
import { ArrowLeft, Send, Loader2, Users, MessageSquareOff, Paperclip, X, Image, FileText, Video, Link2, Plus } from 'lucide-react';
import { Button } from '../components/ui';
import TicketHeader from '../components/tickets/TicketHeader';
import ChatMessage from '../components/tickets/ChatMessage';

const CLOSED_STATUSES = ['resolved', 'closed'];
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 10;
const MAX_URLS = 5;

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStaff, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const subscriptionRef = useRef(null);
  const fileInputRef = useRef(null);

  const isChatDisabled = ticket && CLOSED_STATUSES.includes(ticket.status);

  const loadTicket = useCallback(async () => {
    try {
      const [ticketRes, messagesRes] = await Promise.all([
        ticketsApi.getOne(id),
        messagesApi.getAll(id),
      ]);
      setTicket(ticketRes.ticket);
      setMessages(messagesRes.messages || []);
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadTicket(); }, [loadTicket]);

  useEffect(() => {
    if (!ticket || !user) return;
    subscriptionRef.current = subscribeToTicket(id, user, {
      onMessage: (msg) => setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]),
      onMessageUpdate: (updated) => setMessages((prev) => prev.map((m) => m.id === updated.id ? { ...m, ...updated } : m)),
      onMessageDelete: (msgId) => setMessages((prev) => prev.filter((m) => m.id !== msgId)),
      onTicketUpdate: (updated) => setTicket((prev) => ({ ...prev, ...updated })),
      onTyping: (data) => {
        if (data.user_id === user.id) return;
        setTypingUsers((prev) => {
          if (data.typing) return prev.find((u) => u.user_id === data.user_id) ? prev : [...prev, data];
          return prev.filter((u) => u.user_id !== data.user_id);
        });
        setTimeout(() => setTypingUsers((prev) => prev.filter((u) => u.user_id !== data.user_id)), 3000);
      },
      onPresenceUpdate: setActiveUsers,
      onMemberJoined: (info) => setActiveUsers((prev) => prev.find((u) => u.id === info.id) ? prev : [...prev, info]),
      onMemberLeft: (info) => setActiveUsers((prev) => prev.filter((u) => u.id !== info.id)),
    });
    return () => subscriptionRef.current?.unsubscribe();
  }, [ticket, id, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleTyping = useCallback(() => {
    if (!subscriptionRef.current || !user || isChatDisabled) return;
    subscriptionRef.current.triggerTyping(user);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => subscriptionRef.current?.triggerStopTyping(user), 2000);
  }, [user, isChatDisabled]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        addToast(`${file.name} is too large. Max size is 20MB.`, 'error');
        return false;
      }
      return true;
    });

    if (attachments.length + validFiles.length > MAX_FILES) {
      addToast(`Maximum ${MAX_FILES} files allowed.`, 'warning');
      return;
    }

    const newAttachments = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
      if (urls.length >= MAX_URLS) {
        addToast(`Maximum ${MAX_URLS} URLs allowed.`, 'warning');
        return;
      }
      setUrls((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
      setShowUrlInput(false);
    } catch {
      addToast('Please enter a valid URL', 'error');
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => {
      const removed = prev[index];
      if (removed.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeUrl = (index) => setUrls((prev) => prev.filter((_, i) => i !== index));

  const clearAll = () => {
    attachments.forEach((a) => a.preview && URL.revokeObjectURL(a.preview));
    setAttachments([]);
    setUrls([]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const hasContent = newMessage.trim() || attachments.length > 0 || urls.length > 0;
    if (!hasContent || sending || isChatDisabled) return;

    subscriptionRef.current?.triggerStopTyping(user);
    setSending(true);

    try {
      const files = attachments.map((a) => a.file);
      const response = await messagesApi.send(id, newMessage.trim(), files, urls);
      setMessages((prev) => prev.some((m) => m.id === response.message.id) ? prev : [...prev, response.message]);
      setNewMessage('');
      clearAll();
    } catch (error) {
      console.error('Error sending message:', error);
      addToast(error.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await messagesApi.update(id, messageId, newContent);
      setMessages((prev) => prev.map((m) => m.id === messageId ? response.message : m));
    } catch (error) {
      console.error('Error editing message:', error);
      addToast(error.message || 'Failed to edit message', 'error');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messagesApi.delete(id, messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      addToast(error.message || 'Failed to delete message', 'error');
    }
  };

  const getFileIcon = (type) => {
    if (type === 'image') return <Image className="w-4 h-4" />;
    if (type === 'video') return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">Ticket not found</p>
        <Link to="/tickets" className="text-[var(--accent-primary)] hover:underline mt-2 inline-block">Back to tickets</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/tickets" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6">
        <ArrowLeft className="w-4 h-4" />Back to tickets
      </Link>

      <TicketHeader
        ticket={ticket}
        onUpdate={loadTicket}
        isStaff={isStaff()}
        isAdmin={isAdmin()}
        onDeleted={() => { addToast('Ticket deleted', 'success'); navigate('/tickets'); }}
      />

      {activeUsers.length > 0 && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
          <Users className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm text-[var(--text-secondary)]">Also viewing:</span>
          <div className="flex items-center gap-2">
            {activeUsers.map((u, i) => (
              <div key={u.id || i} className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-xs font-semibold">
                  {u.name?.[0] || '?'}
                </div>
                <span className="text-sm font-medium">{u.name}</span>
                {i < activeUsers.length - 1 && <span className="text-[var(--text-muted)]">,</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] mt-6 overflow-hidden">
        {isChatDisabled && (
          <div className="px-4 py-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] flex items-center gap-3">
            <MessageSquareOff className="w-5 h-5 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)]">This ticket is {ticket.status}. Chat is disabled.</span>
          </div>
        )}

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
              {isChatDisabled ? 'No messages in this ticket.' : 'No messages yet. Start the conversation!'}
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isOwn={msg.user_id === user.id}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {typingUsers.length > 0 && !isChatDisabled && (
          <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>{typingUsers.length === 1 ? `${typingUsers[0].user_name} is typing...` : `${typingUsers.length} people are typing...`}</span>
            </div>
          </div>
        )}

        {!isChatDisabled ? (
          <form onSubmit={handleSendMessage} className="border-t border-[var(--border-color)]">
            {/* Attachments Preview */}
            {(attachments.length > 0 || urls.length > 0) && (
              <div className="px-4 pt-3 flex flex-wrap gap-2">
                {attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg">
                    {att.preview ? (
                      <img src={att.preview} alt="Preview" className="w-8 h-8 object-cover rounded" />
                    ) : (
                      getFileIcon(att.type)
                    )}
                    <span className="text-sm truncate max-w-[120px]">{att.file.name}</span>
                    <button type="button" onClick={() => removeAttachment(i)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {urls.map((url, i) => (
                  <div key={`url-${i}`} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg">
                    <Link2 className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-sm truncate max-w-[150px] text-[var(--accent-primary)]">{url}</span>
                    <button type="button" onClick={() => removeUrl(i)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {(attachments.length > 0 || urls.length > 0) && (
                  <button type="button" onClick={clearAll} className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] px-2">
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* URL Input */}
            {showUrlInput && (
              <div className="px-4 pt-3 flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                  placeholder="Enter URL and press Enter..."
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] focus:outline-none text-sm"
                  autoFocus
                />
                <Button type="button" size="sm" onClick={handleAddUrl} icon={Plus}>Add</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => { setShowUrlInput(false); setUrlInput(''); }}>Cancel</Button>
              </div>
            )}

            {/* Input Row */}
            <div className="p-4 flex gap-3">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xls,.xlsx" multiple />
              
              <div className="flex gap-1">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors" 
                  title="Attach files"
                  disabled={attachments.length >= MAX_FILES}
                >
                  <Paperclip className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowUrlInput(true)} 
                  className="p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors" 
                  title="Add URL"
                  disabled={urls.length >= MAX_URLS}
                >
                  <Link2 className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                disabled={sending}
              />
              <Button type="submit" loading={sending} icon={Send} disabled={!newMessage.trim() && attachments.length === 0 && urls.length === 0}>
                Send
              </Button>
            </div>
          </form>
        ) : (
          <div className="border-t border-[var(--border-color)] p-4 bg-[var(--bg-tertiary)]">
            <div className="flex items-center justify-center gap-2 text-[var(--text-muted)]">
              <MessageSquareOff className="w-4 h-4" />
              <span>Chat is disabled for {ticket.status} tickets</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
