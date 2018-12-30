/*
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 *
 * API Doc link
 * https://decisiontree.io/api_docs#Decision
 *
 * API endpoints
 * Network tab in develop console of any web browser
 */

exports.decision = function decision(req, res) {
  // decision name captured on Dialogflow
  title = req.body.queryResult.parameters.title;
  // decision ID captured on Dialogflow
  decisionID = req.body.queryResult.parameters.decisionID;
  // user email captured on Dialogflow
  userEmail = req.body.queryResult.parameters.userEmail;
  // decision option captured on Dialogflow
  option = req.body.queryResult.parameters.option;
  // choice ID captured on Dialogflow
  choiceID = req.body.queryResult.parameters.choiceID;

  // set response in JSON format
  res.setHeader('Content-Type', 'application/json');

  // node.js library unirest
  var unirest = require("unirest");

  // Create a decision
  // Retrieve captured value on Dialogflow and send value to API
  // POST
  // API: api/decisions
  var req = unirest("POST", "https://decisiontree.io/api/decisions");
  req.headers({
    "Cache-Control": "no-cache",
    "Authorization": "Bearer [Insert DecisionTree token here]",
    "Content-Type": "application/json"
  });

  // JSON format to pass the parameters to API
  // parameters
  // name: API parameter
  // title : parameter created on Dialogflow
  req.query({
    "name": title
  });

  // Share decision to user
  // Retrieve captured value on Dialogflow and send value to API
  // POST
  // API: api/ballots
  var share = unirest("POST", "https://decisiontree.io/api/ballots");
  share.headers({
    "Cache-Control": "no-cache",
    "Authorization": "Bearer [Insert DecisionTree token here]",
    "Content-Type": "application/json"
  });

  // JSON format to pass parameters to API
  // parameters
  // decisionId: API parameter
  // decisionID: parameter created on Dialogflow
  // email: API parameter
  // userEmail: parameter created on Dialogflow
  share.query({
    "decisionId": decisionID,
    "email": userEmail
  });

  // Create option for the decision
  // Retrieve captured value on Dialogflow and send value to API
  // Post
  // API : api/choices
  var options = unirest("POST", "https://decisiontree.io/api/choices/");
  options.headers({
    "Cache-Control": "no-cache",
    "Authorization": "Bearer [Insert DecisionTree token here]",
    "Content-Type": "application/json"
  });

  // JSON format to pass parameters to API
  // parameters
  // name: API parameter
  // option: paramter created on Dialogflow
  // decision_id: API parameter
  // decisionID: parametr created on Dialogflow
  options.query({
    "name": option,
    "decision_id": decisionID
  });

  // console log
  req.end(function(res) {
    if (res.error) throw new Error(res.error);
    console.log(res.body);
  });
  share.end(function(res) {
    if (res.error) throw new Error(res.error);
    console.log(res.body);
  });
  options.end(function(res) {
    if (res.error) throw new Error(res.error);
    console.log(res.body);
  });
};
