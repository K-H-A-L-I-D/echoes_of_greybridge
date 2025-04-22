// Game data types
export interface Position {
    top: string;
    left: string;
  }
  
  export interface Evidence {
    id: string;
    position: Position;
    description: string;
    isPulsing: boolean;
  }
  
  export interface Choice {
    text: string;
    nextEntry: string;
    flag?: string;
  }
  
  export interface ContentItem {
    type: string;
    text: string;
  }
  
  export interface Entry {
    id: string;
    title: string;
    act: number;
    leftImage: string;
    ambientSound?: string;
    content: ContentItem[];
    evidence?: Evidence[];
    choices?: Choice[];
  }
  
  export interface Ending {
    id: string;
    title: string;
    leftImage: string;
    content: ContentItem[];
  }
  
  export interface Note {
    timestamp: string;
    text: string;
  }
  
  export interface EvidenceItem {
    id: string;
    title: string;
    content: string;
  }
  
  export interface GameData {
    settings: {
      totalEvidence: number;
      glitchProbability: number;
      staticTriggerWords: string[];
    };
    entries: Entry[];
    endings: Ending[];
    initialEvidence: EvidenceItem[];
    initialNotes: Note[];
  }
  
  // Game data
  const gameData: GameData = {
    // Game settings
    settings: {
      totalEvidence: 24,
      glitchProbability: 0.15,
      staticTriggerWords: ['static', 'signal', 'radio', 'transmission', 'noise', 'broadcast', 'frequency']
    },
    
    // Story entries
    entries: [
      {
        id: "001",
        title: "The Forest Road",
        act: 1,
        leftImage: "forestRoad",
        ambientSound: "forestRoad",
        content: [
          { type: "paragraph", text: "The town is silent—except for me." },
          { type: "paragraph", text: "Greybridge seemed empty, like the others." },
          { type: "paragraph", text: "A bridge to where?" },
          { type: "paragraph", text: "I shouldn't linger." },
          { type: "paragraph", text: "It's [waiting]." },
        ],
        evidence: [
          {
            id: "ev-001-1",
            position: { top: "25%", left: "15%" },
            description: "Car door left open. No signs of struggle. Keys still in ignition.",
            isPulsing: false
          },
          {
            id: "ev-001-2",
            position: { top: "45%", left: "65%" },
            description: "Broken side mirror. Impact point suggests it was struck from inside the vehicle, not outside.",
            isPulsing: true
          },
          {
            id: "ev-001-3",
            position: { top: "75%", left: "40%" },
            description: "Handprints on rear window fade when observed directly. Analysis impossible.",
            isPulsing: false
          }
        ],
        choices: [
          {
            text: "Press on",
            nextEntry: "002",
            flag: "brave"
          },
          {
            text: "Search the ruins",
            nextEntry: "003",
            flag: "curious"
          },
          {
            text: "Turn back",
            nextEntry: "004",
            flag: "cautious"
          }
        ]
      }
      // Add more entries as needed
    ],
    
    // Endings
    endings: [
      {
        id: "ending-a",
        title: "The Book Closes",
        leftImage: "bookCloses",
        content: [
          { type: "paragraph", text: "I walk away from Greybridge as dawn breaks, leaving nothing but footprints behind me." },
          { type: "paragraph", text: "I know what happened here. I know about the signals, the entities that came through." },
          { type: "paragraph", text: "But I can never prove it." },
          { type: "paragraph", text: "I survived. But a part of me will always be walking the streets of Greybridge, listening for voices in the signal." },
        ]
      }
      // Add more endings as needed
    ],
    
    // Default evidence items
    initialEvidence: [
      {
        id: "ev-initial-1",
        title: "Assignment Brief",
        content: "Mass disappearance of 1,273 residents from Greybridge Township. No bodies recovered."
      }
    ],
    
    // Initial notes
    initialNotes: [
      {
        timestamp: "04/15/2025 - 09:43",
        text: "Town appears abandoned suddenly. No signs of struggle or panic."
      }
    ]
  };
  
  export default gameData;