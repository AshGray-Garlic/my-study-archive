import React, { useState, useEffect } from 'react';
import {
  Code2,
  Award,
  Cpu,
  Languages,
  BookOpen,
  Search,
  PlusCircle,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  RotateCw,
  FolderGit2
} from 'lucide-react';

const initialAlgoProblems = [
  {
    id: 1,
    title: '백준 2178 - 미로 탐색',
    platform: 'Baekjoon',
    difficulty: 'Silver I',
    category: 'BFS',
    timeComplexity: 'O(N × M)',
    spaceComplexity: 'O(N × M)',
    summary: '최단 경로 탐색 문제로, 가중치가 1이므로 BFS를 사용하여 첫 도달 시점의 거리를 반환한다.',
    code: `import java.io.*;
import java.util.*;

public class Main {
    static int N, M;
    static int[][] map;
    static int[] dx = {-1, 1, 0, 0};
    static int[] dy = {0, 0, -1, 1};

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        N = Integer.parseInt(st.nextToken());
        M = Integer.parseInt(st.nextToken());

        map = new int[N][M];
        for (int i = 0; i < N; i++) {
            String line = br.readLine();
            for (int j = 0; j < M; j++) {
                map[i][j] = line.charAt(j) - '0';
            }
        }
        System.out.println(bfs(0, 0));
    }

    static int bfs(int startX, int startY) {
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{startX, startY});

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int x = cur[0];
            int y = cur[1];

            if (x == N - 1 && y == M - 1) return map[x][y];

            for (int d = 0; d < 4; d++) {
                int nx = x + dx[d];
                int ny = y + dy[d];

                if (nx >= 0 && nx < N && ny >= 0 && ny < M && map[nx][ny] == 1) {
                    map[nx][ny] = map[x][y] + 1;
                    q.offer(new int[]{nx, ny});
                }
            }
        }
        return -1;
    }
}`,
    retrospective: '방문 체크 배열(visited)을 따로 두지 않고 입력 배열 자체에 거리를 누적하여 메모리를 절약할 수 있다.'
  },
  {
    id: 2,
    title: 'SWEA 1244 - 최대 상금',
    platform: 'SWEA',
    difficulty: 'D3',
    category: 'DFS / 백트래킹',
    timeComplexity: 'O(State Pruning)',
    spaceComplexity: 'O(Depth)',
    summary: '주어진 교환 횟수 내에서 카드를 교환하여 만들 수 있는 가장 큰 수를 구하는 완전탐색 + 가지치기 문제.',
    code: `// 동일한 깊이(depth)에서 동일한 숫자 배열 형태는 Set을 활용해 중복 탐색 방지
// 자릿수 교환 후 재귀 호출, 기저조건: count == targetCount`,
    retrospective: '중복 탐색을 막지 않으면 10! 이상의 경우의 수가 발생하므로 Set 기반 메모이제이션 필수.'
  }
];

const initialCertCards = [
  {
    id: 1,
    exam: '정보처리기사',
    category: '소프트웨어 설계',
    question: '응집도(Cohesion)가 가장 높은 것부터 낮은 순서로 나열하시오.',
    answer: '기능적(Functional) > 순차적(Sequential) > 통신적(Communicational) > 절차적(Procedural) > 시간적(Temporal) > 논리적(Logical) > 우연적(Coincidental) [암기: 기순통절시논우]',
    level: '필수 암기'
  },
  {
    id: 2,
    exam: '정보처리기사',
    category: '데이터베이스',
    question: '트랜잭션의 4대 특징(ACID)은 무엇인가?',
    answer: '원자성(Atomicity), 일관성(Consistency), 격리성/고립성(Isolation), 영속성(Durability)',
    level: '빈출'
  },
  {
    id: 3,
    exam: 'SQLD',
    category: 'SQL 기본',
    question: 'WHERE 절과 HAVING 절의 결정적 차이점은?',
    answer: 'WHERE 절은 그룹화(GROUP BY) 이전에 행 단위로 조건을 필터링하며 집계 함수를 쓸 수 없음. HAVING 절은 그룹화 이후 그룹 단위 조건을 필터링하며 집계 함수 사용 가능.',
    level: '기본'
  }
];

const initialCsTopics = [
  {
    id: 1,
    subject: '운영체제',
    topic: '프로세스(Process) vs 스레드(Thread)',
    summary: '프로세스는 OS로부터 독립된 메모리 영역(Code, Data, Heap, Stack)을 할당받는 작업 단위이며, 스레드는 프로세스 내에서 Stack만 독립 할당받고 Code, Data, Heap을 공유하는 실행 흐름 단위이다.',
    details: [
      '자원 공유: 프로세스 간 통신은 IPC(파이프, 소켓 등) 필요, 스레드는 힙 영역을 통한 직접 데이터 공유 가능.',
      '컨텍스트 스위칭 비용: 스레드가 프로세스보다 캐시 플러시가 필요 없어 오버헤드가 훨씬 적다.',
      '안정성: 한 스레드의 장애(메모리 오염 등)는 전체 프로세스에 영향을 주지만, 프로세스는 상호 독립적이다.'
    ],
    qna: [
      { q: '멀티 프로세스 대신 멀티 스레드를 사용하는 이유는?', a: '자원의 중복 생성을 줄여 시스템 메모리를 절약하고, 컨텍스트 스위칭 오버헤드를 낮추며 응답성을 높이기 위함입니다.' }
    ]
  },
  {
    id: 2,
    subject: '네트워크',
    topic: 'TCP 3-Way Handshake vs 4-Way Handshake',
    summary: 'TCP 연결 수립 시 3-Way Handshake(SYN -> SYN+ACK -> ACK)를 거치고, 연결 종료 시 4-Way Handshake(FIN -> ACK -> FIN -> ACK)를 진행한다.',
    details: [
      '왜 종료는 4단계인가? Client가 연결을 끊으려 해도 Server 측에서 아직 전송하지 못한 잔여 데이터 처리가 남아있을 수 있기 때문(Half-Close 지원).',
      'TIME_WAIT 소켓: Client는 마지막 ACK 전송 후 일정 시간(2MSL) 동안 소켓을 유지하여 패킷 유실 재전송 대비 및 지연 패킷 혼선 방지.'
    ],
    qna: [
      { q: 'TCP와 UDP의 헤더 크기 및 차이는?', a: 'TCP 헤더는 20~60바이트로 신뢰성/흐름제어 필드가 포함되며, UDP는 8바이트 고정으로 오버헤드가 적고 전송 속도가 빠릅니다.' }
    ]
  }
];

const initialLangItems = [
  {
    id: 1,
    type: 'OPIc AL Script',
    title: 'Technology & Everyday Habits',
    script: "Personally, staying organized is crucial for my daily productivity. As a software developer, I actively document all my troubleshooting logs and architectural insights on my personal knowledge repository. Whenever I encounter a tricky bug, writing down the root cause and solutions helps me retain knowledge much longer.",
    korean: "개인적으로 매일의 생산성을 유지하는 데 정리는 매우 중요합니다. 소프트웨어 개발자로서 문제 해결 로그와 아키텍처 인사이트를 개인 지식 저장소에 적극적으로 기록합니다. 까다로운 버그를 마주할 때마다 원인과 해결책을 적어두는 것이 지식을 훨씬 오래 기억하게 해줍니다."
  },
  {
    id: 2,
    type: 'Tech Expression',
    title: 'Code Review & Pull Requests',
    script: "I have refactored the database query to eliminate the N+1 problem by introducing batch fetching. Could you please take a look and review the performance benchmark attached below?",
    korean: "배치 조회를 도입하여 N+1 문제를 제거하도록 데이터베이스 쿼리를 리팩토링했습니다. 아래 첨부된 성능 벤치마크 결과를 확인해주실 수 있을까요?"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('algo');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [expandedCs, setExpandedCs] = useState({ 1: true });

  // Load / Store LocalStorage
  const [algoList, setAlgoList] = useState(() => {
    const saved = localStorage.getItem('study_algo');
    return saved ? JSON.parse(saved) : initialAlgoProblems;
  });
  const [certList, setCertList] = useState(() => {
    const saved = localStorage.getItem('study_cert');
    return saved ? JSON.parse(saved) : initialCertCards;
  });
  const [csList, setCsList] = useState(() => {
    const saved = localStorage.getItem('study_cs');
    return saved ? JSON.parse(saved) : initialCsTopics;
  });
  const [langList, setLangList] = useState(() => {
    const saved = localStorage.getItem('study_lang');
    return saved ? JSON.parse(saved) : initialLangItems;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('브라우저가 TTS 음성 출력을 지원하지 않습니다.');
    }
  };

  const toggleCard = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCs = (id) => {
    setExpandedCs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeTab === 'algo') {
      const item = {
        id: Date.now(),
        title: newTitle,
        platform: newCategory || 'Practice',
        difficulty: 'Custom',
        category: 'Algorithm',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: newContent,
        code: '// Write your code here',
        retrospective: '핵심 배운 점을 기록하세요.'
      };
      const updated = [item, ...algoList];
      setAlgoList(updated);
      localStorage.setItem('study_algo', JSON.stringify(updated));
    } else if (activeTab === 'cert') {
      const item = {
        id: Date.now(),
        exam: newCategory || '자격증',
        category: '핵심 요약',
        question: newTitle,
        answer: newContent,
        level: '자체 추가'
      };
      const updated = [item, ...certList];
      setCertList(updated);
      localStorage.setItem('study_cert', JSON.stringify(updated));
    } else if (activeTab === 'cs') {
      const item = {
        id: Date.now(),
        subject: newCategory || 'CS',
        topic: newTitle,
        summary: newContent,
        details: ['상세 원리 분석'],
        qna: []
      };
      const updated = [item, ...csList];
      setCsList(updated);
      localStorage.setItem('study_cs', JSON.stringify(updated));
    } else {
      const item = {
        id: Date.now(),
        type: newCategory || 'English Expression',
        title: newTitle,
        script: newContent,
        korean: '번역 및 해설을 추가하세요.'
      };
      const updated = [item, ...langList];
      setLangList(updated);
      localStorage.setItem('study_lang', JSON.stringify(updated));
    }

    setNewTitle('');
    setNewCategory('');
    setNewContent('');
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">DevArchive</span>
              <span className="text-xs text-sky-400 ml-2 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 hidden sm:inline">
                Personal Knowledge Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="지식 검색..."
                className="pl-9 pr-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-36 sm:w-60"
              />
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">새 노트</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Nav Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-2">
          {[
            { id: 'algo', label: '알고리즘', icon: Code2, count: algoList.length },
            { id: 'cert', label: '자격증 (플래시카드)', icon: Award, count: certList.length },
            { id: 'cs', label: '컴퓨터 사이언스', icon: Cpu, count: csList.length },
            { id: 'lang', label: '어학 & 표현 (TTS)', icon: Languages, count: langList.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${isActive ? 'bg-sky-400/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* Tab 1: Algorithm */}
        {activeTab === 'algo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">알고리즘 문제 풀이 & 회고</h2>
                <p className="text-sm text-slate-400">SWEA, 백준, 프로그래머스 풀이 코드와 복잡도, 오답 원인 분석</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {algoList
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((algo) => (
                  <div key={algo.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                          {algo.platform}
                        </span>
                        <h3 className="font-bold text-slate-100 text-base">{algo.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>시간: <strong className="text-slate-200">{algo.timeComplexity}</strong></span>
                        <span>공간: <strong className="text-slate-200">{algo.spaceComplexity}</strong></span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{algo.category}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 mb-4">{algo.summary}</p>

                    <div className="relative mb-4">
                      <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 text-xs text-slate-400 rounded-t-lg border-x border-t border-slate-800">
                        <span>Java Solution</span>
                        <button
                          onClick={() => handleCopy(algo.id, algo.code)}
                          className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                        >
                          {copiedId === algo.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">복사 완료</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>코드 복사</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                        <code>{algo.code}</code>
                      </pre>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300/90">
                      <strong className="text-amber-400 font-semibold block mb-0.5">회고 및 핵심 포인트</strong>
                      {algo.retrospective}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 2: Certifications */}
        {activeTab === 'cert' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">자격증 핵심 암기 & 플래시카드</h2>
              <p className="text-sm text-slate-400">정보처리기사, SQLD 빈출 키워드 클릭 시 정답 확인</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certList
                .filter((item) =>
                  item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cert) => {
                  const isFlipped = flippedCards[cert.id];
                  return (
                    <div
                      key={cert.id}
                      onClick={() => toggleCard(cert.id)}
                      className={`cursor-pointer rounded-xl p-5 border transition-all duration-200 min-h-[190px] flex flex-col justify-between ${
                        isFlipped
                          ? 'bg-sky-950/40 border-sky-500/40 shadow-lg shadow-sky-950/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3 text-xs">
                          <span className="font-semibold text-sky-400">{cert.exam} · {cert.category}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center gap-1">
                            <RotateCw className="w-3 h-3" />
                            {isFlipped ? '정답' : '질문'}
                          </span>
                        </div>
                        <div className="text-sm font-medium leading-snug">
                          {isFlipped ? (
                            <p className="text-emerald-300 font-mono text-sm leading-relaxed">{cert.answer}</p>
                          ) : (
                            <p className="text-slate-100">{cert.question}</p>
                          )}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                        <span>난이도: {cert.level}</span>
                        <span>클릭하여 {isFlipped ? '질문 보기' : '정답 확인'}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 3: CS Knowledge */}
        {activeTab === 'cs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">컴퓨터 사이언스 & 면접 대비</h2>
              <p className="text-sm text-slate-400">운영체제, 네트워크, 데이터베이스 기본 원리와 면접 예상 질문</p>
            </div>

            <div className="space-y-4">
              {csList
                .filter((item) =>
                  item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.subject.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cs) => {
                  const isOpen = expandedCs[cs.id];
                  return (
                    <div key={cs.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div
                        onClick={() => toggleCs(cs.id)}
                        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            {cs.subject}
                          </span>
                          <h3 className="font-bold text-slate-100 text-base">{cs.topic}</h3>
                        </div>
                        <div className="text-slate-400">
                          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-800 text-sm space-y-4">
                          <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                            {cs.summary}
                          </p>
                          <ul className="space-y-1.5 list-disc list-inside text-slate-400 text-xs sm:text-sm">
                            {cs.details.map((detail, idx) => (
                              <li key={idx} className="leading-relaxed">{detail}</li>
                            ))}
                          </ul>

                          {cs.qna && cs.qna.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block">면접 꼬리질문 & 예시 답변</span>
                              {cs.qna.map((qa, qidx) => (
                                <div key={qidx} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                  <div className="font-semibold text-slate-200 text-xs sm:text-sm mb-1">Q. {qa.q}</div>
                                  <div className="text-slate-400 text-xs sm:text-sm">A. {qa.a}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 4: Language */}
        {activeTab === 'lang' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">어학 & 실무 영문 표현</h2>
              <p className="text-sm text-slate-400">OPIc / TOEIC Speaking 및 GitHub PR, 이슈 등록 시 활용하는 영어 템플릿</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {langList
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.script.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((lang) => (
                  <div key={lang.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          {lang.type}
                        </span>
                        <button
                          onClick={() => handleSpeak(lang.script)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-sky-400 hover:bg-slate-700 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>발음 듣기</span>
                        </button>
                      </div>
                      <h3 className="font-bold text-slate-100 text-base mb-2">{lang.title}</h3>
                      <p className="text-sm text-sky-200/90 font-mono leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 mb-3">
                        "{lang.script}"
                      </p>
                    </div>
                    <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
                      <strong>해석:</strong> {lang.korean}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: New Note */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {activeTab === 'algo' && '새 알고리즘 문제 추가'}
              {activeTab === 'cert' && '새 자격증 암기 카드 추가'}
              {activeTab === 'cs' && '새 CS 토픽 추가'}
              {activeTab === 'lang' && '새 어학 스크립트 추가'}
            </h3>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">제목 / 문제명 / 질문</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 백준 1920 - 수 찾기"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">분류 / 카테고리</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="예: 이분 탐색, 정보처리기사, OS 등"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">상세 내용 / 정답 / 본문</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="상세 설명이나 코드를 입력하세요."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500 font-mono text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 DevArchive. All learning logs are stored in your local browser session.</p>
      </footer>
    </div>
  );
}
