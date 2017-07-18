const WebPageTest = require('WebPageTest')
const credentials = require('./credentials')
const metricsParse = require('./metrics-parse')
const fs = require('fs')

const wpt = new WebPageTest('https://www.webpagetest.org/', credentials.apiKey);

// time we will wait untill we check again if the test is ready.
const refreshTimeout = 5 * 60 * 1000;

// pollResults method could also be used, but later we will use the pingback param.
const waitForTestResult = (testId) => {
	wpt.getTestStatus(testId, function processTestStatus (err, result) {
		if (err) {
			console.error(err, 'there was an error trying to get the status of:' + testId);
			return err;
		}

		if (result.statusCode != 200) {
			console.log('Test not ready, waiting ' + (refreshTimeout/60000) + ' minutes');
			setTimeout(waitForTestResult, refreshTimeout, testId);
		} else {
			loadResultData(testId);
		}
	});
};

const loadResultData = (testId) => {
	wpt.getTestResults(testId, function processTestResults (err, result) {
		if (err) {
			console.error(err, 'there was an error trying to get the results of:' + testId);
			return err;
		}
		storeRawTestResult(testId, result);
		metricsParse(result, (err, response) => {
			//console.log(err || response)
			if (err) {
				console.log(err, 'Parsing of the response failed.');
			}
		});
		
	});
};

const storeRawTestResult = (testId, rawData) => {
	const testFileStream = fs.createWriteStream('tests/raw/wpt-' + testId + '.txt');
	testFileStream.write(JSON.stringify(rawData, null, 2));
	testFileStream.end();
}

waitForTestResult('170718_K8_1487');//170718_VS_QXJ