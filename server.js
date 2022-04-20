const express = require('express');
const https = require('https');
const http = require('http');
const cors = require('cors');
const url = require('url');

const app = express();
app.use(cors({
    origin: '*'
}));
console.log("hooorrraaayyy1");
app.use('/', function(clientRequest, clientResponse) {
    let parsedPort;
    let parsedSSL;
    const target =  url.parse(clientRequest.query.url);
    console.log("taaargerrrttt===", clientRequest.query);
    // const target =  url.parse('https://api.config.watchabc.go.com/appsconfig/prod/abcnewsv1/012/3.1.0/config.json');

    if (target.protocol === 'https:') {
        parsedPort = 443
        parsedSSL = https
    } else if (target.protocol === 'http:') {
        parsedPort = 80
        parsedSSL = http
    }
    target.headers = {
        'X-Forwarded-For': '75.166.84.69',
        ...target.headers
    }
    const targetUrl = clientRequest.originalUrl.slice(6+clientRequest.query.url.length);
    const options = {
        hostname: target.host,
        protocol: target.protocol,
        port: parsedPort,
        path: target.path + targetUrl,
        method: clientRequest.method,
        headers: target.headers

    };
    
    console.log("taaargerrrttt===", options);
    const serverRequest = parsedSSL.request(options, function (serverResponse) {
        let body = '';
        if (String(serverResponse.headers['content-type']).indexOf('application/json;charset=UTF-8') !== -1) {
            serverResponse.on('data', function (chunk) {
                body += chunk;
                console.log("=======body=====", body)
            });

            serverResponse.on('end', function () {
                // Make changes to HTML files when they're done being read.
                body = body.replace(`example`, `Cat!`);

                clientResponse.writeHead(serverResponse.statusCode, serverResponse.headers);
                clientResponse.end(body);
            });
        } else {
            serverResponse.pipe(clientResponse, {
                end: true
            });
            clientResponse.contentType(serverResponse.headers['content-type'])
        }
    });

    serverRequest.end();
});

exports.server = app;
