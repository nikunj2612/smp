var fs      = require('fs-extra');
var path    = require('path');
var logPath = path.join(path.dirname(module.parent.filename), 'logs', 'smp.log');
var moment = require('moment-timezone');

var streamOptions = {
    flags   : "a",
    encoding: "utf8",
    mode    : 0666
};

var stream  = fs.createWriteStream(logPath, streamOptions);

var logger = require('tracer').console({
    dateformat: "dd mmm HH:MM:ss.L",
    format: [
        "| {{title}} | {{timestamp}} : {{file}} : {{line}} - {{message}} ",
        {
        error: "| {{title}} | {{timestamp}} : {{file}} : {{line}} - {{message}} "
        }
    ],
    preprocess: function(data) {
        data.title = data.title.toUpperCase();
    },
    transport : function(data) {
        console.log(data.output);
        stream.write(data.output + "\n");
    }
});

logger.info('[logger] log path: %s', logPath);

exports    = module.exports = {};

exports.getLogger = () => {
    return logger;
};

exports.rotateFile = () =>{
    var fileName = 'smp-'+moment().subtract(1, 'day').format('YYYY-MM-DD') +'.log';
    var filePath =  path.join(path.dirname(module.parent.filename), 'logs', fileName);
    stream.end();
    try {
        fs.copySync(logPath, filePath);
        console.log('Log file copied')
    } catch (err) {
        console.error(err)
    }
    try {
        fs.removeSync(logPath);
        console.log('Old log file removed')
    } catch (err) {
        console.error(err)
    }

    stream  = fs.createWriteStream(logPath, streamOptions);
};