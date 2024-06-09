exports.makeMockXmlReport = (
  opts = { withUnknownFields: false, withEmptyXml: false }
) => {
  if (opts.withEmptyXml) {
    return '<?xml version="1.0" encoding="UTF-8"?>'
  }

  if (opts.withUnknownFields) {
    return '???'
  }

  return `
<?xml version="1.0" encoding="UTF-8"?>
<mutations partial="true">
    <mutation detected='true' status='KILLED' numberOfTestsRun='1'>
      <sourceFile>PrimeCalculator.kt</sourceFile>
      <mutatedClass>com.yonatankarp.mutation.testing.PrimeCalculator</mutatedClass>
      <mutatedMethod>factorial</mutatedMethod>
      <methodDescription>(I)J</methodDescription>
      <lineNumber>19</lineNumber>
      <mutator>org.pitest.mutationtest.engine.gregor.mutators.ConditionalsBoundaryMutator</mutator>
      <indexes>
        <index>4</index>
      </indexes>
      <blocks>
        <block>0</block>
      </blocks>
      <killingTest>com.yonatankarp.mutation.testing.PrimeCalculatorTest.[engine:junit-jupiter]/[class:com.yonatankarp.mutation.testing.PrimeCalculatorTest]/[method:test factorial()]</killingTest>
      <description>changed conditional boundary</description>
    </mutation>
</mutations>
`
}
