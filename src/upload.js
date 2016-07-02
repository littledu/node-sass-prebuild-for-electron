"use strict";

const path = require('path');
const async = require('async');
const qiniu = require('qiniu');
const http = require('http');
const fs = require('fs');
const config = require('rc')('qiniu');

const FILENAME = 'binding.node';
const DIRNAME = `${process.platform}-${process.arch}-${process.versions.modules}`;

let distName = `${DIRNAME}/${FILENAME}`;
let localPath = path.join(__dirname, '../', 'node-sass', 'vendor', DIRNAME, FILENAME);

async.series([
    function (next) {
        //准备上传
        qiniu.conf.ACCESS_KEY = config['ACCESS_KEY'];
        qiniu.conf.SECRET_KEY = config['SECRET_KEY'];

        let uptoken = new qiniu.rs.PutPolicy('weflow' + ":" + distName).token();

        uploadFile(uptoken, distName, localPath, function (ret) {
            console.log(ret.key + ' upload success.');
            next();
        });
    }
]);

function uploadFile(token, key, filePath, callback) {

    let extra = new qiniu.io.PutExtra();

    qiniu.io.putFile(token, key, filePath, extra, function (err, ret) {

        if (err) {
            console.log(err);
        }

        callback && callback(ret);

    });
}

