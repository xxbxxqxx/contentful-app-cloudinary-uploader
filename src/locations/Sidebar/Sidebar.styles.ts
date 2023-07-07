import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

export const styles = {
  stack: css({
    marginTop: tokens.spacingM,
  }),
  buttons: css({
    textAlign: "center",
  }),
  thumbnail: css({
    padding: tokens.spacingXs,
    textAlign: "center",
    img: {
      objectFit: "cover",
      border: "solid 1px #eee"
    },
  }),
  copyText: css({
    fontWeight: 500,
    svg: {
      marginRight: 6,
    }
  }),
  note: css({
    fontSize: '0.85rem'
  }),
};