import { describe, it, expect } from 'vitest';
import { MANSION_ROOMS } from '../world/MansionData';

describe('Mansion Data and Room Layouts', () => {
  it('contains the mandatory six initial exploration rooms', () => {
    expect(MANSION_ROOMS['entrance_hall']).toBeDefined();
    expect(MANSION_ROOMS['main_hallway']).toBeDefined();
    expect(MANSION_ROOMS['library']).toBeDefined();
    expect(MANSION_ROOMS['bedroom']).toBeDefined();
    expect(MANSION_ROOMS['security_room']).toBeDefined();
    expect(MANSION_ROOMS['basement']).toBeDefined();
  });

  it('connects the entrance hall to the main hallway and security room', () => {
    const entrance = MANSION_ROOMS['entrance_hall'];
    const targetRooms = entrance.doors.map(d => d.targetRoom).filter(Boolean);
    expect(targetRooms).toContain('main_hallway');
    expect(targetRooms).toContain('security_room');
  });

  it('includes the grandfather clock and Lord Alistair portrait in the entrance hall', () => {
    const entrance = MANSION_ROOMS['entrance_hall'];
    const clock = entrance.objects.find(o => o.id === 'grandfather_clock');
    const portrait = entrance.objects.find(o => o.id === 'portrait_alistair');

    expect(clock).toBeDefined();
    expect(clock?.clueId).toBe('clock_stopped_time');
    expect(portrait).toBeDefined();
    expect(portrait?.clueId).toBe('alistair_portrait_clue');
  });

  it('includes occult bookshelves and Alistair desk in the library', () => {
    const library = MANSION_ROOMS['library'];
    const desk = library.objects.find(o => o.id === 'study_desk');
    expect(desk).toBeDefined();
    expect(desk?.clueId).toBe('alistair_diary_clue');
  });

  it('includes the CCTV surveillance console in the security room', () => {
    const security = MANSION_ROOMS['security_room'];
    const cctv = security.objects.find(o => o.id === 'cctv_console');
    expect(cctv).toBeDefined();
    expect(cctv?.clueId).toBe('cctv_footage_clue');
  });

  it('includes the occult ritual altar in the basement crypt', () => {
    const basement = MANSION_ROOMS['basement'];
    const altar = basement.objects.find(o => o.id === 'ritual_altar');
    expect(altar).toBeDefined();
    expect(altar?.clueId).toBe('ritual_altar_clue');
  });
});
