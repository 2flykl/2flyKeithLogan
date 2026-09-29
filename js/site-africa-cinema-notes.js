/* Editorial review: 2026-09-28. See docs/africa-cinema-research.md.
   Times are seconds in the original chapter files, not wall-clock timers. */
const africaNotes = (() => {
  const sources = {
    country: ['Government of Rwanda', 'https://www.gov.rw/about'],
    education: ['UNICEF · education', 'https://www.unicef.org/rwanda/education'],
    textbooks: ['UNICEF · 2021 report', 'https://www.unicef.org/rwanda/stories/making-learning-easier-children-disabilities'],
    intore: ['UNESCO · Intore', 'https://ich.unesco.org/en/RL/intore-02129'],
    traditions: ['Visit Rwanda · culture', 'https://visitrwanda.com/interests/rwandan-culture-and-traditions/'],
    heritage: ['Visit Rwanda · heritage', 'https://visitrwanda.com/tourism/interests/culture-heritage/'],
    agriculture: ['Rwanda Development Board', 'https://visitrwanda.com/investment-opportunities/agriculture/'],
    banana: ['RAB · banana research', 'https://www.rab.gov.rw/program-details?cHash=8da74e135ffb47a5e2d37f839907c07d&tx_news_pi1%5Baction%5D=detail&tx_news_pi1%5Bcontroller%5D=News&tx_news_pi1%5Bnews%5D=29245'],
    food: ['UN Tourism · 2024 guide', 'https://pre-webunwto.s3.eu-west-1.amazonaws.com/s3fs-public/2024-11/a-tour-of-african-gastronomy-rwanda.pdf?VersionId=aL6dwgxuvJuOedB0VSx7t2Qw8Sb3nJa0'],
    coffee: ['Visit Rwanda · coffee', 'https://visitrwanda.com/interests/coffee/'],
    tea: ['Visit Rwanda · tea', 'https://visitrwanda.com/interests/tea/']
  };
  // Each row pairs a visually reviewed moment with separately labelled national context.
  // Context is thematic; it does not identify the people, location, crop or custom in the footage.
  const chapters = [
    [
      [5.3, 'A personal opening', 'A close view of the filmmaker places a person against the wide, bright horizon.', 'country', 'Finding Rwanda', 'Rwanda is landlocked, bordered by Uganda, Tanzania, Burundi and the Democratic Republic of the Congo.'],
      [21.1, 'Light before detail', 'Warm light and clouds briefly carry the image, before the journey returns to people.', 'country', 'Beyond the coast', 'Rwanda has inland lakes including Kivu, Muhazi, Ihema, Bulera, Ruhondo and Mugesera.'],
      [42.3, 'A framed horizon', 'A phone enters the foreground as the sun sits low over the distant landscape.', 'country', 'A shared language', 'Kinyarwanda is spoken across Rwanda; English, French and Kiswahili are also official languages.'],
      [63.4, 'The frame fills', 'Pupils in yellow uniforms gather outdoors: the opening montage moves from landscape to a group encounter.', 'country', 'A capital to know', 'Kigali is Rwanda’s capital; the national currency is the Rwandan franc.'],
      [84.6, 'Between destinations', 'An aircraft and open sky bring travel itself into the opening montage.', 'country', 'Local time', 'Rwanda uses Central Africa Time: UTC plus two hours.']
    ],
    [
      [6.5, 'A seated conversation', 'The chapter opens with a seated interview beside large windows, before taking us into the classroom.', 'education', 'Access to learning', 'UNICEF’s Rwanda education work includes physical accessibility, teaching aids and individual learning plans.'],
      [25.9, 'Together in class', 'The classroom view brings pupils and adults into the same shared space.', 'education', 'Different ways to learn', 'Rwanda’s competency-based curriculum emphasizes student participation, including group work and individual learning plans.'],
      [51.8, 'The teaching surface', 'Writing on the classroom board brings everyday learning materials into close view.', 'textbooks', 'More than print', 'In 2021, UNICEF reported Rwandan textbook adaptations combining text, images, sign-language video and audio.'],
      [77.7, 'Closer to the pupils', 'A closer classroom view gives individual pupils more space within the group portrait.', 'textbooks', 'Designed with teachers', 'The 2021 accessible-textbook workshops involved teachers and facilitators with disabilities in adapting learning materials.'],
      [103.6, 'Returning to the interview', 'The film returns to the seated speaker, connecting classroom images with the chapter’s interview structure.', 'education', 'Supporting educators', 'UNICEF describes school-based mentoring in Rwanda that helps teachers develop more engaging classroom activities.']
    ],
    [
      [6.6, 'Before the gathering', 'A seated speaker against a brick wall introduces a chapter that moves into group activity.', 'country', 'A place for performance', 'Music and dance are integral to many Rwandan ceremonies.'],
      [26.3, 'The courtyard encounter', 'Pupils and adults gather outdoors, with raised hands and clapping visible across the group.', 'intore', 'Dance heritage', 'Intore, a Rwandan troupe dance, entered UNESCO’s Representative List of Intangible Cultural Heritage in 2024.'],
      [52.6, 'Participation in view', 'The camera moves close to the courtyard group, bringing gestures and faces into the foreground.', 'intore', 'Movement and poetry', 'In Intore, drums, horns, songs and poems accompany the dancers. This does not identify the dance filmed here.'],
      [78.9, 'Inside the classroom', 'The gathering moves indoors, where an adult stands among seated pupils.', 'intore', 'Passing it on', 'UNESCO documents Intore teaching in schools, universities, families and communities.'],
      [105.2, 'A shared floor', 'Pupils and adults stand together inside the classroom as the group activity continues.', 'intore', 'Gathering occasions', 'UNESCO records Intore at weddings, receptions for distinguished guests and harvest celebrations.']
    ],
    [
      [4.1, 'Sky and distance', 'Clouds take up much of the opening frame, with the land stretching beneath them.', 'country', 'The thousand hills', 'Rwanda’s familiar nickname, the Land of a Thousand Hills, reflects its hilly terrain.'],
      [16.3, 'Near and far', 'Roadside greenery sits in front of distant hills, giving the landscape several layers.', 'country', 'A high landscape', 'Rwanda’s elevation ranges from about 950 to 4,507 metres above sea level.'],
      [32.5, 'Along the road', 'The view passes an exposed roadside bank, shifting attention from distant scenery to the ground nearby.', 'country', 'Different habitats', 'Rwanda’s vegetation includes dense forest in the northwest and savanna in the east.'],
      [48.8, 'An open hillside', 'The view opens again onto green hills beneath a bright, cloud-filled sky.', 'tea', 'Cultivated hills', 'Tea is grown on Rwanda’s rolling hills; plantations include Gisovu and Gisakura near Nyungwe.'],
      [65.1, 'Into the built landscape', 'A decorated wall interrupts the hillside sequence, bringing human-made patterns into the landscape chapter.', 'traditions', 'Geometric craft', 'Imigongo is a Rwandan decorative art using cow dung and painted geometric designs.']
    ],
    [
      [4.8, 'A voice in the village', 'The chapter begins with a seated interview in a room lit by a nearby window.', 'traditions', 'Made by hand', 'Rwandan basket weaving has long produced containers for storing dry food and medicines.'],
      [19.0, 'An outdoor exchange', 'People face one another outside a brick building; the framing emphasizes the gathering.', 'traditions', 'Gifts of welcome', 'Traditional woven containers can mark weddings or serve as gifts of welcome.'],
      [38.0, 'An interview thread', 'The same seated interview returns between images of communal activity.', 'heritage', 'Culture in public', 'Kigali Cultural Village brings artisans and food vendors together with workshops, festivals and music.'],
      [57.1, 'Inside together', 'The film enters a room where a group gathers in soft light from the windows.', 'traditions', 'Working clay', 'Pottery is a longstanding Rwandan craft, with vessels used for cooking and storing liquids.'],
      [76.1, 'At room level', 'A closer indoor view puts the camera among the people gathered in the room.', 'country', 'Celebrating a harvest', 'Umuganura, Rwanda’s harvest celebration, also recognizes achievements beyond farming.']
    ],
    [
      [8.2, 'Tools at the beginning', 'Long wooden tool handles fill the opening view, introducing the chapter through the objects of work.', 'agriculture', 'Staple crops', 'Beans, rice, maize and potatoes are among Rwanda’s staple food crops.'],
      [32.7, 'Among the plants', 'Adults stand amid dense greenery, bringing the work into an outdoor growing space.', 'banana', 'Research behind a crop', 'Rwanda’s banana research program studies varieties, growing practices, pests and diseases.'],
      [65.3, 'Work and conversation', 'People face one another among the plants; the camera stays close to the participants.', 'agriculture', 'Beyond one harvest', 'Rwanda’s horticulture sector includes peas, bananas, passion fruit and avocados.'],
      [98.0, 'A closer working group', 'The framing tightens around people leaning into the activity beneath the foliage.', 'traditions', 'Shared public work', 'Umuganda is communal public work held on the last Saturday of the month—not a label for every group task.'],
      [130.6, 'At ground level', 'The camera looks down toward a hand tool and disturbed soil, making the physical task visible.', 'traditions', 'Public projects', 'Umuganda projects can include litter collection, tree planting and building homes for vulnerable people.']
    ],
    [
      [4.8, 'Leaves in hand', 'Hands work with green plant material in close-up before the camera widens to the group.', 'banana', 'Keeping varieties', 'Rwanda’s agriculture board maintains banana variety collections at Rubona and Ngoma.'],
      [19.2, 'Making together', 'Several people lean toward the leaves, keeping the making process at the centre of the image.', 'banana', 'Knowledge in circulation', 'RAB shares banana-growing guidance through farmer training, broadcast media and digital tools.'],
      [38.5, 'The group widens', 'The view opens to several participants outdoors, with the hillside beyond them.', 'food', 'Bananas in the kitchen', 'Matoke uses starchy green bananas, commonly steamed and mashed as an accompaniment.'],
      [57.7, 'Under the branches', 'Participants continue handling greenery beneath the trees, with hands and shared materials at the centre of the frame.', 'food', 'A drink tradition', 'Urwagwa is a traditional banana beer described in UN Tourism’s Rwanda gastronomy guide.'],
      [76.9, 'The crown appears', 'A participant wears a leafy headpiece while others stand nearby, making the chapter title visible.', 'food', 'Juice, too', 'Umutobe traditionally refers to unfermented juice made from bananas or other fruit.']
    ],
    [
      [10.0, 'Preparing the encounter', 'The opening brings us close to a participant inside an earthen-walled space.', 'food', 'Cassava leaves', 'Isombe is a dish made with pounded cassava leaves. This is food context, not an identification of the meal shown.'],
      [40.0, 'At the doorway', 'The view moves to people standing together by a doorway, keeping the exchange in its domestic setting.', 'food', 'A familiar accompaniment', 'Ugali is a thick preparation of maize or cassava flour, often served with beans, vegetables or meat.'],
      [79.9, 'People before plates', 'The camera stays with the people gathered outside, rather than presenting food as an isolated object.', 'food', 'From the grill', 'Brochettes are skewers of meat or fish, commonly grilled over charcoal.'],
      [119.9, 'Back inside', 'The earthen wall returns as the camera follows the gathering indoors.', 'food', 'Along Lake Kivu', 'Sambaza are small fish associated with Lake Kivu and often served fried.'],
      [159.8, 'At the serving dishes', 'Serving vessels come into view among the gathered people; the chapter connects preparation with sharing.', 'food', 'A varied table', 'UN Tourism’s Rwanda guide includes plantains, avocados, corn, millet and beans among traditional foods.']
    ],
    [
      [7.3, 'Revisiting an encounter', 'A person sits outside a windowed building as the conclusion begins its sequence of remembered places.', 'heritage', 'Preserving everyday life', 'Rwanda’s museums and galleries display historical objects alongside contemporary art.'],
      [29.2, 'A familiar crown', 'The leafy headpiece returns in a close view, echoing the earlier Banana Crown chapter.', 'heritage', 'A living art scene', 'The Rwanda Art Museum exhibits contemporary work from Rwanda and abroad.'],
      [58.5, 'A different interior', 'Warm hanging lights and people indoors add another setting to the conclusion’s montage.', 'heritage', 'Markets and creativity', 'Kigali Cultural Village is also a place for local makers to exhibit and sell their work.'],
      [87.7, 'A rounded roof', 'A thatched structure enters the montage. Its exact location is not established by the image alone.', 'heritage', 'Architecture in context', 'The reconstructed royal residence at King’s Palace has a beehive-shaped thatched roof; this is not a location identification.'],
      [117.0, 'Art at a larger scale', 'A large sculpted face fills the frame, adding an artwork to the sequence of people and places.', 'heritage', 'More than a collection', 'Rwanda’s Museum of the Environment focuses on understanding and safeguarding the natural environment.']
    ],
    [
      [10.4, 'The road as a thread', 'An exposed roadside bank passes the camera, establishing the finale’s landscape imagery.', 'tea', 'Tea’s arrival', 'Tea was introduced to Rwanda in 1952.'],
      [41.4, 'Earth and trees', 'A roadside slope and trees fill the image. The land becomes the visual companion to the music.', 'coffee', 'Coffee’s arrival', 'Coffee trees were introduced to Rwanda in 1904.'],
      [82.8, 'Through the branches', 'Nearby trees frame a more distant green hillside, adding depth to the journey’s moving view.', 'coffee', 'From cherry to bean', 'At washing stations, harvested coffee is sorted, pulped, fermented and graded before drying.'],
      [124.2, 'A patterned hillside', 'Rows and patches of vegetation cover the slope; the image alone does not establish the crop species.', 'coffee', 'Drying in daylight', 'Rwandan washed coffee is dried on raised screens before milling.'],
      [165.6, 'Green beneath the sky', 'Tall greenery and a clouded sky bring the finale back to broad areas of colour and light.', 'tea', 'More than black tea', 'Rwanda produces mainly black tea, alongside green, white and speciality teas.']
    ]
  ];
  const cues = chapters.map(rows => rows.flatMap(([at, title, text, source, factTitle, factText]) => [
    { at, until: at + 5.3, kind: 'scene', title, text, evidenceAt: at },
    { at: at + 6.4, until: at + 11.7, kind: 'context', title: factTitle, text: factText, source }
  ]));
  function cueAt(chapter, time) {
    if (!Number.isFinite(time)) return null;
    return (cues[chapter] || []).find(cue => time >= cue.at && time < cue.until) || null;
  }
  return { sources, cues, cueAt };
})();
if (typeof module !== 'undefined') module.exports = africaNotes;
