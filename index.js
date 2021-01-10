const child_process = require("child_process");
const fs = require('fs');
const https = require('https');
const extract = require('extract-zip');
const tmp = require('tmp');

exports.handler = async (event) => {
    const url = buildUrl(event);
    const unzippedDirectory = await downloadAndUnzip(url);
    const output = runDeploymentScript(unzippedDirectory);
    const response = {
        statusCode: 200,
        body: JSON.stringify(output),
    };
    return response;
};

function buildUrl() {
    return 'https://github.com/carlschroedl/deployment-example/archive/1.0.0.zip';
}

function createTempDirectory() {
    const tempDirectory = tmp.dirSync();
    console.log('tempDirectory');
    console.dir(tempDirectory);
    return tempDirectory;
}

async function downloadAndUnzip(url) {
    const downloadDir = createTempDirectory();
    const downloadFile = downloadDir + '/deploy.zip';
    const destinationDir = createTempDirectory();
    await download(url, downloadFile);
    await unzip(downloadFile, destinationDir); 
    return destinationDir;
}


/**
 * Downloads file from remote HTTPS host and puts its contents to the
 * specified location.
 * https://stackoverflow.com/a/62056725
 */
async function download(url, filePath) {
  const proto = https;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = proto.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo));

    request.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}

async function unzip(zipFile, destination) {
    await extract(file, {
        dir: destination
    });
}

function runScript(scriptPath) {
    const output = child_process.execSync(
        'scriptPath',
        {
            encoding: 'UTF-8' 
        }
    );
    return output;
}
