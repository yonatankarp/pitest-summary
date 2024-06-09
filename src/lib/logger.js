const core = require('@actions/core')

exports.logger = {
  debug: core.debug,
  info: core.info,
  warn: core.warning,
  error: core.error
}
