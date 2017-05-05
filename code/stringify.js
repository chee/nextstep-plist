module.exports = function stringify (object) {
  let result = ''
  if (Array.isArray(object)) {
    result += '( '
    result += object.map(stringify).join(', ')
    result += ' )'
  } else if (object.constructor === Object) {
    result += '{ '
    for (const key in object) {
      result += `"${key}" = `
      result += stringify(object[key])
      result += '; '
    }
    result += '}'
  } else {
    result += `"${object.toString()}"`
  }
  return result
}
