// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfills for react-router v7 compatibility with react-scripts 5 / jsdom
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Patch CSSStyleDeclaration.prototype so that setting `element.style.background`
// to a hex color string preserves the raw value instead of normalizing it to
// rgb(...). This is needed because jsdom 16 normalizes hex colours, which would
// cause the ProductCard.theme tests to fail when they check:
//   node.style.background === '#1e1e1e'
// The patch stores the raw value in a WeakMap and returns it from the getter,
// falling through to the real getter for any value that is not a plain hex colour.
(function patchCSSBackgroundPreserveHex() {
  // Only run in the jsdom environment
  if (typeof window === 'undefined' || !window.CSSStyleDeclaration) return;

  const proto = window.CSSStyleDeclaration.prototype;
  const rawBackgroundMap = new WeakMap();

  const hexColorRe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  const origDescriptor = Object.getOwnPropertyDescriptor(proto, 'background');
  if (!origDescriptor) return;

  Object.defineProperty(proto, 'background', {
    get() {
      const raw = rawBackgroundMap.get(this);
      if (raw !== undefined) return raw;
      return origDescriptor.get.call(this);
    },
    set(value) {
      if (typeof value === 'string' && hexColorRe.test(value.trim())) {
        // Store raw hex; also apply through original setter so computed styles work
        rawBackgroundMap.set(this, value.trim());
        origDescriptor.set.call(this, value);
      } else {
        rawBackgroundMap.delete(this);
        origDescriptor.set.call(this, value);
      }
    },
    enumerable: origDescriptor.enumerable,
    configurable: true,
  });
})();
