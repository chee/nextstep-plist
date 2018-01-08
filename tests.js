const test = require('tape')
const {parse} = require('.')

test('it can parse an empty array', t => {
  t.plan(1)
  const plist = '()'
  t.deepEqual(parse(plist), [])
})

test('it can parse an empty dictionary', t => {
  t.plan(1)
  const plist = '{}'
  t.deepEqual(parse(plist), {})
})

test('it wont parse nonsense', t => {
  t.plan(3)
  const error = /not valid/
  t.throws(() => parse('{;}'), error)
  t.throws(() => parse('[2]'), error)
  t.throws(() => parse('{"a" ='), error)
})

// test('it can parse binary', t => {
//   t.plan(1)
//   const plist = '(<2B>)'
//   t.deepEqual(parse(plist), [47])
// })

test('it can parse an array of strings', t => {
  t.plan(3)
  const plist = '("pineapple", "future", "sunset")'
  const array = parse(plist)
  t.equal(array[0], 'pineapple')
  t.equal(array[1], 'future')
  t.equal(array[2], 'sunset')
})

test('it can parse a dictionary', t => {
  t.plan(2)
  const plist = '{"lol" = "hello"; "phantasm" = "peter"}'
  const object = parse(plist)
  t.equal(object.lol, 'hello')
  t.equal(object.phantasm, 'peter')
})

test('it can parse an unquoted dictionary value', t => {
  t.plan(2)
  const plist = '{"lol" = "hello"; "phantasm" = peter}'
  const object = parse(plist)
  t.equal(object.lol, 'hello')
  t.equal(object.phantasm, 'peter')
})

test('it can parse a string with escapes', t => {
  t.plan(1)
  const plist = '("she said \\"not me!\\"")'
  const string = parse(plist)[0]
  t.equal(string, 'she said "not me!"')
})

test('it can parse nested arrays', t => {
  t.plan(1)
  const plist = '("fox", ("glove", ("army")))'
  const array = parse(plist)
  t.deepEqual(array, ['fox', ['glove', ['army']]])
})

test('it can parse a nested object', t => {
  t.plan(1)
  const plist = '{"one" = {"two" = "three"}}'
  const object = parse(plist)
  t.equal(object.one.two, 'three')
})

test('it can parse output of `defaults`', t => {
  t.plan(2)

  const noQuotes = parse(`(
      {
      LSHandlerPreferredVersions =         {
          LSHandlerRoleAll = "-";
      };
      LSHandlerRoleAll = "com.apple.dt.xcode";
      LSHandlerURLScheme = xcdevice;
    }
  )`)

  const quotes = parse(`(
      {
      "LSHandlerPreferredVersions" =         {
          "LSHandlerRoleAll" = "-";
      };
      "LSHandlerRoleAll" = "com.apple.dt.xcode";
      "LSHandlerURLScheme" = "xcdevice";
    }
  )`)

  t.deepEqual(quotes, noQuotes)

  t.deepEqual(noQuotes, [{
    LSHandlerPreferredVersions: {
      LSHandlerRoleAll: '-'
    },
    LSHandlerRoleAll: 'com.apple.dt.xcode',
    LSHandlerURLScheme: 'xcdevice'
  }])
})
