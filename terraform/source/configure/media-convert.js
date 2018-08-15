'use strict';

const fs = require('fs');
const AWS = require('aws-sdk');

const presets = [
  './presets/jpeg_144p.json',
  './presets/jpeg_240p.json',
  './presets/jpeg_480p.json',
  './presets/jpeg_720p.json',
  './presets/jpeg_1080p.json',
  './presets/mp4_h264_144p_30fps_300kbps.json',
  './presets/mp4_h264_240p_30fps_600kbps.json',
  './presets/mp4_h264_480p_30fps_1200kbps.json',
  './presets/mp4_h264_720p_30fps_2400kbps.json',
  './presets/mp4_h264_1080p_30fps_5400kbps.json',
];

let response;

// Return MediaConvert regional account Endpoint
let createEndPoint = () => {
  const mediaconvert = new AWS.MediaConvert();
  return new Promise((resolve, reject) => {
    mediaconvert.describeEndpoints((error, data) => {
      if (error) reject(error);
      else resolve({ EndpointUrl: data.Endpoints[0].Url });
    });
  });
};

// Create Custom MediaConvert presets
let createPreset = (preset, url) => {
  const mediaconvert = new AWS.MediaConvert({
    endpoint: url,
    region: process.env.AWS_REGION,
  });
  return new Promise((resolve, reject) => {
    let params = JSON.parse(fs.readFileSync(preset, 'utf8'));
    // TODO: update does not work
    mediaconvert.createPreset(params, (error, data) => {
      if (error) reject(error);
      else {
        console.log('created preset: ', data.Preset.Name);
        resolve(data);
      }
    });
  });
};

let createPresets = event => {
  return new Promise((resolve, reject) => {
    let promises = [];
    let url = event.EndPoint;

    presets.forEach(preset => promises.push(createPreset(preset, url)));
    Promise.all(promises)
      .then(data => {
        // Return a list of the names of the presets that we created
        resolve({
          Presets: data.reduce((list, item) => {
            list.push(item.Preset.Name);
            return list;
          }, []),
        });
      })
      .catch(error => reject(error));
  });
};

module.exports = {
  MediaConvertEndPoint: createEndPoint,
  MediaConvertPresets: createPresets,
};