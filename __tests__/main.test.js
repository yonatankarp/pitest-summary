/**
 * Unit tests for the action's main functionality, src/main.js
 */

const fs = require('node:fs/promises')
// const xml2js = require('xml2js')
const core = require('@actions/core')

jest.mock('node:fs/promises')
// jest.mock('xml2js')
jest.mock('@actions/core')

describe('/src/main.js', () => {
  test('should set failed if file-path input is missing', async () => {
    // arrange
    const mockReadErrorMessage = 'File not found'
    core.getInput.mockReturnValueOnce('stam_file.xml')
    core.getInput.mockReturnValueOnce('false')
    fs.readFile.mockRejectedValue(new Error(mockReadErrorMessage))

    // act
    await require('../src/main').run()

    // assert
    await expect(core.setFailed).toHaveBeenCalledWith(
      `Error reading XML file: ${mockReadErrorMessage}`
    )
  })

  test('should handle file read error', async () => {})

  test('should handle XML parse error', async () => {})

  test('should handle unknown fields in XML', async () => {})

  test('should generate report correctly with mutations', async () => {})

  test('should handle displayOnlySurvived flag correctly', async () => {})

  // This test focuses on the structure of the output reports, ensuring the right emojis have been selected etc
  test('should generate correct report content', async () => {})

  test('should handle empty XML correctly', async () => {})
})
