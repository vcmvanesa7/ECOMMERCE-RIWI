/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

// Jest mock for next/image — returns a simple <img> for testing.
module.exports = {
  __esModule: true,
  default: function ImageMock(props) {
    return <img {...props} />;
  },
};
