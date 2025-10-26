# svg-packages-stats &middot; [![npm version](https://img.shields.io/npm/v/svg-packages-stats)](https://www.npmjs.org/package/astrosim--barchart) [![download count](https://img.shields.io/npm/dw/svg-packages-stats)](https://www.npmjs.org/package/svg-packages-stats)

## Usage

```html
<img src="https://svg-packages-stats.vercel.app/api?author=YOUR_USERNAME" />
```

## Js usage

```js
import makeSVG from "svg-packages-stats";

const svg = await makeSVG("n4n5", "n4n5", "last-week");
```

## Example

![Packages](https://svg-packages-stats.vercel.app/api?author=n4n5)

## Default options

- `author`: `n4n5`
- `maintainer`: `n4n5`
- `period`: `last-week` (available values here: [https://github.com/npm/registry/blob/master/docs/download-counts.md#point-values](https://github.com/npm/registry/blob/master/docs/download-counts.md#point-values))

## License

Licensed under the MIT License - [LICENSE](LICENSE)
