import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const seedData = {
  schemaVersion: "1.0",
  galaxies: [
    {
      id: "G2000",
      startYear: 2000,
      endYear: 2004,
      title: "2000–2004",
      regions: [
        { id: "G2000-R1", ordinal: 1, title: "Foundations", subtitle: "First Recordings & Early Work" },
        { id: "G2000-R2", ordinal: 2, title: "The Underground", subtitle: "Unreleased Catalog & Demos" },
        { id: "G2000-R3", ordinal: 3, title: "Early Formations", subtitle: "Artistic Identity Development" }
      ]
    },
    {
      id: "G2005",
      startYear: 2005,
      endYear: 2009,
      title: "2005–2009",
      regions: [
        { id: "G2005-R1", ordinal: 1, title: "Independent Rise", subtitle: "Mid-2000s Catalog" },
        { id: "G2005-R2", ordinal: 2, title: "Stage & Rhythm", subtitle: "Live Performances & Studio Era" },
        { id: "G2005-R3", ordinal: 3, title: "Sonic Evolution", subtitle: "Exploratory Production" }
      ]
    },
    {
      id: "G2010",
      startYear: 2010,
      endYear: 2014,
      title: "2010–2014",
      regions: [
        { id: "G2010-R1", ordinal: 1, title: "Digital Expansion", subtitle: "Web Catalog & Digital Releases" },
        { id: "G2010-R2", ordinal: 2, title: "Visual Storytelling", subtitle: "First Concept Films" },
        { id: "G2010-R3", ordinal: 3, title: "Collaborative Years", subtitle: "Community & Production" }
      ]
    },
    {
      id: "G2015",
      startYear: 2015,
      endYear: 2019,
      title: "2015–2019",
      regions: [
        { id: "G2015-R1", ordinal: 1, title: "Rethinking the Model", subtitle: "Anti-Algorithm Origins" },
        { id: "G2015-R2", ordinal: 2, title: "Aviation & Distance", subtitle: "Flight & Perspective" },
        { id: "G2015-R3", ordinal: 3, title: "Direct Audience Connection", subtitle: "Independent Distribution" }
      ]
    },
    {
      id: "G2020",
      startYear: 2020,
      endYear: 2024,
      title: "2020–2024",
      regions: [
        { id: "G2020-R1", ordinal: 1, title: "Resilience & Reflection", subtitle: "The Rebuilding Years" },
        { id: "G2020-R2", ordinal: 2, title: "The Anti-Algorithm Experiment", subtitle: "Decide What It's Worth" },
        { id: "G2020-R3", ordinal: 3, title: "Initial Playable Formats", subtitle: "Song-Centered Interactive Media" }
      ]
    },
    {
      id: "G2025",
      startYear: 2025,
      endYear: 2029,
      title: "2025–2029",
      regions: [
        { id: "G2025-R1", ordinal: 1, title: "Thru the Fire", subtitle: "Survival · Rebuilding · Purpose", theme: "fire" },
        { id: "G2025-R2", ordinal: 2, title: "The Awakening", subtitle: "I Woke Up in Africa — Heritage & Purpose", theme: "africa" },
        { id: "G2025-R3", ordinal: 3, title: "The Playable Frontier", subtitle: "Anti-Algorithm · Playable Experiences", theme: "frontier" }
      ]
    }
  ],
  celestialObjects: [
    // ── REGION I: THRU THE FIRE ─────────────────────────────────────────────
    {
      id: "OBJ-FIRE",
      kind: "planet",
      title: "Thru the Fire",
      subtitle: "Survival · Rebuilding · Purpose",
      galaxyId: "G2025",
      regionId: "G2025-R1",
      position: { x: -4500, y: 40, z: -2500 },
      visualTheme: "fire-scarred",
      accentColor: "#E45B28",
      description: "A project about surviving loss, rebuilding with intention, and deciding what matters most.",
      children: [
        {
          id: "FIRE-AUDIO",
          kind: "moon",
          title: "Audio Track",
          mediaKind: "audio",
          contentStatus: "live",
          mediaUrl: "https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3",
          description: "Thru the Fire — Original Soundtrack by 2Fly Keith Logan"
        },
        {
          id: "FIRE-VIDEO",
          kind: "moon",
          title: "Visual Story",
          mediaKind: "video",
          contentStatus: "live",
          mediaUrl: "https://video.wixstatic.com/video/85e419_f9fc9d5cab4144398fc4e45393a74802/1080p/mp4/file.mp4",
          posterUrl: "https://static.wixstatic.com/media/85e419_f9fc9d5cab4144398fc4e45393a74802f001.jpg",
          description: "Thru the Fire — Cinematic Visual Film"
        },
        {
          id: "FIRE-ARCHIVE",
          kind: "moon",
          title: "Rebuilding Archive",
          mediaKind: "archive",
          contentStatus: "live",
          description: "Thru the Fire is a creative record of loss, survival, and rebuilding. When time collapses, what do you protect, and what do you learn to release?"
        },
        {
          id: "FIRE-PLAY",
          kind: "satellite",
          title: "Playable Experience",
          mediaKind: "playable",
          contentStatus: "live",
          mediaUrl: "/games/thru-the-fire/index.html",
          description: "Thru the Fire — Timed interactive reflection on memory, value, and survival."
        }
      ]
    },

    // ── REGION II: THE AWAKENING (I WOKE UP IN AFRICA) ─────────────────────
    {
      id: "OBJ-AFRICA",
      kind: "planet",
      title: "I Woke Up in Africa",
      subtitle: "Awakening · Identity · Purpose",
      galaxyId: "G2025",
      regionId: "G2025-R2",
      position: { x: 0, y: 40, z: 4000 },
      visualTheme: "africa-sunrise",
      accentColor: "#D18C36",
      description: "A project centered on awakening, heritage, service, reflection, and purpose documented across Rwanda.",
      children: [
        {
          id: "AFRICA-AUDIO",
          kind: "moon",
          title: "Soundtrack",
          mediaKind: "audio",
          contentStatus: "live",
          mediaUrl: "https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3",
          description: "I Woke Up in Africa — Official Soundtrack"
        },
        {
          id: "AFRICA-DOC-INTRO",
          kind: "moon",
          title: "Docu: The Introduction",
          mediaKind: "video",
          contentStatus: "live",
          mediaUrl: "https://video.wixstatic.com/video/85e419_d1023bd1a591485aac6da0ca76c18ab6/1080p/mp4/file.mp4",
          posterUrl: "https://static.wixstatic.com/media/85e419_d1023bd1a591485aac6da0ca76c18ab6f001.jpg",
          description: "Documentary Chapter 1 — The Introduction"
        },
        {
          id: "AFRICA-DOC-HILL",
          kind: "moon",
          title: "Docu: Land of 1000 Hills",
          mediaKind: "video",
          contentStatus: "live",
          mediaUrl: "https://video.wixstatic.com/video/85e419_6b353e95cf4e467882c9c09e42991993/1080p/mp4/file.mp4",
          posterUrl: "https://static.wixstatic.com/media/85e419_6b353e95cf4e467882c9c09e42991993f001.jpg",
          description: "Documentary Chapter 4 — The Land of 1000 Hills"
        },
        {
          id: "AFRICA-DOC-MV",
          kind: "moon",
          title: "Music Video",
          mediaKind: "video",
          contentStatus: "live",
          mediaUrl: "https://video.wixstatic.com/video/85e419_391c04639be946c3aa158c986ca5cce9/1080p/mp4/file.mp4",
          posterUrl: "https://static.wixstatic.com/media/85e419_391c04639be946c3aa158c986ca5cce9f001.jpg",
          description: "I Woke Up in Africa — Official Music Video"
        },
        {
          id: "AFRICA-PHOTOS",
          kind: "moon",
          title: "Rwanda Photo Archive",
          mediaKind: "archive",
          contentStatus: "live",
          description: "Rwanda service journey documentation, community moments, landscapes, and mission photography."
        },
        {
          id: "AFRICA-PLAY",
          kind: "satellite",
          title: "Playable Experience",
          mediaKind: "playable",
          contentStatus: "live",
          mediaUrl: "/games/africa/index.html",
          description: "I Woke Up in Africa — Interactive Documentary Experience"
        }
      ]
    },

    // ── REGION III: THE PLAYABLE FRONTIER ──────────────────────────────────
    {
      id: "OBJ-STREAMS",
      kind: "planet",
      title: "Streams",
      subtitle: "Value · Attention · Legacy",
      galaxyId: "G2025",
      regionId: "G2025-R3",
      position: { x: 4000, y: 40, z: -2000 },
      visualTheme: "water-reflection",
      accentColor: "#168D94",
      description: "A project about the difference between attention, value, ownership, and what remains after the current passes.",
      children: [
        {
          id: "STREAMS-AUDIO",
          kind: "moon",
          title: "Audio Track",
          mediaKind: "audio",
          contentStatus: "live",
          mediaUrl: "https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3",
          description: "Streams — Original Song by 2Fly Keith Logan"
        },
        {
          id: "STREAMS-VIDEO",
          kind: "moon",
          title: "Visual Story",
          mediaKind: "video",
          contentStatus: "live",
          mediaUrl: "https://video.wixstatic.com/video/85e419_a47e3183ec8a41c6a6be17dfe5ce698a/1080p/mp4/file.mp4",
          posterUrl: "https://static.wixstatic.com/media/85e419_a47e3183ec8a41c6a6be17dfe5ce698af001.jpg",
          description: "Streams — Cinematic Film"
        },
        {
          id: "STREAMS-ARCHIVE",
          kind: "moon",
          title: "Artwork & Dossier",
          mediaKind: "archive",
          contentStatus: "live",
          description: "Streams explores the difference between attention and value. Digital media, reactions, money, ownership, and legacy move through the same current."
        },
        {
          id: "STREAMS-PLAY",
          kind: "satellite",
          title: "Playable Experience",
          mediaKind: "playable",
          contentStatus: "live",
          mediaUrl: "/games/streams/index.html",
          description: "Streams — Jump upstream across digital media platforms"
        }
      ]
    },
    {
      id: "OBJ-EBONY",
      kind: "planet",
      title: "Ebony Eyes",
      subtitle: "Focus · Perspective · Vision",
      galaxyId: "G2025",
      regionId: "G2025-R3",
      position: { x: 6500, y: -60, z: -3500 },
      visualTheme: "ebony-violet",
      accentColor: "#B7273B",
      description: "A dark R&B and visual experience focused on deep perspective, touch-to-lock mechanics, and vision.",
      children: [
        {
          id: "EBONY-AUDIO",
          kind: "moon",
          title: "Audio Track",
          mediaKind: "audio",
          contentStatus: "live",
          mediaUrl: "https://static.wixstatic.com/mp3/85e419_506638b15e0a4b49a92b519766eb69ce.mp3",
          description: "Ebony Eyes — Soundtrack"
        },
        {
          id: "EBONY-ARCHIVE",
          kind: "moon",
          title: "Archive Dossier",
          mediaKind: "archive",
          contentStatus: "live",
          description: "Ebony Eyes — Visual and atmospheric study."
        },
        {
          id: "EBONY-PLAY",
          kind: "satellite",
          title: "Playable Experience",
          mediaKind: "playable",
          contentStatus: "live",
          mediaUrl: "/games/ebony_eyes_game/index.html",
          description: "Ebony Eyes — Interactive Mobile Experience"
        }
      ]
    },
    {
      id: "OBJ-AVIATOR",
      kind: "planet",
      title: "Return of the Aviator",
      subtitle: "Altitude · Trajectory · Motion",
      galaxyId: "G2025",
      regionId: "G2025-R3",
      position: { x: 3000, y: 120, z: -5000 },
      visualTheme: "aviator-kinetic",
      accentColor: "#3A80C0",
      description: "High-altitude kinetic journey exploring flight, directional trajectories, and return.",
      children: [
        {
          id: "AVIATOR-ARCHIVE",
          kind: "moon",
          title: "Flight Dossier",
          mediaKind: "archive",
          contentStatus: "live",
          description: "Return of the Aviator — Motion, speed, and aviation archive."
        },
        {
          id: "AVIATOR-PLAY",
          kind: "satellite",
          title: "Playable Experience",
          mediaKind: "playable",
          contentStatus: "live",
          mediaUrl: "/games/return-of-the-aviator/index.html",
          description: "Return of the Aviator — High-speed flight experience"
        }
      ]
    },
    {
      id: "OBJ-AWAY",
      kind: "planet",
      title: "I Was Away",
      subtitle: "Reflection · Distance · Return",
      galaxyId: "G2025",
      regionId: "G2025-R3",
      position: { x: 5500, y: -40, z: -1000 },
      visualTheme: "away-reflection",
      accentColor: "#4B748B",
      description: "A reflective project about distance, return, maturity, and perspective.",
      children: [
        {
          id: "AWAY-AUDIO",
          kind: "moon",
          title: "Audio Track",
          mediaKind: "audio",
          contentStatus: "live",
          mediaUrl: "https://static.wixstatic.com/mp3/85e419_506638b15e0a4b49a92b519766eb69ce.mp3",
          description: "I Was Away — Song Track"
        },
        {
          id: "AWAY-VIDEO",
          kind: "moon",
          title: "Visual Story",
          mediaKind: "video",
          contentStatus: "live",
          mediaUrl: "https://video.wixstatic.com/video/85e419_de8f9ec40b844a068eae0ab148b44fb6/1080p/mp4/file.mp4",
          posterUrl: "https://static.wixstatic.com/media/85e419_de8f9ec40b844a068eae0ab148b44fb6f001.jpg",
          description: "I Was Away — Visual Film"
        },
        {
          id: "AWAY-PLAY",
          kind: "satellite",
          title: "Playable Experience",
          mediaKind: "playable",
          contentStatus: "live",
          mediaUrl: "/games/i-was-away/index.html",
          description: "I Was Away — Journal Experience"
        }
      ]
    },
    {
      id: "OBJ-FLYZONE",
      kind: "satellite",
      title: "FlyZone & TigerCall",
      subtitle: "Creative Tech · Beat Engine · PLX",
      galaxyId: "G2025",
      regionId: "G2025-R3",
      position: { x: 7500, y: 80, z: -2500 },
      visualTheme: "flyzone-tech",
      accentColor: "#168D94",
      description: "Interactive creative technology beginning with the 2Fly beat generator and human performance rhythm engine.",
      children: [
        {
          id: "FLYZONE-PLAY",
          kind: "satellite",
          title: "TigerCall PLX",
          mediaKind: "playable",
          contentStatus: "live",
          mediaUrl: "/games/TigerCall_StillStanding_PLX/index.html",
          description: "TigerCall Still Standing — Human Performance Rhythm Engine PLX"
        }
      ]
    }
  ],
  demoStars: generateClusters()
};

function generateClusters() {
  const stars = [];
  let count = 1;

  // Streams cluster (dense)
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 300 + Math.random() * 800;
    stars.push({
      id: `DEMO-STAR-${String(count++).padStart(6, '0')}`,
      demo: true,
      galaxyId: "G2025",
      regionId: "G2025-R3",
      clusterId: "cluster-streams",
      x: 4000 + Math.cos(angle) * r,
      y: (Math.random() - 0.5) * 250,
      z: -2000 + Math.sin(angle) * r,
      displayName: `Streams Supporter ${i + 1}`,
      message: "Moved upstream in the 2Fly Universe."
    });
  }

  // Fire cluster
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 250 + Math.random() * 700;
    stars.push({
      id: `DEMO-STAR-${String(count++).padStart(6, '0')}`,
      demo: true,
      galaxyId: "G2025",
      regionId: "G2025-R1",
      clusterId: "cluster-fire",
      x: -4500 + Math.cos(angle) * r,
      y: (Math.random() - 0.5) * 200,
      z: -2500 + Math.sin(angle) * r,
      displayName: `Fire Survivor ${i + 1}`,
      message: "Standing firm thru the fire."
    });
  }

  // Africa cluster
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 300 + Math.random() * 750;
    stars.push({
      id: `DEMO-STAR-${String(count++).padStart(6, '0')}`,
      demo: true,
      galaxyId: "G2025",
      regionId: "G2025-R2",
      clusterId: "cluster-africa",
      x: 0 + Math.cos(angle) * r,
      y: (Math.random() - 0.5) * 220,
      z: 4000 + Math.sin(angle) * r,
      displayName: `Rwanda Supporter ${i + 1}`,
      message: "Awakened in the 2Fly Universe."
    });
  }

  // Scatter remaining across galaxies
  const galaxies = ["G2000", "G2005", "G2010", "G2015", "G2020", "G2025"];
  for (let i = 0; i < 80; i++) {
    const g = galaxies[i % galaxies.length];
    stars.push({
      id: `DEMO-STAR-${String(count++).padStart(6, '0')}`,
      demo: true,
      galaxyId: g,
      regionId: `${g}-R1`,
      x: (Math.random() - 0.5) * 6000,
      y: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 6000,
      displayName: `Universe Traveler ${i + 1}`,
      message: "Exploring the 2Fly Creative History."
    });
  }

  return stars;
}

// Write to public/data/seed_universe.json and data/seed_universe.json
const pubPath = path.join(root, 'public', 'data', 'seed_universe.json');
const rootPath = path.join(root, 'data', 'seed_universe.json');

fs.mkdirSync(path.dirname(pubPath), { recursive: true });
fs.mkdirSync(path.dirname(rootPath), { recursive: true });

const jsonStr = JSON.stringify(seedData, null, 2);
fs.writeFileSync(pubPath, jsonStr, 'utf8');
fs.writeFileSync(rootPath, jsonStr, 'utf8');
console.log(`[build-seed-universe] Generated seed_universe.json with ${seedData.celestialObjects.length} objects and ${seedData.demoStars.length} stars.`);
