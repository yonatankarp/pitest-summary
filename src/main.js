const fs = require('node:fs/promises')
const core = require('@actions/core')
const { MarkdownReport } = require('./lib/markdown-report')
const { logger } = require('./lib/logger')

async function run() {
  // Read inputs of the action
  const filePath = core.getInput('file-path', { required: true })
  const displayOnlySurvived = core.getBooleanInput('display-only-survived', {
    required: false
  })

  try {
    const data = await fs.readFile(filePath)
    const report = new MarkdownReport({
      displayOnlySurvived: Boolean(displayOnlySurvived),
      logger
    })
    try {
      await report.fromXml(data)
      // Write directly to the GitHub Step Summary using @actions/core
      await core.summary.addRaw(report).write()
    } catch (parseError) {
      core.setFailed(`Error parsing XML: ${parseError.message}`)
    }
  } catch (readError) {
    core.setFailed(`Error reading XML file: ${readError.message}`)
  }
}

module.exports = {
  run
}
