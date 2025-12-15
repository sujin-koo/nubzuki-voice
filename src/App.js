import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// =============================================
// 샘플 데이터 (실제로는 서버에서 가져옴)
// =============================================
const samplePairs = [
  {
    id: 1,
    text: "안녕! 나는 KAIST의 마스코트 넙죽이야!",
    audio_a: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audio_b: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    model_a: "FaceTTS-v1",
    model_b: "FaceTTS-v2",
    image: `${process.env.PUBLIC_URL}/nubzuki-images/1.png`
  },
  {
    id: 2,
    text: "오늘도 열심히 공부하는 카이스티안 여러분, 화이팅!",
    audio_a: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    audio_b: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    model_a: "FaceTTS-v1",
    model_b: "FaceTTS-v2",
    image: `${process.env.PUBLIC_URL}/nubzuki-images/2.png`
  },
  {
    id: 3,
    text: "학식 먹으러 갈 사람~ 같이 가자!",
    audio_a: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    audio_b: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    model_a: "FaceTTS-v1",
    model_b: "FaceTTS-v2",
    image: `${process.env.PUBLIC_URL}/nubzuki-images/3.png`
  },
  {
    id: 4,
    text: "시험 기간이지만 너무 무리하지 마~",
    audio_a: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    audio_b: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    model_a: "FaceTTS-v1",
    model_b: "FaceTTS-v2",
    image: `${process.env.PUBLIC_URL}/nubzuki-images/4.png`
  },
  {
    id: 5,
    text: "대전 날씨가 좀 그렇지만... 힘내!",
    audio_a: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    audio_b: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    model_a: "FaceTTS-v1",
    model_b: "FaceTTS-v2",
    image: `${process.env.PUBLIC_URL}/nubzuki-images/5.png`
  }
];

// =============================================
// 넙죽이 SVG 컴포넌트
// =============================================
const NubzukiCharacter = ({ expression = 'default', className = '' }) => {
  const getEyeStyle = () => {
    switch(expression) {
      case 'happy': return { transform: 'scaleY(0.3)', transformOrigin: 'center' };
      case 'thinking': return { transform: 'translateY(-2px)' };
      case 'excited': return { transform: 'scale(1.2)', transformOrigin: 'center' };
      default: return {};
    }
  };

  return (
    <svg viewBox="0 0 200 200" className={className} style={{ width: '100%', height: '100%' }}>
      {/* 몸체 - 넙죽이 특유의 타원형 */}
      <ellipse cx="100" cy="110" rx="70" ry="55" fill="#F5DEB3" stroke="#8B7355" strokeWidth="3"/>
      
      {/* 얼굴 하이라이트 */}
      <ellipse cx="85" cy="100" rx="40" ry="30" fill="#FFF8DC" opacity="0.5"/>
      
      {/* 눈 */}
      <g style={getEyeStyle()}>
        <ellipse cx="75" cy="100" rx="8" ry="10" fill="#2C1810"/>
        <ellipse cx="125" cy="100" rx="8" ry="10" fill="#2C1810"/>
        {/* 눈 하이라이트 */}
        <circle cx="78" cy="96" r="3" fill="white"/>
        <circle cx="128" cy="96" r="3" fill="white"/>
      </g>
      
      {/* 볼터치 */}
      <ellipse cx="55" cy="115" rx="12" ry="8" fill="#FFB6C1" opacity="0.6"/>
      <ellipse cx="145" cy="115" rx="12" ry="8" fill="#FFB6C1" opacity="0.6"/>
      
      {/* 입 */}
      {expression === 'happy' || expression === 'excited' ? (
        <path d="M 85 125 Q 100 140 115 125" fill="none" stroke="#2C1810" strokeWidth="3" strokeLinecap="round"/>
      ) : (
        <ellipse cx="100" cy="128" rx="8" ry="5" fill="#2C1810"/>
      )}
      
      {/* 팔 */}
      <ellipse cx="35" cy="130" rx="15" ry="12" fill="#F5DEB3" stroke="#8B7355" strokeWidth="2"/>
      <ellipse cx="165" cy="130" rx="15" ry="12" fill="#F5DEB3" stroke="#8B7355" strokeWidth="2"/>
      
      {/* 다리 */}
      <ellipse cx="70" cy="165" rx="18" ry="12" fill="#F5DEB3" stroke="#8B7355" strokeWidth="2"/>
      <ellipse cx="130" cy="165" rx="18" ry="12" fill="#F5DEB3" stroke="#8B7355" strokeWidth="2"/>
    </svg>
  );
};

// =============================================
// 웨이브폼 컴포넌트
// =============================================
const Waveform = ({ isPlaying, color }) => {
  const [heights, setHeights] = useState(Array(20).fill(30));

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setHeights(Array(20).fill(0).map(() => 20 + Math.random() * 80));
      }, 100);
    } else {
      setHeights(Array(20).fill(30));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="waveform">
      {heights.map((height, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: `${height}%`,
            backgroundColor: color,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  );
};

// =============================================
// 오디오 카드 컴포넌트
// =============================================
const VoiceCard = ({ 
  label, 
  audioUrl, 
  isSelected, 
  onSelect, 
  isPlaying, 
  onPlay, 
  onStop,
  color,
  emoji
}) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      onStop();
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onStop]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`voice-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ '--card-color': color }}
    >
      {isSelected && (
        <div className="selected-badge">
          <span>✓ 선택!</span>
        </div>
      )}
      
      <div className="card-header">
        <span className="card-emoji">{emoji}</span>
        <span className="card-label">목소리 {label}</span>
      </div>

      <div className="waveform-container">
        <Waveform isPlaying={isPlaying} color={color} />
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
        <div className="time-display">
          <span>{formatTime((progress / 100) * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <button
        className={`play-button ${isPlaying ? 'playing' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          isPlaying ? onStop() : onPlay();
        }}
        style={{ 
          backgroundColor: isPlaying ? color : 'white',
          color: isPlaying ? 'white' : color,
          borderColor: color
        }}
      >
        {isPlaying ? (
          <>
            <span className="play-icon">⏸</span>
            일시정지
          </>
        ) : (
          <>
            <span className="play-icon">▶</span>
            재생하기
          </>
        )}
      </button>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

// =============================================
// 메인 앱
// =============================================
function App() {
  const [pairs] = useState(samplePairs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nubzukiExpression, setNubzukiExpression] = useState('default');

  const currentPair = pairs[currentIndex];
  const progress = ((currentIndex + 1) / pairs.length) * 100;

  // 넙죽이 표정 변화
  useEffect(() => {
    if (playingAudio) {
      setNubzukiExpression('happy');
    } else if (selectedOption) {
      setNubzukiExpression('excited');
    } else {
      setNubzukiExpression('default');
    }
  }, [playingAudio, selectedOption]);

  const handleSubmit = async () => {
    if (!selectedOption || isSubmitting) return;
    
    setIsSubmitting(true);
    
    const feedback = {
      pair_id: currentPair.id,
      text: currentPair.text,
      selected: selectedOption,
      selected_model: selectedOption === 'A' ? currentPair.model_a : currentPair.model_b,
      timestamp: new Date().toISOString()
    };
    
    setFeedbackHistory([...feedbackHistory, feedback]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsSubmitting(false);
    setSelectedOption(null);
    setPlayingAudio(null);
    
    if (currentIndex < pairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowComplete(true);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setPlayingAudio(null);
    setFeedbackHistory([]);
    setShowComplete(false);
  };

  // 완료 화면
  if (showComplete) {
    const modelAWins = feedbackHistory.filter(f => f.selected === 'A').length;
    const modelBWins = feedbackHistory.filter(f => f.selected === 'B').length;

    return (
      <div className="app">
        <div className="complete-screen">
          <div className="complete-nubzuki">
            <NubzukiCharacter expression="excited" />
          </div>
          
          <h1 className="complete-title">고마워요! 🎉</h1>
          <p className="complete-subtitle">
            넙죽이 목소리를 찾는 데 도움을 줘서 감사해요!
          </p>

          <div className="stats-container">
            <div className="stat-card stat-a">
              <span className="stat-emoji">🎤</span>
              <span className="stat-number">{modelAWins}</span>
              <span className="stat-label">목소리 A</span>
            </div>
            <div className="stat-card stat-b">
              <span className="stat-emoji">🎙️</span>
              <span className="stat-number">{modelBWins}</span>
              <span className="stat-label">목소리 B</span>
            </div>
          </div>

          <div className="feedback-data">
            <h3>📊 수집된 피드백</h3>
            <pre>{JSON.stringify(feedbackHistory, null, 2)}</pre>
          </div>

          <button className="restart-button" onClick={resetSession}>
            🔄 다시 평가하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* 배경 장식 */}
      <div className="bg-decoration">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <div className="container">
        {/* 헤더 */}
        <header className="header">
          <div className="logo-section">
            <div className="nubzuki-avatar">
              <NubzukiCharacter expression={nubzukiExpression} />
            </div>
            <div className="title-section">
              <h1 className="main-title">넙죽이 보이스</h1>
              <p className="subtitle">Face TTS 피드백 수집</p>
            </div>
          </div>
          
          <div className="kaist-badge">
            <span>KAIST</span>
          </div>
        </header>

        {/* 진행률 */}
        <div className="progress-section">
          <div className="progress-header">
            <span>진행률</span>
            <span className="progress-count">{currentIndex + 1} / {pairs.length}</span>
          </div>
          <div className="main-progress-bar">
            <div 
              className="main-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 설명 카드 */}
        <div className="instruction-card">
          <div className="nubzuki-image-placeholder">
            <img
              src={currentPair?.image}
              alt="넙죽이 얼굴"
              className="nubzuki-face-image"
            />
            <span className="image-label">넙죽이 얼굴 이미지</span>
          </div>
          <div className="instruction-content">
            <h2>🎯 미션</h2>
            <p>이 넙죽이 얼굴을 보고 생성된 두 목소리 중<br/><strong>더 넙죽이다운 목소리</strong>를 골라주세요!</p>
          </div>
        </div>

        {/* 대사 카드 */}
        <div className="speech-card">
          <div className="speech-icon">💬</div>
          <div className="speech-content">
            <span className="speech-label">넙죽이가 말하고 싶은 대사</span>
            <p className="speech-text">"{currentPair?.text}"</p>
          </div>
        </div>

        {/* 목소리 카드들 */}
        <div className="voice-cards">
          <VoiceCard
            label="A"
            audioUrl={currentPair?.audio_a}
            isSelected={selectedOption === 'A'}
            onSelect={() => setSelectedOption('A')}
            isPlaying={playingAudio === 'A'}
            onPlay={() => setPlayingAudio('A')}
            onStop={() => setPlayingAudio(null)}
            color="#FF6B6B"
            emoji="🎤"
          />
          
          <div className="vs-badge">VS</div>
          
          <VoiceCard
            label="B"
            audioUrl={currentPair?.audio_b}
            isSelected={selectedOption === 'B'}
            onSelect={() => setSelectedOption('B')}
            isPlaying={playingAudio === 'B'}
            onPlay={() => setPlayingAudio('B')}
            onStop={() => setPlayingAudio(null)}
            color="#4ECDC4"
            emoji="🎙️"
          />
        </div>

        {/* 제출 버튼 */}
        <div className="submit-section">
          <button
            className={`submit-button ${!selectedOption || isSubmitting ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loader"></span>
                제출 중...
              </>
            ) : selectedOption ? (
              <>
                ✨ 목소리 {selectedOption} 선택 완료!
              </>
            ) : (
              <>
                👆 목소리를 선택해주세요
              </>
            )}
          </button>
        </div>

        {/* 푸터 */}
        <footer className="footer">
          <p>🔬 KAIST Face TTS Research</p>
          <p className="footer-sub">여러분의 피드백이 넙죽이의 목소리를 만들어요!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
