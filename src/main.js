const core = require('@actions/core')
const { wait } = require('./wait')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const repoPath = core.getInput('repoPath', { required: true })

    const fs = require('fs')
    core.debug(`path is ${repoPath}`)

    const files = fs.readdirSync(repoPath)
    for (const file of files) {
      core.debug(file)
    }

    core.setOutput('yolo', 'haha')
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
