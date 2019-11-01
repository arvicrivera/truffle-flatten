const fs = require('fs-extra')

async function flatten(config) {
  const flattener = await require('truffle-flattener');
  artifact = config._[1]
  artifactSource = config._[2]

  console.log("artifact: " + artifact)
  console.log("artifactSource: " + artifactSource)

  const versionReg = /pragma solidity \^?([0-9]+.[0-9]+.[0-9]+;)/g
  const experimentalReg = /pragma experimental ABIEncoderV2;/g
  const emptyReg = /^\s*[\r\n]/gm
  let flatSourceCode = await flattener([ artifactSource ], '.');
  let versions = flatSourceCode.match(versionReg);
  let experimentals = flatSourceCode.match(experimentalReg);
  let pragmaVersion = versions[0] ? versions[0] : "";
  let pragmaExperimental = experimentals[0] ? experimentals[0] : "";
  flatSourceCode = flatSourceCode.replace(versionReg, "")
  flatSourceCode = flatSourceCode.replace(experimentalReg, "")
  flatSourceCode = flatSourceCode.replace(emptyReg,"")
  flatSourceCode = pragmaExperimental + "\n" + flatSourceCode
  flatSourceCode = pragmaVersion + "\n" + flatSourceCode
  let fileName = "flat/" + artifact + "_Flattened.sol";
  console.log("Flatten file generated: " + fileName)
  fs.outputFileSync(fileName, flatSourceCode, function (err) {
    if (err) throw err;
  })
}

module.exports = async (config) => {
  if(config.help) {
    console.log("truffle run verify <Contract_Name> <Contract_Source>")
    done(null, [], [])
    return
  }
  await flatten(config)
}
