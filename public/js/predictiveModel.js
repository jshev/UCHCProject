function calculateRisk(nap, md, dhns, nss, tot, a) {
  var score = nap + md + 2*dhns + 3*nss + tot + a;
  return score;
}

//console.log("RISK");
//console.log(calculateRisk(1,1,1,0));

module.exports.calculateRisk = calculateRisk
