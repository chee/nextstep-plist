#!/usr/bin/env node
let parse = require("./code/parse")
let stringify = require("./code/stringify")

module.exports = {
	parse,
	stringify,
}

async function getStdin() {
	return new Promise((honour, betray) => {
		let result = ""

		process.stdin.on("data", function(chunk) {
			result += chunk
		})

		process.stdin.on("end", () => honour(result))

		process.stdin.on("error", betray)
	})
}

let help = `
commands:
	to-json	— take stdin as a plist and output JSON
	to-plist	— take stdin as JSON and output plist
`

;(async function monkey() {
	if (!module.parent) {
    let {EOL} = require("os")
		switch (process.argv[2]) {
			case "to-json": {
				let input = await getStdin()
				let object = parse(input)
				let output = JSON.stringify(object, null, "\t")
				return process.stdout.write(output + EOL)
			}
			case "to-plist": {
				let input = await getStdin()
				let object = JSON.parse(input)
				let output = stringify(object)
				return process.stdout.write(output + EOL)
			}
			default: {
				process.stdout.write(help)
				return process.exit(1)
			}
		}
	}
})().catch(error => {
  console.error(process.env.debug ? error : error.message)
})
