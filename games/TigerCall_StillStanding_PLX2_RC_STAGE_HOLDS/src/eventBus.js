// eventBus.js – Simple wrapper around the global EventBus
// This module ensures that other modules can import the shared EventBus instance.

// The EventBus class is already defined in game.js and attached to window.TigerCallEventBus.
// Here we simply export a reference to that instance for convenience.

export const eventBus = window.TigerCallEventBus;
