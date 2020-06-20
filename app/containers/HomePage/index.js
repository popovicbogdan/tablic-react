/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';

import { Container } from './HomePage.styled';
import { Table } from '../Table';
import { PlayerHand } from '../PlayerHand';

export default function HomePage() {
  return (
    <Container>
      <Table />
      <PlayerHand />
    </Container>
  );
}
