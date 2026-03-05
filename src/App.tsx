import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight, 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  LogOut, 
  Menu, 
  X,
  Search,
  Folder,
  MoreVertical,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Edit2,
  Save,
  Copy,
  Scissors,
  ClipboardPaste
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { Page, FileMetadata } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CodeEditor } from './components/Editor';
import { isAllowedFile, ALLOWED_EXTENSIONS } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ currentPage, setPage, user, onLogout }: { 
  currentPage: Page, 
  setPage: (p: Page) => void, 
  user: any,
  onLogout: () => void 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string, value: Page, protected?: boolean }[] = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
    { label: 'Files', value: 'dashboard', protected: true },
  ];

  return (
    <nav className={cn(
      "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[90%] max-w-5xl",
      isScrolled ? "top-4" : "top-6"
    )}>
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Cloud className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">CloudVault</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            (!link.protected || user) && (
              <button
                key={link.value}
                onClick={() => setPage(link.value)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-400",
                  currentPage === link.value ? "text-emerald-400" : "text-white/70"
                )}
              >
                {link.label}
              </button>
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/50 hidden lg:block">{user.email}</span>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setPage('login')}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
              >
                Login
              </button>
              <button 
                onClick={() => setPage('signup')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Get Started
              </button>
            </>
          )}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 glass rounded-3xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              (!link.protected || user) && (
                <button
                  key={link.value}
                  onClick={() => {
                    setPage(link.value);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 text-lg font-medium border-b border-white/5"
                >
                  {link.label}
                </button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <section className="pt-40 pb-20 px-6 overflow-hidden relative">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
    </div>

    <div className="max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
          Next Gen Storage
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Your Files, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
            Secured in the Cloud.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience the most modern, glass-styled file management system. 
          Upload, manage, and share your data with military-grade security.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-xl shadow-emerald-500/20"
          >
            Start Storing Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto glass hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all">
            View Demo
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-20 relative"
      >
        <div className="glass-dark rounded-[2.5rem] p-4 shadow-2xl border-white/10">
          <img 
            src="https://picsum.photos/seed/dashboard/1200/600" 
            alt="Dashboard Preview" 
            className="rounded-[1.5rem] w-full object-cover shadow-inner"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Floating elements */}
        <div className="absolute -top-10 -left-10 glass p-4 rounded-2xl hidden lg:block animate-bounce shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Encrypted</p>
              <p className="text-[10px] text-white/50">AES-256 Protocol</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Lightning Fast",
      desc: "Optimized upload and download speeds with global CDN edge servers."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Secure by Design",
      desc: "End-to-end encryption and Row Level Security powered by Supabase."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Collaborative",
      desc: "Share files with teammates and manage permissions with ease."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CloudVault?</h2>
          <p className="text-white/50">Everything you need to manage your digital assets.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-8 rounded-[2rem] text-left">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5 mt-20">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <Cloud className="text-emerald-500 w-6 h-6" />
        <span className="font-bold text-lg">CloudVault</span>
      </div>
      <div className="flex gap-8 text-sm text-white/50">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">API</a>
        <a href="#" className="hover:text-white transition-colors">Status</a>
      </div>
      <p className="text-xs text-white/30">© 2026 CloudVault Inc. Built with Supabase.</p>
    </div>
  </footer>
);

const AuthForm = ({ mode, onToggle, onSuccess, initialEmail = '' }: { 
  mode: 'login' | 'signup' | 'reset-password', 
  onToggle: () => void, 
  onSuccess: (user: any) => void,
  initialEmail?: string
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setShowVerification(true);
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess(data.user);
      } else if (mode === 'reset-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Password reset link has been sent to your email.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
          <p className="text-white/60 mb-8">
            Mail has been sent to your email. Please click confirm in the email to verify your account.
          </p>
          <button 
            onClick={() => {
              setShowVerification(false);
              onToggle(); // Switch to login
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-white/50 text-sm">
            {mode === 'login' ? 'Enter your credentials to access files' : 
             mode === 'signup' ? 'Join thousands of users securing their data' : 
             'Enter your email to receive a reset link'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="name@example.com"
            />
          </div>
          {mode !== 'reset-password' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl">
              {message}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Processing...' : 
             (mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-white/50 flex flex-col gap-3">
          {mode === 'login' && (
            <button 
              onClick={() => onToggle()} // This will be handled in App to switch to signup
              className="text-emerald-400 font-bold hover:underline"
            >
              Don't have an account? Sign Up
            </button>
          )}
          {mode === 'login' && (
            <button 
              onClick={() => onSuccess({ email, mode: 'reset-password' })} // Hacky way to trigger mode change
              className="text-white/40 hover:text-white transition-colors"
            >
              Forgot Password?
            </button>
          )}
          {mode !== 'login' && (
            <button 
              onClick={() => onSuccess({ email, mode: 'login' })}
              className="text-emerald-400 font-bold hover:underline"
            >
              Back to Login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user }: { user: any }) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<{ type: 'file' | 'folder' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<FileMetadata | null>(null);
  const [createName, setCreateName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [clipboard, setClipboard] = useState<{ item: FileMetadata, type: 'copy' | 'cut' } | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item: FileMetadata | null } | null>(null);
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFiles = async () => {
    console.log('Fetching files for user:', user?.id);
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('is_folder', { ascending: false })
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      console.log('Files fetched:', data?.length || 0);
      setFiles(data || []);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      if (err.message?.includes('column') || err.message?.includes('relation')) {
        showToast('Database Error: Missing columns. Check console.', 'error');
      } else {
        showToast('Fetch failed: ' + err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedFile(file.name)) {
      alert('Only text/code files are allowed. Allowed extensions: ' + ALLOWED_EXTENSIONS.join(', '));
      return;
    }

    setUploading(true);
    showToast('Uploading file...', 'info');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Read file content
      const content = await file.text();

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-files')
        .getPublicUrl(filePath);

      // 3. Save Metadata to DB
      const { error: dbError } = await supabase.from('files').insert({
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        user_id: user.id,
        path: filePath,
        is_folder: false,
        parent_id: activeFolderId,
        content: content
      });

      if (dbError) throw dbError;
      
      await fetchFiles();
      showToast('File uploaded successfully!', 'success');
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('Upload failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const createItem = async () => {
    if (!createName || !showCreateModal || !user) {
      console.warn('Cannot create item: missing name, modal state, or user');
      return;
    }
    
    const { type } = showCreateModal;
    let finalName = createName;
    
    console.log(`Creating ${type}: ${createName} in folder: ${activeFolderId || 'root'}`);

    if (type === 'file' && !createName.includes('.')) {
      finalName = `${createName}.txt`;
    }

    if (type === 'file' && !isAllowedFile(finalName)) {
      alert('Invalid file extension. Allowed extensions: ' + ALLOWED_EXTENSIONS.join(', '));
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase.from('files').insert({
        name: finalName,
        size: 0,
        type: type === 'folder' ? 'folder' : 'text/plain',
        url: null,
        user_id: user.id,
        path: '',
        is_folder: type === 'folder',
        parent_id: activeFolderId,
        content: type === 'file' ? '' : null
      });

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      await fetchFiles();
      if (activeFolderId) {
        setExpandedFolders(prev => new Set(prev).add(activeFolderId));
      }
      setShowCreateModal(null);
      setCreateName('');
      showToast(`${type === 'file' ? 'File' : 'Folder'} created!`, 'success');
    } catch (err: any) {
      console.error('Creation error:', err);
      showToast('Creation failed: ' + err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const renameItem = async (item: FileMetadata) => {
    if (!newName || newName === item.name) {
      setIsRenaming(null);
      return;
    }

    let finalName = newName;
    if (!item.is_folder && !newName.includes('.')) {
      finalName = `${newName}.txt`;
    }

    if (!item.is_folder && !isAllowedFile(finalName)) {
      alert('Invalid file extension. Allowed extensions: ' + ALLOWED_EXTENSIONS.join(', '));
      return;
    }

    try {
      const { error } = await supabase
        .from('files')
        .update({ name: finalName })
        .eq('id', item.id);

      if (error) throw error;
      await fetchFiles();
      setIsRenaming(null);
    } catch (err: any) {
      console.error('Rename error:', err);
      alert('Rename failed: ' + err.message);
    }
  };

  const handleDelete = async (file: FileMetadata) => {
    try {
      if (file.is_folder) {
        // Recursive delete for folder children
        const children = files.filter(f => f.parent_id === file.id);
        for (const child of children) {
          await handleDelete(child);
        }
      }

      if (!file.is_folder && file.path) {
        try {
          await supabase.storage.from('user-files').remove([file.path]);
        } catch (storageErr) {
          console.warn('Storage delete failed (might not exist):', storageErr);
        }
      }

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      if (activeFolderId === file.id) {
        setActiveFolderId(null);
      }
      
      // Only fetch and show toast for the top-level delete call
      if (showDeleteModal?.id === file.id) {
        await fetchFiles();
        showToast('Deleted successfully', 'success');
        setShowDeleteModal(null);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      if (showDeleteModal?.id === file.id) {
        showToast('Delete failed: ' + err.message, 'error');
      }
    }
  };

  const handleMoveItem = async (itemId: string, targetFolderId: string | null) => {
    if (itemId === targetFolderId) return;
    
    // Circular check
    if (targetFolderId) {
        let current: string | null = targetFolderId;
        while (current) {
            if (current === itemId) {
                showToast("Cannot move a folder into itself or its subfolders", "error");
                return;
            }
            const parent = files.find(f => f.id === current)?.parent_id;
            current = parent || null;
        }
    }

    try {
      const { error } = await supabase
        .from('files')
        .update({ parent_id: targetFolderId })
        .eq('id', itemId);

      if (error) throw error;
      await fetchFiles();
      showToast('Item moved', 'success');
    } catch (err: any) {
      console.error('Move error:', err);
      showToast('Move failed: ' + err.message, 'error');
    }
  };

  const handleCopyItem = async (item: FileMetadata, targetFolderId: string | null, isRecursive = false) => {
    try {
      const newName = isRecursive ? item.name : `${item.name}${clipboard?.type === 'copy' ? ' (copy)' : ''}`;
      
      const { data: newItem, error } = await supabase.from('files').insert({
        name: newName,
        size: item.size,
        type: item.type,
        url: item.url,
        user_id: user.id,
        path: item.path,
        is_folder: item.is_folder,
        parent_id: targetFolderId,
        content: item.content
      }).select().single();

      if (error) throw error;

      if (item.is_folder) {
        const children = files.filter(f => f.parent_id === item.id);
        for (const child of children) {
          await handleCopyItem(child, newItem.id, true);
        }
      }

      if (!isRecursive) {
        await fetchFiles();
        showToast('Item copied', 'success');
      }
    } catch (err: any) {
      console.error('Copy error:', err);
      if (!isRecursive) showToast('Copy failed: ' + err.message, 'error');
    }
  };

  const handlePaste = async (targetId?: string | null) => {
    if (!clipboard) return;

    const { item, type } = clipboard;
    const targetFolderId = targetId !== undefined ? targetId : activeFolderId;

    if (type === 'cut') {
      await handleMoveItem(item.id, targetFolderId);
      setClipboard(null);
    } else {
      await handleCopyItem(item, targetFolderId);
    }
  };

  const saveFileContent = async () => {
    if (!selectedFile) return;

    try {
      const { error } = await supabase
        .from('files')
        .update({ content: editorContent })
        .eq('id', selectedFile.id);

      if (error) throw error;
      
      // Update local state
      setFiles(files.map(f => f.id === selectedFile.id ? { ...f, content: editorContent } : f));
      showToast('File saved!', 'success');
    } catch (err: any) {
      console.error('Save error:', err);
      showToast('Save failed: ' + err.message, 'error');
    }
  };

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
    setActiveFolderId(id);
  };

  const renderExplorerItem = (item: FileMetadata, depth = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const children = files.filter(f => f.parent_id === item.id);
    const isActive = activeFolderId === item.id;

    const handleTouchStart = (e: React.TouchEvent) => {
      longPressTimer.current = setTimeout(() => {
        const touch = e.touches[0];
        setContextMenu({ x: touch.clientX, y: touch.clientY, item });
      }, 600);
    };

    const handleTouchEnd = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };

    return (
      <div 
        key={item.id} 
        className="select-none"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('itemId', item.id);
          e.dataTransfer.effectAllowed = 'copyMove';
        }}
        onDragOver={(e) => {
          if (item.is_folder) {
            e.preventDefault();
            e.currentTarget.classList.add('bg-emerald-500/10');
          }
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('bg-emerald-500/10');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-emerald-500/10');
          const draggedId = e.dataTransfer.getData('itemId');
          if (item.is_folder && draggedId !== item.id) {
            if (e.ctrlKey || e.metaKey) {
              const draggedItem = files.find(f => f.id === draggedId);
              if (draggedItem) handleCopyItem(draggedItem, item.id);
            } else {
              handleMoveItem(draggedId, item.id);
            }
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY, item });
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
      >
        <div 
          className={cn(
            "group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
            selectedFile?.id === item.id || (item.is_folder && isActive) ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5" : "hover:bg-white/5 text-white/70",
            clipboard?.item.id === item.id && clipboard.type === 'cut' && "opacity-40 grayscale"
          )}
          style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
          onClick={() => {
            if (item.is_folder) {
              toggleFolder(item.id);
            } else {
              setSelectedFile(item);
              setEditorContent(item.content || '');
              setActiveFolderId(item.parent_id);
            }
          }}
        >
          {item.is_folder ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          
          {item.is_folder && <Folder className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-blue-400")} />}
          
          {isRenaming === item.id ? (
            <input 
              autoFocus
              className="bg-white/10 border-none rounded px-1 py-0 text-xs text-white focus:outline-none w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => renameItem(item)}
              onKeyDown={(e) => e.key === 'Enter' && renameItem(item)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-xs truncate flex-1">{item.name}</span>
          )}

          <div className="hidden group-hover:flex items-center gap-1.5">
            {item.is_folder && clipboard && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaste(item.id);
                }}
                className="p-1.5 hover:bg-emerald-500/20 rounded transition-colors text-emerald-400"
                title="Paste into this folder"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setClipboard({ item, type: 'cut' });
                showToast(`"${item.name}" cut to clipboard`, 'info');
              }}
              className={cn(
                "p-1.5 hover:bg-white/10 rounded transition-colors",
                clipboard?.item.id === item.id && clipboard.type === 'cut' ? "text-emerald-400" : "text-white/40"
              )}
              title="Cut"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setClipboard({ item, type: 'copy' });
                showToast(`"${item.name}" copied to clipboard`, 'info');
              }}
              className={cn(
                "p-1.5 hover:bg-white/10 rounded transition-colors",
                clipboard?.item.id === item.id && clipboard.type === 'copy' ? "text-emerald-400" : "text-white/40"
              )}
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(item.id);
                setNewName(item.name);
              }}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40"
              title="Rename"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(item);
              }}
              className="p-1.5 hover:bg-red-500/10 rounded text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {item.is_folder && isExpanded && (
          <div className="mt-0.5">
            {children.map(child => renderExplorerItem(child, depth + 1))}
            {children.length === 0 && (
              <div 
                className="text-[10px] text-white/20 italic py-1"
                style={{ paddingLeft: `${(depth + 1) * 1.2 + 2}rem` }}
              >
                Empty folder
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const rootItems = files.filter(f => f.parent_id === null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      window.requestAnimationFrame(() => {
        const newWidth = Math.max(200, Math.min(600, e.clientX));
        setSidebarWidth(newWidth);
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="pt-24 h-screen flex flex-col overflow-hidden" onClick={() => {
      setActiveFolderId(null);
      setContextMenu(null);
    }}>
      <div className="flex-1 flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar Toggle Button (Floating when hidden) */}
        {!isSidebarVisible && (
          <button 
            onClick={() => setIsSidebarVisible(true)}
            className="fixed top-24 left-6 z-[60] p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-110 transition-all duration-300"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Sidebar / Explorer */}
        <motion.div 
          initial={false}
          animate={{ 
            width: isSidebarVisible ? sidebarWidth : 0,
            opacity: isSidebarVisible ? 1 : 0,
            x: isSidebarVisible ? 0 : -20
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="glass-dark border-r border-white/5 flex flex-col relative group/sidebar overflow-hidden"
        >
          {/* Resize Handle */}
          {isSidebarVisible && (
            <div 
              className={cn(
                "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-emerald-500/50 transition-colors z-50",
                isResizing && "bg-emerald-500 w-0.5"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizing(true);
              }}
            />
          )}

          <div className="py-8 px-6 border-b border-white/5 flex items-center justify-between min-h-[110px]">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarVisible(false)}
                className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white"
                title="Hide Sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-col">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Explorer</h2>
                {activeFolderId && (
                  <span className="text-[10px] text-emerald-500/60 truncate max-w-[80px] font-bold uppercase tracking-tighter">
                    {files.find(f => f.id === activeFolderId)?.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchFiles()}
                className="p-3.5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white hover:scale-110 active:scale-95"
                title="Refresh"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>
              <button 
                onClick={() => setShowCreateModal({ type: 'file' })}
                className="p-3.5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white hover:scale-110 active:scale-95"
                title="New File"
              >
                <FilePlus className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setShowCreateModal({ type: 'folder' })}
                className="p-3.5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white hover:scale-110 active:scale-95"
                title="New Folder"
              >
                <FolderPlus className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div 
            className="flex-1 overflow-y-auto p-2 custom-scrollbar"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const draggedId = e.dataTransfer.getData('itemId');
              if (draggedId) {
                handleMoveItem(draggedId, null);
              }
            }}
          >
            {loading ? (
              <div className="space-y-2 p-2">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : rootItems.length > 0 ? (
              rootItems.map(item => renderExplorerItem(item))
            ) : (
              <div className="text-center py-10 px-4">
                <p className="text-xs text-white/20">No files or folders yet.</p>
                <button 
                  onClick={() => {
                    console.log('Create first file clicked');
                    setShowCreateModal({ type: 'file' });
                  }}
                  className="mt-4 text-xs text-emerald-400 font-bold hover:underline"
                >
                  Create your first file
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Editor Workspace */}
        <div className="flex-1 bg-black/40 flex flex-col relative">
          {/* Sidebar Toggle Button (Floating when hidden) */}
          {!isSidebarVisible && (
            <button 
              onClick={() => setIsSidebarVisible(true)}
              className="absolute top-4 left-4 z-40 p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-110 transition-all duration-300"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          )}

          {selectedFile ? (
            <div className="flex-1 flex flex-col pt-16">
              <CodeEditor 
                filename={selectedFile.name}
                content={editorContent}
                onChange={(val) => setEditorContent(val || '')}
                onSave={saveFileContent}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                <Cloud className="w-10 h-10 text-emerald-500/40" />
              </div>
              <h2 className="text-2xl font-black text-white/80 mb-3 tracking-tight">CloudVault Explorer</h2>
              <p className="text-white/30 max-w-xs text-sm font-medium leading-relaxed">
                Select a file to start editing or create a new one to begin your project.
              </p>
              {!isSidebarVisible && (
                <button 
                  onClick={() => setIsSidebarVisible(true)}
                  className="mt-8 px-8 py-3 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  Open Explorer
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[300] glass-dark border border-white/10 rounded-2xl shadow-2xl py-2 min-w-[180px] overflow-hidden backdrop-blur-2xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenu.item ? (
              <>
                <div className="px-4 py-2 border-b border-white/5 mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">
                    {contextMenu.item.name}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setClipboard({ item: contextMenu.item!, type: 'cut' });
                    showToast(`"${contextMenu.item!.name}" cut to clipboard`, 'info');
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors"
                >
                  <Scissors className="w-4 h-4 text-white/40" />
                  <span>Cut / Move</span>
                </button>
                <button 
                  onClick={() => {
                    setClipboard({ item: contextMenu.item!, type: 'copy' });
                    showToast(`"${contextMenu.item!.name}" copied to clipboard`, 'info');
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors"
                >
                  <Copy className="w-4 h-4 text-white/40" />
                  <span>Copy</span>
                </button>
                {contextMenu.item.is_folder && clipboard && (
                  <button 
                    onClick={() => {
                      handlePaste(contextMenu.item!.id);
                      setContextMenu(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-emerald-500/10 text-emerald-400 flex items-center gap-3 transition-colors"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    <span>Paste Here</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    setIsRenaming(contextMenu.item!.id);
                    setNewName(contextMenu.item!.name);
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-white/40" />
                  <span>Rename</span>
                </button>
                <div className="h-px bg-white/5 my-1" />
                <button 
                  onClick={() => {
                    setShowDeleteModal(contextMenu.item!);
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-500/10 text-red-400 flex items-center gap-3 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setShowCreateModal({ type: 'file' });
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <FilePlus className="w-4 h-4 text-white/40" />
                  <span>New File</span>
                </button>
                <button 
                  onClick={() => {
                    setShowCreateModal({ type: 'folder' });
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <FolderPlus className="w-4 h-4 text-white/40" />
                  <span>New Folder</span>
                </button>
                {clipboard && (
                  <button 
                    onClick={() => {
                      handlePaste(null);
                      setContextMenu(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-emerald-500/10 text-emerald-400 flex items-center gap-3 transition-colors"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    <span>Paste to Root</span>
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreateModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                Create New {showCreateModal.type === 'file' ? 'File' : 'Folder'}
              </h3>
              <input 
                autoFocus
                type="text"
                placeholder={`Enter ${showCreateModal.type} name...`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-6"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createItem()}
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCreateModal(null)}
                  className="flex-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-white/50"
                >
                  Cancel
                </button>
                <button 
                  disabled={isCreating || !createName}
                  onClick={createItem}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative z-10 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Do you really want to delete this {showDeleteModal.is_folder ? 'folder' : 'file'}?</h3>
              <p className="text-sm text-white/50 mb-8">
                Deleting <span className="text-white font-medium">"{showDeleteModal.name}"</span> cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-white/50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[200px] justify-center",
              toast.type === 'success' ? "bg-emerald-500 text-white" : 
              toast.type === 'error' ? "bg-red-500 text-white" : "bg-blue-500 text-white"
            )}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {toast.type === 'error' && <X className="w-4 h-4" />}
            <span className="text-sm font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialEmail, setInitialEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage('home');
  };

  const handleAuthSuccess = (data: any) => {
    if (data?.mode) {
      setPage(data.mode);
      if (data.email) setInitialEmail(data.email);
      return;
    }
    setUser(data);
    setPage('dashboard');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen font-sans">
      <Navbar 
        currentPage={page} 
        setPage={setPage} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main>
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onGetStarted={() => setPage(user ? 'dashboard' : 'signup')} />
              <Features />
              <Footer />
            </motion.div>
          )}

          {page === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 px-6 max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-8">About CloudVault</h1>
              <p className="text-white/60 leading-relaxed mb-6">
                CloudVault was founded in 2026 with a simple mission: to make cloud storage beautiful and accessible. 
                We believe that the tools you use every day should inspire you.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-3xl font-bold text-emerald-400 mb-2">10M+</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Files Stored</p>
                </div>
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-3xl font-bold text-blue-400 mb-2">99.9%</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Uptime</p>
                </div>
              </div>
            </motion.div>
          )}

          {page === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 px-6 max-w-xl mx-auto">
              <div className="glass p-10 rounded-[2.5rem]">
                <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
                <p className="text-white/50 mb-8">We'd love to hear from you.</p>
                <form className="space-y-6">
                  <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none" />
                  <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none" />
                  <textarea placeholder="Message" rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none"></textarea>
                  <button className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl">Send Message</button>
                </form>
              </div>
            </motion.div>
          )}

          {(page === 'login' || page === 'signup' || page === 'reset-password') && (
            <AuthForm 
              mode={page as any} 
              initialEmail={initialEmail}
              onToggle={() => {
                setPage(page === 'login' ? 'signup' : 'login');
              }} 
              onSuccess={handleAuthSuccess}
            />
          )}

          {page === 'dashboard' && (
            user ? <Dashboard user={user} /> : <AuthForm mode="login" onToggle={() => setPage('signup')} onSuccess={handleAuthSuccess} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
