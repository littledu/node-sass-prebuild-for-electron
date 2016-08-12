"use strict";

const path = require('path');
const http = require('http');
const fs = require('fs');

const FILENAME = 'build.js';
const HOST = 'http://o92gtaqgp.bkt.clouddn.com';

let localFilePath = path.join(__dirname, '../', 'node-sass', 'scripts', FILENAME);
let remoteFilePath = `${HOST}/${process.platform}-${process.arch}/${FILENAME}?v=${new Date().getTime()}`;

downFile(localFilePath, remoteFilePath, function (err, ret) {

    if(err){
        throw new Error(err);
    }

    if(ret === 0){
        console.log('Download success: ', localFilePath);
    }
});

function downFile(localFilePath, remoteFilePath, callback) {

    console.log(remoteFilePath + ' downloading...');
    
    let file = fs.createWriteStream(localFilePath);

    http.get(remoteFilePath, function (response) {
        if (response.statusCode !== 200) {
            callback.apply(this, [true]);
        } else {
            response.pipe(file);
            file.on('finish', function () {
                callback.apply(this, [false, 0]);
            });
        }

    }).on('error', function (err) {
        console.log('Download fail: ', localFilePath, err);
    });
}

