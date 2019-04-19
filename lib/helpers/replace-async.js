'use strict';

/**
 * Dependencies
 */
let Filequeue = require('filequeue');
const fs = new Filequeue(200);
const makeReplacements = require('./make-replacements');

/**
 * Helper to replace in a single file (async)
 */
module.exports = function replaceAsync(file, from, to, enc, dry) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, enc, (error, contents) => {
      //istanbul ignore if
      if (error) {
        return reject(error);
      }

      //Replace contents and check if anything changed
      let newContents = makeReplacements(contents, from, to, file);
      if (newContents === contents) {
        return resolve({file, hasChanged: false});
      }

      //Dry run, resolve
      if (dry) {
        return resolve({file, hasChanged: true});
      }

      //Write to file
      fs.writeFile(file, newContents, enc, error => {
        //istanbul ignore if
        if (error) {
          return reject(error);
        }
        resolve({file, hasChanged: true});
      });
    });
  });
};
