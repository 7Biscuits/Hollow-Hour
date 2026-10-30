import { DialogueNode } from '../types';

export const DIALOGUE_CATALOG: Record<string, DialogueNode> = {
  // --- Victoria Vance ---
  victoria_intro: {
    id: 'victoria_intro',
    speaker: 'Victoria Vance',
    speakerTitle: 'Widow of Blackwood Manor',
    portrait: 'portrait_victoria',
    lines: [
      'Inspector Graves... I am grateful you arrived so swiftly from the precinct.',
      'Alistair was... torn to ribbons in his own study. The police in town claimed it was a rabid wolf from the Blackwood moors.',
      'Yet no animal could undo heavy iron bolts from the inside. There is something profoundly vile within these walls.'
    ],
    choices: [
      {
        text: 'Who had access to Alistair\'s study tonight?',
        targetNodeId: 'victoria_suspects'
      },
      {
        text: 'Did Alistair have any enemies or unusual obsessions?',
        targetNodeId: 'victoria_occult'
      },
      {
        text: 'I will inspect the crime scene immediately.',
        targetNodeId: 'victoria_dismiss'
      }
    ]
  },
  victoria_suspects: {
    id: 'victoria_suspects',
    speaker: 'Victoria Vance',
    speakerTitle: 'Widow of Blackwood Manor',
    portrait: 'portrait_victoria',
    lines: [
      'Only our nephew Edward and Dr. Hayes were staying the night.',
      'Edward has been in the library trembling over his gambling debts. And Dr. Hayes... he spent hours locked in the cellar with Alistair conducting "medical consultations".'
    ],
    choices: [
      {
        text: 'Tell me about Alistair\'s illness.',
        targetNodeId: 'victoria_occult'
      },
      {
        text: 'Thank you, Madame Vance. I shall proceed.',
        targetNodeId: 'victoria_dismiss'
      }
    ]
  },
  victoria_occult: {
    id: 'victoria_occult',
    speaker: 'Victoria Vance',
    speakerTitle: 'Widow of Blackwood Manor',
    portrait: 'portrait_victoria',
    lines: [
      'For months he spoke of transcending bodily frailty. He became obsessed with the ancient lunar cycle and the grand clock in the foyer.',
      'He had Dr. Hayes administer terrible draughts of silver and wolfsbane to alter his humours. Take this—it was found beneath his study desk.'
    ],
    onNodeEnter: {
      giveItemId: 'item_clock_hand',
      addClueId: 'clue_grandfather_clock'
    },
    choices: [
      {
        text: 'A clock hand? I will examine the foyer pendulum clock.',
        targetNodeId: 'victoria_dismiss'
      }
    ]
  },
  victoria_dismiss: {
    id: 'victoria_dismiss',
    speaker: 'Victoria Vance',
    speakerTitle: 'Widow of Blackwood Manor',
    portrait: 'portrait_victoria',
    lines: [
      'Do be cautious, Inspector. The shadows in the hallway seemed... alive, when the grandfather clock struck three.'
    ],
    onNodeEnter: {
      setFlag: 'has_spoken_to_victoria'
    }
  },

  // --- Edward Vance ---
  edward_intro: {
    id: 'edward_intro',
    speaker: 'Edward Vance',
    speakerTitle: 'Nephew & Heir',
    portrait: 'portrait_edward',
    lines: [
      'D-detective! Don\'t extinguish that lantern! The moors... they came inside!',
      'I heard heavy panting outside my door around three in the morning. Claws dragging against the wainscoting!'
    ],
    choices: [
      {
        text: 'Calm yourself, Edward. Did you see what killed your uncle?',
        targetNodeId: 'edward_details'
      },
      {
        text: 'Why were you up at three in the morning?',
        targetNodeId: 'edward_motive'
      }
    ]
  },
  edward_details: {
    id: 'edward_details',
    speaker: 'Edward Vance',
    speakerTitle: 'Nephew & Heir',
    portrait: 'portrait_edward',
    lines: [
      'Through the keyhole, I saw... fur. Grey matted fur and eyes that burned with yellow brimstone.',
      'It stood on two legs like a man, but broader than an ox. It dragged itself toward the East Wing corridor!'
    ],
    onNodeEnter: {
      addClueId: 'clue_claw_marks'
    },
    choices: [
      {
        text: 'The East Wing houses the CCTV console. I will inspect it.',
        targetNodeId: 'edward_dismiss'
      }
    ]
  },
  edward_motive: {
    id: 'edward_motive',
    speaker: 'Edward Vance',
    speakerTitle: 'Nephew & Heir',
    portrait: 'portrait_edward',
    lines: [
      'I was reading! I swear on my mother\'s grave! I know people whisper about my debts, but I couldn\'t do this!',
      'Look at the study door—it was shredded into splinters! No man has that strength!'
    ],
    choices: [
      {
        text: 'Stay here in the light. Do not wander.',
        targetNodeId: 'edward_dismiss'
      }
    ]
  },
  edward_dismiss: {
    id: 'edward_dismiss',
    speaker: 'Edward Vance',
    speakerTitle: 'Nephew & Heir',
    portrait: 'portrait_edward',
    lines: [
      'I won\'t move an inch, Inspector. Just don\'t leave me in the dark...'
    ]
  },

  // --- Ghost of Alistair Vance ---
  alistair_ghost_intro: {
    id: 'alistair_ghost_intro',
    speaker: 'Alistair Vance',
    speakerTitle: 'Spectral Manifestation',
    portrait: 'portrait_alistair_ghost',
    lines: [
      'Graves... you walk the threshold between flesh and ash...',
      'You seek a murderer among men, but the butcher wears my own stolen pulse.',
      'The consciousness-transfer ritual in the lower sanctum... Hayes assisted, but the wolf took root before the tether snapped.'
    ],
    choices: [
      {
        text: 'Alistair! Are you saying the werewolf IS your body?!',
        targetNodeId: 'alistair_ghost_truth'
      },
      {
        text: 'How can the beast be stopped?',
        targetNodeId: 'alistair_ghost_ritual'
      }
    ]
  },
  alistair_ghost_truth: {
    id: 'alistair_ghost_truth',
    speaker: 'Alistair Vance',
    speakerTitle: 'Spectral Manifestation',
    portrait: 'portrait_alistair_ghost',
    lines: [
      'My spirit was evicted into the aether, but my flesh... transformed by lunar resonance, hungers without remorse.',
      'The beast retains the instinct of the predator and the cunning of the scholar. It hunts my kin to sever the bloodline and solidify the curse.'
    ],
    choices: [
      {
        text: 'Tell me how to undo the curse.',
        targetNodeId: 'alistair_ghost_ritual'
      }
    ]
  },
  alistair_ghost_ritual: {
    id: 'alistair_ghost_ritual',
    speaker: 'Alistair Vance',
    speakerTitle: 'Spectral Manifestation',
    portrait: 'portrait_alistair_ghost',
    lines: [
      'In the basement ritual chamber lies the Obsidian Altar.',
      'Place the Silver Sigil and plunge the ceremonial blade when the hollow hour tolls 3:33. Only silver and severed will can break the cycle.'
    ],
    onNodeEnter: {
      giveItemId: 'item_silver_sigil',
      addClueId: 'clue_basement_altar'
    }
  },

  // --- Dr. Robert Hayes (Living Physician) ---
  hayes_intro: {
    id: 'hayes_intro',
    speaker: 'Dr. Robert Hayes',
    speakerTitle: 'Personal Physician & Alchemist',
    portrait: 'portrait_hayes',
    lines: [
      'Detective Graves, I presume. I am Dr. Robert Hayes.',
      'I was reviewing the patient logs when the security alarms sounded. Lord Alistair was terminal—his pulmonary consumption left him with weeks at best.',
      'He turned to radical biology, seeking to bypass physical decay. I prepared his neuro-stabilizers, but what occurred in the cellar went far beyond medicine.'
    ],
    choices: [
      {
        text: 'What was in those prescriptions you prepared?',
        targetNodeId: 'hayes_prescriptions'
      },
      {
        text: 'What did the surveillance cameras capture tonight?',
        targetNodeId: 'hayes_cctv'
      },
      {
        text: 'Who else knew about this experiment?',
        targetNodeId: 'hayes_warning'
      }
    ]
  },
  hayes_prescriptions: {
    id: 'hayes_prescriptions',
    speaker: 'Dr. Robert Hayes',
    speakerTitle: 'Personal Physician & Alchemist',
    portrait: 'portrait_hayes',
    lines: [
      'Silver nitrate suspensions and distilled wolfsbane. Alistair believed the lycanthropic pathogen could regenerate dead tissue while keeping the mind intact.',
      'I warned him the predator instinct would subsume his humanity. Take this prescription ledger—it documents the chemical dosages.'
    ],
    onNodeEnter: {
      addClueId: 'clue_hayes_revelation',
      giveItemId: 'item_laudanum'
    },
    choices: [
      {
        text: 'Did Victoria or Edward assist in these draughts?',
        targetNodeId: 'hayes_warning'
      },
      {
        text: 'I will inspect the surveillance console.',
        targetNodeId: 'hayes_dismiss'
      }
    ]
  },
  hayes_cctv: {
    id: 'hayes_cctv',
    speaker: 'Dr. Robert Hayes',
    speakerTitle: 'Personal Physician & Alchemist',
    portrait: 'portrait_hayes',
    lines: [
      'At 2:45 AM, feed five went dead. The holding cage in the sub-cellar was breached from the inside.',
      'Moments later, I heard ungodly snarling in the north wing corridors. If you review the reels, you will see it is no ordinary beast.'
    ],
    choices: [
      {
        text: 'I will view the surveillance feeds immediately.',
        targetNodeId: 'hayes_dismiss'
      }
    ]
  },
  hayes_warning: {
    id: 'hayes_warning',
    speaker: 'Dr. Robert Hayes',
    speakerTitle: 'Personal Physician & Alchemist',
    portrait: 'portrait_hayes',
    lines: [
      'Victoria stood to inherit the estate, but she was terrified of what Alistair was becoming. Edward cowered in the library.',
      'Neither of them possessed the constitution to tear Alistair apart. Guard your back, Detective. The predator is still within the estate.'
    ],
    choices: [
      {
        text: 'Stay in the security room, Doctor. It is reinforced.',
        targetNodeId: 'hayes_dismiss'
      }
    ]
  },
  hayes_dismiss: {
    id: 'hayes_dismiss',
    speaker: 'Dr. Robert Hayes',
    speakerTitle: 'Personal Physician & Alchemist',
    portrait: 'portrait_hayes',
    lines: [
      'I shall lock the security bulkhead. May Providence guide your blade, Graves.'
    ],
    onNodeEnter: {
      setFlag: 'has_spoken_to_hayes'
    }
  },

  // --- Ghost of Edward Vance ---
  edward_ghost_intro: {
    id: 'edward_ghost_intro',
    speaker: 'Edward\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_edward_ghost',
    lines: [
      'Graves... is that you? It is so cold... so terribly cold...',
      'I did not move from the library as you bade me... but the wood groaned... the bookshelf pivoted from within...',
      'It lunged in the moonlight. I saw its face, Detective... it had Uncle Alistair\'s cruel eyes and his golden signet ring!'
    ],
    onNodeEnter: {
      addClueId: 'clue_edward_warning'
    },
    choices: [
      {
        text: 'Edward! What opened the secret passage behind the bookshelf?',
        targetNodeId: 'edward_ghost_riddle'
      },
      {
        text: 'Did the beast say anything to you?',
        targetNodeId: 'edward_ghost_confession'
      }
    ]
  },
  edward_ghost_riddle: {
    id: 'edward_ghost_riddle',
    speaker: 'Edward\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_edward_ghost',
    lines: [
      'The three grimoires... Uncle whispered their order in his fever dreams: "First the beast within, then the vermin of blood, and finally the hollow hour..."',
      'Pull them upon the shelf... and the stone stairs shall descend into the crypt where he bound his soul.'
    ],
    choices: [
      {
        text: 'Rest now, Edward. I shall avenge you.',
        targetNodeId: 'edward_ghost_dismiss'
      }
    ]
  },
  edward_ghost_confession: {
    id: 'edward_ghost_confession',
    speaker: 'Edward\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_edward_ghost',
    lines: [
      'It did not speak with words... it snarled with his voice! It knew my name... it hungered for my blood to sever the family tether!',
      'Victoria is upstairs in the master suite... warn her before the moon reaches its zenith!'
    ],
    choices: [
      {
        text: 'I am going to Victoria now.',
        targetNodeId: 'edward_ghost_dismiss'
      }
    ]
  },
  edward_ghost_dismiss: {
    id: 'edward_ghost_dismiss',
    speaker: 'Edward\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_edward_ghost',
    lines: [
      'The shadows are rising... beware the hollow hour, Detective...'
    ]
  },

  // --- Ghost of Victoria Vance ---
  victoria_ghost_intro: {
    id: 'victoria_ghost_intro',
    speaker: 'Victoria\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_victoria_ghost',
    lines: [
      'Graves... you came too late... yet perhaps in time to save this wretched house.',
      'The bolt held, but the creature shattered the stained glass from the balcony. It tore through my silks as though I were parchment.',
      'As its fangs pierced my throat, Alistair\'s mind spoke within my thoughts... "We are immortal now, my love."'
    ],
    onNodeEnter: {
      addClueId: 'clue_victoria_confession'
    },
    choices: [
      {
        text: 'Victoria! How do I destroy the creature that Alistair has become?',
        targetNodeId: 'victoria_ghost_revelation'
      },
      {
        text: 'Did Alistair leave any weakness behind?',
        targetNodeId: 'victoria_ghost_formula'
      }
    ]
  },
  victoria_ghost_revelation: {
    id: 'victoria_ghost_revelation',
    speaker: 'Victoria\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_victoria_ghost',
    lines: [
      'His human spirit is trapped outside his body, tethered only by the ritual altar in the sub-cellar crypt.',
      'The beast cannot die by mundane lead or steel. You must align the alchemical concentric rings at the obsidian altar to sever the lunar tether.'
    ],
    choices: [
      {
        text: 'What is the alignment of the altar rings?',
        targetNodeId: 'victoria_ghost_formula'
      }
    ]
  },
  victoria_ghost_formula: {
    id: 'victoria_ghost_formula',
    speaker: 'Victoria\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_victoria_ghost',
    lines: [
      'The outer ring points to the Full Moon. The middle ring aligns with the Wolf Sigil. The inner ring rests upon the Blood Chalice.',
      'Take my wedding band... it holds the silver alloy required to break the circle.'
    ],
    onNodeEnter: {
      giveItemId: 'item_silver_sigil'
    },
    choices: [
      {
        text: 'I will put an end to this nightmare, Victoria.',
        targetNodeId: 'victoria_ghost_dismiss'
      }
    ]
  },
  victoria_ghost_dismiss: {
    id: 'victoria_ghost_dismiss',
    speaker: 'Victoria\'s Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_victoria_ghost',
    lines: [
      'May the dawn break over Blackwood Manor once more...'
    ]
  },

  // --- Ghost of Dr. Robert Hayes ---
  hayes_ghost_intro: {
    id: 'hayes_ghost_intro',
    speaker: 'Hayes\' Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_hayes_ghost',
    lines: [
      'Inspector Graves... my medicine was foolish arrogance. I believed I was advancing science, but I was merely preparing a monster\'s feast.',
      'The werewolf tracked me to the crypt altar. It broke my spine against the flagstones before I could ignite the silver nitrate.'
    ],
    choices: [
      {
        text: 'Doctor! Tell me how to complete the ritual!',
        targetNodeId: 'hayes_ghost_athame'
      }
    ]
  },
  hayes_ghost_athame: {
    id: 'hayes_ghost_athame',
    speaker: 'Hayes\' Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_hayes_ghost',
    lines: [
      'The ceremonial athame on the altar is forged of meteoric obsidian and silver inlay. It alone can channel the neural surge.',
      'When the clock tolls 3:33, align the three stone rings and drive the blade into the heart of the central sigil. The link will shatter!'
    ],
    onNodeEnter: {
      giveItemId: 'item_ritual_dagger'
    },
    choices: [
      {
        text: 'I will finish what was started. Rest in peace, Doctor.',
        targetNodeId: 'hayes_ghost_dismiss'
      }
    ]
  },
  hayes_ghost_dismiss: {
    id: 'hayes_ghost_dismiss',
    speaker: 'Hayes\' Ghost',
    speakerTitle: 'Spectral Apparition',
    portrait: 'portrait_hayes_ghost',
    lines: [
      'The beast approaches... strike true when the hollow hour arrives...'
    ]
  },

  // --- Final Climax Ritual Confrontation ---
  altar_climax_prompt: {
    id: 'altar_climax_prompt',
    speaker: 'Lord Alistair\'s Spirit',
    speakerTitle: 'Consciousness Bound to the Beast',
    portrait: 'portrait_alistair_ghost',
    lines: [
      'The obsidian altar pulses with violent sapphire light. The beast stands motionless at the perimeter, its amber eyes locked with yours.',
      'A raspy, spectral voice echoes directly into your skull: "Graves... you have unraveled every secret of Blackwood Manor."',
      '"My mortal body was rotting from illness. I transferred my soul into this immortal apex predator to transcend death itself... but the beast\'s hunger is drowning my humanity."',
      '"The hollow hour is at its zenith. The Ceremonial Athame is in your hands. How does my story end, Inspector?"'
    ],
    choices: [
      {
        text: '[SEVER THE TETHER] Plunge the Ceremonial Athame into the altar sigil to destroy the curse.',
        targetNodeId: 'altar_sever_tether'
      },
      {
        text: '[ABSORB THE VESSEL] Step into the circle and let the immortal consciousness enter your body.',
        targetNodeId: 'altar_absorb_curse'
      },
      {
        text: '[SMASH THE CIRCLE & FLEE] Scatter the alchemical salts and escape into the night.',
        targetNodeId: 'altar_flee_manor'
      }
    ]
  },
  altar_sever_tether: {
    id: 'altar_sever_tether',
    speaker: 'Inspector Graves',
    speakerTitle: 'Detective',
    portrait: 'portrait_hayes', // Using available portrait
    lines: [
      '"Your immortality cost three innocent lives, Alistair. The Blackwood bloodline ends tonight."',
      'With both hands on the meteoric obsidian hilt, you plunge the blade straight through the central lunar glyph!',
      'Blinding silver light erupts! The beast lets out a deafening, mournful cry as the supernatural tether shatters...'
    ],
    onNodeEnter: {
      setFlag: 'ending_banishment_triggered'
    }
  },
  altar_absorb_curse: {
    id: 'altar_absorb_curse',
    speaker: 'Lord Alistair\'s Spirit',
    speakerTitle: 'Consciousness Bound to the Beast',
    portrait: 'portrait_alistair_ghost',
    lines: [
      '"Yes... YES! You understand the magnificent gift! You shall be the new sovereign of the night!"',
      'You step past the silver threshold. Liquid crimson fire surges through your veins as the beast collapses to dust, and its soul rushes into your flesh!',
      'Your vision ignites into blood-red clarity. Razor talons erupt from your fingers as you throw your head back into the dark...'
    ],
    onNodeEnter: {
      setFlag: 'ending_transference_triggered'
    }
  },
  altar_flee_manor: {
    id: 'altar_flee_manor',
    speaker: 'Inspector Graves',
    speakerTitle: 'Detective',
    portrait: 'portrait_hayes',
    lines: [
      '"This is mad occult heresy beyond human jurisdiction. I will not die for a dead lord\'s vanity!"',
      'You kick over the salt barriers and shatter the silver flasks! The altar runes flicker and sputter into dying sparks.',
      'The beast roars in blind fury behind you as you sprint toward the stairs! The mansion gates ahead are unchained!'
    ],
    onNodeEnter: {
      setFlag: 'gates_unlocked',
      giveItemId: 'item_gate_key'
    }
  }
};
