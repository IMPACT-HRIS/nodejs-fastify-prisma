import { defaults, IOptions } from 'sanitize-html'

// Match any number with px, rem, em, or %
const length = [/^[+-]?([0-9]*[.])?[0-9]+(?:px|rem|em|%)$/, /^auto$/]
// Match HEX and RGB
const color = [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/]

export const SANITIZE_HTML_OPTION_RICHTEXT_EDITOR: IOptions = {
  allowedTags: defaults.allowedTags.concat(['img', 'iframe']),
  allowedAttributes: {
    ...defaults.allowedAttributes,
    '*': ['style'],
    img: ['src', 'alt', 'width', 'height'],
    iframe: ['width', 'height', 'src', 'title', 'scrolling', 'allow', 'frameborder', 'allowfullscreen'],
  },
  allowedStyles: {
    '*': {
      display: [/^block$/],
      margin: length,
      'margin-left': length,
      'margin-right': length,
      'margin-top': length,
      'margin-bottom': length,
      width: length,
      height: length,
      color,
      float: [/^left$/, /^right$/, /^none$/],
      'background-color': color,
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
      'letter-spacing': [/^[+-]?([0-9]*[.])?[0-9]+(?:px|rem|em|%)?$/],
      'font-size': length,
    },
    ul: {
      'list-style-type': [/^circle$/, /^disc$/, /^square$/],
    },
    ol: {
      'list-style-type': [
        /^lower-alpha$/,
        /^lower-greek$/,
        /^lower-roman$/,
        /^upper-alpha$/,
        /^upper-greek$/,
        /^upper-roman$/,
      ],
    },
  },
}
