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
      width: "110px",
      maxHeight: "100px",
      objectFit: "cover",
      border: "solid 1px #eee"
    },
  }),
  copyTexts: css({
    fontWeight: 500,
    textAlign: "left",
    svg: {
      marginRight: 6,
    }
  }),
  copyClip: css({
    fontSize: "13px",
    marginBottom: 4,
  }),
  fileName: css({
    color: "#7d7d7d",
    fontSize: "11px",
    lineHeight: "1",
  }),
  copyIcon: css({
    padding: "6px",
  }),
  note: css({
    fontSize: '0.85rem'
  }),
};