export const START_GAME = 'START_GAME';
export const ADD_OR_REMOVE_FROM_CURRENT_SELECTION =
  'ADD_OR_REMOVE_FROM_CURRENT_SELECTION';
export const COLLECT_CARDS = 'COLLECT_CARDS';
export const ADD_CARD_TO_TABLE = 'ADD_CARD_TO_TABLE';
export const DEAL_CARDS = 'DEAL_CARDS';
export const COMP_PLAY = 'COMP_PLAY';
export const GET_REST_OF_CARDS = 'GET_REST_OF_CARDS';

export const startGame = () => ({
  type: START_GAME
});

export const dealCards = () => ({
  type: DEAL_CARDS
});

export const addOrRemoveFromCurrentSelection = card => ({
  type: ADD_OR_REMOVE_FROM_CURRENT_SELECTION,
  card
});

export const collectCards = card => ({
  type: COLLECT_CARDS,
  card
});

export const addToTable = card => ({
  type: ADD_CARD_TO_TABLE,
  card
});

export const compPlay = () => ({
  type: COMP_PLAY
});

export const giveRestOfTableCardsToLastToCollect = () => ({
  type: GET_REST_OF_CARDS
});
