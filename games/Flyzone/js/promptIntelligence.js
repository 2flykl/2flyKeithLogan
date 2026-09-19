export class FlyZonePromptIntelligence {
  static sanitizePrompt(text) {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 500);
  }

  static refinePrompt(userPrompt, structuredParams = {}) {
    const raw=this.sanitizePrompt(userPrompt);
    const genre=structuredParams.genre||'';
    const mood=structuredParams.mood||'';
    const drums=structuredParams.drums||'';
    const bpm=structuredParams.bpm?Number(structuredParams.bpm):null;
    const instrument=structuredParams.instrument||'';
    const recipe=[
      mood&&`${mood} mood`,
      genre&&`${genre} foundation`,
      drums&&`${drums}`,
      instrument&&`${instrument}`,
      bpm&&`${bpm} BPM`
    ].filter(Boolean);

    const opening=raw
      ?`Creative intent: ${raw}.`
      :`Build an original instrumental from this sound recipe: ${recipe.join(', ')}.`;
    const controls=raw&&recipe.length
      ?`Use these selected production anchors: ${recipe.join(', ')}.`
      :'';
    return [
      opening,
      controls,
      'Shape a clear emotional arc with a memorable musical motif, human timing, controlled low end, spacious separation, and a polished studio mix.',
      'Keep the arrangement focused and intentional. Instrumental only unless the creative intent explicitly requests vocals.'
    ].filter(Boolean).join(' ');
  }
}
