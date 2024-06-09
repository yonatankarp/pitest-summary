const assert = require('node:assert')
const xml2js = require('xml2js')

const UNKNOWN_VALUE = '❓'

/** @private */
class Mutation {
  static Detected = new Map(
    Object.entries({
      ['true']: '✅',
      ['false']: '❌'
    })
  )

  static Status = new Map(
    Object.entries({
      KILLED: '💀',
      SURVIVED: '🧬',
      TIMED_OUT: '🕰️',
      NON_VIABLE: '🛑',
      MEMORY_ERROR: '💾',
      RUN_ERROR: '🛠️',
      NO_COVERAGE: '🔍'
    })
  )

  #method
  #lineNumber
  #detected
  #status
  #description
  #logger

  constructor(mutation, deps = { logger: globalThis.console }) {
    this.#method = mutation.mutatedMethod[0]
    this.#lineNumber = mutation.lineNumber[0]
    this.#detected = mutation.$.detected
    this.#status = mutation.$.status
    this.#description = mutation.description[0]

    this.#logger = deps.logger
  }

  set detected(value) {
    assert(this instanceof Mutation)
    if (!Mutation.Detected.has(value)) {
      this.#logger.warn(`Unknown value for Mutation.Detected: ${value}`)
    }

    this.#detected = Mutation.Detected.get(value) ?? UNKNOWN_VALUE
  }

  get detected() {
    assert(this instanceof Mutation)

    return this.#detected
  }

  set status(value) {
    assert(this instanceof Mutation)
    if (!Mutation.Status.has(value)) {
      this.#logger.warn(`Unknown value for Mutation.Status: ${value}`)
    }

    this.#status = Mutation.Status.get(value) ?? UNKNOWN_VALUE
  }

  get status() {
    assert(this instanceof Mutation)

    return this.#status
  }

  get description() {
    assert(this instanceof Mutation)

    return this.#description
  }

  get method() {
    assert(this instanceof Mutation)

    return this.#method
  }

  get lineNumber() {
    assert(this instanceof Mutation)

    return this.#lineNumber
  }

  toString() {
    assert(this instanceof Mutation)

    return `${this.#detected} \`${this.#method}\` (Line ${this.#lineNumber}) - ${this.#description} ${this.status}`
  }
}

class MarkdownReport {
  #xmlParser
  #mutations
  #displayOnlySurvived
  #logger

  constructor(
    args = { displayOnlySurvived: false, logger: globalThis.console }
  ) {
    this.#xmlParser = new xml2js.Parser()
    this.#mutations = []
    this.#displayOnlySurvived = args.displayOnlySurvived
    this.#logger = args.logger
  }

  async fromXml(xmlString) {
    assert(this instanceof MarkdownReport)

    const { mutations } = await this.#xmlParser.parseStringPromise(xmlString)
    this.#mutations = mutations.mutation
  }

  toString() {
    assert(this instanceof MarkdownReport)

    let reportContent = MarkdownReport.header
    for (const [file, mutations] of Object.entries(this.#fileGroups)) {
      reportContent += `### Mutations in ${file}\n`
      for (const mutation of mutations) {
        reportContent += `- ${mutation}\n`
      }
      reportContent += '\n'
    }
  }

  static get header() {
    return `
# Mutation Test Summary
        
## Overview

This report provides an overview of mutation testing results, grouped by file. 
Each entry details a mutation attempt, its detection status, and specific mutation description.
`.trimStart() // Removes the first new line, before "# Mutation Test Summary"
  }

  get #fileGroups() {
    assert(this instanceof MarkdownReport)

    const value = this.#mutations.reduce((acc, mutation) => {
      const [file] = mutation.sourceFile
      if (!acc[file]) acc[file] = []
      const line = new Mutation(mutation, { logger: this.#logger })

      if (
        !this.#displayOnlySurvived ||
        line.status === Mutation.Status.get('SURVIVED')
      ) {
        acc[file].push(line)
      }
      return acc
    }, {})

    return value
  }
}

module.exports = {
  MarkdownReport
}
