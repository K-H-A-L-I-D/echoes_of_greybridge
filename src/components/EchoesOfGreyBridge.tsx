import React, { useState, useEffect, useRef } from 'react';
import gameData from '../data/gameData';
import '../styles/game.css';

interface GameState {
  currentPage: string;
  currentEntry: any | null;
  currentEnding: any | null;
  pagesVisited: string[];
  currentPageIndex: number;
  evidenceFound: number;
  totalEvidence: number;
  collectedEvidence: any[];
  notes: any[];
  flags: string[];
  isAnimating: boolean;
  glitchActive: boolean;
  showNotesPanel: boolean;
  showZoomedImage: boolean;
  zoomedImageSrc: string;
  showStaticEffect: boolean;
  audioMuted: boolean;
}

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
      if (mainThemeRef.current) newMuted ? mainThemeRef.current.pause() : mainThemeRef.current.play();
      if (ambientSoundRef.current) newMuted ? ambientSoundRef.current.pause() : ambientSoundRef.current.play();
      return { ...prev, audioMuted: newMuted };
    });
  };

  const startGame = () => {
    playSound(pageTurnRef, 0.5);
    loadEntry('001');
    if (mainThemeRef.current && !gameState.audioMuted) {
      mainThemeRef.current.volume = 0.1;
      mainThemeRef.current.play().catch(() => {});
    }
  };

  const loadEntry = (entryId: string) => {
    const entry = gameData.entries.find((e: any) => e.id === entryId);
    const isEnding = entryId.startsWith('ending-');
    let endingData = null;

    if (isEnding) {
      endingData = gameData.endings.find((e: any) => e.id === entryId);
      if (!endingData) return console.error(`Ending ${entryId} not found.`);
    } else if (!entry) {
      return console.error(`Entry ${entryId} not found.`);
    }

    const newPagesVisited = [...gameState.pagesVisited];
    if (!newPagesVisited.includes(entryId)) newPagesVisited.push(entryId);

    if (!isEnding && entry.ambientSound) {
      playSound(ambientSoundRef, 0.15);
    }

    setGameState(prev => ({
      ...prev,
      currentPage: entryId,
      currentEntry: isEnding ? null : entry,
      currentEnding: isEnding ? endingData : null,
      pagesVisited: newPagesVisited,
      currentPageIndex: newPagesVisited.indexOf(entryId),
      isAnimating: true
    }));

    setTimeout(() => {
      setGameState(prev => ({ ...prev, isAnimating: false }));
    }, 1000);
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} - ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const collectEvidence = (evidenceId: string) => {
    if (gameState.collectedEvidence.some(e => e.id === evidenceId)) return;

    const evidence = gameState.currentEntry?.evidence?.find((e: any) => e.id === evidenceId);
    if (!evidence) return;

    const newNote = {
      timestamp: getCurrentTimestamp(),
      text: `Found evidence: ${evidence.description}`
    };

    setGameState(prev => ({
      ...prev,
      collectedEvidence: [...prev.collectedEvidence, {
        id: evidenceId,
        title: `Evidence from ${prev.currentEntry.title}`,
        content: evidence.description
      }],
      notes: [newNote, ...prev.notes],
      evidenceFound: prev.evidenceFound + 1
    }));

    playSound(clickRef, 0.2);
    if (evidence.isPulsing) triggerStaticEffect();
  };

  const triggerStaticEffect = () => {
    setGameState(prev => ({ ...prev, showStaticEffect: true }));
    playSound(staticRef, 0.3);
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showStaticEffect: false }));
    }, 500);
  };

  // Stub return
  return (
    <div className="game-container">
      <audio ref={mainThemeRef} loop preload="auto"><source src="/audio/main-theme.mp3" type="audio/mpeg" /></audio>
      <audio ref={ambientSoundRef} loop preload="auto"><source src="/audio/ambient.mp3" type="audio/mpeg" /></audio>
      <audio ref={pageTurnRef} preload="auto"><source src="/audio/page-turn.mp3" type="audio/mpeg" /></audio>
      <audio ref={staticRef} preload="auto"><source src="/audio/static.mp3" type="audio/mpeg" /></audio>
      <audio ref={clickRef} preload="auto"><source src="/audio/click.mp3" type="audio/mpeg" /></audio>
      <h1 className="game-title">Echoes of Greybridge</h1>
      {/* Your JSX rendering the book, pages, UI, choices, evidence etc. goes here */}
    </div>
  );
};


// Main Game Component
const EchoesOfGreybridge = () => {
  // Game state
  const [gameState, setGameState] = useState({
    currentPage: 'cover', // Start at the cover
    currentEntry: null,
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

  // Audio references
  const mainThemeRef = useRef(null);
  const ambientSoundRef = useRef(null);
  const pageTurnRef = useRef(null);
  const staticRef = useRef(null);
  const clickRef = useRef(null);

  // Calculate total evidence count
  useEffect(() => {
    let evidenceCount = 0;
    gameData.entries.forEach(entry => {
      if (entry.evidence) {
        evidenceCount += entry.evidence.length;
      }
    });
    setGameState(prev => ({
      ...prev,
      totalEvidence: evidenceCount
    }));
  }, []);

  // Play sound functions
  const playPageTurn = () => {
    if (pageTurnRef.current && !gameState.audioMuted) {
      pageTurnRef.current.currentTime = 0;
      pageTurnRef.current.volume = 0.5;
      pageTurnRef.current.play().catch(e => console.warn('Audio playback prevented:', e));
    }
  };

  const playStaticSound = () => {
    if (staticRef.current && !gameState.audioMuted) {
      staticRef.current.currentTime = 0;
      staticRef.current.volume = 0.3;
      staticRef.current.play().catch(e => console.warn('Audio playback prevented:', e));
    }
  };

  const playClickSound = () => {
    if (clickRef.current && !gameState.audioMuted) {
      clickRef.current.currentTime = 0;
      clickRef.current.volume = 0.2;
      clickRef.current.play().catch(e => console.warn('Audio playback prevented:', e));
    }
  };

  const playAmbientSound = (soundType) => {
    if (ambientSoundRef.current && !gameState.audioMuted) {
      ambientSoundRef.current.pause();
      ambientSoundRef.current.currentTime = 0;
      // In a real implementation, we'd change the src based on soundType
      ambientSoundRef.current.volume = 0.15;
      ambientSoundRef.current.play().catch(e => console.warn('Audio playback prevented:', e));
    }
  };

  // Toggle audio mute
  const toggleAudio = () => {
    setGameState(prev => {
      const newMuted = !prev.audioMuted;
      
      if (newMuted) {
        if (mainThemeRef.current) mainThemeRef.current.pause();
        if (ambientSoundRef.current) ambientSoundRef.current.pause();
      } else {
        if (mainThemeRef.current) mainThemeRef.current.play().catch(e => {});
        if (ambientSoundRef.current) ambientSoundRef.current.play().catch(e => {});
      }
      
      return {
        ...prev,
        audioMuted: newMuted
      };
    });
  };

  // Start the game
  const startGame = () => {
    playPageTurn();
    
    // Start with first entry
    loadEntry('001');
    
    // Play main theme
    if (mainThemeRef.current && !gameState.audioMuted) {
      mainThemeRef.current.volume = 0.1;
      mainThemeRef.current.play().catch(e => console.warn('Audio autoplay prevented:', e));
    }
  };

  // Load entry by ID
  const loadEntry = (entryId) => {
    // Find the entry data
    const entry = gameData.entries.find(e => e.id === entryId);
    const isEnding = entryId.startsWith('ending-');
    
    // If it's an ending, find the ending data
    let endingData = null;
    if (isEnding) {
      endingData = gameData.endings.find(e => e.id === entryId);
      if (!endingData) {
        console.error(`Ending with ID "${entryId}" not found.`);
        return;
      }
    } else if (!entry) {
      console.error(`Entry with ID "${entryId}" not found.`);
      return;
    }

    // Play page turn sound
    playPageTurn();
    
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

  // Handle choice selection
  const handleChoice = (choice) => {
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
  const collectEvidence = (evidenceId) => {
    // Check if already collected
    if (gameState.collectedEvidence.some(e => e.id === evidenceId)) return;
    
    // Find the evidence data in current entry
    const evidence = gameState.currentEntry.evidence.find(e => e.id === evidenceId);
    
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
    
    playClickSound();
    
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
    playClickSound();
  };

  // Add a new note
  const addNote = (noteText) => {
    if (!noteText.trim()) return;
    
    const newNote = {
      timestamp: getCurrentTimestamp(),
      text: noteText.trim()
    };
    
    setGameState(prevState => ({
      ...prevState,
      notes: [newNote, ...prevState.notes]
    }));
    
    playClickSound();
  };

  // Show zoomed image
  const zoomImage = (imageType) => {
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
    
    playStaticSound();
    
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
    
    playStaticSound();
    
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
  const handleTextInteraction = (text, type) => {
    // Check for static trigger words
    const hasStaticTrigger = gameData.settings.staticTriggerWords.some(
      word => text.toLowerCase().includes(word.toLowerCase())
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
      
      playClickSound();
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

  // Get the image URL for the current entry or ending
  const getCurrentImageUrl = () => {
    if (gameState.currentPage === 'cover') {
      return null;
    }
    
    const isEnding = gameState.currentPage.startsWith('ending-');
    let imageType = '';
    
    if (isEnding && gameState.currentEnding) {
      imageType = gameState.currentEnding.leftImage;
    } else if (gameState.currentEntry) {
      imageType = gameState.currentEntry.leftImage;
    }
    
    // In a real implementation, you'd use actual image paths
    return `/images/${imageType}.jpg`;
  };

  // Get the current entry's title
  const getCurrentTitle = () => {
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
  };

  // Get the current content to display
  const getCurrentContent = () => {
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
  };

  // Get available evidence for the current entry
  const getCurrentEvidence = () => {
    if (gameState.currentPage === 'cover' || 
        gameState.currentPage.startsWith('ending-') || 
        !gameState.currentEntry) {
      return [];
    }
    
    return gameState.currentEntry.evidence || [];
  };

  // Get available choices for the current entry
  const getCurrentChoices = () => {
    if (gameState.currentPage === 'cover' || 
        gameState.currentPage.startsWith('ending-') || 
        !gameState.currentEntry) {
      return [];
    }
    
    return gameState.currentEntry.choices || [];
  };

  // Process text with special formatting
  const processText = (text) => {
    // Process [highlighted] text
    const highlightRegex = /\[([^\]]+)\]/g;
    const parts = text.split(highlightRegex);
    
    if (parts.length <= 1) {
      return <span>{text}</span>;
    }
    
    const elements = [];
    
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
          word => part.toLowerCase().includes(word.toLowerCase())
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
  };

  // Create CSS class for page animation instead of using react-spring
  const getPageAnimationClass = () => {
    return gameState.isAnimating ? 'page-animating' : '';
  };

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
          <div className={`book-open ${getPageAnimationClass()}`}>
            {/* Left page - Image */}
            <div className="book-page left-page">
              <div className="page-image-container">
                <img 
                  src={getCurrentImageUrl()} 
                  alt={getCurrentTitle()}
                  className="page-image"
                />
                
                {/* Evidence markers */}
                {getCurrentEvidence().map(evidence => (
                  <React.Fragment key={evidence.id}>
                    <div 
                      className={`evidence-marker ${evidence.isPulsing ? 'pulsing' : ''} ${gameState.collectedEvidence.some(e => e.id === evidence.id) ? 'found' : ''}`}
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
                {getCurrentContent().map((paragraph, index) => (
                  <p key={index} className="story-paragraph">
                    {processText(paragraph.text)}
                  </p>
                ))}
                
                {/* Choices */}
                {getCurrentChoices().length > 0 && (
                  <div className="choices-container">
                    {getCurrentChoices().map((choice, index) => (
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
                addNote(e.target.value);
                e.target.value = '';
              }
            }}
          ></textarea>
          <button 
            className="add-note-btn"
            onClick={(e) => {
              const textarea = e.target.previousSibling;
              addNote(textarea.value);
              textarea.value = '';
            }}
          >
            Add Note
          </button>
        </div>
      </div>
      
      <style jsx>{`
        /* Base Styles */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Vollkorn:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          --background-color: #0a0808;
          --page-color: #e0d9c8;
          --text-color: #3a3026;
          --accent-color: #c0b090;
          --highlight-color: #ff2a00;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .game-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          font-family: 'Vollkorn', serif;
          color: var(--text-color);
          overflow: hidden;
          background-color: var(--background-color);
        }
        
        /* Game Title */
        .game-title {
          position: absolute;
          top: 40px;
          width: 100%;
          text-align: center;
          font-family: 'Cinzel', serif;
          font-size: 36px;
          letter-spacing: 8px;
          color: var(--accent-color);
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
          font-weight: 400;
          z-index: 10;
        }
        
        /* Book Styling */
        .book-container {
          width: 900px;
          height: 550px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .book-cover {
          width: 100%;
          height: 100%;
          background-color: #2a1f17;
          background-image: url('/images/cover-texture.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .book-cover:hover {
          transform: scale(1.02);
        }
        
        .cover-content {
          text-align: center;
          color: var(--accent-color);
          padding: 40px;
          background-color: rgba(0, 0, 0, 0.6);
          border: 1px solid var(--accent-color);
        }
        
        .cover-content h2 {
          font-family: 'Cinzel', serif;
          margin-bottom: 20px;
          font-size: 24px;
          letter-spacing: 3px;
        }
        
        .cover-content p {
          margin-bottom: 30px;
          letter-spacing: 2px;
        }
        
        .cover-instruction {
          font-style: italic;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        
        .book-open {
          width: 100%;
          height: 100%;
          display: flex;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .book-page {
          width: 50%;
          height: 100%;
          background-color: var(--page-color);
          position: relative;
          overflow: hidden;
        }
        
        .left-page {
          border-right: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .right-page {
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .page-image-container {
          width: 90%;
          height: 90%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin: 0 auto;
        }
        
        .page-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: 3px solid #3a3026;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }
        
        .page-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        
        .story-paragraph {
          margin-bottom: 20px;
          font-size: 18px;
          line-height: 1.6;
        }
        
        /* Choices */
        .choices-container {
          margin-top: 20px;
        }
        
        .choice-btn {
          display: block;
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          background-color: transparent;
          border: 1px solid var(--text-color);
          color: var(--text-color);
          font-family: inherit;
          font-size: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .choice-btn:hover {
          background-color: rgba(58, 48, 38, 0.1);
        }
        
        /* Evidence markers */
        .evidence-marker {
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: rgba(255, 255, 0, 0.2);
          border: 1px solid rgba(255, 200, 0, 0.6);
          border-radius: 50%;
          cursor: pointer;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .evidence-marker:hover {
          background-color: rgba(255, 255, 0, 0.4);
          box-shadow: 0 0 10px rgba(255, 200, 0, 0.6);
        }
        
        .evidence-marker.pulsing {
          animation: marker-pulse 2s infinite;
        }
        
        .evidence-marker.found {
          background-color: rgba(0, 255, 0, 0.2);
          border-color: rgba(0, 200, 0, 0.6);
        }
        
        @keyframes marker-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
        }
        
        /* Controls Bar */
        .controls-bar {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 60px;
          z-index: 20;
        }
        
        .control-icon {
          width: 40px;
          height: 40px;
          opacity: 0.6;
          transition: opacity 0.3s ease;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .control-icon:hover {
          opacity: 1;
        }
        
        .control-icon img {
          width: 100%;
          height: 100%;
          filter: invert(80%);
        }
        
        .control-icon.muted img {
          filter: invert(40%);
        }
        
        /* Highlight Text */
        .highlightable {
          position: relative;
          cursor: pointer;
          color: var(--highlight-color);
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 3px;
          transition: all 0.3s ease;
        }
        
        .highlightable:hover {
          color: #ff5a30;
        }
        
        /* Glitch Effect */
        .glitch-text {
          position: relative;
          display: inline-block;
          cursor: pointer;
          color: inherit;
        }
        
        .glitch-text.glitch-active {
          animation: glitch-text 0.3s infinite;
          color: var(--highlight-color);
        }
        
        @keyframes glitch-text {
          0% { transform: none; opacity: 1; }
          7% { transform: skew(-0.5deg, -0.9deg); opacity: 0.75; }
          10% { transform: none; opacity: 1; }
          27% { transform: none; opacity: 1; }
          30% { transform: skew(0.8deg, -0.1deg); opacity: 0.75; }
          35% { transform: none; opacity: 1; }
          52% { transform: none; opacity: 1; }
          55% { transform: skew(-1deg, 0.2deg); opacity: 0.75; }
          50% { transform: none; opacity: 1; }
          72% { transform: none; opacity: 1; }
          75% { transform: skew(0.4deg, 1deg); opacity: 0.75; }
          80% { transform: none; opacity: 1; }
          100% { transform: none; opacity: 1; }
        }
        
        /* Notes Panel */
        .notes-panel {
          position: fixed;
          top: 50%;
          right: -350px;
          transform: translateY(-50%);
          width: 320px;
          height: 80vh;
          background-color: rgba(224, 217, 200, 0.95);
          box-shadow: -5px 0 20px rgba(0, 0, 0, 0.4);
          transition: right 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          z-index: 50;
          display: flex;
          flex-direction: column;
          padding: 20px;
          border: 1px solid rgba(58, 48, 38, 0.3);
        }
        
        .notes-panel.active {
          right: 20px;
        }
        
        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--text-color);
        }
        
        .notes-header h3 {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: var(--text-color);
        }
        
        .close-notes {
          cursor: pointer;
          font-size: 24px;
          color: var(--text-color);
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .notes-content {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 20px;
        }
        
        .note-item {
          margin-bottom: 15px;
          padding: 12px;
          background-color: #f8f5ef;
          border: 1px solid rgba(58, 48, 38, 0.2);
        }
        
        .note-timestamp {
          font-size: 12px;
          color: #777;
          margin-bottom: 5px;
          font-style: italic;
        }
        
        .notes-input {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .notes-textarea {
          width: 100%;
          height: 100px;
          padding: 10px;
          font-family: inherit;
          font-size: 14px;
          border: 1px solid rgba(58, 48, 38, 0.3);
          background-color: #f8f5ef;
          resize: none;
        }
        
        .add-note-btn {
          padding: 8px 15px;
          background-color: var(--text-color);
          color: var(--page-color);
          border: none;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .add-note-btn:hover {
          background-color: #4d4033;
        }
        
        /* Image Zoom */
        .image-zoom-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .zoomed-image {
          max-width: 80%;
          max-height: 80vh;
          border: 5px solid var(--text-color);
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
        }
        
        .close-zoom {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-size: 24px;
          color: white;
        }
        
        /* Static Effect */
        .static-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0;
          z-index: 200;
          background-image: url('/images/static.png');
          mix-blend-mode: screen;
        }
        
        .static-overlay.active {
          animation: static-flicker 0.5s forwards;
        }
        
        /* Page Animations */
        .page-animating {
          animation: page-transition 0.5s forwards;
        }
        
        @keyframes page-transition {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EchoesOfGreybridge;