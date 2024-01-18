const core = require('@actions/core')
const { wait } = require('./wait')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const repoPath = core.getInput('repoPath', { required: true })
    let spotName = ''

    const fs = require('fs')
    core.debug(`path is ${repoPath}`)

    const files = fs.readdirSync(repoPath)
    for (const file of files) {
      core.debug(file)
    }

    fs.readFile(`${repoPath}/src/spots.json`, 'utf8', (err, data) => {
      if (err) {
        core.setFailed('spots.json does not exist')
        return
      }

      try {
        const jsonData = JSON.parse(data)
        spotName = jsonData['spots'][0]['name']
        core.debug(spotName)
      } catch (parseError) {
        core.setFailed('spots.json is not parsable')
      }
    })

    core.setOutput('yolo', spotName)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
