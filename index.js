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

wpt.runTest('https://www.westwingnow.de/moebel/', {
    connectivity: '3GFast',
    location: 'Falkenstein:Chrome',//'ec2-eu-central-1:Chrome',
    firstViewOnly: false,
    runs: 5,
    video: true,
    label: 'plp-mobile',
    emulateMobile: true,
}, function processTestRequest(err, result) {
  console.log(err || result)
});

// primera prueba: 170718_5M_QQF
// segunda prueba: 170718_VS_QXJ
// tercera prueba: 170718_Z1_SV8
// cuarta  prueba: 170718_K8_1487 (5 runs)