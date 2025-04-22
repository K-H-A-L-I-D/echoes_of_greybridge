import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import gameData from '../data/gameData';
import '../styles/game.css';

// Define the interfaces for our game state and components
interface Position {
  top: string;
  left: string;
}

interface Evidence {
  id: string;
  position: Position;
  description: string;
  isPulsing: boolean;
}

interface Choice {
  text: string;
  nextEntry: string;
  flag?: string;
}

interface EvidenceItem {
  id: string;
  title: string;
  content: string;
}

interface Note {
  timestamp: string;
  text: string;
}

interface GameState {
  currentPage: string;
  currentEntry: any | null;
  currentEnding: any | null;
  pagesVisited: string[];
  currentPageIndex: number;
  evidenceFound: number;
  totalEvidence: number;
  collectedEvidence: EvidenceItem[];
  notes: Note[];
  flags: string[];
  isAnimating: boolean;
  glitchActive: boolean;
  showNotesPanel: boolean;
  showZoomedImage: boolean;
  zoomedImageSrc: string;
  showStaticEffect: boolean;
  audioMuted: boolean;
}

// Main Game Component
const EchoesOfGreybridge: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    currentPage: 'cover', // Start at the cover
    currentEntry: null,
    currentEnding: null,
    pagesVisited: [],
    currentPageIndex: -1,
    evidenceFound: 0,
    totalEvidence: 0,
    collectedEvidence: [...gameData.initialEvidence],
    notes: [...gameData.initialNotes],
    flags: [],
    isAnimating: false,
    glitchActive: false,
    showNotesPanel: false,
    showZoomedImage: false,
    zoomedImageSrc: '',
    showStaticEffect: false,
    audioMuted: false
  });

  // ✅ Typed refs for audio elements
  const mainThemeRef = useRef<HTMLAudioElement | null>(null);
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  const pageTurnRef = useRef<HTMLAudioElement | null>(null);
  const staticRef = useRef<HTMLAudioElement | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);

  // Calculate total evidence on mount
  useEffect(() => {
    let evidenceCount = 0;
    gameData.entries.forEach((entry: any) => {
      if (entry.evidence) {
        evidenceCount += entry.evidence.length;
      }
    });
    setGameState(prev => ({
      ...prev,
      totalEvidence: evidenceCount
    }));
  }, []);

  // Audio controls
  const playSound = (ref: React.RefObject<HTMLAudioElement>, volume: number) => {
    if (ref.current && !gameState.audioMuted) {
      ref.current.currentTime = 0;
      ref.current.volume = volume;
      ref.current.play().catch(e => console.warn('Audio playback prevented:', e));
    }
  };

  const toggleAudio = () => {
    setGameState(prev => {
      const newMuted = !prev.audioMuted;
      
      if (mainThemeRef.current) newMuted ? mainThemeRef.current.pause() : mainThemeRef.current.play().catch(e => {});
      if (ambientSoundRef.current) newMuted ? ambientSoundRef.current.pause() : ambientSoundRef.current.play().catch(e => {});
      
      return {
        ...prev,
        audioMuted: newMuted
      };
    });
  };

  // Start the game
  const startGame = () => {
    playSound(pageTurnRef, 0.5);
    
    // Load first entry
    loadEntry('001');
    
    // Play main theme
    if (mainThemeRef.current && !gameState.audioMuted) {
      mainThemeRef.current.volume = 0.1;
      mainThemeRef.current.play().catch(e => console.warn('Audio autoplay prevented:', e));
    }
  };

  // Load entry by ID
  const loadEntry = (entryId: string) => {
    // Find the entry data
    const entry = gameData.entries.find((e: any) => e.id === entryId);
    const isEnding = entryId.startsWith('ending-');
    
    // If it's an ending, find the ending data
    let endingData = null;
    if (isEnding) {
      endingData = gameData.endings.find((e: any) => e.id === entryId);
      if (!endingData) {
        console.error(`Ending with ID "${entryId}" not found.`);
        return;
      }
    } else if (!entry) {
      console.error(`Entry with ID "${entryId}" not found.`);
      return;
    }

    // Play sound
    playSound(pageTurnRef, 0.5);
    
    // Add to visited pages if this is a new page
    const newPagesVisited = [...gameState.pagesVisited];
    if (!newPagesVisited.includes(entryId)) {
      newPagesVisited.push(entryId);
    }
    
    // Play appropriate ambient sound
    if (!isEnding && entry.ambientSound) {
      playAmbientSound(entry.ambientSound);
    }
    
    // Update game state
    setGameState(prevState => ({
      ...prevState,
      currentPage: entryId,
      currentEntry: isEnding ? null : entry,
      currentEnding: isEnding ? endingData : null,
      pagesVisited: newPagesVisited,
      currentPageIndex: newPagesVisited.indexOf(entryId),
      isAnimating: true
    }));
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setGameState(prevState => ({
        ...prevState,
        isAnimating: false
      }));
    }, 1000);
  };

  // Play ambient sound by type
  const playAmbientSound = (soundType: string) => {
    if (ambientSoundRef.current && !gameState.audioMuted) {
      ambientSoundRef.current.pause();
      ambientSoundRef.current.currentTime = 0;
      // In a real implementation, we'd change the src based on soundType
      ambientSoundRef.current.volume = 0.15;
      ambientSoundRef.current.play().catch(e => console.warn('Audio playback prevented:', e));
    }
  };

  // Handle choice selection
  const handleChoice = (choice: Choice) => {
    if (gameState.isAnimating) return;
    
    // Add flag if present
    if (choice.flag) {
      setGameState(prevState => ({
        ...prevState,
        flags: [...prevState.flags, choice.flag]
      }));
    }
    
    // Play static effect before changing pages
    triggerStaticEffect();
    
    // Load the next entry after a short delay
    setTimeout(() => {
      loadEntry(choice.nextEntry);
    }, 500);
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (gameState.isAnimating || gameState.currentPageIndex <= 0) return;
    
    const previousPageId = gameState.pagesVisited[gameState.currentPageIndex - 1];
    loadEntry(previousPageId);
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (gameState.isAnimating || gameState.currentPageIndex >= gameState.pagesVisited.length - 1) return;
    
    const nextPageId = gameState.pagesVisited[gameState.currentPageIndex + 1];
    loadEntry(nextPageId);
  };

  // Collect evidence
  const collectEvidence = (evidenceId: string) => {
    // Check if already collected
    if (gameState.collectedEvidence.some(e => e.id === evidenceId)) return;
    
    // Find the evidence data in current entry
    if (!gameState.currentEntry || !gameState.currentEntry.evidence) return;
    
    const evidence = gameState.currentEntry.evidence.find((e: Evidence) => e.id === evidenceId);
    
    if (!evidence) {
      console.error(`Evidence with ID "${evidenceId}" not found.`);
      return;
    }
    
    // Add to collected evidence and notes
    const timestamp = getCurrentTimestamp();
    const newNote = {
      timestamp,
      text: `Found evidence: ${evidence.description}`
    };
    
    setGameState(prevState => ({
      ...prevState,
      collectedEvidence: [...prevState.collectedEvidence, {
        id: evidenceId,
        title: `Evidence from ${prevState.currentEntry.title}`,
        content: evidence.description
      }],
      notes: [newNote, ...prevState.notes],
      evidenceFound: prevState.evidenceFound + 1
    }));
    
    playSound(clickRef, 0.2);
    
    // Trigger static effect for significant evidence
    if (evidence.isPulsing) {
      triggerStaticEffect();
    }
  };

  // Toggle notes panel
  const toggleNotesPanel = () => {
    setGameState(prevState => ({
      ...prevState,
      showNotesPanel: !prevState.showNotesPanel
    }));
    playSound(clickRef, 0.2);
  };

  // Add a new note
  const addNote = (noteText: string) => {
    if (!noteText.trim()) return;
    
    const newNote = {
      timestamp: getCurrentTimestamp(),
      text: noteText.trim()
    };
    
    setGameState(prevState => ({
      ...prevState,
      notes: [newNote, ...prevState.notes]
    }));
    
    playSound(clickRef, 0.2);
  };

  // Show zoomed image
  const zoomImage = (imageType: string) => {
    // In a real implementation, you'd use actual image URLs based on the image type
    const imageSrc = `/images/${imageType}.jpg`;
    
    setGameState(prevState => ({
      ...prevState,
      showZoomedImage: true,
      zoomedImageSrc: imageSrc
    }));
  };

  // Close zoomed image
  const closeZoomView = () => {
    setGameState(prevState => ({
      ...prevState,
      showZoomedImage: false
    }));
  };

  // Trigger static effect
  const triggerStaticEffect = () => {
    setGameState(prevState => ({
      ...prevState,
      showStaticEffect: true
    }));
    
    playSound(staticRef, 0.3);
    
    // Remove effect after animation completes
    setTimeout(() => {
      setGameState(prevState => ({
        ...prevState,
        showStaticEffect: false
      }));
    }, 500);
  };

  // Trigger glitch effect
  const triggerGlitchEffect = () => {
    if (gameState.glitchActive) return;
    
    setGameState(prevState => ({
      ...prevState,
      glitchActive: true
    }));
    
    playSound(staticRef, 0.3);
    
    // Add cryptic note with 50% chance
    if (Math.random() > 0.5) {
      const crypticMessages = [
        "They're watching through the static.",
        "The signal grows stronger when they're mentioned.",
        "Don't look directly at the distortions.",
        "They existed between frequencies before finding us.",
        "The town isn't gone. It's elsewhere."
      ];
      
      const randomMessage = crypticMessages[Math.floor(Math.random() * crypticMessages.length)];
      const newNote = {
        timestamp: getCurrentTimestamp(),
        text: `[UNKNOWN SOURCE]: ${randomMessage}`
      };
      
      setGameState(prevState => ({
        ...prevState,
        notes: [newNote, ...prevState.notes]
      }));
    }
    
    // Remove effect after animation completes
    setTimeout(() => {
      setGameState(prevState => ({
        ...prevState,
        glitchActive: false
      }));
    }, 2000);
  };

  // Handle text with possible static/glitch triggers
  const handleTextInteraction = (text: string, type: string) => {
    // Check for static trigger words
    const hasStaticTrigger = gameData.settings.staticTriggerWords.some(
      (word: string) => text.toLowerCase().includes(word.toLowerCase())
    );
    
    if (hasStaticTrigger) {
      triggerStaticEffect();
    }
    
    if (type === 'highlight') {
      // Add note for highlighted text
      const newNote = {
        timestamp: getCurrentTimestamp(),
        text: `Noted: "${text}"`
      };
      
      setGameState(prevState => ({
        ...prevState,
        notes: [newNote, ...prevState.notes]
      }));
      
      playSound(clickRef, 0.2);
    } else if (type === 'glitch') {
      triggerGlitchEffect();
    }
  };

  // Utility function to get current timestamp
  const getCurrentTimestamp = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${month}/${day}/${year} - ${hours}:${minutes}`;
  };

  // Create spring animation for page turning
  const pageAnimation = useSpring({
    opacity: gameState.isAnimating ? 0 : 1,
    transform: gameState.isAnimating 
      ? 'translateY(10px)' 
      : 'translateY(0px)',
    config: { tension: 300, friction: 20 }
  });

  return (
    <div className="game-container">
      {/* Audio elements */}
      <audio ref={mainThemeRef} loop preload="auto">
        <source src="/audio/main-theme.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={ambientSoundRef} loop preload="auto">
        <source src="/audio/ambient.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={pageTurnRef} preload="auto">
        <source src="/audio/page-turn.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={staticRef} preload="auto">
        <source src="/audio/static.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={clickRef} preload="auto">
        <source src="/audio/click.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Game title */}
      <h1 className="game-title">ECHOES OF GREYBRIDGE</h1>
      
      {/* Static overlay effect */}
      <div className={`static-overlay ${gameState.showStaticEffect ? 'active' : ''}`}></div>
      
      {/* Image zoom overlay */}
      {gameState.showZoomedImage && (
        <div className="image-zoom-overlay" onClick={closeZoomView}>
          <img 
            src={gameState.zoomedImageSrc} 
            alt="Zoomed image" 
            className="zoomed-image" 
          />
          <div className="close-zoom">×</div>
        </div>
      )}
      
      {/* Book container */}
      <div className="book-container">
        {gameState.currentPage === 'cover' ? (
          <div className="book-cover" onClick={startGame}>
            <div className="cover-content">
              <h2>CASE FILE #37</h2>
              <p>CLASSIFIED: LEVEL 4 CLEARANCE</p>
              <div className="cover-instruction">Click to begin investigation</div>
            </div>
          </div>
        ) : (
          <animated.div className="book-open" style={pageAnimation}>
            {/* Left page - Image */}
            <div className="book-page left-page">
              <div className="page-image-container">
                {gameState.currentPage !== 'cover' && (
                  <img 
                    src={getCurrentImageUrl()} 
                    alt={getCurrentTitle()}
                    className="page-image"
                  />
                )}
                
                {/* Evidence markers */}
                {getCurrentEvidence().map((evidence: Evidence) => (
                  <React.Fragment key={evidence.id}>
                    <div 
                      className={`evidence-marker ${evidence.isPulsing ? 'pulsing' : ''} ${
                        gameState.collectedEvidence.some(e => e.id === evidence.id) ? 'found' : ''
                      }`}
                      style={{ top: evidence.position.top, left: evidence.position.left }}
                      onClick={() => collectEvidence(evidence.id)}
                    ></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Right page - Text and choices */}
            <div className="book-page right-page">
              <div className="page-content">
                {/* Story paragraphs */}
                {getCurrentContent().map((paragraph: any, index: number) => (
                  <p key={index} className="story-paragraph">
                    {processText(paragraph.text)}
                  </p>
                ))}
                
                {/* Choices */}
                {getCurrentChoices().length > 0 && (
                  <div className="choices-container">
                    {getCurrentChoices().map((choice: Choice, index: number) => (
                      <button 
                        key={index}
                        className="choice-btn"
                        onClick={() => handleChoice(choice)}
                        disabled={gameState.isAnimating}
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </animated.div>
        )}
      </div>
      
      {/* Control icons */}
      <div className="controls-bar">
        <div className={`control-icon ${gameState.audioMuted ? 'muted' : ''}`} onClick={toggleAudio}>
          <img src={gameState.audioMuted ? "/icons/sound-off.svg" : "/icons/sound-on.svg"} alt="Toggle sound" />
        </div>
        
        <div className="control-icon" onClick={toggleNotesPanel}>
          <img src="/icons/notes.svg" alt="Notes" />
        </div>
        
        <div className="control-icon" onClick={goToPreviousPage} 
             style={{opacity: (gameState.currentPageIndex <= 0) ? 0.3 : 0.7}}>
          <img src="/icons/previous.svg" alt="Previous page" />
        </div>
        
        <div className="control-icon" onClick={goToNextPage}
             style={{opacity: (gameState.currentPageIndex >= gameState.pagesVisited.length - 1) ? 0.3 : 0.7}}>
          <img src="/icons/next.svg" alt="Next page" />
        </div>
      </div>
      
      {/* Notes panel */}
      <div className={`notes-panel ${gameState.showNotesPanel ? 'active' : ''}`}>
        <div className="notes-header">
          <h3>Investigation Notes</h3>
          <div className="close-notes" onClick={toggleNotesPanel}>×</div>
        </div>
        
        <div className="notes-content">
          {gameState.notes.map((note, index) => (
            <div key={index} className="note-item">
              <div className="note-timestamp">{note.timestamp}</div>
              <div className="note-text">{note.text}</div>
            </div>
          ))}
        </div>
        
        <div className="notes-input">
          <textarea 
            className="notes-textarea" 
            placeholder="Add a new investigation note..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addNote((e.target as HTMLTextAreaElement).value);
                (e.target as HTMLTextAreaElement).value = '';
              }
            }}
          ></textarea>
          <button 
            className="add-note-btn"
            onClick={(e) => {
              const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
              addNote(textarea.value);
              textarea.value = '';
            }}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );

  // Helper functions for page content
  function getCurrentImageUrl(): string {
    if (gameState.currentPage === 'cover') {
      return '';
    }
    
    const isEnding = gameState.currentPage.startsWith('ending-');
    let imageType = '';
    
    if (isEnding && gameState.currentEnding) {
      imageType = gameState.currentEnding.leftImage;
    } else if (gameState.currentEntry) {
      imageType = gameState.currentEntry.leftImage;
    }
    
    return `/images/${imageType}.jpg`;
  }

  function getCurrentTitle(): string {
    if (gameState.currentPage === 'cover') {
      return '';
    }
    
    const isEnding = gameState.currentPage.startsWith('ending-');
    
    if (isEnding && gameState.currentEnding) {
      return gameState.currentEnding.title;
    } else if (gameState.currentEntry) {
      return gameState.currentEntry.title;
    }
    
    return '';
  }

  function getCurrentContent(): any[] {
    if (gameState.currentPage === 'cover') {
      return [];
    }
    
    const isEnding = gameState.currentPage.startsWith('ending-');
    
    if (isEnding && gameState.currentEnding) {
      return gameState.currentEnding.content;
    } else if (gameState.currentEntry) {
      return gameState.currentEntry.content;
    }
    
    return [];
  }

  function getCurrentEvidence(): Evidence[] {
    if (gameState.currentPage === 'cover' || 
        gameState.currentPage.startsWith('ending-') || 
        !gameState.currentEntry) {
      return [];
    }
    
    return gameState.currentEntry.evidence || [];
  }

  function getCurrentChoices(): Choice[] {
    if (gameState.currentPage === 'cover' || 
        gameState.currentPage.startsWith('ending-') || 
        !gameState.currentEntry) {
      return [];
    }
    
    return gameState.currentEntry.choices || [];
  }

  function processText(text: string): React.ReactNode {
    // Process [highlighted] text
    const highlightRegex = /\[([^\]]+)\]/g;
    const parts = text.split(highlightRegex);
    
    if (parts.length <= 1) {
      return <span>{text}</span>;
    }
    
    const elements: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        // Regular text
        elements.push(<span key={index}>{part}</span>);
      } else {
        // Highlighted text
        elements.push(
          <span 
            key={index}
            className="highlightable"
            onClick={() => handleTextInteraction(part, 'highlight')}
          >
            {part}
          </span>
        );
        
        // Check if this contains a static trigger word
        const hasStaticTrigger = gameData.settings.staticTriggerWords.some(
          (word: string) => part.toLowerCase().includes(word.toLowerCase())
        );
        
        if (hasStaticTrigger) {
          elements.push(
            <span 
              key={`glitch-${index}`}
              className="glitch-text"
              data-text={part}
              onClick={() => handleTextInteraction(part, 'glitch')}
            >
              {part}
            </span>
          );
        }
      }
    });
    
    return <>{elements}</>;
  }
};

export default EchoesOfGreybridge;