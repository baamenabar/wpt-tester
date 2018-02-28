/**
 *  Some comments that should be reorganized once the app is working
 *
 * Test options params
    Conectivity options: (Cable|DSL|FIOS|Dial|3G|3GFast|Native|custom) [Cable]
    localtion: get it from http://www.webpagetest.org/getLocations.php or with command: webpagetest locations
                To choose a broser append it's name with colon i.e: Frankfurt:Firefox
 */

 

const WebPageTest = require('WebPageTest')
const credentials = require('./credentials')

const wpt = new WebPageTest('https://www.webpagetest.org/', credentials.apiKey)


var levelup = require('levelup');
var db = levelup('./db-req')

//Require level-jobs
var Jobs = require('level-jobs');

// primera prueba: 170718_5M_QQF
// segunda prueba: 170718_VS_QXJ
// tercera prueba: 170718_Z1_SV8
// cuarta  prueba: 170718_K8_1487 (5 runs)
// 
const defaultTestConfig = {
    url: 'https://www.westwingnow.de/',
    runnerConfig: {
        connectivity: '3GFast',
        location: 'Falkenstein:Chrome',
        firstViewOnly: false,
        runs: 5,
        video: true,
        label: 'home',
        emulateMobile: true,
    }
}

const testsList = [
    {
        url: 'https://www.westwingnow.de/',
        runnerConfig: {
            label: 'home',
            emulateMobile: true,
        },
    },
    {
        url: 'https://www.westwingnow.de/',
        runnerConfig: {
            label: 'home-desktop',
            emulateMobile: false,
        },
    },
    {
        url: 'https://www.westwingnow.de/moebel',
        runnerConfig: {
            label: 'plp',
            emulateMobile: true,
        },
    },
    {
        url: 'https://www.westwingnow.de/moebel',
        runnerConfig: {
            label: 'plp-desktop',
            emulateMobile: false,
        },
    },
    {
        url: 'https://www.westwingnow.de/pouf-minx-45557.html',
        runnerConfig: {
            label: 'pdp',
            emulateMobile: true,
        },
    },
    {
        url: 'https://www.westwingnow.de/pouf-minx-45557.html',
        runnerConfig: {
            label: 'pdp-desktop',
            emulateMobile: false,
        },
    },
    {
        url: 'https://www.westwingnow.de/port-maine/',
        runnerConfig: {
            label: 'brandpage',
            emulateMobile: true,
        },
    },
    {
        url: 'https://www.westwingnow.de/port-maine/',
        runnerConfig: {
            label: 'brandpage-desktop',
            emulateMobile: false,
        },
    },
    {
        url: 'https://www.westwingnow.de/looks/',
        runnerConfig: {
            label: 'looks-listing',
            emulateMobile: true,
        },
    },
    {
        url: 'https://www.westwingnow.de/looks/',
        runnerConfig: {
            label: 'looks-listing-desktop',
            emulateMobile: false,
        },
    },
    {
        url: 'https://www.westwingnow.de/looks/skandi-office/',
        runnerConfig: {
            label: 'ldp-listing',
            emulateMobile: true,
        },
    },
    {
        url: 'https://www.westwingnow.de/looks/skandi-office/',
        runnerConfig: {
            label: 'ldp-desktop',
            emulateMobile: false,
        },
    },
];

const tests = prepareTests(testsList);

function prepareTests (list) {
    return list.map(test => {
        return {
            url: test.url,
            runnerConfig: Object.assign({}, defaultTestConfig.runnerConfig, test.runnerConfig),
        }
    });
}

function requestTests(list) {
    list.forEach(test => {
        wpt.runTest(
            test.url, 
            test.runnerConfig, 
            function processTestRequest(err, result) {
                if (err) {
                    console.log('There was an error. Test was skiped', err);
                    return;
                }
                if (result.statusCode != 200) {
                    console.log('Served responded with an error.', result.statusCode, result.statusText);
                    return;
                }
                console.log('queuing test id: ' + result.data.testId);
                queueTestRequest(result.data.testId);
            }
        );
    });
}

function getTestStatus (id, testO, cb) {
    // body...
}

const queue = Jobs(db, getTestStatus, {
    maxConcurrency: 2,
    maxRetries: 10,
    backoff: {
        initialDelay: 5 * 60 * 1000,
        maxDelay: 10 * 60 * 1000
    }

});

function queueTestRequest(testId) {
    queue.push({id: testId}, err => {if(err)console.log('Error pushing job to queue', err)});
}