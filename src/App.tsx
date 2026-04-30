/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  BookOpen, 
  Phone, 
  PlusCircle, 
  CheckCircle, 
  List, 
  GraduationCap,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Student, NewStudent } from './types';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<NewStudent>({
    name: '',
    email: '',
    course: '',
    phone: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', course: '', phone: '' });
      fetchStudents();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">ScholarReg</h1>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
            <span className="hidden sm:inline">Enrolled: {students.length}</span>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-500" />
              <span>Supabase Connected</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Registration Form Column */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Student Registration</h2>
                  <p className="text-slate-500">Fill in the details below to enroll a new student.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User size={16} className="text-slate-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Mail size={16} className="text-slate-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@university.edu"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Course Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <BookOpen size={16} className="text-slate-400" />
                        Course
                      </label>
                      <select
                        name="course"
                        required
                        value={formData.course}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                      >
                        <option value="">Select Course</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Advanced Mathematics">Advanced Mathematics</option>
                        <option value="Digital Arts">Digital Arts</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Economics">Economics</option>
                      </select>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Phone size={16} className="text-slate-400" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Feedback Messages */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 border border-red-100"
                      >
                        <AlertCircle size={16} />
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm flex items-center gap-2 border border-emerald-100"
                      >
                        <CheckCircle size={16} />
                        Student registered successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <PlusCircle size={20} />
                        Register Student
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Registrations List Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <List size={20} className="text-slate-400" />
                Recent Registrations
              </h3>
              <button 
                onClick={fetchStudents}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200"
              >
                Refresh List
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {loading && students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm">Fetching student roster...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                    <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <GraduationCap size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No students registered yet.</p>
                    <p className="text-slate-400 text-sm">New registrations will appear here.</p>
                  </div>
                ) : (
                  students.map((student, index) => (
                    <motion.div
                      layout
                      key={student.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-600/5 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          {student.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900">{student.name}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Mail size={12} />
                              {student.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} />
                              {student.course}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Registered On</p>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <Clock size={12} />
                            {new Date(student.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="ml-auto sm:ml-0 bg-slate-50 sm:p-2 sm:rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle size={18} className="text-emerald-500" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 mt-12 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2024 ScholarReg Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
