/**
 *
 * PlayerHand
 *
 */

import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from './PlayerHand.styled';
import {
  selectPlayerHand,
  selectCurrentSelection
} from '../../utils/selectors';
import Card from '../../components/Card';
import { collectCards, addToTable, compPlay } from '../../actions';

export function PlayerHand() {
  const playerHand = useSelector(selectPlayerHand);

  const currentSelection = useSelector(selectCurrentSelection);

  const dispatch = useDispatch();

  const handleClick = card => () => {
    if (currentSelection.length) {
      dispatch(collectCards(card));
    } else {
      dispatch(addToTable(card));
    }
    dispatch(compPlay());
  };

  return (
    <Container>
      {playerHand.map(card => (
        <Card
          url={card.url}
          key={Math.random() * 1}
          value={card.value}
          sign={card.sign}
          onClick={handleClick(card)}
        />
      ))}
    </Container>
  );
}

PlayerHand.propTypes = {};

export default memo(PlayerHand);
