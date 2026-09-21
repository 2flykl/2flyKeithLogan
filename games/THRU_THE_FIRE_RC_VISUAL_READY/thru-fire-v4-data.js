window.TTF_DATA = (() => {
  const ASSET_BASE = "assets";
  const itemMap = {
    family_photos: 'family_photo.jpg',
    photo_album: 'photo_album.jpg',
    important_letter: 'documents.jpg',
    family_heirloom: 'ring.jpg',
    laptop: 'laptop.jpg',
    smartphone: 'phone.jpg',
    camera: 'phone.jpg',
    passport: 'passport.jpg',
    insurance_policy: 'documents.jpg',
    legal_documents: 'documents.jpg',
    birth_certificate: 'documents.jpg',
    cash_stack: 'cash.jpg',
    gold_watch: 'ring.jpg',
    ring: 'ring.jpg',
    medication: 'medication.jpg',
    first_aid: 'medication.jpg',
    wallet: 'wallet.jpg',
    checkbook: 'documents.jpg',
    car_keys: 'keys.jpg',
    front_door_key: 'keys.jpg',
    backpack: 'backpack.jpg',
    flashlight: 'keys.jpg',
    external_hard_drive: 'hard_drive.jpg',
    usb_drive: 'hard_drive.jpg',
    headphones: 'headphones.jpg',
    synth_keyboard: 'keyboard.jpg',
    microphone: 'microphone.jpg',
    demo_tape: 'hard_drive.jpg',
    composition_notebook: 'documents.jpg',
    vintage_vinyl: 'photo_album.jpg',
    guitar: 'keyboard.jpg',
    stuffed_animal: 'teddy.jpg',
    baby_blanket: 'teddy.jpg',
    toy_box: 'blocks.jpg',
    favorite_book: 'drawing.jpg'
  };
  const item = (id, name, meaning, weight = "light", risk = "savable") => ({
    id,
    name,
    meaning,
    weight,
    timeCost: weight === "heavy" ? 2 : weight === "medium" ? 1 : 0,
    risk,
    asset: `${ASSET_BASE}/items/${itemMap[id] || 'documents.jpg'}`
  });

  const ITEMS = {
    family_photos: item("family_photos", "Family photographs", "Faces, history, and moments that cannot be recreated.", "light"),
    photo_album: item("photo_album", "Family photo album", "A physical record of years the cloud never captured.", "medium"),
    important_letter: item("important_letter", "Handwritten letter", "The words are replaceable only if you still remember them.", "light"),
    family_heirloom: item("family_heirloom", "Family heirloom", "Its value comes from who carried it before you.", "heavy"),
    laptop: item("laptop", "Laptop", "Work, records, passwords, and unfinished plans.", "medium"),
    smartphone: item("smartphone", "Phone", "Your contacts, access, proof, and immediate connection.", "light"),
    camera: item("camera", "Camera", "The device that holds what you chose to document.", "light"),
    passport: item("passport", "Passport", "Identity, movement, and the ability to begin again elsewhere.", "light"),
    insurance_policy: item("insurance_policy", "Insurance policy", "Paperwork that may determine what happens after the fire.", "light"),
    legal_documents: item("legal_documents", "Legal documents", "Proof of ownership, identity, and decisions already made.", "light"),
    birth_certificate: item("birth_certificate", "Birth certificate", "A small page that proves a life in systems built on paperwork.", "light"),
    cash_stack: item("cash_stack", "Emergency cash", "Immediate flexibility when cards, apps, and accounts are uncertain.", "light"),
    gold_watch: item("gold_watch", "Inherited watch", "A valuable object made heavier by memory.", "medium"),
    ring: item("ring", "Wedding ring", "A symbol whose meaning is larger than its size.", "light"),
    medication: item("medication", "Medication", "Something that may be needed before anything else can be replaced.", "light"),
    first_aid: item("first_aid", "First-aid kit", "Useful now, even when almost everything else is about later.", "medium"),
    wallet: item("wallet", "Wallet", "Identification, access, and the basics needed outside the house.", "light"),
    checkbook: item("checkbook", "Checkbook", "A paper trail and another way to access what remains.", "light"),
    car_keys: item("car_keys", "Car keys", "Transportation, escape, and a way to move the family forward.", "light"),
    front_door_key: item("front_door_key", "Spare house key", "A key to a place that may no longer be enterable.", "light"),
    backpack: item("backpack", "Emergency backpack", "A few prepared essentials in one reachable place.", "medium"),
    flashlight: item("flashlight", "Flashlight", "A practical tool for whatever waits beyond the front door.", "light"),
    external_hard_drive: item("external_hard_drive", "Studio hard drive", "Years of sessions, masters, drafts, and work in progress.", "light"),
    usb_drive: item("usb_drive", "USB archive", "Tiny enough to carry, large enough to hold a chapter of your life.", "light"),
    vinyl_records: item("vinyl_records", "Vinyl collection", "Music you can replace in sound, but not always in history.", "medium"),
    vinyl_crate: item("vinyl_crate", "Rare vinyl crate", "A curated collection built one find at a time.", "heavy"),
    studio_mic: item("studio_mic", "Studio microphone", "The tool that captured your voice when the ideas were alive.", "medium"),
    mixing_console: item("mixing_console", "Mixing console", "Expensive equipment, but also the center of a creative routine.", "heavy"),
    drum_machine: item("drum_machine", "Drum machine", "A familiar creative instrument tied to unfinished music.", "heavy"),
    guitar: item("guitar", "Guitar", "An instrument with wear, history, and a sound shaped by use.", "heavy"),
    studio_headphones: item("studio_headphones", "Studio headphones", "Replaceable gear carrying countless private listening hours.", "light"),
    game_console: item("game_console", "Game console", "Entertainment, saved progress, and time shared with family.", "heavy"),
    controller: item("controller", "Favorite controller", "Easy to replace in theory; familiar in ways a new one is not.", "light"),
    sd_cards: item("sd_cards", "Memory cards", "Small objects holding footage, photos, and projects not backed up.", "light"),
    toolbox: item("toolbox", "Toolbox", "The practical ability to repair what can still be repaired.", "heavy"),
    safe_box: item("safe_box", "Small safe box", "The container suggests importance, but the clock will not tell you what is inside.", "heavy"),
    diary_journal: item("diary_journal", "Private journal", "Thoughts that were never written anywhere else.", "light"),
    map: item("map", "Marked family map", "Routes, places, and a record of where the family has been.", "light"),
    jacket: item("jacket", "Winter jacket", "Ordinary until you are outside without what you expected to have.", "medium"),
    purse: item("purse", "Purse", "Personal essentials gathered in one place.", "medium"),
    shoes: item("shoes", "Shoes by the door", "The most practical object can become the most urgent one.", "light"),
    watch: item("watch", "Everyday watch", "Time is already disappearing, but the object still carries routine.", "light"),
    headphones: item("headphones", "Headphones", "A replaceable object tied to private escapes and creative focus.", "light"),
    microphone: item("microphone", "Microphone", "A tool for expression sitting inside a room running out of time.", "medium"),
    audio_interface: item("audio_interface", "Audio interface", "The bridge between the performance and the recording.", "medium"),
    midi_keyboard: item("midi_keyboard", "MIDI keyboard", "A creative tool whose replacement cost competes with its familiarity.", "heavy"),
    turntable: item("turntable", "Turntable", "The machine that made the collection part of the room.", "heavy"),
    stuffed_animal: item("stuffed_animal", "Stuffed animal", "A childhood memory that carries emotional safety.", "light"),
    baby_blanket: item("baby_blanket", "Baby blanket", "Soft and irreplaceable in memory.", "light"),
    toy_box: item("toy_box", "Favorite toy box", "A container of childhood wonder.", "heavy"),
    favorite_book: item("favorite_book", "Annotated book", "Margin notes written by someone who is no longer here.", "light"),

    safe_box_burning: item("safe_box", "Safe box", "The lock held. The surrounding heat did not.", "heavy", "burning"),
    family_photos_burning: item("family_photos", "Family photographs", "The frame is already burning around the edges.", "light", "burning"),
    photo_album_burning: item("photo_album", "Photo album", "The pages have begun to curl and blacken.", "medium", "burning"),
    laptop_burning: item("laptop", "Laptop", "The screen has cracked and the battery casing is swelling.", "medium", "burning"),
    vinyl_burning: item("vinyl_records", "Vinyl records", "The heat has already warped the nearest records.", "medium", "burning"),
    console_burning: item("game_console", "Game console", "The plastic housing is melting into the shelf.", "heavy", "burning"),
    documents_burning: item("legal_documents", "Document folder", "The top pages are already ash.", "light", "burning"),
    jacket_burning: item("jacket", "Jacket", "Flame has reached the sleeve.", "medium", "burning")
  };

  const rooms = [
    {
      id: "living-room",
      name: "Living Room",
      tag: "MEMORY",
      transition: "Smoke rolls across the ceiling as the room becomes unfamiliar.",
      prompts: [
        ["The room holds the story of the family.", "You may save one object before the smoke closes the path. Do you protect memory, identity, or immediate access?"],
        ["Some things can be purchased again. Some cannot.", "Turn through the room. The objects that glow are still reachable, but the clock will not wait for certainty."],
        ["The most visible object may not be the most valuable.", "Search the room in 45° steps and choose what leaves with you."]
      ],
      selectableMin: 3,
      selectableMax: 5,
      secondLookChance: 0.52,
      decisionFrameChance: 0.80,
      maxReveals: 2,
      burningCount: 1,
      burningChance: 0.65,
      time: 26,
      orientationGrace: 2.5,
      pools: {
        savable: [ITEMS.family_photos, ITEMS.photo_album, ITEMS.important_letter, ITEMS.family_heirloom, ITEMS.laptop, ITEMS.camera, ITEMS.diary_journal, ITEMS.favorite_book, ITEMS.gold_watch],
        burning: [ITEMS.family_photos_burning, ITEMS.photo_album_burning, ITEMS.laptop_burning]
      }
    },
    {
      id: "kitchen",
      name: "Kitchen",
      tag: "SURVIVAL",
      transition: "Heat moves across the cabinets faster than the smoke alarm can explain.",
      prompts: [
        ["The practical choice is not always obvious.", "There is less to choose from here, so there is less time. Find what helps the family in the first hours after the fire."],
        ["The kitchen is becoming unreachable.", "A useful object is still within reach. Other items have already crossed the line between damaged and gone."],
        ["What matters in the next ten minutes?", "Ignore what the room used to mean. Choose for what happens immediately after you leave."]
      ],
      selectableMin: 3,
      selectableMax: 5,
      secondLookChance: 0.52,
      decisionFrameChance: 0.80,
      maxReveals: 2,
      burningCount: 1,
      burningChance: 0.65,
      time: 21,
      orientationGrace: 2.0,
      pools: {
        savable: [ITEMS.medication, ITEMS.first_aid, ITEMS.wallet, ITEMS.checkbook, ITEMS.cash_stack, ITEMS.flashlight, ITEMS.car_keys],
        burning: [ITEMS.documents_burning, ITEMS.jacket_burning, ITEMS.safe_box_burning]
      }
    },
    {
      id: "master-bedroom",
      name: "Master Bedroom",
      tag: "IDENTITY",
      transition: "The room that held privacy now offers only seconds.",
      prompts: [
        ["Your document cabinet is on fire.", "Do you search for the papers, grab the car keys, or choose the object whose value is emotional rather than practical?"],
        ["Identity is scattered across objects.", "One choice may protect the future. Another may preserve a relationship to the past."],
        ["The room contains proof, access, and memory.", "You can carry only one of them out."]
      ],
      selectableMin: 3,
      selectableMax: 5,
      secondLookChance: 0.52,
      decisionFrameChance: 0.80,
      maxReveals: 2,
      burningCount: 1,
      burningChance: 0.65,
      time: 20,
      orientationGrace: 2.0,
      pools: {
        savable: [ITEMS.passport, ITEMS.insurance_policy, ITEMS.legal_documents, ITEMS.birth_certificate, ITEMS.car_keys, ITEMS.ring, ITEMS.gold_watch, ITEMS.medication, ITEMS.purse, ITEMS.safe_box, ITEMS.baby_blanket],
        burning: [ITEMS.documents_burning, ITEMS.jacket_burning, ITEMS.safe_box_burning]
      }
    },
    {
      id: "game-room",
      name: "Game Room",
      tag: "TIME",
      transition: "The room was built for escape. Now it is part of what you must escape from.",
      prompts: [
        ["Saved progress is not the same as saved time.", "Choose between equipment, stored memories, and the tools that created shared moments."],
        ["What did this room really hold?", "The expensive object may be replaceable. The data inside the smaller object may not be."],
        ["Entertainment becomes evidence of a life.", "Search before the heat reaches the electronics."]
      ],
      selectableMin: 3,
      selectableMax: 5,
      secondLookChance: 0.52,
      decisionFrameChance: 0.80,
      maxReveals: 2,
      burningCount: 1,
      burningChance: 0.65,
      time: 19,
      orientationGrace: 1.5,
      pools: {
        savable: [ITEMS.game_console, ITEMS.controller, ITEMS.laptop, ITEMS.sd_cards, ITEMS.camera, ITEMS.smartphone, ITEMS.toolbox, ITEMS.backpack, ITEMS.toy_box, ITEMS.stuffed_animal],
        burning: [ITEMS.console_burning, ITEMS.laptop_burning, ITEMS.jacket_burning]
      }
    },
    {
      id: "music-studio",
      name: "Music Studio",
      tag: "LEGACY",
      transition: "Years of sound are stored in objects the fire cannot understand.",
      prompts: [
        ["Years of unfinished work are inside this room.", "Some equipment can be replaced. Some recordings, masters, and ideas cannot."],
        ["Do you save the tool or what the tool created?", "Turn through the studio and decide whether legacy lives in the object, the data, or your ability to make it again."],
        ["The room holds work no audience has heard.", "You have seconds to decide which part of the creative process leaves with you."]
      ],
      selectableMin: 3,
      selectableMax: 5,
      secondLookChance: 0.52,
      decisionFrameChance: 0.80,
      maxReveals: 2,
      burningCount: 1,
      burningChance: 0.65,
      time: 20,
      orientationGrace: 1.5,
      pools: {
        savable: [ITEMS.external_hard_drive, ITEMS.usb_drive, ITEMS.vinyl_records, ITEMS.vinyl_crate, ITEMS.studio_mic, ITEMS.mixing_console, ITEMS.drum_machine, ITEMS.guitar, ITEMS.studio_headphones, ITEMS.audio_interface, ITEMS.midi_keyboard, ITEMS.turntable],
        burning: [ITEMS.vinyl_burning, ITEMS.laptop_burning, ITEMS.console_burning]
      }
    },
    {
      id: "hallway-front-entry",
      name: "Hallway / Front Entry",
      tag: "EXIT",
      transition: "The front door is visible. Every turn away from it has a cost.",
      prompts: [
        ["The exit is directly ahead.", "Press Arrow Up at the front door to leave immediately, or turn away for one final object."],
        ["Leaving is the safest choice.", "The hallway offers one last decision: escape now, or spend the remaining seconds searching."],
        ["The door is open.", "You can leave with what you already saved, or risk one final turn."]
      ],
      selectableMin: 3,
      selectableMax: 5,
      secondLookChance: 0.52,
      decisionFrameChance: 0.80,
      maxReveals: 2,
      burningCount: 1,
      burningChance: 0.65,
      time: 18,
      orientationGrace: 1.5,
      isExitRoom: true,
      pools: {
        savable: [ITEMS.backpack, ITEMS.medication, ITEMS.passport, ITEMS.cash_stack, ITEMS.front_door_key, ITEMS.flashlight, ITEMS.jacket, ITEMS.shoes, ITEMS.wallet, ITEMS.map],
        burning: [ITEMS.jacket_burning, ITEMS.documents_burning, ITEMS.family_photos_burning]
      }
    }
  ];

  return {
    assetBase: ASSET_BASE,
    directions: ["FRONT", "RIGHT-FRONT", "RIGHT", "RIGHT-BACK", "BACK", "LEFT-BACK", "LEFT", "LEFT-FRONT"],
    degrees: [0,45,90,135,180,225,270,315],
    rooms
  };
})();
