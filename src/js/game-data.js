// game-data.js - Contains all the story content and game structure

const gameData = {
    // Game settings
    settings: {
        totalEvidence: 24,
        glitchProbability: 0.15, // Chance of a glitch effect happening when certain text is clicked
        staticTriggerWords: ['static', 'signal', 'radio', 'transmission', 'noise']
    },
    
    // Story pages - Each page has a unique ID and contains content for left and right pages
    pages: [
        {
            id: 'intro',
            leftPage: {
                image: 'images/town-overview.jpg',
                alt: 'Aerial view of abandoned Greybridge town',
                evidence: [
                    {
                        id: 'ev-road',
                        position: { top: '45%', left: '30%' },
                        description: 'Main road leading into town appears undamaged. No signs of evacuation traffic or accidents.',
                        isPulsing: false
                    },
                    {
                        id: 'ev-smoke',
                        position: { top: '30%', left: '65%' },
                        description: 'No smoke or signs of fire damage anywhere in town. Whatever happened wasn\'t destructive to property.',
                        isPulsing: false
                    },
                    {
                        id: 'ev-distortion',
                        position: { top: '15%', left: '50%' },
                        description: 'Strange atmospheric distortion above town center. Could be a photographic artifact, but doesn\'t match any known lens aberration.',
                        isPulsing: true
                    }
                ]
            },
            rightPage: {
                title: 'CASE FILE: GRB-2025-04',
                content: [
                    { type: 'header', text: 'LOCATION: Greybridge Township, [REDACTED] County' },
                    { type: 'header', text: 'INCIDENT: Mass disappearance of township residents (pop. 1,273)' },
                    { type: 'header', text: 'STATUS: Active Investigation' },
                    { type: 'paragraph', text: 'As I drive toward what remains of Greybridge, the morning fog clings to the empty streets like a shroud. The township appears frozen in time – vehicles abandoned mid-street, storefronts with signs still advertising daily specials, a playground with swings moving gently in the breeze.' },
                    { type: 'paragraph', text: 'My assignment is clear: digitally archive and investigate the circumstances surrounding the disappearance that occurred three weeks ago. The physical investigation teams found nothing conclusive. Now it\'s my turn to examine the [digital fingerprints] left behind.' },
                    { type: 'paragraph', text: 'Something about this place feels wrong. The [silence] is too complete. The emptiness too absolute. And yet, I can\'t shake the feeling that [I\'m being watched].', 
                        glitchWords: ['I\'m being watched'],
                        highlightWords: ['digital fingerprints', 'silence']
                    }
                ],
                choices: [
                    {
                        text: 'Begin with the police station records',
                        nextPage: 'police-station'
                    },
                    {
                        text: 'Check the local newspaper office',
                        nextPage: 'newspaper'
                    },
                    {
                        text: 'Visit the town hall archives',
                        nextPage: 'town-hall'
                    }
                ]
            }
        },
        {
            id: 'police-station',
            leftPage: {
                image: 'images/police-station.jpg',
                alt: 'The Greybridge Police Station',
                evidence: [
                    {
                        id: 'ev-radio',
                        position: { top: '35%', left: '60%' },
                        description: 'The dispatch radio appears to be tuned to an emergency frequency. Static can be heard coming from it.',
                        isPulsing: false
                    },
                    {
                        id: 'ev-camera',
                        position: { top: '75%', left: '40%' },
                        description: 'A security camera in the corner is still active. Its indicator light blinks at irregular intervals.',
                        isPulsing: true
                    },
                    {
                        id: 'ev-coffee',
                        position: { top: '55%', left: '25%' },
                        description: 'Coffee mug still half-full. The liquid inside hasn\'t completely evaporated, suggesting the climate control systems remained operational.',
                        isPulsing: false
                    }
                ]
            },
            rightPage: {
                title: '',
                content: [
                    { type: 'paragraph', text: 'The Greybridge Police Station stands at the corner of Main and Elm, its windows dark and empty. The front door is unlocked – as if someone left in a hurry and never returned.' },
                    { type: 'paragraph', text: 'Inside, the station is eerily preserved. Half-empty coffee mugs sit on desks. A jacket hangs over a chair. The [dispatch radio] emits quiet [static].',
                        highlightWords: ['dispatch radio', 'static'] 
                    },
                    { type: 'paragraph', text: 'I make my way to the records room and power up the still-functioning computer system. The screen flickers to life, displaying a login prompt. Surprisingly, I find a sticky note with login credentials under the keyboard – a security violation that now serves my investigation.' },
                    { type: 'paragraph', text: 'As the system boots up, I notice something unusual. The last file accessed was timestamped [3:17 AM] on the night of the disappearance – hours after the last confirmed communication from anyone in town.', 
                        highlightWords: ['3:17 AM']
                    },
                    { type: 'paragraph', text: 'The file is labeled: "[INCIDENT_REPORT_37.pdf]"',
                        highlightWords: ['INCIDENT_REPORT_37.pdf'] 
                    },
                    { type: 'paragraph', text: 'When I attempt to open it, the screen [distorts] momentarily. Did I imagine it? The file contains a single paragraph:',
                        glitchWords: ['distorts'] 
                    },
                    { type: 'special', text: '"They\'re coming through the [static]. God help us, they\'re coming through the static. If you\'re reading this, don\'t trust the [CORRUPTED DATA] they\'re not what they [CORRUPTED DATA] EVACUATE IMMEDIATELY."',
                        style: 'font-style: italic; color: #444;',
                        glitchWords: ['static']
                    }
                ],
                choices: [
                    {
                        text: 'Search for more information about "the static"',
                        nextPage: 'static-search'
                    },
                    {
                        text: 'Check recent dispatch recordings',
                        nextPage: 'dispatch-recordings'
                    },
                    {
                        text: 'Look through the personal desk of Chief Thomas',
                        nextPage: 'chief-desk'
                    }
                ]
            }
        },
        {
            id: 'static-search',
            leftPage: {
                image: 'images/computer-screen.jpg',
                alt: 'Computer screen showing search results',
                evidence: [
                    {
                        id: 'ev-frequency',
                        position: { top: '35%', left: '40%' },
                        description: 'Search result mentions "frequency anomalies" detected in the week prior to disappearance.',
                        isPulsing: false
                    },
                    {
                        id: 'ev-report',
                        position: { top: '60%', left: '70%' },
                        description: 'Technical report file with filename "SIGNAL_INTRUSION_ANALYSIS.pdf"',
                        isPulsing: true
                    },
                    {
                        id: 'ev-email',
                        position: { top: '75%', left: '30%' },
                        description: 'Email from State Police warning about "potential communications disruption"',
                        isPulsing: false
                    }
                ]
            },
            rightPage: {
                title: '',
                content: [
                    { type: 'paragraph', text: 'I search the police database for any mentions of "static" or related terms. Several files appear, most concerning routine radio interference or equipment maintenance. But three entries stand out:' },
                    { type: 'paragraph', text: '1. A report filed by Officer Martinez describing strange interference on all radio channels during her night patrol, one week before the disappearance. She noted the static had a "pattern to it, almost like it was trying to [speak]."',
                        highlightWords: ['speak'] 
                    },
                    { type: 'paragraph', text: '2. An email from Chief Thomas to the County Sheriff requesting technical assistance with the town\'s communications equipment. He mentioned "unexplained [signal disruptions]" affecting not just police radios but cell phones and internet connections throughout Greybridge.',
                        highlightWords: ['signal disruptions'] 
                    },
                    { type: 'paragraph', text: '3. A partially corrupted technical analysis document from a communications specialist who visited two days before the incident. The document contains several charts showing unusual [frequency patterns] and a handwritten note: "This isn\'t equipment failure. Something\'s [broadcasting] on all bands."',
                        highlightWords: ['frequency patterns', 'broadcasting'] 
                    },
                    { type: 'paragraph', text: 'As I review these files, I notice the computer screen occasionally [flickers]. Each time it does, I could swear I hear a faint sound from the dispatch radio in the other room – a change in the [static] pattern.',
                        glitchWords: ['flickers', 'static'] 
                    }
                ],
                choices: [
                    {
                        text: 'Download the technical analysis document for closer examination',
                        nextPage: 'technical-document'
                    },
                    {
                        text: 'Return to the main room to check the dispatch radio',
                        nextPage: 'dispatch-radio'
                    },
                    {
                        text: 'Look for Chief Thomas\'s personal notes on these reports',
                        nextPage: 'chief-notes'
                    }
                ]
            }
        },
        {
            id: 'newspaper',
            leftPage: {
                image: 'images/newspaper-office.jpg',
                alt: 'The Greybridge Gazette office',
                evidence: [
                    {
                        id: 'ev-headline',
                        position: { top: '30%', left: '50%' },
                        description: 'Tomorrow\'s headline was prepared but never printed: "COMMUNICATIONS BLACKOUT CONTINUES - TOWN MEETING CALLED"',
                        isPulsing: true
                    },
                    {
                        id: 'ev-recorder',
                        position: { top: '65%', left: '35%' },
                        description: 'Digital voice recorder on the editor\'s desk. It has 18 minutes of recording from the night of the disappearance.',
                        isPulsing: false
                    },
                    {
                        id: 'ev-photo',
                        position: { top: '70%', left: '70%' },
                        description: 'A photograph for an unpublished story shows strange light patterns in the sky above the town center.',
                        isPulsing: false
                    }
                ]
            },
            rightPage: {
                title: '',
                content: [
                    { type: 'paragraph', text: 'The offices of the Greybridge Gazette are located in a small brick building on Maple Street. Like everywhere else in town, the front door is unlocked, and everything inside is untouched.' },
                    { type: 'paragraph', text: 'The weekly newspaper was set to print the following morning. Computer screens still display half-finished layouts, and a stack of reporter\'s notebooks sits on the editor\'s desk.' },
                    { type: 'paragraph', text: 'The top story prepared for tomorrow\'s edition concerns a town-wide communications issue. According to the article, residents had been experiencing problems with phones, internet, and even television reception for nearly a week.' },
                    { type: 'paragraph', text: 'A [quote] from Mayor Wilson reads: "We\'ve brought in specialists to address these technical difficulties. In the meantime, we\'re calling a town meeting for Wednesday evening to update everyone in person, since our usual communication channels are unreliable."',
                        highlightWords: ['quote'] 
                    },
                    { type: 'paragraph', text: 'Something about this seems significant. The town lost all normal means of communication shortly before everyone vanished.' },
                    { type: 'paragraph', text: 'As I\'m reading, I notice a [voice recorder] on the editor\'s desk with its red light blinking – it still has battery power after all this time. The display shows it contains a recording from [10:43 PM] on the night of the disappearance.',
                        highlightWords: ['voice recorder', '10:43 PM'] 
                    }
                ],
                choices: [
                    {
                        text: 'Play the voice recording',
                        nextPage: 'voice-recording'
                    },
                    {
                        text: 'Search the editor\'s computer for more articles about the communication issues',
                        nextPage: 'editor-computer'
                    },
                    {
                        text: 'Check the photography desk for images related to the communication problems',
                        nextPage: 'photo-desk'
                    }
                ]
            }
        },
        {
            id: 'town-hall',
            leftPage: {
                image: 'images/town-hall.jpg',
                alt: 'Greybridge Town Hall interior',
                evidence: [
                    {
                        id: 'ev-calendar',
                        position: { top: '25%', left: '40%' },
                        description: 'Mayor\'s calendar shows a meeting with "Signal Research Group" scheduled for the morning after the disappearance.',
                        isPulsing: false
                    },
                    {
                        id: 'ev-map',
                        position: { top: '60%', left: '70%' },
                        description: 'Town map with strange markings forming a pattern around certain buildings. The markings are dated over a period of two weeks before the disappearance.',
                        isPulsing: true
                    },
                    {
                        id: 'ev-letter',
                        position: { top: '45%', left: '30%' },
                        description: 'Open letter from state environmental agency regarding "anomalous electromagnetic readings" in the area.',
                        isPulsing: false
                    }
                ]
            },
            rightPage: {
                title: '',
                content: [
                    { type: 'paragraph', text: 'Greybridge Town Hall is the largest building in the center of town – a colonial-style structure with white columns and a clock tower. Inside, the marble-floored lobby echoes with my footsteps.' },
                    { type: 'paragraph', text: 'I make my way to the administration offices, where I find the mayor\'s door ajar. Like elsewhere, there are signs of normal activity suddenly interrupted – a half-drunk cup of coffee, a pen dropped mid-signature on a document.' },
                    { type: 'paragraph', text: 'The mayor\'s [computer] is still on, having switched to a screensaver showing photos of Greybridge through the seasons. I move the mouse, and the screen returns to an email the mayor was composing:',
                        highlightWords: ['computer'] 
                    },
                    { type: 'special', text: 'TO: j.martinez@state.gov\nSUBJECT: Urgent - Request for Immediate Assistance\n\nDr. Martinez,\n\nFollowing our call, the situation has worsened. The readings you detected last week have increased by 300%. We\'re experiencing complete communications failure across all networks, and residents are reporting [UNSENT]',
                        style: 'font-family: monospace; background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd;'
                    },
                    { type: 'paragraph', text: 'On the mayor\'s desk, I find a [folder] labeled "GREYBRIDGE ANOMALY - CLASSIFIED." Inside are reports dating back three months, documenting a series of unusual phenomena:',
                        highlightWords: ['folder'] 
                    },
                    { type: 'paragraph', text: '- Unexplained equipment malfunctions\n- Compass needles spinning randomly\n- Electronic devices activating without user input\n- Unusual [static] on all broadcast frequencies\n- Residents reporting strange [dreams] and [sleep disturbances]',
                        highlightWords: ['static', 'dreams', 'sleep disturbances'] 
                    }
                ],
                choices: [
                    {
                        text: 'Examine the town maps with strange markings',
                        nextPage: 'town-maps'
                    },
                    {
                        text: 'Look deeper into the "GREYBRIDGE ANOMALY" folder',
                        nextPage: 'anomaly-folder'
                    },
                    {
                        text: 'Check the town meeting minutes for discussions about the phenomena',
                        nextPage: 'meeting-minutes'
                    }
                ]
            }
        },
        // Additional pages would be added here as the story expands
    ],
    
    // Default evidence items that should appear in the player's notes from the beginning
    initialEvidence: [
        {
            id: 'ev-initial-1',
            title: 'Assignment Brief',
            content: 'Mass disappearance of 1,273 residents from Greybridge Township on April 7, 2025. No bodies recovered. No signs of struggle, evacuation, or natural disaster.'
        },
        {
            id: 'ev-initial-2',
            title: 'Previous Investigations',
            content: 'Physical forensics teams found no useful evidence. Electronic data recovery flagged as priority.'
        }
    ],
    
    // Initial notes the player has
    initialNotes: [
        {
            timestamp: '04/15/2025 - 09:43',
            text: 'Initial observations: Town appears to have been abandoned suddenly. No signs of struggle or panic. Weather conditions normal for the season.'
        }
    ]
};

// Export the game data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gameData;
}