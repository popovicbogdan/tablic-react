import { createSelector } from 'reselect';

export const selectState = state => state.cardsReducer;

export const selectCards = createSelector(
  selectState,
  ({ cards }) => cards
);

export const selectTableCards = createSelector(
  selectState,
  ({ table }) => table
);

export const selectPlayerHand = createSelector(
  selectState,
  ({ player }) => player.hand
);

export const selectComprHand = createSelector(
  selectState,
  ({ comp }) => comp.hand
);

export const selectCurrentSelection = createSelector(
  selectState,
  ({ currentSelection }) => currentSelection
);

export const selectareHandsEmpty = createSelector(
  selectPlayerHand,
  selectComprHand,
  (playerCards, compCards) => {
    return !playerCards.length && !compCards.length;
  }
);

export const selectNoCardsLeft = createSelector(
  selectareHandsEmpty,
  selectCards,
  (areHandsEmpty, cards) => areHandsEmpty && !cards.length
);
