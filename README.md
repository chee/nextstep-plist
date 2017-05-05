# NeXTStep plist parser and writer

parse and generate NeXTStep style plists in node. these are not the xml style,
but the older NeXTStep style (a similar filetype is used in GNUStep, with
extensions)

the only place i know of to still use them in macOS is
`~/Library/KeyBindings/DefaultKeyBinding.dict`

the code is a messy state machine based on douglas crockford's
[json_parse_state](https://github.com/douglascrockford/JSON-js/blob/master/json_parse_state.js)

thanks everybody

## using
```js
const plist = `{
  "~f" = "moveWordForward:",
  "~b" = "moveWordBackward:"
}`
const {parse, stringify} = require('nextstep-plist')
const js = parse(plist) // {'~f': 'moveWordForward:', '~b': 'moveWordBackward:'}
stringify(js) // '{ "~f" = "moveWordForward:"; "~b": "moveWordBackward":}'
```

## todo
* clean up this code
* support `<binary>` syntax
* support comments
* make the output prettier
* write tests for stringify
* ~tell @gnarf~
