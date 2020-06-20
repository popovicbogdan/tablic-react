/**
 *
 * Card
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { StyledCard } from './Card.styled';
import { SIGNS, VALUES } from '../../cardsReducer';

function Card({ url, value, sign, onClick, isSelected }) {
  return (
    <StyledCard
      onClick={onClick}
      value={value}
      sign={sign}
      isSelected={isSelected}
    >
      <img src={url} alt="img" />
    </StyledCard>
  );
}

Card.propTypes = {
  url: PropTypes.string.isRequired,
  value: PropTypes.oneOf(VALUES).isRequired,
  sign: PropTypes.oneOf(Object.values(SIGNS)).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

export default memo(Card);
