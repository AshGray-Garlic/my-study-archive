import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Award,
  Cpu,
  Languages,
  LayoutDashboard,
  Search,
  Plus,
  Calendar,
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
  X
} from 'lucide-react';

const REPO_OWNER = 'AshGray-Garlic';
const REPO_NAME = 'my-study-archive';
const FILE_PATH = 'public/data/db.json';

const DEFAULT_PLATFORMS = ['SWEA', 'Programmers', 'LeetCode', 'CodeTree'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedCertTab, setSelectedCertTab] = useState('ALL');

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

  // Custom Platform Settings State
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [newPlatformInput, setNewPlatformInput] = useState('');
  const [customPlatformMode, setCustomPlatformMode] = useState(false);

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
      platforms: updated
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
      platforms: updated
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
      platforms: platforms
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
    subCategory: '정보처리기사',
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

  // Create Note Handler
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteData.title.trim()) return;

    const tagArray = newNoteData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    let updatedAlgo = algoList;
    let updatedCertNotes = certNotes;
    let updatedCs = csList;
    let updatedLang = langList;
    let updatedPlatforms = platforms;

    if (newNoteCategory === 'algo') {
      const chosenPlatform = newNoteData.platform.trim() || 'Custom';
      if (!platforms.includes(chosenPlatform)) {
        updatedPlatforms = [...platforms, chosenPlatform];
        setPlatforms(updatedPlatforms);
      }

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
        retrospective: '새로 추가된 학습 기록'
      };
      updatedAlgo = [newAlgo, ...algoList];
      setAlgoList(updatedAlgo);
      setActiveTab('algo');
    } else if (newNoteCategory === 'cert') {
      const newCertNote = {
        id: `cert-note-${Date.now()}`,
        certName: newNoteData.subCategory || '정보처리기사',
        title: newNoteData.title,
        tags: tagArray.length > 0 ? tagArray : ['핵심암기'],
        summary: newNoteData.summary || '공부한 핵심 이론 및 요약 내용',
        keyPoint: newNoteData.keyPoint || '',
        question: newNoteData.certQuestion || '',
        answer: newNoteData.certAnswer || ''
      };
      updatedCertNotes = [newCertNote, ...certNotes];
      setCertNotes(updatedCertNotes);
      setActiveTab('cert');
    } else if (newNoteCategory === 'cs') {
      const newCs = {
        id: `cs-${Date.now()}`,
        domain: newNoteData.subCategory || 'Network',
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
      updatedCs = [newCs, ...csList];
      setCsList(updatedCs);
      setActiveTab('cs');
    } else if (newNoteCategory === 'lang') {
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
      updatedLang = [newLang, ...langList];
      setLangList(updatedLang);
      setActiveTab('language');
    }

    const fullData = {
      algorithms: updatedAlgo,
      certifications: certList,
      certNotes: updatedCertNotes,
      csTopics: updatedCs,
      languages: updatedLang,
      platforms: updatedPlatforms
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
      subCategory: '정보처리기사',
      certQuestion: '',
      certAnswer: ''
    });
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                DevStudy <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Hub</span>
              </h1>
              <p className="text-xs text-slate-400">지식 아카이브 & 학습 관리</p>
            </div>
          </div>

          <button
            onClick={() => {
              setNewNoteCategory('algo');
              if (platforms.length > 0) setNewNoteData((prev) => ({ ...prev, platform: platforms[0] }));
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-indigo-400 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>대시보드 홈</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('algo'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'algo' ? 'bg-slate-800 text-indigo-400 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>알고리즘 (Algo)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {algoList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('cert'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'cert' ? 'bg-slate-800 text-indigo-400 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span>자격증 (Cert)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {certNotes.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('cs'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'cs' ? 'bg-slate-800 text-indigo-400 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>컴퓨터 구조 & CS</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {csList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('language'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'language' ? 'bg-slate-800 text-indigo-400 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <Languages className="w-4 h-4 text-rose-400" />
                <span>어학 (Language)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {langList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-indigo-400 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-purple-400" />
                <span>설정 (플랫폼 관리)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {platforms.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setIsTokenModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center justify-between transition border border-slate-700/50"
          >
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub 동기화 설정</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${githubToken ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="개념, 기출 요약, 알고리즘 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => loadDataFromGithub()}
              disabled={isSyncing}
              title="GitHub 최신 데이터 동기화"
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50"
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
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium rounded-xl flex items-center gap-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>플래시카드 모드</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          {/* TAB 1: DASHBOARD (통합 검색 지원) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* 검색어가 없을 때: 기본 대시보드 통계 화면 */}
              {!searchQuery.trim() ? (
                <>
                  <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-800/40">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Personal Learning Archive
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mt-3 mb-2">
                      환영합니다, 엔지니어님! 🚀
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      상단 검색창에서 알고리즘 문제, 자격증 핵심 요약, CS 이론, 어학 표현을 통합 검색할 수 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">해결한 알고리즘</span>
                        <Code2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{algoList.length} <span className="text-xs text-slate-400 font-sans font-normal">문제</span></div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">자격증 노트</span>
                        <Award className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{certNotes.length} <span className="text-xs text-slate-400 font-sans font-normal">개</span></div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">컴퓨터 구조 & CS</span>
                        <Cpu className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{csList.length} <span className="text-xs text-slate-400 font-sans font-normal">주제</span></div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium">어학 템플릿</span>
                        <Languages className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{langList.length} <span className="text-xs text-slate-400 font-sans font-normal">세트</span></div>
                    </div>
                  </div>
                </>
              ) : (
                /* 검색어가 있을 때: 통합 검색 결과 뷰 */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Search className="w-5 h-5 text-indigo-400" />
                      통합 검색 결과: <span className="text-indigo-400 font-mono">"{searchQuery}"</span>
                    </h3>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60"
                    >
                      검색어 초기화
                    </button>
                  </div>

                  {/* 알고리즘 검색 결과 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Code2 className="w-4 h-4" />
                        알고리즘 ({filteredAlgorithms.length})
                      </h4>
                      {filteredAlgorithms.length > 0 && (
                        <button
                          onClick={() => setActiveTab('algo')}
                          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                        >
                          알고리즘 탭으로 이동 <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {filteredAlgorithms.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 px-4 bg-slate-900/40 rounded-xl border border-slate-800">
                        일치하는 알고리즘 문제가 없습니다.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredAlgorithms.slice(0, 4).map((algo) => (
                          <div
                            key={algo.id}
                            onClick={() => setActiveTab('algo')}
                            className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {algo.platform} #{algo.problemNumber}
                              </span>
                              <span className="text-[11px] text-slate-400">{algo.difficulty}</span>
                            </div>
                            <h5 className="text-sm font-bold text-white truncate">{algo.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                              {algo.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 자격증 검색 결과 */}
                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        자격증 노트 ({filteredCertNotes.length})
                      </h4>
                      {filteredCertNotes.length > 0 && (
                        <button
                          onClick={() => setActiveTab('cert')}
                          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1"
                        >
                          자격증 탭으로 이동 <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {filteredCertNotes.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 px-4 bg-slate-900/40 rounded-xl border border-slate-800">
                        일치하는 자격증 노트가 없습니다.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredCertNotes.slice(0, 4).map((note) => (
                          <div
                            key={note.id}
                            onClick={() => setActiveTab('cert')}
                            className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition space-y-2"
                          >
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {note.certName}
                            </span>
                            <h5 className="text-sm font-bold text-white truncate">{note.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                              {note.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CS 토픽 검색 결과 */}
                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4" />
                        컴퓨터 구조 & CS ({csList.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.concept.toLowerCase().includes(searchQuery.toLowerCase())).length})
                      </h4>
                      <button
                        onClick={() => setActiveTab('cs')}
                        className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1"
                      >
                        CS 탭으로 이동 <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {csList
                        .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.concept.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 4)
                        .map((cs) => (
                          <div
                            key={cs.id}
                            onClick={() => setActiveTab('cs')}
                            className="p-4 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl cursor-pointer transition space-y-2"
                          >
                            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {cs.domain}
                            </span>
                            <h5 className="text-sm font-bold text-white truncate">{cs.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                              {cs.concept}
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Code2 className="w-6 h-6 text-emerald-400" />
                  알고리즘 아카이브
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-400" />
                    <span>플랫폼 관리</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewNoteCategory('algo');
                      if (platforms.length > 0) setNewNoteData((prev) => ({ ...prev, platform: platforms[0] }));
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
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {allAlgoTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${selectedTag === tag ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Problem List */}
              <div className="space-y-6">
                {filteredAlgorithms.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-sm">해당 조건의 알고리즘 풀이가 없습니다.</p>
                  </div>
                ) : (
                  filteredAlgorithms.map((algo) => (
                    <div key={algo.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                      <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {algo.platform} #{algo.problemNumber}
                          </span>
                          <h3 className="text-base font-bold text-white">{algo.title}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {algo.difficulty}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteItem('algo', algo.id)}
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {algo.summary}
                        </div>

                        {algo.code && (
                          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
                              <span className="font-mono uppercase text-emerald-400 font-semibold">{algo.codeLanguage || 'code'}</span>
                              <button
                                onClick={() => handleCopy(algo.id, algo.code)}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition"
                              >
                                {copiedId === algo.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === algo.id ? '복사됨!' : '코드 복사'}</span>
                              </button>
                            </div>
                            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin">
                              <code>{algo.code}</code>
                            </pre>
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
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Award className="w-6 h-6 text-amber-400" />
                    자격증 아카이브
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">자격증 종목별로 학습 요약 노트 및 기출 포인트를 모아봅니다.</p>
                </div>
                <button
                  onClick={() => {
                    setNewNoteCategory('cert');
                    setNewNoteData((prev) => ({ ...prev, subCategory: selectedCertTab === 'ALL' ? '정보처리기사' : selectedCertTab }));
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 자격증 노트 추가</span>
                </button>
              </div>

              {/* 자격증별 필터 탭 바 */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
                {certTabOptions.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedCertTab(tab)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition ${selectedCertTab === tab
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                  >
                    {tab === 'ALL' ? '전체 자격증 보기' : tab}
                  </button>
                ))}
              </div>

              {/* 공부 내용 카드 리스트 */}
              <div className="space-y-4">
                {filteredCertNotes.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">해당 자격증에 등록된 공부 노트가 없습니다.</p>
                  </div>
                ) : (
                  filteredCertNotes.map((note) => (
                    <div key={note.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {note.certName}
                          </span>
                          <h3 className="text-base font-bold text-white">{note.title}</h3>
                        </div>
                        <button
                          onClick={() => handleDeleteItem('certNote', note.id)}
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {note.summary}
                      </div>

                      {note.keyPoint && (
                        <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl text-xs">
                          <span className="font-semibold text-amber-400 block mb-1">🔑 핵심 시험 포인트 & 오답 유의사항</span>
                          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{note.keyPoint}</p>
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Cpu className="w-6 h-6 text-blue-400" />
                  컴퓨터 사이언스 & 기술 면접
                </h2>
                <button
                  onClick={() => { setNewNoteCategory('cs'); setIsModalOpen(true); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 CS 토픽 추가</span>
                </button>
              </div>

              <div className="space-y-6">
                {csList.map((cs) => (
                  <div key={cs.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                          {cs.domain}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1.5">{cs.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteItem('cs', cs.id)}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Languages className="w-6 h-6 text-rose-400" />
                  어학 및 테크 영어
                </h2>
                <button
                  onClick={() => { setNewNoteCategory('lang'); setIsModalOpen(true); }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 영어 표현 추가</span>
                </button>
              </div>

              <div className="space-y-6">
                {langList.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1.5">{item.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteItem('lang', item.id)}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {item.dialogue?.map((line, dIdx) => (
                        <div key={dIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                          <div className="text-xs">
                            <p className="font-medium text-slate-200">{line.en}</p>
                            <p className="text-slate-500 mt-1">{line.ko}</p>
                          </div>
                          <button onClick={() => speakText(line.en)} className="p-2 bg-slate-900 hover:text-rose-400 rounded-lg transition">
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

          {/* TAB 6: SETTINGS (플랫폼 관리 세팅) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Settings className="w-6 h-6 text-purple-400" />
                  환경 설정 (플랫폼 세팅)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  알고리즘 문제 풀이 등록 시 사용할 플랫폼 목록을 직접 추가하거나 삭제하여 관리합니다. 변경 사항은 GitHub 저장소에 자동 동기화됩니다.
                </p>
              </div>

              {/* 새 플랫폼 추가 폼 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-200">새 플랫폼 추가</h3>
                <form onSubmit={handleAddPlatform} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="예: CodeTree, LeetCode, AtCoder, HackerRank..."
                    value={newPlatformInput}
                    onChange={(e) => setNewPlatformInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
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

              {/* 현재 활성 플랫폼 목록 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-200">사용 중인 플랫폼 목록 ({platforms.length}개)</h3>
                  <span className="text-xs text-slate-500">x 버튼을 누르면 목록에서 삭제됩니다.</span>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {platforms.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium hover:border-purple-500/50 transition"
                    >
                      <span className="font-mono text-purple-300 font-semibold">{p}</span>
                      <button
                        type="button"
                        onClick={() => handleDeletePlatform(p)}
                        title={`${p} 삭제`}
                        className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                {allFlashcards[currentCardIndex].certName} ({currentCardIndex + 1}/{allFlashcards.length})
              </span>
              <button onClick={() => setFlashcardOpen(false)} className="text-slate-400 text-xs px-2 py-1 rounded bg-slate-800">닫기</button>
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[180px] p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/40 transition select-none"
            >
              <span className="text-[11px] text-slate-500 mb-2">{isFlipped ? '정답 (Answer)' : '문제 (Question) - 클릭해서 정답 확인'}</span>
              <p className="text-sm font-semibold text-slate-200">
                {isFlipped ? allFlashcards[currentCardIndex].a : allFlashcards[currentCardIndex].q}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentCardIndex === 0}
                onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => prev - 1); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 disabled:opacity-40"
              >
                이전 카드
              </button>
              <button onClick={() => setIsFlipped(!isFlipped)} className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 text-xs font-medium">
                카드 뒤집기
              </button>
              <button
                disabled={currentCardIndex === allFlashcards.length - 1}
                onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => prev + 1); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 disabled:opacity-40"
              >
                다음 카드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOKEN MODAL */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                GitHub Personal Access Token 설정
              </h3>
              <button onClick={() => setIsTokenModalOpen(false)} className="text-slate-400 text-xs px-2 py-1 rounded bg-slate-800">닫기</button>
            </div>
            <input
              type="password"
              placeholder="github_pat_..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsTokenModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">취소</button>
              <button onClick={handleSaveToken} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs">저장 및 동기화</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW NOTE MODAL (커스텀 플랫폼 연동) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                새 학습 기록 작성
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 text-xs px-2 py-1 rounded bg-slate-800">닫기</button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">카테고리</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('algo')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'algo' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    알고리즘
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('cert')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'cert' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    자격증
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('cs')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'cs' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    CS 이론
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('lang')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'lang' ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    어학
                  </button>
                </div>
              </div>

              {/* 알고리즘 플랫폼 선택 (커스텀 플랫폼 목록 연동) */}
              {newNoteCategory === 'algo' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-semibold">플랫폼 선택</label>
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      <select
                        value={newNoteData.platform}
                        onChange={(e) => setNewNoteData({ ...newNoteData, platform: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                      >
                        {platforms.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">난이도</label>
                    <input
                      type="text"
                      placeholder="level"
                      value={newNoteData.difficulty}
                      onChange={(e) => setNewNoteData({ ...newNoteData, difficulty: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>
              )}

              {newNoteCategory === 'cert' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">자격증 종목</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 정보처리기사, SQLD, 리눅스마스터 등"
                    value={newNoteData.subCategory}
                    onChange={(e) => setNewNoteData({ ...newNoteData, subCategory: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">제목</label>
                <input
                  type="text"
                  required
                  placeholder="제목을 입력하세요"
                  value={newNoteData.title}
                  onChange={(e) => setNewNoteData({ ...newNoteData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">핵심 요약</label>
                <textarea
                  rows={3}
                  required
                  placeholder="요약 내용 및 핵심 아이디어를 작성하세요"
                  value={newNoteData.summary}
                  onChange={(e) => setNewNoteData({ ...newNoteData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                />
              </div>

              {newNoteCategory === 'algo' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">풀이 코드</label>
                  <textarea
                    rows={5}
                    placeholder="풀이 코드를 입력하세요"
                    value={newNoteData.code}
                    onChange={(e) => setNewNoteData({ ...newNoteData, code: e.target.value })}
                    className="w-full font-mono bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="BFS, DP, 구현"
                  value={newNoteData.tags}
                  onChange={(e) => setNewNoteData({ ...newNoteData, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  취소
                </button>
                <button type="submit" disabled={isSyncing} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow">
                  {isSyncing ? '동기화 중...' : '저장 및 GitHub 동기화'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}