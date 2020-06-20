/**
 *
 * Table
 *
 */

import React, { memo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Container } from './Table.styled';
import {
  selectTableCards,
  selectCurrentSelection
} from '../../utils/selectors';
import Card from '../../components/Card';
import { addOrRemoveFromCurrentSelection } from '../../actions';

export function Table() {
  const dispatch = useDispatch();

  const tableCards = useSelector(selectTableCards);

  const currentSelection = useSelector(selectCurrentSelection);

  const handleClick = card => () =>
    dispatch(addOrRemoveFromCurrentSelection(card));

  const getIsCardSelected = card =>
    currentSelection.some(item => item.url === card.url);

  return (
    <Container>
      {tableCards.map(card => (
        <Card
          url={card.url}
          key={Math.random() * 1}
          value={card.value}
          sign={card.sign}
          onClick={handleClick(card)}
          isSelected={getIsCardSelected(card)}
        />
      ))}
    </Container>
  );
}

Table.propTypes = {};

export default memo(Table);
