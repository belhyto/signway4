import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    BookOpen,
    Video,
    LogOut,
    Upload,
    Cpu,
    UploadCloud,
    CheckCircle,
    Clock
} from 'lucide-react';

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

interface AdminDashboardProps {
    onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
    // Sample data - in production, this would come from a database
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

    // Pipeline State
    const [pipelineJob, setPipelineJob] = useState<{ id: string, status: string, progress: number } | null>(null);
    const [pipelineForm, setPipelineForm] = useState({
        file: null as File | null,
        sign_name: '',
        category: '',
        region: ''
    });

    // Course Management Functions
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

    const handleUpdateCourse = () => {
        if (editingCourse) {
            setCourses(courses.map(c => c.id === editingCourse.id ? editingCourse : c));
            setEditingCourse(null);
        }
    };

    const handleDeleteCourse = (id: string) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    // Pipeline Functions
    const handlePipelineUpload = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!pipelineForm.file || !pipelineForm.sign_name) {
            alert('Please provide a file and sign name.');
            return;
        }

        // Simulate file validation (e.g., checking size/type)
        if (pipelineForm.file.size > 500 * 1024 * 1024) {
            alert('File must be under 500 MB.');
            return;
        }

        // Simulate API call to POST /api/v1/upload/video
        const jobId = Math.random().toString(36).substring(7);
        setPipelineJob({ id: jobId, status: 'queued', progress: 0 });

        // Simulate pipeline progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            if (currentProgress >= 100) {
                clearInterval(interval);
                setPipelineJob({ id: jobId, status: 'completed', progress: 100 });
                // Automatically add the fully processed sign to the catalog
                setSigns((prev) => [...prev, {
                    id: jobId,
                    name: pipelineForm.sign_name,
                    videoUrl: `/assets/generated_${pipelineForm.sign_name.toLowerCase()}.glb`,
                    category: pipelineForm.category || 'General'
                }]);
            } else {
                setPipelineJob(prev => prev ? { ...prev, progress: currentProgress, status: 'processing' } : null);
            }
        }, 1000);

        setPipelineForm({ file: null, sign_name: '', category: '', region: '' });
    };

    // Sign Management Functions
    const handleAddSign = () => {
        if (newSign.name && newSign.videoUrl) {
            const sign: Sign = {
                id: Date.now().toString(),
                name: newSign.name,
                videoUrl: newSign.videoUrl,
                category: newSign.category || 'General'
            };
            setSigns([...signs, sign]);
            setNewSign({});
        }
    };

    const handleUpdateSign = () => {
        if (editingSign) {
            setSigns(signs.map(s => s.id === editingSign.id ? editingSign : s));
            setEditingSign(null);
        }
    };

    const handleDeleteSign = (id: string) => {
        setSigns(signs.filter(s => s.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h3>
                        <h3 className="text-xl mb-1">Manage courses and sign language content</h3>
                    </div>
                    <Button
                        onClick={onLogout}
                        variant="outline"
                        className="rounded-xl"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Tabs defaultValue="courses" className="space-y-6">
                    <TabsList className="grid w-full max-w-3xl grid-cols-3 h-12 rounded-2xl">
                        <TabsTrigger value="courses" className="rounded-xl">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Courses
                        </TabsTrigger>
                        <TabsTrigger value="signs" className="rounded-xl">
                            <Video className="h-4 w-4 mr-2" />
                            Signs Catalog
                        </TabsTrigger>
                        <TabsTrigger value="pipeline" className="rounded-xl bg-gradient-to-r data-[state=active]:from-indigo-100 data-[state=active]:to-purple-100">
                            <Cpu className="h-4 w-4 mr-2 text-indigo-600" />
                            Video → 3D Pipeline
                        </TabsTrigger>
                    </TabsList>

                    {/* Courses Tab */}
                    <TabsContent value="courses" className="space-y-6">
                        {/* Add New Course */}
                        <Card className="border-2 border-dashed border-purple-200 bg-purple-50/50">
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
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label>Difficulty</Label>
                                        <Input
                                            placeholder="e.g., Beginner"
                                            value={newCourse.difficulty || ''}
                                            onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Course description..."
                                        value={newCourse.description || ''}
                                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                        className="mt-1 rounded-xl"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Duration</Label>
                                        <Input
                                            placeholder="e.g., 10 mins"
                                            value={newCourse.duration || ''}
                                            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label>Signs (comma-separated)</Label>
                                        <Input
                                            placeholder="e.g., Hello, Thank You"
                                            value={newCourse.signs?.join(', ') || ''}
                                            onChange={(e) => setNewCourse({ ...newCourse, signs: e.target.value.split(',').map(s => s.trim()) })}
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleAddCourse} className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Course
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Existing Courses */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {courses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <span>{course.title}</span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => setEditingCourse(course)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteCourse(course.id)}
                                                        className="h-8 w-8 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                    {course.difficulty}
                                                </span>
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    {course.duration}
                                                </span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                    {course.signs.length} signs
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Edit Course Modal */}
                        {editingCourse && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            Edit Course
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setEditingCourse(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label>Title</Label>
                                            <Input
                                                value={editingCourse.title}
                                                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                                                className="mt-1 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <Textarea
                                                value={editingCourse.description}
                                                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                                                className="mt-1 rounded-xl"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Difficulty</Label>
                                                <Input
                                                    value={editingCourse.difficulty}
                                                    onChange={(e) => setEditingCourse({ ...editingCourse, difficulty: e.target.value })}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <Label>Duration</Label>
                                                <Input
                                                    value={editingCourse.duration}
                                                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={handleUpdateCourse} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600">
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    {/* Signs Catalog Tab */}
                    <TabsContent value="signs" className="space-y-6">
                        {/* Add New Sign */}
                        <Card className="border-2 border-dashed border-indigo-200 bg-indigo-50/50">
                            <CardHeader>
                                <CardTitle className="flex items-center text-indigo-700">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add New Sign
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Sign Name</Label>
                                        <Input
                                            placeholder="e.g., Hello"
                                            value={newSign.name || ''}
                                            onChange={(e) => setNewSign({ ...newSign, name: e.target.value })}
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label>Category</Label>
                                        <Input
                                            placeholder="e.g., Greetings"
                                            value={newSign.category || ''}
                                            onChange={(e) => setNewSign({ ...newSign, category: e.target.value })}
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label>Video Path</Label>
                                        <Input
                                            placeholder="/assets/video.mp4"
                                            value={newSign.videoUrl || ''}
                                            onChange={(e) => setNewSign({ ...newSign, videoUrl: e.target.value })}
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleAddSign} className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Sign
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Existing Signs */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {signs.map((sign) => (
                                <motion.div
                                    key={sign.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between text-lg">
                                                <span>{sign.name}</span>
                                                <div className="flex gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => setEditingSign(sign)}
                                                        className="h-7 w-7"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteSign(sign.id)}
                                                        className="h-7 w-7 text-red-600"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                                {sign.category}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-2 truncate">{sign.videoUrl}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Edit Sign Modal */}
                        {editingSign && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                <Card className="w-full max-w-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            Edit Sign
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setEditingSign(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label>Name</Label>
                                            <Input
                                                value={editingSign.name}
                                                onChange={(e) => setEditingSign({ ...editingSign, name: e.target.value })}
                                                className="mt-1 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label>Category</Label>
                                            <Input
                                                value={editingSign.category}
                                                onChange={(e) => setEditingSign({ ...editingSign, category: e.target.value })}
                                                className="mt-1 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label>Video Path</Label>
                                            <Input
                                                value={editingSign.videoUrl}
                                                onChange={(e) => setEditingSign({ ...editingSign, videoUrl: e.target.value })}
                                                className="mt-1 rounded-xl"
                                            />
                                        </div>
                                        <Button onClick={handleUpdateSign} className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600">
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    {/* Pipeline Tab */}
                    <TabsContent value="pipeline" className="space-y-6">
                        <Card className="border-2 border-dashed border-purple-200 bg-white/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center text-indigo-700">
                                        <Cpu className="h-6 w-6 mr-2" />
                                        Autonomous ISL Video-to-3D Pipeline
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePipelineUpload} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* File Upload Zone */}
                                        <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors">
                                            <UploadCloud className="h-10 w-10 text-indigo-400 mb-2" />
                                            <p className="text-sm font-medium text-indigo-900 mb-1">
                                                {pipelineForm.file ? pipelineForm.file.name : "Upload raw sign video"}
                                            </p>
                                            <p className="text-xs text-indigo-500 mb-4">
                                                MP4 | WebM | MOV (max 500 MB)
                                            </p>
                                            <Label htmlFor="pipeline-file" className="cursor-pointer bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
                                                Select File
                                            </Label>
                                            <Input 
                                                id="pipeline-file" 
                                                type="file" 
                                                className="hidden" 
                                                accept="video/mp4,video/webm,video/quicktime"
                                                onChange={(e) => setPipelineForm({...pipelineForm, file: e.target.files?.[0] || null})}
                                            />
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Sign Name (e.g., 'NAMASTE')</Label>
                                                <Input 
                                                    required
                                                    value={pipelineForm.sign_name}
                                                    onChange={(e) => setPipelineForm({...pipelineForm, sign_name: e.target.value})}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <Label>Category (e.g., 'greeting')</Label>
                                                <Input 
                                                    value={pipelineForm.category}
                                                    onChange={(e) => setPipelineForm({...pipelineForm, category: e.target.value})}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <Label>Region (e.g., 'Delhi')</Label>
                                                <Input 
                                                    value={pipelineForm.region}
                                                    onChange={(e) => setPipelineForm({...pipelineForm, region: e.target.value})}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                        <Button type="submit" className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl transition-all">
                                            <Cpu className="h-4 w-4 mr-2" />
                                            Trigger Processing Pipeline
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Pipeline Status Widget */}
                        {pipelineJob && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="border border-indigo-100 overflow-hidden relative">
                                    {pipelineJob.status === 'processing' && (
                                        <div 
                                            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-linear"
                                            style={{ width: `${pipelineJob.progress}%` }}
                                        />
                                    )}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                pipelineJob.status === 'queued' ? 'bg-yellow-100 text-yellow-700' :
                                                pipelineJob.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {pipelineJob.status === 'queued' ? <Clock className="h-5 w-5" /> :
                                                 pipelineJob.status === 'processing' ? <Cpu className="h-5 w-5 animate-pulse" /> :
                                                 <CheckCircle className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    Job ID: {pipelineJob.id}
                                                </h4>
                                                <p className="text-sm text-gray-500 capitalize">
                                                    Status: {pipelineJob.status} {pipelineJob.status === 'processing' && `(${pipelineJob.progress}%)`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {pipelineJob.status === 'completed' 
                                                ? 'Exported to AR Library' 
                                                : 'Running pose estimation & GLB generation...'}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
