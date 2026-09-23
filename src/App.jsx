import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Award,
  Cpu,
  Languages,
  LayoutDashboard,
  Search,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Filter,
  Tag,
  Trash2,
  Zap,
  ArrowRight,
  Key,
  RefreshCw,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Settings,
  X,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Type,
  Moon,
  Sun
} from 'lucide-react';

const REPO_OWNER = 'AshGray-Garlic';
const REPO_NAME = 'my-study-archive';
const FILE_PATH = 'public/data/db.json';

const DEFAULT_PLATFORMS = ['SWEA', 'Programmers', 'LeetCode', 'CodeTree'];

// 대한민국 법정 공휴일 및 주요 대체공휴일 맵 (YYYY-MM-DD)
const HOLIDAYS = {
  // 2025년
  '2025-01-01': '신정',
  '2025-01-28': '설날연휴',
  '2025-01-29': '설날',
  '2025-01-30': '설날연휴',
  '2025-03-01': '삼일절',
  '2025-03-03': '대체공휴일',
  '2025-05-05': '어린이날',
  '2025-05-06': '대체공휴일(부처님오신날)',
  '2025-06-06': '현충일',
  '2025-08-15': '광복절',
  '2025-10-03': '개천절',
  '2025-10-05': '추석연휴',
  '2025-10-06': '추석',
  '2025-10-07': '추석연휴',
  '2025-10-08': '대체공휴일',
  '2025-10-09': '한글날',
  '2025-12-25': '성탄절',

  // 2026년
  '2026-01-01': '신정',
  '2026-02-16': '설날연휴',
  '2026-02-17': '설날',
  '2026-02-18': '설날연휴',
  '2026-03-01': '삼일절',
  '2026-03-02': '대체공휴일',
  '2026-05-05': '어린이날',
  '2026-05-24': '부처님오신날',
  '2026-05-25': '대체공휴일',
  '2026-06-06': '현충일',
  '2026-08-15': '광복절',
  '2026-08-17': '대체공휴일',
  '2026-09-24': '추석연휴',
  '2026-09-25': '추석',
  '2026-09-26': '추석연휴',
  '2026-10-03': '개천절',
  '2026-10-05': '대체공휴일',
  '2026-10-09': '한글날',
  '2026-12-25': '성탄절',

  // 2027년
  '2027-01-01': '신정',
  '2027-02-06': '설날연휴',
  '2027-02-07': '설날',
  '2027-02-08': '설날연휴',
  '2027-02-09': '대체공휴일',
  '2027-03-01': '삼일절',
  '2027-05-05': '어린이날',
  '2027-05-13': '부처님오신날',
  '2027-06-06': '현충일',
  '2027-06-07': '대체공휴일',
  '2027-08-15': '광복절',
  '2027-08-16': '대체공휴일',
  '2027-09-14': '추석연휴',
  '2027-09-15': '추석',
  '2027-09-16': '추석연휴',
  '2027-10-03': '개천절',
  '2027-10-04': '대체공휴일',
  '2027-10-09': '한글날',
  '2027-10-11': '대체공휴일',
  '2027-12-25': '성탄절'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedCertTab, setSelectedCertTab] = useState('ALL');

  // Theme Mode State ('dark' | 'light')
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('app_theme_mode') || 'dark');

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('app_theme_mode', mode);
  };

  // Font Size Setting State ('normal' | 'large' | 'xlarge')
  const [fontSizeLevel, setFontSizeLevel] = useState(() => localStorage.getItem('app_font_size') || 'normal');

  const handleFontSizeChange = (level) => {
    setFontSizeLevel(level);
    localStorage.setItem('app_font_size', level);
  };

  // Dynamic Typography Styles
  const typo = useMemo(() => {
    if (fontSizeLevel === 'xlarge') {
      return {
        body: 'text-sm sm:text-base',
        summary: 'text-sm sm:text-base leading-relaxed',
        codePre: 'text-sm sm:text-base',
        codeExpanded: 'text-base sm:text-lg',
        cardTitle: 'text-lg sm:text-xl font-bold',
        badge: 'text-xs px-2.5 py-0.5'
      };
    }
    if (fontSizeLevel === 'large') {
      return {
        body: 'text-xs sm:text-sm',
        summary: 'text-xs sm:text-sm leading-relaxed',
        codePre: 'text-xs sm:text-sm',
        codeExpanded: 'text-sm sm:text-base',
        cardTitle: 'text-base sm:text-lg font-bold',
        badge: 'text-[11px] px-2 py-0.5'
      };
    }
    return {
      body: 'text-xs',
      summary: 'text-xs leading-relaxed',
      codePre: 'text-xs',
      codeExpanded: 'text-sm',
      cardTitle: 'text-base font-bold',
      badge: 'text-[10px] sm:text-xs px-2 py-0.5'
    };
  }, [fontSizeLevel]);

  // Dynamic Color Palette for Dark / Light mode
  const isDark = themeMode === 'dark';
  const c = useMemo(() => {
    if (isDark) {
      return {
        appBg: 'bg-slate-950 text-slate-100',
        sidebarBg: 'bg-slate-900 border-slate-800',
        navHover: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
        navActive: 'bg-slate-800 text-indigo-400 border border-slate-700/60',
        headerBg: 'bg-slate-950/80 border-slate-800/80',
        cardBg: 'bg-slate-900 border-slate-800',
        cardInnerBg: 'bg-slate-950/60 border-slate-800',
        cardInnerBorder: 'border-slate-800',
        inputBg: 'bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500',
        subText: 'text-slate-400',
        dimText: 'text-slate-500',
        buttonSec: 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300',
        codeContainer: 'bg-slate-950 border-slate-800',
        modalOverlay: 'bg-black/80',
        modalBg: 'bg-slate-900 border-slate-800 text-slate-100'
      };
    }
    return {
      appBg: 'bg-slate-50 text-slate-800',
      sidebarBg: 'bg-white border-slate-200 shadow-sm',
      navHover: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
      navActive: 'bg-indigo-50 text-indigo-600 border border-indigo-200/80',
      headerBg: 'bg-white/80 border-slate-200',
      cardBg: 'bg-white border-slate-200 shadow-sm',
      cardInnerBg: 'bg-slate-50 border-slate-200',
      cardInnerBorder: 'border-slate-200',
      inputBg: 'bg-white border-slate-300 text-slate-800 focus:border-indigo-500',
      subText: 'text-slate-600',
      dimText: 'text-slate-400',
      buttonSec: 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm',
      codeContainer: 'bg-slate-900 border-slate-800 text-slate-100',
      modalOverlay: 'bg-slate-900/60',
      modalBg: 'bg-white border-slate-200 text-slate-800 shadow-2xl'
    };
  }, [isDark]);

  // GitHub Token & Sync States
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [fileSha, setFileSha] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState(githubToken);

  // App Data States
  const [algoList, setAlgoList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [certNotes, setCertNotes] = useState([]);
  const [csList, setCsList] = useState([]);
  const [langList, setLangList] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  // Custom Platform Settings State
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [newPlatformInput, setNewPlatformInput] = useState('');
  const [customPlatformMode, setCustomPlatformMode] = useState(false);

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('시험/코테');

  // Edit Mode States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Code Viewer (Expanded Modal) State
  const [expandedCodeData, setExpandedCodeData] = useState(null);

  // Load Data from GitHub API
  const loadDataFromGithub = async (token = githubToken) => {
    setIsSyncing(true);
    try {
      const headers = { Accept: 'application/vnd.github.v3+json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, { headers });
      if (res.ok) {
        const json = await res.json();
        setFileSha(json.sha);
        const decoded = decodeURIComponent(escape(atob(json.content)));
        const data = JSON.parse(decoded);
        setAlgoList(data.algorithms || []);
        setCertList(data.certifications || []);
        setCertNotes(data.certNotes || []);
        setCsList(data.csTopics || []);
        setLangList(data.languages || []);
        setEventsList(data.events || []);
        if (data.platforms && Array.isArray(data.platforms) && data.platforms.length > 0) {
          setPlatforms(data.platforms);
        }
      } else {
        const local = localStorage.getItem('study_db_cache');
        if (local) {
          const parsed = JSON.parse(local);
          setAlgoList(parsed.algorithms || []);
          setCertList(parsed.certifications || []);
          setCertNotes(parsed.certNotes || []);
          setCsList(parsed.csTopics || []);
          setLangList(parsed.languages || []);
          setEventsList(parsed.events || []);
          if (parsed.platforms) setPlatforms(parsed.platforms);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadDataFromGithub();
  }, []);

  // Save/Commit Data to GitHub
  const commitToGithub = async (newAllData) => {
    if (!githubToken) {
      alert('GitHub 토큰이 등록되지 않아 로컬 브라우저에만 저장됩니다.');
      localStorage.setItem('study_db_cache', JSON.stringify(newAllData));
      return false;
    }

    setIsSyncing(true);
    try {
      const contentEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(newAllData, null, 2))));
      const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'chore: update study archive data & settings',
          content: contentEncoded,
          sha: fileSha || undefined
        })
      });

      if (res.ok) {
        const result = await res.json();
        setFileSha(result.content.sha);
        localStorage.setItem('study_db_cache', JSON.stringify(newAllData));
        return true;
      } else {
        const errJson = await res.json();
        alert(`동기화 실패: ${errJson.message}`);
        return false;
      }
    } catch (err) {
      alert(`오류 발생: ${err.message}`);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Calendar Event Handlers
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent = {
      id: `evt-${Date.now()}`,
      date: selectedDateStr,
      title: newEventTitle.trim(),
      category: newEventCategory
    };

    const updatedEvents = [...eventsList, newEvent];
    setEventsList(updatedEvents);
    setNewEventTitle('');

    const fullData = {
      algorithms: algoList,
      certifications: certList,
      certNotes: certNotes,
      csTopics: csList,
      languages: langList,
      platforms: platforms,
      events: updatedEvents
    };
    await commitToGithub(fullData);
  };

  const handleDeleteEvent = async (id) => {
    const updatedEvents = eventsList.filter((evt) => evt.id !== id);
    setEventsList(updatedEvents);

    const fullData = {
      algorithms: algoList,
      certifications: certList,
      certNotes: certNotes,
      csTopics: csList,
      languages: langList,
      platforms: platforms,
      events: updatedEvents
    };
    await commitToGithub(fullData);
  };

  // Calendar Math Helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  // Platform Management Handlers
  const handleAddPlatform = async (e) => {
    e.preventDefault();
    const trimmed = newPlatformInput.trim();
    if (!trimmed) return;
    if (platforms.includes(trimmed)) {
      alert('이미 존재하는 플랫폼 이름입니다.');
      return;
    }
    const updated = [...platforms, trimmed];
    setPlatforms(updated);
    setNewPlatformInput('');

    const fullData = {
      algorithms: algoList,
      certifications: certList,
      certNotes: certNotes,
      csTopics: csList,
      languages: langList,
      platforms: updated,
      events: eventsList
    };
    await commitToGithub(fullData);
  };

  const handleDeletePlatform = async (platformName) => {
    if (platforms.length <= 1) {
      alert('최소 1개 이상의 플랫폼은 유지되어야 합니다.');
      return;
    }
    if (!window.confirm(`'${platformName}' 플랫폼을 삭제하시겠습니까?`)) return;
    const updated = platforms.filter((p) => p !== platformName);
    setPlatforms(updated);

    const fullData = {
      algorithms: algoList,
      certifications: certList,
      certNotes: certNotes,
      csTopics: csList,
      languages: langList,
      platforms: updated,
      events: eventsList
    };
    await commitToGithub(fullData);
  };

  // Delete Item Handler
  const handleDeleteItem = async (category, id) => {
    if (!window.confirm('해당 항목을 영구 삭제하시겠습니까? (GitHub 저장소에서도 함께 삭제됩니다)')) return;

    let updatedAlgo = algoList;
    let updatedCert = certList;
    let updatedCertNotes = certNotes;
    let updatedCs = csList;
    let updatedLang = langList;

    if (category === 'algo') updatedAlgo = algoList.filter((item) => item.id !== id);
    if (category === 'cert') updatedCert = certList.filter((item) => item.id !== id);
    if (category === 'certNote') updatedCertNotes = certNotes.filter((item) => item.id !== id);
    if (category === 'cs') updatedCs = csList.filter((item) => item.id !== id);
    if (category === 'lang') updatedLang = langList.filter((item) => item.id !== id);

    const fullData = {
      algorithms: updatedAlgo,
      certifications: updatedCert,
      certNotes: updatedCertNotes,
      csTopics: updatedCs,
      languages: updatedLang,
      platforms: platforms,
      events: eventsList
    };

    setAlgoList(updatedAlgo);
    setCertList(updatedCert);
    setCertNotes(updatedCertNotes);
    setCsList(updatedCs);
    setLangList(updatedLang);

    await commitToGithub(fullData);
  };

  // Modals & States
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteCategory, setNewNoteCategory] = useState('algo');
  const [newNoteData, setNewNoteData] = useState({
    title: '',
    platform: 'SWEA',
    difficulty: '',
    tags: '',
    code: '',
    summary: '',
    keyPoint: '',
    subCategory: '',
    certQuestion: '',
    certAnswer: ''
  });

  const [copiedId, setCopiedId] = useState(null);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Open Edit Modal
  const handleOpenEdit = (category, item) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setNewNoteCategory(category);

    if (category === 'algo') {
      setNewNoteData({
        title: item.title || '',
        platform: item.platform || platforms[0] || 'SWEA',
        difficulty: item.difficulty || '',
        tags: item.tags ? item.tags.join(', ') : '',
        code: item.code || '',
        summary: item.summary || '',
        keyPoint: item.keyPoint || '',
        subCategory: '',
        certQuestion: '',
        certAnswer: ''
      });
      setCustomPlatformMode(!platforms.includes(item.platform));
    } else if (category === 'cert') {
      setNewNoteData({
        title: item.title || '',
        platform: 'SWEA',
        difficulty: '',
        tags: item.tags ? item.tags.join(', ') : '',
        code: '',
        summary: item.summary || '',
        keyPoint: item.keyPoint || '',
        subCategory: item.certName || '',
        certQuestion: item.question || '',
        certAnswer: item.answer || ''
      });
    } else if (category === 'cs') {
      setNewNoteData({
        title: item.title || '',
        platform: 'SWEA',
        difficulty: '',
        tags: '',
        code: '',
        summary: item.concept || '',
        keyPoint: item.interviewQA?.[0]?.a || '',
        subCategory: item.domain || '',
        certQuestion: item.interviewQA?.[0]?.q || '',
        certAnswer: ''
      });
    } else if (category === 'lang') {
      setNewNoteData({
        title: item.title || '',
        platform: 'SWEA',
        difficulty: '',
        tags: '',
        code: '',
        summary: item.situation || '',
        keyPoint: item.dialogue?.[0]?.en || '',
        subCategory: item.category || '',
        certQuestion: '',
        certAnswer: item.dialogue?.[0]?.ko || ''
      });
    }

    setIsModalOpen(true);
  };

  const certTabOptions = useMemo(() => {
    const set = new Set(['ALL']);
    certList.forEach((c) => set.add(c.title));
    certNotes.forEach((n) => set.add(n.certName));
    return Array.from(set);
  }, [certList, certNotes]);

  const allAlgoTags = useMemo(() => {
    const set = new Set(['ALL']);
    algoList.forEach((item) => item.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [algoList]);

  const allFlashcards = useMemo(() => {
    const list = [];
    certNotes.forEach((n) => {
      if (n.question && n.answer) {
        list.push({ q: n.question, a: n.answer, certName: n.certName });
      }
    });
    return list;
  }, [certNotes]);

  // Create or Update Note Handler
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!newNoteData.title.trim()) return;

    const tagArray = newNoteData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    let updatedAlgo = [...algoList];
    let updatedCertNotes = [...certNotes];
    let updatedCs = [...csList];
    let updatedLang = [...langList];
    let updatedPlatforms = [...platforms];

    if (newNoteCategory === 'algo') {
      const chosenPlatform = newNoteData.platform.trim() || 'Custom';
      if (!platforms.includes(chosenPlatform)) {
        updatedPlatforms = [...platforms, chosenPlatform];
        setPlatforms(updatedPlatforms);
      }

      if (isEditMode && editingId) {
        updatedAlgo = updatedAlgo.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: newNoteData.title,
                platform: chosenPlatform,
                difficulty: newNoteData.difficulty,
                tags: tagArray.length > 0 ? tagArray : ['구현'],
                summary: newNoteData.summary,
                keyPoint: newNoteData.keyPoint,
                code: newNoteData.code
              }
            : item
        );
      } else {
        const newAlgo = {
          id: `algo-${Date.now()}`,
          title: newNoteData.title,
          platform: chosenPlatform,
          problemNumber: 'NEW',
          difficulty: newNoteData.difficulty,
          tags: tagArray.length > 0 ? tagArray : ['구현'],
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(N)',
          status: 'Solved',
          summary: newNoteData.summary || '문제 요약 내용',
          keyPoint: newNoteData.keyPoint || '핵심 알고리즘 접근법',
          codeLanguage: 'java',
          code: newNoteData.code || '// 풀이 코드를 입력하세요\npublic class Main {\n}',
          retrospective: '학습 기록'
        };
        updatedAlgo = [newAlgo, ...updatedAlgo];
      }
      setAlgoList(updatedAlgo);
      setActiveTab('algo');
    } else if (newNoteCategory === 'cert') {
      if (isEditMode && editingId) {
        updatedCertNotes = updatedCertNotes.map((item) =>
          item.id === editingId
            ? {
                ...item,
                certName: newNoteData.subCategory || '자격증',
                title: newNoteData.title,
                tags: tagArray.length > 0 ? tagArray : ['핵심암기'],
                summary: newNoteData.summary,
                keyPoint: newNoteData.keyPoint,
                question: newNoteData.certQuestion,
                answer: newNoteData.certAnswer
              }
            : item
        );
      } else {
        const newCertNote = {
          id: `cert-note-${Date.now()}`,
          certName: newNoteData.subCategory || '자격증',
          title: newNoteData.title,
          tags: tagArray.length > 0 ? tagArray : ['핵심암기'],
          summary: newNoteData.summary || '공부한 핵심 이론 및 요약 내용',
          keyPoint: newNoteData.keyPoint || '',
          question: newNoteData.certQuestion || '',
          answer: newNoteData.certAnswer || ''
        };
        updatedCertNotes = [newCertNote, ...updatedCertNotes];
      }
      setCertNotes(updatedCertNotes);
      setActiveTab('cert');
    } else if (newNoteCategory === 'cs') {
      if (isEditMode && editingId) {
        updatedCs = updatedCs.map((item) =>
          item.id === editingId
            ? {
                ...item,
                domain: newNoteData.subCategory || 'CS',
                title: newNoteData.title,
                concept: newNoteData.summary,
                interviewQA: [
                  {
                    q: newNoteData.certQuestion || `${newNoteData.title}의 핵심 원리는 무엇인가요?`,
                    a: newNoteData.keyPoint || '상세 내용'
                  }
                ]
              }
            : item
        );
      } else {
        const newCs = {
          id: `cs-${Date.now()}`,
          domain: newNoteData.subCategory || '운영체제(OS)',
          title: newNoteData.title,
          importance: 'High (★ 4.0)',
          concept: newNoteData.summary || '개념 정의 및 상세 메커니즘',
          interviewQA: [
            {
              q: `${newNoteData.title}의 핵심 원리는 무엇인가요?`,
              a: newNoteData.keyPoint || '상세 답변 내용'
            }
          ]
        };
        updatedCs = [newCs, ...updatedCs];
      }
      setCsList(updatedCs);
      setActiveTab('cs');
    } else if (newNoteCategory === 'lang') {
      if (isEditMode && editingId) {
        updatedLang = updatedLang.map((item) =>
          item.id === editingId
            ? {
                ...item,
                category: newNoteData.subCategory || 'Personal Log',
                title: newNoteData.title,
                situation: newNoteData.summary,
                dialogue: [
                  {
                    speaker: 'User',
                    en: newNoteData.keyPoint || 'I would like to express this clearly.',
                    ko: newNoteData.certAnswer || '이 표현을 명확히 전달하고 싶습니다.'
                  }
                ]
              }
            : item
        );
      } else {
        const newLang = {
          id: `lang-${Date.now()}`,
          category: 'Personal Log',
          title: newNoteData.title,
          situation: newNoteData.summary || '상황 및 뉘앙스',
          dialogue: [
            {
              speaker: 'User',
              en: newNoteData.keyPoint || 'I would like to express this clearly.',
              ko: '이 표현을 명확히 전달하고 싶습니다.'
            }
          ]
        };
        updatedLang = [newLang, ...updatedLang];
      }
      setLangList(updatedLang);
      setActiveTab('language');
    }

    const fullData = {
      algorithms: updatedAlgo,
      certifications: certList,
      certNotes: updatedCertNotes,
      csTopics: updatedCs,
      languages: updatedLang,
      platforms: updatedPlatforms,
      events: eventsList
    };

    await commitToGithub(fullData);

    setNewNoteData({
      title: '',
      platform: updatedPlatforms[0] || 'SWEA',
      difficulty: '',
      tags: '',
      code: '',
      summary: '',
      keyPoint: '',
      subCategory: '',
      certQuestion: '',
      certAnswer: ''
    });
    setIsEditMode(false);
    setEditingId(null);
    setCustomPlatformMode(false);
    setIsModalOpen(false);
  };

  const handleSaveToken = () => {
    localStorage.setItem('gh_token', tokenInput.trim());
    setGithubToken(tokenInput.trim());
    setIsTokenModalOpen(false);
    loadDataFromGithub(tokenInput.trim());
  };

  const filteredCertNotes = useMemo(() => {
    return certNotes.filter((note) => {
      const matchesTab = selectedCertTab === 'ALL' || note.certName === selectedCertTab;
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.certName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.summary && note.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.tags && note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesTab && matchesSearch;
    });
  }, [certNotes, selectedCertTab, searchQuery]);

  const filteredAlgorithms = useMemo(() => {
    return algoList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesTag = selectedTag === 'ALL' || (item.tags && item.tags.includes(selectedTag));
      return matchesSearch && matchesTag;
    });
  }, [algoList, searchQuery, selectedTag]);

  // Calendar selected date events & holiday info
  const selectedDateEvents = useMemo(() => {
    return eventsList.filter((evt) => evt.date === selectedDateStr);
  }, [eventsList, selectedDateStr]);

  const selectedDateHoliday = HOLIDAYS[selectedDateStr] || null;

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-200 ${c.appBg} ${typo.body}`}>
      {/* Sidebar */}
      <aside className={`w-full md:w-64 border-r p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 ${c.sidebarBg}`}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight flex items-center gap-1.5">
                AGG Study <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Hub</span>
              </h1>
              <p className={`text-xs ${c.dimText}`}>지식 아카이브 & 학습 관리</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsEditMode(false);
              setEditingId(null);
              setNewNoteCategory('algo');
              if (platforms.length > 0) {
                setNewNoteData({
                  title: '',
                  platform: platforms[0],
                  difficulty: '',
                  tags: '',
                  code: '',
                  summary: '',
                  keyPoint: '',
                  subCategory: '',
                  certQuestion: '',
                  certAnswer: ''
                });
              }
              setIsModalOpen(true);
            }}
            className="w-full mb-6 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>새 학습 기록 작성</span>
          </button>

          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? c.navActive : c.navHover
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>대시보드 홈</span>
            </button>

            <button
              onClick={() => { setActiveTab('algo'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'algo' ? c.navActive : c.navHover
              }`}
            >
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <span>알고리즘 (Algo)</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                {algoList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('cert'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cert' ? c.navActive : c.navHover
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-500" />
                <span>자격증 (Cert)</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                {certNotes.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('cs'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cs' ? c.navActive : c.navHover
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>컴퓨터 구조 & CS</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                {csList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('language'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'language' ? c.navActive : c.navHover
              }`}
            >
              <div className="flex items-center gap-3">
                <Languages className="w-4 h-4 text-rose-500" />
                <span>어학 (Language)</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                {langList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings' ? c.navActive : c.navHover
              }`}
            >
              <Settings className="w-4 h-4 text-purple-500" />
              <span>환경 설정</span>
            </button>
          </nav>
        </div>

        <div className={`mt-6 pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <button
            onClick={() => setIsTokenModalOpen(true)}
            className={`w-full py-2 px-3 rounded-xl text-xs flex items-center justify-between transition border ${
              isDark
                ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/50'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub 동기화 설정</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${githubToken ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative">
        {/* EXPANDED CODE VIEWER OVERLAY */}
        {expandedCodeData && (
          <div className={`absolute inset-0 z-40 flex flex-col animate-fadeIn ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'}`}>
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {expandedCodeData.platform} #{expandedCodeData.problemNumber}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white truncate">{expandedCodeData.title}</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {expandedCodeData.difficulty}
                    </span>
                  </div>
                  <span className="text-xs font-mono uppercase text-emerald-400 mt-0.5 block">
                    Language: {expandedCodeData.codeLanguage || 'java'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy('expanded', expandedCodeData.code)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition"
                >
                  {copiedId === 'expanded' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'expanded' ? '복사됨!' : '전체 코드 복사'}</span>
                </button>
                <button
                  onClick={() => setExpandedCodeData(null)}
                  className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-xl transition"
                  title="전체화면 닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`flex-1 overflow-auto p-6 md:p-8 font-mono text-slate-200 leading-relaxed scrollbar-thin ${typo.codeExpanded}`}>
              <pre className="selection:bg-indigo-500/30">
                <code>{expandedCodeData.code}</code>
              </pre>
            </div>
          </div>
        )}

        <header className={`sticky top-0 z-10 backdrop-blur-md border-b px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-200 ${c.headerBg}`}>
          <div className="relative w-full sm:w-96">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${c.dimText}`} />
            <input
              type="text"
              placeholder="개념, 기출 요약, 알고리즘 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-10 pr-4 py-2 placeholder-slate-400 focus:outline-none transition-colors text-sm ${c.inputBg}`}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => loadDataFromGithub()}
              disabled={isSyncing}
              title="GitHub 최신 데이터 동기화"
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition border disabled:opacity-50 ${c.buttonSec}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">동기화</span>
            </button>
            {allFlashcards.length > 0 && (
              <button
                onClick={() => {
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                  setFlashcardOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-medium rounded-xl flex items-center gap-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>플래시카드 모드</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {!searchQuery.trim() ? (
                <>
                  <div className={`p-6 md:p-8 rounded-2xl border ${
                    isDark
                      ? 'bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border-indigo-800/40'
                      : 'bg-gradient-to-r from-indigo-50 via-white to-white border-indigo-200/60 shadow-sm'
                  }`}>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Personal Learning Archive
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-2">
                      Welcome, Ash Gray! 🚀
                    </h2>
                    <p className={`text-sm leading-relaxed ${c.subText}`}>
                      상단 검색창에서 알고리즘 문제, 자격증 핵심 요약, CS 이론, 어학 표현을 통합 검색할 수 있습니다.
                    </p>
                  </div>

                  {/* 4 Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div
                      onClick={() => { setActiveTab('algo'); setSearchQuery(''); }}
                      className={`border p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group select-none ${c.cardBg}`}
                    >
                      <div className={`flex items-center justify-between mb-2 ${c.subText}`}>
                        <span className="text-xs font-medium group-hover:text-emerald-500 transition-colors">해결한 알고리즘</span>
                        <Code2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-2xl font-bold font-mono">
                        {algoList.length} <span className={`text-xs font-sans font-normal ${c.dimText}`}>문제</span>
                      </div>
                    </div>

                    <div
                      onClick={() => { setActiveTab('cert'); setSearchQuery(''); }}
                      className={`border p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group select-none ${c.cardBg}`}
                    >
                      <div className={`flex items-center justify-between mb-2 ${c.subText}`}>
                        <span className="text-xs font-medium group-hover:text-amber-500 transition-colors">자격증 노트</span>
                        <Award className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-2xl font-bold font-mono">
                        {certNotes.length} <span className={`text-xs font-sans font-normal ${c.dimText}`}>개</span>
                      </div>
                    </div>

                    <div
                      onClick={() => { setActiveTab('cs'); setSearchQuery(''); }}
                      className={`border p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group select-none ${c.cardBg}`}
                    >
                      <div className={`flex items-center justify-between mb-2 ${c.subText}`}>
                        <span className="text-xs font-medium group-hover:text-blue-500 transition-colors">컴퓨터 구조 & CS</span>
                        <Cpu className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-2xl font-bold font-mono">
                        {csList.length} <span className={`text-xs font-sans font-normal ${c.dimText}`}>주제</span>
                      </div>
                    </div>

                    <div
                      onClick={() => { setActiveTab('language'); setSearchQuery(''); }}
                      className={`border p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group select-none ${c.cardBg}`}
                    >
                      <div className={`flex items-center justify-between mb-2 ${c.subText}`}>
                        <span className="text-xs font-medium group-hover:text-rose-500 transition-colors">어학 템플릿</span>
                        <Languages className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-2xl font-bold font-mono">
                        {langList.length} <span className={`text-xs font-sans font-normal ${c.dimText}`}>세트</span>
                      </div>
                    </div>
                  </div>

                  {/* STUDY CALENDAR SECTION */}
                  <div className={`border rounded-3xl p-6 md:p-7 space-y-6 shadow-xl ${c.cardBg}`}>
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">학습 & 시험 캘린더</h3>
                          <p className={`text-xs ${c.dimText}`}>코딩테스트, 자격증 시험일, 스터디 및 공휴일 일정을 관리합니다.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={prevMonth}
                          className={`p-1.5 rounded-lg transition border ${c.buttonSec}`}
                          title="이전 달"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm font-mono px-2">
                          {year}년 {month + 1}월
                        </span>
                        <button
                          onClick={nextMonth}
                          className={`p-1.5 rounded-lg transition border ${c.buttonSec}`}
                          title="다음 달"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Month Calendar Grid */}
                      <div className="lg:col-span-7 space-y-2">
                        <div className={`grid grid-cols-7 gap-1 text-center text-xs font-semibold pb-2 ${c.dimText}`}>
                          <span className="text-rose-400">일</span>
                          <span>월</span>
                          <span>화</span>
                          <span>수</span>
                          <span>목</span>
                          <span>금</span>
                          <span className="text-blue-400">토</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDayIndex }).map((_, i) => (
                            <div key={`empty-${i}`} className={`h-14 sm:h-16 rounded-xl ${isDark ? 'bg-slate-950/20' : 'bg-slate-100/50'}`} />
                          ))}

                          {Array.from({ length: lastDate }).map((_, i) => {
                            const dateNum = i + 1;
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                            const isSelected = selectedDateStr === dateStr;
                            const today = new Date();
                            const isToday =
                              today.getFullYear() === year &&
                              today.getMonth() === month &&
                              today.getDate() === dateNum;

                            const dayOfWeek = new Date(year, month, dateNum).getDay();
                            const holidayName = HOLIDAYS[dateStr] || null;
                            const isHolidayOrSunday = dayOfWeek === 0 || Boolean(holidayName);
                            const isSaturday = dayOfWeek === 6 && !holidayName;

                            const dayEvents = eventsList.filter((e) => e.date === dateStr);

                            return (
                              <button
                                key={dateStr}
                                onClick={() => setSelectedDateStr(dateStr)}
                                className={`h-14 sm:h-16 p-1.5 rounded-xl border flex flex-col justify-between items-start transition-all relative group ${
                                  isSelected
                                    ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/20'
                                    : isToday
                                    ? (isDark ? 'bg-slate-800/80 border-indigo-400/50' : 'bg-indigo-50 border-indigo-300')
                                    : (isDark ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300')
                                }`}
                              >
                                <div className="w-full flex items-center justify-between">
                                  <span
                                    className={`text-xs font-mono font-bold ${
                                      isHolidayOrSunday
                                        ? 'text-rose-400'
                                        : isSaturday
                                        ? 'text-blue-400'
                                        : isToday
                                        ? 'text-indigo-500 underline underline-offset-2'
                                        : (isDark ? 'text-slate-200' : 'text-slate-800')
                                    }`}
                                  >
                                    {dateNum}
                                  </span>

                                  {holidayName && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-sans truncate max-w-[42px] sm:max-w-[50px]">
                                      {holidayName}
                                    </span>
                                  )}
                                </div>

                                {dayEvents.length > 0 && (
                                  <div className="w-full flex items-center justify-between">
                                    <div className="flex gap-1">
                                      {dayEvents.slice(0, 2).map((_, idx) => (
                                        <span key={idx} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                      ))}
                                    </div>
                                    <span className={`text-[10px] font-mono font-semibold px-1 rounded ${isDark ? 'text-indigo-300 bg-indigo-950/70' : 'text-indigo-600 bg-indigo-100'}`}>
                                      {dayEvents.length}
                                    </span>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Selected Date's Events & Quick Form */}
                      <div className={`lg:col-span-5 flex flex-col justify-between border rounded-2xl p-5 space-y-4 ${c.cardInnerBg}`}>
                        <div>
                          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-indigo-400 font-bold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {selectedDateStr}
                              </span>
                              {selectedDateHoliday && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                                  {selectedDateHoliday}
                                </span>
                              )}
                            </div>
                            <span className={`text-[11px] ${c.dimText}`}>일정 ({selectedDateEvents.length}건)</span>
                          </div>

                          <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                            {selectedDateEvents.length === 0 ? (
                              <p className={`text-xs py-8 text-center ${c.dimText}`}>
                                등록된 일정이 없습니다. 아래에서 새 일정을 추가하세요.
                              </p>
                            ) : (
                              selectedDateEvents.map((evt) => (
                                <div
                                  key={evt.id}
                                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${c.cardBg}`}
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                                      evt.category === '시험/코테'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        : evt.category === '스터디'
                                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                                        : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                    }`}>
                                      {evt.category}
                                    </span>
                                    <span className="font-medium truncate">{evt.title}</span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteEvent(evt.id)}
                                    title="일정 삭제"
                                    className={`p-1 hover:text-rose-400 transition ml-2 shrink-0 ${c.dimText}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Add Event Form */}
                        <form onSubmit={handleAddEvent} className={`pt-3 border-t space-y-2.5 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                          <div className="flex gap-2">
                            <select
                              value={newEventCategory}
                              onChange={(e) => setNewEventCategory(e.target.value)}
                              className={`rounded-xl px-2.5 py-2 text-xs focus:outline-none shrink-0 border ${c.inputBg}`}
                            >
                              <option value="시험/코테">시험/코테</option>
                              <option value="자격증">자격증</option>
                              <option value="스터디">스터디</option>
                              <option value="과제/제출">과제/제출</option>
                            </select>
                            <input
                              type="text"
                              required
                              placeholder="일정 내용 입력 (예: SWEA 역량테스트, 정처기 실기)"
                              value={newEventTitle}
                              onChange={(e) => setNewEventTitle(e.target.value)}
                              className={`flex-1 rounded-xl px-3 py-2 text-xs placeholder-slate-400 focus:outline-none border ${c.inputBg}`}
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isSyncing}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>일정 등록 및 GitHub 동기화</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* 통합 검색 결과 뷰 */
                <div className="space-y-6">
                  <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Search className="w-5 h-5 text-indigo-400" />
                      통합 검색 결과: <span className="text-indigo-500 font-mono">"{searchQuery}"</span>
                    </h3>
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`text-xs px-2.5 py-1 rounded-lg border ${c.buttonSec}`}
                    >
                      검색어 초기화
                    </button>
                  </div>

                  {/* 알고리즘 검색 결과 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5">
                        <Code2 className="w-4 h-4" />
                        알고리즘 ({filteredAlgorithms.length})
                      </h4>
                      {filteredAlgorithms.length > 0 && (
                        <button
                          onClick={() => setActiveTab('algo')}
                          className={`text-xs hover:text-emerald-500 flex items-center gap-1 ${c.subText}`}
                        >
                          알고리즘 탭으로 이동 <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {filteredAlgorithms.length === 0 ? (
                      <p className={`text-xs py-3 px-4 rounded-xl border ${c.cardInnerBg} ${c.dimText}`}>
                        일치하는 알고리즘 문제가 없습니다.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredAlgorithms.slice(0, 4).map((algo) => (
                          <div
                            key={algo.id}
                            onClick={() => setActiveTab('algo')}
                            className={`p-4 border hover:border-emerald-500/50 rounded-xl cursor-pointer transition space-y-2 ${c.cardBg}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                {algo.platform} #{algo.problemNumber}
                              </span>
                              <span className={`text-[11px] ${c.dimText}`}>{algo.difficulty}</span>
                            </div>
                            <h5 className="text-sm font-bold truncate">{algo.title}</h5>
                            <p className={`line-clamp-2 ${typo.summary} whitespace-pre-wrap ${c.subText}`}>
                              {algo.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 자격증 검색 결과 */}
                  <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-amber-500 flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        자격증 노트 ({filteredCertNotes.length})
                      </h4>
                      {filteredCertNotes.length > 0 && (
                        <button
                          onClick={() => setActiveTab('cert')}
                          className={`text-xs hover:text-amber-500 flex items-center gap-1 ${c.subText}`}
                        >
                          자격증 탭으로 이동 <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {filteredCertNotes.length === 0 ? (
                      <p className={`text-xs py-3 px-4 rounded-xl border ${c.cardInnerBg} ${c.dimText}`}>
                        일치하는 자격증 노트가 없습니다.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredCertNotes.slice(0, 4).map((note) => (
                          <div
                            key={note.id}
                            onClick={() => setActiveTab('cert')}
                            className={`p-4 border hover:border-amber-500/50 rounded-xl cursor-pointer transition space-y-2 ${c.cardBg}`}
                          >
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              {note.certName}
                            </span>
                            <h5 className="text-sm font-bold truncate">{note.title}</h5>
                            <p className={`line-clamp-2 ${typo.summary} whitespace-pre-wrap ${c.subText}`}>
                              {note.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CS 토픽 검색 결과 */}
                  <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-blue-500 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4" />
                        컴퓨터 구조 & CS ({csList.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.concept.toLowerCase().includes(searchQuery.toLowerCase())).length})
                      </h4>
                      <button
                        onClick={() => setActiveTab('cs')}
                        className={`text-xs hover:text-blue-500 flex items-center gap-1 ${c.subText}`}
                      >
                        CS 탭으로 이동 <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {csList
                        .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.concept.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 4)
                        .map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setActiveTab('cs')}
                            className={`p-4 border hover:border-blue-500/50 rounded-xl cursor-pointer transition space-y-2 ${c.cardBg}`}
                          >
                            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                              {item.domain}
                            </span>
                            <h5 className="text-sm font-bold truncate">{item.title}</h5>
                            <p className={`line-clamp-2 ${typo.summary} whitespace-pre-wrap ${c.subText}`}>
                              {item.concept}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALGORITHM */}
          {activeTab === 'algo' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2.5">
                  <Code2 className="w-6 h-6 text-emerald-500" />
                  알고리즘 아카이브
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-2 border text-xs font-medium rounded-xl flex items-center gap-1.5 transition ${c.buttonSec}`}
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-400" />
                    <span>환경 설정</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingId(null);
                      setNewNoteCategory('algo');
                      if (platforms.length > 0) {
                        setNewNoteData({
                          title: '',
                          platform: platforms[0],
                          difficulty: '',
                          tags: '',
                          code: '',
                          summary: '',
                          keyPoint: '',
                          subCategory: '',
                          certQuestion: '',
                          certAnswer: ''
                        });
                      }
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 문제 풀이 등록</span>
                  </button>
                </div>
              </div>

              {/* Tag Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <Filter className={`w-3.5 h-3.5 shrink-0 ${c.dimText}`} />
                {allAlgoTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                      selectedTag === tag
                        ? 'bg-emerald-500 text-white font-bold'
                        : `${c.buttonSec} border`
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Problem List */}
              <div className="space-y-6">
                {filteredAlgorithms.length === 0 ? (
                  <div className={`text-center py-16 rounded-2xl border ${c.cardInnerBg} ${c.cardInnerBorder}`}>
                    <p className={`text-sm ${c.dimText}`}>해당 조건의 알고리즘 풀이가 없습니다.</p>
                  </div>
                ) : (
                  filteredAlgorithms.map((algo) => (
                    <div key={algo.id} className={`border rounded-2xl overflow-hidden shadow-sm ${c.cardBg}`}>
                      <div className={`p-5 border-b flex items-center justify-between gap-3 ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50/70'}`}>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`font-mono font-bold rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 ${typo.badge}`}>
                            {algo.platform} #{algo.problemNumber}
                          </span>
                          <h3 className={typo.cardTitle}>{algo.title}</h3>
                          <span className={`rounded border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'} ${typo.badge}`}>
                            {algo.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit('algo', algo)}
                            title="수정하기"
                            className={`p-2 rounded-lg hover:text-indigo-500 transition border ${c.buttonSec}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('algo', algo.id)}
                            title="삭제하기"
                            className={`p-2 rounded-lg hover:text-rose-500 transition border ${c.buttonSec}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className={`p-4 rounded-xl border whitespace-pre-wrap ${c.cardInnerBg} ${c.cardInnerBorder} ${typo.summary}`}>
                          {algo.summary}
                        </div>

                        {/* Code Container */}
                        {algo.code && (
                          <div className={`relative rounded-xl overflow-hidden border group ${c.codeContainer}`}>
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
                              <span className="font-mono uppercase text-emerald-400 font-semibold">{algo.codeLanguage || 'code'}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedCodeData(algo)}
                                  className="flex items-center gap-1 text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition"
                                  title="전체화면으로 보기"
                                >
                                  <Maximize2 className="w-3 h-3 text-emerald-400" />
                                  <span>크게 보기</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(algo.id, algo.code)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition"
                                >
                                  {copiedId === algo.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedId === algo.id ? '복사됨!' : '코드 복사'}</span>
                                </button>
                              </div>
                            </div>

                            <div
                              onClick={() => setExpandedCodeData(algo)}
                              className="cursor-pointer relative"
                              title="클릭하면 좌측 바 제외 전체화면으로 코드가 확대됩니다."
                            >
                              <pre className={`p-4 font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin ${typo.codePre}`}>
                                <code>{algo.code}</code>
                              </pre>
                              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors flex items-center justify-center pointer-events-none">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 border border-slate-700 text-slate-200 text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>클릭하여 전체화면으로 보기</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATION */}
          {activeTab === 'cert' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2.5">
                    <Award className="w-6 h-6 text-amber-500" />
                    자격증 아카이브
                  </h2>
                  <p className={`text-xs mt-1 ${c.dimText}`}>자격증 종목별로 학습 요약 노트 및 기출 포인트를 모아봅니다.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-2 border text-xs font-medium rounded-xl flex items-center gap-1.5 transition ${c.buttonSec}`}
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-400" />
                    <span>환경 설정</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingId(null);
                      setNewNoteCategory('cert');
                      setNewNoteData({
                        title: '',
                        platform: 'SWEA',
                        difficulty: '',
                        tags: '',
                        code: '',
                        summary: '',
                        keyPoint: '',
                        subCategory: selectedCertTab === 'ALL' ? '정보처리기사' : selectedCertTab,
                        certQuestion: '',
                        certAnswer: ''
                      });
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 자격증 노트 추가</span>
                  </button>
                </div>
              </div>

              {/* 자격증별 필터 탭 바 */}
              <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <Filter className={`w-3.5 h-3.5 shrink-0 mr-1 ${c.dimText}`} />
                {certTabOptions.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedCertTab(tab)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition ${
                      selectedCertTab === tab
                        ? 'bg-amber-500 text-white font-bold shadow'
                        : `${c.buttonSec} border`
                    }`}
                  >
                    {tab === 'ALL' ? '전체 자격증 보기' : tab}
                  </button>
                ))}
              </div>

              {/* 공부 내용 카드 리스트 */}
              <div className="space-y-4">
                {filteredCertNotes.length === 0 ? (
                  <div className={`text-center py-16 rounded-2xl border ${c.cardInnerBg} ${c.cardInnerBorder}`}>
                    <BookOpen className={`w-8 h-8 mx-auto mb-2 ${c.dimText}`} />
                    <p className={`text-sm ${c.dimText}`}>해당 자격증에 등록된 공부 노트가 없습니다.</p>
                  </div>
                ) : (
                  filteredCertNotes.map((note) => (
                    <div key={note.id} className={`border rounded-2xl p-5 space-y-3.5 shadow-sm ${c.cardBg}`}>
                      <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`font-bold rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 ${typo.badge}`}>
                            {note.certName}
                          </span>
                          <h3 className={typo.cardTitle}>{note.title}</h3>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit('cert', note)}
                            title="수정하기"
                            className={`p-2 rounded-lg hover:text-indigo-500 transition border ${c.buttonSec}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem('certNote', note.id)}
                            title="삭제하기"
                            className={`p-2 rounded-lg hover:text-rose-500 transition border ${c.buttonSec}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border whitespace-pre-wrap ${c.cardInnerBg} ${c.cardInnerBorder} ${typo.summary}`}>
                        {note.summary}
                      </div>

                      {note.keyPoint && (
                        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-amber-950/20 border-amber-900/30' : 'bg-amber-50/80 border-amber-200/80'}`}>
                          <span className="font-semibold text-amber-500 block mb-1">🔑 핵심 시험 포인트 & 오답 유의사항</span>
                          <p className={`whitespace-pre-wrap ${typo.summary}`}>{note.keyPoint}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CS TOPICS */}
          {activeTab === 'cs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2.5">
                    <Cpu className="w-6 h-6 text-blue-500" />
                    컴퓨터 사이언스 & 기술 면접
                  </h2>
                  <p className={`text-xs mt-1 ${c.dimText}`}>운영체제, 네트워크, 데이터베이스 등 핵심 CS 이론과 면접 Q&A를 아카이빙합니다.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-2 border text-xs font-medium rounded-xl flex items-center gap-1.5 transition ${c.buttonSec}`}
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-400" />
                    <span>환경 설정</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingId(null);
                      setNewNoteCategory('cs');
                      setNewNoteData({
                        title: '',
                        platform: 'SWEA',
                        difficulty: '',
                        tags: '',
                        code: '',
                        summary: '',
                        keyPoint: '',
                        subCategory: '운영체제(OS)',
                        certQuestion: '',
                        certAnswer: ''
                      });
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 CS 토픽 추가</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {csList.map((cs) => (
                  <div key={cs.id} className={`border rounded-2xl p-6 space-y-4 shadow-sm ${c.cardBg}`}>
                    <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div>
                        <span className={`rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium ${typo.badge}`}>
                          {cs.domain}
                        </span>
                        <h3 className={`mt-1.5 ${typo.cardTitle}`}>{cs.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('cs', cs)}
                          title="수정하기"
                          className={`p-2 rounded-lg hover:text-indigo-500 transition border ${c.buttonSec}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('cs', cs.id)}
                          title="삭제하기"
                          className={`p-2 rounded-lg hover:text-rose-500 transition border ${c.buttonSec}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border whitespace-pre-wrap ${c.cardInnerBg} ${c.cardInnerBorder} ${typo.summary}`}>
                      {cs.concept}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2.5">
                    <Languages className="w-6 h-6 text-rose-500" />
                    어학 및 테크 영어
                  </h2>
                  <p className={`text-xs mt-1 ${c.dimText}`}>실무 개발 영어 회화, 테크 인터뷰 및 기술 표현을 정리하고 음성으로 청취합니다.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-2 border text-xs font-medium rounded-xl flex items-center gap-1.5 transition ${c.buttonSec}`}
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-400" />
                    <span>환경 설정</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingId(null);
                      setNewNoteCategory('lang');
                      setNewNoteData({
                        title: '',
                        platform: 'SWEA',
                        difficulty: '',
                        tags: '',
                        code: '',
                        summary: '',
                        keyPoint: '',
                        subCategory: 'Personal Log',
                        certQuestion: '',
                        certAnswer: ''
                      });
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 영어 표현 추가</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {langList.map((item) => (
                  <div key={item.id} className={`border rounded-2xl p-6 space-y-4 shadow-sm ${c.cardBg}`}>
                    <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div>
                        <span className={`rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 ${typo.badge}`}>
                          {item.category}
                        </span>
                        <h3 className={`mt-1.5 ${typo.cardTitle}`}>{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('lang', item)}
                          title="수정하기"
                          className={`p-2 rounded-lg hover:text-indigo-500 transition border ${c.buttonSec}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('lang', item.id)}
                          title="삭제하기"
                          className={`p-2 rounded-lg hover:text-rose-500 transition border ${c.buttonSec}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {item.dialogue?.map((line, dIdx) => (
                        <div key={dIdx} className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${c.cardInnerBg} ${c.cardInnerBorder}`}>
                          <div>
                            <p className={`font-medium ${typo.body}`}>{line.en}</p>
                            <p className={`mt-1 ${c.dimText} ${typo.body}`}>{line.ko}</p>
                          </div>
                          <button onClick={() => speakText(line.en)} className={`p-2 hover:text-rose-500 rounded-lg transition shrink-0 border ${c.buttonSec}`}>
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2.5">
                  <Settings className="w-6 h-6 text-purple-500" />
                  환경 설정
                </h2>
                <p className={`text-xs mt-1 ${c.dimText}`}>
                  다크/라이트 테마, 글자 크기, 알고리즘 플랫폼 세팅을 사용자 환경에 맞게 커스텀합니다.
                </p>
              </div>

              {/* THEME MODE PREFERENCE (DARK / LIGHT) */}
              <div className={`border rounded-2xl p-6 space-y-4 shadow-sm ${c.cardBg}`}>
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    {isDark ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <h3 className="text-sm font-bold">화면 테마 모드</h3>
                  </div>
                  <span className={`text-xs font-mono ${c.dimText}`}>
                    현재: {isDark ? '다크 모드 (Dark)' : '라이트 모드 (Light)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleThemeChange('dark')}
                    className={`py-3.5 px-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                      isDark
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/20 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-semibold">다크 모드 (Dark)</span>
                    </div>
                    <span className={`text-[11px] ${c.dimText}`}>어두운 배경과 눈이 편안한 대비</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('light')}
                    className={`py-3.5 px-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                      !isDark
                        ? 'bg-amber-500/20 border-amber-500 text-amber-900 shadow-lg shadow-amber-500/20 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold">라이트 모드 (Light)</span>
                    </div>
                    <span className={`text-[11px] ${c.dimText}`}>밝고 깔끔한 화이트/슬레이트 배경</span>
                  </button>
                </div>
              </div>

              {/* FONT SIZE PREFERENCE */}
              <div className={`border rounded-2xl p-6 space-y-4 shadow-sm ${c.cardBg}`}>
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-purple-500" />
                    <h3 className="text-sm font-bold">화면 글자 크기 (텍스트 스케일)</h3>
                  </div>
                  <span className={`text-xs font-mono ${c.dimText}`}>
                    현재: {fontSizeLevel === 'normal' ? '보통 (100%)' : fontSizeLevel === 'large' ? '크게 (115%)' : '아주 크게 (130%)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFontSizeChange('normal')}
                    className={`py-3 px-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      fontSizeLevel === 'normal'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-600/20 font-bold'
                        : `${c.cardInnerBg} ${c.cardInnerBorder} ${c.subText}`
                    }`}
                  >
                    <span className="text-xs font-semibold">보통 (Normal)</span>
                    <span className={`text-[11px] ${c.dimText}`}>기본 크기 (100%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFontSizeChange('large')}
                    className={`py-3 px-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      fontSizeLevel === 'large'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-600/20 font-bold'
                        : `${c.cardInnerBg} ${c.cardInnerBorder} ${c.subText}`
                    }`}
                  >
                    <span className="text-sm font-semibold">크게 (Large)</span>
                    <span className={`text-[11px] ${c.dimText}`}>가독성 향상 (115%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFontSizeChange('xlarge')}
                    className={`py-3 px-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      fontSizeLevel === 'xlarge'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-600/20 font-bold'
                        : `${c.cardInnerBg} ${c.cardInnerBorder} ${c.subText}`
                    }`}
                  >
                    <span className="text-base font-semibold">아주 크게 (XL)</span>
                    <span className={`text-[11px] ${c.dimText}`}>시원한 글씨 (130%)</span>
                  </button>
                </div>
              </div>

              {/* PLATFORM SETTINGS */}
              <div className={`border rounded-2xl p-6 space-y-4 shadow-sm ${c.cardBg}`}>
                <h3 className="text-sm font-bold">새 플랫폼 추가</h3>
                <form onSubmit={handleAddPlatform} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="예: CodeTree, LeetCode, AtCoder, HackerRank..."
                    value={newPlatformInput}
                    onChange={(e) => setNewPlatformInput(e.target.value)}
                    className={`flex-1 rounded-xl px-4 py-2 text-xs placeholder-slate-400 focus:outline-none border ${c.inputBg}`}
                  />
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 font-semibold text-white text-xs rounded-xl transition shadow flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>추가</span>
                  </button>
                </form>
              </div>

              <div className={`border rounded-2xl p-6 space-y-4 shadow-sm ${c.cardBg}`}>
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <h3 className="text-sm font-bold">사용 중인 플랫폼 목록 ({platforms.length}개)</h3>
                  <span className={`text-xs ${c.dimText}`}>x 버튼을 누르면 목록에서 삭제됩니다.</span>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {platforms.map((p) => (
                    <div
                      key={p}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition ${c.cardInnerBg} ${c.cardInnerBorder}`}
                    >
                      <span className="font-mono text-purple-400 font-semibold">{p}</span>
                      <button
                        type="button"
                        onClick={() => handleDeletePlatform(p)}
                        title={`${p} 삭제`}
                        className={`hover:text-rose-500 p-0.5 rounded transition ${c.dimText}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FLASHCARD MODAL */}
      {flashcardOpen && allFlashcards.length > 0 && (
        <div className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 ${c.modalOverlay}`}>
          <div className={`border rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl ${c.modalBg}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500">
                {allFlashcards[currentCardIndex].certName} ({currentCardIndex + 1}/{allFlashcards.length})
              </span>
              <button onClick={() => setFlashcardOpen(false)} className={`text-xs px-2 py-1 rounded border ${c.buttonSec}`}>닫기</button>
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`min-h-[180px] p-6 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/40 transition select-none ${c.cardInnerBg} ${c.cardInnerBorder}`}
            >
              <span className={`text-[11px] mb-2 ${c.dimText}`}>{isFlipped ? '정답 (Answer)' : '문제 (Question) - 클릭해서 정답 확인'}</span>
              <p className="text-sm font-semibold">
                {isFlipped ? allFlashcards[currentCardIndex].a : allFlashcards[currentCardIndex].q}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentCardIndex === 0}
                onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => prev - 1); }}
                className={`px-4 py-2 rounded-xl text-xs disabled:opacity-40 border ${c.buttonSec}`}
              >
                이전 카드
              </button>
              <button onClick={() => setIsFlipped(!isFlipped)} className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 text-xs font-medium">
                카드 뒤집기
              </button>
              <button
                disabled={currentCardIndex === allFlashcards.length - 1}
                onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => prev + 1); }}
                className={`px-4 py-2 rounded-xl text-xs disabled:opacity-40 border ${c.buttonSec}`}
              >
                다음 카드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOKEN MODAL */}
      {isTokenModalOpen && (
        <div className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 ${c.modalOverlay}`}>
          <div className={`border rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl ${c.modalBg}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                GitHub Personal Access Token 설정
              </h3>
              <button onClick={() => setIsTokenModalOpen(false)} className={`text-xs px-2 py-1 rounded border ${c.buttonSec}`}>닫기</button>
            </div>
            <input
              type="password"
              placeholder="github_pat_..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className={`w-full rounded-xl p-3 text-xs focus:outline-none border ${c.inputBg}`}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsTokenModalOpen(false)} className={`px-4 py-2 rounded-xl text-xs border ${c.buttonSec}`}>취소</button>
              <button onClick={handleSaveToken} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs">저장 및 동기화</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT NOTE MODAL */}
      {isModalOpen && (
        <div className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 ${c.modalOverlay}`}>
          <div className={`border rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto ${c.modalBg}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                {isEditMode ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-indigo-500" />}
                {isEditMode ? '학습 기록 수정' : '새 학습 기록 작성'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className={`text-xs px-2 py-1 rounded border ${c.buttonSec}`}>닫기</button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1.5">카테고리</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    disabled={isEditMode}
                    onClick={() => setNewNoteCategory('algo')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'algo' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : `${c.buttonSec} border`} ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    알고리즘
                  </button>
                  <button
                    type="button"
                    disabled={isEditMode}
                    onClick={() => setNewNoteCategory('cert')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'cert' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : `${c.buttonSec} border`} ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    자격증
                  </button>
                  <button
                    type="button"
                    disabled={isEditMode}
                    onClick={() => setNewNoteCategory('cs')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'cs' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : `${c.buttonSec} border`} ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    CS 이론
                  </button>
                  <button
                    type="button"
                    disabled={isEditMode}
                    onClick={() => setNewNoteCategory('lang')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'lang' ? 'bg-rose-500/20 border-rose-500 text-rose-500' : `${c.buttonSec} border`} ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    어학
                  </button>
                </div>
              </div>

              {/* 알고리즘 플랫폼 선택 */}
              {newNoteCategory === 'algo' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold">플랫폼 선택</label>
                      <button
                        type="button"
                        onClick={() => setCustomPlatformMode(!customPlatformMode)}
                        className="text-[10px] text-purple-400 hover:underline"
                      >
                        {customPlatformMode ? '목록에서 선택' : '+ 직접 입력'}
                      </button>
                    </div>

                    {customPlatformMode ? (
                      <input
                        type="text"
                        required
                        placeholder="새 플랫폼 이름 입력"
                        value={newNoteData.platform}
                        onChange={(e) => setNewNoteData({ ...newNoteData, platform: e.target.value })}
                        className={`w-full rounded-xl px-3 py-2 border ${c.inputBg}`}
                      />
                    ) : (
                      <select
                        value={newNoteData.platform}
                        onChange={(e) => setNewNoteData({ ...newNoteData, platform: e.target.value })}
                        className={`w-full rounded-xl px-3 py-2 border ${c.inputBg}`}
                      >
                        {platforms.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">난이도</label>
                    <input
                      type="text"
                      placeholder="level"
                      value={newNoteData.difficulty}
                      onChange={(e) => setNewNoteData({ ...newNoteData, difficulty: e.target.value })}
                      className={`w-full rounded-xl px-3 py-2 border ${c.inputBg}`}
                    />
                  </div>
                </div>
              )}

              {newNoteCategory === 'cert' && (
                <div>
                  <label className="block font-semibold mb-1">자격증 종목</label>
                  <input
                    type="text"
                    required
                    placeholder="ex) 정보처리기사, SQLD, 리눅스마스터 등"
                    value={newNoteData.subCategory}
                    onChange={(e) => setNewNoteData({ ...newNoteData, subCategory: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 border ${c.inputBg}`}
                  />
                </div>
              )}

              {newNoteCategory === 'cs' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold">CS 분류 / 도메인</label>
                    <span className={`text-[10px] ${c.dimText}`}>직접 입력 가능</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="예: 운영체제(OS), 네트워크, 데이터베이스, 자료구조, 웹/스프링"
                    value={newNoteData.subCategory}
                    onChange={(e) => setNewNoteData({ ...newNoteData, subCategory: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 border ${c.inputBg}`}
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">제목</label>
                <input
                  type="text"
                  required
                  placeholder="제목을 입력하세요"
                  value={newNoteData.title}
                  onChange={(e) => setNewNoteData({ ...newNoteData, title: e.target.value })}
                  className={`w-full rounded-xl px-3.5 py-2.5 border ${c.inputBg}`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">핵심 요약</label>
                <textarea
                  rows={3}
                  required
                  placeholder="요약 내용 및 핵심 아이디어를 작성하세요"
                  value={newNoteData.summary}
                  onChange={(e) => setNewNoteData({ ...newNoteData, summary: e.target.value })}
                  className={`w-full rounded-xl p-3 border ${c.inputBg}`}
                />
              </div>

              {newNoteCategory === 'algo' && (
                <div>
                  <label className="block font-semibold mb-1">풀이 코드</label>
                  <textarea
                    rows={5}
                    placeholder="풀이 코드를 입력하세요"
                    value={newNoteData.code}
                    onChange={(e) => setNewNoteData({ ...newNoteData, code: e.target.value })}
                    className={`w-full font-mono rounded-xl p-3 border ${c.inputBg}`}
                  />
                </div>
              )}

              {newNoteCategory === 'cert' && (
                <div>
                  <label className="block font-semibold mb-1">시험 포인트 / 오답 유의사항 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: 실기 단답형 빈출 용어"
                    value={newNoteData.keyPoint}
                    onChange={(e) => setNewNoteData({ ...newNoteData, keyPoint: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 border ${c.inputBg}`}
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="태그 입력"
                  value={newNoteData.tags}
                  onChange={(e) => setNewNoteData({ ...newNoteData, tags: e.target.value })}
                  className={`w-full rounded-xl px-3.5 py-2 border ${c.inputBg}`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl border ${c.buttonSec}`}>
                  취소
                </button>
                <button type="submit" disabled={isSyncing} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow">
                  {isSyncing ? '동기화 중...' : (isEditMode ? '수정사항 저장 및 GitHub 동기화' : '저장 및 GitHub 동기화')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}