window.TTF_DATA = (() => {
  const ASSET_BASE = "../../assets/games/thru-the-fire";
  const item = (id, name, meaning, risk = "savable") => ({
    id,
    name,
    meaning,
    risk,
    asset: `${ASSET_BASE}/items/game-ready/${id}.png`
  });

  const ITEMS = {
    family_photos: item("family_photos", "Family photographs", "Faces, history, and moments that cannot be recreated."),
    photo_album: item("photo_album", "Family photo album", "A physical record of years the cloud never captured."),
    important_letter: item("important_letter", "Handwritten letter", "The words are replaceable only if you still remember them."),
    family_heirloom: item("family_heirloom", "Family heirloom", "Its value comes from who carried it before you."),
    laptop: item("laptop", "Laptop", "Work, records, passwords, and unfinished plans."),
    smartphone: item("smartphone", "Phone", "Your contacts, access, proof, and immediate connection."),
    camera: item("camera", "Camera", "The device that holds what you chose to document."),
    passport: item("passport", "Passport", "Identity, movement, and the ability to begin again elsewhere."),
    insurance_policy: item("insurance_policy", "Insurance policy", "Paperwork that may determine what happens after the fire."),
    legal_documents: item("legal_documents", "Legal documents", "Proof of ownership, identity, and decisions already made."),
    birth_certificate: item("birth_certificate", "Birth certificate", "A small page that proves a life in systems built on paperwork."),
    cash_stack: item("cash_stack", "Emergency cash", "Immediate flexibility when cards, apps, and accounts are uncertain."),
    gold_watch: item("gold_watch", "Inherited watch", "A valuable object made heavier by memory."),
    ring: item("ring", "Wedding ring", "A symbol whose meaning is larger than its size."),
    medication: item("medication", "Medication", "Something that may be needed before anything else can be replaced."),
    first_aid: item("first_aid", "First-aid kit", "Useful now, even when almost everything else is about later."),
    wallet: item("wallet", "Wallet", "Identification, access, and the basics needed outside the house."),
    checkbook: item("checkbook", "Checkbook", "A paper trail and another way to access what remains."),
    car_keys: item("car_keys", "Car keys", "Transportation, escape, and a way to move the family forward."),
    front_door_key: item("front_door_key", "Spare house key", "A key to a place that may no longer be enterable."),
    backpack: item("backpack", "Emergency backpack", "A few prepared essentials in one reachable place."),
    flashlight: item("flashlight", "Flashlight", "A practical tool for whatever waits beyond the front door."),
    external_hard_drive: item("external_hard_drive", "Studio hard drive", "Years of sessions, masters, drafts, and work in progress."),
    usb_drive: item("usb_drive", "USB archive", "Tiny enough to carry, large enough to hold a chapter of your life."),
    vinyl_records: item("vinyl_records", "Vinyl collection", "Music you can replace in sound, but not always in history."),
    vinyl_crate: item("vinyl_crate", "Rare vinyl crate", "A curated collection built one find at a time."),
    studio_mic: item("studio_mic", "Studio microphone", "The tool that captured your voice when the ideas were alive."),
    mixing_console: item("mixing_console", "Mixing console", "Expensive equipment, but also the center of a creative routine."),
    drum_machine: item("drum_machine", "Drum machine", "A familiar creative instrument tied to unfinished music."),
    guitar: item("guitar", "Guitar", "An instrument with wear, history, and a sound shaped by use."),
    studio_headphones: item("studio_headphones", "Studio headphones", "Replaceable gear carrying countless private listening hours."),
    game_console: item("game_console", "Game console", "Entertainment, saved progress, and time shared with family."),
    controller: item("controller", "Favorite controller", "Easy to replace in theory; familiar in ways a new one is not."),
    sd_cards: item("sd_cards", "Memory cards", "Small objects holding footage, photos, and projects not backed up."),
    toolbox: item("toolbox", "Toolbox", "The practical ability to repair what can still be repaired."),
    safe_box: item("safe_box", "Small safe box", "The container suggests importance, but the clock will not tell you what is inside."),
    diary_journal: item("diary_journal", "Private journal", "Thoughts that were never written anywhere else."),
    map: item("map", "Marked family map", "Routes, places, and a record of where the family has been."),
    jacket: item("jacket", "Winter jacket", "Ordinary until you are outside without what you expected to have."),
    purse: item("purse", "Purse", "Personal essentials gathered in one place."),
    shoes: item("shoes", "Shoes by the door", "The most practical object can become the most urgent one."),
    watch: item("watch", "Everyday watch", "Time is already disappearing, but the object still carries routine."),
    headphones: item("headphones", "Headphones", "A replaceable object tied to private escapes and creative focus."),
    microphone: item("microphone", "Microphone", "A tool for expression sitting inside a room running out of time."),
    audio_interface: item("audio_interface", "Audio interface", "The bridge between the performance and the recording."),
    midi_keyboard: item("midi_keyboard", "MIDI keyboard", "A creative tool whose replacement cost competes with its familiarity."),
    turntable: item("turntable", "Turntable", "The machine that made the collection part of the room."),
    safe_box_burning: item("safe_box", "Safe box", "The lock held. The surrounding heat did not.", "burning"),
    family_photos_burning: item("family_photos", "Family photographs", "The frame is already burning around the edges.", "burning"),
    photo_album_burning: item("photo_album", "Photo album", "The pages have begun to curl and blacken.", "burning"),
    laptop_burning: item("laptop", "Laptop", "The screen has cracked and the battery casing is swelling.", "burning"),
    vinyl_burning: item("vinyl_records", "Vinyl records", "The heat has already warped the nearest records.", "burning"),
    console_burning: item("game_console", "Game console", "The plastic housing is melting into the shelf.", "burning"),
    documents_burning: item("legal_documents", "Document folder", "The top pages are already ash.", "burning"),
    jacket_burning: item("jacket", "Jacket", "Flame has reached the sleeve.", "burning")
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
      choiceCount: 2,
      burningCount: 1,
      time: 16,
      pools: {
        savable: [ITEMS.family_photos, ITEMS.photo_album, ITEMS.important_letter, ITEMS.family_heirloom, ITEMS.laptop, ITEMS.camera, ITEMS.diary_journal],
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
      choiceCount: 1,
      burningCount: 2,
      time: 12,
      pools: {
        savable: [ITEMS.medication, ITEMS.first_aid, ITEMS.wallet, ITEMS.checkbook, ITEMS.cash_stack, ITEMS.flashlight],
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
      choiceCount: 2,
      burningCount: 1,
      time: 15,
      pools: {
        savable: [ITEMS.passport, ITEMS.insurance_policy, ITEMS.legal_documents, ITEMS.birth_certificate, ITEMS.car_keys, ITEMS.ring, ITEMS.gold_watch, ITEMS.medication, ITEMS.purse],
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
      choiceCount: 2,
      burningCount: 1,
      time: 14,
      pools: {
        savable: [ITEMS.game_console, ITEMS.controller, ITEMS.laptop, ITEMS.sd_cards, ITEMS.camera, ITEMS.smartphone, ITEMS.toolbox, ITEMS.backpack],
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
      choiceCount: 2,
      burningCount: 2,
      time: 16,
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
      choiceCount: 1,
      burningCount: 1,
      time: 13,
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
