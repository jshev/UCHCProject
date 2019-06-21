function calculateRisk(nap, md, dhns, nss) {
  var score = nap + md + 2*dhns + 3*nss;
  return score;
}

//console.log("RISK");
//console.log(calculateRisk(1,1,1,0));

module.exports.calculateRisk = calculateRisk
