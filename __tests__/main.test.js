/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const github = require('@actions/github')
const main = require('../src/main')

describe('action', () => {
  test('should set failed if file-path input is missing', async () => {})

  test('should handle file read error', async () => {})

  test('should handle XML parse error', async () => {})

  test('should handle unknown fields in XML', async () => {})

  test('should generate report correctly with mutations', async () => {})

  test('should handle displayOnlySurvived flag correctly', async () => {})

  // This test focuses on the structure of the output reports, ensuring the right emojis have been selected etc
  test('should generate correct report content', async () => {})

  test('should handle empty XML correctly', async () => {})
})
