import { ClueEntry, SuspectProfile, CaseObjective } from '../types';

export const INITIAL_SUSPECTS: SuspectProfile[] = [
  {
    id: 'suspect_alistair',
    name: 'Alistair Vance',
    relation: 'Deceased Master of Blackwood Manor',
    portrait: 'portrait_alistair_ghost',
    status: 'deceased',
    bio: 'Renowned antiquarian and occult scholar. Found brutally savaged in his study with deep claw lacerations across the chest. His private journals hint at an ancient biological ritual to conquer mortality.',
    notes: [
      'Cause of death: massive trauma inflicted by an immense predatory beast.',
      'Possessed rare occult grimoires and blueprints of Blackwood Manor\'s hidden chambers.'
    ]
  },
  {
    id: 'suspect_victoria',
    name: 'Victoria Vance',
    relation: 'Widow of Alistair',
    portrait: 'portrait_victoria',
    status: 'alive',
    bio: 'A cold, poised Victorian noblewoman in black mourning silk. She claims she was asleep in the master suite when her husband was slaughtered, but a distinct scent of wolfsbane clings to her handkerchief.',
    notes: [
      'Inherits the entirety of the Blackwood estate and mining fortune upon Alistair\'s demise.',
      'Refuses to allow anyone near the locked second-floor bedroom.'
    ]
  },
  {
    id: 'suspect_edward',
    name: 'Edward Vance',
    relation: 'Nephew & Heir Presumptive',
    portrait: 'portrait_edward',
    status: 'alive',
    bio: 'A high-strung young man with nervous tremors. Terrified of the dark, he keeps vigil in the library. He swears he heard animal panting inside the walls days before Alistair\'s murder.',
    notes: [
      'Carries substantial gambling debts in London.',
      'Reported seeing a massive canine silhouette crossing the moonlit courtyard at 3:30 AM.'
    ]
  },
  {
    id: 'suspect_hayes',
    name: 'Dr. Robert Hayes',
    relation: 'Personal Physician & Alchemist',
    portrait: 'portrait_hayes',
    status: 'alive',
    bio: 'Family doctor who tended Alistair for five years. Pragmatic and secretive, he prepared specialized tinctures of silver nitrate and laudanum for Alistair\'s "nocturnal fits".',
    notes: [
      'Signed the initial death certificate with unusual haste.',
      'Maintains a locked chemical laboratory somewhere beneath the basement foundations.'
    ]
  }
];

export const INITIAL_OBJECTIVES: CaseObjective[] = [
  {
    id: 'obj_inspect_study',
    title: 'Investigate the Crime Scene',
    description: 'Inspect the fireplace, desk, and blood spatter in Blackwood Manor for clues regarding Alistair\'s death.',
    completed: false,
    chapter: 'chapter_1_arrival'
  },
  {
    id: 'obj_solve_clock',
    title: 'The Hollow Hour Mechanism',
    description: 'Examine the stopped grandfather clock in the Entrance Hall and discover what opens at 3:33.',
    completed: false,
    chapter: 'chapter_1_arrival'
  },
  {
    id: 'obj_check_cctv',
    title: 'Review Surveillance Footage',
    description: 'Power on the security console in the East Wing Security Room and view the camera feeds.',
    completed: false,
    chapter: 'chapter_1_arrival'
  },
  {
    id: 'obj_occult_altar',
    title: 'Align the Alchemical Sigils',
    description: 'Rotate the stone concentric discs in the crypt altar to match the lunar and wolf runes described in Alistair\'s notes.',
    completed: false,
    chapter: 'chapter_1_arrival'
  }
];

export const CLUE_CATALOG: Record<string, ClueEntry> = {
  clue_grandfather_clock: {
    id: 'clue_grandfather_clock',
    title: 'The Frozen Clock Mechanism',
    category: 'mansion',
    roomFound: 'Entrance Hall',
    description: 'The ancient pendulum clock stopped dead at 3:33. The minute hand has been removed, and the interior gear housing houses a hidden latch.',
    discoveredAt: 0
  },
  clue_hidden_compartment: {
    id: 'clue_hidden_compartment',
    title: 'The Secret Vault of Books',
    category: 'mansion',
    roomFound: 'Library',
    description: 'A counterweighted stone revolving mechanism behind the occult bookcase connects Alistair\'s study directly to the subterranean crypt.',
    discoveredAt: 0
  },
  clue_fireplace_notes: {
    id: 'clue_fireplace_notes',
    title: 'Charred Laboratory Log',
    category: 'occult',
    roomFound: 'Main Hallway',
    description: 'Scraps salvaged from the hearth describe a consciousness transfer using lunar resonance and silver alloy conductors.',
    discoveredAt: 0
  },
  clue_claw_marks: {
    id: 'clue_claw_marks',
    title: 'Serrated Claw Markings',
    category: 'victim',
    roomFound: 'Library',
    description: 'Four deep gouges carved through four inches of solid English oak. The spacing matches a creature at least eight feet tall.',
    discoveredAt: 0
  },
  clue_laudanum_prescription: {
    id: 'clue_laudanum_prescription',
    title: 'Sedative Log #84',
    category: 'suspect',
    roomFound: 'Bedroom',
    description: 'Dr. Hayes increased Alistair\'s dosage of wolfsbane tincture threefold on the night of the full moon.',
    discoveredAt: 0
  },
  clue_cctv_werewolf: {
    id: 'clue_cctv_werewolf',
    title: 'CCTV Reel: The Corridor Beast',
    category: 'victim',
    roomFound: 'Security Room',
    description: 'Grainy surveillance camera footage captures a hunched, lupine monstrosity stalking through the fog-drenched corridor.',
    discoveredAt: 0
  },
  clue_basement_altar: {
    id: 'clue_basement_altar',
    title: 'The Ritual of Transfer',
    category: 'occult',
    roomFound: 'Basement',
    description: 'An obsidian altar surrounded by silver runes. Alistair did not merely die—his consciousness was guided into a vessel.',
    discoveredAt: 0
  },
  clue_victoria_confession: {
    id: 'clue_victoria_confession',
    title: 'Victoria\'s Dying Confession',
    category: 'suspect',
    roomFound: 'Bedroom',
    description: 'Her spirit confessed: Alistair did not merely die—his experiment to conquer mortality fused his mind into the predatory beast.',
    discoveredAt: 0
  },
  clue_edward_warning: {
    id: 'clue_edward_warning',
    title: 'Edward\'s Spectral Witness',
    category: 'victim',
    roomFound: 'Library',
    description: 'Edward\'s spirit swore the towering creature that tore through the library walls possessed Alistair\'s own signet ring.',
    discoveredAt: 0
  },
  clue_hayes_revelation: {
    id: 'clue_hayes_revelation',
    title: 'Dr. Hayes\' Transference Log',
    category: 'occult',
    roomFound: 'Security Room',
    description: 'Dr. Hayes admitted he formulated the silver and wolfsbane serum to bridge neural synapses during the lunar solstice.',
    discoveredAt: 0
  }
};
