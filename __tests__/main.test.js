/**
 * Unit tests for the action's main functionality, src/main.js
 */

const fs = require('node:fs/promises')
const core = require('@actions/core')
const { MarkdownReport } = require('../src/lib/markdown-report')
const { logger } = require('../src/lib/logger')

jest.mock('node:fs/promises')
jest.mock('@actions/core')
jest.mock('../src/lib/markdown-report')

describe('/src/main.js', () => {
  test('should handle file read error', async () => {
    // arrange
    const mockReadErrorMessage = 'File not found!'
    fs.readFile.mockRejectedValue(new Error(mockReadErrorMessage))

    // act
    await require('../src/main').run()

    // assert
    await expect(core.setFailed).toHaveBeenCalledWith(
      `Error reading XML file: ${mockReadErrorMessage}`
    )
  })

  test('should handle XML parse error', async () => {
    // arrange
    const mockParseErrorMessage = 'Parse failed!'
    const mockXml = require('./fixtures/pitest-report').makeMockXmlReport()
    fs.readFile.mockResolvedValue(mockXml)
    MarkdownReport.mockImplementation(() => {
      return {
        fromXml: jest.fn().mockRejectedValue(new Error(mockParseErrorMessage))
      }
    })

    // act
    await require('../src/main').run()

    // assert
    await expect(MarkdownReport).toHaveBeenCalledWith({
      displayOnlySurvived: false,
      logger
    })
    await expect(core.setFailed).toHaveBeenCalledWith(
      `Error parsing XML: ${mockParseErrorMessage}`
    )
  })

  test('should handle unknown fields in XML', async () => {})

  test('should generate report correctly with mutations', async () => {})

  test('should handle displayOnlySurvived flag correctly', async () => {})

  // This test focuses on the structure of the output reports, ensuring the right emojis have been selected etc
  test('should generate correct report content', async () => {})

  test('should handle empty XML correctly', async () => {})
})
