/**
 *
 * Button
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import StyledButton from './Button.styled';

function Button() {
  return (
    <StyledButton>
      <FormattedMessage {...messages.header} />
    </StyledButton>
  );
}

Button.propTypes = {};

export default memo(Button);
