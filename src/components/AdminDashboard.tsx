
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
                    title="Dashboard Stats"
                >
                    <Home size={24} />
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'pipeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pipeline')}
                    title="Create 3D Sign"
                >
                    <Plus size={24} />
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'text-to-sign' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text-to-sign')}
                    title="Text to Sign"
                >
                    <MessageSquare size={24} />
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'converter' ? 'active' : ''}`}
                    onClick={() => setActiveTab('converter')}
                    title="Sign Converter"
                >
                    <Sparkles size={24} />
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'verify' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verify')}
                    title="Verify"
                >
                    <CheckCircle2 size={24} />
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'signs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signs')}
                >
                    <Database size={24} />
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={24} />
                </div>
                <div 
                    className={`sidebar-icon-container ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    <List size={24} />
                </div>
                <div className="mt-auto sidebar-icon-container" title="Logout" onClick={onLogout}>
                    <LogOut size={24} />
                </div>
                <div className="sidebar-icon-container">
                    <HelpCircle size={24} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="pipeline-main">
                {/* Top Bar */}
                <header className="pipeline-topbar">
                    <div className="topbar-logo">
                        <img src="https://raw.githubusercontent.com/belhyto/signway4/main/public/assets/signy_maskot.png" alt="Signway" />
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
                        <div className="space-y-8">
                            <h2 className="text-4xl font-extrabold text-[#069e8e]">Simple Text-to-Sign Tool</h2>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-7 space-y-6">
                                    {/* Step 1 */}
                                    <Card className="bg-white rounded-[40px] border-none shadow-sm p-10 relative">
                                        <div className="flex items-start gap-4 mb-8">
                                            <div className="w-10 h-10 bg-[#e0fcf4] rounded-xl flex items-center justify-center text-[#069e8e]">
                                                <List size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between w-full">
                                                    <h3 className="text-xl font-extrabold text-[#1e293b] uppercase tracking-wide">Step 1: Enter your text</h3>
                                                    <span className="text-[10px] font-bold text-[#94a3b8] bg-[#f8fafc] px-3 py-1 rounded-full uppercase">42 / 500 chars</span>
                                                </div>
                                                <p className="text-[#64748b] font-medium mt-1">Type or speak the message you want to turn into sign language below.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-[#f8fafc] rounded-3xl p-8 mb-6">
                                            <textarea 
                                                className="w-full bg-transparent border-none focus:outline-none text-xl font-bold text-[#1e293b] placeholder:text-[#cbd5e1] resize-none min-h-[120px]"
                                                placeholder="Enter text here..."
                                                defaultValue="Please wear your safety helmet in the logistics warehouse zone."
                                            />
                                            <div className="flex justify-end gap-3 mt-4">
                                                <Button className="bg-[#00ffca] hover:bg-[#00e6b8] text-[#1e3a8a] rounded-2xl px-6 h-12 font-extrabold gap-2">
                                                    <Mic size={18} /> Voice Input
                                                </Button>
                                                <Button variant="outline" className="rounded-2xl border-[#e2e8f0] w-12 h-12 p-0 flex items-center justify-center">
                                                    <UploadCloud size={20} className="text-[#069e8e]" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Step 2 */}
                                    <Card className="bg-white rounded-[40px] border-none shadow-sm p-10">
                                        <div className="flex items-start gap-4 mb-8">
                                            <div className="w-10 h-10 bg-[#e0fcf4] rounded-xl flex items-center justify-center text-[#069e8e]">
                                                <Layout size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-extrabold text-[#1e293b] uppercase tracking-wide">Step 2: Check our work</h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-[#00ffca]"></div>
                                                            <span className="text-[10px] font-bold text-[#1e293b] uppercase">Correct</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-[#ffb86c]"></div>
                                                            <span className="text-[10px] font-bold text-[#1e293b] uppercase">Needs Help</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-[#64748b] font-medium mt-1">We've highlighted words from our Dictionary and those where the Helper is active.</p>
                                            </div>
                                        </div>

                                        <div className="border-2 border-dashed border-[#f1f5f9] rounded-[32px] p-8 space-y-4">
                                            <div className="flex flex-wrap gap-3">
                                                {['Please', 'wear', 'your', 'safety'].map((word) => (
                                                    <div key={word} className="px-5 py-2.5 rounded-2xl bg-white border border-[#e2e8f0] text-[#069e8e] font-extrabold shadow-sm">
                                                        {word}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {['helmet', 'in', 'the', 'logistics'].map((word) => (
                                                    <div key={word} className="px-5 py-2.5 rounded-2xl bg-white border border-[#e2e8f0] text-[#069e8e] font-extrabold shadow-sm">
                                                        {word}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {['warehouse', 'zone'].map((word) => (
                                                    <div key={word} className="px-5 py-2.5 rounded-2xl bg-white border border-[#e2e8f0] text-[#069e8e] font-extrabold shadow-sm">
                                                        {word}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex gap-4 p-6 border-l-4 border-[#ffb86c] bg-[#fffaf5] rounded-r-3xl">
                                            <div className="text-[#ffb86c]">
                                                <HelpCircle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-[#1e293b] uppercase text-sm tracking-wide">New Sign Helper is working</h4>
                                                <p className="text-[#64748b] text-sm mt-1 font-medium">
                                                    "Helmet" and "Logistics" aren't in our standard dictionary yet. Our helper is creating them for you now using visual context models.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="lg:col-span-5">
                                    {/* Step 3 */}
                                    <Card className="bg-white rounded-[40px] border-none shadow-sm p-10 sticky top-8">
                                        <div className="flex items-start gap-4 mb-8">
                                            <div className="w-10 h-10 bg-[#e0fcf4] rounded-xl flex items-center justify-center text-[#069e8e]">
                                                <Video size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-extrabold text-[#1e293b] uppercase tracking-wide">Step 3: Preview Signs</h3>
                                                    <div className="flex items-center gap-1.5 text-[#069e8e]">
                                                        <Activity size={16} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Live Preview</span>
                                                    </div>
                                                </div>
                                                <p className="text-[#64748b] font-medium mt-1">Watch the generated sign language video below.</p>
                                            </div>
                                        </div>

                                        <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] bg-[#f8fafc] mb-8 shadow-inner group">
                                            <img 
                                                src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=800" 
                                                className="w-full h-full object-cover opacity-50 grayscale" 
                                                alt="Avatar Preview" 
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button className="w-20 h-20 bg-[#00ffca] rounded-full flex items-center justify-center text-[#1e3a8a] shadow-xl transform transition-transform hover:scale-110">
                                                    <ArrowRight className="ml-1" size={32} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-5 bg-[#f8fafc] rounded-3xl group cursor-pointer hover:bg-white transition-colors border border-transparent hover:border-[#e2e8f0]">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#069e8e] shadow-sm">
                                                    <Video size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">Avatar Look</h4>
                                                    <p className="text-sm font-extrabold text-[#1e293b]">4K Photorealistic Avatar</p>
                                                </div>
                                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#069e8e]">Change</Button>
                                            </div>

                                            <div className="flex items-center gap-4 p-5 bg-[#f8fafc] rounded-3xl group cursor-pointer hover:bg-white transition-colors border border-transparent hover:border-[#e2e8f0]">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#069e8e] shadow-sm">
                                                    <MapPin size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">Location</h4>
                                                    <p className="text-sm font-extrabold text-[#1e293b]">Neutral Workshop Studio</p>
                                                </div>
                                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#069e8e]">Change</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-[#e2e8f0]">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden bg-slate-200">
                                                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-4 border-white bg-[#069e8e] flex items-center justify-center text-[10px] font-bold text-white">
                                            +3
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Shared With</h5>
                                        <p className="text-xs font-bold text-[#1e293b]">Signway Research Team</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="rounded-2xl border-[#e2e8f0] h-14 px-8 font-black uppercase tracking-widest text-[#64748b]">Save Draft</Button>
                                    <Button className="rounded-2xl bg-[#00ffca] hover:bg-[#00e6b8] text-[#1e3a8a] h-14 px-10 font-black uppercase tracking-widest flex items-center gap-3">
                                        <Share2 size={20} /> Share Finished Signs
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'converter' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold text-[#1e3a8a]">
                                    Sign Converter: <span className="text-[#069e8e]">ISL_Sentence_092</span>
                                </h2>
                                <Button variant="ghost" className="text-[#94a3b8] hover:text-[#1e293b] gap-2 font-bold uppercase text-xs tracking-widest">
                                    <ArrowLeft size={18} /> Back to Library
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-8 space-y-8">
                                    {/* Video Comparison Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* 3D Version */}
                                        <Card className="bg-[#1e293b] rounded-[40px] overflow-hidden relative shadow-xl">
                                            <div className="absolute top-6 left-8 right-8 flex items-center justify-between z-10">
                                                <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">3D Version</h3>
                                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                                                    <div className="relative">
                                                        <Activity size={20} />
                                                        <span className="absolute -top-1 -right-1 text-[8px] font-bold">3D</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="aspect-[3/4] flex items-center justify-center relative bg-slate-800">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-60"></div>
                                                <img src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-40 grayscale" alt="3D Avatar" />
                                                <button className="w-24 h-24 bg-[#00ffca] rounded-full flex items-center justify-center text-[#1e3a8a] shadow-2xl transform transition-transform hover:scale-110 z-10">
                                                    <ArrowRight className="ml-1" size={40} />
                                                </button>
                                                <div className="absolute bottom-10 left-8 right-8 z-10">
                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#00ffca] w-1/3"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Original Reference */}
                                        <Card className="bg-[#069e8e] rounded-[40px] overflow-hidden relative shadow-xl">
                                            <div className="absolute top-6 left-8 right-8 flex items-center justify-between z-10">
                                                <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">Original</h3>
                                                <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 text-[8px] font-black text-white uppercase tracking-widest border border-white/20">Reference Video</div>
                                            </div>
                                            <div className="aspect-[3/4] flex flex-col relative bg-[#069e8e]">
                                                <div className="absolute top-20 left-4 z-10">
                                                    <div className="bg-[#00ffca]/20 backdrop-blur-md text-[#00ffca] text-[9px] font-black uppercase px-3 py-1 rounded-full border border-[#00ffca]/30">Synced View</div>
                                                </div>
                                                <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Reference" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white transform transition-transform hover:scale-110">
                                                        <ArrowRight className="ml-1" size={32} />
                                                    </button>
                                                </div>
                                                <div className="bg-white p-8">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em]">Spoken Text:</h4>
                                                        <Button variant="ghost" className="h-8 rounded-lg bg-[#e0fcf4] text-[#069e8e] font-black text-[9px] uppercase tracking-widest gap-1.5">
                                                            <Mic size={14} /> Read Aloud
                                                        </Button>
                                                    </div>
                                                    <p className="text-2xl font-extrabold text-[#069e8e]">"It's time for a break"</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] px-2">Sign Accuracy</h4>
                                            <div className="flex gap-4">
                                                <Button className="flex-1 h-16 rounded-[20px] bg-white border border-[#e2e8f0] text-[#069e8e] hover:bg-[#e0fcf4] font-black text-sm uppercase gap-3 shadow-sm">
                                                    <CheckCircle2 size={24} /> Correct
                                                </Button>
                                                <Button className="flex-1 h-16 rounded-[20px] bg-white border border-[#e2e8f0] text-[#f97316] hover:bg-[#fff5f0] font-black text-sm uppercase gap-3 shadow-sm">
                                                    <X size={24} /> Wrong
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] px-2">Movement Look</h4>
                                            <div className="flex gap-4">
                                                <Button className="flex-1 h-16 rounded-[20px] bg-white border border-[#e2e8f0] text-[#069e8e] hover:bg-[#e0fcf4] font-black text-sm uppercase gap-3 shadow-sm">
                                                    <ThumbsUp size={24} /> Good
                                                </Button>
                                                <Button className="flex-1 h-16 rounded-[20px] bg-white border border-[#e2e8f0] text-[#f97316] hover:bg-[#fff5f0] font-black text-sm uppercase gap-3 shadow-sm">
                                                    <ThumbsDown size={24} /> Bad
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 space-y-8">
                                    {/* Word Details */}
                                    <Card className="bg-white rounded-[40px] border-none shadow-sm p-10 space-y-8">
                                        <div>
                                            <h3 className="text-xl font-extrabold text-[#1e293b] uppercase tracking-wide mb-6">Word Details</h3>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Language Type</label>
                                                    <div className="relative">
                                                        <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 font-extrabold text-[#069e8e] focus:outline-none appearance-none">
                                                            <option>Standard Indian Sign Language</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={20} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Groups</label>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {['Greetings', 'Navigation'].map(tag => (
                                                            <div key={tag} className="flex items-center gap-1.5 bg-[#e0fcf4] text-[#069e8e] px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-wider">
                                                                {tag} <X size={12} className="cursor-pointer" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="relative">
                                                        <input className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 font-bold text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none" placeholder="Add..." />
                                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#069e8e] rounded-xl flex items-center justify-center text-white shadow-lg">
                                                            <Plus size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-4 pt-4">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Speed</label>
                                                    </div>
                                                    <div className="h-2 w-full bg-[#e0fcf4] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#00ffca] w-3/4"></div>
                                                    </div>
                                                    <div className="flex justify-between text-[9px] font-black text-[#cbd5e1] uppercase tracking-widest">
                                                        <span>Slow</span>
                                                        <span>Fast</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-[#f1f5f9]">
                                            <h3 className="text-xl font-extrabold text-[#1e293b] uppercase tracking-wide mb-6">Your Feedback</h3>
                                            <div className="space-y-6">
                                                <textarea 
                                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[24px] p-6 font-bold text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none resize-none min-h-[160px]"
                                                    placeholder="Write your notes here..."
                                                />
                                                <label className="flex items-center gap-3 group cursor-pointer">
                                                    <div className="w-6 h-6 border-2 border-[#e2e8f0] rounded-lg flex items-center justify-center transition-colors group-hover:border-[#069e8e]">
                                                        {/* custom checkbox icon could go here */}
                                                    </div>
                                                    <span className="text-[11px] font-black text-[#64748b] uppercase tracking-widest group-hover:text-[#1e293b]">Flag for a second look</span>
                                                </label>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pipeline' && (
                        <>
                            <section className="page-header">
                                <div className="page-title">
                                    <h1>Create 3D Sign</h1>
                                    <p>Easily turn your sign language videos into 3D animations for students.</p>
                                </div>
                                <div className="header-buttons">
                                    <button className="btn-help">
                                        <HelpCircle size={18} />
                                        Help
                                    </button>
                                    <button className="btn-guidelines">
                                        <Database size={18} />
                                        View Guidelines
                                    </button>
                                </div>
                            </section>

                            {/* Upload Section */}
                            <section className="upload-card">
                                <div className="upload-icon-container">
                                    <UploadCloud size={48} />
                                </div>
                                <h2 className="text-2xl font-bold">Click or Drag Videos Here</h2>
                                <p>Upload MP4 or MOV files.</p>
                                <label className="btn-select-files">
                                    <Plus size={20} />
                                    {pipelineForm.file ? pipelineForm.file.name : 'Select Files'}
                                    <input type="file" hidden accept="video/*" onChange={handleFileChange} />
                                </label>
                                <div className="max-size-hint">MAXIMUM FILE SIZE: 500MB</div>
                            </section>

                            {/* Sign Details Section */}
                            <section className="details-card">
                                <div className="details-card-header">
                                    <List size={20} color="#00ffca" strokeWidth={3} />
                                    <h3>Sign Details</h3>
                                </div>
                                <div className="details-form">
                                    <div className="form-group">
                                        <label>SIGN NAME</label>
                                        <div className="form-input-container">
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Good Morning" 
                                                value={pipelineForm.name}
                                                onChange={(e) => setPipelineForm({...pipelineForm, name: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>CATEGORY</label>
                                        <div className="form-input-container">
                                            <select 
                                                value={pipelineForm.category}
                                                onChange={(e) => setPipelineForm({...pipelineForm, category: e.target.value})}
                                            >
                                                <option value="">Select...</option>
                                                <option value="Greetings">Greetings</option>
                                                <option value="School">School</option>
                                                <option value="Actions">Actions</option>
                                            </select>
                                            <ChevronDown className="input-icon" size={18} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>REGION</label>
                                        <div className="form-input-container">
                                            <select 
                                                value={pipelineForm.region}
                                                onChange={(e) => setPipelineForm({...pipelineForm, region: e.target.value})}
                                            >
                                                <option value="">Select...</option>
                                                <option value="North India">North India</option>
                                                <option value="South India">South India</option>
                                                <option value="East India">East India</option>
                                                <option value="West India">West India</option>
                                            </select>
                                            <MapPin className="input-icon" size={18} />
                                        </div>
                                    </div>
                                </div>
                                <button className="btn-start-generating" onClick={handleStartGenerating}>
                                    Start Generating
                                </button>
                            </section>

                            {/* Processing Queue Section */}
                            <section className="queue-section">
                                <div className="queue-section-header">
                                    <h2>Processing Queue</h2>
                                    <span className="status-badge badge-processing">
                                        ● {jobs.filter(j => j.status === 'processing').length} PROCESSING
                                    </span>
                                    <span className="status-badge badge-completed">
                                        {jobs.filter(j => j.status === 'ready').length} COMPLETED TODAY
                                    </span>
                                </div>

                                <div className="queue-table-card">
                                    <table className="queue-table">
                                        <thead>
                                            <tr>
                                                <th>VIDEO ASSET</th>
                                                <th>BODY OUTLINE VIEW</th>
                                                <th>STATUS</th>
                                                <th>PROGRESS</th>
                                                <th>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.map(job => (
                                                <tr key={job.id}>
                                                    <td>
                                                        <div className="asset-info">
                                                            <h4>{job.filename}</h4>
                                                            <p>{job.checkStatus}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`outline-view-icon ${job.status === 'queued' ? 'queued' : ''}`}>
                                                            {job.status === 'queued' ? <Clock size={20} /> : <Accessibility size={24} />}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`status-indicator ${job.status}`}>
                                                            {job.status === 'processing' && <CircleDashed size={14} className="animate-spin" />}
                                                            {job.status === 'ready' && <CheckCircle2 size={14} color="#22c55e" />}
                                                            {job.status === 'queued' && <Clock size={14} />}
                                                            <span className="ml-1">{job.status}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="progress-container">
                                                            <div className="progress-bar-outer">
                                                                <div 
                                                                    className={`progress-bar-inner ${job.status === 'ready' ? 'ready' : ''}`}
                                                                    style={{ width: `${job.progress}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="progress-text">{job.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="action-icon">
                                                            <Eye size={18} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
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
