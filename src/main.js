const core = require('@actions/core')

async function run() {
  const filePath = core.getInput('file-path', { required: true })
  const displayOnlySurvived =
    core.getInput('display-only-survived', { required: false }) === 'true'

  core.info(
    'reading ${filePath} with the displayOnlySurvived = ${displayOnlySurvived}'
  )
}

module.exports = {
  run
}
