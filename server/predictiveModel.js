// predictive mathematical model from the Industrial Engineering team
function calculateRisk(nap, md, dhns, nss, tot, a) {
  // nap = No.Address.Present
  // md = Middle.Day
  // dhns = Department.High.No.Shows
  // nss = No.Show.Score
  // tot = Tuesday.Or.Thursday
  // a = Age
  var score = nap + md + 2*dhns + 3*nss + tot + a;
  return score;
}

// export function to be used in router.js
module.exports.calculateRisk = calculateRisk;
