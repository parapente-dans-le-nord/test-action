const core = require('@actions/core')
const { wait } = require('./wait')
const fs = require('fs')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const repoPath = core.getInput('repoPath', { required: true })
    core.debug(`path is ${repoPath}`)
    let spotName = ''

    try {
      const data = await new Promise((resolve, reject) => {
        fs.readFile(`${repoPath}/src/spots.json`, 'utf8', (err, content) => {
          if (err) reject(err)
          else resolve(content)
        })
      })

      const jsonData = JSON.parse(data)
      spotName = jsonData['spots'][0]['name']
      core.debug(spotName)
    } catch (readFileError) {
      core.setFailed(
        `Error reading or parsing spots.json: ${readFileError.message}`
      )
      return
    }

    core.setOutput('yolo', spotName)
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
