const get = require('lodash.get')

'data.average'
'data.median'
'data.runs.${n}'

const oneRunMap = [
	{
		label: 'tested URL',
		runPath: 'URL',
	},
	{
		label: 'timestamp',
		runPath: false,
		dataPath: 'completed',
		formatter: (data) => data * 1000,
	},
	{
		label: 'date',
		runPath: false,
		dataPath: 'completed',
		formatter: (data) => new Date(data * 1000).toString(),
	},
	{
		label: 'page speed score',
		runPath: 'firstView.SpeedIndex',
	},
	{
		label: 'page speed score repeat',
		runPath: 'repeatView.SpeedIndex',
	},
	{
		label: 'Tº First Byte',
		runPath: 'firstView.TTFB',
	},
	{
		label: 'Tº First Byte repeat',
		runPath: 'repeatView.TTFB',
	},
	{
		label: 'Start render',
		runPath: 'firstView.render',
	},
	{
		label: 'Start render repeat',
		runPath: 'repeatView.render',
	},
	{
		label: 'Requests (DC)',
		runPath: 'firstView.requestsDoc',
	},
	{
		label: 'Requests (DC) repeat',
		runPath: 'repeatView.requestsDoc',
	},
	{
		label: 'Images Number',
		runPath: 'firstView.Images',
		formatter: imageCounter
	},
	{
		label: 'Images repeat',
		runPath: 'repeatView.Images',
		formatter: imageCounter
	},
	{
		label: 'Bytes in (DC)',
		runPath: 'firstView.bytesInDoc',
	},
	{
		label: 'Bytes in (DC) repeat',
		runPath: 'repeatView.bytesInDoc',
	},
	{
		label: 'Document Complete Time',
		runPath: 'firstView.docTime',
	},
	{
		label: 'Document Complete Time repeat',
		runPath: 'repeatView.docTime',
	},
	{
		label: 'Load Time',
		runPath: 'firstView.fullyLoaded',
	},
	{
		label: 'Load Time repeat',
		runPath: 'repeatView.fullyLoaded',
	},
	{
		label: 'First interactive',
		runPath: 'firstView.domInteractive',
	},
	{
		label: 'First interactive repeat',
		runPath: 'repeatView.domInteractive',
	},
	{
		label: 'test reuslts URL',
		runPath: false,
		dataPath: 'summary',
	},
	{
		label: 'test ID',
		runPath: false,
		dataPath: 'id',
	},
];

const metricsMap = [
	{
		label: 'Median test',
		path: 'median',
		metrics: oneRunMap,
	},
	{
		label: 'Average test',
		path: 'average',
		metrics: oneRunMap,
	}
];

function imageDataParser(data) {
	if (!data) {
		return '';
	}

	let imgs = '';
	try {
		imgs = JSON.parse(data);
	} catch(e) {
		console.log('JSON parsing failed:',e,' for: ',data);
	}
	return imgs;
}

function imageCounter(data) {
	return imageDataParser(data).length;
}

function parseDataToMap(metric) {
	const objPath = 'data.' + (metric.runPath ? this.path + '.' + metric.runPath : metric.dataPath);
	const metricValue = get(this.data, objPath, '');
	return (typeof metric.formatter === 'function') ? metric.formatter(metricValue) : metricValue;
}

/**
 * getRelevantMetrics get only relevant data given a raw data file
 * @param obj rawData a response .data object from the wpt API
 * @param function cb callback that will be called with an error or the response object.
 */
const getRelevantMetrics = (rawData, cb) => {
	const parsedTests = metricsMap.map(testrun => {
		testrun.data = rawData;
		return testrun.metrics.map(parseDataToMap,testrun);
	})
	if (!Array.isArray(parsedTests)) {
		cb (new new Error('Test could not be parsed'));
	}
	cb (null, parsedTests);
};

module.exports = getRelevantMetrics;