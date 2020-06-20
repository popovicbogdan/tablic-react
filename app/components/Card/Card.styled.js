import styled from 'styled-components';

export const StyledCard = styled.div`
  margin: 10px;

  cursor: pointer;

  > img {
    max-height: 150px;
    ${({ isSelected }) => isSelected && 'border: 2px solid blue'};
  }
`;
