import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Plus,
  Trash2,
  Calculator,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Award,
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'RA';
}

interface Semester {
  id: number;
  name: string;
  subjects: Subject[];
}

const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'RA': 0
};

export const CgpaCalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: 1,
      name: 'Semester 1',
      subjects: [
        { id: '1', name: 'Data Structures & Algorithms', credits: 4, grade: 'O' },
        { id: '2', name: 'Object Oriented Programming (Java)', credits: 3, grade: 'A+' },
        { id: '3', name: 'Database Management Systems', credits: 3, grade: 'A+' },
        { id: '4', name: 'Web Technology Laboratory', credits: 2, grade: 'O' },
        { id: '5', name: 'Engineering Mathematics', credits: 4, grade: 'A' },
      ]
    },
    {
      id: 2,
      name: 'Semester 2',
      subjects: [
        { id: '6', name: 'Operating Systems', credits: 4, grade: 'O' },
        { id: '7', name: 'Computer Networks', credits: 3, grade: 'A+' },
        { id: '8', name: 'Python Programming Lab', credits: 2, grade: 'O' },
      ]
    }
  ]);

  const [activeSemId, setActiveSemId] = useState<number>(1);

  // Helper calculations
  const calculateSGPA = (subList: Subject[]): number => {
    let totalPoints = 0;
    let totalCredits = 0;

    subList.forEach((s) => {
      const pt = GRADE_POINTS[s.grade] || 0;
      totalPoints += pt * s.credits;
      totalCredits += s.credits;
    });

    return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
  };

  const calculateCGPA = (): { cgpa: number; totalCredits: number; totalSemesters: number } => {
    let grandPoints = 0;
    let grandCredits = 0;

    semesters.forEach((sem) => {
      sem.subjects.forEach((s) => {
        const pt = GRADE_POINTS[s.grade] || 0;
        grandPoints += pt * s.credits;
        grandCredits += s.credits;
      });
    });

    const cgpa = grandCredits > 0 ? parseFloat((grandPoints / grandCredits).toFixed(2)) : 0;
    return { cgpa, totalCredits: grandCredits, totalSemesters: semesters.length };
  };

  // Handlers
  const handleAddSubject = () => {
    soundFx.playClick();
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id === activeSemId) {
          return {
            ...sem,
            subjects: [
              ...sem.subjects,
              {
                id: Date.now().toString(),
                name: `New Course ${sem.subjects.length + 1}`,
                credits: 3,
                grade: 'A+'
              }
            ]
          };
        }
        return sem;
      })
    );
  };

  const handleUpdateSubject = (id: string, field: keyof Subject, value: any) => {
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id === activeSemId) {
          return {
            ...sem,
            subjects: sem.subjects.map((sub) => {
              if (sub.id === id) {
                return { ...sub, [field]: value };
              }
              return sub;
            })
          };
        }
        return sem;
      })
    );
  };

  const handleDeleteSubject = (id: string) => {
    soundFx.playClick();
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id === activeSemId) {
          return {
            ...sem,
            subjects: sem.subjects.filter((s) => s.id !== id)
          };
        }
        return sem;
      })
    );
  };

  const handleAddSemester = () => {
    soundFx.playClick();
    const nextId = semesters.length + 1;
    setSemesters([
      ...semesters,
      {
        id: nextId,
        name: `Semester ${nextId}`,
        subjects: [
          { id: Date.now().toString(), name: 'Core Subject 1', credits: 4, grade: 'A+' }
        ]
      }
    ]);
    setActiveSemId(nextId);
  };

  const triggerConfettiCelebration = () => {
    soundFx.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const currentSem = semesters.find((s) => s.id === activeSemId) || semesters[0];
  const currentSgpa = currentSem ? calculateSGPA(currentSem.subjects) : 0;
  const { cgpa, totalCredits } = calculateCGPA();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>SGPA & CGPA Calculator</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">
                  Interactive App
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Created by Santhosh R for quick & accurate academic grade tracking
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Results Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* CGPA Score */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-sky-950 to-slate-900 border border-sky-500/40 text-center space-y-1 relative overflow-hidden">
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                Overall CGPA
              </span>
              <p className="text-4xl font-extrabold text-white text-glow-cyan">
                {cgpa.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Across {totalCredits} Total Credit Hours
              </p>
            </div>

            {/* Current Semester SGPA */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-950 to-slate-900 border border-purple-500/40 text-center space-y-1">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                {currentSem?.name} SGPA
              </span>
              <p className="text-4xl font-extrabold text-white text-glow-purple">
                {currentSgpa.toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentSem?.subjects.length} Subjects Listed
              </p>
            </div>

            {/* Action Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <button
                onClick={triggerConfettiCelebration}
                onMouseEnter={() => soundFx.playHover()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-4 h-4" />
                <span>Celebrate Grade Score!</span>
              </button>
              <p className="text-[10px] text-slate-500 font-mono text-center">
                Grading Scale: O (10), A+ (9), A (8), B+ (7), B (6), C (5), RA (0)
              </p>
            </div>

          </div>

          {/* Semester Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 overflow-x-auto">
            <div className="flex items-center gap-2">
              {semesters.map((sem) => (
                <button
                  key={sem.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveSemId(sem.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeSemId === sem.id
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sem.name}
                </button>
              ))}

              <button
                onClick={handleAddSemester}
                onMouseEnter={() => soundFx.playHover()}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-400 text-xs font-mono flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Semester</span>
              </button>
            </div>
          </div>

          {/* Subject Entry Table / Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Course Grades ({currentSem?.name})</span>
              </h3>

              <button
                onClick={handleAddSubject}
                onMouseEnter={() => soundFx.playHover()}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="space-y-2">
              {currentSem?.subjects.map((sub, index) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-12 gap-3 items-center hover:border-slate-700 transition-colors"
                >
                  {/* Subject Name Input */}
                  <div className="col-span-12 sm:col-span-6 flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 w-5">
                      #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleUpdateSubject(sub.id, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                      placeholder="Course Name"
                    />
                  </div>

                  {/* Credits Select */}
                  <div className="col-span-5 sm:col-span-3 flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400">Credits:</span>
                    <select
                      value={sub.credits}
                      onChange={(e) => handleUpdateSubject(sub.id, 'credits', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((c) => (
                        <option key={c} value={c}>
                          {c} Credits
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Grade Select */}
                  <div className="col-span-5 sm:col-span-2 flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400">Grade:</span>
                    <select
                      value={sub.grade}
                      onChange={(e) => handleUpdateSubject(sub.id, 'grade', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-sky-300 focus:outline-none focus:border-sky-500"
                    >
                      {Object.keys(GRADE_POINTS).map((g) => (
                        <option key={g} value={g}>
                          {g} ({GRADE_POINTS[g]} pts)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleDeleteSubject(sub.id)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>GPA Formula: Σ(Credit × Point) / Σ(Credits)</span>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
