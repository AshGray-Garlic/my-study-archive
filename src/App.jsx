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
  CheckCircle2,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Filter,
  Tag,
  Trash2,
  Zap,
  ArrowRight,
  HelpCircle,
  Layers,
  FileText,
  Key,
  RefreshCw
} from 'lucide-react';

const REPO_OWNER = 'AshGray-Garlic';
const REPO_NAME = 'my-study-archive';
const FILE_PATH = 'public/data/db.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  // GitHub Token & Sync States
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [fileSha, setFileSha] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState(githubToken);

  // App Data States
  const [algoList, setAlgoList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [csList, setCsList] = useState([]);
  const [langList, setLangList] = useState([]);

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
        setCsList(data.csTopics || []);
        setLangList(data.languages || []);
      } else {
        // 원격에 파일이 없으면 로컬 백업 확인
        const local = localStorage.getItem('study_db_cache');
        if (local) {
          const parsed = JSON.parse(local);
          setAlgoList(parsed.algorithms || []);
          setCertList(parsed.certifications || []);
          setCsList(parsed.csTopics || []);
          setLangList(parsed.languages || []);
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
      alert('GitHub 토큰이 등록되지 않아 로컬 브라우저에만 저장됩니다. 사이드바의 설정에서 토큰을 입력해주세요.');
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
          message: 'chore: update study archive data',
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

  // Delete Item Handler
  const handleDeleteItem = async (category, id) => {
    if (!window.confirm('해당 항목을 영구 삭제하시겠습니까? (GitHub 저장소에서도 함께 삭제됩니다)')) return;

    let updatedAlgo = algoList;
    let updatedCert = certList;
    let updatedCs = csList;
    let updatedLang = langList;

    if (category === 'algo') updatedAlgo = algoList.filter((item) => item.id !== id);
    if (category === 'cert') updatedCert = certList.filter((item) => item.id !== id);
    if (category === 'cs') updatedCs = csList.filter((item) => item.id !== id);
    if (category === 'lang') updatedLang = langList.filter((item) => item.id !== id);

    const fullData = {
      algorithms: updatedAlgo,
      certifications: updatedCert,
      csTopics: updatedCs,
      languages: updatedLang
    };

    setAlgoList(updatedAlgo);
    setCertList(updatedCert);
    setCsList(updatedCs);
    setLangList(updatedLang);

    await commitToGithub(fullData);
  };

  // Flashcard Modal State
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New Note Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteCategory, setNewNoteCategory] = useState('algo');
  const [newNoteData, setNewNoteData] = useState({
    title: '',
    platform: 'Baekjoon',
    difficulty: 'Silver',
    tags: '',
    code: '',
    summary: '',
    keyPoint: '',
    subCategory: 'Data Structure'
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

  const allFlashcards = useMemo(() => {
    const cards = [];
    certList.forEach((c) => {
      if (c.flashcards) {
        c.flashcards.forEach((fc) => cards.push({ ...fc, certName: c.title }));
      }
    });
    return cards;
  }, [certList]);

  const allAlgoTags = useMemo(() => {
    const set = new Set(['ALL']);
    algoList.forEach((item) => item.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [algoList]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteData.title.trim()) return;

    const tagArray = newNoteData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    let updatedAlgo = algoList;
    let updatedCs = csList;
    let updatedLang = langList;

    if (newNoteCategory === 'algo') {
      const newAlgo = {
        id: `algo-${Date.now()}`,
        title: newNoteData.title,
        platform: newNoteData.platform,
        problemNumber: 'NEW',
        difficulty: newNoteData.difficulty,
        tags: tagArray.length > 0 ? tagArray : ['구현'],
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        status: 'Solved',
        summary: newNoteData.summary || '학습한 문제 요약 내용입니다.',
        keyPoint: newNoteData.keyPoint || '핵심 아이디어 및 고려할 예외 조건.',
        codeLanguage: 'java',
        code: newNoteData.code || '// 풀이 코드를 입력하세요\npublic class Main {\n}',
        retrospective: '새로 추가된 학습 기록입니다.'
      };
      updatedAlgo = [newAlgo, ...algoList];
      setAlgoList(updatedAlgo);
      setActiveTab('algo');
    } else if (newNoteCategory === 'cs') {
      const newCs = {
        id: `cs-${Date.now()}`,
        domain: newNoteData.subCategory,
        title: newNoteData.title,
        importance: 'High (★ 4.0)',
        concept: newNoteData.summary || '개념 정의 및 메커니즘을 기술합니다.',
        comparison: null,
        interviewQA: [
          {
            q: `${newNoteData.title}의 핵심 원리는 무엇인가요?`,
            a: newNoteData.keyPoint || '상세 답변 내용을 정리합니다.'
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
        situation: newNoteData.summary || '학습 표현 및 상황',
        dialogue: [
          {
            speaker: 'User',
            en: newNoteData.keyPoint || 'I would like to explain this concept smoothly.',
            ko: '이 개념을 유창하게 설명하고 싶습니다.'
          }
        ],
        templates: [
          { en: 'In a nutshell, the primary reason is...', ko: '요약하자면, 주된 이유는 ~입니다.' }
        ]
      };
      updatedLang = [newLang, ...langList];
      setLangList(updatedLang);
      setActiveTab('language');
    }

    const fullData = {
      algorithms: updatedAlgo,
      certifications: certList,
      csTopics: updatedCs,
      languages: updatedLang
    };

    await commitToGithub(fullData);

    setNewNoteData({
      title: '',
      platform: 'Baekjoon',
      difficulty: 'Silver',
      tags: '',
      code: '',
      summary: '',
      keyPoint: '',
      subCategory: 'Data Structure'
    });
    setIsModalOpen(false);
  };

  const handleSaveToken = () => {
    localStorage.setItem('gh_token', tokenInput.trim());
    setGithubToken(tokenInput.trim());
    setIsTokenModalOpen(false);
    loadDataFromGithub(tokenInput.trim());
  };

  const filteredAlgorithms = useMemo(() => {
    return algoList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag === 'ALL' || item.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [algoList, searchQuery, selectedTag]);

  const filteredCs = useMemo(() => {
    return csList.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.concept && item.concept.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [csList, searchQuery]);

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
            onClick={() => setIsModalOpen(true)}
            className="w-full mb-6 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>새 학습 기록 작성</span>
          </button>

          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>대시보드 홈</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('algo'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'algo' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cert' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span>자격증 (Cert)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {certList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('cs'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cs' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'language' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
          </nav>
        </div>

        {/* Sync Settings Bottom Button */}
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="개념, 알고리즘, CS 용어, 태그 검색..."
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
            <button
              onClick={() => {
                setCurrentCardIndex(0);
                setIsFlipped(false);
                setFlashcardOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium rounded-xl flex items-center gap-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>암기 플래시카드 모드</span>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-800/40">
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Personal Learning Archive
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mt-3 mb-2">
                    환영합니다, 엔지니어님! 🚀
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    작성하거나 삭제한 데이터는 GitHub API를 통해 실시간으로 원격 저장소(`public/data/db.json`)에 자동 반영됩니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">해결한 문제</span>
                    <Code2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{algoList.length} <span className="text-xs text-slate-400 font-sans font-normal">문제</span></div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">자격증 로드맵</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{certList.length} <span className="text-xs text-slate-400 font-sans font-normal">과목</span></div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">CS 면접 토픽</span>
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

              {/* Category Nav Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div onClick={() => setActiveTab('algo')} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><Code2 className="w-5 h-5" /></div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">이동하기 <ArrowRight className="w-3 h-3" /></span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">알고리즘 (Algorithm)</h4>
                  <p className="text-xs text-slate-400">문제 풀이, 시간 복잡도, 코드 뷰어 및 항목 삭제 지원.</p>
                </div>

                <div onClick={() => setActiveTab('cert')} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400"><Award className="w-5 h-5" /></div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">이동하기 <ArrowRight className="w-3 h-3" /></span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">자격증 (Certification)</h4>
                  <p className="text-xs text-slate-400">정보처리기사 및 SQLD 암기 노트 및 플래시카드 복습.</p>
                </div>

                <div onClick={() => setActiveTab('cs')} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400"><Cpu className="w-5 h-5" /></div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">이동하기 <ArrowRight className="w-3 h-3" /></span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">컴퓨터 사이언스 (CS)</h4>
                  <p className="text-xs text-slate-400">OS, Network, DB 개념 비교 분석 및 기술 면접 꼬리질문.</p>
                </div>

                <div onClick={() => setActiveTab('language')} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400"><Languages className="w-5 h-5" /></div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">이동하기 <ArrowRight className="w-3 h-3" /></span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">어학 및 테크 영어 (Language)</h4>
                  <p className="text-xs text-slate-400">OPIc AL 대비 롤플레이, PR 코멘트 템플릿 및 TTS 음성 재생.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALGORITHM */}
          {activeTab === 'algo' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Code2 className="w-6 h-6 text-emerald-400" />
                    알고리즘 아카이브
                  </h2>
                </div>
                <button
                  onClick={() => { setNewNoteCategory('algo'); setIsModalOpen(true); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 문제 풀이 등록</span>
                </button>
              </div>

              {/* Tag Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {allAlgoTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                      selectedTag === tag ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Problem List with Delete */}
              <div className="space-y-6">
                {filteredAlgorithms.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-sm">등록된 알고리즘 풀이가 없습니다.</p>
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
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 font-mono hidden sm:inline">시간: {algo.timeComplexity}</span>
                          <button
                            onClick={() => handleDeleteItem('algo', algo.id)}
                            title="항목 삭제"
                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                            <span className="font-semibold text-slate-300 block mb-1">📌 문제 요약</span>
                            <p className="text-slate-400">{algo.summary}</p>
                          </div>
                          <div className="p-3.5 bg-indigo-950/20 rounded-xl border border-indigo-900/30">
                            <span className="font-semibold text-indigo-300 block mb-1">💡 핵심 아이디어</span>
                            <p className="text-slate-300">{algo.keyPoint}</p>
                          </div>
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

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <Tag className="w-3.5 h-3.5 text-slate-500" />
                          {algo.tags?.map((t, idx) => (
                            <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                              #{t}
                            </span>
                          ))}
                        </div>
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-amber-400" />
                  자격증 로드맵
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certList.map((cert) => (
                  <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
                    <button
                      onClick={() => handleDeleteItem('cert', cert.id)}
                      title="자격증 항목 삭제"
                      className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      D-{cert.dDay}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{cert.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">시험일: {cert.targetDate} | {cert.subject}</p>
                  </div>
                ))}
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
                {filteredCs.map((cs) => (
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

                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
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
        </div>
      </main>

      {/* TOKEN SETTINGS MODAL */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                GitHub Personal Access Token 설정
              </h3>
              <button onClick={() => setIsTokenModalOpen(false)} className="text-slate-400 text-xs px-2 py-1 rounded bg-slate-800">
                닫기
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              방금 발급받은 Fine-grained Token(`github_pat_...`)을 입력하세요. 브라우저에 안전하게 보관되어 어떤 기기에서든 추가/삭제가 GitHub에 영구 동기화됩니다.
            </p>
            <input
              type="password"
              placeholder="github_pat_..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsTokenModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">
                취소
              </button>
              <button onClick={handleSaveToken} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs shadow">
                토큰 저장 및 동기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW NOTE MODAL */}
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
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('algo')}
                    className={`py-2 rounded-xl border font-medium ${newNoteCategory === 'algo' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    알고리즘
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

              {newNoteCategory === 'algo' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">플랫폼</label>
                    <select
                      value={newNoteData.platform}
                      onChange={(e) => setNewNoteData({ ...newNoteData, platform: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value="Baekjoon">백준</option>
                      <option value="SWEA">SWEA</option>
                      <option value="Programmers">프로그래머스</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">난이도</label>
                    <input
                      type="text"
                      placeholder="Silver I, D3, Level 2..."
                      value={newNoteData.difficulty}
                      onChange={(e) => setNewNoteData({ ...newNoteData, difficulty: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">태그 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="BFS, DP, OS, OPIc"
                  value={newNoteData.tags}
                  onChange={(e) => setNewNoteData({ ...newNoteData, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">핵심 요약</label>
                <textarea
                  rows={2}
                  placeholder="요약 내용을 기술하세요"
                  value={newNoteData.summary}
                  onChange={(e) => setNewNoteData({ ...newNoteData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                />
              </div>

              {newNoteCategory === 'algo' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">코드</label>
                  <textarea
                    rows={5}
                    placeholder="풀이 코드를 입력하세요"
                    value={newNoteData.code}
                    onChange={(e) => setNewNoteData({ ...newNoteData, code: e.target.value })}
                    className="w-full font-mono bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                  />
                </div>
              )}

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