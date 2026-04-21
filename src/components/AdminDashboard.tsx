
import { useState } from 'react';
import { 
  Home, 
  CheckCircle2, 
  Database, 
  Users, 
  List, 
  HelpCircle, 
  Bell, 
  Settings, 
  Search, 
  UploadCloud, 
  ChevronDown, 
  MapPin, 
  Eye,
  Clock,
  CircleDashed,
  Accessibility,
  ArrowRight,
  LogOut,
  Trophy,
  Plus,
  Trash2,
  Edit,
  X,
  MessageSquare,
  Sparkles,
  Mic,
  Share2,
  Video,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Zap,
  Layout,
  MoreHorizontal,
  ArrowLeft,
  Play,
  XCircle,
  Globe,
  Lightbulb,
  FileArchive,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import '../styles/AdminDashboard.css';

interface Sign {
    id: string;
    name: string;
    videoUrl: string;
    category: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    signs: string[];
    duration: string;
}

interface Job {
  id: string;
  name: string;
  filename: string;
  status: 'processing' | 'queued' | 'ready';
  progress: number;
  checkStatus: string;
  category?: string;
  region?: string;
}

interface AdminDashboardProps {
    onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'pipeline' | 'courses' | 'signs' | 'users' | 'verify' | 'stats' | 'text-to-sign' | 'converter'>('stats');

    // Pipeline State
    const [jobs, setJobs] = useState<Job[]>([
      {
        id: '1',
        name: 'Greeting_Morning_01',
        filename: 'Greeting_Morning_01.mp4',
        status: 'processing',
        progress: 74,
        checkStatus: 'Safe Check: Verified'
      },
      {
        id: '2',
        name: 'Alphabet_Series_A_to_E',
        filename: 'Alphabet_Series_A_to_E.mov',
        status: 'queued',
        progress: 0,
        checkStatus: 'Safe Check: Pending'
      },
      {
        id: '3',
        name: 'Action_Run_05',
        filename: 'Action_Run_05.mp4',
        status: 'ready',
        progress: 100,
        checkStatus: 'Safe Check: Verified'
      }
    ]);

    const [pipelineForm, setPipelineForm] = useState({
      name: '',
      category: '',
      region: '',
      file: null as File | null
    });

    // Courses & Signs State
    const [courses, setCourses] = useState<Course[]>([
        {
            id: '1',
            title: 'Basic Greetings',
            description: 'Learn essential greeting signs',
            difficulty: 'Beginner',
            signs: ['Hello', 'Thank You'],
            duration: '10 mins'
        }
    ]);

    const [signs, setSigns] = useState<Sign[]>([
        { id: '1', name: 'Hello', videoUrl: '/assets/s_hello_2.mp4', category: 'Greetings' },
        { id: '2', name: 'Thank You', videoUrl: '/assets/s_thanku_2.mp4', category: 'Greetings' },
        { id: '3', name: 'Write', videoUrl: '/assets/s_write_2.mp4', category: 'School' },
        { id: '4', name: 'Teacher', videoUrl: '/assets/s_teacher_2.mp4', category: 'School' },
        { id: '5', name: 'Study', videoUrl: '/assets/s_study_2.mp4', category: 'School' }
    ]);

    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [editingSign, setEditingSign] = useState<Sign | null>(null);
    const [newCourse, setNewCourse] = useState<Partial<Course>>({});
    const [newSign, setNewSign] = useState<Partial<Sign>>({});

    // Pipeline Logic
    const handleStartGenerating = () => {
      if (!pipelineForm.name || !pipelineForm.file) {
        alert('Please provide a sign name and select a file.');
        return;
      }

      const jobId = Math.random().toString(36).substr(2, 9);
      const newJob: Job = {
        id: jobId,
        name: pipelineForm.name,
        filename: pipelineForm.file.name,
        status: 'queued',
        progress: 0,
        checkStatus: 'Safe Check: Pending'
      };

      setJobs(prev => [newJob, ...prev]);
      
      // Keep connection track: Add to catalog when finished
      const signName = pipelineForm.name;
      const category = pipelineForm.category;

      setPipelineForm({ name: '', category: '', region: '', file: null });

      // Simulate progress & connection to the pipeline
      setTimeout(() => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'processing', checkStatus: 'Safe Check: Verified' } : j));
        
        const interval = setInterval(() => {
          setJobs(prev => {
            const currentJob = prev.find(j => j.id === jobId);
            if (currentJob && currentJob.progress < 100) {
              const nextProgress = Math.min(100, currentJob.progress + 5);
              if (nextProgress === 100) {
                clearInterval(interval);
                
                // Add to signs catalog when done
                setSigns(prevSigns => [...prevSigns, {
                    id: jobId,
                    name: signName,
                    videoUrl: `/assets/generated_${signName.toLowerCase()}.glb`,
                    category: category || 'General'
                }]);

                return prev.map(j => j.id === jobId ? { ...j, progress: 100, status: 'ready' } : j);
              }
              return prev.map(j => j.id === jobId ? { ...j, progress: nextProgress } : j);
            }
            return prev;
          });
        }, 500);
      }, 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setPipelineForm({ ...pipelineForm, file: e.target.files[0] });
      }
    };

    // Course management
    const handleAddCourse = () => {
        if (newCourse.title && newCourse.description) {
            const course: Course = {
                id: Date.now().toString(),
                title: newCourse.title,
                description: newCourse.description || '',
                difficulty: newCourse.difficulty || 'Beginner',
                signs: newCourse.signs || [],
                duration: newCourse.duration || '10 mins'
            };
            setCourses([...courses, course]);
            setNewCourse({});
        }
    };

    return (
        <div className="pipeline-container">
            {/* Sidebar */}
            <aside className="pipeline-sidebar">
                <div 
                    className={`sidebar-icon-container ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    <Home size={24} />
                    <span className="sidebar-tooltip">Dashboard</span>
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'pipeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pipeline')}
                >
                    <Plus size={24} />
                    <span className="sidebar-tooltip">Create 3D Sign</span>
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'text-to-sign' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text-to-sign')}
                >
                    <MessageSquare size={24} />
                    <span className="sidebar-tooltip">Text to Sign</span>
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'converter' ? 'active' : ''}`}
                    onClick={() => setActiveTab('converter')}
                >
                    <Sparkles size={24} />
                    <span className="sidebar-tooltip">Sign Converter</span>
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'verify' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verify')}
                >
                    <CheckCircle2 size={24} />
                    <span className="sidebar-tooltip">Verify</span>
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'signs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signs')}
                >
                    <Database size={24} />
                    <span className="sidebar-tooltip">Signs Library</span>
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={24} />
                    <span className="sidebar-tooltip">User Profile</span>
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    <List size={24} />
                    <span className="sidebar-tooltip">Courses</span>
                </div>
                <div className="mt-auto sidebar-icon-container" onClick={onLogout}>
                    <LogOut size={24} />
                    <span className="sidebar-tooltip">Logout</span>
                </div>
                <div className="sidebar-icon-container">
                    <HelpCircle size={24} />
                    <span className="sidebar-tooltip">Help</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pipeline-main">
                {/* Top Bar */}
                <header className="pipeline-topbar">
                    <div className="topbar-logo">
                        <img src="/src/assets/logo.png" alt="Signway" />
                        <div>
                            <span>Signway</span>
                            <div className="admin-tag">ADMIN</div>
                        </div>
                    </div>

                    <div className="search-container">
                        <Search className="search-icon" size={18} />
                        <input type="text" placeholder="Search dataset..." className="search-input" />
                    </div>

                    <div className="topbar-actions">
                        <div className="topbar-icon">
                            <Bell size={20} />
                            <div className="notification-dot"></div>
                        </div>
                        <div className="topbar-icon">
                            <Settings size={20} />
                        </div>
                        <div className="user-profile">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" />
                        </div>
                    </div>
                </header>

                <div className="page-content">
                    {activeTab === 'stats' && (
                        <div className="admin-space-y-8">
                            {/* Stats Cards */}
                            <div className="admin-stats-grid">
                                <div className="admin-stat-card">
                                    <div className="admin-stat-header">
                                        <Users size={20} />
                                        <span className="admin-stat-label">People using app</span>
                                    </div>
                                    <div className="admin-stat-value-row">
                                        <span className="admin-stat-value">84.2%</span>
                                        <div className="admin-stat-badge admin-stat-badge--success">
                                            <Activity size={12} style={{ marginRight: '4px' }} /> 5%
                                        </div>
                                    </div>
                                    <p className="admin-stat-description">Active students this week</p>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-header">
                                        <Trophy size={20} />
                                        <span className="admin-stat-label">Lessons Finished</span>
                                    </div>
                                    <div className="admin-stat-value-row">
                                        <span className="admin-stat-value">76.5%</span>
                                        <div className="admin-stat-badge admin-stat-badge--success">
                                            <Activity size={12} style={{ marginRight: '4px' }} /> 2%
                                        </div>
                                    </div>
                                    <p className="admin-stat-description">Average learning progress</p>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-header">
                                        <Clock size={20} />
                                        <span className="admin-stat-label">Waiting Review</span>
                                    </div>
                                    <div className="admin-stat-value-row">
                                        <span className="admin-stat-value">142</span>
                                        <div className="admin-stat-badge admin-stat-badge--info">New</div>
                                    </div>
                                    <p className="admin-stat-description">Items to check now</p>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-header">
                                        <Zap size={20} />
                                        <span className="admin-stat-label">Speed of Learning</span>
                                    </div>
                                    <div className="admin-stat-value-row">
                                        <span className="admin-stat-value">1.2s</span>
                                        <div className="admin-stat-badge admin-stat-badge--success">Faster</div>
                                    </div>
                                    <p className="admin-stat-description">Average computer speed</p>
                                </div>
                            </div>

                            {/* System Status Table */}
                            <div className="admin-table-card">
                                <div className="admin-table-header">
                                    <div className="admin-table-title">
                                        <Layout className="admin-table-title-icon" size={24} />
                                        <h2>How the system is doing</h2>
                                    </div>
                                    <button className="admin-btn admin-btn--outline">
                                        Show All Tasks <ArrowRight size={18} />
                                    </button>
                                </div>
                                
                                <div className="admin-table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Task Name</th>
                                                <th>Type of Work</th>
                                                <th style={{ textAlign: 'center' }}>Status</th>
                                                <th style={{ textAlign: 'center' }}>Secure Check</th>
                                                <th>Time</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { id: 'Task-001', work: 'Making 3D Videos', status: 'Finished', check: 'Verified', time: '2 mins ago' },
                                                { id: 'Task-002', work: 'Checking Language', status: 'Take a Look', check: 'Verified', time: '10 mins ago' },
                                                { id: 'Task-003', work: 'Word List Update', status: 'Finished', check: 'Verified', time: '15 mins ago' }
                                            ].map((task) => (
                                                <tr key={task.id}>
                                                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{task.id}</td>
                                                    <td style={{ fontWeight: 700, color: '#069e8e' }}>{task.work}</td>
                                                    <td className="admin-table-cell--center">
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <div className={`admin-status-badge ${
                                                                task.status === 'Finished' 
                                                                ? 'admin-status-badge--success' 
                                                                : 'admin-status-badge--warning'
                                                            }`}>
                                                                {task.status === 'Finished' ? <CheckCircle2 size={14} /> : <span>!</span>}
                                                                {task.status}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="admin-table-cell--center">
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>Verified</span>
                                                            <div className="admin-status-icon">
                                                                <CheckCircle2 size={12} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>{task.time}</td>
                                                    <td>
                                                        <button style={{ color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                            <MoreHorizontal size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <List size={16} /> Showing 3 active items
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="admin-btn admin-btn--ghost">Back</button>
                                        <button className="admin-btn admin-btn--primary">Next</button>
                                    </div>
                                </div>
                            </div>

                            {/* Review Promotion Card */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                                <div className="admin-review-card">
                                    <div className="admin-review-title">
                                        <Sparkles size={24} />
                                        <h3>New Words to Review</h3>
                                    </div>
                                    <p className="admin-review-text">
                                        Teachers sent in 12 new sign videos<br />
                                        today. Please check them soon!
                                    </p>
                                    <button className="admin-btn admin-btn--accent" style={{ marginTop: '16px' }}>
                                        <MessageSquare size={20} /> Go to Word List
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'text-to-sign' && (
                        <div className="text-to-sign-page">
                            <h2 className="text-to-sign-title">Simple Text-to-Sign Tool</h2>
                            
                            <div className="text-to-sign-layout">
                                {/* Left Column */}
                                <div>
                                    {/* Step 1 */}
                                    <div className="text-to-sign-card">
                                        <div className="text-to-sign-card-header">
                                            <div className="text-to-sign-card-icon">
                                                <List size={22} />
                                            </div>
                                            <div className="text-to-sign-card-title-section">
                                                <div className="text-to-sign-card-title-row">
                                                    <h3 className="text-to-sign-card-title">Step 1: Enter your text</h3>
                                                    <span className="text-to-sign-char-count">42 / 500 chars</span>
                                                </div>
                                                <p className="text-to-sign-card-subtitle">Type or speak the message you want to turn into sign language.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-to-sign-input-area">
                                            <textarea 
                                                className="text-to-sign-textarea"
                                                placeholder="Enter text here..."
                                                defaultValue="Please wear your safety helmet in the logistics warehouse zone."
                                            />
                                            <div className="text-to-sign-input-actions">
                                                <button className="text-to-sign-voice-btn">
                                                    <Mic size={18} /> Voice Input
                                                </button>
                                                <button className="text-to-sign-upload-btn">
                                                    <UploadCloud size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="text-to-sign-card" style={{ marginTop: '24px' }}>
                                        <div className="text-to-sign-card-header">
                                            <div className="text-to-sign-card-icon">
                                                <Layout size={22} />
                                            </div>
                                            <div className="text-to-sign-card-title-section">
                                                <div className="text-to-sign-card-title-row">
                                                    <h3 className="text-to-sign-card-title">Step 2: Check our work</h3>
                                                    <div className="text-to-sign-legend">
                                                        <div className="text-to-sign-legend-item">
                                                            <div className="text-to-sign-legend-dot text-to-sign-legend-dot--correct"></div>
                                                            <span className="text-to-sign-legend-text">Correct</span>
                                                        </div>
                                                        <div className="text-to-sign-legend-item">
                                                            <div className="text-to-sign-legend-dot text-to-sign-legend-dot--help"></div>
                                                            <span className="text-to-sign-legend-text">Needs Help</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-to-sign-card-subtitle">We've highlighted words from our Dictionary and those where the Helper is active.</p>
                                            </div>
                                        </div>

                                        <div className="text-to-sign-words-container">
                                            <div className="text-to-sign-words-row">
                                                {['Please', 'wear', 'your', 'safety'].map((word) => (
                                                    <div key={word} className="text-to-sign-word-tag">{word}</div>
                                                ))}
                                            </div>
                                            <div className="text-to-sign-words-row">
                                                {['helmet', 'in', 'the', 'logistics'].map((word) => (
                                                    <div key={word} className="text-to-sign-word-tag">{word}</div>
                                                ))}
                                            </div>
                                            <div className="text-to-sign-words-row">
                                                {['warehouse', 'zone'].map((word) => (
                                                    <div key={word} className="text-to-sign-word-tag">{word}</div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-to-sign-helper-alert">
                                            <div className="text-to-sign-helper-icon">
                                                <Lightbulb size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-to-sign-helper-title">New Sign Helper is working</h4>
                                                <p className="text-to-sign-helper-text">
                                                    "Helmet" and "Logistics" aren't in our standard dictionary yet. Our helper is creating them for you now using visual context models.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Preview */}
                                <div className="text-to-sign-preview-card">
                                    <div className="text-to-sign-card-header">
                                        <div className="text-to-sign-card-icon">
                                            <Video size={22} />
                                        </div>
                                        <div className="text-to-sign-card-title-section">
                                            <div className="text-to-sign-card-title-row">
                                                <h3 className="text-to-sign-card-title">Step 3: Preview Signs</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#069e8e' }}>
                                                    <Activity size={14} />
                                                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</span>
                                                </div>
                                            </div>
                                            <p className="text-to-sign-card-subtitle">Watch the generated sign language video below.</p>
                                        </div>
                                    </div>

                                    <div className="text-to-sign-preview-video">
                                        <img 
                                            src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=800" 
                                            className="text-to-sign-preview-bg" 
                                            alt="Avatar Preview" 
                                        />
                                        <div className="text-to-sign-preview-overlay">
                                            <button className="text-to-sign-preview-play">
                                                <Play size={32} fill="currentColor" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-to-sign-preview-option">
                                        <div className="text-to-sign-preview-option-icon">
                                            <Video size={20} />
                                        </div>
                                        <div className="text-to-sign-preview-option-info">
                                            <h4 className="text-to-sign-preview-option-label">Avatar Look</h4>
                                            <p className="text-to-sign-preview-option-value">4K Photorealistic Avatar</p>
                                        </div>
                                        <span className="text-to-sign-preview-option-action">Change</span>
                                    </div>

                                    <div className="text-to-sign-preview-option">
                                        <div className="text-to-sign-preview-option-icon">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="text-to-sign-preview-option-info">
                                            <h4 className="text-to-sign-preview-option-label">Location</h4>
                                            <p className="text-to-sign-preview-option-value">Neutral Workshop Studio</p>
                                        </div>
                                        <span className="text-to-sign-preview-option-action">Change</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-to-sign-footer">
                                <div className="text-to-sign-team-info">
                                    <div className="text-to-sign-team-avatars">
                                        {[1, 2, 3].map((i) => (
                                            <img 
                                                key={i} 
                                                src={`https://i.pravatar.cc/100?u=${i}`} 
                                                alt="user" 
                                                className="text-to-sign-team-avatar"
                                            />
                                        ))}
                                        <div style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            borderRadius: '50%', 
                                            border: '2px solid white',
                                            backgroundColor: '#069e8e',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            color: 'white',
                                            marginLeft: '-8px'
                                        }}>
                                            +3
                                        </div>
                                    </div>
                                    <p className="text-to-sign-team-text">
                                        Shared with <span>Signway Research Team</span>
                                    </p>
                                </div>
                                <div className="text-to-sign-footer-actions">
                                    <button className="text-to-sign-save-btn">Save Draft</button>
                                    <button className="text-to-sign-share-btn">
                                        <Share2 size={18} /> Share Finished Signs
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'converter' && (
                        <div className="sign-converter-page">
                            {/* Header */}
                            <div className="sign-converter-header">
                                <h2 className="sign-converter-title">
                                    Sign Converter: <span>ISL_Sentence_092</span>
                                </h2>
                                <button className="sign-converter-back-btn">
                                    <ArrowLeft size={18} /> Back to Library
                                </button>
                            </div>

                            {/* Main Layout */}
                            <div className="sign-converter-layout">
                                {/* Left Column */}
                                <div className="sign-converter-main">
                                    {/* Video Cards Grid */}
                                    <div className="sign-converter-video-grid">
                                        {/* 3D Version Card */}
                                        <div className="sign-converter-3d-card">
                                            <div className="sign-converter-3d-header">
                                                <h3 className="sign-converter-3d-title">3D Version</h3>
                                                <div className="sign-converter-3d-badge">
                                                    <Activity size={20} />
                                                    <span>3D</span>
                                                </div>
                                            </div>
                                            <div className="sign-converter-3d-content">
                                                <div className="sign-converter-3d-bg"></div>
                                                <div className="sign-converter-3d-overlay"></div>
                                                <button className="sign-converter-play-btn">
                                                    <Play size={32} fill="currentColor" />
                                                </button>
                                                <div className="sign-converter-progress">
                                                    <div className="sign-converter-progress-bar">
                                                        <div className="sign-converter-progress-fill"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Original Video Card */}
                                        <div className="sign-converter-original-card">
                                            <div className="sign-converter-original-header">
                                                <h3 className="sign-converter-original-title">Original</h3>
                                                <span className="sign-converter-reference-badge">Reference Video</span>
                                            </div>
                                            <div className="sign-converter-synced-badge">Synced View</div>
                                            <div className="sign-converter-original-content">
                                                <img 
                                                    src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800" 
                                                    alt="Reference" 
                                                    className="sign-converter-original-video"
                                                />
                                                <div className="sign-converter-original-play">
                                                    <button className="sign-converter-original-play-btn">
                                                        <Play size={28} fill="currentColor" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="sign-converter-spoken-text">
                                                <div className="sign-converter-spoken-header">
                                                    <span className="sign-converter-spoken-label">Spoken Text:</span>
                                                    <button className="sign-converter-read-aloud-btn">
                                                        <Mic size={14} /> Read Aloud
                                                    </button>
                                                </div>
                                                <p className="sign-converter-spoken-quote">"It's time for a break"</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedback Buttons */}
                                    <div className="sign-converter-feedback-grid">
                                        <div className="sign-converter-feedback-section">
                                            <h4 className="sign-converter-feedback-label">Sign Accuracy</h4>
                                            <div className="sign-converter-feedback-buttons">
                                                <button className="sign-converter-feedback-btn sign-converter-feedback-btn--correct">
                                                    <CheckCircle2 size={22} /> Correct
                                                </button>
                                                <button className="sign-converter-feedback-btn sign-converter-feedback-btn--wrong">
                                                    <XCircle size={22} /> Wrong
                                                </button>
                                            </div>
                                        </div>
                                        <div className="sign-converter-feedback-section">
                                            <h4 className="sign-converter-feedback-label">Movement Look</h4>
                                            <div className="sign-converter-feedback-buttons">
                                                <button className="sign-converter-feedback-btn sign-converter-feedback-btn--good">
                                                    <ThumbsUp size={22} /> Good
                                                </button>
                                                <button className="sign-converter-feedback-btn sign-converter-feedback-btn--bad">
                                                    <ThumbsDown size={22} /> Bad
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <div className="sign-converter-sidebar">
                                    <div className="sign-converter-details-card">
                                        <h3 className="sign-converter-details-title">Word Details</h3>

                                        {/* Language Type */}
                                        <div className="sign-converter-details-section">
                                            <label className="sign-converter-details-label">Language Type</label>
                                            <div className="sign-converter-select-wrapper">
                                                <select className="sign-converter-select">
                                                    <option>Standard Indian Sign Language</option>
                                                </select>
                                                <ChevronDown className="sign-converter-select-icon" size={20} />
                                            </div>
                                        </div>

                                        {/* Groups */}
                                        <div className="sign-converter-details-section">
                                            <label className="sign-converter-details-label">Groups</label>
                                            <div className="sign-converter-tags">
                                                {['Greetings', 'Navigation'].map(tag => (
                                                    <div key={tag} className="sign-converter-tag">
                                                        {tag} <X size={14} className="sign-converter-tag-close" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="sign-converter-add-tag-wrapper">
                                                <input 
                                                    type="text" 
                                                    placeholder="Add..." 
                                                    className="sign-converter-add-tag-input"
                                                />
                                                <button className="sign-converter-add-tag-btn">
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Speed */}
                                        <div className="sign-converter-speed-section">
                                            <label className="sign-converter-details-label">Speed</label>
                                            <div className="sign-converter-slider">
                                                <div className="sign-converter-slider-fill"></div>
                                            </div>
                                            <div className="sign-converter-slider-labels">
                                                <span>Slow</span>
                                                <span>Fast</span>
                                            </div>
                                        </div>

                                        {/* Your Feedback */}
                                        <h4 className="sign-converter-feedback-section-title">Your Feedback</h4>
                                        <textarea 
                                            className="sign-converter-feedback-textarea"
                                            placeholder="Write your notes here..."
                                        />
                                        <label className="sign-converter-checkbox-wrapper">
                                            <div className="sign-converter-checkbox"></div>
                                            <span className="sign-converter-checkbox-label">Flag for a second look</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pipeline' && (
                        <div className="create-3d-page">
                            {/* Header */}
                            <div className="create-3d-header">
                                <div className="create-3d-title-section">
                                    <h1 className="create-3d-title">Create 3D Sign</h1>
                                    <p className="create-3d-subtitle">Easily turn your sign language videos into 3D animations for students.</p>
                                </div>
                                <div className="create-3d-header-actions">
                                    <button className="create-3d-btn-help">
                                        <HelpCircle size={18} />
                                        Help
                                    </button>
                                    <button className="create-3d-btn-guidelines">
                                        <Database size={18} />
                                        View Guidelines
                                    </button>
                                </div>
                            </div>

                            {/* Main Layout */}
                            <div className="create-3d-layout">
                                {/* Left Column - Upload Studio */}
                                <div className="create-3d-upload-card">
                                    <div className="create-3d-upload-header">
                                        <div className="create-3d-upload-icon">
                                            <UploadCloud size={24} />
                                        </div>
                                        <div>
                                            <h3 className="create-3d-upload-title">Upload Studio</h3>
                                            <p className="create-3d-upload-subtitle">Provide details and upload your reference file.</p>
                                        </div>
                                    </div>

                                    <div className="create-3d-upload-grid">
                                        {/* Drop Zone */}
                                        <div className="create-3d-dropzone">
                                            <div className="create-3d-dropzone-icon">
                                                <UploadCloud size={28} />
                                            </div>
                                            <h4 className="create-3d-dropzone-title">Drop video here</h4>
                                            <p className="create-3d-dropzone-hint">
                                                MP4, MOV or WEBM up to <span>500MB</span>
                                            </p>
                                            <label className="create-3d-select-file-btn">
                                                {pipelineForm.file ? pipelineForm.file.name : 'Select File'}
                                                <input type="file" hidden accept="video/*" onChange={handleFileChange} />
                                            </label>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="create-3d-form">
                                            <div className="create-3d-form-group">
                                                <label className="create-3d-form-label">What is this sign called?</label>
                                                <input 
                                                    type="text" 
                                                    className="create-3d-form-input"
                                                    placeholder="e.g. 'Ocean Wave' or 'Thank You'"
                                                    value={pipelineForm.name}
                                                    onChange={(e) => setPipelineForm({...pipelineForm, name: e.target.value})}
                                                />
                                            </div>
                                            <div className="create-3d-form-group">
                                                <label className="create-3d-form-label">Choose a category</label>
                                                <div className="create-3d-form-select-wrapper">
                                                    <select 
                                                        className="create-3d-form-select"
                                                        value={pipelineForm.category}
                                                        onChange={(e) => setPipelineForm({...pipelineForm, category: e.target.value})}
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="Greetings & Social">Greetings & Social</option>
                                                        <option value="School">School</option>
                                                        <option value="Actions">Actions</option>
                                                        <option value="Daily Life">Daily Life</option>
                                                    </select>
                                                    <ChevronDown className="create-3d-form-select-icon" size={18} />
                                                </div>
                                            </div>
                                            <div className="create-3d-form-group">
                                                <label className="create-3d-form-label">Which region?</label>
                                                <div className="create-3d-form-select-wrapper">
                                                    <select 
                                                        className="create-3d-form-select"
                                                        value={pipelineForm.region}
                                                        onChange={(e) => setPipelineForm({...pipelineForm, region: e.target.value})}
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="North America (ASL)">North America (ASL)</option>
                                                        <option value="North India">North India</option>
                                                        <option value="South India">South India</option>
                                                        <option value="East India">East India</option>
                                                        <option value="West India">West India</option>
                                                    </select>
                                                    <Globe className="create-3d-form-select-globe" size={16} />
                                                    <ChevronDown className="create-3d-form-select-icon" size={18} />
                                                </div>
                                            </div>
                                            <button className="create-3d-process-btn" onClick={handleStartGenerating}>
                                                <Sparkles size={18} /> Process 3D Sign
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <div className="create-3d-sidebar">
                                    {/* Best Practices */}
                                    <div className="create-3d-practices-card">
                                        <div className="create-3d-practices-header">
                                            <Lightbulb size={20} />
                                            <h4 className="create-3d-practices-title">Best Practices</h4>
                                        </div>
                                        <ul className="create-3d-practices-list">
                                            <li className="create-3d-practices-item">
                                                <span className="create-3d-practices-bullet"></span>
                                                Use a high-contrast background.
                                            </li>
                                            <li className="create-3d-practices-item">
                                                <span className="create-3d-practices-bullet"></span>
                                                Keep movements steady and clear.
                                            </li>
                                            <li className="create-3d-practices-item">
                                                <span className="create-3d-practices-bullet"></span>
                                                Ensure the face and upper body are visible.
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Library Quick Links */}
                                    <div className="create-3d-links-card">
                                        <h4 className="create-3d-links-title">Library Quick Links</h4>
                                        <div className="create-3d-links-list">
                                            <div className="create-3d-link-item">
                                                <div className="create-3d-link-left">
                                                    <FileArchive className="create-3d-link-icon" size={18} />
                                                    <span className="create-3d-link-text">Bulk Upload (.zip)</span>
                                                </div>
                                                <ChevronRight className="create-3d-link-arrow" size={16} />
                                            </div>
                                            <div className="create-3d-link-item">
                                                <div className="create-3d-link-left">
                                                    <LayoutGrid className="create-3d-link-icon" size={18} />
                                                    <span className="create-3d-link-text">Manage Categories</span>
                                                </div>
                                                <ChevronRight className="create-3d-link-arrow" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Processing Queue Section */}
                            <div className="create-3d-queue-section">
                                <div className="create-3d-queue-header">
                                    <h2 className="create-3d-queue-title">Processing Queue</h2>
                                    <span className="create-3d-queue-badge">
                                        {jobs.filter(j => j.status === 'processing').length} Active Jobs
                                    </span>
                                </div>

                                <table className="create-3d-queue-table">
                                    <thead>
                                        <tr>
                                            <th>Sign Name</th>
                                            <th>Type / Region</th>
                                            <th>Submission Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((job, index) => {
                                            const colors = ['#22d3ee', '#fdba74', '#a78bfa'];
                                            const avatarColor = colors[index % colors.length];
                                            return (
                                                <tr key={job.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <div 
                                                                className="create-3d-queue-avatar"
                                                                style={{ backgroundColor: avatarColor }}
                                                            >
                                                                {job.filename.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h4 className="create-3d-queue-name">{job.filename}</h4>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="create-3d-queue-name">{job.category || 'Greeting'}</p>
                                                        <p className="create-3d-queue-meta">{job.region || 'ASL'}</p>
                                                    </td>
                                                    <td>
                                                        <p className="create-3d-queue-meta">Oct 24, 2023 · 14:30</p>
                                                    </td>
                                                    <td>
                                                        <div className="create-3d-queue-status">
                                                            {job.status === 'processing' && (
                                                                <div className="create-3d-queue-progress">
                                                                    <div className="create-3d-queue-progress-bar">
                                                                        <div 
                                                                            className="create-3d-queue-progress-fill"
                                                                            style={{ width: `${job.progress}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="create-3d-queue-progress-text">{job.progress}% Rendering</span>
                                                                </div>
                                                            )}
                                                            {job.status === 'queued' && (
                                                                <span className="create-3d-queue-status-badge create-3d-queue-status-badge--queued">
                                                                    <Clock size={12} /> Queued
                                                                </span>
                                                            )}
                                                            {job.status === 'ready' && (
                                                                <span className="create-3d-queue-status-badge create-3d-queue-status-badge--scanning">
                                                                    <CheckCircle2 size={12} /> Ready
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <MoreHorizontal className="create-3d-queue-actions" size={20} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="user-profile-page">
                            {/* Header Section */}
                            <div className="user-profile-header">
                                <div className="user-profile-title-section">
                                    <h1 className="user-profile-title">User Profile</h1>
                                    <p className="user-profile-subtitle">
                                        Manage administrative users and granular access permissions.
                                    </p>
                                </div>
                                <div className="user-profile-header-actions">
                                    <div className="user-search-input-wrapper">
                                        <Search className="user-search-icon" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="Search users..." 
                                            className="user-search-input"
                                        />
                                    </div>
                                    <button className="user-add-btn">
                                        <Users size={18} />
                                        Add New User
                                    </button>
                                </div>
                            </div>

                            {/* Two Column Layout */}
                            <div className="user-profile-layout">
                                {/* Profile Settings Card */}
                                <div className="profile-settings-card">
                                    <h2 className="profile-settings-title">
                                        <Users className="profile-settings-icon" size={20} />
                                        Profile Settings
                                    </h2>

                                    <div className="profile-avatar-section">
                                        <div className="profile-avatar-wrapper">
                                            <img 
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                                alt="Profile" 
                                                className="profile-avatar"
                                            />
                                            <div className="profile-avatar-upload-btn">
                                                <Plus size={16} />
                                            </div>
                                        </div>
                                        <p className="profile-avatar-hint">
                                            Recommended: Square JPG or PNG, max 2MB
                                        </p>
                                    </div>

                                    <div className="profile-form-group">
                                        <label className="profile-form-label">Full Name</label>
                                        <input 
                                            type="text" 
                                            value="Alex Rivera" 
                                            className="profile-form-input"
                                        />
                                    </div>

                                    <div className="profile-form-group">
                                        <label className="profile-form-label">Email Address</label>
                                        <input 
                                            type="email" 
                                            value="alex.admin@signway.com" 
                                            className="profile-form-input"
                                        />
                                    </div>

                                    <div className="profile-form-group">
                                        <label className="profile-form-label">Current Password</label>
                                        <input 
                                            type="password" 
                                            value="********" 
                                            className="profile-form-input"
                                        />
                                    </div>

                                    <button className="profile-save-btn">
                                        Save Profile Changes
                                    </button>
                                </div>

                                {/* Administrative Users Table */}
                                <div className="admin-users-card">
                                    <div className="admin-users-header">
                                        <Users className="admin-users-header-icon" size={20} />
                                        <h2>Administrative Users</h2>
                                    </div>

                                    <div className="admin-users-table-wrapper">
                                        <table className="admin-users-table">
                                            <thead>
                                                <tr>
                                                    <th>USER</th>
                                                    <th>STATUS</th>
                                                    <th>ROLE</th>
                                                    <th>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="user-cell">
                                                            <img 
                                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                                                alt="Sarah" 
                                                                className="user-cell-avatar"
                                                            />
                                                            <div className="user-cell-info">
                                                                <span className="user-cell-name">Sarah Jenkins</span>
                                                                <span className="user-cell-email">sarah.j@signway.edu</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="user-status-badge user-status-badge--active">
                                                            <span className="user-status-dot"></span>
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="user-role-badge user-role-badge--dhh">DHH Expert</span>
                                                    </td>
                                                    <td>
                                                        <div className="user-actions">
                                                            <button className="user-action-btn">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="user-action-btn">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="user-cell">
                                                            <img 
                                                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                                                alt="Marcus" 
                                                                className="user-cell-avatar"
                                                            />
                                                            <div className="user-cell-info">
                                                                <span className="user-cell-name">Marcus Wright</span>
                                                                <span className="user-cell-email">m.wright@globalcorp.com</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="user-status-badge user-status-badge--active">
                                                            <span className="user-status-dot"></span>
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="user-role-badge user-role-badge--employer">Employer Admin</span>
                                                    </td>
                                                    <td>
                                                        <div className="user-actions">
                                                            <button className="user-action-btn">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="user-action-btn">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="user-cell">
                                                            <img 
                                                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                                                alt="Elena" 
                                                                className="user-cell-avatar"
                                                            />
                                                            <div className="user-cell-info">
                                                                <span className="user-cell-name">Elena Gomez</span>
                                                                <span className="user-cell-email">elena.g@signway.com</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="user-status-badge user-status-badge--active">
                                                            <span className="user-status-dot"></span>
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="user-role-badge user-role-badge--super">Super Admin</span>
                                                    </td>
                                                    <td>
                                                        <div className="user-actions">
                                                            <button className="user-action-btn">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="user-action-btn">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="user-cell">
                                                            <img 
                                                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                                                alt="Professor" 
                                                                className="user-cell-avatar"
                                                            />
                                                            <div className="user-cell-info">
                                                                <span className="user-cell-name">Professor Thompson</span>
                                                                <span className="user-cell-email">thompson@edu.org</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="user-status-badge user-status-badge--inactive">
                                                            <span className="user-status-dot"></span>
                                                            Inactive
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="user-role-badge user-role-badge--teacher">Teacher</span>
                                                    </td>
                                                    <td>
                                                        <div className="user-actions">
                                                            <button className="user-action-btn">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="user-action-btn">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="admin-users-footer">
                                        <span className="admin-users-footer-info">Showing 4 of 24 administrators</span>
                                        <div className="admin-users-pagination">
                                            <button className="admin-users-page-btn">Previous</button>
                                            <button className="admin-users-page-btn">Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Access Level Footer */}
                            <div className="user-access-footer">
                                <div className="user-access-levels">
                                    <div className="user-access-level">
                                        <span className="user-access-dot user-access-dot--full"></span>
                                        Full System Access
                                    </div>
                                    <div className="user-access-level">
                                        <span className="user-access-dot user-access-dot--verify"></span>
                                        Verification Access
                                    </div>
                                    <div className="user-access-level">
                                        <span className="user-access-dot user-access-dot--org"></span>
                                        Organization Management
                                    </div>
                                </div>
                                <div className="user-security-text">
                                    <span>SECURED BY SIGNWAY RBAC</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold mb-6">Courses Management</h2>
                            <Card className="border-2 border-dashed border-purple-200 bg-purple-50/50 mb-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-700">
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add New Course
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Course Title</Label>
                                            <Input
                                                placeholder="e.g., Basic Greetings"
                                                value={newCourse.title || ''}
                                                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                                className="mt-1 rounded-xl bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label>Difficulty</Label>
                                            <Input
                                                placeholder="e.g., Beginner"
                                                value={newCourse.difficulty || ''}
                                                onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                                                className="mt-1 rounded-xl bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Course description..."
                                            value={newCourse.description || ''}
                                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                            className="mt-1 rounded-xl bg-white"
                                        />
                                    </div>
                                    <Button onClick={handleAddCourse} className="rounded-xl bg-[#0d9488]">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Course
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="grid md:grid-cols-2 gap-6">
                                {courses.map((course) => (
                                    <Card key={course.id} className="hover:shadow-lg transition-shadow bg-white rounded-3xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <span>{course.title}</span>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                                                    {course.difficulty}
                                                </span>
                                                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                                                    {course.duration}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'signs' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold mb-6">Signs Catalog</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {signs.map((sign) => (
                                    <Card key={sign.id} className="hover:shadow-lg transition-shadow bg-white rounded-3xl">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-bold">{sign.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                                                {sign.category}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-4 font-mono truncate">{sign.videoUrl}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
