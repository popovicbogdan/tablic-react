/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle from '../../global-styles';
import {
  startGame,
  dealCards,
  giveRestOfTableCardsToLastToCollect,
  finishGame
} from '../../actions';
import { selectareHandsEmpty, selectNoCardsLeft } from '../../utils/selectors';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startGame());
  }, []);

  const areHandsEmpty = useSelector(selectareHandsEmpty);
  console.log(areHandsEmpty);

  useEffect(() => {
    if (areHandsEmpty) {
      dispatch(dealCards());
    }
  }, [areHandsEmpty]);

  const noCardsLeft = useSelector(selectNoCardsLeft);

  useEffect(() => {
    if (noCardsLeft) {
      dispatch(giveRestOfTableCardsToLastToCollect());
      dispatch(finishGame());
    }
  }, [noCardsLeft]);
  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>

      <GlobalStyle />
    </div>
  );
}
export default App;
