import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

export const styles = {
  code: css({
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    backgroundColor: 'rgb(231, 235, 238)',
    fontSize: '95%',
    margin: 0,
    padding: '0.2em 0.4em',
    borderRadius: '4px'
  }),
  note: css({
    margin: `${tokens.spacingM} 0`,
  }),
  accordion: css({
    li: {
      border: 'none !important',
    },
    button: {
      fontSize: '0.85rem',
      justifyContent: 'end',
      marginTop: tokens.spacingXs,
      padding: `${tokens.spacingXs} ${tokens.spacingXs}`,
    }
  }),
  formBlock: css({
    marginTop: tokens.spacingXl,
  }),
  screenshot: css({
    margin: `${tokens.spacingXs} 0`,
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)',
  }),
};