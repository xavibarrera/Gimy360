/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Gimy360 - Workout Tracker & Progresión de Cargas
 * Aplicación Web Progresiva (PWA) Offline-First para Registro de Gimnasio
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dumbbell,
  Play,
  Check,
  Plus,
  Trash2,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  Settings as SettingsIcon,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Flame,
  Trophy,
  Download,
  Upload,
  Sparkles,
  Zap,
  Layers,
  Activity,
  Award,
  Maximize2,
  Minimize2,
  Copy,
  ChevronDown
} from 'lucide-react';

/* ==========================================================================
   TIPOS DE DATOS Y MODELOS
   ========================================================================== */

export type Equipment = 'barra' | 'mancuerna' | 'polea' | 'smith' | 'maquina' | 'corporal';

export type MuscleGroup = 'pecho' | 'espalda' | 'piernas' | 'hombro' | 'brazos' | 'core';

export type SetType = 'N' | 'W' | 'F' | 'D'; // Normal, Warmup (Calentamiento), Failure (Fallo), Drop-set

export interface Exercise {
  id: string;
  name: string;
  equipment: Equipment;
  muscle: MuscleGroup;
  isCustom?: boolean;
  notes?: string;
}

export interface WorkoutSet {
  id: string;
  type: SetType;
  weight: number;
  reps: number;
  completed: boolean;
  completedAt?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  notes?: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  routineId?: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface Routine {
  id: string;
  title: string;
  category: string;
  description: string;
  exerciseIds: string[];
  isCustom?: boolean;
}

export interface AppSettings {
  unit: 'kg' | 'lb';
  defaultRestTime: number; // segundos
  soundEnabled: boolean;
  vibrateEnabled: boolean;
}

/* ==========================================================================
   BASE DE DATOS INICIAL DE EJERCICIOS Y RUTINAS
   ========================================================================== */

const INITIAL_EXERCISES: Exercise[] = [
  // Pecho
  { id: 'ex-1', name: 'Press de Banca Plano', equipment: 'barra', muscle: 'pecho' },
  { id: 'ex-2', name: 'Press Inclinado con Mancuernas', equipment: 'mancuerna', muscle: 'pecho' },
  { id: 'ex-3', name: 'Aperturas en Cruce de Poleas', equipment: 'polea', muscle: 'pecho' },
  { id: 'ex-4', name: 'Press de Pecho en Máquina', equipment: 'maquina', muscle: 'pecho' },
  { id: 'ex-5', name: 'Fondos en Paralelas (Dips)', equipment: 'corporal', muscle: 'pecho' },
  { id: 'ex-6', name: 'Press Inclinado en Multipower', equipment: 'smith', muscle: 'pecho' },

  // Espalda
  { id: 'ex-7', name: 'Jalón al Pecho en Polea', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-8', name: 'Remo con Barra 45°', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-9', name: 'Remo Gironda en Polea Baja', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-10', name: 'Dominadas Pronas', equipment: 'corporal', muscle: 'espalda' },
  { id: 'ex-11', name: 'Peso Muerto Convencional', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-12', name: 'Remo con Mancuerna a una Mano', equipment: 'mancuerna', muscle: 'espalda' },
  { id: 'ex-13', name: 'Pull-over en Polea Alta', equipment: 'polea', muscle: 'espalda' },

  // Piernas
  { id: 'ex-14', name: 'Sentadilla Trasera con Barra', equipment: 'barra', muscle: 'piernas' },
  { id: 'ex-15', name: 'Prensa Inclinada 45°', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-16', name: 'Extensión de Cuádriceps', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-17', name: 'Curl Femoral Tumbado', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-18', name: 'Sentadilla Búlgara con Mancuernas', equipment: 'mancuerna', muscle: 'piernas' },
  { id: 'ex-19', name: 'Hip Thrust con Barra', equipment: 'barra', muscle: 'piernas' },
  { id: 'ex-20', name: 'Elevación de Gemelos de Pie', equipment: 'smith', muscle: 'piernas' },

  // Hombro
  { id: 'ex-21', name: 'Press Militar de Pie con Barra', equipment: 'barra', muscle: 'hombro' },
  { id: 'ex-22', name: 'Elevaciones Laterales con Mancuerna', equipment: 'mancuerna', muscle: 'hombro' },
  { id: 'ex-23', name: 'Elevaciones Laterales en Polea', equipment: 'polea', muscle: 'hombro' },
  { id: 'ex-24', name: 'Face Pull con Cuerda', equipment: 'polea', muscle: 'hombro' },
  { id: 'ex-25', name: 'Pájaros para Deltoides Posterior', equipment: 'mancuerna', muscle: 'hombro' },
  { id: 'ex-26', name: 'Press Militar en Smith', equipment: 'smith', muscle: 'hombro' },

  // Brazos
  { id: 'ex-27', name: 'Curl de Bíceps con Barra Z', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-28', name: 'Curl Martillo con Mancuernas', equipment: 'mancuerna', muscle: 'brazos' },
  { id: 'ex-29', name: 'Curl en Banco Scott', equipment: 'maquina', muscle: 'brazos' },
  { id: 'ex-30', name: 'Extensiones de Tríceps en Polea', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-31', name: 'Press Francés con Barra Z', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-32', name: 'Fondos entre Bancos para Tríceps', equipment: 'corporal', muscle: 'brazos' },

  // Core
  { id: 'ex-33', name: 'Crunch Abdominal en Polea Alta', equipment: 'polea', muscle: 'core' },
  { id: 'ex-34', name: 'Elevación de Piernas Colgado', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-35', name: 'Plancha Isométrica', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-36', name: 'Rueda Abdominal (Ab Wheel)', equipment: 'corporal', muscle: 'core' },
];

const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'rot-1',
    title: 'Torso / Empuje (Push)',
    category: 'Fuerza e Hipertrofia',
    description: 'Enfocado en pectoral mayor, deltoides anterior/lateral y tríceps.',
    exerciseIds: ['ex-1', 'ex-2', 'ex-22', 'ex-30', 'ex-5'],
  },
  {
    id: 'rot-2',
    title: 'Espalda & Jalón (Pull)',
    category: 'Densidad y Amplitud',
    description: 'Trabajo completo de dorsales, trapecios, romboides y bíceps.',
    exerciseIds: ['ex-8', 'ex-7', 'ex-9', 'ex-24', 'ex-27'],
  },
  {
    id: 'rot-3',
    title: 'Pierna & Fuerza (Legs)',
    category: 'Cadena Anterior y Posterior',
    description: 'Cuádriceps, femorales, glúteos y gemelos con cargas progresivas.',
    exerciseIds: ['ex-14', 'ex-15', 'ex-17', 'ex-19', 'ex-20'],
  },
  {
    id: 'rot-4',
    title: 'Full Body Acelera',
    category: 'Cuerpo Completo',
    description: 'Sesión integral multiarticular de alta intensidad para todo el cuerpo.',
    exerciseIds: ['ex-1', 'ex-14', 'ex-7', 'ex-21', 'ex-33'],
  },
];

/* ==========================================================================
   UTILIDADES & HELPERS
   ========================================================================== */

// Estimación de 1RM con la fórmula de Epley
export function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return Math.round(weight * 10) / 10;
  // Fórmula Epley: Peso * (1 + reps / 30)
  const oneRM = weight * (1 + reps / 30);
  return Math.round(oneRM * 10) / 10;
}

// Generador de sonido con Web Audio API (100% offline, sin archivos externos)
function triggerAudioChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tono 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // Tono 2 (más agudo)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (err) {
    console.warn('AudioContext error:', err);
  }
}

// Formateador de segundos a mm:ss o hh:mm:ss
function formatTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Icono según equipamiento
function getEquipmentBadge(equipment: Equipment) {
  switch (equipment) {
    case 'barra':
      return { label: 'Barra', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'mancuerna':
      return { label: 'Mancuerna', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
    case 'polea':
      return { label: 'Polea / Cable', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'smith':
      return { label: 'Smith / Multi', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    case 'maquina':
      return { label: 'Máquina', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    case 'corporal':
      return { label: 'Corporal', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
  }
}

function getMuscleBadge(muscle: MuscleGroup) {
  const map: Record<MuscleGroup, string> = {
    pecho: 'Pecho',
    espalda: 'Espalda',
    piernas: 'Piernas',
    hombro: 'Hombro',
    brazos: 'Brazos',
    core: 'Core',
  };
  return map[muscle] || muscle;
}

// Disparador de confeti en Canvas puro (cero dependencias externas)
function fireConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const pieces: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
  }> = [];

  const colors = ['#22c55e', '#06b6d4', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: width / 2,
      y: height / 2 - 50,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
    });
  }

  let animationFrame: number;
  const startTime = Date.now();

  function animate() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    if (elapsed > 2500) {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravedad
      p.vx *= 0.98; // fricción
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    animationFrame = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */

export default function App() {
  // Navegación principal: 'rutinas' | 'entreno' | 'ejercicios' | 'historial' | 'ajustes'
  const [activeTab, setActiveTab] = useState<'rutinas' | 'entreno' | 'ejercicios' | 'historial' | 'ajustes'>('rutinas');

  // Estado de Ejercicios
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('gimy360_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  // Estado de Rutinas
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('gimy360_routines');
    return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
  });

  // Historial de Entrenamientos Completados
  const [history, setHistory] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('gimy360_history');
    if (saved) return JSON.parse(saved);

    // Muestra inicial de sesiones para ver el calendario y las gráficas inmediatamente
    const now = Date.now();
    const oneDay = 86400000;
    return [
      {
        id: 'hist-1',
        title: 'Torso / Empuje (Push)',
        startTime: now - oneDay * 5,
        endTime: now - oneDay * 5 + 3720000,
        durationSeconds: 3720,
        exercises: [
          {
            id: 'we-1',
            exerciseId: 'ex-1',
            sets: [
              { id: 's-1', type: 'W', weight: 40, reps: 15, completed: true },
              { id: 's-2', type: 'N', weight: 70, reps: 10, completed: true },
              { id: 's-3', type: 'N', weight: 75, reps: 8, completed: true },
              { id: 's-4', type: 'F', weight: 80, reps: 6, completed: true },
            ],
          },
          {
            id: 'we-2',
            exerciseId: 'ex-2',
            sets: [
              { id: 's-5', type: 'N', weight: 26, reps: 10, completed: true },
              { id: 's-6', type: 'N', weight: 28, reps: 8, completed: true },
              { id: 's-7', type: 'N', weight: 28, reps: 8, completed: true },
            ],
          },
        ],
      },
      {
        id: 'hist-2',
        title: 'Espalda & Jalón (Pull)',
        startTime: now - oneDay * 3,
        endTime: now - oneDay * 3 + 4100000,
        durationSeconds: 4100,
        exercises: [
          {
            id: 'we-3',
            exerciseId: 'ex-8',
            sets: [
              { id: 's-8', type: 'N', weight: 60, reps: 10, completed: true },
              { id: 's-9', type: 'N', weight: 70, reps: 8, completed: true },
              { id: 's-10', type: 'F', weight: 75, reps: 7, completed: true },
            ],
          },
          {
            id: 'we-4',
            exerciseId: 'ex-7',
            sets: [
              { id: 's-11', type: 'N', weight: 55, reps: 12, completed: true },
              { id: 's-12', type: 'N', weight: 65, reps: 10, completed: true },
              { id: 's-13', type: 'N', weight: 70, reps: 8, completed: true },
            ],
          },
        ],
      },
      {
        id: 'hist-3',
        title: 'Pierna & Fuerza (Legs)',
        startTime: now - oneDay * 1,
        endTime: now - oneDay * 1 + 4500000,
        durationSeconds: 4500,
        exercises: [
          {
            id: 'we-5',
            exerciseId: 'ex-14',
            sets: [
              { id: 's-14', type: 'W', weight: 60, reps: 10, completed: true },
              { id: 's-15', type: 'N', weight: 90, reps: 8, completed: true },
              { id: 's-16', type: 'N', weight: 100, reps: 6, completed: true },
              { id: 's-17', type: 'F', weight: 110, reps: 5, completed: true },
            ],
          },
          {
            id: 'we-6',
            exerciseId: 'ex-15',
            sets: [
              { id: 's-18', type: 'N', weight: 160, reps: 10, completed: true },
              { id: 's-19', type: 'N', weight: 180, reps: 10, completed: true },
            ],
          },
        ],
      },
    ];
  });

  // Ajustes de la App
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('gimy360_settings');
    return saved
      ? JSON.parse(saved)
      : {
          unit: 'kg',
          defaultRestTime: 90,
          soundEnabled: true,
          vibrateEnabled: true,
        };
  });

  // Sesión de entrenamiento activa (si hay una en curso)
  const [activeWorkout, setActiveWorkout] = useState<{
    id: string;
    title: string;
    routineId?: string;
    startTime: number;
    exercises: WorkoutExercise[];
    isPaused: boolean;
    pausedAt?: number;
    totalPausedTime: number;
  } | null>(() => {
    const saved = localStorage.getItem('gimy360_active_workout');
    return saved ? JSON.parse(saved) : null;
  });

  // Cronómetro del entreno activo
  const [elapsedWorkoutSeconds, setElapsedWorkoutSeconds] = useState<number>(0);

  // Temporizador de descanso flotante
  const [restTimer, setRestTimer] = useState<{
    totalDuration: number;
    remaining: number;
    isActive: boolean;
    isMinimized: boolean;
  }>({
    totalDuration: settings.defaultRestTime,
    remaining: 0,
    isActive: false,
    isMinimized: false,
  });

  // Modales y estados de vista
  const [showAddExerciseModal, setShowAddExerciseModal] = useState<boolean>(false);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState<boolean>(false);
  const [showCreateRoutineModal, setShowCreateRoutineModal] = useState<boolean>(false);
  const [showFinishModal, setShowFinishModal] = useState<WorkoutSession | null>(null);

  // Filtros de ejercicios
  const [searchExerciseQuery, setSearchExerciseQuery] = useState<string>('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('todos');

  // Sub-pestaña en Historial: 'calendario' | 'progreso'
  const [historySubTab, setHistorySubTab] = useState<'calendario' | 'progreso'>('calendario');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date());
  const [selectedHistoryExerciseId, setSelectedHistoryExerciseId] = useState<string>('ex-1');

  // PWA Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // Referencia para timer de descanso
  const restIntervalRef = useRef<number | null>(null);

  /* ==========================================================================
     PERSISTENCIA EN LOCALSTORAGE
     ========================================================================== */

  useEffect(() => {
    localStorage.setItem('gimy360_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('gimy360_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('gimy360_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('gimy360_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem('gimy360_active_workout', JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem('gimy360_active_workout');
    }
  }, [activeWorkout]);

  // Listener para instalación PWA
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  /* ==========================================================================
     RELOJ PRINCIPAL DE ENTRENAMIENTO
     ========================================================================== */

  useEffect(() => {
    if (!activeWorkout || activeWorkout.isPaused) return;

    const interval = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - activeWorkout.startTime - activeWorkout.totalPausedTime) / 1000);
      setElapsedWorkoutSeconds(Math.max(0, elapsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  /* ==========================================================================
     TEMPORIZADOR DE DESCANSO (REST TIMER)
     ========================================================================== */

  useEffect(() => {
    if (!restTimer.isActive) {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
      return;
    }

    restIntervalRef.current = window.setInterval(() => {
      setRestTimer((prev) => {
        if (!prev.isActive) return prev;
        if (prev.remaining <= 1) {
          // Temporizador terminado!
          if (settings.soundEnabled) triggerAudioChime();
          if (settings.vibrateEnabled && 'vibrate' in navigator) {
            try {
              navigator.vibrate([200, 100, 200, 100, 400]);
            } catch {
              // Ignore
            }
          }
          return { ...prev, remaining: 0, isActive: false };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);

    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [restTimer.isActive, settings.soundEnabled, settings.vibrateEnabled]);

  const startRestTimer = (seconds?: number) => {
    const duration = seconds ?? settings.defaultRestTime;
    setRestTimer({
      totalDuration: duration,
      remaining: duration,
      isActive: true,
      isMinimized: false,
    });
  };

  const adjustRestTimer = (delta: number) => {
    setRestTimer((prev) => {
      const newRemaining = Math.max(5, prev.remaining + delta);
      const newTotal = Math.max(newRemaining, prev.totalDuration + (delta > 0 ? delta : 0));
      return {
        ...prev,
        remaining: newRemaining,
        totalDuration: newTotal,
        isActive: true,
      };
    });
  };

  const cancelRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, isActive: false, remaining: 0 }));
  };

  /* ==========================================================================
     GESTIÓN DE ENTRENAMIENTOS
     ========================================================================== */

  // Iniciar entrenamiento libre
  const handleStartFreeWorkout = () => {
    const newWorkout = {
      id: 'wkt-' + Date.now(),
      title: 'Entrenamiento Libre',
      startTime: Date.now(),
      exercises: [],
      isPaused: false,
      totalPausedTime: 0,
    };
    setActiveWorkout(newWorkout);
    setElapsedWorkoutSeconds(0);
    setActiveTab('entreno');
  };

  // Iniciar entrenamiento desde una rutina
  const handleStartRoutineWorkout = (routine: Routine) => {
    const initialExercises: WorkoutExercise[] = routine.exerciseIds.map((exId, idx) => {
      // Buscar datos de la última sesión para este ejercicio para precargar series de referencia
      const lastSessionSets = getPreviousExerciseSets(exId);
      const defaultSets: WorkoutSet[] =
        lastSessionSets.length > 0
          ? lastSessionSets.map((s, sIdx) => ({
              id: `set-${idx}-${sIdx}-${Date.now()}`,
              type: s.type || 'N',
              weight: s.weight,
              reps: s.reps,
              completed: false,
            }))
          : [
              { id: `set-${idx}-1-${Date.now()}`, type: 'N', weight: 20, reps: 10, completed: false },
              { id: `set-${idx}-2-${Date.now()}`, type: 'N', weight: 20, reps: 10, completed: false },
              { id: `set-${idx}-3-${Date.now()}`, type: 'N', weight: 20, reps: 10, completed: false },
            ];

      return {
        id: `we-${idx}-${Date.now()}`,
        exerciseId: exId,
        sets: defaultSets,
      };
    });

    const newWorkout = {
      id: 'wkt-' + Date.now(),
      title: routine.title,
      routineId: routine.id,
      startTime: Date.now(),
      exercises: initialExercises,
      isPaused: false,
      totalPausedTime: 0,
    };

    setActiveWorkout(newWorkout);
    setElapsedWorkoutSeconds(0);
    setActiveTab('entreno');
  };

  // Obtener series de la última sesión completada para un ejercicio (Ghost / Placeholder data)
  function getPreviousExerciseSets(exerciseId: string): WorkoutSet[] {
    for (const session of history) {
      const match = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (match && match.sets && match.sets.length > 0) {
        return match.sets.filter((s) => s.completed);
      }
    }
    return [];
  }

  // Añadir ejercicio al entreno activo
  const handleAddExerciseToWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;
    const lastSessionSets = getPreviousExerciseSets(exerciseId);
    const initialSets: WorkoutSet[] =
      lastSessionSets.length > 0
        ? lastSessionSets.map((s, i) => ({
            id: `set-${Date.now()}-${i}`,
            type: s.type || 'N',
            weight: s.weight,
            reps: s.reps,
            completed: false,
          }))
        : [
            { id: `set-${Date.now()}-1`, type: 'N', weight: 20, reps: 10, completed: false },
            { id: `set-${Date.now()}-2`, type: 'N', weight: 20, reps: 10, completed: false },
            { id: `set-${Date.now()}-3`, type: 'N', weight: 20, reps: 10, completed: false },
          ];

    const newExercise: WorkoutExercise = {
      id: `we-${Date.now()}`,
      exerciseId,
      sets: initialSets,
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise],
    });
    setShowAddExerciseModal(false);
  };

  // Quitar ejercicio del entreno activo
  const handleRemoveExerciseFromWorkout = (exerciseIndex: number) => {
    if (!activeWorkout) return;
    const updated = [...activeWorkout.exercises];
    updated.splice(exerciseIndex, 1);
    setActiveWorkout({ ...activeWorkout, exercises: updated });
  };

  // Modificar serie en entreno activo
  const handleUpdateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof WorkoutSet,
    value: any
  ) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const targetExercise = { ...updatedExercises[exIndex] };
    const updatedSets = [...targetExercise.sets];
    const targetSet = { ...updatedSets[setIndex], [field]: value };

    // Si se marca como completada y antes no lo estaba -> disparar temporizador de descanso
    if (field === 'completed' && value === true && !updatedSets[setIndex].completed) {
      targetSet.completedAt = Date.now();
      startRestTimer(settings.defaultRestTime);
    }

    updatedSets[setIndex] = targetSet;
    targetExercise.sets = updatedSets;
    updatedExercises[exIndex] = targetExercise;

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises,
    });
  };

  // Añadir nueva serie a un ejercicio
  const handleAddSet = (exIndex: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const targetEx = { ...updatedExercises[exIndex] };
    const lastSet = targetEx.sets[targetEx.sets.length - 1];
    const newSet: WorkoutSet = {
      id: `set-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: lastSet ? lastSet.type : 'N',
      weight: lastSet ? lastSet.weight : 20,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    };
    targetEx.sets = [...targetEx.sets, newSet];
    updatedExercises[exIndex] = targetEx;
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  // Eliminar serie de un ejercicio
  const handleRemoveSet = (exIndex: number, setIndex: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const targetEx = { ...updatedExercises[exIndex] };
    if (targetEx.sets.length <= 1) return; // Mínimo 1 serie
    targetEx.sets = targetEx.sets.filter((_, i) => i !== setIndex);
    updatedExercises[exIndex] = targetEx;
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  // Cancelar entreno
  const handleCancelWorkout = () => {
    if (window.confirm('¿Seguro que deseas cancelar este entrenamiento? No se guardará el progreso actual.')) {
      setActiveWorkout(null);
      setRestTimer((p) => ({ ...p, isActive: false, remaining: 0 }));
    }
  };

  // Finalizar y Guardar Entrenamiento
  const handleFinishWorkout = () => {
    if (!activeWorkout) return;

    const endTime = Date.now();
    const duration = elapsedWorkoutSeconds > 0 ? elapsedWorkoutSeconds : Math.floor((endTime - activeWorkout.startTime) / 1000);

    // Filtrar solo ejercicios que tengan al menos 1 serie completada
    const cleanedExercises = activeWorkout.exercises
      .map((ex) => ({
        ...ex,
        sets: ex.sets.filter((s) => s.completed),
      }))
      .filter((ex) => ex.sets.length > 0);

    if (cleanedExercises.length === 0) {
      if (!window.confirm('No has marcado ninguna serie como completada. ¿Deseas finalizar y descartar el entrenamiento?')) {
        return;
      }
      setActiveWorkout(null);
      return;
    }

    const completedSession: WorkoutSession = {
      id: 'session-' + Date.now(),
      title: activeWorkout.title,
      routineId: activeWorkout.routineId,
      startTime: activeWorkout.startTime,
      endTime,
      durationSeconds: duration,
      exercises: cleanedExercises,
    };

    // Guardar en historial
    setHistory((prev) => [completedSession, ...prev]);

    // Limpiar entreno activo
    setActiveWorkout(null);
    cancelRestTimer();

    // Disparar confeti y mostrar modal de resumen
    fireConfetti();
    setShowFinishModal(completedSession);
  };

  /* ==========================================================================
     CREACIÓN DE EJERCICIO PERSONALIZADO
     ========================================================================== */

  const [newExName, setNewExName] = useState('');
  const [newExMuscle, setNewExMuscle] = useState<MuscleGroup>('pecho');
  const [newExEquipment, setNewExEquipment] = useState<Equipment>('mancuerna');

  const handleCreateCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx: Exercise = {
      id: 'custom-' + Date.now(),
      name: newExName.trim(),
      muscle: newExMuscle,
      equipment: newExEquipment,
      isCustom: true,
    };

    setExercises((prev) => [newEx, ...prev]);
    setNewExName('');
    setShowCreateExerciseModal(false);
  };

  /* ==========================================================================
     CREACIÓN DE RUTINA PERSONALIZADA
     ========================================================================== */

  const [newRotTitle, setNewRotTitle] = useState('');
  const [newRotCategory, setNewRotCategory] = useState('');
  const [newRotDesc, setNewRotDesc] = useState('');
  const [selectedExIdsForRoutine, setSelectedExIdsForRoutine] = useState<string[]>([]);

  const handleCreateCustomRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRotTitle.trim() || selectedExIdsForRoutine.length === 0) {
      alert('Por favor ingresa un título y selecciona al menos 1 ejercicio');
      return;
    }

    const newRot: Routine = {
      id: 'routine-' + Date.now(),
      title: newRotTitle.trim(),
      category: newRotCategory.trim() || 'Personalizada',
      description: newRotDesc.trim() || 'Rutina creada a medida',
      exerciseIds: selectedExIdsForRoutine,
      isCustom: true,
    };

    setRoutines((prev) => [...prev, newRot]);
    setNewRotTitle('');
    setNewRotCategory('');
    setNewRotDesc('');
    setSelectedExIdsForRoutine([]);
    setShowCreateRoutineModal(false);
  };

  /* ==========================================================================
     CÁLCULO DE VOLUMEN Y RÉCORDS PERSONALES (PRs)
     ========================================================================== */

  // Calcular métricas de una sesión
  const getSessionMetrics = (session: WorkoutSession) => {
    let totalVolume = 0;
    let totalSets = 0;
    session.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed) {
          totalVolume += set.weight * set.reps;
          totalSets += 1;
        }
      });
    });
    return { totalVolume, totalSets, totalExercises: session.exercises.length };
  };

  // Calcular progresión y récords para un ejercicio en particular
  const exerciseProgressData = useMemo(() => {
    if (!selectedHistoryExerciseId) return null;

    const targetEx = exercises.find((e) => e.id === selectedHistoryExerciseId);
    if (!targetEx) return null;

    const dataPoints: Array<{
      date: string;
      rawDate: number;
      bestWeight: number;
      bestReps: number;
      best1RM: number;
      totalVolume: number;
    }> = [];

    // Recorrer historial cronológico
    const sortedHistory = [...history].sort((a, b) => a.startTime - b.startTime);

    let maxAllTime1RM = 0;
    let maxAllTimeWeight = 0;

    sortedHistory.forEach((session) => {
      const match = session.exercises.find((e) => e.exerciseId === selectedHistoryExerciseId);
      if (match && match.sets.length > 0) {
        let best1RMInSession = 0;
        let bestWeightInSession = 0;
        let bestRepsInSession = 0;
        let sessionVolume = 0;

        match.sets.forEach((s) => {
          if (s.completed && s.weight > 0) {
            const oneRM = calculate1RM(s.weight, s.reps);
            sessionVolume += s.weight * s.reps;
            if (oneRM > best1RMInSession) {
              best1RMInSession = oneRM;
              bestWeightInSession = s.weight;
              bestRepsInSession = s.reps;
            }
          }
        });

        if (best1RMInSession > 0) {
          if (best1RMInSession > maxAllTime1RM) maxAllTime1RM = best1RMInSession;
          if (bestWeightInSession > maxAllTimeWeight) maxAllTimeWeight = bestWeightInSession;

          const dateObj = new Date(session.startTime);
          dataPoints.push({
            date: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`,
            rawDate: session.startTime,
            bestWeight: bestWeightInSession,
            bestReps: bestRepsInSession,
            best1RM: best1RMInSession,
            totalVolume: sessionVolume,
          });
        }
      }
    });

    return {
      exercise: targetEx,
      dataPoints,
      max1RM: maxAllTime1RM,
      maxWeight: maxAllTimeWeight,
      totalSessionsCount: dataPoints.length,
    };
  }, [selectedHistoryExerciseId, history, exercises]);

  /* ==========================================================================
     CALENDARIO INTERACTIVO
     ========================================================================== */

  const calendarDays = useMemo(() => {
    const year = selectedCalendarDate.getFullYear();
    const month = selectedCalendarDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Ajustar para que la semana empiece el Lunes (0 = Domingo en JS)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      workouts: WorkoutSession[];
    }> = [];

    // Días del mes anterior para rellenar
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false, workouts: [] });
    }

    // Días del mes actual
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const d = new Date(year, month, day);
      const dayWorkouts = history.filter((session) => {
        const sessionDate = new Date(session.startTime);
        return (
          sessionDate.getFullYear() === year &&
          sessionDate.getMonth() === month &&
          sessionDate.getDate() === day
        );
      });
      days.push({ date: d, isCurrentMonth: true, workouts: dayWorkouts });
    }

    return days;
  }, [selectedCalendarDate, history]);

  // Sesiones del día seleccionado en el calendario
  const [inspectedDay, setInspectedDay] = useState<Date>(new Date());
  const inspectedDayWorkouts = useMemo(() => {
    return history.filter((s) => {
      const d = new Date(s.startTime);
      return (
        d.getFullYear() === inspectedDay.getFullYear() &&
        d.getMonth() === inspectedDay.getMonth() &&
        d.getDate() === inspectedDay.getDate()
      );
    });
  }, [inspectedDay, history]);

  /* ==========================================================================
     BACKUP & EXPORTACIÓN JSON
     ========================================================================== */

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exercises,
      routines,
      history,
      settings,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gimy360_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.exercises && json.history) {
          if (window.confirm('¿Restaurar copia de seguridad? Esto reemplazará tus datos actuales.')) {
            setExercises(json.exercises);
            setRoutines(json.routines || INITIAL_ROUTINES);
            setHistory(json.history || []);
            if (json.settings) setSettings(json.settings);
            alert('¡Copia de seguridad restaurada con éxito!');
          }
        } else {
          alert('El archivo no contiene un formato de respaldo válido de Gimy360.');
        }
      } catch (err) {
        alert('Error al procesar el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Filtrado de ejercicios para el catálogo y selección
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchExerciseQuery.toLowerCase());
      const matchesMuscle = selectedMuscleFilter === 'todos' || ex.muscle === selectedMuscleFilter;
      return matchesSearch && matchesMuscle;
    });
  }, [exercises, searchExerciseQuery, selectedMuscleFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* ==========================================================================
          BARRA SUPERIOR (HEADER)
          ========================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-emerald-400 rotate-45" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-white">
              GIMY<span className="text-emerald-400">360</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              {activeWorkout ? 'Entreno en Curso' : 'Workout & Load Progress'}
            </span>
          </div>
        </div>

        {/* Indicador de entreno activo si no estamos en la pestaña de entreno */}
        {activeWorkout && activeTab !== 'entreno' && (
          <button
            onClick={() => setActiveTab('entreno')}
            className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse active:scale-95 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono-numbers">{formatTime(elapsedWorkoutSeconds)}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Botón rápido de iniciar entreno libre si no hay entreno activo */}
        {!activeWorkout && (
          <button
            onClick={handleStartFreeWorkout}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md shadow-emerald-500/20 active:scale-95 transition"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Libre</span>
          </button>
        )}
      </header>

      {/* ==========================================================================
          CONTENIDO PRINCIPAL (ROUTING POR PESTAÑA)
          ========================================================================== */}
      <main className="flex-1 pb-28 pt-2 px-3 sm:px-6 max-w-2xl mx-auto w-full">
        {/* ==================================================================
            PESTAÑA 1: RUTINAS Y SELECCIÓN DE ENTRENO
            ================================================================== */}
        {activeTab === 'rutinas' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Banner de Inicio Rápido */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/80 border border-slate-800 p-5 shadow-xl">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    Entrena a tu ritmo
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">¿Listo para entrenar hoy?</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Inicia un entrenamiento libre o elige tu rutina programada con registro automático de cargas.
                  </p>
                </div>
                <button
                  onClick={handleStartFreeWorkout}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>🚀 Iniciar Entreno Libre</span>
                </button>
              </div>
            </div>

            {/* Cabecera de Rutinas con Botón Crear */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Tus Rutinas</h3>
                <p className="text-xs text-slate-500">{routines.length} esquemas listos para ejecutar</p>
              </div>
              <button
                onClick={() => {
                  setSelectedExIdsForRoutine([]);
                  setShowCreateRoutineModal(true);
                }}
                className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-2 rounded-xl border border-slate-700 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Crear Rutina</span>
              </button>
            </div>

            {/* Lista de Rutinas */}
            <div className="grid gap-3.5">
              {routines.map((routine) => {
                const routineExercises = exercises.filter((ex) => routine.exerciseIds.includes(ex.id));
                return (
                  <div
                    key={routine.id}
                    className="group bg-slate-900 hover:bg-slate-850 rounded-2xl border border-slate-800/90 hover:border-slate-700 p-4 transition-all shadow-md relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {routine.category}
                          </span>
                          {routine.isCustom && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              Personalizada
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                          {routine.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{routine.description}</p>

                        {/* Chips de ejercicios */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {routineExercises.slice(0, 4).map((ex) => (
                            <span
                              key={ex.id}
                              className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60"
                            >
                              {ex.name}
                            </span>
                          ))}
                          {routineExercises.length > 4 && (
                            <span className="text-[11px] font-medium bg-slate-800/60 text-slate-400 px-2 py-1 rounded-lg">
                              +{routineExercises.length - 4} más
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botón grande de Iniciar Rutina */}
                      <button
                        onClick={() => handleStartRoutineWorkout(routine)}
                        className="self-center flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 active:scale-90 transition shrink-0"
                        title="Iniciar esta rutina"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 2: VISTA DE EJECUCIÓN DEL ENTRENO (TRACKER)
            ================================================================== */}
        {activeTab === 'entreno' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {activeWorkout ? (
              <>
                {/* Panel Superior del Entreno Activo con Cronómetro */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg sticky top-[57px] z-30 backdrop-blur-md bg-slate-900/95">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Sesión en Curso
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-white truncate max-w-[200px] sm:max-w-xs">
                        {activeWorkout.title}
                      </h2>
                    </div>

                    {/* Cronómetro grande */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-mono-numbers font-extrabold text-sm sm:text-base">
                        <Clock className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                        <span>{formatTime(elapsedWorkoutSeconds)}</span>
                      </div>
                      <button
                        onClick={handleCancelWorkout}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:scale-95 transition"
                        title="Cancelar sesión"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de Ejercicios del Entreno Activo */}
                <div className="space-y-4">
                  {activeWorkout.exercises.map((workoutEx, exIdx) => {
                    const exerciseInfo = exercises.find((e) => e.id === workoutEx.exerciseId);
                    const previousSets = getPreviousExerciseSets(workoutEx.exerciseId);

                    return (
                      <div
                        key={workoutEx.id}
                        className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 shadow-md transition-all"
                      >
                        {/* Cabecera del Ejercicio */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/20">
                              {exIdx + 1}
                            </span>
                            <div>
                              <h3 className="text-sm sm:text-base font-extrabold text-white">
                                {exerciseInfo?.name || 'Ejercicio'}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                {exerciseInfo && (
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                      getEquipmentBadge(exerciseInfo.equipment).color
                                    }`}
                                  >
                                    {getEquipmentBadge(exerciseInfo.equipment).label}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 capitalize">
                                  {exerciseInfo?.muscle}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveExerciseFromWorkout(exIdx)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg active:scale-90 transition"
                            title="Eliminar este ejercicio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Cabecera de Columnas de Series */}
                        <div className="grid grid-cols-12 gap-1.5 sm:gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 py-1 mb-1 text-center">
                          <span className="col-span-2 text-left">Serie</span>
                          <span className="col-span-3">Anterior</span>
                          <span className="col-span-3">{settings.unit.toUpperCase()}</span>
                          <span className="col-span-2">Reps</span>
                          <span className="col-span-2">Listo</span>
                        </div>

                        {/* Filas de Series */}
                        <div className="space-y-1.5">
                          {workoutEx.sets.map((set, setIdx) => {
                            const prevSet = previousSets[setIdx] || previousSets[previousSets.length - 1];
                            const ghostText = prevSet ? `${prevSet.weight}kg × ${prevSet.reps}` : '—';
                            const est1RM = calculate1RM(set.weight, set.reps);

                            return (
                              <div
                                key={set.id}
                                className={`grid grid-cols-12 gap-1.5 sm:gap-2 items-center p-1.5 rounded-xl transition-all ${
                                  set.completed
                                    ? 'bg-emerald-950/20 border border-emerald-500/30'
                                    : 'bg-slate-950/70 border border-slate-800/60'
                                }`}
                              >
                                {/* Tipo / Número de Serie */}
                                <div className="col-span-2 flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      const types: SetType[] = ['N', 'W', 'F', 'D'];
                                      const nextType = types[(types.indexOf(set.type) + 1) % types.length];
                                      handleUpdateSet(exIdx, setIdx, 'type', nextType);
                                    }}
                                    className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center transition active:scale-90 ${
                                      set.type === 'W'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                        : set.type === 'F'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                        : set.type === 'D'
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                                    }`}
                                    title={`Tipo: ${
                                      set.type === 'W'
                                        ? 'Calentamiento'
                                        : set.type === 'F'
                                        ? 'Fallo Muscular'
                                        : set.type === 'D'
                                        ? 'Drop Set'
                                        : 'Normal'
                                    } (Click para cambiar)`}
                                  >
                                    {set.type === 'N' ? setIdx + 1 : set.type}
                                  </button>
                                  {set.completed && est1RM > 0 && (
                                    <span
                                      className="hidden sm:inline text-[9px] font-bold text-slate-500"
                                      title="1RM Estimada (Epley)"
                                    >
                                      {est1RM}
                                    </span>
                                  )}
                                </div>

                                {/* Placeholder / Ghost Data previo */}
                                <div className="col-span-3 text-center text-xs font-mono-numbers text-slate-500 truncate select-text">
                                  {ghostText}
                                </div>

                                {/* Input Peso (kg) con botones de ajuste rápido */}
                                <div className="col-span-3 flex items-center justify-center">
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={set.weight === 0 ? '' : set.weight}
                                    placeholder="0"
                                    onChange={(e) =>
                                      handleUpdateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)
                                    }
                                    className="w-full text-center bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg py-1.5 text-xs sm:text-sm font-black font-mono-numbers text-white focus:outline-none"
                                  />
                                </div>

                                {/* Input Repeticiones */}
                                <div className="col-span-2 flex items-center justify-center">
                                  <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={set.reps === 0 ? '' : set.reps}
                                    placeholder="0"
                                    onChange={(e) =>
                                      handleUpdateSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)
                                    }
                                    className="w-full text-center bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg py-1.5 text-xs sm:text-sm font-black font-mono-numbers text-white focus:outline-none"
                                  />
                                </div>

                                {/* Casilla de Verificación Táctil Grande */}
                                <div className="col-span-2 flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleUpdateSet(exIdx, setIdx, 'completed', !set.completed)}
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all active:scale-90 shadow-sm ${
                                      set.completed
                                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 font-black'
                                        : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'
                                    }`}
                                  >
                                    <Check className={`w-4 h-4 ${set.completed ? 'stroke-[3]' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveSet(exIdx, setIdx)}
                                    className="text-slate-600 hover:text-rose-400 p-1 rounded transition text-xs"
                                    title="Quitar serie"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Botón "+ Añadir Serie" */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() => handleAddSet(exIdx)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-emerald-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 active:scale-95 transition"
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Añadir Serie</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botón de Añadir Ejercicio al Entreno */}
                <button
                  onClick={() => setShowAddExerciseModal(true)}
                  className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.99] transition"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Añadir Ejercicio a la Sesión</span>
                </button>

                {/* Botón Final "Finalizar y Guardar Entreno" */}
                <div className="pt-2">
                  <button
                    onClick={handleFinishWorkout}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 transition"
                  >
                    <Trophy className="w-5 h-5 fill-current" />
                    <span>Finalizar y Guardar Entreno</span>
                  </button>
                </div>
              </>
            ) : (
              /* Estado Vacío de Entreno */
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">No hay entrenamiento en curso</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Selecciona una de tus rutinas programadas o empieza una sesión libre desde cero.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs pt-2">
                  <button
                    onClick={handleStartFreeWorkout}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Entreno Libre</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('rutinas')}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider border border-slate-700 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Ver Rutinas</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 3: CATÁLOGO DE EJERCICIOS
            ================================================================== */}
        {activeTab === 'ejercicios' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Cabecera con Buscador y Botón Crear */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider">Catálogo</h2>
                  <p className="text-xs text-slate-500">
                    {exercises.length} ejercicios clásicos y personalizados
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateExerciseModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500 text-slate-950 px-3.5 py-2 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Crear Ejercicio</span>
                </button>
              </div>

              {/* Buscador Rápido */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar ejercicio por nombre..."
                  value={searchExerciseQuery}
                  onChange={(e) => setSearchExerciseQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                {searchExerciseQuery && (
                  <button
                    onClick={() => setSearchExerciseQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtro por Grupo Muscular */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {(['todos', 'pecho', 'espalda', 'piernas', 'hombro', 'brazos', 'core'] as const).map(
                  (m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMuscleFilter(m)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider whitespace-nowrap transition active:scale-95 ${
                        selectedMuscleFilter === m
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m === 'todos' ? 'Todos' : getMuscleBadge(m)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Listado de Ejercicios */}
            <div className="grid gap-2.5">
              {filteredExercises.map((exercise) => {
                const badge = getEquipmentBadge(exercise.equipment);
                // Buscar si tiene historial y mejor 1RM
                let best1RM = 0;
                history.forEach((s) => {
                  const m = s.exercises.find((e) => e.exerciseId === exercise.id);
                  if (m) {
                    m.sets.forEach((set) => {
                      if (set.completed) {
                        const val = calculate1RM(set.weight, set.reps);
                        if (val > best1RM) best1RM = val;
                      }
                    });
                  }
                });

                return (
                  <div
                    key={exercise.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        <Dumbbell className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-extrabold text-white">{exercise.name}</h4>
                          {exercise.isCustom && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {getMuscleBadge(exercise.muscle)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {best1RM > 0 ? (
                        <div className="text-right">
                          <span className="text-[9px] font-bold uppercase text-slate-500 block">Record 1RM</span>
                          <span className="text-xs font-mono-numbers font-black text-emerald-400">
                            {best1RM} {settings.unit}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600">Sin registro</span>
                      )}

                      {/* Botón ver evolución en gráfico */}
                      <button
                        onClick={() => {
                          setSelectedHistoryExerciseId(exercise.id);
                          setHistorySubTab('progreso');
                          setActiveTab('historial');
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition"
                        title="Ver progresión de este ejercicio"
                      >
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredExercises.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No se encontraron ejercicios con ese criterio.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 4: HISTORIAL Y PROGRESO DE CARGA
            ================================================================== */}
        {activeTab === 'historial' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Sub-selector: Calendario vs Progreso de Carga */}
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setHistorySubTab('calendario')}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
                  historySubTab === 'calendario'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendario de Sesiones</span>
              </button>
              <button
                onClick={() => setHistorySubTab('progreso')}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
                  historySubTab === 'progreso'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Progreso de Cargas (1RM)</span>
              </button>
            </div>

            {/* VISTA 1: CALENDARIO MENSUAL INTERACTIVO */}
            {historySubTab === 'calendario' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
                  {/* Selector de Mes */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-white capitalize">
                      {selectedCalendarDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const prev = new Date(selectedCalendarDate);
                          prev.setMonth(prev.getMonth() - 1);
                          setSelectedCalendarDate(prev);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedCalendarDate(new Date())}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        Hoy
                      </button>
                      <button
                        onClick={() => {
                          const next = new Date(selectedCalendarDate);
                          next.setMonth(next.getMonth() + 1);
                          setSelectedCalendarDate(next);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Nombres de los días de la semana */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                    <span>Lun</span>
                    <span>Mar</span>
                    <span>Mié</span>
                    <span>Jue</span>
                    <span>Vie</span>
                    <span>Sáb</span>
                    <span>Dom</span>
                  </div>

                  {/* Grid de días */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((item, idx) => {
                      const isSelected =
                        item.date.getFullYear() === inspectedDay.getFullYear() &&
                        item.date.getMonth() === inspectedDay.getMonth() &&
                        item.date.getDate() === inspectedDay.getDate();

                      const hasWorkouts = item.workouts.length > 0;
                      const isToday =
                        item.date.toDateString() === new Date().toDateString();

                      return (
                        <button
                          key={idx}
                          onClick={() => setInspectedDay(item.date)}
                          className={`aspect-square flex flex-col items-center justify-center rounded-xl p-1 relative transition-all active:scale-95 ${
                            isSelected
                              ? 'ring-2 ring-emerald-400 bg-slate-800 font-black'
                              : item.isCurrentMonth
                              ? 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-200'
                              : 'text-slate-700 opacity-40'
                          } ${isToday && !isSelected ? 'border border-cyan-500/40' : ''}`}
                        >
                          <span className="text-xs font-mono-numbers">{item.date.getDate()}</span>
                          {/* Punto indicador de entreno */}
                          {hasWorkouts && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 shadow-sm shadow-emerald-400/80 animate-pulse"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detalle del día seleccionado */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs sm:text-sm font-extrabold text-white capitalize">
                        {inspectedDay.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {inspectedDayWorkouts.length}{' '}
                      {inspectedDayWorkouts.length === 1 ? 'entrenamiento' : 'entrenamientos'}
                    </span>
                  </div>

                  {inspectedDayWorkouts.length > 0 ? (
                    <div className="space-y-3">
                      {inspectedDayWorkouts.map((session) => {
                        const metrics = getSessionMetrics(session);
                        return (
                          <div
                            key={session.id}
                            className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-black text-white">{session.title}</h5>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 font-mono-numbers">
                                  <span>⏱ {formatTime(session.durationSeconds)}</span>
                                  <span>📦 {metrics.totalVolume.toLocaleString()} {settings.unit}</span>
                                  <span>🔥 {metrics.totalSets} series</span>
                                </div>
                              </div>
                            </div>

                            {/* Desglose de ejercicios y mejores marcas */}
                            <div className="divide-y divide-slate-800/60 pt-1">
                              {session.exercises.map((we, i) => {
                                const exInfo = exercises.find((e) => e.id === we.exerciseId);
                                const completedSets = we.sets.filter((s) => s.completed);
                                return (
                                  <div key={i} className="py-1.5 flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-300">{exInfo?.name || 'Ejercicio'}</span>
                                    <div className="flex items-center gap-2 text-slate-400 font-mono-numbers text-[11px]">
                                      <span>{completedSets.length} series</span>
                                      <span className="text-emerald-400 font-bold">
                                        Max:{' '}
                                        {Math.max(...completedSets.map((s) => s.weight), 0)}
                                        {settings.unit}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      Día de descanso o sin registros guardados.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VISTA 2: PROGRESO DE CARGA Y 1RM ESTIMADA (EPLEY) */}
            {historySubTab === 'progreso' && (
              <div className="space-y-4">
                {/* Selector de Ejercicio para analizar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Selecciona Ejercicio para Medir Progresión:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedHistoryExerciseId}
                      onChange={(e) => setSelectedHistoryExerciseId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-bold rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-emerald-500"
                    >
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({getMuscleBadge(ex.muscle)})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Resumen de Récords Personales (PRs) */}
                  {exerciseProgressData && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">1RM Estimada</span>
                        <span className="text-base sm:text-lg font-black font-mono-numbers text-emerald-400">
                          {exerciseProgressData.max1RM} <span className="text-xs font-normal">{settings.unit}</span>
                        </span>
                        <span className="text-[9px] text-slate-500 block">Fórmula Epley</span>
                      </div>
                      <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Carga Máxima</span>
                        <span className="text-base sm:text-lg font-black font-mono-numbers text-cyan-400">
                          {exerciseProgressData.maxWeight} <span className="text-xs font-normal">{settings.unit}</span>
                        </span>
                        <span className="text-[9px] text-slate-500 block">Récord absoluto</span>
                      </div>
                      <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Sesiones</span>
                        <span className="text-base sm:text-lg font-black font-mono-numbers text-amber-400">
                          {exerciseProgressData.totalSessionsCount}
                        </span>
                        <span className="text-[9px] text-slate-500 block">Registradas</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gráfica Visual de Evolución de 1RM */}
                {exerciseProgressData && exerciseProgressData.dataPoints.length > 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Curva de Sobrecarga Progresiva</span>
                      </h4>
                      <span className="text-[10px] text-slate-500">1RM Estimada (kg) vs Sesión</span>
                    </div>

                    {/* Gráfico SVG dinámico responsive */}
                    <div className="h-44 w-full pt-2">
                      {(() => {
                        const points = exerciseProgressData.dataPoints;
                        const minVal = Math.min(...points.map((p) => p.best1RM)) * 0.85;
                        const maxVal = Math.max(...points.map((p) => p.best1RM)) * 1.15;
                        const height = 140;
                        const width = 500;
                        const padding = 20;

                        const getX = (index: number) => {
                          if (points.length <= 1) return width / 2;
                          return padding + (index / (points.length - 1)) * (width - padding * 2);
                        };

                        const getY = (val: number) => {
                          if (maxVal === minVal) return height / 2;
                          return height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
                        };

                        const pathD = points
                          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.best1RM)}`)
                          .join(' ');

                        return (
                          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="gradient1RM" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Líneas de cuadrícula guía */}
                            <line
                              x1={padding}
                              y1={padding}
                              x2={width - padding}
                              y2={padding}
                              stroke="#1e293b"
                              strokeDasharray="4 4"
                            />
                            <line
                              x1={padding}
                              y1={height / 2}
                              x2={width - padding}
                              y2={height / 2}
                              stroke="#1e293b"
                              strokeDasharray="4 4"
                            />
                            <line
                              x1={padding}
                              y1={height - padding}
                              x2={width - padding}
                              y2={height - padding}
                              stroke="#1e293b"
                            />

                            {/* Área bajo la curva */}
                            {points.length > 1 && (
                              <path
                                d={`${pathD} L ${getX(points.length - 1)} ${height - padding} L ${getX(0)} ${
                                  height - padding
                                } Z`}
                                fill="url(#gradient1RM)"
                              />
                            )}

                            {/* Línea principal */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Puntos de datos */}
                            {points.map((p, i) => {
                              const cx = getX(i);
                              const cy = getY(p.best1RM);
                              return (
                                <g key={i}>
                                  <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#22c55e" strokeWidth="3" />
                                  <text
                                    x={cx}
                                    y={cy - 10}
                                    fill="#f8fafc"
                                    fontSize="11"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    className="font-mono-numbers"
                                  >
                                    {p.best1RM}
                                  </text>
                                  <text
                                    x={cx}
                                    y={height - 4}
                                    fill="#64748b"
                                    fontSize="10"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                  >
                                    {p.date}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        );
                      })()}
                    </div>

                    {/* Tabla de Historial para este Ejercicio */}
                    <div className="pt-2">
                      <h5 className="text-[11px] font-bold uppercase text-slate-400 mb-2">Histórico de Cargas</h5>
                      <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80">
                        {exerciseProgressData.dataPoints.slice().reverse().map((dp, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-400">
                              {new Date(dp.rawDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                            <span className="font-bold text-white font-mono-numbers">
                              {dp.bestWeight} {settings.unit} × {dp.bestReps} reps
                            </span>
                            <span className="font-extrabold text-emerald-400 font-mono-numbers">
                              1RM: {dp.best1RM} {settings.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
                    Aún no hay series registradas para este ejercicio. ¡Completa un entrenamiento para ver su evolución!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 5: AJUSTES Y PWA
            ================================================================== */}
        {activeTab === 'ajustes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Tarjeta PWA / Instalación */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Aplicación Web Progresiva (PWA)</h3>
                  <p className="text-xs text-slate-400">100% Funcional sin conexión a internet</p>
                </div>
              </div>

              {isInstallable ? (
                <button
                  onClick={async () => {
                    if (deferredPrompt) {
                      deferredPrompt.prompt();
                      const choice = await deferredPrompt.userChoice;
                      if (choice.outcome === 'accepted') setIsInstallable(false);
                      setDeferredPrompt(null);
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  <span>Instalar Gimy360 en tu Dispositivo</span>
                </button>
              ) : (
                <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-slate-400">
                  📱 Para instalar en iOS: Pulsa el botón "Compartir" de Safari y elige "Añadir a la pantalla de inicio". En Chrome/Android: Pulsa el menú de 3 puntos y selecciona "Instalar aplicación".
                </div>
              )}
            </div>

            {/* Preferencias de Entrenamiento */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Preferencias</h3>

              {/* Unidad de Carga */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-white block">Unidad de Peso</span>
                  <span className="text-xs text-slate-500">Kilogramos o Libras</span>
                </div>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                  <button
                    onClick={() => setSettings({ ...settings, unit: 'kg' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      settings.unit === 'kg' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    KG
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, unit: 'lb' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      settings.unit === 'lb' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    LB
                  </button>
                </div>
              </div>

              {/* Tiempo de descanso por defecto */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-sm font-extrabold text-white block">Descanso Predeterminado</span>
                  <span className="text-xs text-slate-500">Al completar una serie</span>
                </div>
                <select
                  value={settings.defaultRestTime}
                  onChange={(e) => setSettings({ ...settings, defaultRestTime: parseInt(e.target.value) })}
                  className="bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value={45}>45 seg</option>
                  <option value={60}>60 seg</option>
                  <option value={90}>90 seg (Recomendado)</option>
                  <option value={120}>120 seg (Fuerza)</option>
                  <option value={180}>180 seg (Pesado)</option>
                </select>
              </div>

              {/* Alerta Sonora del Temporizador */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <span className="text-sm font-extrabold text-white block">Alerta Sonora</span>
                    <span className="text-xs text-slate-500">Beep sintetizado al finalizar el descanso</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !settings.soundEnabled;
                    setSettings({ ...settings, soundEnabled: next });
                    if (next) triggerAudioChime();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    settings.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm block"></span>
                </button>
              </div>
            </div>

            {/* Respaldo y Gestión de Datos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Datos Offline (JSON)</h3>
              <p className="text-xs text-slate-400">
                Tus datos residen 100% en tu navegador. Puedes exportar una copia de seguridad o importar datos en cualquier momento.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleExportBackup}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Exportar JSON</span>
                </button>

                <label className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition cursor-pointer">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Importar JSON</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>

              {/* Botón para reiniciar a datos de fábrica */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    if (window.confirm('¿Reiniciar rutinas y ejercicios a los valores iniciales predeterminados?')) {
                      setExercises(INITIAL_EXERCISES);
                      setRoutines(INITIAL_ROUTINES);
                      alert('Datos iniciales restablecidos.');
                    }
                  }}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restablecer rutinas y catálogo por defecto
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================================================
          TEMPORIZADOR DE DESCANSO FLOTANTE (REST TIMER)
          ========================================================================== */}
      {restTimer.isActive && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            restTimer.isMinimized
              ? 'bottom-20 right-4'
              : 'bottom-20 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-96'
          }`}
        >
          {restTimer.isMinimized ? (
            /* Versión Minimizada */
            <button
              onClick={() => setRestTimer((p) => ({ ...p, isMinimized: false }))}
              className="flex items-center gap-2 bg-slate-900 border-2 border-emerald-500 text-white px-4 py-2.5 rounded-full shadow-2xl active:scale-95 animate-pulse"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-mono-numbers font-black text-sm text-emerald-400">
                {formatTime(restTimer.remaining)}
              </span>
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
          ) : (
            /* Versión Completa Flotante */
            <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Tiempo de Descanso
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRestTimer((p) => ({ ...p, isMinimized: true }))}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                    title="Minimizar"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelRestTimer}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                    title="Cerrar temporizador"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cuenta regresiva central gigante */}
              <div className="text-center py-1">
                <div className="font-mono-numbers text-4xl font-black text-white tracking-tight">
                  {formatTime(restTimer.remaining)}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{
                      width: `${Math.min(100, (restTimer.remaining / restTimer.totalDuration) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Botones de Ajuste Rápido (-15s, +15s, presets) */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                <button
                  onClick={() => adjustRestTimer(-15)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 active:scale-95 transition"
                >
                  -15s
                </button>
                <button
                  onClick={() => startRestTimer(60)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 active:scale-95 transition"
                >
                  60s
                </button>
                <button
                  onClick={() => startRestTimer(90)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 active:scale-95 transition"
                >
                  90s
                </button>
                <button
                  onClick={() => startRestTimer(120)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 active:scale-95 transition"
                >
                  120s
                </button>
                <button
                  onClick={() => adjustRestTimer(15)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 active:scale-95 transition"
                >
                  +15s
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================================================
          MODAL: AÑADIR EJERCICIO AL ENTRENO ACTIVO
          ========================================================================== */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Añadir Ejercicio al Entreno</h3>
                <p className="text-xs text-slate-400">Selecciona del catálogo</p>
              </div>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por nombre..."
                  value={searchExerciseQuery}
                  onChange={(e) => setSearchExerciseQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {(['todos', 'pecho', 'espalda', 'piernas', 'hombro', 'brazos', 'core'] as const).map(
                  (m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMuscleFilter(m)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase whitespace-nowrap ${
                        selectedMuscleFilter === m
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredExercises.map((ex) => {
                const badge = getEquipmentBadge(ex.equipment);
                return (
                  <button
                    key={ex.id}
                    onClick={() => handleAddExerciseToWorkout(ex.id)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/40 flex items-center justify-between group transition active:scale-[0.98]"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {ex.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">{ex.muscle}</span>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-emerald-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: CREAR EJERCICIO PERSONALIZADO
          ========================================================================== */}
      {showCreateExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleCreateCustomExercise}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Nuevo Ejercicio Personalizado</h3>
              <button
                type="button"
                onClick={() => setShowCreateExerciseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Nombre del Ejercicio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Press Francés en Banco Inclinado"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Grupo Muscular</label>
                <select
                  value={newExMuscle}
                  onChange={(e) => setNewExMuscle(e.target.value as MuscleGroup)}
                  className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 capitalize"
                >
                  <option value="pecho">Pecho</option>
                  <option value="espalda">Espalda</option>
                  <option value="piernas">Piernas</option>
                  <option value="hombro">Hombro</option>
                  <option value="brazos">Brazos</option>
                  <option value="core">Core</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Equipamiento</label>
                <select
                  value={newExEquipment}
                  onChange={(e) => setNewExEquipment(e.target.value as Equipment)}
                  className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="barra">Barra Olímpica / Estándar</option>
                  <option value="mancuerna">Mancuernas</option>
                  <option value="polea">Polea / Cable</option>
                  <option value="smith">Multi-Power / Smith</option>
                  <option value="maquina">Máquina Guiada</option>
                  <option value="corporal">Peso Corporal / Calistenia</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateExerciseModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition"
              >
                Guardar Ejercicio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================================
          MODAL: CREAR RUTINA PERSONALIZADA
          ========================================================================== */}
      {showCreateRoutineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <form
            onSubmit={handleCreateCustomRoutine}
            className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-black text-white">Diseñar Nueva Rutina</h3>
              <button
                type="button"
                onClick={() => setShowCreateRoutineModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-800 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Título de la Rutina</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Torso Hipertrofia B"
                  value={newRotTitle}
                  onChange={(e) => setNewRotTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Categoría</label>
                  <input
                    type="text"
                    placeholder="Ej: Empuje / Fuerza"
                    value={newRotCategory}
                    onChange={(e) => setNewRotCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Descripción</label>
                  <input
                    type="text"
                    placeholder="Ej: 4 series pesadas"
                    value={newRotDesc}
                    onChange={(e) => setNewRotDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block">
                  Selecciona Ejercicios ({selectedExIdsForRoutine.length} seleccionados):
                </span>
              </div>
            </div>

            {/* Listado de selección de ejercicios */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {exercises.map((ex) => {
                const isSelected = selectedExIdsForRoutine.includes(ex.id);
                return (
                  <button
                    type="button"
                    key={ex.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedExIdsForRoutine(selectedExIdsForRoutine.filter((id) => id !== ex.id));
                      } else {
                        setSelectedExIdsForRoutine([...selectedExIdsForRoutine, ex.id]);
                      }
                    }}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{ex.name}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{ex.muscle} • {ex.equipment}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateRoutineModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition"
              >
                Guardar Rutina
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================================
          MODAL: RESUMEN CELEBRATORIO AL FINALIZAR ENTRENO
          ========================================================================== */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl w-full max-w-md p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Trophy className="w-8 h-8 fill-current" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                ¡Entrenamiento Completado!
              </span>
              <h3 className="text-xl font-black text-white mt-1">{showFinishModal.title}</h3>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Tiempo</span>
                <span className="text-sm font-black font-mono-numbers text-white">
                  {formatTime(showFinishModal.durationSeconds)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Volumen</span>
                <span className="text-sm font-black font-mono-numbers text-emerald-400">
                  {getSessionMetrics(showFinishModal).totalVolume.toLocaleString()} {settings.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Series</span>
                <span className="text-sm font-black font-mono-numbers text-cyan-400">
                  {getSessionMetrics(showFinishModal).totalSets}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Gran trabajo de sobrecarga. Tus cargas han sido registradas en tu historial y calendario para proyectar tu 1RM.
            </p>

            <button
              onClick={() => {
                setShowFinishModal(null);
                setActiveTab('historial');
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition"
            >
              Ver en Historial & Calendario
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
          BARRA DE NAVEGACIÓN INFERIOR FIJA (BOTTOM NAV BAR)
          ========================================================================== */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/90 pb-safe">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
          {/* 1. Rutinas */}
          <button
            onClick={() => setActiveTab('rutinas')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-90 ${
              activeTab === 'rutinas' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Rutinas</span>
          </button>

          {/* 2. Tracker Entreno */}
          <button
            onClick={() => setActiveTab('entreno')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-90 relative ${
              activeTab === 'entreno' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeWorkout && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
            <Activity className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Entreno</span>
          </button>

          {/* 3. Catálogo Ejercicios */}
          <button
            onClick={() => setActiveTab('ejercicios')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-90 ${
              activeTab === 'ejercicios' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Ejercicios</span>
          </button>

          {/* 4. Historial & Progreso */}
          <button
            onClick={() => setActiveTab('historial')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-90 ${
              activeTab === 'historial' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Progreso</span>
          </button>

          {/* 5. Ajustes */}
          <button
            onClick={() => setActiveTab('ajustes')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-90 ${
              activeTab === 'ajustes' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SettingsIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Ajustes</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
