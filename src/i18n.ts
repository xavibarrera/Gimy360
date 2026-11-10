// Gimy360 Internationalization (i18n) Module
// Supported languages: 'es' (Español) and 'en' (English - UK)

export type Language = 'es' | 'en';

export interface Translations {
  appName: string;
  appSubtitle: string;
  appSubtitleActive: string;
  
  // Navigation Tabs
  tabRoutines: string;
  tabWorkout: string;
  tabExercises: string;
  tabProgress: string;
  tabSettings: string;

  // General Actions
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  confirm: string;
  close: string;
  all: string;
  search: string;
  reps: string;
  weight: string;
  sets: string;
  volume: string;
  time: string;
  rest: string;
  seconds: string;

  // Muscles
  muscleChest: string;
  muscleShoulders: string;
  muscleBack: string;
  muscleLegs: string;
  muscleArms: string;
  muscleCore: string;

  // Equipment
  equipBarbell: string;
  equipDumbbell: string;
  equipMachine: string;
  equipCable: string;
  equipBodyweight: string;
  equipSmith: string;

  // Active Workout Screen
  activeWorkoutTitle: string;
  activeWorkoutHeaderTitle: string;
  noActiveWorkout: string;
  noActiveWorkoutDesc: string;
  startWorkoutBtn: string;
  finishWorkoutBtn: string;
  cancelWorkoutBtn: string;
  cancelWorkoutModalTitle: string;
  cancelWorkoutModalDesc: string;
  cancelWorkoutConfirm: string;
  cancelWorkoutKeep: string;
  addSetBtn: string;
  addExerciseToSession: string;
  swapExerciseBtn: string;
  deleteExerciseModalTitle: string;
  deleteExerciseModalDesc: (exerciseName: string) => string;
  deleteExerciseModalRoutineNote: string;
  deleteExerciseConfirm: string;
  deleteExerciseCancel: string;
  finishExerciseBtn: string;
  exerciseFinishedBadge: string;
  reopenExerciseBtn: string;
  overloadSuggestion: (kg: number, reps: number) => string;
  setColHeader: string;
  prevColHeader: string;
  targetColHeader: string;
  weightColHeader: string;
  repsColHeader: string;
  doneColHeader: string;
  rpeColHeader: string;
  notesPlaceholder: string;
  restTimerModalTitle: string;
  minRestTimer: string;
  skipRestTimer: string;
  activeTimerBanner: string;

  // Finish Workout Celebration Modal
  finishModalHeading: string;
  finishModalSubtitle: string;
  finishModalMsg: string;
  shareInstagramBtn: string;
  viewHistoryBtn: string;

  // Instagram Share Story Modal
  instagramModalTitle: string;
  instagramModalSub: string;
  themeSunset: string;
  themeEmerald: string;
  themeCyan: string;
  shareInstagramStories: string;
  preparingStory: string;
  saveImage: string;
  copyText: string;
  copied: string;
  openInstagram: string;

  // Routines View
  routinesHeading: string;
  routinesSub: string;
  generateSmartRoutineBtn: string;
  newRoutineBtn: string;
  startRoutineBtn: string;
  routineDetailTitle: string;
  editRoutineTitle: string;
  createRoutineTitle: string;
  deleteRoutineConfirm: string;
  deleteRoutineBtn: string;
  routineNameLabel: string;
  routineCategoryLabel: string;
  routineDescLabel: string;
  routineDayLabel: string;
  exercisesCount: (count: number) => string;
  noRoutinesMsg: string;
  noRoutinesSub: string;

  // Onboarding Wizard (Smart Routine Generator)
  wizardTitle: string;
  wizardSub: string;
  wizardStep1Title: string;
  wizardStep1Sub: string;
  wizardStep2Title: string;
  wizardStep2Sub: string;
  wizardStep3Title: string;
  wizardStep3Sub: string;
  wizardStep4Title: string;
  wizardStep4Sub: string;
  wizardStep5Title: string;
  wizardStep5Sub: string;
  wizardDays2: string;
  wizardDays3: string;
  wizardDays4: string;
  wizardDays5: string;
  wizardDays6: string;
  equipFullGym: string;
  equipFullGymDesc: string;
  equipDumbbellsOnly: string;
  equipDumbbellsOnlyDesc: string;
  equipBodyweightHome: string;
  equipBodyweightHomeDesc: string;
  goalHypertrophy: string;
  goalHypertrophyDesc: string;
  goalStrength: string;
  goalStrengthDesc: string;
  goalConditioning: string;
  goalConditioningDesc: string;
  levelBeginner: string;
  levelBeginnerDesc: string;
  levelIntermediate: string;
  levelIntermediateDesc: string;
  levelAdvanced: string;
  levelAdvancedDesc: string;
  wizardModeReplace: string;
  wizardModeReplaceDesc: string;
  wizardModeAppend: string;
  wizardModeAppendDesc: string;
  wizardGenerateBtn: string;
  wizardBackBtn: string;
  wizardNextBtn: string;

  // Exercises Catalog View
  catalogHeading: string;
  catalogSub: string;
  searchExercisePlaceholder: string;
  customExerciseBadge: string;
  newExerciseBtn: string;
  record1RM: string;
  noRecord: string;
  viewProgressChart: string;
  noActivityYetCatalog: string;
  createExerciseModalTitle: string;
  exerciseNameLabel: string;
  exerciseMuscleLabel: string;
  exerciseEquipLabel: string;

  // History & Progress View
  calendarSubTab: string;
  progressSubTab: string;
  selectExerciseMeasure: string;
  withActivityBadge: (count: number) => string;
  estimated1RM: string;
  maxWeightRecord: string;
  recordedSessions: string;
  epleyFormula: string;
  absoluteRecord: string;
  progressiveCurve: string;
  curveSubtitle: string;
  loadHistoryTable: string;
  noRecordsForExercise: string;
  noActivityOverall: string;
  noActivityOverallDesc: string;
  goToTrainBtn: string;
  noSessionsOnDay: string;
  selectedDayHeading: string;
  daySessionsCount: (count: number) => string;

  // Settings View
  settingsHeading: string;
  pwaCardTitle: string;
  pwaCardSub: string;
  pwaInstallBtn: string;
  pwaInstalledOrHelp: string;
  preferencesHeading: string;
  themeTitle: string;
  themeDark: string;
  themeLight: string;
  themeDarkSub: string;
  themeLightSub: string;
  weightUnitTitle: string;
  weightUnitSub: string;
  restTimerTitle: string;
  restTimerSub: string;
  soundTitle: string;
  soundSub: string;
  vibrateTitle: string;
  vibrateSub: string;
  languageTitle: string;
  languageSub: string;
  langSpanish: string;
  langEnglishUk: string;
  dataManagementHeading: string;
  exportDataBtn: string;
  importDataBtn: string;
  clearDataBtn: string;
  clearDataConfirm: string;

  // Exercise Swap Modal
  swapModalTitle: string;
  swapModalSub: string;
  filterAlternativesSearch: string;
  noAlternativesFound: string;
  swapConfirmBtn: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  es: {
    appName: 'GIMY360',
    appSubtitle: 'Workout & Load Progress',
    appSubtitleActive: 'Entreno en Curso',

    // Tabs
    tabRoutines: 'Rutinas',
    tabWorkout: 'Entreno',
    tabExercises: 'Ejercicios',
    tabProgress: 'Progreso',
    tabSettings: 'Ajustes',

    // General Actions
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    all: 'Todos',
    search: 'Buscar...',
    reps: 'reps',
    weight: 'peso',
    sets: 'series',
    volume: 'volumen',
    time: 'tiempo',
    rest: 'descanso',
    seconds: 'seg',

    // Muscles
    muscleChest: 'Pecho',
    muscleShoulders: 'Hombro',
    muscleBack: 'Espalda',
    muscleLegs: 'Piernas',
    muscleArms: 'Brazos',
    muscleCore: 'Core',

    // Equipment
    equipBarbell: 'Barra',
    equipDumbbell: 'Mancuerna',
    equipMachine: 'Máquina',
    equipCable: 'Polea / Cable',
    equipBodyweight: 'Peso Corporal',
    equipSmith: 'Multipower / Smith',

    // Active Workout Screen
    activeWorkoutTitle: 'Entrenamiento en Curso',
    activeWorkoutHeaderTitle: 'Sesión Activa',
    noActiveWorkout: 'No hay entrenamiento activo',
    noActiveWorkoutDesc: 'Selecciona una rutina para comenzar a registrar tus series y progresar con sobrecarga.',
    startWorkoutBtn: 'Ir a Rutinas y Empezar',
    finishWorkoutBtn: 'Finalizar y Guardar Entreno',
    cancelWorkoutBtn: 'Cancelar Entreno',
    cancelWorkoutModalTitle: '¿Cancelar Entrenamiento?',
    cancelWorkoutModalDesc: 'Se detendrá el cronómetro y se descartará el progreso de esta sesión no guardada.',
    cancelWorkoutConfirm: 'Sí, Cancelar',
    cancelWorkoutKeep: 'Continuar Entrenando',
    addSetBtn: '+ Añadir Serie',
    addExerciseToSession: 'Añadir Ejercicio a la Sesión',
    swapExerciseBtn: 'Cambiar Ejercicio',
    deleteExerciseModalTitle: '¿Eliminar Ejercicio?',
    deleteExerciseModalDesc: (name) => `¿Seguro que deseas eliminar «${name}» de esta sesión de entrenamiento?`,
    deleteExerciseModalRoutineNote: 'Nota: Si proviene de una rutina guardada, también se quitará de la plantilla para próximos entrenamientos.',
    deleteExerciseConfirm: 'Sí, Eliminar',
    deleteExerciseCancel: 'Cancelar',
    finishExerciseBtn: 'Terminar Ejercicio',
    exerciseFinishedBadge: 'Ejercicio Acabado',
    reopenExerciseBtn: 'Reabrir Ejercicio',
    overloadSuggestion: (kg, reps) => `💡 Sugerencia: Intenta +${kg} kg o +${reps} rep hoy`,
    setColHeader: 'SERIE',
    prevColHeader: 'PREVIO',
    targetColHeader: 'OBJETIVO',
    weightColHeader: 'CARGA',
    repsColHeader: 'REPS',
    doneColHeader: 'LISTO',
    rpeColHeader: 'RPE',
    notesPlaceholder: 'Añadir notas técnicas o sensaciones...',
    restTimerModalTitle: 'Descanso en Curso',
    minRestTimer: 'Minimizar',
    skipRestTimer: 'Saltar Descanso',
    activeTimerBanner: 'Descanso activo',

    // Finish Celebration Modal
    finishModalHeading: '¡Entrenamiento Completado!',
    finishModalSubtitle: 'Sesión Finalizada con Éxito',
    finishModalMsg: 'Gran trabajo de sobrecarga. Tus cargas han sido registradas en tu historial y calendario para proyectar tu 1RM.',
    shareInstagramBtn: 'Publicar en Instagram Stories',
    viewHistoryBtn: 'Ver en Historial & Calendario',

    // Instagram Share Story Modal
    instagramModalTitle: 'Publicar en Instagram',
    instagramModalSub: 'Tarjeta de Story en formato 9:16',
    themeSunset: 'Atardecer',
    themeEmerald: 'Esmeralda',
    themeCyan: 'Cyber Cyan',
    shareInstagramStories: 'Compartir en Instagram Stories',
    preparingStory: 'Preparando Story...',
    saveImage: 'Guardar Imagen',
    copyText: 'Copiar Texto',
    copied: '¡Copiado!',
    openInstagram: 'Abrir Instagram',

    // Routines View
    routinesHeading: 'Tus Rutinas de Fuerza',
    routinesSub: 'Selecciona un programa para iniciar tu entrenamiento',
    generateSmartRoutineBtn: 'Generar Rutina Inteligente',
    newRoutineBtn: 'Nueva Rutina',
    startRoutineBtn: 'Iniciar Entreno',
    routineDetailTitle: 'Detalle de Rutina',
    editRoutineTitle: 'Editar Rutina',
    createRoutineTitle: 'Crear Nueva Rutina',
    deleteRoutineConfirm: '¿Seguro que deseas eliminar esta rutina? Esta acción no se puede deshacer.',
    deleteRoutineBtn: 'Eliminar Rutina',
    routineNameLabel: 'Nombre de la Rutina',
    routineCategoryLabel: 'Categoría o Enfoque',
    routineDescLabel: 'Descripción',
    routineDayLabel: 'Día Sugerido',
    exercisesCount: (count) => `${count} ejercicios`,
    noRoutinesMsg: 'No tienes rutinas configuradas',
    noRoutinesSub: 'Crea tu propia rutina personalizada o genera un programa inteligente con nuestro asistente.',

    // Onboarding Wizard
    wizardTitle: 'Generador Inteligente de Rutinas',
    wizardSub: 'Configuración personalizada paso a paso',
    wizardStep1Title: '¿Cuántos días vas a entrenar por semana?',
    wizardStep1Sub: 'El algoritmo distribuirá la frecuencia y volumen muscular ideal.',
    wizardStep2Title: '¿Qué equipamiento tienes disponible?',
    wizardStep2Sub: 'Filtraremos únicamente los ejercicios con el material a tu alcance.',
    wizardStep3Title: '¿Cuál es tu objetivo prioritario?',
    wizardStep3Sub: 'Adaptaremos el rango de repeticiones y la estructura de volumen.',
    wizardStep4Title: '¿Cuál es tu nivel de experiencia en fuerza?',
    wizardStep4Sub: 'Ajustará la complejidad de los ejercicios y la progresión.',
    wizardStep5Title: '¡Todo listo para crear tu programa!',
    wizardStep5Sub: 'Revisa las opciones seleccionadas y el método de guardado.',
    wizardDays2: '2 Días / Semana',
    wizardDays3: '3 Días / Semana',
    wizardDays4: '4 Días / Semana',
    wizardDays5: '5 Días / Semana',
    wizardDays6: '6 Días / Semana',
    equipFullGym: 'Gimnasio Completo',
    equipFullGymDesc: 'Barras, mancuernas, poleas y todas las máquinas disponibles.',
    equipDumbbellsOnly: 'Solo Mancuernas',
    equipDumbbellsOnlyDesc: 'Ideal para entrenar en casa o gimnasios con material libre limitado.',
    equipBodyweightHome: 'Peso Corporal / Calistenia',
    equipBodyweightHomeDesc: 'Ejercicios sin equipamiento o con barra de dominadas en casa.',
    goalHypertrophy: 'Hipertrofia / Ganancia Muscular',
    goalHypertrophyDesc: 'Volumen moderado a alto, 8-12 repeticiones por serie.',
    goalStrength: 'Fuerza Máxima',
    goalStrengthDesc: 'Cargas altas multiarticulares, 4-6 repeticiones pesadas.',
    goalConditioning: 'Acondicionamiento / Resistencia',
    goalConditioningDesc: 'Densidad alta, menor descanso, 12-15+ repeticiones.',
    levelBeginner: 'Principiante',
    levelBeginnerDesc: 'Menos de 1 año entrenando de forma constante.',
    levelIntermediate: 'Intermedio',
    levelIntermediateDesc: '1 a 3 años aplicando sobrecarga progresiva.',
    levelAdvanced: 'Avanzado',
    levelAdvancedDesc: 'Más de 3 años, técnica depurada y alta capacidad de carga.',
    wizardModeReplace: 'Reemplazar rutinas actuales',
    wizardModeReplaceDesc: 'Sustituye tus rutinas existentes por el nuevo plan inteligente.',
    wizardModeAppend: 'Añadir a mis rutinas existentes',
    wizardModeAppendDesc: 'Mantiene tus rutinas actuales y añade el nuevo plan generado.',
    wizardGenerateBtn: 'Generar Plan Ahora',
    wizardBackBtn: 'Atrás',
    wizardNextBtn: 'Siguiente',

    // Catalog View
    catalogHeading: 'Catálogo de Ejercicios',
    catalogSub: '126 ejercicios organizados por tipo muscular y material',
    searchExercisePlaceholder: 'Buscar ejercicio por nombre...',
    customExerciseBadge: 'Personalizado',
    newExerciseBtn: 'Crear Ejercicio',
    record1RM: 'Récord 1RM',
    noRecord: 'Sin registro',
    viewProgressChart: 'Ver progresión de este ejercicio',
    noActivityYetCatalog: 'Sin registros de actividad todavía',
    createExerciseModalTitle: 'Añadir Nuevo Ejercicio',
    exerciseNameLabel: 'Nombre del Ejercicio',
    exerciseMuscleLabel: 'Grupo Muscular Principal',
    exerciseEquipLabel: 'Material Requerido',

    // History & Progress View
    calendarSubTab: 'Calendario',
    progressSubTab: 'Progreso de Cargas',
    selectExerciseMeasure: 'Selecciona Ejercicio para Medir Progresión:',
    withActivityBadge: (count) => `${count} con registro`,
    estimated1RM: '1RM Estimada',
    maxWeightRecord: 'Carga Máxima',
    recordedSessions: 'Sesiones',
    epleyFormula: 'Fórmula Epley',
    absoluteRecord: 'Récord absoluto',
    progressiveCurve: 'Curva de Sobrecarga Progresiva',
    curveSubtitle: '1RM Estimada (kg) vs Sesión',
    loadHistoryTable: 'Histórico de Cargas',
    noRecordsForExercise: 'Aún no hay series registradas para este ejercicio. ¡Completa un entrenamiento para ver su evolución!',
    noActivityOverall: 'Sin registros de actividad todavía',
    noActivityOverallDesc: 'Completa y finaliza tu primer entrenamiento para que aparezcan aquí los ejercicios con registros y puedas analizar su progresión de cargas y 1RM estimada.',
    goToTrainBtn: 'Ir a Entrenar',
    noSessionsOnDay: 'No hay entrenamientos registrados para este día.',
    selectedDayHeading: 'Entrenamientos del Día',
    daySessionsCount: (count) => `${count} sesiones registradas`,

    // Settings View
    settingsHeading: 'Configuración de la Aplicación',
    pwaCardTitle: 'Aplicación Web Progresiva (PWA)',
    pwaCardSub: '100% Funcional sin conexión a internet',
    pwaInstallBtn: 'Instalar Gimy360 en tu Dispositivo',
    pwaInstalledOrHelp: '📱 Para instalar en iOS: Pulsa el botón "Compartir" de Safari y elige "Añadir a la pantalla de inicio". En Chrome/Android: Pulsa el menú de 3 puntos y selecciona "Instalar aplicación".',
    preferencesHeading: 'Preferencias',
    themeTitle: 'Tema de la Aplicación',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    themeDarkSub: 'Modo Oscuro (Por defecto)',
    themeLightSub: 'Modo Claro',
    weightUnitTitle: 'Unidad de Peso',
    weightUnitSub: 'Kilogramos o Libras',
    restTimerTitle: 'Temporizador de Descanso',
    restTimerSub: 'Segundos sugeridos entre series completadas',
    soundTitle: 'Efectos de Sonido',
    soundSub: 'Pitido sonoro al finalizar la cuenta atrás',
    vibrateTitle: 'Vibración Háptica',
    vibrateSub: 'Vibración al terminar descansos en móviles',
    languageTitle: 'Idioma / Language',
    languageSub: 'Selecciona tu idioma preferido para la interfaz',
    langSpanish: 'Español 🇪🇸',
    langEnglishUk: 'English (UK) 🇬🇧',
    dataManagementHeading: 'Gestión de Datos',
    exportDataBtn: 'Exportar Backup (JSON)',
    importDataBtn: 'Restaurar Backup (JSON)',
    clearDataBtn: 'Restablecer Datos de Fábrica',
    clearDataConfirm: '¿Seguro que deseas borrar todos los entrenamientos, historial y rutinas? Esta acción es irreversible.',

    // Hot Swap Exercise Modal
    swapModalTitle: 'Cambiar Ejercicio',
    swapModalSub: 'Sustituir por máquina o variante equivalente',
    filterAlternativesSearch: 'Buscar alternativas...',
    noAlternativesFound: 'No se encontraron ejercicios alternativos con los filtros seleccionados.',
    swapConfirmBtn: 'Sustituir Ejercicio',
  },

  en: {
    appName: 'GIMY360',
    appSubtitle: 'Workout & Load Progress',
    appSubtitleActive: 'Active Workout',

    // Tabs
    tabRoutines: 'Routines',
    tabWorkout: 'Workout',
    tabExercises: 'Exercises',
    tabProgress: 'Progress',
    tabSettings: 'Settings',

    // General Actions
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    close: 'Close',
    all: 'All',
    search: 'Search...',
    reps: 'reps',
    weight: 'weight',
    sets: 'sets',
    volume: 'volume',
    time: 'time',
    rest: 'rest',
    seconds: 'sec',

    // Muscles
    muscleChest: 'Chest',
    muscleShoulders: 'Shoulders',
    muscleBack: 'Back',
    muscleLegs: 'Legs',
    muscleArms: 'Arms',
    muscleCore: 'Core',

    // Equipment
    equipBarbell: 'Barbell',
    equipDumbbell: 'Dumbbell',
    equipMachine: 'Machine',
    equipCable: 'Cable',
    equipBodyweight: 'Bodyweight',
    equipSmith: 'Smith Machine',

    // Active Workout Screen
    activeWorkoutTitle: 'Current Workout Session',
    activeWorkoutHeaderTitle: 'Active Session',
    noActiveWorkout: 'No active workout',
    noActiveWorkoutDesc: 'Select a routine to start logging your sets and tracking progressive overload.',
    startWorkoutBtn: 'Go to Routines & Start',
    finishWorkoutBtn: 'Finish & Save Workout',
    cancelWorkoutBtn: 'Cancel Workout',
    cancelWorkoutModalTitle: 'Cancel Workout?',
    cancelWorkoutModalDesc: 'The timer will stop and all unsaved progress in this session will be discarded.',
    cancelWorkoutConfirm: 'Yes, Cancel',
    cancelWorkoutKeep: 'Keep Training',
    addSetBtn: '+ Add Set',
    addExerciseToSession: 'Add Exercise to Session',
    swapExerciseBtn: 'Swap Exercise',
    deleteExerciseModalTitle: 'Remove Exercise?',
    deleteExerciseModalDesc: (name) => `Are you sure you want to remove "${name}" from this workout session?`,
    deleteExerciseModalRoutineNote: 'Note: If it belongs to a saved routine, it will also be removed from the template for future workouts.',
    deleteExerciseConfirm: 'Yes, Remove',
    deleteExerciseCancel: 'Cancel',
    finishExerciseBtn: 'Finish Exercise',
    exerciseFinishedBadge: 'Exercise Finished',
    reopenExerciseBtn: 'Reopen Exercise',
    overloadSuggestion: (kg, reps) => `💡 Suggestion: Try +${kg} kg or +${reps} rep today`,
    setColHeader: 'SET',
    prevColHeader: 'PREV',
    targetColHeader: 'TARGET',
    weightColHeader: 'LOAD',
    repsColHeader: 'REPS',
    doneColHeader: 'DONE',
    rpeColHeader: 'RPE',
    notesPlaceholder: 'Add technique cues or notes...',
    restTimerModalTitle: 'Rest in Progress',
    minRestTimer: 'Minimise',
    skipRestTimer: 'Skip Rest',
    activeTimerBanner: 'Active rest',

    // Finish Celebration Modal
    finishModalHeading: 'Workout Completed!',
    finishModalSubtitle: 'Session Successfully Logged',
    finishModalMsg: 'Brilliant progressive overload session. Your loads have been saved to your history and calendar to project your 1RM.',
    shareInstagramBtn: 'Share to Instagram Stories',
    viewHistoryBtn: 'View History & Calendar',

    // Instagram Share Story Modal
    instagramModalTitle: 'Share to Instagram',
    instagramModalSub: '9:16 Story Card Generator',
    themeSunset: 'Sunset',
    themeEmerald: 'Emerald',
    themeCyan: 'Cyber Cyan',
    shareInstagramStories: 'Share to Instagram Stories',
    preparingStory: 'Preparing Story...',
    saveImage: 'Save Image',
    copyText: 'Copy Text',
    copied: 'Copied!',
    openInstagram: 'Open Instagram',

    // Routines View
    routinesHeading: 'Your Strength Routines',
    routinesSub: 'Choose a programme to begin your training session',
    generateSmartRoutineBtn: 'Smart Routine Generator',
    newRoutineBtn: 'New Routine',
    startRoutineBtn: 'Start Workout',
    routineDetailTitle: 'Routine Details',
    editRoutineTitle: 'Edit Routine',
    createRoutineTitle: 'Create New Routine',
    deleteRoutineConfirm: 'Are you sure you want to delete this routine? This action cannot be undone.',
    deleteRoutineBtn: 'Delete Routine',
    routineNameLabel: 'Routine Name',
    routineCategoryLabel: 'Category or Focus',
    routineDescLabel: 'Description',
    routineDayLabel: 'Suggested Day',
    exercisesCount: (count) => `${count} exercises`,
    noRoutinesMsg: 'No routines configured yet',
    noRoutinesSub: 'Build your own custom routine or generate a smart training programme with our wizard.',

    // Onboarding Wizard
    wizardTitle: 'Smart Routine Generator',
    wizardSub: 'Personalised step-by-step setup',
    wizardStep1Title: 'How many days per week will you train?',
    wizardStep1Sub: 'The algorithm will distribute ideal muscle frequency and training volume.',
    wizardStep2Title: 'What equipment do you have access to?',
    wizardStep2Sub: 'We will filter strictly for exercises available with your kit.',
    wizardStep3Title: 'What is your primary training goal?',
    wizardStep3Sub: 'We will tailor rep ranges, set intensity, and volume structure.',
    wizardStep4Title: 'What is your current strength experience level?',
    wizardStep4Sub: 'Adjusts exercise complexity and progression rates.',
    wizardStep5Title: 'Ready to generate your programme!',
    wizardStep5Sub: 'Review your selected preferences and choose how to save them.',
    wizardDays2: '2 Days / Week',
    wizardDays3: '3 Days / Week',
    wizardDays4: '4 Days / Week',
    wizardDays5: '5 Days / Week',
    wizardDays6: '6 Days / Week',
    equipFullGym: 'Full Commercial Gym',
    equipFullGymDesc: 'Barbells, dumbbells, cables, and full machine availability.',
    equipDumbbellsOnly: 'Dumbbells Only',
    equipDumbbellsOnlyDesc: 'Ideal for home gyms or spaces with free weight dumbbells.',
    equipBodyweightHome: 'Bodyweight / Calisthenics',
    equipBodyweightHomeDesc: 'Equipment-free training or pull-up bar home workouts.',
    goalHypertrophy: 'Hypertrophy / Muscle Building',
    goalHypertrophyDesc: 'Moderate to high volume, 8-12 reps per set for muscle growth.',
    goalStrength: 'Maximal Strength',
    goalStrengthDesc: 'Heavy compound lifts, 4-6 reps with progressive load.',
    goalConditioning: 'Conditioning / Endurance',
    goalConditioningDesc: 'High training density, shorter rest, 12-15+ reps per set.',
    levelBeginner: 'Beginner',
    levelBeginnerDesc: 'Under 1 year of consistent structured lifting.',
    levelIntermediate: 'Intermediate',
    levelIntermediateDesc: '1 to 3 years applying progressive overload systematically.',
    levelAdvanced: 'Advanced',
    levelAdvancedDesc: '3+ years with honed technique and high load capacity.',
    wizardModeReplace: 'Replace current routines',
    wizardModeReplaceDesc: 'Overwrites existing default routines with the new smart plan.',
    wizardModeAppend: 'Add to existing routines',
    wizardModeAppendDesc: 'Keeps your existing routines and adds the newly generated plan.',
    wizardGenerateBtn: 'Generate Programme Now',
    wizardBackBtn: 'Back',
    wizardNextBtn: 'Next',

    // Catalog View
    catalogHeading: 'Exercise Library',
    catalogSub: '126 exercises categorised by muscle group and equipment',
    searchExercisePlaceholder: 'Search exercise by name...',
    customExerciseBadge: 'Custom',
    newExerciseBtn: 'New Exercise',
    record1RM: '1RM Record',
    noRecord: 'No record',
    viewProgressChart: 'View progression chart for this exercise',
    noActivityYetCatalog: 'No activity recorded yet',
    createExerciseModalTitle: 'Add New Exercise',
    exerciseNameLabel: 'Exercise Name',
    exerciseMuscleLabel: 'Target Muscle Group',
    exerciseEquipLabel: 'Required Equipment',

    // History & Progress View
    calendarSubTab: 'Calendar',
    progressSubTab: 'Load Progression',
    selectExerciseMeasure: 'Select Exercise to Analyse Progression:',
    withActivityBadge: (count) => `${count} with data`,
    estimated1RM: 'Estimated 1RM',
    maxWeightRecord: 'Max Load',
    recordedSessions: 'Sessions',
    epleyFormula: 'Epley Formula',
    absoluteRecord: 'All-time best',
    progressiveCurve: 'Progressive Overload Curve',
    curveSubtitle: 'Estimated 1RM (kg) vs Session',
    loadHistoryTable: 'Load History Log',
    noRecordsForExercise: 'No logged sets for this exercise yet. Complete a workout to view your progression!',
    noActivityOverall: 'No recorded activity yet',
    noActivityOverallDesc: 'Complete and finish your first workout session to display exercises here and analyse load progression and estimated 1RM.',
    goToTrainBtn: 'Start Training',
    noSessionsOnDay: 'No workouts logged for this day.',
    selectedDayHeading: 'Workouts on Selected Day',
    daySessionsCount: (count) => `${count} recorded sessions`,

    // Settings View
    settingsHeading: 'Application Settings',
    pwaCardTitle: 'Progressive Web App (PWA)',
    pwaCardSub: '100% Functional offline without internet connection',
    pwaInstallBtn: 'Install Gimy360 on your Device',
    pwaInstalledOrHelp: '📱 To install on iOS: Tap Safari "Share" button and choose "Add to Home Screen". On Chrome/Android: Tap the 3-dot menu and select "Install app".',
    preferencesHeading: 'Preferences',
    themeTitle: 'App Visual Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeDarkSub: 'Dark Mode (Default)',
    themeLightSub: 'Light Mode',
    weightUnitTitle: 'Weight Unit',
    weightUnitSub: 'Kilograms or Pounds',
    restTimerTitle: 'Default Rest Timer',
    restTimerSub: 'Suggested rest seconds between completed sets',
    soundTitle: 'Sound Effects',
    soundSub: 'Audio alert when countdown reaches zero',
    vibrateTitle: 'Haptic Feedback',
    vibrateSub: 'Vibrate upon rest completion on mobile devices',
    languageTitle: 'Language / Idioma',
    languageSub: 'Choose your interface language',
    langSpanish: 'Español 🇪🇸',
    langEnglishUk: 'English (UK) 🇬🇧',
    dataManagementHeading: 'Data Management',
    exportDataBtn: 'Export Backup (JSON)',
    importDataBtn: 'Restore Backup (JSON)',
    clearDataBtn: 'Factory Reset All Data',
    clearDataConfirm: 'Are you sure you want to delete all workouts, history, and routines? This cannot be undone.',

    // Exercise Swap Modal
    swapModalTitle: 'Swap Exercise',
    swapModalSub: 'Replace with an equivalent machine or variation',
    filterAlternativesSearch: 'Search alternatives...',
    noAlternativesFound: 'No alternative exercises found matching your filters.',
    swapConfirmBtn: 'Swap Exercise',
  },
};

// Exercise translations in English (UK) for all 126 catalog exercises
export const EXERCISE_EN_NAMES: Record<string, string> = {
  // Chest
  'ex-1': 'Flat Barbell Bench Press',
  'ex-2': 'Incline Dumbbell Press',
  'ex-3': 'Cable Crossover Flyes',
  'ex-4': 'Chest Press Machine',
  'ex-5': 'Parallel Bar Dips',
  'ex-6': 'Incline Smith Machine Press',
  'ex-37': 'Incline Barbell Bench Press',
  'ex-38': 'Decline Barbell Bench Press',
  'ex-39': 'Flat Dumbbell Bench Press',
  'ex-40': 'Decline Dumbbell Press',
  'ex-41': 'Flat Dumbbell Flyes',
  'ex-42': 'Incline Dumbbell Flyes',
  'ex-43': 'Pec Deck Machine',
  'ex-44': 'Converging Chest Press Machine',
  'ex-45': 'Low-to-High Cable Flyes (Upper Chest)',
  'ex-46': 'High-to-Low Cable Flyes (Lower Chest)',
  'ex-47': 'Flat Smith Machine Bench Press',
  'ex-48': 'Decline Smith Machine Press',
  'ex-49': 'Push-ups',
  'ex-50': 'Decline Push-ups',
  'ex-51': 'Dumbbell Pullover',

  // Back
  'ex-7': 'Lat Pulldown',
  'ex-8': '45° Barbell Bent-Over Row',
  'ex-9': 'Seated Cable Row (Close Grip)',
  'ex-10': 'Pull-ups (Overhand Grip)',
  'ex-11': 'Conventional Deadlift',
  'ex-12': 'Single-Arm Dumbbell Row',
  'ex-13': 'Straight-Arm Cable Pulldown',
  'ex-52': 'Chin-ups (Underhand Grip)',
  'ex-53': 'Neutral-Grip Pull-ups',
  'ex-54': 'Neutral / Close-Grip Lat Pulldown',
  'ex-55': 'Single-Arm High Cable Pulldown',
  'ex-56': 'Chest-Supported T-Bar Row',
  'ex-57': 'Free-Weight T-Bar Row',
  'ex-58': 'Pendlay Barbell Row',
  'ex-59': 'Flat Bench Seal Row',
  'ex-60': 'Lever Machine Row',
  'ex-61': 'Single-Arm Seated Cable Row',
  'ex-62': 'Smith Machine Bent-Over Row',
  'ex-63': 'Back Hyperextensions',
  'ex-64': 'Sumo Deadlift',
  'ex-65': 'Barbell Shrugs',
  'ex-66': 'Dumbbell Shrugs',
  'ex-67': 'Smith Machine Shrugs',

  // Legs
  'ex-14': 'Barbell Back Squat',
  'ex-15': '45° Incline Leg Press',
  'ex-16': 'Leg Extension',
  'ex-17': 'Lying Leg Curl',
  'ex-18': 'Bulgarian Split Squat',
  'ex-19': 'Barbell Hip Thrust',
  'ex-20': 'Standing Calf Raise',
  'ex-68': 'Barbell Front Squat',
  'ex-69': 'Hack Squat Machine',
  'ex-70': 'Smith Machine Squat',
  'ex-71': 'Goblet Squat',
  'ex-72': 'Walking Dumbbell Lunges',
  'ex-73': 'Reverse Barbell Lunges',
  'ex-74': 'Romanian Deadlift (RDL) with Barbell',
  'ex-75': 'Dumbbell Romanian Deadlift (RDL)',
  'ex-76': 'Seated Leg Curl',
  'ex-77': 'Standing Cable Leg Curl',
  'ex-78': 'Nordic Hamstring Curl',
  'ex-79': 'Horizontal Leg Press',
  'ex-80': 'Hip Abductor Machine',
  'ex-81': 'Hip Adductor Machine',
  'ex-82': 'Glute Kickback on Cable',
  'ex-83': 'Hip Thrust Machine',
  'ex-84': 'Seated Calf Raise',
  'ex-85': 'Calf Press on Leg Press Machine',
  'ex-86': 'Single-Leg Standing Calf Raise',

  // Shoulders
  'ex-21': 'Standing Overhead Barbell Press',
  'ex-22': 'Dumbbell Lateral Raise',
  'ex-23': 'Cable Lateral Raise',
  'ex-24': 'Rope Face Pull',
  'ex-25': 'Bent-Over Dumbbell Rear Delt Flyes',
  'ex-26': 'Smith Machine Overhead Press',
  'ex-87': 'Seated Dumbbell Shoulder Press',
  'ex-88': 'Arnold Dumbbell Press',
  'ex-89': 'Shoulder Press Machine',
  'ex-90': 'Dumbbell Front Raise',
  'ex-91': 'Cable Front Raise',
  'ex-92': 'Weight Plate Front Raise',
  'ex-93': 'Lateral Raise Machine',
  'ex-94': 'Reverse Pec Deck Rear Delt Flyes',
  'ex-95': 'Rear Delt Cable Cross',
  'ex-96': 'EZ-Bar Upright Row',
  'ex-97': 'Cable Upright Row',
  'ex-98': 'Incline Bench Cable Y-Raises',

  // Arms
  'ex-27': 'EZ-Bar Bicep Curl',
  'ex-28': 'Dumbbell Hammer Curl',
  'ex-29': 'Preacher Bench Curl Machine',
  'ex-30': 'Cable Tricep Pushdown',
  'ex-31': 'EZ-Bar Skull Crusher',
  'ex-32': 'Bench Dips',
  'ex-99': 'Alternating Dumbbell Bicep Curl',
  'ex-100': 'Incline Dumbbell Bicep Curl',
  'ex-101': 'Concentration Dumbbell Curl',
  'ex-102': 'Spider Curl with EZ-Bar',
  'ex-103': 'Low Cable Straight Bar Curl',
  'ex-104': 'Bayesian Cable Bicep Curl',
  'ex-105': 'Rope Cable Hammer Curl',
  'ex-106': '21s Bicep Curl with Barbell',
  'ex-107': 'Overhead Rope Cable Extension',
  'ex-108': 'Single-Arm Cable Tricep Extension',
  'ex-109': 'Close-Grip Barbell Bench Press',
  'ex-110': 'Overhead Dumbbell Tricep Extension',
  'ex-111': 'Dumbbell Tricep Kickback',
  'ex-112': 'Cable Tricep Kickback',
  'ex-113': 'Smith Machine Tricep Press',
  'ex-114': 'Seated Barbell Wrist Curl (Supinated)',
  'ex-115': 'Reverse Barbell Wrist Curl (Pronated)',
  'ex-116': 'Farmer’s Walk',

  // Core
  'ex-33': 'Kneeling Cable Abdominal Crunch',
  'ex-34': 'Hanging Leg Raise',
  'ex-35': 'Isometric Plank',
  'ex-36': 'Ab Wheel Rollout',
  'ex-117': 'Floor Crunch',
  'ex-118': 'Decline Bench Crunch',
  'ex-119': 'Captain’s Chair Knee Raise',
  'ex-120': 'Side Plank',
  'ex-121': 'Russian Twists',
  'ex-122': 'Cable Woodchopper',
  'ex-123': 'Stomach Vacuum',
  'ex-124': 'Flutter Kicks',
  'ex-125': 'Abdominal Crunch Machine',
  'ex-126': 'Dead Bug',
};

// Helper function to get translated exercise name
export function getExerciseName(exercise: { id: string; name: string }, lang: Language = 'es'): string {
  if (lang === 'en' && EXERCISE_EN_NAMES[exercise.id]) {
    return EXERCISE_EN_NAMES[exercise.id];
  }
  return exercise.name;
}
