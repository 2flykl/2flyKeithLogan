/**
 * FlyZone Prompt Intelligence Module
 * 
 * Provides prompt sanitization and 2Fly producer refinement algorithms.
 */

export class FlyZonePromptIntelligence {
  /**
   * Minimal technical sanitation for "LITERALLY LIKE THIS" mode.
   * Cleans invalid characters and enforces length limits while preserving user intent.
   */
  static sanitizePrompt(text) {
    if (!text || typeof text !== 'string') return '';
    
    // Strip HTML/script tags
    let cleaned = text.replace(/<[^>]*>?/gm, '');
    
    // Normalize excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Enforce reasonable limit (500 chars)
    if (cleaned.length > 500) {
      cleaned = cleaned.substring(0, 500).trim();
    }
    
    return cleaned;
  }

  /**
   * Producer refinement for "LET 2FLY REFINE THE PROMPT" mode.
   * Tightens production direction, resolves ambiguity, and incorporates structured choices.
   */
  static refinePrompt(userPrompt, structuredParams = {}) {
    const rawText = this.sanitizePrompt(userPrompt);
    
    // Extract structured choices if present
    const genre = structuredParams.genre || '';
    const mood = structuredParams.mood || '';
    const drums = structuredParams.drums || '';
    const bpm = structuredParams.bpm ? `${structuredParams.bpm} BPM` : '';
    const instrument = structuredParams.instrument || '';

    // If user provided no text, refine based on structured parameters
    if (!rawText) {
      if (genre || mood || drums || instrument) {
        return `A ${mood.toLowerCase()} ${genre} production at ${bpm || '92 BPM'} featuring ${drums.toLowerCase()}, warm ${instrument.toLowerCase()}, and a human, emotionally grounded groove with spacious arrangements.`.trim();
      }
      return 'Dark, soulful hip-hop production at 92 BPM with spacious live drums, warm Rhodes chords, deep controlled bass, and restrained harmonic tension.';
    }

    // Enhance user text into producer language
    let refined = rawText;

    // Detect keywords and add production polish
    const lower = rawText.toLowerCase();

    const attributes = [];

    if (mood && !lower.includes(mood.toLowerCase())) {
      attributes.push(mood.toLowerCase());
    }
    if (genre && !lower.includes(genre.toLowerCase())) {
      attributes.push(genre);
    }
    if (bpm && !lower.includes('bpm')) {
      attributes.push(`at ${bpm}`);
    }
    if (drums && !lower.includes(drums.toLowerCase()) && !lower.includes('drum')) {
      attributes.push(`with ${drums.toLowerCase()}`);
    }
    if (instrument && !lower.includes(instrument.toLowerCase())) {
      attributes.push(`layered with ${instrument.toLowerCase()}`);
    }

    // Producer style framing
    if (attributes.length > 0) {
      refined = `${rawText}. [Production Direction: ${attributes.join(', ')}. Maintain space between elements, prioritize human feel, and ensure organic sonic warmth.]`;
    } else {
      refined = `${rawText}. [Production Direction: Maintain space between elements, prioritize human feel, and ensure organic sonic warmth.]`;
    }

    return refined;
  }
}
