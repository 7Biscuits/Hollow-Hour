import { InventoryItem } from '../types';

export const ITEM_CATALOG: Record<string, InventoryItem> = {
  item_brass_key: {
    id: 'item_brass_key',
    name: 'Tarnished Brass Key',
    category: 'key',
    description: 'A heavy brass key engraved with the Vance crest: a raven perched upon an hourglass.',
    examineText: 'The bit of the key has four distinct notches. It is cold to the touch and smells faintly of machine oil and dried lavender. It likely unlocks the Master Bedroom upstairs.',
    icon: 'icon_key_brass',
    canUse: true,
    targetId: 'door_bedroom'
  },
  item_iron_key: {
    id: 'item_iron_key',
    name: 'Wrought Iron Key',
    category: 'key',
    description: 'A dark, pitted iron key recovered from the mansion depths.',
    examineText: 'Thick and blackened by soot. The bow of the key is shaped like a weeping eye. It feels heavy enough to secure a dungeon or reinforced vault.',
    icon: 'icon_key_iron',
    canUse: true,
    targetId: 'door_basement'
  },
  item_pocket_watch: {
    id: 'item_pocket_watch',
    name: 'Silver Pocket Watch',
    category: 'curio',
    description: 'A cracked pocket watch discovered near Alistair Vance\'s study.',
    examineText: 'The crystal is fractured across the center. The hands are permanently seized at 3:33. On the inside lid, an inscription reads: "At the hollow hour, the vessel welcomes the beast."',
    icon: 'icon_pocket_watch',
    canUse: false
  },
  item_charred_diary: {
    id: 'item_charred_diary',
    name: 'Charred Diary Fragment',
    category: 'document',
    description: 'Partially burned pages pulled from the grand fireplace.',
    examineText: '"...October 28. The serum stabilizes the pulse, but the transformation demands blood. Victoria suspects nothing. Edward cowered when he heard the snarling beneath the floorboards. The mechanism will hold only until midnight..."',
    icon: 'icon_diary',
    canUse: false
  },
  item_clock_hand: {
    id: 'item_clock_hand',
    name: 'Ornate Clock Hand',
    category: 'tool',
    description: 'An intricate minute hand forged of antique brass with a fleur-de-lis tip.',
    examineText: 'It has two mounting pins on the underside that match the central arbor of the grandfather clock in the entrance hall.',
    icon: 'icon_clock_hand',
    canUse: true,
    targetId: 'obj_clock',
    canCombineWith: ['item_pocket_watch']
  },
  item_cctv_tape: {
    id: 'item_cctv_tape',
    name: 'Surveillance Reel #3',
    category: 'document',
    description: 'A magnetic tape spool labeled "EAST WING CORRIDOR - 02:45 AM".',
    examineText: 'The spool is tightly wound. With a working CCTV console, this tape could reveal what truly happened outside the bedroom before the screaming began.',
    icon: 'icon_cctv_tape',
    canUse: true,
    targetId: 'obj_cctv'
  },
  item_laudanum: {
    id: 'item_laudanum',
    name: 'Bottle of Laudanum',
    category: 'consumable',
    description: 'A brown glass apothecary tincture prescribed by Dr. Hayes.',
    examineText: 'The liquid is dark and viscous. The handwritten label reads: "For Alistair Vance. Ten drops before sundown to suppress muscular tremors and violent delirium."',
    icon: 'icon_laudanum',
    canUse: true
  },
  item_silver_sigil: {
    id: 'item_silver_sigil',
    name: 'Occult Silver Sigil',
    category: 'curio',
    description: 'A heavy medallion engraved with an inverted five-pointed star and lunar phases.',
    examineText: 'Carved with microscopic alchemical glyphs for silver, wolfsbane, and quicksilver. It radiates an uncanny chill that numbs your fingers.',
    icon: 'icon_silver_sigil',
    canUse: true,
    targetId: 'obj_altar'
  },
  item_ritual_dagger: {
    id: 'item_ritual_dagger',
    name: 'Ceremonial Athame',
    category: 'tool',
    description: 'A curved obsidian dagger with silver inlay along the fuller.',
    examineText: 'The pommel holds a dark ruby that catches the candlelight like coagulated blood. The blade has never been used for mundane cutting.',
    icon: 'icon_ritual_dagger',
    canUse: true,
    targetId: 'obj_altar'
  },
  item_gate_key: {
    id: 'item_gate_key',
    name: 'Wrought Iron Gate Key',
    category: 'key',
    description: 'A heavy iron skeleton key retrieved during the chaos.',
    examineText: 'Stamped with the Blackwood crest. Unlocks the towering front entrance gates of the estate.',
    icon: 'icon_key_iron',
    canUse: true,
    targetId: 'front_entrance_doors'
  }
};
