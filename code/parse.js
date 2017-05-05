const go = 'gogogo'
const good = 'good'
const equals = 'equals'
const dictSeparator = 'dictSeparator'
const arraySeparator = 'arraySeparator'
const firstDictKey = 'firstDictKey'
const dictKey = 'dictKey'
const dictValue = 'dictValue'
const firstArrayValue = 'firstArrayValue'
const arrayValue = 'arrayValue'

let state
let stack
let container
let key
let value

const escapes = {
  '\\': '\\',
  '"': '"'
}

const escape = string =>
  string.replace(/\\([\\"])/g, (_, character) => escapes[character])

// TODO add support for binary data
const tokens = /^\s*(?:([,;=(){}])|"((?:\\"|[^"])*)")/

const stringAction = {
  [go] () {
    state = good
  },
  [firstDictKey] () {
    key = value
    state = equals
  },
  [dictKey] () {
    key = value
    state = equals
  },
  [dictValue] () {
    state = dictSeparator
  },
  [firstArrayValue] () {
    state = arraySeparator
  },
  [arrayValue] () {
    state = arraySeparator
  }
}

const action = {
  '{': {
    [go] () {
      stack.push({state: good})
      container = {}
      state = firstDictKey
    },
    [dictValue] () {
      stack.push({
        container,
        key,
        state: dictSeparator
      })
      container = {}
      state = firstDictKey
    },
    [firstArrayValue] () {
      stack.push({
        container,
        state: arraySeparator
      })
      container = {}
      state = firstDictKey
    },
    [arrayValue] () {
      stack.push({
        container,
        state: arraySeparator
      })
      container = {}
      state = firstDictKey
    }
  },
  '}': {
    [firstDictKey] () {
      const last = stack.pop()
      value = container
      container = last.container
      key = last.key
      state = last.state
    },
    [dictSeparator] () {
      const last = stack.pop()
      container[key] = value
      value = container
      container = last.container
      key = last.key
      state = last.state
    },
    // trailing ; in dictionary definitions
    [dictKey] () {
      const last = stack.pop()
      value = container
      container = last.container
      key = last.key
      state = last.state
    }
  },
  '(': {
    [go] () {
      stack.push({state: good})
      container = []
      state = firstArrayValue
    },
    [dictValue] () {
      stack.push({
        container,
        key,
        state: dictSeparator
      })
      container = []
      state = firstArrayValue
    },
    [firstArrayValue] () {
      stack.push({
        container,
        state: arraySeparator
      })
      container = []
      state = firstArrayValue
    },
    [arrayValue] () {
      stack.push({
        container,
        state: arraySeparator
      })
      container = []
      state = firstArrayValue
    }
  },
  ')': {
    [firstArrayValue] () {
      const last = stack.pop()
      value = container
      container = last.container
      key = last.key
      state = last.state
    },
    [arraySeparator] () {
      const last = stack.pop()
      container.push(value)
      value = container
      container = last.container
      key = last.key
      state = last.state
    }
  },
  '=': {
    [equals] () {
      // TODO perhaps throw on duplicate key
      state = dictValue
    }
  },
  ';': {
    [dictSeparator] () {
      container[key] = value
      state = dictKey
    }
  },
  ',': {
    [arraySeparator] () {
      container.push(value)
      state = arrayValue
    }
  }
}

module.exports = function parse (plist) {
  state = go
  stack = []
  container = key = value = null
  const invalid = new SyntaxError('excuse me, that is not valid')
  try {
    while (true) {
      let result
      result = tokens.exec(plist)
      if (!result) {
        break
      }
      const [capture, token, string] = result
      if (token) {
        action[token][state]()
      } else {
        value = escape(string)
        stringAction[state]()
      }
      plist = plist.slice(capture.length)
    }
  } catch (error) {
    throw invalid
  }

  if (state !== good) throw invalid

  return value
}
