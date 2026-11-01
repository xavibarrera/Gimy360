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
  ChevronDown,
  Eye,
  AlertTriangle,
  Pencil,
  ArrowLeft,
  Sun,
  Moon,
  Target,
  Wand2,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

/* ==========================================================================
   TIPOS DE DATOS Y MODELOS
   ========================================================================== */

export type Equipment = 'barra' | 'mancuerna' | 'polea' | 'smith' | 'maquina' | 'corporal';

export type MuscleGroup = 'pecho' | 'espalda' | 'piernas' | 'hombro' | 'brazos' | 'core';

export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo' | 'ninguno';

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string; short: string; order: number }[] = [
  { key: 'lunes', label: 'Lunes', short: 'LUN', order: 1 },
  { key: 'martes', label: 'Martes', short: 'MAR', order: 2 },
  { key: 'miercoles', label: 'Miércoles', short: 'MIÉ', order: 3 },
  { key: 'jueves', label: 'Jueves', short: 'JUE', order: 4 },
  { key: 'viernes', label: 'Viernes', short: 'VIE', order: 5 },
  { key: 'sabado', label: 'Sábado', short: 'SÁB', order: 6 },
  { key: 'domingo', label: 'Domingo', short: 'DOM', order: 7 },
  { key: 'ninguno', label: 'Sin día fijo', short: '—', order: 8 },
];

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
  dayOfWeek?: DayOfWeek;
  isCustom?: boolean;
}

export interface AppSettings {
  unit: 'kg' | 'lb';
  defaultRestTime: number; // segundos
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  theme?: 'dark' | 'light';
}

/* ==========================================================================
   BASE DE DATOS INICIAL DE EJERCICIOS Y RUTINAS
   ========================================================================== */

const INITIAL_EXERCISES: Exercise[] = [
  // =========================================================================
  // PECHO
  // =========================================================================
  { id: 'ex-1', name: 'Press de Banca Plano', equipment: 'barra', muscle: 'pecho' },
  { id: 'ex-2', name: 'Press Inclinado con Mancuernas', equipment: 'mancuerna', muscle: 'pecho' },
  { id: 'ex-3', name: 'Aperturas en Cruce de Poleas', equipment: 'polea', muscle: 'pecho' },
  { id: 'ex-4', name: 'Press de Pecho en Máquina', equipment: 'maquina', muscle: 'pecho' },
  { id: 'ex-5', name: 'Fondos en Paralelas (Dips)', equipment: 'corporal', muscle: 'pecho' },
  { id: 'ex-6', name: 'Press Inclinado en Multipower', equipment: 'smith', muscle: 'pecho' },
  { id: 'ex-37', name: 'Press Inclinado con Barra', equipment: 'barra', muscle: 'pecho' },
  { id: 'ex-38', name: 'Press Declinado con Barra', equipment: 'barra', muscle: 'pecho' },
  { id: 'ex-39', name: 'Press de Banca Plano con Mancuernas', equipment: 'mancuerna', muscle: 'pecho' },
  { id: 'ex-40', name: 'Press Declinado con Mancuernas', equipment: 'mancuerna', muscle: 'pecho' },
  { id: 'ex-41', name: 'Aperturas Planas con Mancuernas', equipment: 'mancuerna', muscle: 'pecho' },
  { id: 'ex-42', name: 'Aperturas Inclinadas con Mancuernas', equipment: 'mancuerna', muscle: 'pecho' },
  { id: 'ex-43', name: 'Pec Deck / Contractor de Pecho', equipment: 'maquina', muscle: 'pecho' },
  { id: 'ex-44', name: 'Press de Pecho Convergente', equipment: 'maquina', muscle: 'pecho' },
  { id: 'ex-45', name: 'Cruce de Poleas Bajas (Haz Clavicular)', equipment: 'polea', muscle: 'pecho' },
  { id: 'ex-46', name: 'Cruce de Poleas Altas a Bajas', equipment: 'polea', muscle: 'pecho' },
  { id: 'ex-47', name: 'Press de Pecho Plano en Multipower', equipment: 'smith', muscle: 'pecho' },
  { id: 'ex-48', name: 'Press Declinado en Multipower', equipment: 'smith', muscle: 'pecho' },
  { id: 'ex-49', name: 'Flexiones de Pecho (Push-ups)', equipment: 'corporal', muscle: 'pecho' },
  { id: 'ex-50', name: 'Flexiones Declinadas', equipment: 'corporal', muscle: 'pecho' },
  { id: 'ex-51', name: 'Pullover con Mancuerna en Banco', equipment: 'mancuerna', muscle: 'pecho' },

  // =========================================================================
  // ESPALDA
  // =========================================================================
  { id: 'ex-7', name: 'Jalón al Pecho en Polea', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-8', name: 'Remo con Barra 45°', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-9', name: 'Remo Gironda en Polea Baja', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-10', name: 'Dominadas Pronas', equipment: 'corporal', muscle: 'espalda' },
  { id: 'ex-11', name: 'Peso Muerto Convencional', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-12', name: 'Remo con Mancuerna a una Mano', equipment: 'mancuerna', muscle: 'espalda' },
  { id: 'ex-13', name: 'Pull-over en Polea Alta', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-52', name: 'Dominadas Supinas (Chin-ups)', equipment: 'corporal', muscle: 'espalda' },
  { id: 'ex-53', name: 'Dominadas Agarre Neutro', equipment: 'corporal', muscle: 'espalda' },
  { id: 'ex-54', name: 'Jalón al Pecho Agarre Neutro / Cerrado', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-55', name: 'Jalón Unilateral en Polea Alta', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-56', name: 'Remo en Barra T con Apoyo al Pecho', equipment: 'maquina', muscle: 'espalda' },
  { id: 'ex-57', name: 'Remo en Barra T Libre', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-58', name: 'Remo Pendlay', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-59', name: 'Remo Seal Row en Banco Plano', equipment: 'mancuerna', muscle: 'espalda' },
  { id: 'ex-60', name: 'Remo en Máquina de Palancas', equipment: 'maquina', muscle: 'espalda' },
  { id: 'ex-61', name: 'Remo en Polea Unilateral', equipment: 'polea', muscle: 'espalda' },
  { id: 'ex-62', name: 'Remo en Multipower (Smith)', equipment: 'smith', muscle: 'espalda' },
  { id: 'ex-63', name: 'Hiperextensiones Lumbares', equipment: 'corporal', muscle: 'espalda' },
  { id: 'ex-64', name: 'Peso Muerto Sumo', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-65', name: 'Encogimientos de Trapecio con Barra', equipment: 'barra', muscle: 'espalda' },
  { id: 'ex-66', name: 'Encogimientos de Trapecio con Mancuernas', equipment: 'mancuerna', muscle: 'espalda' },
  { id: 'ex-67', name: 'Encogimientos en Multipower', equipment: 'smith', muscle: 'espalda' },

  // =========================================================================
  // PIERNAS
  // =========================================================================
  { id: 'ex-14', name: 'Sentadilla Trasera con Barra', equipment: 'barra', muscle: 'piernas' },
  { id: 'ex-15', name: 'Prensa Inclinada 45°', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-16', name: 'Extensión de Cuádriceps', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-17', name: 'Curl Femoral Tumbado', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-18', name: 'Sentadilla Búlgara con Mancuernas', equipment: 'mancuerna', muscle: 'piernas' },
  { id: 'ex-19', name: 'Hip Thrust con Barra', equipment: 'barra', muscle: 'piernas' },
  { id: 'ex-20', name: 'Elevación de Gemelos de Pie', equipment: 'smith', muscle: 'piernas' },
  { id: 'ex-68', name: 'Sentadilla Frontal con Barra', equipment: 'barra', muscle: 'piernas' },
  { id: 'ex-69', name: 'Sentadilla Hack en Máquina', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-70', name: 'Sentadilla en Multipower', equipment: 'smith', muscle: 'piernas' },
  { id: 'ex-71', name: 'Sentadilla Goblet con Mancuerna', equipment: 'mancuerna', muscle: 'piernas' },
  { id: 'ex-72', name: 'Zancadas Caminando con Mancuernas', equipment: 'mancuerna', muscle: 'piernas' },
  { id: 'ex-73', name: 'Sentadilla Búlgara en Multipower', equipment: 'smith', muscle: 'piernas' },
  { id: 'ex-74', name: 'Peso Muerto Rumano con Barra', equipment: 'barra', muscle: 'piernas' },
  { id: 'ex-75', name: 'Peso Muerto Rumano con Mancuernas', equipment: 'mancuerna', muscle: 'piernas' },
  { id: 'ex-76', name: 'Curl Femoral Sentado', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-77', name: 'Curl Femoral de Pie en Polea', equipment: 'polea', muscle: 'piernas' },
  { id: 'ex-78', name: 'Curl Nórdico', equipment: 'corporal', muscle: 'piernas' },
  { id: 'ex-79', name: 'Prensa Horizontal de Piernas', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-80', name: 'Abductores en Máquina', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-81', name: 'Aductores en Máquina', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-82', name: 'Patada de Glúteo en Polea', equipment: 'polea', muscle: 'piernas' },
  { id: 'ex-83', name: 'Hip Thrust en Máquina', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-84', name: 'Elevación de Gemelos Sentado', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-85', name: 'Elevación de Gemelos en Prensa', equipment: 'maquina', muscle: 'piernas' },
  { id: 'ex-86', name: 'Elevación de Talones a una Pierna', equipment: 'corporal', muscle: 'piernas' },

  // =========================================================================
  // HOMBRO
  // =========================================================================
  { id: 'ex-21', name: 'Press Militar de Pie con Barra', equipment: 'barra', muscle: 'hombro' },
  { id: 'ex-22', name: 'Elevaciones Laterales con Mancuerna', equipment: 'mancuerna', muscle: 'hombro' },
  { id: 'ex-23', name: 'Elevaciones Laterales en Polea', equipment: 'polea', muscle: 'hombro' },
  { id: 'ex-24', name: 'Face Pull con Cuerda', equipment: 'polea', muscle: 'hombro' },
  { id: 'ex-25', name: 'Pájaros para Deltoides Posterior', equipment: 'mancuerna', muscle: 'hombro' },
  { id: 'ex-26', name: 'Press Militar en Smith', equipment: 'smith', muscle: 'hombro' },
  { id: 'ex-87', name: 'Press Militar Sentado con Mancuernas', equipment: 'mancuerna', muscle: 'hombro' },
  { id: 'ex-88', name: 'Press Arnold con Mancuernas', equipment: 'mancuerna', muscle: 'hombro' },
  { id: 'ex-89', name: 'Press de Hombros en Máquina', equipment: 'maquina', muscle: 'hombro' },
  { id: 'ex-90', name: 'Elevaciones Frontales con Mancuerna', equipment: 'mancuerna', muscle: 'hombro' },
  { id: 'ex-91', name: 'Elevaciones Frontales en Polea', equipment: 'polea', muscle: 'hombro' },
  { id: 'ex-92', name: 'Elevaciones Frontales con Disco', equipment: 'barra', muscle: 'hombro' },
  { id: 'ex-93', name: 'Elevaciones Laterales en Máquina', equipment: 'maquina', muscle: 'hombro' },
  { id: 'ex-94', name: 'Pájaros en Máquina Pec Deck Invertida', equipment: 'maquina', muscle: 'hombro' },
  { id: 'ex-95', name: 'Cruce de Poleas para Deltoides Posterior', equipment: 'polea', muscle: 'hombro' },
  { id: 'ex-96', name: 'Remo al Mentón con Barra Z', equipment: 'barra', muscle: 'hombro' },
  { id: 'ex-97', name: 'Remo al Mentón en Polea', equipment: 'polea', muscle: 'hombro' },
  { id: 'ex-98', name: 'Y-Raises en Polea / Banco Inclinado', equipment: 'polea', muscle: 'hombro' },

  // =========================================================================
  // BRAZOS
  // =========================================================================
  { id: 'ex-27', name: 'Curl de Bíceps con Barra Z', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-28', name: 'Curl Martillo con Mancuernas', equipment: 'mancuerna', muscle: 'brazos' },
  { id: 'ex-29', name: 'Curl en Banco Scott', equipment: 'maquina', muscle: 'brazos' },
  { id: 'ex-30', name: 'Extensiones de Tríceps en Polea', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-31', name: 'Press Francés con Barra Z', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-32', name: 'Fondos entre Bancos para Tríceps', equipment: 'corporal', muscle: 'brazos' },
  { id: 'ex-99', name: 'Curl de Bíceps Alterno con Mancuernas', equipment: 'mancuerna', muscle: 'brazos' },
  { id: 'ex-100', name: 'Curl de Bíceps Inclinado en Banco', equipment: 'mancuerna', muscle: 'brazos' },
  { id: 'ex-101', name: 'Curl Concentrado con Mancuerna', equipment: 'mancuerna', muscle: 'brazos' },
  { id: 'ex-102', name: 'Curl Araña (Spider Curl) con Barra Z', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-103', name: 'Curl de Bíceps en Polea Baja con Barra', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-104', name: 'Curl Bayesiano en Polea', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-105', name: 'Curl Martillo en Polea con Cuerda', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-106', name: 'Curl 21 con Barra', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-107', name: 'Extensiones Tras Nuca con Cuerda en Polea', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-108', name: 'Extensión de Tríceps Unilateral en Polea', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-109', name: 'Press Cerrado para Tríceps en Banca', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-110', name: 'Extensión Francesa con Mancuerna tras Nuca', equipment: 'mancuerna', muscle: 'brazos' },
  { id: 'ex-111', name: 'Patada de Tríceps con Mancuerna', equipment: 'mancuerna', muscle: 'brazos' },
  { id: 'ex-112', name: 'Patada de Tríceps en Polea', equipment: 'polea', muscle: 'brazos' },
  { id: 'ex-113', name: 'Extensión de Tríceps en Multipower', equipment: 'smith', muscle: 'brazos' },
  { id: 'ex-114', name: 'Curl de Muñeca Supino con Barra (Antebrazo)', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-115', name: 'Curl de Muñeca Prono con Barra (Antebrazo)', equipment: 'barra', muscle: 'brazos' },
  { id: 'ex-116', name: 'Paseo del Granjero (Farmer Walk)', equipment: 'mancuerna', muscle: 'brazos' },

  // =========================================================================
  // CORE
  // =========================================================================
  { id: 'ex-33', name: 'Crunch Abdominal en Polea Alta', equipment: 'polea', muscle: 'core' },
  { id: 'ex-34', name: 'Elevación de Piernas Colgado', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-35', name: 'Plancha Isométrica', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-36', name: 'Rueda Abdominal (Ab Wheel)', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-117', name: 'Crunch Abdominal en Suelo', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-118', name: 'Crunch en Banco Declinado', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-119', name: 'Elevación de Rodillas en Silla Romana', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-120', name: 'Plancha Lateral Isométrica', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-121', name: 'Giros Rusos (Russian Twists)', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-122', name: 'Leñador en Polea (Woodchopper)', equipment: 'polea', muscle: 'core' },
  { id: 'ex-123', name: 'Vacío Abdominal (Stomach Vacuum)', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-124', name: 'Tijeras Abdominales (Flutter Kicks)', equipment: 'corporal', muscle: 'core' },
  { id: 'ex-125', name: 'Crunch Abdominal en Máquina', equipment: 'maquina', muscle: 'core' },
  { id: 'ex-126', name: 'Dead Bug', equipment: 'corporal', muscle: 'core' },
];

const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'rot-1',
    title: 'Torso / Empuje (Push)',
    category: 'Fuerza e Hipertrofia',
    description: 'Enfocado en pectoral mayor, deltoides anterior/lateral y tríceps.',
    exerciseIds: ['ex-1', 'ex-2', 'ex-22', 'ex-30', 'ex-5'],
    dayOfWeek: 'lunes',
  },
  {
    id: 'rot-2',
    title: 'Espalda & Jalón (Pull)',
    category: 'Densidad y Amplitud',
    description: 'Trabajo completo de dorsales, trapecios, romboides y bíceps.',
    exerciseIds: ['ex-8', 'ex-7', 'ex-9', 'ex-24', 'ex-27'],
    dayOfWeek: 'miercoles',
  },
  {
    id: 'rot-3',
    title: 'Pierna & Fuerza (Legs)',
    category: 'Cadena Anterior y Posterior',
    description: 'Cuádriceps, femorales, glúteos y gemelos con cargas progresivas.',
    exerciseIds: ['ex-14', 'ex-15', 'ex-17', 'ex-19', 'ex-20'],
    dayOfWeek: 'viernes',
  },
  {
    id: 'rot-4',
    title: 'Full Body Acelera',
    category: 'Cuerpo Completo',
    description: 'Sesión integral multiarticular de alta intensidad para todo el cuerpo.',
    exerciseIds: ['ex-1', 'ex-14', 'ex-7', 'ex-21', 'ex-33'],
    dayOfWeek: 'sabado',
  },
];

/* ==========================================================================
   TIPOS Y ALGORITMO GENERADOR DE RUTINAS INTELIGENTES (ONBOARDING WIZARD)
   ========================================================================== */

export type WizardDays = 2 | 3 | 4 | 5 | 6;
export type WizardEquipment = 'gimnasio_completo' | 'solo_mancuernas' | 'peso_corporal';
export type WizardGoal = 'hipertrofia' | 'fuerza' | 'acondicionamiento';
export type WizardLevel = 'principiante' | 'intermedio' | 'avanzado';

export interface WizardConfig {
  days: WizardDays;
  equipment: WizardEquipment;
  goal: WizardGoal;
  level: WizardLevel;
}

export function generateIntelligentRoutines(config: WizardConfig, allExercises: Exercise[]): Routine[] {
  // 1. Filtro de equipamiento disponible
  const isEquipmentAllowed = (eq: Equipment) => {
    if (config.equipment === 'peso_corporal') return eq === 'corporal';
    if (config.equipment === 'solo_mancuernas') return eq === 'mancuerna' || eq === 'corporal';
    return true; // gimnasio completo
  };

  const pool = allExercises.filter((e) => isEquipmentAllowed(e.equipment));

  // Helper para seleccionar un ejercicio no repetido
  const pick = (muscle: MuscleGroup, preferredKeywords: string[], usedIds: Set<string>): string => {
    for (const kw of preferredKeywords) {
      const match = pool.find(
        (e) => e.muscle === muscle && !usedIds.has(e.id) && e.name.toLowerCase().includes(kw.toLowerCase())
      );
      if (match) {
        usedIds.add(match.id);
        return match.id;
      }
    }
    // Fallback dentro del mismo grupo muscular en el pool filtrado
    const anyMuscle = pool.find((e) => e.muscle === muscle && !usedIds.has(e.id));
    if (anyMuscle) {
      usedIds.add(anyMuscle.id);
      return anyMuscle.id;
    }
    // Fallback a peso corporal de la base general si estuviera muy restringido
    const corporalFallback = allExercises.find(
      (e) => e.muscle === muscle && e.equipment === 'corporal' && !usedIds.has(e.id)
    );
    if (corporalFallback) {
      usedIds.add(corporalFallback.id);
      return corporalFallback.id;
    }
    // Último recurso: cualquier ejercicio disponible
    const anyFallback = pool.find((e) => !usedIds.has(e.id)) || allExercises[0];
    usedIds.add(anyFallback.id);
    return anyFallback.id;
  };

  // Metadatos según objetivo y nivel
  const seriesInfo =
    config.level === 'principiante'
      ? '3 series base por ejercicio'
      : config.level === 'intermedio'
      ? '3 a 4 series base con sobrecarga progresiva'
      : '4 series efectivas con máxima intensidad y esfuerzo';

  const goalDesc =
    config.goal === 'fuerza'
      ? 'Foco en 4-6 repeticiones pesadas en ejercicios multiarticulares y descansos completos.'
      : config.goal === 'acondicionamiento'
      ? 'Foco en 12-15 repeticiones con descansos dinámicos y alta densidad metabólica.'
      : 'Foco en 8-12 repeticiones para estímulo óptimo de hipertrofia y tensión mecánica.';

  const results: Routine[] = [];

  // =========================================================================
  // 2 DÍAS: FULL BODY 2X
  // =========================================================================
  if (config.days === 2) {
    const usedA = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-1`,
      title: 'Full Body A (Fuerza Base)',
      category: 'Full Body',
      dayOfWeek: 'lunes',
      description: `Sesión de cuerpo completo multiarticular. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['sentadilla trasera', 'prensa inclinada', 'sentadilla goblet'], usedA),
        pick('pecho', ['press de banca plano', 'press inclinado', 'flexiones'], usedA),
        pick('espalda', ['remo con barra', 'remo con mancuerna', 'dominadas'], usedA),
        pick('hombro', ['press militar', 'press arnold', 'elevaciones laterales'], usedA),
        pick('brazos', ['curl de bíceps con barra', 'curl martillo'], usedA),
        pick('core', ['plancha isométrica', 'rueda abdominal', 'crunch'], usedA),
      ],
    });

    const usedB = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-2`,
      title: 'Full Body B (Tensión & Balance)',
      category: 'Full Body',
      dayOfWeek: 'jueves',
      description: `Cadena posterior y músculos antagonistas. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['peso muerto rumano', 'hip thrust', 'curl femoral'], usedB),
        pick('espalda', ['jalón al pecho', 'remo gironda', 'dominadas neutras'], usedB),
        pick('pecho', ['press inclinado con mancuernas', 'aperturas', 'fondos'], usedB),
        pick('hombro', ['elevaciones laterales', 'face pull'], usedB),
        pick('brazos', ['extensiones de tríceps en polea', 'press francés', 'fondos'], usedB),
        pick('core', ['elevación de piernas', 'giros rusos', 'dead bug'], usedB),
      ],
    });
  }

  // =========================================================================
  // 3 DÍAS: FULL BODY 3X
  // =========================================================================
  else if (config.days === 3) {
    const usedA = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-1`,
      title: 'Full Body A (Énfasis Empuje)',
      category: 'Full Body',
      dayOfWeek: 'lunes',
      description: `Potencia de empuje y cuádriceps. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['sentadilla trasera', 'prensa inclinada', 'goblet'], usedA),
        pick('pecho', ['press de banca plano', 'press con mancuernas', 'flexiones'], usedA),
        pick('espalda', ['remo con barra', 'remo con mancuerna', 'dominadas'], usedA),
        pick('hombro', ['press militar de pie', 'press de hombros'], usedA),
        pick('brazos', ['extensiones de tríceps en polea', 'fondos entre bancos'], usedA),
        pick('core', ['plancha isométrica', 'crunch abdominal'], usedA),
      ],
    });

    const usedB = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-2`,
      title: 'Full Body B (Énfasis Jalón)',
      category: 'Full Body',
      dayOfWeek: 'miercoles',
      description: `Densidad de tracción e isquiosurales. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['peso muerto rumano', 'hip thrust', 'curl femoral'], usedB),
        pick('espalda', ['jalón al pecho en polea', 'dominadas pronas', 'remo gironda'], usedB),
        pick('pecho', ['press inclinado con mancuernas', 'aperturas', 'dips'], usedB),
        pick('hombro', ['face pull con cuerda', 'pájaros para deltoides'], usedB),
        pick('brazos', ['curl de bíceps con barra z', 'curl martillo'], usedB),
        pick('core', ['elevación de piernas colgado', 'rueda abdominal'], usedB),
      ],
    });

    const usedC = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-3`,
      title: 'Full Body C (Hipertrofia Global)',
      category: 'Full Body',
      dayOfWeek: 'viernes',
      description: `Estímulo metabólico y volumen periférico. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['sentadilla búlgara con mancuernas', 'prensa', 'extensión de cuádriceps'], usedC),
        pick('pecho', ['press de pecho convergente', 'aperturas en cruce', 'pec deck'], usedC),
        pick('espalda', ['remo en barra t', 'remo seal row', 'jalón unilateral'], usedC),
        pick('hombro', ['elevaciones laterales con mancuerna', 'press arnold'], usedC),
        pick('brazos', ['curl araña', 'press cerrado para tríceps'], usedC),
        pick('core', ['giros rusos', 'plancha lateral isométrica'], usedC),
      ],
    });
  }

  // =========================================================================
  // 4 DÍAS: TORSO / PIERNA (UPPER / LOWER SPLIT)
  // =========================================================================
  else if (config.days === 4) {
    const usedT1 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-1`,
      title: 'Torso A (Fuerza & Densidad)',
      category: 'Torso',
      dayOfWeek: 'lunes',
      description: `Empuje y tirón pesado de tren superior. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('pecho', ['press de banca plano', 'press inclinado con mancuernas'], usedT1),
        pick('espalda', ['remo con barra 45°', 'remo en barra t'], usedT1),
        pick('hombro', ['press militar de pie', 'press militar sentado'], usedT1),
        pick('espalda', ['jalón al pecho en polea', 'dominadas'], usedT1),
        pick('brazos', ['extensiones de tríceps en polea', 'press francés'], usedT1),
        pick('brazos', ['curl de bíceps con barra z', 'curl martillo'], usedT1),
      ],
    });

    const usedP1 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-2`,
      title: 'Pierna A (Énfasis Cuádriceps)',
      category: 'Pierna',
      dayOfWeek: 'martes',
      description: `Cargas en sentadilla y extensores anteriores. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['sentadilla trasera con barra', 'sentadilla hack', 'prensa'], usedP1),
        pick('piernas', ['extensión de cuádriceps', 'sentadilla goblet'], usedP1),
        pick('piernas', ['curl femoral tumbado', 'curl femoral sentado'], usedP1),
        pick('piernas', ['elevación de gemelos de pie', 'gemelos en prensa'], usedP1),
        pick('core', ['plancha isométrica', 'rueda abdominal'], usedP1),
      ],
    });

    const usedT2 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-3`,
      title: 'Torso B (Hipertrofia & Amplitud)',
      category: 'Torso',
      dayOfWeek: 'jueves',
      description: `Ángulos inclinados, dorsales y deltoides. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('pecho', ['press inclinado con mancuernas', 'press de pecho'], usedT2),
        pick('espalda', ['remo gironda en polea', 'remo con mancuerna a una mano'], usedT2),
        pick('hombro', ['elevaciones laterales con mancuerna', 'elevaciones laterales en polea'], usedT2),
        pick('pecho', ['aperturas en cruce de poleas', 'pec deck', 'aperturas planas'], usedT2),
        pick('hombro', ['face pull con cuerda', 'pájaros para deltoides'], usedT2),
        pick('brazos', ['curl bayesiano en polea', 'patada de tríceps'], usedT2),
      ],
    });

    const usedP2 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-4`,
      title: 'Pierna B (Cadena Posterior & Glúteo)',
      category: 'Pierna',
      dayOfWeek: 'viernes',
      description: `Hip thrust, femorales y zancadas. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['peso muerto rumano con barra', 'peso muerto convencional'], usedP2),
        pick('piernas', ['hip thrust con barra', 'patada de glúteo en polea'], usedP2),
        pick('piernas', ['sentadilla búlgara con mancuernas', 'zancadas'], usedP2),
        pick('piernas', ['curl femoral sentado', 'curl nórdico'], usedP2),
        pick('piernas', ['elevación de gemelos sentado', 'elevación de talones'], usedP2),
        pick('core', ['elevación de piernas colgado', 'giros rusos'], usedP2),
      ],
    });
  }

  // =========================================================================
  // 5 DÍAS: PUSH / PULL / LEGS + TORSO / PIERNA
  // =========================================================================
  else if (config.days === 5) {
    const u1 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-1`,
      title: 'Empuje (Push Focus)',
      category: 'Empuje',
      dayOfWeek: 'lunes',
      description: `Pectoral, deltoides anterior/lateral y tríceps. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('pecho', ['press de banca plano', 'press de banca con mancuernas'], u1),
        pick('pecho', ['press inclinado con mancuernas', 'press inclinado barra'], u1),
        pick('hombro', ['press militar de pie', 'press militar sentado'], u1),
        pick('hombro', ['elevaciones laterales con mancuerna', 'elevaciones polea'], u1),
        pick('brazos', ['extensiones de tríceps en polea', 'fondos'], u1),
        pick('brazos', ['press francés con barra z', 'patada de tríceps'], u1),
      ],
    });

    const u2 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-2`,
      title: 'Tirón (Pull Focus)',
      category: 'Tirón',
      dayOfWeek: 'martes',
      description: `Amplitud dorsal, deltoides posterior y flexores de codo. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('espalda', ['jalón al pecho en polea', 'dominadas pronas'], u2),
        pick('espalda', ['remo con barra 45°', 'remo pendlay'], u2),
        pick('espalda', ['remo gironda en polea', 'remo unilateral'], u2),
        pick('hombro', ['face pull con cuerda', 'pájaros para deltoides'], u2),
        pick('brazos', ['curl de bíceps con barra z', 'curl en banco scott'], u2),
        pick('brazos', ['curl martillo con mancuernas', 'curl martillo polea'], u2),
      ],
    });

    const u3 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-3`,
      title: 'Pierna Completa (Legs)',
      category: 'Pierna',
      dayOfWeek: 'miercoles',
      description: `Fuerza integral de tren inferior y estabilidad. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['sentadilla trasera con barra', 'prensa inclinada'], u3),
        pick('piernas', ['peso muerto rumano con barra', 'hip thrust'], u3),
        pick('piernas', ['extensión de cuádriceps', 'sentadilla búlgara'], u3),
        pick('piernas', ['curl femoral tumbado', 'curl femoral sentado'], u3),
        pick('piernas', ['elevación de gemelos de pie', 'gemelos'], u3),
        pick('core', ['plancha isométrica', 'rueda abdominal'], u3),
      ],
    });

    const u4 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-4`,
      title: 'Torso Hipertrofia (Upper)',
      category: 'Torso',
      dayOfWeek: 'viernes',
      description: `Trabajo antagonista en superseries y volumen. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('pecho', ['press inclinado con mancuernas', 'pec deck'], u4),
        pick('espalda', ['remo en barra t con apoyo', 'remo seal row'], u4),
        pick('hombro', ['elevaciones laterales en polea', 'press arnold'], u4),
        pick('espalda', ['pull-over en polea alta', 'jalón neutro'], u4),
        pick('brazos', ['curl de bíceps inclinado en banco', 'curl bayesiano'], u4),
        pick('brazos', ['extensiones tras nuca con cuerda', 'press cerrado'], u4),
      ],
    });

    const u5 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-5`,
      title: 'Pierna & Core (Lower)',
      category: 'Pierna',
      dayOfWeek: 'sabado',
      description: `Enfoque en glúteos, femorales y pared abdominal. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['hip thrust con barra', 'patada de glúteo en polea'], u5),
        pick('piernas', ['sentadilla búlgara con mancuernas', 'zancadas'], u5),
        pick('piernas', ['curl femoral sentado', 'curl nórdico'], u5),
        pick('piernas', ['prensa horizontal de piernas', 'abductores en máquina'], u5),
        pick('core', ['elevación de rodillas en silla romana', 'tijeras abdominales'], u5),
        pick('core', ['giros rusos', 'leñador en polea'], u5),
      ],
    });
  }

  // =========================================================================
  // 6 DÍAS: PUSH / PULL / LEGS (2X) - ALTA FRECUENCIA
  // =========================================================================
  else if (config.days === 6) {
    const s1 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-1`,
      title: 'Empuje A (Push Fuerza)',
      category: 'Empuje',
      dayOfWeek: 'lunes',
      description: `Press pesado multiarticular y hombro anterior. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('pecho', ['press de banca plano', 'press de banca con mancuernas'], s1),
        pick('hombro', ['press militar de pie con barra', 'press militar sentado'], s1),
        pick('pecho', ['press inclinado con mancuernas', 'press inclinado barra'], s1),
        pick('hombro', ['elevaciones laterales con mancuerna', 'polea'], s1),
        pick('brazos', ['press francés con barra z', 'extensiones en polea'], s1),
        pick('brazos', ['fondos en paralelas', 'fondos entre bancos'], s1),
      ],
    });

    const s2 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-2`,
      title: 'Tirón A (Pull Densidad)',
      category: 'Tirón',
      dayOfWeek: 'martes',
      description: `Espalda densa, trapecios y bíceps braquial. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('espalda', ['remo con barra 45°', 'remo pendlay'], s2),
        pick('espalda', ['jalón al pecho en polea', 'dominadas pronas'], s2),
        pick('espalda', ['remo gironda en polea', 'remo mancuerna'], s2),
        pick('hombro', ['pájaros para deltoides', 'face pull'], s2),
        pick('brazos', ['curl de bíceps con barra z', 'curl en banco scott'], s2),
        pick('brazos', ['curl martillo con mancuernas', 'curl martillo polea'], s2),
      ],
    });

    const s3 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-3`,
      title: 'Pierna A (Cuádriceps & Gemelos)',
      category: 'Pierna',
      dayOfWeek: 'miercoles',
      description: `Sentadilla profunda y extensores de rodilla. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['sentadilla trasera con barra', 'sentadilla frontal'], s3),
        pick('piernas', ['prensa inclinada 45°', 'sentadilla hack'], s3),
        pick('piernas', ['extensión de cuádriceps', 'sentadilla goblet'], s3),
        pick('piernas', ['curl femoral tumbado', 'curl nórdico'], s3),
        pick('piernas', ['elevación de gemelos de pie', 'gemelos'], s3),
        pick('core', ['plancha isométrica', 'rueda abdominal'], s3),
      ],
    });

    const s4 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-4`,
      title: 'Empuje B (Push Hipertrofia)',
      category: 'Empuje',
      dayOfWeek: 'jueves',
      description: `Aislamiento pectoral, clavicular y tríceps. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('pecho', ['press inclinado con mancuernas', 'press inclinado barra'], s4),
        pick('pecho', ['press de pecho convergente', 'aperturas'], s4),
        pick('hombro', ['press arnold con mancuernas', 'elevaciones frontales'], s4),
        pick('pecho', ['cruce de poleas', 'pec deck'], s4),
        pick('brazos', ['extensiones tras nuca con cuerda', 'polea'], s4),
        pick('brazos', ['patada de tríceps con mancuerna', 'fondos'], s4),
      ],
    });

    const s5 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-5`,
      title: 'Tirón B (Pull Amplitud)',
      category: 'Tirón',
      dayOfWeek: 'viernes',
      description: `Dorsal ancho, pull-over y bíceps en banco inclinado. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('espalda', ['dominadas agarre neutro', 'jalón al pecho agarre neutro'], s5),
        pick('espalda', ['remo en barra t con apoyo', 'remo seal row'], s5),
        pick('espalda', ['pull-over en polea alta', 'remo en polea unilateral'], s5),
        pick('hombro', ['cruce de poleas para deltoides', 'face pull'], s5),
        pick('brazos', ['curl de bíceps inclinado en banco', 'curl araña'], s5),
        pick('brazos', ['curl bayesiano en polea', 'curl 21 con barra'], s5),
      ],
    });

    const s6 = new Set<string>();
    results.push({
      id: `rot-smart-${Date.now()}-6`,
      title: 'Pierna B (Cadena Posterior & Glúteos)',
      category: 'Pierna',
      dayOfWeek: 'sabado',
      description: `Hip thrust pesado, femorales e isquiosurales. ${seriesInfo}. ${goalDesc}`,
      isCustom: true,
      exerciseIds: [
        pick('piernas', ['hip thrust con barra', 'hip thrust en máquina'], s6),
        pick('piernas', ['peso muerto rumano con barra', 'peso muerto rumano con mancuernas'], s6),
        pick('piernas', ['sentadilla búlgara con mancuernas', 'zancadas'], s6),
        pick('piernas', ['curl femoral sentado', 'curl femoral de pie'], s6),
        pick('piernas', ['elevación de gemelos sentado', 'gemelos en prensa'], s6),
        pick('core', ['elevación de piernas colgado', 'giros rusos'], s6),
      ],
    });
  }

  return results;
}

export interface ProgressiveOverloadFeedback {
  hasHistory: boolean;
  shouldIncrease: boolean;
  message: string;
  previousWeight: number;
  previousReps: number;
  completedSetsCount: number;
}

export function getProgressiveOverloadFeedback(
  exerciseId: string,
  history: WorkoutSession[],
  unit: 'kg' | 'lb'
): ProgressiveOverloadFeedback {
  for (const session of history) {
    const match = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (match && match.sets && match.sets.length > 0) {
      const completedSets = match.sets.filter((s) => s.completed && s.type !== 'W');
      if (completedSets.length > 0) {
        const maxWeight = Math.max(...completedSets.map((s) => s.weight));
        const avgReps = Math.round(completedSets.reduce((sum, s) => sum + s.reps, 0) / completedSets.length);
        const shouldIncrease = avgReps >= 8 && maxWeight > 0;
        const incText = unit === 'kg' ? '+2.5 kg o +1 rep' : '+5 lb o +1 rep';

        return {
          hasHistory: true,
          shouldIncrease,
          message: shouldIncrease
            ? `💡 Sugerencia: En tu última sesión completaste ${completedSets.length} series a ${maxWeight} ${unit} × ${avgReps} reps. ¡Intenta ${incText} hoy!`
            : `🎯 Marca anterior: ${maxWeight} ${unit} × ${avgReps} reps (${completedSets.length} series). Consolida la técnica antes de aumentar peso.`,
          previousWeight: maxWeight,
          previousReps: avgReps,
          completedSetsCount: completedSets.length,
        };
      }
    }
  }
  return {
    hasHistory: false,
    shouldIncrease: false,
    message: '🎯 Primera vez con este ejercicio: calibra un peso moderado para dominar la técnica.',
    previousWeight: 0,
    previousReps: 0,
    completedSetsCount: 0,
  };
}

/* ==========================================================================
   UTILIDADES & HELPERS
   ========================================================================== */

export function getDayLabel(day?: DayOfWeek): string {
  const found = DAYS_OF_WEEK.find((d) => d.key === day);
  return found ? found.label : 'Sin día fijo';
}

export function getDayBadgeStyle(day?: DayOfWeek): { bg: string; text: string; border: string } {
  switch (day) {
    case 'lunes':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'martes':
      return { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'miercoles':
      return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'jueves':
      return { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'viernes':
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'sabado':
      return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' };
    case 'domingo':
      return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' };
    default:
      return { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' };
  }
}

// Estimación de 1RM con la fórmula de Epley
export function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return Math.round(weight * 10) / 10;
  // Fórmula Epley: Peso * (1 + reps / 30)
  const oneRM = weight * (1 + reps / 30);
  return Math.round(oneRM * 10) / 10;
}

// Icono y estilo visual según la categoría o enfoque de la rutina
export function getRoutineCategoryMeta(category?: string, title?: string): {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  label: string;
} {
  const text = `${category || ''} ${title || ''}`.toLowerCase();
  if (text.includes('empuje') || text.includes('push')) {
    return { icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', label: 'Empuje' };
  }
  if (text.includes('tirón') || text.includes('tiron') || text.includes('pull') || text.includes('jalón') || text.includes('jalon') || text.includes('espalda')) {
    return { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', label: 'Tirón' };
  }
  if (text.includes('pierna') || text.includes('leg') || text.includes('fuerza') || text.includes('glúteo') || text.includes('gluteo') || text.includes('cuádriceps')) {
    return { icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', label: 'Pierna' };
  }
  if (text.includes('full body') || text.includes('cuerpo completo') || text.includes('acelera') || text.includes('híbrido')) {
    return { icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', label: 'Full Body' };
  }
  if (text.includes('torso') || text.includes('superior')) {
    return { icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30', label: 'Torso' };
  }
  if (text.includes('brazo') || text.includes('biceps') || text.includes('bíceps') || text.includes('triceps') || text.includes('tríceps')) {
    return { icon: Dumbbell, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30', label: 'Brazos' };
  }
  if (text.includes('core') || text.includes('abdomen') || text.includes('abdominal')) {
    return { icon: Target, color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30', label: 'Core' };
  }
  return { icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', label: 'Rutina' };
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

  // Estado de Ejercicios (con auto-sincronización de catálogo ampliado y preservación de ejercicios propios)
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('gimy360_exercises');
    if (saved) {
      try {
        const parsed: Exercise[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((e) => e.id));
          const missingDefaults = INITIAL_EXERCISES.filter((e) => !existingIds.has(e.id));
          if (missingDefaults.length > 0) {
            const merged = [...parsed, ...missingDefaults];
            localStorage.setItem('gimy360_exercises', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      } catch (err) {
        console.warn('Error reading stored exercises, restoring defaults:', err);
      }
    }
    return INITIAL_EXERCISES;
  });

  // Estado de Rutinas
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('gimy360_routines');
    return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
  });

  // Historial de Entrenamientos Completados (100% datos reales, sin mock data)
  const [history, setHistory] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('gimy360_history');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Filtrar cualquier dato de prueba anterior que empiece por 'hist-'
      return Array.isArray(parsed) ? parsed.filter((s) => !s.id.startsWith('hist-')) : [];
    } catch {
      return [];
    }
  });

  // Ajustes de la App (Modo Oscuro por defecto)
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('gimy360_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          unit: parsed.unit || 'kg',
          defaultRestTime: parsed.defaultRestTime || 90,
          soundEnabled: parsed.soundEnabled ?? true,
          vibrateEnabled: parsed.vibrateEnabled ?? true,
          theme: parsed.theme || 'dark',
        };
      } catch {
        // Fallback si el json guardado estuviera corrupto
      }
    }
    return {
      unit: 'kg',
      defaultRestTime: 90,
      soundEnabled: true,
      vibrateEnabled: true,
      theme: 'dark',
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
  const [isRoutineEditorOpen, setIsRoutineEditorOpen] = useState<boolean>(false);
  const [showFinishModal, setShowFinishModal] = useState<WorkoutSession | null>(null);
  const [selectedRoutineDetail, setSelectedRoutineDetail] = useState<Routine | null>(null);
  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  const [showCancelWorkoutModal, setShowCancelWorkoutModal] = useState<boolean>(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  // Estados para el Generador Inteligente de Rutinas (Onboarding Wizard)
  const [showWizardModal, setShowWizardModal] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [wizardConfig, setWizardConfig] = useState<WizardConfig>({
    days: 4,
    equipment: 'gimnasio_completo',
    goal: 'hipertrofia',
    level: 'intermedio',
  });
  const [wizardReplaceMode, setWizardReplaceMode] = useState<'replace' | 'append'>('replace');

  // Estados para la Sustitución de Ejercicios en Caliente
  const [substituteExerciseModal, setSubstituteExerciseModal] = useState<{
    workoutExIndex: number;
    currentExercise: Exercise;
  } | null>(null);
  const [substituteFilterEquipment, setSubstituteFilterEquipment] = useState<string>('todos');
  const [substituteSearchQuery, setSubstituteSearchQuery] = useState<string>('');

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

  // Control de ejercicios expandidos/colapsados en el entreno activo (por defecto todos colapsados)
  const [expandedExerciseIds, setExpandedExerciseIds] = useState<Record<string, boolean>>({});

  const toggleExerciseExpand = (exerciseWorkoutId: string) => {
    setExpandedExerciseIds((prev) => ({
      ...prev,
      [exerciseWorkoutId]: !prev[exerciseWorkoutId],
    }));
  };

  const handleToggleExpandAll = (expand: boolean) => {
    if (!activeWorkout) return;
    const newState: Record<string, boolean> = {};
    activeWorkout.exercises.forEach((ex) => {
      newState[ex.id] = expand;
    });
    setExpandedExerciseIds(newState);
  };

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

  // Sincronización del tema visual (Dark / Light) en el elemento raíz
  useEffect(() => {
    const currentTheme = settings.theme || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
    }
  }, [settings.theme]);

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
          ? [
              {
                id: `set-${idx}-0-${Date.now()}`,
                type: lastSessionSets[0].type || 'N',
                weight: lastSessionSets[0].weight,
                reps: lastSessionSets[0].reps,
                completed: false,
              },
            ]
          : [
              { id: `set-${idx}-0-${Date.now()}`, type: 'N', weight: 0, reps: 0, completed: false },
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

  // Añadir ejercicio al entreno activo (con solo 1 serie inicial)
  const handleAddExerciseToWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;
    const lastSessionSets = getPreviousExerciseSets(exerciseId);
    const initialSets: WorkoutSet[] =
      lastSessionSets.length > 0
        ? [
            {
              id: `set-${Date.now()}-0`,
              type: lastSessionSets[0].type || 'N',
              weight: lastSessionSets[0].weight,
              reps: lastSessionSets[0].reps,
              completed: false,
            },
          ]
        : [
            { id: `set-${Date.now()}-0`, type: 'N', weight: 0, reps: 0, completed: false },
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
    // Al añadir un ejercicio manualmente se abre automáticamente para editarlo
    setExpandedExerciseIds((prev) => ({
      ...prev,
      [newExercise.id]: true,
    }));
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

  // Apertura y sustitución de ejercicio en caliente
  const handleOpenSubstituteModal = (workoutExIndex: number) => {
    if (!activeWorkout) return;
    const target = activeWorkout.exercises[workoutExIndex];
    if (!target) return;
    const currentEx = exercises.find((e) => e.id === target.exerciseId);
    if (!currentEx) return;

    setSubstituteExerciseModal({
      workoutExIndex,
      currentExercise: currentEx,
    });
    setSubstituteFilterEquipment('todos');
    setSubstituteSearchQuery('');
  };

  const handleApplySubstituteExercise = (newExerciseId: string) => {
    if (!activeWorkout || !substituteExerciseModal) return;
    const { workoutExIndex } = substituteExerciseModal;
    const updated = [...activeWorkout.exercises];
    const target = { ...updated[workoutExIndex] };

    // Buscar si el usuario tiene registros previos en el ejercicio sustituto
    const prevSets = getPreviousExerciseSets(newExerciseId);

    // Conservar las series ya hechas o actualizar la referencia en las pendientes
    const updatedSets = target.sets.map((s, idx) => {
      if (s.completed) return s;
      const ref = prevSets[idx] || prevSets[0];
      return {
        ...s,
        weight: ref ? ref.weight : s.weight,
        reps: ref ? ref.reps : s.reps,
      };
    });

    updated[workoutExIndex] = {
      ...target,
      exerciseId: newExerciseId,
      sets: updatedSets,
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: updated,
    });

    setSubstituteExerciseModal(null);
  };

  // Asistente Inteligente de Rutinas (Onboarding Wizard)
  const handleOpenWizard = () => {
    setWizardStep(1);
    setShowWizardModal(true);
  };

  const handleApplyGeneratedRoutines = () => {
    const generated = generateIntelligentRoutines(wizardConfig, exercises);
    if (wizardReplaceMode === 'replace') {
      setRoutines(generated);
    } else {
      setRoutines((prev) => [...prev, ...generated]);
    }
    setShowWizardModal(false);
    setActiveTab('rutinas');
  };

  // Cancelar entreno (Abre modal nativo de la app para evitar fallos de window.confirm)
  const handleCancelWorkout = () => {
    setShowCancelWorkoutModal(true);
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
      setShowCancelWorkoutModal(true);
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
    // Si el editor de rutinas está abierto, auto-seleccionar el ejercicio recién creado
    if (isRoutineEditorOpen) {
      setSelectedExIdsForRoutine((prev) => [...prev, newEx.id]);
    }
    setNewExName('');
    setShowCreateExerciseModal(false);
  };

  /* ==========================================================================
     GESTIÓN Y EDICIÓN DE RUTINA EN VISTA COMPLETA (NO POPUP)
     ========================================================================== */

  const [newRotTitle, setNewRotTitle] = useState('');
  const [newRotCategory, setNewRotCategory] = useState('');
  const [newRotDesc, setNewRotDesc] = useState('');
  const [newRotDayOfWeek, setNewRotDayOfWeek] = useState<DayOfWeek>('ninguno');
  const [newRotMuscleFilter, setNewRotMuscleFilter] = useState<string>('todos');
  const [newRotSearchQuery, setNewRotSearchQuery] = useState<string>('');
  const [selectedExIdsForRoutine, setSelectedExIdsForRoutine] = useState<string[]>([]);

  const openCreateRoutineModal = () => {
    setEditingRoutine(null);
    setNewRotTitle('');
    setNewRotCategory('');
    setNewRotDesc('');
    setNewRotDayOfWeek('ninguno');
    setNewRotMuscleFilter('todos');
    setNewRotSearchQuery('');
    setSelectedExIdsForRoutine([]);
    setIsRoutineEditorOpen(true);
    setActiveTab('rutinas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditRoutineModal = (routine: Routine) => {
    setEditingRoutine(routine);
    setNewRotTitle(routine.title);
    setNewRotCategory(routine.category);
    setNewRotDesc(routine.description);
    setNewRotDayOfWeek(routine.dayOfWeek || 'ninguno');
    setNewRotMuscleFilter('todos');
    setNewRotSearchQuery('');
    setSelectedExIdsForRoutine([...routine.exerciseIds]);
    setIsRoutineEditorOpen(true);
    setActiveTab('rutinas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeRoutineEditor = () => {
    setIsRoutineEditorOpen(false);
    setEditingRoutine(null);
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRotTitle.trim() || selectedExIdsForRoutine.length === 0) {
      return;
    }

    if (editingRoutine) {
      // Modificar rutina existente (añadir/quitar ejercicios, día, etc.)
      const updatedRoutine: Routine = {
        ...editingRoutine,
        title: newRotTitle.trim(),
        category: newRotCategory.trim() || 'Personalizada',
        description: newRotDesc.trim() || 'Rutina personalizada',
        exerciseIds: selectedExIdsForRoutine,
        dayOfWeek: newRotDayOfWeek,
      };

      setRoutines((prev) =>
        prev.map((r) => (r.id === editingRoutine.id ? updatedRoutine : r))
      );

      // Si el modal de detalle de esta rutina está abierto, actualizarlo también
      if (selectedRoutineDetail?.id === editingRoutine.id) {
        setSelectedRoutineDetail(updatedRoutine);
      }
    } else {
      // Crear nueva rutina
      const newRot: Routine = {
        id: 'routine-' + Date.now(),
        title: newRotTitle.trim(),
        category: newRotCategory.trim() || 'Personalizada',
        description: newRotDesc.trim() || 'Rutina creada a medida',
        exerciseIds: selectedExIdsForRoutine,
        dayOfWeek: newRotDayOfWeek,
        isCustom: true,
      };

      setRoutines((prev) => [...prev, newRot]);
    }

    setNewRotTitle('');
    setNewRotCategory('');
    setNewRotDesc('');
    setNewRotDayOfWeek('ninguno');
    setNewRotMuscleFilter('todos');
    setNewRotSearchQuery('');
    setSelectedExIdsForRoutine([]);
    setEditingRoutine(null);
    setIsRoutineEditorOpen(false);
  };

  // Eliminar rutina
  const handleDeleteRoutine = (routineId: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
    if (selectedRoutineDetail?.id === routineId) {
      setSelectedRoutineDetail(null);
    }
    setRoutineToDelete(null);
  };

  // Rutinas ordenadas por día de la semana (Lunes a Domingo, y luego sin día) y alfabéticamente
  const sortedRoutines = useMemo(() => {
    const getOrder = (day?: DayOfWeek) => {
      switch (day) {
        case 'lunes': return 1;
        case 'martes': return 2;
        case 'miercoles': return 3;
        case 'jueves': return 4;
        case 'viernes': return 5;
        case 'sabado': return 6;
        case 'domingo': return 7;
        default: return 8;
      }
    };
    return [...routines].sort((a, b) => {
      const orderA = getOrder(a.dayOfWeek);
      const orderB = getOrder(b.dayOfWeek);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
    });
  }, [routines]);

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
    <div
      data-theme={settings.theme || 'dark'}
      className={`min-h-screen ${
        settings.theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      } flex flex-col font-sans select-none antialiased`}
    >
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
      </header>

      {/* ==========================================================================
          CONTENIDO PRINCIPAL (ROUTING POR PESTAÑA)
          ========================================================================== */}
      <main className="flex-1 pb-28 pt-2 px-3 sm:px-6 max-w-2xl mx-auto w-full">
        {/* ==================================================================
            PESTAÑA 1: RUTINAS Y SELECCIÓN DE ENTRENO
            ================================================================== */}
        {activeTab === 'rutinas' && (
          isRoutineEditorOpen ? (
            /* ==================================================================
               VISTA COMPLETA: CREAR / EDITAR RUTINA (CON SCROLL NATIVO)
               ================================================================== */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Barra de Navegación y Acciones Rápidas (Sticky) */}
              <div className="sticky top-[53px] sm:top-[57px] z-30 -mx-3 sm:-mx-6 px-3 sm:px-6 py-2.5 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 flex items-center justify-between gap-2 shadow-sm">
                <button
                  type="button"
                  onClick={closeRoutineEditor}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl active:scale-95 transition"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-400" />
                  <span>Volver a Rutinas</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeRoutineEditor}
                    className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRoutine}
                    disabled={!newRotTitle.trim() || selectedExIdsForRoutine.length === 0}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl uppercase tracking-wider shadow-md shadow-emerald-500/20 active:scale-95 transition"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{editingRoutine ? 'Guardar' : 'Crear'}</span>
                  </button>
                </div>
              </div>

              {/* Título de la Vista */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {editingRoutine ? 'Modo Edición' : 'Nueva Rutina'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedExIdsForRoutine.length} {selectedExIdsForRoutine.length === 1 ? 'ejercicio seleccionado' : 'ejercicios seleccionados'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {editingRoutine ? 'Editar Rutina' : 'Diseñar Nueva Rutina'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingRoutine
                    ? 'Añade o quita ejercicios, modifica el día asignado o ajusta el nombre y categoría.'
                    : 'Configura el nombre, el día de la semana y selecciona los ejercicios que componen este entrenamiento.'}
                </p>
              </div>

              {/* Formulario Principal */}
              <form onSubmit={handleSaveRoutine} className="space-y-5">
                {/* 1. Información Básica */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    1. Información Básica
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Título de la Rutina <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Torso Hipertrofia B, Pierna & Glúteos..."
                      value={newRotTitle}
                      onChange={(e) => setNewRotTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white px-3.5 py-2.5 rounded-xl text-sm font-semibold placeholder-slate-600 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">Categoría / Enfoque</label>
                      <input
                        type="text"
                        placeholder="Ej: Empuje / Fuerza / Hipertrofia"
                        value={newRotCategory}
                        onChange={(e) => setNewRotCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm placeholder-slate-600 focus:outline-none transition"
                      />
                      {/* Chips de sugerencias rápidas */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {['Empuje', 'Tirón', 'Pierna', 'Torso', 'Full Body', 'Brazos', 'Core'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewRotCategory(cat)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition ${
                              newRotCategory.toLowerCase() === cat.toLowerCase()
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">Descripción o Notas</label>
                      <input
                        type="text"
                        placeholder="Ej: 4 ejercicios de fuerza y accesorios"
                        value={newRotDesc}
                        onChange={(e) => setNewRotDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm placeholder-slate-600 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Día de la Semana Asignado */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-emerald-400" />
                      2. Asignar Día de la Semana
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {getDayLabel(newRotDayOfWeek)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Las rutinas se ordenan por día de la semana para una navegación rápida e intuitiva.
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
                    {DAYS_OF_WEEK.map((d) => {
                      const isSelected = newRotDayOfWeek === d.key;
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => setNewRotDayOfWeek(d.key)}
                          className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase transition-all active:scale-95 text-center border ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="block">{d.short}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Ejercicios Seleccionados Actualmente */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-emerald-400" />
                      3. Ejercicios Incluidos ({selectedExIdsForRoutine.length})
                    </h3>
                    {selectedExIdsForRoutine.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedExIdsForRoutine([])}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-bold transition hover:underline"
                      >
                        Quitar todos
                      </button>
                    )}
                  </div>

                  {selectedExIdsForRoutine.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      No has seleccionado ejercicios todavía. Elige al menos uno del catálogo inferior.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedExIdsForRoutine.map((exId, idx) => {
                        const ex = exercises.find((e) => e.id === exId);
                        if (!ex) return null;
                        const badge = getEquipmentBadge(ex.equipment);

                        return (
                          <div
                            key={exId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-white block truncate">{ex.name}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}>
                                    {badge.label}
                                  </span>
                                  <span className="text-[10px] text-slate-400 capitalize">{ex.muscle}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedExIdsForRoutine((prev) => prev.filter((id) => id !== exId))}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-90 transition shrink-0"
                              title="Quitar de la rutina"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Catálogo de Ejercicios */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Search className="w-4 h-4 text-emerald-400" />
                        4. Catálogo de Ejercicios
                      </h3>
                      <p className="text-xs text-slate-500">Toca cualquier ejercicio para seleccionarlo o deseleccionarlo</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCreateExerciseModal(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-slate-950 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl hover:bg-emerald-500/10 active:scale-95 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Crear Ejercicio</span>
                    </button>
                  </div>

                  {/* Buscador de ejercicios */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre (ej: Press, Sentadilla, Curl...)"
                      value={newRotSearchQuery}
                      onChange={(e) => setNewRotSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
                    />
                    {newRotSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setNewRotSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filtro por grupo muscular */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {(['todos', 'pecho', 'espalda', 'piernas', 'hombro', 'brazos', 'core'] as const).map(
                      (m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setNewRotMuscleFilter(m)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase whitespace-nowrap transition active:scale-95 ${
                            newRotMuscleFilter === m
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          {m === 'todos' ? 'Todos' : getMuscleBadge(m)}
                        </button>
                      )
                    )}
                  </div>

                  {/* Lista de ejercicios con scroll natural */}
                  <div className="space-y-2 pt-1">
                    {exercises
                      .filter((ex) => {
                        const matchesSearch = ex.name.toLowerCase().includes(newRotSearchQuery.toLowerCase());
                        const matchesMuscle = newRotMuscleFilter === 'todos' || ex.muscle === newRotMuscleFilter;
                        return matchesSearch && matchesMuscle;
                      })
                      .map((ex) => {
                        const isSelected = selectedExIdsForRoutine.includes(ex.id);
                        const badge = getEquipmentBadge(ex.equipment);

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
                            className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-[0.99] ${
                              isSelected
                                ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-sm shadow-emerald-500/10'
                                : 'bg-slate-950 border-slate-800/90 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="min-w-0 pr-3">
                              <span className="text-sm font-bold block truncate text-slate-100">{ex.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                                  {badge.label}
                                </span>
                                <span className="text-xs text-slate-400 capitalize">{ex.muscle}</span>
                              </div>
                            </div>

                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md'
                                  : 'border-slate-700 bg-slate-900'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* 5. Botones de Acción Final */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={closeRoutineEditor}
                    className="w-full sm:w-1/3 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!newRotTitle.trim() || selectedExIdsForRoutine.length === 0}
                    className="w-full sm:w-2/3 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>
                      {editingRoutine
                        ? `Guardar Cambios (${selectedExIdsForRoutine.length} ejercicios)`
                        : `Crear Rutina (${selectedExIdsForRoutine.length} ejercicios)`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ==================================================================
               VISTA PRINCIPAL: LISTADO DE RUTINAS
               ================================================================== */
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

              {/* Cabecera de Rutinas con Botón Crear y Generador Inteligente */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Tus Rutinas</h3>
                  <p className="text-xs text-slate-500">{routines.length} esquemas listos para ejecutar</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenWizard}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-black bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-400 border border-emerald-500/40 px-3.5 py-2 rounded-xl active:scale-95 transition shadow-sm"
                    title="Crear un plan semanal completo adaptado a tus días, material y nivel"
                  >
                    <Wand2 className="w-4 h-4 text-cyan-400" />
                    <span>+ Generar Rutina Inteligente</span>
                  </button>
                  <button
                    onClick={openCreateRoutineModal}
                    className="flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Crear Manual</span>
                    <span className="sm:hidden">Crear</span>
                  </button>
                </div>
              </div>

              {/* Lista de Rutinas (Ordenadas por Día de la Semana y Alfabéticamente) */}
              <div className="grid gap-3.5">
                {sortedRoutines.map((routine) => {
                  const dayStyle = getDayBadgeStyle(routine.dayOfWeek);
                  const dayLabel = getDayLabel(routine.dayOfWeek);
                  const catMeta = getRoutineCategoryMeta(routine.category, routine.title);
                  const CategoryIcon = catMeta.icon;

                  return (
                    <div
                      key={routine.id}
                      className="group bg-slate-900 hover:bg-slate-850 rounded-2xl border border-slate-800/90 hover:border-slate-700 p-4 transition-all shadow-md relative"
                    >
                      {/* Fila Superior: Badges y Botones de Edición / Eliminación */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {routine.dayOfWeek && routine.dayOfWeek !== 'ninguno' && (
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${dayStyle.bg} ${dayStyle.text} ${dayStyle.border} flex items-center gap-1`}
                            >
                              <CalendarIcon className="w-3 h-3" />
                              {dayLabel}
                            </span>
                          )}
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {routine.category}
                          </span>
                          {routine.isCustom && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              Personalizada
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditRoutineModal(routine)}
                            className="text-slate-500 hover:text-emerald-400 p-1.5 rounded-lg active:scale-90 transition hover:bg-slate-800"
                            title="Editar rutina"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRoutineToDelete(routine)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg active:scale-90 transition hover:bg-rose-500/10"
                            title="Eliminar rutina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Información Principal de la Rutina con Icono de Categoría */}
                      <div className="mb-3">
                        <h4 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2.5">
                          <span className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${catMeta.bg} ${catMeta.border}`}>
                            <CategoryIcon className={`w-4 h-4 ${catMeta.color}`} />
                          </span>
                          <span className="truncate">{routine.title}</span>
                        </h4>
                        {routine.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 pl-9.5">{routine.description}</p>
                        )}
                      </div>

                      {/* Botones de Acción: Ver Detalle (Popup) y Empezar Entreno */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => setSelectedRoutineDetail(routine)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700/80 active:scale-95 transition"
                        >
                          <Eye className="w-4 h-4 text-cyan-400" />
                          <span>Ver Detalle</span>
                        </button>

                        <button
                          onClick={() => handleStartRoutineWorkout(routine)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                          <span>Iniciar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {sortedRoutines.length === 0 && (
                  <div className="text-center py-10 px-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-dashed border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
                      <Wand2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">No tienes rutinas creadas todavía</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                        Crea un programa completo a medida en 30 segundos con el generador inteligente según tus días y material.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs mx-auto">
                      <button
                        onClick={handleOpenWizard}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                      >
                        <Wand2 className="w-4 h-4" />
                        <span>Generar Plan Inteligente</span>
                      </button>
                      <button
                        onClick={openCreateRoutineModal}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs active:scale-95 transition"
                      >
                        Crear Manualmente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
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

                {/* Barra de control de ejercicios: Contador y Expandir/Colapsar todos */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="font-bold text-slate-400">
                    {activeWorkout.exercises.length} {activeWorkout.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleExpandAll(true)}
                      className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
                    >
                      Expandir todos
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      onClick={() => handleToggleExpandAll(false)}
                      className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
                    >
                      Colapsar todos
                    </button>
                  </div>
                </div>

                {/* Lista de Ejercicios del Entreno Activo (Acordeón Colapsable) */}
                <div className="space-y-3">
                  {activeWorkout.exercises.map((workoutEx, exIdx) => {
                    const exerciseInfo = exercises.find((e) => e.id === workoutEx.exerciseId);
                    const previousSets = getPreviousExerciseSets(workoutEx.exerciseId);
                    const isExpanded = !!expandedExerciseIds[workoutEx.id];
                    const completedSetsCount = workoutEx.sets.filter((s) => s.completed).length;
                    const totalSetsCount = workoutEx.sets.length;
                    const isAllCompleted = totalSetsCount > 0 && completedSetsCount === totalSetsCount;
                    const lastCompletedSet = [...workoutEx.sets].reverse().find((s) => s.completed);

                    return (
                      <div
                        key={workoutEx.id}
                        className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 shadow-md ${
                          isAllCompleted
                            ? 'border-emerald-500/40 bg-slate-900/90'
                            : isExpanded
                            ? 'border-slate-700 bg-slate-900 ring-1 ring-emerald-500/20'
                            : 'border-slate-800/90 hover:border-slate-700'
                        }`}
                      >
                        {/* Cabecera Táctil del Ejercicio (Click para Expandir / Colapsar) */}
                        <div
                          onClick={() => toggleExerciseExpand(workoutEx.id)}
                          className="flex items-center justify-between gap-2 p-3 sm:p-3.5 cursor-pointer hover:bg-slate-850/60 active:bg-slate-800/50 transition select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 border transition ${
                                isAllCompleted
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}
                            >
                              {isAllCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : exIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                                {exerciseInfo?.name || 'Ejercicio'}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {exerciseInfo && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
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

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Badge de Progreso de Series */}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 font-mono-numbers transition ${
                                isAllCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-black'
                                  : completedSetsCount > 0
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700/80'
                              }`}
                            >
                              {isAllCompleted ? (
                                <>
                                  <Check className="w-3 h-3 stroke-[3]" /> Completo
                                </>
                              ) : (
                                `${completedSetsCount}/${totalSetsCount} series`
                              )}
                            </span>

                            {/* Botón Sustituir Ejercicio (Máquina Ocupada) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenSubstituteModal(exIdx);
                              }}
                              className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg active:scale-90 transition hover:bg-cyan-500/10 flex items-center gap-1 border border-transparent hover:border-cyan-500/30"
                              title="Sustituir por alternativa si la máquina está ocupada"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="hidden sm:inline text-[10px] font-bold text-cyan-400">Sustituir</span>
                            </button>

                            {/* Botón Eliminar Ejercicio */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveExerciseFromWorkout(exIdx);
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg active:scale-90 transition"
                              title="Eliminar este ejercicio"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Flecha Chevron Giratoria */}
                            <div className="p-1 text-slate-400">
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Vista Resumida cuando está colapsado */}
                        {!isExpanded && lastCompletedSet && (
                          <div
                            onClick={() => toggleExerciseExpand(workoutEx.id)}
                            className="px-3.5 pb-2.5 pt-0 text-[11px] text-slate-400 flex items-center justify-between cursor-pointer border-t border-slate-800/40 bg-slate-950/30"
                          >
                            <span className="truncate">
                              Última serie:{' '}
                              <strong className="text-slate-200 font-mono-numbers">
                                {lastCompletedSet.weight} {settings.unit} × {lastCompletedSet.reps} reps
                              </strong>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold hover:underline">
                              Toca para abrir
                            </span>
                          </div>
                        )}

                        {/* Contenido Expandido: Cabecera de Series, Filas y Botón Añadir */}
                        {isExpanded && (
                          <div className="p-3.5 sm:p-4 pt-2 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-150">
                            {/* Banner de Sobrecarga Progresiva */}
                            {(() => {
                              const feedback = getProgressiveOverloadFeedback(workoutEx.exerciseId, history, settings.unit);
                              return (
                                <div
                                  className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 transition-all ${
                                    feedback.shouldIncrease
                                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                      : feedback.hasHistory
                                      ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <div className="flex items-start gap-2 min-w-0">
                                    <Lightbulb
                                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                                        feedback.shouldIncrease ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'
                                      }`}
                                    />
                                    <div className="min-w-0">
                                      <span className="font-extrabold block text-[10px] uppercase tracking-wider mb-0.5">
                                        {feedback.shouldIncrease ? '⚡ Sobrecarga Progresiva Sugerida' : '🎯 Guía de Sesión'}
                                      </span>
                                      <p className="text-[11px] leading-relaxed opacity-95">{feedback.message}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenSubstituteModal(exIdx)}
                                    className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 active:scale-95 transition"
                                    title="Máquina ocupada: cambiar ejercicio"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Cambiar</span>
                                  </button>
                                </div>
                              );
                            })()}

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
                              <button
                                onClick={() => toggleExerciseExpand(workoutEx.id)}
                                className="text-[11px] font-semibold text-slate-500 hover:text-slate-300"
                              >
                                Plegar ejercicio ▲
                              </button>
                            </div>
                          </div>
                        )}
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
                  <span>Añadir Ejercicio a la Sesión</span>
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

              {/* Tema de la Aplicación (Modo Oscuro / Modo Claro) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {settings.theme === 'light' ? (
                    <Sun className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-emerald-400" />
                  )}
                  <div>
                    <span className="text-sm font-extrabold text-white block">Tema de la Aplicación</span>
                    <span className="text-xs text-slate-500">
                      {settings.theme === 'light' ? 'Modo Claro' : 'Modo Oscuro (Por defecto)'}
                    </span>
                  </div>
                </div>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
                      settings.theme !== 'light'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Oscuro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
                      settings.theme === 'light'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Claro</span>
                  </button>
                </div>
              </div>

              {/* Unidad de Carga */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
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

              {/* Opciones de limpieza de datos */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => {
                    if (window.confirm('¿Deseas vaciar todo el historial de entrenamientos y marcas?')) {
                      setHistory([]);
                      localStorage.setItem('gimy360_history', JSON.stringify([]));
                      alert('Historial de entrenamientos vaciado con éxito.');
                    }
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vaciar historial de entrenamientos
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Reiniciar rutinas y ejercicios a los valores iniciales predeterminados?')) {
                      setExercises(INITIAL_EXERCISES);
                      setRoutines(INITIAL_ROUTINES);
                      alert('Datos iniciales restablecidos.');
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-slate-300 hover:underline flex items-center gap-1.5"
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
          MODAL POPUP: DETALLE DE LA RUTINA
          ========================================================================== */}
      {selectedRoutineDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header del Popup */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedRoutineDetail.dayOfWeek && selectedRoutineDetail.dayOfWeek !== 'ninguno' && (
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      getDayBadgeStyle(selectedRoutineDetail.dayOfWeek).bg
                    } ${getDayBadgeStyle(selectedRoutineDetail.dayOfWeek).text} ${
                      getDayBadgeStyle(selectedRoutineDetail.dayOfWeek).border
                    } flex items-center gap-1`}
                  >
                    <CalendarIcon className="w-3 h-3" />
                    {getDayLabel(selectedRoutineDetail.dayOfWeek)}
                  </span>
                )}
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedRoutineDetail.category}
                </span>
                {selectedRoutineDetail.isCustom && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Personalizada
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedRoutineDetail(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Información General */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
              {(() => {
                const modalCatMeta = getRoutineCategoryMeta(selectedRoutineDetail.category, selectedRoutineDetail.title);
                const ModalCatIcon = modalCatMeta.icon;
                return (
                  <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                    <span className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${modalCatMeta.bg} ${modalCatMeta.border}`}>
                      <ModalCatIcon className={`w-4 h-4 ${modalCatMeta.color}`} />
                    </span>
                    <span>{selectedRoutineDetail.title}</span>
                  </h3>
                );
              })()}
              {selectedRoutineDetail.description && (
                <p className="text-xs text-slate-400 mt-1 pl-10.5">{selectedRoutineDetail.description}</p>
              )}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  Ejercicios en esta rutina ({selectedRoutineDetail.exerciseIds.length})
                </span>
                <span className="text-[10px] text-slate-500">1 serie inicial por ejercicio</span>
              </div>
            </div>

            {/* Lista Detallada de Ejercicios */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selectedRoutineDetail.exerciseIds.map((exId, idx) => {
                const ex = exercises.find((e) => e.id === exId);
                const badge = ex ? getEquipmentBadge(ex.equipment) : null;
                const prevSets = getPreviousExerciseSets(exId);
                const bestCompletedSet = prevSets.length > 0 ? prevSets[0] : null;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                          {ex?.name || 'Ejercicio'}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}>
                              {badge.label}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 capitalize">{ex?.muscle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {bestCompletedSet ? (
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">Último</span>
                          <span className="text-[11px] font-mono-numbers text-emerald-400 font-bold">
                            {bestCompletedSet.weight} {settings.unit} × {bestCompletedSet.reps}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 block">Sin marcas previas</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer con Botones */}
            <div className="p-4 border-t border-slate-800 flex items-center gap-2 bg-slate-900">
              <button
                onClick={() => {
                  const target = selectedRoutineDetail;
                  setSelectedRoutineDetail(null);
                  setRoutineToDelete(target);
                }}
                className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:scale-95 transition"
                title="Eliminar esta rutina"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const target = selectedRoutineDetail;
                  setSelectedRoutineDetail(null);
                  openEditRoutineModal(target);
                }}
                className="py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold"
                title="Editar esta rutina"
              >
                <Pencil className="w-4 h-4 text-emerald-400" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => setSelectedRoutineDetail(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const target = selectedRoutineDetail;
                  setSelectedRoutineDetail(null);
                  handleStartRoutineWorkout(target);
                }}
                className="flex-[2] py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Iniciar Entreno</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: CONFIRMAR ELIMINACIÓN DE RUTINA
          ========================================================================== */}
      {routineToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">¿Eliminar esta rutina?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Se eliminará la rutina <strong className="text-white">"{routineToDelete.title}"</strong> de forma permanente.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRoutineToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRoutine(routineToDelete.id)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 active:scale-95 transition"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: CONFIRMAR CANCELAR ENTRENO EN CURSO (FIX BOTÓN CANCELAR)
          ========================================================================== */}
      {showCancelWorkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">¿Cancelar entrenamiento?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Se detendrá el cronómetro y se descartará el progreso de esta sesión no guardada.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCancelWorkoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWorkout(null);
                  cancelRestTimer();
                  setShowCancelWorkoutModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 active:scale-95 transition"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
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
          MODAL: SUSTITUCIÓN DE EJERCICIO EN CALIENTE (MÁQUINA OCUPADA)
          ========================================================================== */}
      {substituteExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header del Modal */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-white truncate">Sustituir Ejercicio</h3>
                  <span className="text-[11px] text-slate-400">
                    Cambiar <strong className="text-cyan-400">{substituteExerciseModal.currentExercise.name}</strong> ({substituteExerciseModal.currentExercise.muscle})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSubstituteExerciseModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso inteligente de máquina ocupada */}
            <div className="p-3 bg-cyan-950/20 border-b border-cyan-500/20 px-4 text-xs text-cyan-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Elige otra alternativa para <strong className="capitalize">{substituteExerciseModal.currentExercise.muscle}</strong> si el equipo está ocupado.
              </span>
            </div>

            {/* Buscador y Filtros por Equipamiento */}
            <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar ejercicio alternativo..."
                  value={substituteSearchQuery}
                  onChange={(e) => setSubstituteSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 text-white pl-9 pr-3 py-2 rounded-xl text-xs placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Filtro de Equipamiento */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {['todos', 'mancuerna', 'barra', 'polea', 'maquina', 'smith', 'corporal'].map((eq) => (
                  <button
                    key={eq}
                    onClick={() => setSubstituteFilterEquipment(eq)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize whitespace-nowrap border transition ${
                      substituteFilterEquipment === eq
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {eq === 'todos' ? 'Todos' : eq}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Ejercicios Alternativos */}
            <div className="p-3 overflow-y-auto space-y-1.5 flex-1 divide-y divide-slate-800/40">
              {(() => {
                const currentEx = substituteExerciseModal.currentExercise;
                const existingWorkoutExIds = new Set(activeWorkout?.exercises.map((e) => e.exerciseId) || []);
                const alternatives = exercises.filter((ex) => {
                  const isSameMuscle = ex.muscle === currentEx.muscle;
                  const isNotCurrent = ex.id !== currentEx.id;
                  const notInWorkout = !existingWorkoutExIds.has(ex.id);
                  const matchesSearch = ex.name.toLowerCase().includes(substituteSearchQuery.toLowerCase());
                  const matchesEq = substituteFilterEquipment === 'todos' || ex.equipment === substituteFilterEquipment;
                  return isSameMuscle && isNotCurrent && notInWorkout && matchesSearch && matchesEq;
                });

                if (alternatives.length === 0) {
                  return (
                    <div className="text-center py-8 px-4 text-xs text-slate-500">
                      No se encontraron ejercicios alternativos con los filtros seleccionados.
                    </div>
                  );
                }

                return alternatives.map((alt) => {
                  const badge = getEquipmentBadge(alt.equipment);
                  const prevSets = getPreviousExerciseSets(alt.id);
                  const bestPrev = prevSets.length > 0 ? prevSets[0] : null;

                  return (
                    <button
                      key={alt.id}
                      onClick={() => handleApplySubstituteExercise(alt.id)}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700 transition flex items-center justify-between text-left group active:scale-[0.99]"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs sm:text-sm font-bold text-white block truncate group-hover:text-cyan-400 transition-colors">
                          {alt.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}>
                            {badge.label}
                          </span>
                          {bestPrev ? (
                            <span className="text-[10px] text-emerald-400 font-mono-numbers">
                              Marca previa: {bestPrev.weight} {settings.unit} × {bestPrev.reps}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Sin registros previos</span>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-lg shrink-0">
                        Elegir
                      </span>
                    </button>
                  );
                });
              })()}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900 text-center">
              <button
                onClick={() => setSubstituteExerciseModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: WIZARD GENERADOR AUTOMÁTICO DE RUTINAS INTELIGENTES (4 PASOS)
          ========================================================================== */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header del Asistente */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>Generador Inteligente de Rutinas</span>
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {wizardStep <= 4 ? `Paso ${wizardStep} de 4` : 'Vista Previa del Plan'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowWizardModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Progreso de Pasos */}
            <div className="w-full bg-slate-950 h-1.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${(wizardStep / 5) * 100}%` }}
              ></div>
            </div>

            {/* Cuerpo del Asistente por Pasos */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* PASO 1: DÍAS A LA SEMANA */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Paso 1</span>
                    <h4 className="text-lg font-black text-white mt-0.5">¿Cuántos días vas a entrenar a la semana?</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      El algoritmo diseñará la división óptima (Full Body, Torso/Pierna o PPL) según tu disponibilidad semanal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {[
                      {
                        days: 2,
                        title: '2 Días / Semana',
                        split: 'Full Body (2x)',
                        desc: 'Ideal para agendas ocupadas o deportistas con otras disciplinas.',
                        badge: 'Mantenimiento & Fuerza',
                      },
                      {
                        days: 3,
                        title: '3 Días / Semana',
                        split: 'Full Body (3x)',
                        desc: 'Clásico de fuerza global con máxima recuperación entre sesiones.',
                        badge: 'Alta Eficiencia',
                      },
                      {
                        days: 4,
                        title: '4 Días / Semana',
                        split: 'Torso / Pierna',
                        desc: 'La división más equilibrada para hipertrofia y progresión lineal.',
                        badge: 'Recomendado',
                      },
                      {
                        days: 5,
                        title: '5 Días / Semana',
                        split: 'PPL + Torso/Pierna',
                        desc: 'Foco en empuje, tirón y pierna con sesiones accesorias.',
                        badge: 'Volumen Alto',
                      },
                      {
                        days: 6,
                        title: '6 Días / Semana',
                        split: 'Push / Pull / Legs (2x)',
                        desc: 'Alta frecuencia y máximo volumen para atletas avanzados.',
                        badge: 'Máximo Estímulo',
                      },
                    ].map((item) => {
                      const isSelected = wizardConfig.days === item.days;
                      return (
                        <button
                          key={item.days}
                          type="button"
                          onClick={() => setWizardConfig((p) => ({ ...p, days: item.days as WizardDays }))}
                          className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.99] relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-sm font-black text-white">{item.title}</span>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                  isSelected
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                    : 'bg-slate-900 text-emerald-400 border-slate-800'
                                }`}
                              >
                                {item.split}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span>{item.badge}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 2: EQUIPAMIENTO DISPONIBLE */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Paso 2</span>
                    <h4 className="text-lg font-black text-white mt-0.5">¿Qué equipamiento tienes disponible?</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Filtramos estrictamente los 126 ejercicios para asignar solo los que puedes realizar.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {[
                      {
                        key: 'gimnasio_completo' as WizardEquipment,
                        icon: Dumbbell,
                        title: 'Gimnasio Comercial Completo',
                        desc: 'Barras olímpicas, mancuernas, poleas, multipower y máquinas guiadas.',
                        badge: 'Acceso total a 126 ejercicios',
                      },
                      {
                        key: 'solo_mancuernas' as WizardEquipment,
                        icon: Target,
                        title: 'Solo Mancuernas & Peso Corporal',
                        desc: 'Mancuernas ajustables o fijas y peso corporal. Perfecto para home gym o garaje.',
                        badge: 'Mancuernas + Corporal',
                      },
                      {
                        key: 'peso_corporal' as WizardEquipment,
                        icon: Activity,
                        title: 'Peso Corporal / Calistenia en Casa',
                        desc: 'Flexiones, fondos, sentadillas, dominadas y trabajo con tu propio peso sin aparatos.',
                        badge: 'Sin material pesado',
                      },
                    ].map((item) => {
                      const isSelected = wizardConfig.equipment === item.key;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setWizardConfig((p) => ({ ...p, equipment: item.key }))}
                          className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-500 text-white ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                  : 'bg-slate-900 text-cyan-400 border-slate-800'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-white">{item.title}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                              <span className="inline-block mt-2 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                {item.badge}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                              isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 3: OBJETIVO PRINCIPAL */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">Paso 3</span>
                    <h4 className="text-lg font-black text-white mt-0.5">¿Cuál es tu objetivo prioritario?</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Ajusta los rangos de repeticiones y la selección de compuestos y accesorios.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {[
                      {
                        key: 'hipertrofia' as WizardGoal,
                        icon: Flame,
                        title: 'Hipertrofia & Ganancia Muscular',
                        desc: 'Rango de 8-12 repeticiones. Foco en tensión mecánica, congestión y crecimiento muscular.',
                        badge: 'Reps: 8 - 12 • Descanso: 90s',
                      },
                      {
                        key: 'fuerza' as WizardGoal,
                        icon: Zap,
                        title: 'Fuerza Máxima & Cargas Pesadas',
                        desc: 'Rango de 4-6 repeticiones. Prioridad en levantamientos básicos pesados y reclutamiento neural.',
                        badge: 'Reps: 4 - 6 • Descanso: 120s',
                      },
                      {
                        key: 'acondicionamiento' as WizardGoal,
                        icon: Sparkles,
                        title: 'Acondicionamiento & Quema Calórica',
                        desc: 'Rango de 12-15 repeticiones. Mayor densidad, descansos dinámicos y resistencia muscular.',
                        badge: 'Reps: 12 - 15 • Descanso: 60s',
                      },
                    ].map((item) => {
                      const isSelected = wizardConfig.goal === item.key;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setWizardConfig((p) => ({ ...p, goal: item.key }))}
                          className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-500 text-white ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                                  : 'bg-slate-900 text-amber-400 border-slate-800'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-sm font-extrabold text-white block">{item.title}</span>
                              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                              <span className="inline-block mt-2 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                {item.badge}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-500 text-slate-950' : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 4: NIVEL DE EXPERIENCIA */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-400">Paso 4</span>
                    <h4 className="text-lg font-black text-white mt-0.5">¿Cuál es tu nivel de experiencia?</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Calibra el número de series base y la complejidad de los movimientos en cada rutina.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {[
                      {
                        key: 'principiante' as WizardLevel,
                        title: 'Principiante (< 1 año)',
                        desc: '3 series base por ejercicio. Enfoque en dominar la técnica y crear consistencia.',
                        badge: '3 series base • Progresión gradual',
                      },
                      {
                        key: 'intermedio' as WizardLevel,
                        title: 'Intermedio (1 a 3 años)',
                        desc: '3 a 4 series base. Balance óptimo de sobrecarga progresiva y recuperación.',
                        badge: '3-4 series • Sobrecarga lineal',
                      },
                      {
                        key: 'avanzado' as WizardLevel,
                        title: 'Avanzado (> 3 años)',
                        desc: '4 series efectivas con máxima intensidad y variedad de estímulos.',
                        badge: '4 series • Alto volumen',
                      },
                    ].map((item) => {
                      const isSelected = wizardConfig.level === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setWizardConfig((p) => ({ ...p, level: item.key }))}
                          className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/30 shadow-lg shadow-purple-500/10'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-extrabold text-white block">{item.title}</span>
                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                            <span className="inline-block mt-2 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              {item.badge}
                            </span>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                              isSelected ? 'border-purple-400 bg-purple-500 text-slate-950' : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 5: VISTA PREVIA Y CONFIRMACIÓN */}
              {wizardStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Resumen</span>
                    <h4 className="text-lg font-black text-white mt-0.5">¡Tu programa inteligente está listo!</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Hemos generado {generateIntelligentRoutines(wizardConfig, exercises).length} rutinas personalizadas adaptadas a tus parámetros.
                    </p>
                  </div>

                  {/* Resumen de Configuración */}
                  <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {wizardConfig.days} Días / Semana
                    </span>
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {wizardConfig.equipment.replace('_', ' ')}
                    </span>
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {wizardConfig.goal}
                    </span>
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {wizardConfig.level}
                    </span>
                  </div>

                  {/* Lista Previa de Rutinas Generadas */}
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {generateIntelligentRoutines(wizardConfig, exercises).map((rot, idx) => {
                      const dayStyle = getDayBadgeStyle(rot.dayOfWeek);
                      const dayLabel = getDayLabel(rot.dayOfWeek);
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center">
                                {idx + 1}
                              </span>
                              {rot.title}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${dayStyle.bg} ${dayStyle.text} ${dayStyle.border}`}>
                              {dayLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 pl-7 space-y-0.5">
                            {rot.exerciseIds.map((exId, exi) => {
                              const ex = exercises.find((e) => e.id === exId);
                              return (
                                <div key={exi} className="truncate">
                                  • {ex?.name || 'Ejercicio'} <span className="text-slate-600">({ex?.equipment})</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selector: Reemplazar o Añadir */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-slate-300 block">¿Cómo deseas aplicar este plan?</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setWizardReplaceMode('replace')}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition ${
                          wizardReplaceMode === 'replace'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Reemplazar rutinas actuales
                      </button>
                      <button
                        type="button"
                        onClick={() => setWizardReplaceMode('append')}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition ${
                          wizardReplaceMode === 'append'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Añadir a las existentes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer de Navegación del Wizard */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((p) => (p - 1) as any)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs active:scale-95 transition"
                >
                  Atrás
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowWizardModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs active:scale-95 transition"
                >
                  Cancelar
                </button>
              )}

              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((p) => (p + 1) as any)}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyGeneratedRoutines}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Aplicar Plan de Entrenamiento</span>
                </button>
              )}
            </div>
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
