# PITest Summary Action

[linter-badge]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/linter.yml/badge.svg
[linter-state]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/linter.yml
[ci-badge]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/ci.yml/badge.svg
[ci-state]:
  https://github.com/yonatankarp/pitest-summary/actions/workflows/ci.yml

[![Linters][linter-badge]][linter-state] [![CI][ci-badge]][ci-state]

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
      who-to-greet:
        description: Who to greet in the log
        required: true
        default: 'World'
        type: string

jobs:
  say-hello:
    name: Say Hello
    runs-on: ubuntu-latest

    steps:
      # Change @main to a specific commit SHA or version tag, e.g.:
      # actions/hello-world-javascript-action@e76147da8e5c81eaf017dede5645551d4b94427b
      # actions/hello-world-javascript-action@v1.2.3
      - name: Print to Log
        id: print-to-log
        uses: actions/hello-world-javascript-action@main
        with:
          who-to-greet: ${{ inputs.who-to-greet }}
```

For example workflow runs, check out the
[Actions tab](https://github.com/actions/hello-world-javascript-action/actions)!
:rocket:

## Inputs

| Input          | Default | Description                     |
| -------------- | ------- | ------------------------------- |
| `who-to-greet` | `World` | The name of the person to greet |

## Outputs

| Output | Description             |
| ------ | ----------------------- |
| `time` | The time we greeted you |
