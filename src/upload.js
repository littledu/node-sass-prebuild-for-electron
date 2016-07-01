"use strict";

var path = require('path');
var async = require('async');
var qiniu = require('qiniu');
var http = require('http');
var fs = require('fs');
var config = require('rc')('qiniu');

const FILENAME = 'binding.node';
const DIRNAME = `${process.platform}-${process.arch}-${process.versions.modules}`;

let distName = `${DIRNAME}/${FILENAME}`;
let localPath = path.join(__dirname, '../', 'node-sass', 'vendor', DIRNAME, FILENAME);

async.series([
    function (next) {
        //准备上传
        qiniu.conf.ACCESS_KEY = config['ACCESS_KEY'];
        qiniu.conf.SECRET_KEY = config['SECRET_KEY'];

        var uptoken = new qiniu.rs.PutPolicy('weflow' + ":" + distName).token();

        uploadFile(uptoken, distName, localPath, function (ret) {
            console.log(ret.key + ' upload success.');
            next();
        });
    }
]);

function uploadFile(token, key, filePath, callback) {

    var extra = new qiniu.io.PutExtra();

    qiniu.io.putFile(token, key, filePath, extra, function (err, ret) {

        if (err) {
            console.log(err);
        }

        callback && callback(ret);

    });
}

