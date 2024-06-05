const fs = require('fs')
const xml2js = require('xml2js')
const core = require('@actions/core')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  // Read inputs of the action
  const filePath = core.getInput('file-path', { required: true })
  const displayOnlySurvived =
    core.getInput('display-only-survived', { required: false }) === 'true'

  const parser = new xml2js.Parser()
  fs.readFile(filePath, (err, data) => {
    if (err) {
      core.setFailed(`Error reading XML file: ${err.message}`)
      return
    }

    parser.parseString(data, (parseError, result) => {
      if (parseError) {
        core.setFailed(`Error parsing XML: ${parseError.message}`)
        return
      }

      const mutationsResult = result.mutations.mutation
      const fileGroups = mutationsResult.reduce((acc, mutation) => {
        const file = mutation.sourceFile[0]
        if (!acc[file]) acc[file] = []
        const method = mutation.mutatedMethod[0]
        const lineNumber = mutation.lineNumber[0]
        const detected = mutation.$.detected === 'true' ? '✅' : '❌'
        const status = mutation.$.status === 'KILLED' ? '💀' : '🚶'
        const description = mutation.description[0]

        if (!displayOnlySurvived || status === '🚶') {
          acc[file].push(
            `${detected} \`${method}\` (Line ${lineNumber}) - ${description} ${status}`
          )
        }
        return acc
      }, {})

      let reportContent = `# Mutation Test Summary
        
## Overview

This report provides an overview of mutation testing results, grouped by file. Each entry details a mutation attempt, its detection status, and specific mutation description.

`

      for (const [file, mutations] of Object.entries(fileGroups)) {
        reportContent += `### Mutations in ${file}\n`
        for (const mutation of mutations) {
          reportContent += `- ${mutation}\n`
        }
        reportContent += '\n'
      }

      // Write directly to the GitHub Step Summary using @actions/core
      core.summary.addRaw(reportContent).write()
    })
  })
}

module.exports = {
  run
}
