const fs = require('fs')
const xml2js = require('xml2js')
const core = require('@actions/core')
const { run } = require('../src/main')

describe('run', () => {
  const mockFilePath = './mutations.xml'
  const mockXmlData = `
    <mutations>
      <mutation detected="true" status="KILLED">
        <sourceFile>file1.js</sourceFile>
        <mutatedMethod>method1</mutatedMethod>
        <lineNumber>10</lineNumber>
        <description>Mutation 1 description</description>
      </mutation>
      <mutation detected="false" status="SURVIVED">
        <sourceFile>file2.js</sourceFile>
        <mutatedMethod>method2</mutatedMethod>
        <lineNumber>20</lineNumber>
        <description>Mutation 2 description</description>
      </mutation>
    </mutations>
  `

  beforeEach(() => {
    jest.mock('fs')
    jest.mock('xml2js')
    jest.mock('@actions/core')

    core.getInput.mockImplementation(name => {
      if (name === 'file-path') return mockFilePath
      if (name === 'display-only-survived') return 'false'
    })
  })

  test('should read and parse XML file and generate summary report', async () => {
    fs.readFile.mockImplementation((filePath, callback) => {
      callback(null, mockXmlData)
    })

    const parseStringMock = jest.fn((data, callback) => {
      callback(null, {
        mutations: {
          mutation: [
            {
              $: { detected: 'true', status: 'KILLED' },
              sourceFile: ['file1.js'],
              mutatedMethod: ['method1'],
              lineNumber: ['10'],
              description: ['Mutation 1 description']
            },
            {
              $: { detected: 'false', status: 'SURVIVED' },
              sourceFile: ['file2.js'],
              mutatedMethod: ['method2'],
              lineNumber: ['20'],
              description: ['Mutation 2 description']
            }
          ]
        }
      })
    })
    xml2js.Parser.mockImplementation(() => ({ parseString: parseStringMock }))

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, expect.any(Function))
    expect(parseStringMock).toHaveBeenCalledWith(
      mockXmlData,
      expect.any(Function)
    )
    expect(core.summary.addRaw).toHaveBeenCalledWith(
      expect.stringContaining('Mutation Test Summary')
    )
    expect(core.summary.write).toHaveBeenCalled()
  })

  test('should handle file read error', async () => {
    fs.readFile.mockImplementation((filePath, callback) => {
      callback(new Error('File read error'))
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Error reading XML file: File read error'
    )
  })

  test('should handle XML parse error', async () => {
    fs.readFile.mockImplementation((filePath, callback) => {
      callback(null, mockXmlData)
    })

    const parseStringMock = jest.fn((data, callback) => {
      callback(new Error('XML parse error'))
    })
    xml2js.Parser.mockImplementation(() => ({ parseString: parseStringMock }))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Error parsing XML: XML parse error'
    )
  })

  test('should display only survived mutations if display-only-survived is true', async () => {
    core.getInput.mockImplementation(name => {
      if (name === 'file-path') return mockFilePath
      if (name === 'display-only-survived') return 'true'
    })

    fs.readFile.mockImplementation((filePath, callback) => {
      callback(null, mockXmlData)
    })

    const parseStringMock = jest.fn((data, callback) => {
      callback(null, {
        mutations: {
          mutation: [
            {
              $: { detected: 'true', status: 'KILLED' },
              sourceFile: ['file1.js'],
              mutatedMethod: ['method1'],
              lineNumber: ['10'],
              description: ['Mutation 1 description']
            },
            {
              $: { detected: 'false', status: 'SURVIVED' },
              sourceFile: ['file2.js'],
              mutatedMethod: ['method2'],
              lineNumber: ['20'],
              description: ['Mutation 2 description']
            }
          ]
        }
      })
    })
    xml2js.Parser.mockImplementation(() => ({ parseString: parseStringMock }))

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, expect.any(Function))
    expect(parseStringMock).toHaveBeenCalledWith(
      mockXmlData,
      expect.any(Function)
    )
    expect(core.summary.addRaw).toHaveBeenCalledWith(
      expect.stringContaining('Mutation Test Summary')
    )
    expect(core.summary.addRaw).not.toHaveBeenCalledWith(
      expect.stringContaining('method1')
    )
    expect(core.summary.addRaw).toHaveBeenCalledWith(
      expect.stringContaining('method2')
    )
    expect(core.summary.write).toHaveBeenCalled()
  })
})
