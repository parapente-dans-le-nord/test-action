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

      try {
        const spots = parseSpots(data)
        spotName = spots['spots'][0]['name']
      } catch (error) {
        core.setFailed(`Error parsing spots.json file : ${error}`)
      }
    } catch (readFileError) {
      core.setFailed(`Error reading spots.json file : ${readFileError.message}`)
      return
    }

    core.setOutput('yolo', spotName)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function parseSpots(spots) {
  const jsonData = JSON.parse(spots)
  const spotName = jsonData['spots'][0]['name']
  core.debug(spotName)
  if (spotName === 'Olhain') {
    throw new Error('La valeur est Olhain, ça fait chier')
  }
  return jsonData
}

module.exports = {
  run
}
