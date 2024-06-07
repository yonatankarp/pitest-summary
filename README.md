# PITest Summary Action

[linter-badge]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/linter.yml/badge.svg
[linter-state]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/linter.yml
[ci-badge]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/ci.yml/badge.svg
[ci-state]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/ci.yml
[coverage-badge]: badges/coverage.svg

[![Linters][linter-badge]][linter-state] [![CI][ci-badge]][ci-state]
![coverage.svg][coverage-badge]

This action is a simple action that summarizes the results of a PITest run. It
parses the XML output of the PITest run and prints a summary of the results to
the log.

## Usage

Here's an example of how to use this action in a workflow file:

```yaml
name: Example Workflow

on:
  workflow_dispatch:
    inputs:
      file-path:
        description: 'The path to the file to be analyzed'
        required: true
        default: './mutations.xml'

permissions:
  actions: read
  contents: read

jobs:
  mutation-tests:
    name: Mutation Testing
    runs-on: ubuntu-latest

    steps:
      - name: Summarize Mutations
        id: test-action-all-mutations
        # Change @main to a specific commit SHA or version tag, e.g.:
        # yonatankarp/pitest-summary@e76147da8e5c81eaf017dede5645551d4b94427b
        # yonatankarp/pitest-summary@v1.2.3
        uses: yonatankarp/pitest-summary@add-action
        with:
          file-path: ${{ github.event.inputs.file-path }}
```

This pipeline will run the PITest mutation tests on a schedule (every day at
midnight) and summarize the results in the log.

For example, workflow runs, check out the
[Actions tab](https://github.com/yonatankarp/pitest-summary/actions)! 🚀

## Inputs

| Input                   | Default | Description                                    |
| ----------------------- | ------- | ---------------------------------------------- |
| `file-path`             |         | The path to PIT XML summary report             |
| `display-only-survived` | `false` | Whether to display only the survived mutations |
