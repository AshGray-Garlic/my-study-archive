import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Award,
  Cpu,
  Languages,
  LayoutDashboard,
  Search,
  Plus,
  Bookmark,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Volume2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Flame,
  BookOpen,
  Filter,
  Tag,
  Trash2,
  Zap,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Layers,
  FileText
} from 'lucide-react';

const INITIAL_DATA = {
  algorithms: [
    {
      id: 'algo-1',
      title: '미로 탐색 (BFS 최단 경로)',
      platform: 'Baekjoon',
      problemNumber: '2178',
      difficulty: 'Silver I',
      tags: ['BFS', '그래프 탐색', '최단거리'],
      timeComplexity: 'O(N × M)',
      spaceComplexity: 'O(N × M)',
      status: 'Solved',
      reviewNeeded: false,
      summary: 'NxM 크기의 배열로 표현되는 미로에서 (1,1)부터 (N,M)까지 이동할 때 지나야 하는 최소의 칸 수를 구하는 문제.',
      keyPoint: '가중치가 없는 그래프에서 최단 거리는 DFS가 아닌 BFS를 사용해야 함. 큐(Queue)에 넣는 즉시 방문 처리를 해야 중복 큐 삽입 방지.',
      codeLanguage: 'java',
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
            int x = cur[0], y = cur[1];

            if (x == N - 1 && y == M - 1) return map[x][y];

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && ny >= 0 && nx < N && ny < M && map[nx][ny] == 1) {
                    map[nx][ny] = map[x][y] + 1; // 거리 누적
                    q.offer(new int[]{nx, ny});
                }
            }
        }
        return -1;
    }
}`,
      retrospective: '처음 풀었을 때 큐에서 꺼낼 때 방문처리를 하여 메모리 초과(Memory Limit Exceeded) 발생. 큐에 push하는 시점에 방문 마킹 필수!'
    },
    {
      id: 'algo-2',
      title: '보급로 (Dijkstra vs BFS)',
      platform: 'SWEA',
      problemNumber: '1249',
      difficulty: 'D4',
      tags: ['다익스트라', 'PriorityQueue', 'BFS'],
      timeComplexity: 'O(E log V) = O(4N² log N²)',
      spaceComplexity: 'O(N²)',
      status: 'Solved',
      reviewNeeded: true,
      summary: '파손된 도로의 복구 시간이 각각 주어졌을 때, 출발지 (0,0)에서 목적지 (N-1,N-1)까지 최소 복구 시간의 경로를 찾는 문제.',
      keyPoint: '간선의 가중치(복구 시간)가 0 이상이므로 우선순위 큐를 이용한 다익스트라(Dijkstra) 또는 0-1 BFS로 접근하면 효율적.',
      codeLanguage: 'python',
      code: `import heapq
import sys

def solve():
    N = int(sys.stdin.readline())
    grid = [list(map(int, list(sys.stdin.readline().strip()))) for _ in range(N)]
    dist = [[float('inf')] * N for _ in range(N)]
    
    pq = []
    heapq.heappush(pq, (0, 0, 0)) # cost, x, y
    dist[0][0] = 0
    dx = [-1, 1, 0, 0]
    dy = [0, 0, -1, 1]

    while pq:
        cost, x, y = heapq.heappop(pq)
        
        if cost > dist[x][y]:
            continue
        if x == N - 1 and y == N - 1:
            return cost
            
        for i in range(4):
            nx, ny = x + dx[i], y + dy[i]
            if 0 <= nx < N and 0 <= ny < N:
                next_cost = cost + grid[nx][ny]
                if next_cost < dist[nx][ny]:
                    dist[nx][ny] = next_cost
                    heapq.heappush(pq, (next_cost, nx, ny))

    return dist[N-1][N-1]`,
      retrospective: '단순 BFS를 쓰면 최소 거리를 갱신하기 위해 큐를 불필요하게 여러 번 순회함. PQ를 사용해 비용이 적은 노드를 우선 탐색하는 그리디 전략 채택.'
    },
    {
      id: 'algo-3',
      title: '정수 삼각형 (Dynamic Programming)',
      platform: 'Programmers',
      problemNumber: '43105',
      difficulty: 'Level 3',
      tags: ['DP', '메모이제이션'],
      timeComplexity: 'O(N²)',
      spaceComplexity: 'O(1) in-place',
      status: 'Solved',
      reviewNeeded: false,
      summary: '삼각형의 꼭대기에서 바닥까지 이어지는 경로 중, 거쳐간 숫자의 합이 가장 큰 경우를 찾는 문제.',
      keyPoint: '바닥(Bottom)에서 꼭대기(Top)로 역방향 누적합을 구하면 상단 경계조건(양 끝 점 분기) 처리를 깔끔하게 1줄로 해결 가능.',
      codeLanguage: 'cpp',
      code: `#include <vector>
#include <algorithm>
using namespace std;

int solution(vector<vector<int>> triangle) {
    int height = triangle.size();
    
    // 바닥부터 역방향으로 올라가며 최대값 선택
    for (int i = height - 2; i >= 0; i--) {
        for (int j = 0; j <= i; j++) {
            triangle[i][j] += max(triangle[i + 1][j], triangle[i + 1][j + 1]);
        }
    }
    
    return triangle[0][0];
}`,
      retrospective: 'Top-Down으로 풀면 index = 0일 때와 index = i일 때 if-else 조건문이 복잡해짐. Bottom-Up 역발상이 핵심 포인트.'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: '정보처리기사 (Engineer Information Processing)',
      targetDate: '2026-10-18',
      dDay: 26,
      progress: 78,
      status: 'In Progress',
      subject: '소프트웨어 구축 및 DB',
      notes: [
        '결합도(Coupling) 낮은 순서: 자료(Data) < 스탬프(Stamp) < 제어(Control) < 외부(External) < 공통(Common) < 내용(Content)',
        '응집도(Cohesion) 높은 순서: 기능(Functional) > 순차(Sequential) > 통신(Communicational) > 절차(Procedural) > 시간(Temporal) > 논리(Logical) > 우연(Coincidental)',
        '디자인 패턴 생성: 추상팩토리, 빌더, 팩토리메서드, 프로토타입, 싱글톤 (생/구/행 구분 암기 필수)'
      ],
      flashcards: [
        {
          q: '모듈 내부 요소들이 하나의 단일 기능을 수행하도록 잘 뭉쳐있는 가장 이상적인 응집도는?',
          a: '기능적 응집도 (Functional Cohesion)',
          topic: 'SW 설계'
        },
        {
          q: '외부의 두 모듈이 공통 데이터 영역(전역 변수)을 함께 참조할 때의 결합도는?',
          a: '공통 결합도 (Common Coupling)',
          topic: 'SW 설계'
        },
        {
          q: '정규화 과정에서 제1정규형(1NF)을 만족하기 위한 조건은?',
          a: '도메인이 원자값(Atomic Value)으로만 구성되어야 한다.',
          topic: '데이터베이스'
        },
        {
          q: '제2정규형(2NF)에서 제3정규형(3NF)으로 갈 때 제거해야 하는 종속성은?',
          a: '이행적 함수 종속 (Transitive Functional Dependency, X -> Y, Y -> Z)',
          topic: '데이터베이스'
        }
      ]
    },
    {
      id: 'cert-2',
      title: 'SQLD (SQL 개발자)',
      targetDate: '2026-11-29',
      dDay: 68,
      progress: 45,
      status: 'Scheduled',
      subject: 'SQL 기본 및 활용',
      notes: [
        'NULL의 사칙연산 결과는 항상 NULL, 조건절에서 NULL 비교는 IS NULL / IS NOT NULL 사용',
        'COUNT(*)은 NULL 포함 카운트, COUNT(컬럼명)은 NULL 제외 카운트',
        'ROLLUP은 계층적 소계 계산, CUBE는 결합 가능한 모든 조합의 다차원 집계 생성'
      ],
      flashcards: [
        {
          q: '윈도우 함수에서 동일한 순위에 대해 1등, 1등, 3등 형태로 순위를 부여하는 함수는?',
          a: 'RANK() (동일 순위 다음을 건너뜀 / DENSE_RANK()는 1, 1, 2)',
          topic: 'SQL 활용'
        },
        {
          q: 'DELETE와 TRUNCATE의 핵심적인 트랜잭션 처리 차이는?',
          a: 'DELETE는 DML로 Rollback 가능 및 Undo 로그 기록 / TRUNCATE는 DDL로 자동 Commit되어 빠른 삭제 및 Rollback 불가',
          topic: 'SQL 기본'
        }
      ]
    }
  ],
  csTopics: [
    {
      id: 'cs-1',
      domain: 'Operating System',
      title: '프로세스와 스레드의 차이',
      importance: 'Must Know (★ 5.0)',
      concept: '프로세스는 운영체제로부터 시스템 자원을 할당받는 독립적인 실행 단위이며, 스레드는 프로세스 내에서 실행 흐름의 최소 단위이다.',
      comparison: {
        title: 'Process vs Thread 비교 분석',
        headers: ['구분', '프로세스 (Process)', '스레드 (Thread)'],
        rows: [
          ['메모리 구조', 'Code, Data, Heap, Stack 각각 독립 할당', 'Code, Data, Heap 공유, Stack만 독립'],
          ['Context Switch', 'PCB 전환으로 인한 오버헤드가 상대적으로 큼', 'TCB 전환, 캐시 메모리 초기화 필요 없어 빠름'],
          ['자원 공유/통신', 'IPC (파이프, 소켓, 공유메모리) 필요', '동일 프로세스 내 힙/데이터 영역 직접 공유'],
          ['안정성', '하나의 프로세스 장애가 다른 프로세스에 미전파', '하나의 스레드 오류가 프로세스 전체를 다운시킬 수 있음']
        ]
      },
      interviewQA: [
        {
          q: '멀티 프로세스 대신 멀티 스레드를 사용하는 주요 이유는 무엇인가요?',
          a: '자원의 효율성과 Context Switching 비용 절감입니다. 스레드는 힙(Heap)과 정적 데이터 영역을 공유하므로 통신(IPC) 비용이 적고 캐시 적중률(Cache Hit)이 높아 반응 속도가 월등히 빠릅니다.'
        },
        {
          q: '스레드 간 메모리 공유로 인해 발생하는 문제와 해결책은 무엇인가요?',
          a: '동시성 이슈(Race Condition)와 데드락(Deadlock)이 발생할 수 있습니다. 이를 막기 위해 뮤텍스(Mutex), 세마포어(Semaphore), synchronized 키워드 등을 활용한 임계영역(Critical Section) 상호 배제를 적용합니다.'
        }
      ]
    },
    {
      id: 'cs-2',
      domain: 'Network',
      title: 'TCP vs UDP 및 3-Way Handshake',
      importance: 'Must Know (★ 5.0)',
      concept: '전송 계층(Transport Layer)의 양대 프로토콜. 신뢰성이 보장되는 연결 지향형 TCP와 속도 중심의 비연결형 UDP.',
      comparison: {
        title: 'TCP vs UDP 특성 비교',
        headers: ['항목', 'TCP (Transmission Control Protocol)', 'UDP (User Datagram Protocol)'],
        rows: [
          ['연결 방식', '가상 회선 연결 (3-Way Handshake)', '비연결형 (독립적인 패킷 전송)'],
          ['신뢰성', '높음 (시퀀스 번호, ACK, 재전송 보장)', '낮음 (흐름/혼잡 제어 없음, 유실 가능)'],
          ['속도', '헤더 크기 크고 패킷 검증으로 느림', '오버헤드 최소화로 실시간 전송에 적합'],
          ['적용 사례', 'HTTP/HTTPS, FTP, 이메일(SMTP)', '실시간 스트리밍, 온라인 게임, DNS, VoIP']
        ]
      },
      interviewQA: [
        {
          q: 'TCP 3-Way Handshake 절차와 목적을 설명해주세요.',
          a: '클라이언트와 서버가 통신을 시작하기 전 양방향 신뢰 회선을 확립하고 시퀀스 번호(ISN)를 동기화하는 절차입니다. [SYN] -> [SYN + ACK] -> [ACK] 3단계로 진행됩니다.'
        },
        {
          q: '연결 해제 시 4-Way Handshake에서 TIME_WAIT 상태가 필요한 이유는?',
          a: '마지막 전송된 ACK 패킷이 네트워크 지연으로 유실되었을 때를 대비하고, 지연 도착한 잔여 패킷이 새로 열린 동일 포트 소켓으로 잘못 유입되는 혼선을 방지하기 위함입니다.'
        }
      ]
    },
    {
      id: 'cs-3',
      domain: 'Database',
      title: 'B-Tree vs B+Tree 인덱스 구조',
      importance: 'High (★ 4.5)',
      concept: '관계형 데이터베이스(MySQL InnoDB 등)의 인덱스는 디스크 I/O를 최소화하기 위해 다진 검색 트리인 B+Tree를 채택합니다.',
      comparison: {
        title: 'B-Tree vs B+Tree 구조 비교',
        headers: ['항목', 'B-Tree', 'B+Tree'],
        rows: [
          ['데이터 저장 위치', '모든 노드(루트, 브랜치, 리프)에 키와 데이터 저장', '오직 리프(Leaf) 노드에만 실제 데이터/포인터 저장'],
          ['리프 노드 연결', '독립적 (형제 노드 간 연결 없음)', '리프 노드들이 양방향 연결 리스트(LinkedList)로 연결'],
          ['범위 검색 (Range Scan)', '트리 순회를 반복해야 하므로 비효율적', '리프 노드 선형 탐색만으로 매우 신속하게 수행']
        ]
      },
      interviewQA: [
        {
          q: '인덱스 컬럼에 함수를 적용하거나 가공(e.g. WHERE SUBSTR(name, 1, 3) = "kim")하면 왜 인덱스를 타지 못하나요?',
          a: 'B+Tree 인덱스는 가공되지 않은 원래 컬럼 값 기준으로 정렬되어 있습니다. 컬럼 값을 변형하면 정렬 순서가 훼손되므로 인덱스를 스캔할 수 없고 풀 테이블 스캔(Full Table Scan)이 발생합니다.'
        }
      ]
    }
  ],
  languages: [
    {
      id: 'lang-1',
      category: 'OPIc (AL 목표)',
      title: '프로젝트 트러블슈팅 & 협업 갈등 해결',
      situation: '과거 개발 프로젝트 중 겪었던 예상치 못한 기술적 문제와 팀원 간 협의 과정 묘사',
      dialogue: [
        {
          speaker: 'Role Play',
          en: 'During my final capstone project, our team faced a critical bottleneck with database latency just two weeks before deployment.',
          ko: '졸업 캡스톤 프로젝트 당시 배포 2주 전에 데이터베이스 지연 시간으로 인한 심각한 병목 현상을 겪었습니다.'
        },
        {
          speaker: 'Role Play',
          en: 'To tackle this issue, I organized an emergency retrospective meeting and suggested introducing Redis caching for frequently accessed read queries.',
          ko: '이 문제를 해결하기 위해 긴급 회고 회의를 열고 자주 조회되는 읽기 쿼리에 Redis 캐싱을 도입할 것을 제안했습니다.'
        },
        {
          speaker: 'Role Play',
          en: 'As a result, we managed to reduce the average response time by nearly 65%, successfully delivering the platform on schedule.',
          ko: '결과적으로 평균 응답 속도를 약 65% 단축할 수 있었고, 기한 내에 성공적으로 플랫폼을 배포했습니다.'
        }
      ],
      templates: [
        { en: 'We found ourselves in a tight corner when...', ko: '~한 상황이 발생했을 때 우리는 궁지에 몰렸었습니다.' },
        { en: 'After weighing the pros and cons, we decided to...', ko: '장단점을 신중히 저울질한 끝에, 우리는 ~하기로 결정했습니다.' },
        { en: 'This experience taught me the paramount importance of...', ko: '이 경험은 저에게 ~의 지대한 중요성을 깨닫게 해주었습니다.' }
      ]
    },
    {
      id: 'lang-2',
      category: 'Tech English',
      title: '코드 리뷰 및 풀 리퀘스트(PR) 필수 영어 표현',
      situation: 'GitHub 협업 시 논리적이고 정중하게 개선안을 제시하는 표현 모음',
      dialogue: [
        {
          speaker: 'Reviewer',
          en: 'Could you please extract this nested loop into a helper function? It might improve readability and testability.',
          ko: '이 중첩 반복문을 별도의 헬퍼 함수로 분리해주실 수 있나요? 가독성과 테스트 용이성이 향상될 것 같습니다.'
        },
        {
          speaker: 'Author',
          en: 'Good catch! I totally agree. I will refactor the logic and push an updated commit right away.',
          ko: '좋은 지적 감사합니다! 완전히 동의합니다. 로직을 리팩터링해서 곧바로 수정 커밋을 푸시하겠습니다.'
        }
      ],
      templates: [
        { en: 'I am concerned about potential race conditions in...', ko: '~에서 발생할 수 있는 동시성 이슈(경쟁 상태)가 우려됩니다.' },
        { en: 'Have you considered using a hash map to achieve O(1) lookup?', ko: 'O(1) 조회를 위해 해시 맵을 사용하는 방안을 고려해보셨나요?' },
        { en: 'LGTM! (Looks Good To Me) Minor comment left inline.', ko: '좋아 보입니다! 인라인에 사소한 코멘트 하나 남겼습니다.' }
      ]
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  // Stored state with local storage persistence
  const [algoList, setAlgoList] = useState(() => {
    const saved = localStorage.getItem('study_algo_list');
    return saved ? JSON.parse(saved) : INITIAL_DATA.algorithms;
  });
  const [certList, setCertList] = useState(() => {
    const saved = localStorage.getItem('study_cert_list');
    return saved ? JSON.parse(saved) : INITIAL_DATA.certifications;
  });
  const [csList, setCsList] = useState(() => {
    const saved = localStorage.getItem('study_cs_list');
    return saved ? JSON.parse(saved) : INITIAL_DATA.csTopics;
  });
  const [langList, setLangList] = useState(() => {
    const saved = localStorage.getItem('study_lang_list');
    return saved ? JSON.parse(saved) : INITIAL_DATA.languages;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('study_algo_list', JSON.stringify(algoList));
  }, [algoList]);
  useEffect(() => {
    localStorage.setItem('study_cert_list', JSON.stringify(certList));
  }, [certList]);
  useEffect(() => {
    localStorage.setItem('study_cs_list', JSON.stringify(csList));
  }, [csList]);
  useEffect(() => {
    localStorage.setItem('study_lang_list', JSON.stringify(langList));
  }, [langList]);

  // Flashcard mode state for Certifications
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New Note Modal state
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

  // Copied code status
  const [copiedId, setCopiedId] = useState(null);

  // Text-To-Speech
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

  // Aggregated flashcard collection
  const allFlashcards = useMemo(() => {
    const cards = [];
    certList.forEach((c) => {
      if (c.flashcards) {
        c.flashcards.forEach((fc) => {
          cards.push({ ...fc, certName: c.title });
        });
      }
    });
    return cards;
  }, [certList]);

  // All distinct tags for algorithms
  const allAlgoTags = useMemo(() => {
    const set = new Set(['ALL']);
    algoList.forEach((item) => item.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [algoList]);

  // Handle Note Submission
  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteData.title.trim()) return;

    const tagArray = newNoteData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

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
        reviewNeeded: true,
        summary: newNoteData.summary || '학습한 문제 요약 내용입니다.',
        keyPoint: newNoteData.keyPoint || '핵심 아이디어 및 고려할 예외 조건.',
        codeLanguage: 'java',
        code: newNoteData.code || '// 풀이 코드를 입력하세요\npublic class Solution {\n}',
        retrospective: '새로 추가된 학습 기록입니다.'
      };
      setAlgoList([newAlgo, ...algoList]);
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
      setCsList([newCs, ...csList]);
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
      setLangList([newLang, ...langList]);
      setActiveTab('language');
    }

    // Reset and close
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

  const filteredAlgorithms = useMemo(() => {
    return algoList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        item.concept.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [csList, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar for Desktop / Header for Mobile */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
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

          {/* Quick Action: New Note Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mb-6 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>새 학습 기록 작성</span>
          </button>

          {/* Main Navigation Menu */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                activeTab === 'algo'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                activeTab === 'cert'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                activeTab === 'cs'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                activeTab === 'language'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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

        {/* User Study Motivation Card */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-900/40">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>연속 학습 14일 달성 중!</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            "지식은 작성할 때 비로소 내 것이 된다."
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>이번 주 풀이: 8문제</span>
            <span className="text-emerald-400 font-semibold">+15%</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Global Top Search Bar */}
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
            <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>2026 하반기 목표</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 md:p-8 space-y-8 flex-1">
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Welcome Banner */}
              <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-800/40 relative overflow-hidden">
                <div className="max-w-2xl relative z-10">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Personal Learning Archive
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mt-3 mb-2">
                    환영합니다, 엔지니어님! 🚀
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    알고리즘 문제 풀이, 정보처리기사 & SQLD 자격증 로드맵, 핵심 CS 면접 지식, 그리고 OPIc/어학 스크립트를 체계적으로 누적 관리하세요.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('algo')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 border border-slate-700 transition"
                    >
                      알고리즘 최근 풀이 보기 →
                    </button>
                    <button
                      onClick={() => {
                        setFlashcardOpen(true);
                        setCurrentCardIndex(0);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-medium rounded-lg text-white transition shadow"
                    >
                      자격증 키워드 복습하기
                    </button>
                  </div>
                </div>
              </div>

              {/* Top KPI Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">해결한 문제</span>
                    <Code2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{algoList.length} <span className="text-xs text-slate-400 font-sans font-normal">문제</span></div>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> SWEA, 백준, 프로그래머스
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">자격증 목표</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">D-26 <span className="text-xs text-slate-400 font-sans font-normal">정처기</span></div>
                  <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 2026-10-18 시험 예정
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">CS 면접 토픽</span>
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{csList.length} <span className="text-xs text-slate-400 font-sans font-normal">주제</span></div>
                  <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> OS, Network, DB
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">스피킹 템플릿</span>
                    <Languages className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{langList.length} <span className="text-xs text-slate-400 font-sans font-normal">세트</span></div>
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> 음성 발음 연습 지원
                  </p>
                </div>
              </div>

              {/* 4 Category Quick Launch Cards */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  분야별 학습 서랍장 바로가기
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Category 1 */}
                  <div
                    onClick={() => setActiveTab('algo')}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-emerald-400 flex items-center gap-1 transition">
                        이동하기 <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mb-1">알고리즘 (Algorithm)</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      백준, SWEA, 프로그래머스 문제 풀이, 시간 복잡도 분석, 오답 회고 및 코드 뷰어.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">BFS/DFS</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">다익스트라</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">DP</span>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div
                    onClick={() => setActiveTab('cert')}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-amber-400 flex items-center gap-1 transition">
                        이동하기 <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mb-1">자격증 (Certification)</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      정보처리기사 및 SQLD 핵심 암기 요약, 기출 핵심 개념 및 플래시카드 퀴즈.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-amber-300">정처기 D-26</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">SQLD D-68</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">플래시카드</span>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div
                    onClick={() => setActiveTab('cs')}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-blue-400 flex items-center gap-1 transition">
                        이동하기 <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mb-1">컴퓨터 사이언스 (CS)</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      운영체제, 네트워크, 데이터베이스 비교 분석 표와 개발자 기술 면접 예상 질문.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Process vs Thread</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">TCP Handshake</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">B+Tree</span>
                    </div>
                  </div>

                  {/* Category 4 */}
                  <div
                    onClick={() => setActiveTab('language')}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                        <Languages className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-rose-400 flex items-center gap-1 transition">
                        이동하기 <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mb-1">어학 및 테크 영어 (Language)</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      OPIc 서베이 롤플레이 스크립트, GitHub 코드리뷰 표현, 음성 리딩 연습.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">OPIc AL 대비</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">PR 템플릿</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">TTS 음성 재생</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Study Feed */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                  <span>최근 업데이트된 핵심 풀이</span>
                  <span className="text-xs text-slate-500 font-normal">자동 동기화 중</span>
                </h3>
                <div className="divide-y divide-slate-800/70">
                  {algoList.slice(0, 3).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.platform} #{item.problemNumber}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{item.title}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.keyPoint}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{item.timeComplexity}</span>
                        <button
                          onClick={() => setActiveTab('algo')}
                          className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        >
                          코드 보기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALGORITHM SECTION */}
          {activeTab === 'algo' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Code2 className="w-6 h-6 text-emerald-400" />
                    알고리즘 아카이브 (Algorithm Log)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    플랫폼별 오답 회고, 시간/공간 복잡도 검증 및 언어별 클린 코드 스니펫
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewNoteCategory('algo');
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition self-start shadow-md shadow-emerald-900/30"
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
                      selectedTag === tag
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Problem Cards List */}
              <div className="space-y-6">
                {filteredAlgorithms.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">해당 조건에 일치하는 알고리즘 기록이 없습니다.</p>
                  </div>
                ) : (
                  filteredAlgorithms.map((algo) => (
                    <div
                      key={algo.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition"
                    >
                      {/* Card Header */}
                      <div className="p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {algo.platform} #{algo.problemNumber}
                          </span>
                          <h3 className="text-base font-bold text-white">{algo.title}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {algo.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <div className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>시간: {algo.timeComplexity}</span>
                          </div>
                          <span className="text-slate-600">|</span>
                          <div className="flex items-center gap-1 font-mono">
                            <Layers className="w-3.5 h-3.5 text-blue-400" />
                            <span>공간: {algo.spaceComplexity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4">
                        {/* Summary & Key Point */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                            <span className="font-semibold text-slate-300 block mb-1">📌 문제 요약 & 접근 조건</span>
                            <p className="text-slate-400 leading-relaxed">{algo.summary}</p>
                          </div>
                          <div className="p-3.5 bg-indigo-950/20 rounded-xl border border-indigo-900/30">
                            <span className="font-semibold text-indigo-300 block mb-1">💡 핵심 알고리즘 아이디어</span>
                            <p className="text-slate-300 leading-relaxed">{algo.keyPoint}</p>
                          </div>
                        </div>

                        {/* Code Snippet Viewer with copy */}
                        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
                            <span className="font-mono uppercase font-semibold text-emerald-400">
                              {algo.codeLanguage || 'code'}
                            </span>
                            <button
                              onClick={() => handleCopy(algo.id, algo.code)}
                              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition"
                            >
                              {copiedId === algo.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">복사됨!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>코드 복사</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-64 leading-relaxed scrollbar-thin">
                            <code>{algo.code}</code>
                          </pre>
                        </div>

                        {/* Troubleshooting & Retrospective */}
                        {algo.retrospective && (
                          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs flex items-start gap-2.5">
                            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-amber-300 font-medium">오답 회고 & 실수 방지: </strong>
                              <span className="text-slate-300">{algo.retrospective}</span>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <Tag className="w-3.5 h-3.5 text-slate-500" />
                          {algo.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50"
                            >
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

          {/* TAB 3: CERTIFICATION SECTION */}
          {activeTab === 'cert' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Award className="w-6 h-6 text-amber-400" />
                    국가공인 & 자격증 로드맵 (Certification)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    정보처리기사, SQLD D-Day 카운터, 핵심 암기 공식 및 대화형 플래시카드 복습
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                    setFlashcardOpen(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition self-start shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>플래시카드 전체 풀기 ({allFlashcards.length}문항)</span>
                </button>
              </div>

              {/* Certifications Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certList.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            D-{cert.dDay}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1.5">{cert.title}</h3>
                          <p className="text-xs text-slate-400">시험일: {cert.targetDate} | 과목: {cert.subject}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-indigo-400 font-mono">{cert.progress}% 달성</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-5">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${cert.progress}%` }}
                        />
                      </div>

                      {/* Key Memorization Notes */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          필수 암기 요약 노트
                        </h4>
                        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                          {cert.notes.map((note, nIdx) => (
                            <div key={nIdx} className="flex items-start gap-2">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer with Flashcards count */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>수록 퀴즈: {cert.flashcards?.length || 0}문제</span>
                      <button
                        onClick={() => {
                          setCurrentCardIndex(0);
                          setIsFlipped(false);
                          setFlashcardOpen(true);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                      >
                        퀴즈 시작 <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CS (COMPUTER SCIENCE) SECTION */}
          {activeTab === 'cs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Cpu className="w-6 h-6 text-blue-400" />
                    컴퓨터 사이언스 & 기술 면접 (CS Theory)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    운영체제, 네트워크, DB 핵심 개념 비교 테이블 및 기술 면접 단골 꼬리질문 정리
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewNoteCategory('cs');
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition self-start shadow-md shadow-blue-900/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 CS 토픽 추가</span>
                </button>
              </div>

              {/* CS Cards List */}
              <div className="space-y-6">
                {filteredCs.map((cs) => (
                  <div key={cs.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                            {cs.domain}
                          </span>
                          <span className="text-xs text-amber-400">{cs.importance}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1.5">{cs.title}</h3>
                      </div>
                    </div>

                    {/* Concept Summary */}
                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/70 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-blue-300 block mb-1">📘 핵심 개념 정리</strong>
                      {cs.concept}
                    </div>

                    {/* Comparison Table if present */}
                    {cs.comparison && (
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
                        <div className="p-3 bg-slate-900/90 text-xs font-semibold text-slate-300 border-b border-slate-800">
                          📊 {cs.comparison.title}
                        </div>
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-medium">
                            <tr>
                              {cs.comparison.headers.map((h, idx) => (
                                <th key={idx} className="px-4 py-2.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {cs.comparison.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/50">
                                <td className="px-4 py-2.5 font-medium text-indigo-300">{row[0]}</td>
                                <td className="px-4 py-2.5">{row[1]}</td>
                                <td className="px-4 py-2.5">{row[2]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Interview Follow-up Q&A */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                        기술 면접 대비 꼬리 질문 (Follow-up QA)
                      </h4>
                      <div className="space-y-2.5">
                        {cs.interviewQA.map((qa, qIdx) => (
                          <div
                            key={qIdx}
                            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5"
                          >
                            <p className="font-semibold text-indigo-300">Q: {qa.q}</p>
                            <p className="text-slate-400 leading-relaxed">A: {qa.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LANGUAGE SECTION */}
          {activeTab === 'language' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Languages className="w-6 h-6 text-rose-400" />
                    어학 및 테크 영어 (Language & Speaking)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    OPIc AL 대비 상황별 롤플레이, 실무 GitHub PR 표현 & Web Speech 음성 듣기
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewNoteCategory('lang');
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition self-start shadow-md shadow-rose-900/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 영어 표현 추가</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {langList.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1.5">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.situation}</p>
                      </div>
                    </div>

                    {/* Dialogue with TTS Speech Audio buttons */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300">실전 발화 스크립트 (클릭 시 원어민 발음 재생)</h4>
                      <div className="space-y-2">
                        {item.dialogue.map((line, dIdx) => (
                          <div
                            key={dIdx}
                            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 group hover:border-slate-700 transition"
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-slate-200">{line.en}</p>
                              <p className="text-xs text-slate-500">{line.ko}</p>
                            </div>
                            <button
                              onClick={() => speakText(line.en)}
                              title="영어 음성 듣기"
                              className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition shrink-0"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sentence Patterns */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80">
                      <h4 className="text-xs font-bold text-slate-300 mb-2">⚡ 만능 문장 패턴 (Templates)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {item.templates.map((tpl, tIdx) => (
                          <div key={tIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60">
                            <p className="text-rose-300 font-mono font-medium">{tpl.en}</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{tpl.ko}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FLASHCARD MODAL (FOR CERTIFICATIONS / CS) */}
      {flashcardOpen && allFlashcards.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  자격증 & CS 암기 플래시카드
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  문제를 보고 정답을 떠올린 뒤 카드를 뒤집어 확인하세요.
                </p>
              </div>
              <button
                onClick={() => setFlashcardOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800"
              >
                닫기
              </button>
            </div>

            {/* Flashcard Card with Flip Effect */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[200px] bg-slate-950 border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition select-none"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {allFlashcards[currentCardIndex].certName} - {allFlashcards[currentCardIndex].topic}
                </span>
                <span className="text-amber-400 font-mono">
                  {currentCardIndex + 1} / {allFlashcards.length}
                </span>
              </div>

              <div className="py-6 text-center">
                {!isFlipped ? (
                  <div>
                    <span className="text-xs text-indigo-400 block mb-2 font-semibold">QUESTION (질문)</span>
                    <p className="text-base font-semibold text-slate-100 leading-relaxed">
                      {allFlashcards[currentCardIndex].q}
                    </p>
                    <span className="text-xs text-slate-500 block mt-4">클릭하여 정답 확인하기 👆</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-emerald-400 block mb-2 font-semibold">ANSWER (정답 및 해설)</span>
                    <p className="text-base font-bold text-emerald-300 leading-relaxed">
                      {allFlashcards[currentCardIndex].a}
                    </p>
                    <span className="text-xs text-slate-500 block mt-4">클릭하여 다시 질문 보기 ↺</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                Space 또는 카드를 클릭해 뒤집기
              </div>
            </div>

            {/* Card Navigation Controls */}
            <div className="flex items-center justify-between gap-3">
              <button
                disabled={currentCardIndex === 0}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((prev) => prev - 1);
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold rounded-xl text-slate-200 transition"
              >
                이전 문항
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl text-white transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                disabled={currentCardIndex === allFlashcards.length - 1}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((prev) => prev + 1);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-xl text-slate-950 transition"
              >
                다음 문항
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW NOTE MODAL (LOCALSTORAGE PERSISTED) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                새 학습 기록 작성
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                닫기
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">카테고리 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('algo')}
                    className={`py-2 rounded-xl font-medium border text-center transition ${
                      newNoteCategory === 'algo'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    알고리즘 (Algo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('cs')}
                    className={`py-2 rounded-xl font-medium border text-center transition ${
                      newNoteCategory === 'cs'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    컴퓨터 사이언스 (CS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNoteCategory('lang')}
                    className={`py-2 rounded-xl font-medium border text-center transition ${
                      newNoteCategory === 'lang'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    어학 (Language)
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">제목</label>
                <input
                  type="text"
                  required
                  placeholder={
                    newNoteCategory === 'algo'
                      ? '예: [백준 1920] 수 찾기 (이분 탐색)'
                      : newNoteCategory === 'cs'
                      ? '예: 가상 메모리와 페이징 기법'
                      : '예: OPIc 기술 트러블슈팅 답변'
                  }
                  value={newNoteData.title}
                  onChange={(e) => setNewNoteData({ ...newNoteData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Conditional Inputs */}
              {newNoteCategory === 'algo' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">플랫폼</label>
                    <select
                      value={newNoteData.platform}
                      onChange={(e) => setNewNoteData({ ...newNoteData, platform: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Baekjoon">백준 (Baekjoon)</option>
                      <option value="SWEA">SWEA</option>
                      <option value="Programmers">프로그래머스</option>
                      <option value="LeetCode">LeetCode</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">난이도</label>
                    <input
                      type="text"
                      placeholder="Silver II, D3, Level 2..."
                      value={newNoteData.difficulty}
                      onChange={(e) => setNewNoteData({ ...newNoteData, difficulty: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="DP, 이분탐색, 그래프, 면접빈출"
                  value={newNoteData.tags}
                  onChange={(e) => setNewNoteData({ ...newNoteData, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Summary / Concept */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">핵심 요약 & 문제 개요</label>
                <textarea
                  rows={2}
                  placeholder="어떤 문제였는지, 풀이의 핵심 접근법이 무엇인지 요약하세요."
                  value={newNoteData.summary}
                  onChange={(e) => setNewNoteData({ ...newNoteData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Code or Detail Notes */}
              {newNoteCategory === 'algo' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">정답 소스 코드</label>
                  <textarea
                    rows={5}
                    placeholder="Java, Python, C++ 정답 코드를 붙여넣으세요."
                    value={newNoteData.code}
                    onChange={(e) => setNewNoteData({ ...newNoteData, code: e.target.value })}
                    className="w-full font-mono bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition shadow-md"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}