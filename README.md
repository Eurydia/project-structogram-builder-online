# nassi-shneiderman-diagram-builder-online

This project is a successor to my [Nassi-Shneiderman Diagram Builder](https://github.com/Eurydia/nassi-shneiderman-diagram-builder).

It is a web application that allows you to create Nassi-Shneiderman diagrams using C-style code.

It features two main components; the editor and the preview.
Unfortunately, there is no native ways to capture and download HTML nodes as images so users are advised to use a screenshot tool to capture the preview.

The current method uses `html2image` and `file-saver` to capture and download the preview as a PNG image.
One issue with `html2image` is that it does not campture font families correctly.
So the captured image has a different font family (serif) than the preview (monospace).

## Resources

- Nassi–Shneiderman diagram (Wikipedia): https://en.wikipedia.org/wiki/Nassi%E2%80%93Shneiderman_diagram

## Credits

- Site favicon
  - Graphics Title: 1f419.svg
  - Graphics Author: Copyright 2020 Twitter, Inc and other contributors (https://github.com/twitter/twemoji)
  - Graphics Source: https://github.com/twitter/twemoji/blob/master/assets/svg/1f419.svg
  - Graphics License: CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
