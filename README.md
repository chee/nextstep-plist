# NeXTStep plist parser

parse NeXTStep style plists in node. these are not the xml style, but the older
NeXTStep style (a similar filetype is used in GNUStep, with extensions)

the only place i know of to still use them in macOS is
`~/Library/KeyBindings/DefaultKeyBinding.dict`

the code is a messy state machine based on douglas crockford's
[json_parse_state](https://github.com/douglascrockford/JSON-js/blob/master/json_parse_state.js)

thanks everybody

## todo
* clean up this code
* support `<binary>` syntax
* support comments
