const { startStateMachine } = require('../common/statemachines');
const { sniff } = require('../common/testUtil');
const generateName = require('../common/nameUtils');
const Promise = require('bluebird');

module.exports.handler = async event => {
  const request = JSON.parse(event.body);
  await Promise.map(request, async (messageObj) => {
    const { refId } = messageObj;
    let { aggregator } = messageObj;

    if (typeof aggregator === 'undefined' || !aggregator) {
      aggregator = 'Aggregator';
    }
    if (typeof refId !== 'undefined' && refId) {
      const nameGenerated = generateName(refId, aggregator);
      // There is a limit of 80 characters in statemachine name
      let name = nameGenerated.substr(0, 75);

      const sniffResult = sniff('menuStepsStarter', refId);
      if (sniffResult !== undefined) name = sniffResult;

      const stateMachineExec = await startStateMachine(
        process.env.STATEMACHINE_AGGREGATOR_MENU_PROCESS_ARN,
        JSON.stringify(messageObj),
        name
      );
    }
  });

  const message = {
    'message': 'Aggregator Menu Process execution started successfully!'
  }
  return {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'},
    'body': JSON.stringify(message)
  }  
};
