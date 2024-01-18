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
    let spot = ''
    core.debug(`path is ${repoPath}`)
    try {
      const data = await new Promise((resolve, reject) => {
        fs.readFile(`${repoPath}/src/spots.json`, 'utf8', (err, content) => {
          if (err) reject(err)
          else resolve(content)
        })
      })

      try {
        spot = parseSpots(data)
      } catch (error) {
        core.setFailed(`Error parsing spots.json file : ${error}`)
      }
    } catch (readFileError) {
      core.setFailed(`Error reading spots.json file : ${readFileError.message}`)
      return
    }

    core.setOutput('spotName', spot['name'])
  } catch (error) {
    core.setFailed(error.message)
  }
}

function parseSpots(spots) {
  let jsonData = ''
  try {
    jsonData = JSON.parse(spots)
  } catch {
    throw new Error('Failed to parse json')
  }

  for (const spot of jsonData['spots']) {
    if (
      !Object.prototype.hasOwnProperty.call(spot, 'type') ||
      spot['type'] === '' ||
      !['plaine', 'bord de mer'].includes(spot['type'])
    ) {
      throw new Error(
        `spot ${spot['name']} has wrong values for type, plaine or bord de mer`
      )
    }
  }

  return jsonData['spots'][Math.floor(Math.random() * jsonData['spots'].length)]
}

module.exports = {
  run
}
