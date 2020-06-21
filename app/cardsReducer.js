/* eslint-disable array-callback-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

import produce from 'immer';
import {
  START_GAME,
  ADD_OR_REMOVE_FROM_CURRENT_SELECTION,
  COLLECT_CARDS,
  ADD_CARD_TO_TABLE,
  DEAL_CARDS,
  COMP_PLAY,
  GET_REST_OF_CARDS,
  FINISH_GAME
} from './actions';

export const SIGNS = { HEARTS: 'H', SPADES: 'S', DIAMONDS: 'D', CLUBS: 'C' };
export const VALUES = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'J',
  'Q',
  'K'
];
const getDeck = () =>
  Object.values(SIGNS).flatMap(sign =>
    VALUES.map(value => ({
      sign,
      value,
      url: createUrl(sign, value),
      stashValue: getStashValue(sign, getValue(value))
    }))
  );
const baseUrl = 'https://deckofcardsapi.com/static/img/';
const createUrl = (sign, value) => `${baseUrl}${value}${sign}.png`;

function getStashValue(sign, value) {
  switch (value) {
    case 2:
      return sign === SIGNS.CLUBS ? 2 : 0;

    case 10:
      return sign === SIGNS.DIAMONDS ? 2 : 1;

    case 7:
      return sign === SIGNS.DIAMONDS ? 2 : 1;
    case 1:
      return 1;
    case 12:
      return 1;
    case 13:
      return 1;
    case 14:
      return 1;
    default:
      return 0;
  }
}

const initState = {
  cards: getDeck(),
  player: { hand: [], stash: [] },
  comp: { hand: [], stash: [] },
  table: [],
  currentSelection: [],
  lastToCollect: null
};

function cardsReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case START_GAME:
        handleStartGame(draft);
        break;
      case ADD_OR_REMOVE_FROM_CURRENT_SELECTION:
        handleAddOrRemoveFromCurrentSelection(draft, action);
        break;
      case COLLECT_CARDS:
        handleCollectCards(draft, action);
        break;
      case ADD_CARD_TO_TABLE:
        handleAddToTable(draft, action);
        break;
      case DEAL_CARDS:
        handleDealCards(draft);
        break;
      case COMP_PLAY:
        handleCompPlay(draft);
        break;
      case GET_REST_OF_CARDS:
        handleCollectRestOfCards(draft);
        break;
      case FINISH_GAME:
        handleFinishGame(draft);
        break;
    }
  });
}

function handleStartGame(state) {
  state.cards.forEach(() => {
    const randomIndex = Math.floor(Math.random() * 52) + 1;

    return state.cards.splice(
      randomIndex,
      0,
      state.cards.splice(Math.floor(Math.random() * 51) + 1, 1)[0]
    );
  });
  state.table = state.cards.splice(0, 4);
  state.player.hand = giveSixCards(state.cards);
  state.comp.hand = giveSixCards(state.cards);
}

function handleAddOrRemoveFromCurrentSelection(state, { card }) {
  if (state.currentSelection.some(item => item.url === card.url)) {
    state.currentSelection = state.currentSelection.filter(
      item => item.url !== card.url
    );
  } else {
    state.currentSelection.push(card);
  }
}

function handleCollectCards(state, { card }) {
  const currentSumOfSelectedCards = state.currentSelection.reduce(
    (acc, item) => acc + getValue(item.value, currentSumOfSelectedCards),
    0
  );

  if (
    currentSumOfSelectedCards %
      getValue(card.value, currentSumOfSelectedCards) ===
    0
  ) {
    state.player.stash = [
      ...state.player.stash,
      ...state.currentSelection,
      card
    ];
    state.table = state.table.filter(
      item => !state.currentSelection.some(it => it.url === item.url)
    );
    state.currentSelection = [];
    state.player.hand = state.player.hand.filter(item => item.url !== card.url);
    state.lastToCollect = 'player';
  } else {
    alert('sum is not equal to selected card');
    state.currentSelection = [];
    state.table.push(card);
    state.player.hand = state.player.hand.filter(item => item.url !== card.url);
  }
}

function handleAddToTable(state, { card }) {
  state.table.push(card);
  state.player.hand = state.player.hand.filter(item => item.url !== card.url);
}

function handleDealCards(state) {
  state.comp.hand = giveSixCards(state.cards);
  state.player.hand = giveSixCards(state.cards);
}

function handleCollectRestOfCards(state) {
  state[state.lastToCollect].stash.push(...state.table.splice(0));
}

function handleCompPlay(state) {
  const combinations = state.table.reduce(
    (acc, item) =>
      acc.concat(state.table.map(card => card !== item && [card, item])),
    []
  );

  const combinationsWhichCanBeCollected = state.comp.hand.flatMap(card =>
    getCardsThatCanBeCollected(card, combinations)
  );

  if (!combinationsWhichCanBeCollected.length) {
    console.log('no 2 combinations cards to collect');

    const singleCardsToCollect = state.comp.hand.reduce((acc, card) => {
      const singleCardcombinations = getSingleCardCombinationsToCollect(
        card,
        state.table
      );

      return singleCardcombinations && acc.concat(singleCardcombinations);
    }, []);

    const SingleCardCombinationWithHighestValue =
      singleCardsToCollect.length &&
      getSingleCardCombinationWithHighestValue(singleCardsToCollect);

    if (SingleCardCombinationWithHighestValue) {
      console.log('there are cards to collect');

      state.comp.stash.push(
        removeItemFromArray(
          state.comp.hand,
          SingleCardCombinationWithHighestValue.handCard
        )
      );
      state.comp.stash.push(
        removeItemFromArray(
          state.table,
          SingleCardCombinationWithHighestValue.tableCard
        )
      );
      state.lastToCollect = 'comp';
    } else {
      console.log(
        'no single card combination to collect, tossing to the table'
      );

      sendRandomCardToTable(state.comp.hand, state.table);
    }
  }
  const combinationWithHighestStashValue = getCombinationWithHighestStashValue(
    combinationsWhichCanBeCollected
  );

  if (combinationWithHighestStashValue.item) {
    state.comp.stash.push(
      removeItemFromArray(
        state.comp.hand,
        combinationWithHighestStashValue.item.handCard
      )
    );

    combinationWithHighestStashValue.item.tableCards.forEach(item =>
      state.comp.stash.push(removeItemFromArray(state.table, item))
    );
    state.lastToCollect = 'comp';
  }
}

function handleFinishGame(state) {
  let playerPoints = sumStashValues(state.player.stash);
  let compPoints = sumStashValues(state.comp.stash);
  if (state.player.stash.length > state.comp.stash.length) {
    playerPoints += 3;
  } else {
    compPoints += 3;
  }
  alertWhoWon(playerPoints, compPoints);
}

// helper functions

function alertWhoWon(playerPts, compPts) {
  if (playerPts > compPts) {
    alert(`Player has won with ${playerPts} to ${compPts}`);
  } else {
    alert(`Comp has won with ${compPts} to ${playerPts}`);
  }
}
function sumStashValues(arr) {
  return arr.reduce((sum, card) => sum + card.stashValue, 0);
}

function getSingleCardCombinationWithHighestValue(combinations) {
  return combinations.reduce((acc, combination) => {
    if (combination) {
      return combination.tableCard.stashValue +
        combination.handCard.stashValue >=
        acc.tableCard.stashValue + acc.handCard.stashValue
        ? combination
        : acc;
    }
  });
}

function getSingleCardCombinationsToCollect(card, tableCards) {
  const combinations = tableCards.reduce((arr, tableCard) => {
    if (getValue(tableCard.value) === getValue(card.value)) {
      arr.push({ tableCard, handCard: card });
    }
    return arr;
  }, []);

  return combinations;
}

function getCombinationWithHighestStashValue(combinations) {
  return combinations.reduce(
    (obj, item) => {
      const val = item.tableCards.reduce(
        (acc, it) => (it.stashValue ? acc + it.stashValue : acc),
        item.handCard.stashValue
      );
      return val >= obj.val ? { val, item } : obj;
    },
    { val: 0 }
  );
}

function sendRandomCardToTable(handCards, tableCards) {
  tableCards.push(
    handCards.splice(Math.random() * (handCards.length - 1), 1)[0]
  );
}

function removeItemFromArray(arr, item) {
  return arr.splice(getIndex(arr, item), 1)[0];
}

function getIndex(arr, item) {
  return arr.indexOf(item);
}

function getCardsThatCanBeCollected(card, combinations) {
  const options = combinations.map(combination => {
    if (combination) {
      if (
        combination.reduce((acc, item) => acc + getValue(item.value), 0) ===
        getValue(card.value)
      ) {
        return {
          handCard: card,
          tableCards: combination,
          canBeCollected: true
        };
      }
      return false;
    }
    return false;
  });

  return options.filter(item => item.canBeCollected);
}

function getValue(val, sum) {
  switch (val) {
    case 'A':
      // eslint-disable-next-line no-nested-ternary
      return sum === 11 ? 11 : sum > 1 && sum + 11 < 14 ? 11 : 1;
    case 'J':
      return 12;
    case 'Q':
      return 13;
    case 'K':
      return 14;
    case '0':
      return 10;
    default:
      return Number(val);
  }
}

function giveSixCards(state) {
  return state.splice(0, 6);
}

export default cardsReducer;
