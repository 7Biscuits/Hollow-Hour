import { InteractiveObjectConfig } from '../entities/InteractiveObject';

export interface RoomDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  floorTile: 'tile_floor_wood' | 'tile_floor_stone';
  wallTile: 'tile_wall_wood' | 'tile_wall_stone';
  carpetArea?: { x: number; y: number; w: number; h: number };
  objects: InteractiveObjectConfig[];
  doors: InteractiveObjectConfig[];
  sconces?: { x: number; y: number }[];
  defaultSpawn: { x: number; y: number };
}

export const MANSION_ROOMS: Record<string, RoomDefinition> = {
  entrance_hall: {
    id: 'entrance_hall',
    name: 'ENTRANCE HALL',
    width: 480,
    height: 320,
    floorTile: 'tile_floor_wood',
    wallTile: 'tile_wall_wood',
    carpetArea: { x: 192, y: 120, w: 96, h: 140 },
    defaultSpawn: { x: 240, y: 250 },
    sconces: [
      { x: 96, y: 60 },
      { x: 384, y: 60 }
    ],
    doors: [
      {
        id: 'door_to_hallway',
        name: 'ARCHWAY TO MAIN HALLWAY',
        description: 'An open arched corridor leading deeper into Blackwood Manor.',
        texture: 'obj_door',
        x: 240,
        y: 50,
        isDoor: true,
        targetRoom: 'main_hallway',
        targetSpawn: { x: 240, y: 260 },
        interactionRadius: 36
      },
      {
        id: 'door_to_security',
        name: 'REINFORCED DOOR',
        description: 'A heavy wooden door marked "SECURITY / PRIVATE".',
        texture: 'obj_door',
        x: 430,
        y: 180,
        isDoor: true,
        targetRoom: 'security_room',
        targetSpawn: { x: 70, y: 180 },
        interactionRadius: 36
      },
      {
        id: 'front_entrance_doors',
        name: 'MANSION GATES',
        description: 'The front entrance doors are bolted shut from the outside with heavy iron chains. There is no turning back.',
        texture: 'obj_door',
        x: 240,
        y: 305,
        isDoor: false,
        isLocked: true,
        interactionRadius: 32
      }
    ],
    objects: [
      {
        id: 'grandfather_clock',
        name: 'ANTIQUE GRANDFATHER CLOCK',
        description: 'A towering mahogany clock. The ornate hands are frozen permanently at 11:55 — five minutes before the hollow hour.',
        details: [
          'The pendulum is motionless.',
          'Carved into the brass face is a Latin phrase: "MEMENTO VIVERE, MEMENTO MORI".',
          'Press [E] to manipulate the clock hands.'
        ],
        texture: 'obj_clock',
        x: 100,
        y: 95,
        collisionWidth: 20,
        collisionHeight: 16,
        clueId: 'clock_stopped_time',
        grantClueId: 'clue_grandfather_clock',
        isClockPuzzle: true
      },
      {
        id: 'portrait_alistair',
        name: 'PORTRAIT OF LORD ALISTAIR',
        description: 'A somber oil painting of Lord Alistair Blackthorn in Victorian evening wear.',
        details: [
          'His eyes seem to follow you with an unnatural intensity.',
          'A plaque reads: "Lord Alistair Blackthorn (1845 - 1892) — Seeker of Eternity".'
        ],
        texture: 'obj_portrait',
        x: 380,
        y: 85,
        collisionWidth: 22,
        collisionHeight: 12,
        clueId: 'alistair_portrait_clue'
      }
    ]
  },

  main_hallway: {
    id: 'main_hallway',
    name: 'MAIN CORRIDOR',
    width: 480,
    height: 320,
    floorTile: 'tile_floor_wood',
    wallTile: 'tile_wall_wood',
    carpetArea: { x: 176, y: 80, w: 128, h: 200 },
    defaultSpawn: { x: 240, y: 260 },
    sconces: [
      { x: 120, y: 60 },
      { x: 360, y: 60 }
    ],
    doors: [
      {
        id: 'door_to_foyer',
        name: 'DOORWAY TO FOYER',
        description: 'Returns to the Entrance Hall.',
        texture: 'obj_door',
        x: 240,
        y: 300,
        isDoor: true,
        targetRoom: 'entrance_hall',
        targetSpawn: { x: 240, y: 80 },
        interactionRadius: 36
      },
      {
        id: 'door_to_library',
        name: 'LIBRARY ARCH',
        description: 'Double doors leading into the private library.',
        texture: 'obj_door',
        x: 50,
        y: 160,
        isDoor: true,
        targetRoom: 'library',
        targetSpawn: { x: 410, y: 160 },
        interactionRadius: 36
      },
      {
        id: 'door_to_bedroom',
        name: 'MASTER BEDROOM DOOR',
        description: 'A polished oak door leading to the master chambers.',
        texture: 'obj_door',
        x: 430,
        y: 160,
        isDoor: true,
        targetRoom: 'bedroom',
        targetSpawn: { x: 70, y: 160 },
        interactionRadius: 36,
        isLocked: true,
        requiredKey: 'item_brass_key',
        lockedMessage: 'Locked. The keyhole requires the Tarnished Brass Key.'
      },
      {
        id: 'door_to_basement',
        name: 'CELLAR STAIRCASE DOOR',
        description: 'A reinforced door at the north end of the corridor. Cold damp air wafts from underneath.',
        texture: 'obj_door',
        x: 240,
        y: 50,
        isDoor: true,
        targetRoom: 'basement',
        targetSpawn: { x: 240, y: 260 },
        interactionRadius: 36,
        isLocked: true,
        requiredKey: 'item_iron_key',
        lockedMessage: 'Locked with heavy iron deadbolts. Demands the Wrought Iron Key.'
      }
    ],
    objects: [
      {
        id: 'hallway_fireplace',
        name: 'GOTHIC STONE FIREPLACE',
        description: 'Dying embers cast faint reddish shadows. Someone lit this fire very recently.',
        details: [
          'Half-burned fragments of correspondence lie in the ash.',
          'One legible scrap reads: "...the wolf blood will stabilize the transference..."',
          'Recovered a Charred Diary Fragment from the hearth!'
        ],
        texture: 'obj_fireplace',
        x: 130,
        y: 75,
        collisionWidth: 40,
        collisionHeight: 18,
        clueId: 'clue_fireplace_notes',
        grantClueId: 'clue_fireplace_notes',
        grantItemId: 'item_charred_diary'
      },
      {
        id: 'wardrobe_hallway',
        name: 'CARVED MAHOGANY WARDROBE',
        description: 'A heavy Victorian double-door armoire. Deep enough to conceal a grown man inside.',
        details: [
          'You step inside and pull the louvered doors shut.',
          'Through the slats, you can observe the corridor in silence.',
          'Press [E] or [SPACE] to step out.'
        ],
        texture: 'obj_wardrobe',
        x: 350,
        y: 80,
        collisionWidth: 28,
        collisionHeight: 20,
        isHidingSpot: true
      }
    ]
  },

  library: {
    id: 'library',
    name: 'BLACKWOOD ARCHIVE & LIBRARY',
    width: 480,
    height: 320,
    floorTile: 'tile_floor_wood',
    wallTile: 'tile_wall_wood',
    carpetArea: { x: 160, y: 120, w: 160, h: 120 },
    defaultSpawn: { x: 410, y: 160 },
    sconces: [
      { x: 100, y: 60 },
      { x: 240, y: 60 }
    ],
    doors: [
      {
        id: 'door_library_exit',
        name: 'DOOR TO CORRIDOR',
        description: 'Leads back into the main corridor.',
        texture: 'obj_door',
        x: 440,
        y: 160,
        isDoor: true,
        targetRoom: 'main_hallway',
        targetSpawn: { x: 80, y: 160 },
        interactionRadius: 36
      }
    ],
    objects: [
      {
        id: 'bookshelf_occult',
        name: 'OCCULT BOOKCASE',
        description: 'Towering shelves containing rare grimoires, anatomical treatises, and folklore volumes.',
        details: [
          'Several volumes on Lycanthropy and Consciousness Metempsychosis have been pulled forward.',
          'A note between the pages notes: "Host creature must possess heightened predatory instinct to survive separation."'
        ],
        texture: 'obj_bookshelf',
        x: 90,
        y: 70,
        collisionWidth: 34,
        collisionHeight: 16,
        clueId: 'occult_books_clue',
        isBookshelfPuzzle: true
      },
      {
        id: 'bookshelf_history',
        name: 'BLACKTHORN GENEALOGY SHELF',
        description: 'Records of the Blackthorn bloodline dating back to 1640.',
        texture: 'obj_bookshelf',
        x: 140,
        y: 70,
        collisionWidth: 34,
        collisionHeight: 16
      },
      {
        id: 'study_desk',
        name: 'ALISTAIR\'S WRITING DESK',
        description: 'An antique mahogany bureau scattered with medical reports and handwritten diaries.',
        details: [
          'Journal entry dated October 27th: "The physician gave me two months. I refuse to decay in a bed while Margaret watches. Tonight, the cellar ritual begins."',
          'Found an antique silver pocket watch frozen at 3:33 inside the drawer!'
        ],
        texture: 'obj_desk',
        x: 240,
        y: 160,
        collisionWidth: 36,
        collisionHeight: 16,
        clueId: 'alistair_diary_clue',
        grantClueId: 'clue_claw_marks',
        grantItemId: 'item_pocket_watch'
      },
      {
        id: 'wardrobe_library',
        name: 'ARCHIVE CABINET WARDROBE',
        description: 'An imposing oak wardrobe lined with musty coats and mothballs. Spacious enough to hide within.',
        details: [
          'You slip into the dark interior behind the hanging coats.',
          'Through the narrow gap, the library stacks are visible.',
          'Press [E] or [SPACE] to step out.'
        ],
        texture: 'obj_wardrobe',
        x: 370,
        y: 80,
        collisionWidth: 28,
        collisionHeight: 20,
        isHidingSpot: true
      }
    ]
  },

  bedroom: {
    id: 'bedroom',
    name: 'MASTER SUITE',
    width: 480,
    height: 320,
    floorTile: 'tile_floor_wood',
    wallTile: 'tile_wall_wood',
    carpetArea: { x: 190, y: 110, w: 140, h: 140 },
    defaultSpawn: { x: 70, y: 160 },
    sconces: [
      { x: 240, y: 60 },
      { x: 380, y: 60 }
    ],
    doors: [
      {
        id: 'door_bedroom_exit',
        name: 'DOOR TO CORRIDOR',
        description: 'Returns to the main corridor.',
        texture: 'obj_door',
        x: 40,
        y: 160,
        isDoor: true,
        targetRoom: 'main_hallway',
        targetSpawn: { x: 400, y: 160 },
        interactionRadius: 36
      }
    ],
    objects: [
      {
        id: 'master_canopy_bed',
        name: 'FOUR-POSTER CANOPY BED',
        description: 'A lavish bed with crumpled crimson linens. The pillows are disheveled, as though someone fled in sudden terror.',
        details: [
          'Deep claw marks slash across the mahogany bedpost.',
          'Animalistic tufts of coarse dark fur cling to the splintered wood.'
        ],
        texture: 'obj_bed',
        x: 340,
        y: 90,
        collisionWidth: 40,
        collisionHeight: 24,
        clueId: 'claw_marks_clue'
      },
      {
        id: 'bedroom_desk',
        name: 'MARGARET\'S VANITY DRESSER',
        description: 'A perfume-scented dressing table with shattered glass mirror shards.',
        details: [
          'A handwritten letter from Margaret: "Alistair is no longer in his body. What came through the circle is starving... God forgive us."',
          'Found a bottle of prescribed Laudanum beside the mirror.'
        ],
        texture: 'obj_desk',
        x: 160,
        y: 80,
        collisionWidth: 36,
        collisionHeight: 16,
        clueId: 'clue_laudanum_prescription',
        grantClueId: 'clue_laudanum_prescription',
        grantItemId: 'item_laudanum'
      },
      {
        id: 'wardrobe_bedroom',
        name: 'ORNATE MASTER WARDROBE',
        description: 'A tall wardrobe with brass filigree handles. The scent of lavender and old velvet hangs in the air.',
        details: [
          'You conceal yourself among Margaret\'s velvet dresses.',
          'The shadows inside are deep and sheltering.',
          'Press [E] or [SPACE] to step out.'
        ],
        texture: 'obj_wardrobe',
        x: 100,
        y: 80,
        collisionWidth: 28,
        collisionHeight: 20,
        isHidingSpot: true
      }
    ]
  },

  security_room: {
    id: 'security_room',
    name: 'SECURITY & SURVEILLANCE ROOM',
    width: 480,
    height: 320,
    floorTile: 'tile_floor_stone',
    wallTile: 'tile_wall_stone',
    defaultSpawn: { x: 70, y: 180 },
    sconces: [
      { x: 140, y: 60 },
      { x: 340, y: 60 }
    ],
    doors: [
      {
        id: 'door_security_exit',
        name: 'DOOR TO ENTRANCE HALL',
        description: 'Returns to the entrance hall.',
        texture: 'obj_door',
        x: 40,
        y: 180,
        isDoor: true,
        targetRoom: 'entrance_hall',
        targetSpawn: { x: 400, y: 180 },
        interactionRadius: 36
      }
    ],
    objects: [
      {
        id: 'cctv_console',
        name: 'SURVEILLANCE CONSOLE',
        description: 'A bank of cathode-ray tube monitors wired to cameras placed across Blackwood Manor.',
        details: [
          'Feed 1: Entrance Foyer — Empty, shadows dancing.',
          'Feed 2: Main Hallway — A monstrous, hunched silhouette momentarily darts past the lens!',
          'Feed 3: Cellar Lab — An iron cage door stands mangled and bent open from within.',
          'Extracted Surveillance Reel #3 from the console tape drive!'
        ],
        texture: 'obj_cctv',
        x: 240,
        y: 80,
        collisionWidth: 38,
        collisionHeight: 20,
        clueId: 'cctv_footage_clue',
        grantClueId: 'clue_cctv_werewolf',
        grantItemId: 'item_cctv_tape',
        isCCTVPuzzle: true
      }
    ]
  },

  basement: {
    id: 'basement',
    name: 'SUB-CELLAR & RITUAL CRYPT',
    width: 480,
    height: 320,
    floorTile: 'tile_floor_stone',
    wallTile: 'tile_wall_stone',
    defaultSpawn: { x: 240, y: 260 },
    sconces: [
      { x: 80, y: 60 },
      { x: 400, y: 60 }
    ],
    doors: [
      {
        id: 'door_basement_exit',
        name: 'STAIRS TO GROUND FLOOR',
        description: 'Stone stairs leading back up to the main hallway.',
        texture: 'obj_door',
        x: 240,
        y: 300,
        isDoor: true,
        targetRoom: 'main_hallway',
        targetSpawn: { x: 240, y: 90 },
        interactionRadius: 36
      }
    ],
    objects: [
      {
        id: 'ritual_altar',
        name: 'OCCULT RITUAL ALTAR',
        description: 'A slab of obsidian stone etched with esoteric circles and Latin incantations of transmutation.',
        details: [
          'Dried crimson residue stains the stone troughs.',
          'A broken restraint shackle is anchored into the bedrock.',
          'An empty silver syringe labeled "Serum 9 - Neural Stabilizer" lies on the flagstones.',
          'Recovered an Ceremonial Athame resting upon the altar pedestal!'
        ],
        texture: 'obj_altar',
        x: 240,
        y: 130,
        collisionWidth: 38,
        collisionHeight: 22,
        clueId: 'ritual_altar_clue',
        grantClueId: 'clue_basement_altar',
        grantItemId: 'item_ritual_dagger',
        isOccultPuzzle: true
      }
    ]
  }
};
