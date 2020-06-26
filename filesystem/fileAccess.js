//
//  Exports file/directory access functions.
//

const fs = require('fs');

//  This could be anything.  Set to a local directory
//  of sample documents.
let root = './documents/';
let pathAr = [root];
let currentDirectory = () => pathAr.join('');


//  Directly set the directory to search.  No security checking here
//  beyond login authorization, so be careful.  
//  Note: A slash is oppended, ensure the parameter doesn't already
//  have one
//
//  params:
//    _directory
//
exports.setDirectory = (_directory) => {
  root = _directory + "/";
  pathAr.length = 0;

  pathAr.push(root);
}


//  Access/return all the files in the current directory.
//
exports.allFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(currentDirectory(), { withFileTypes: true }, (err, _files) => {
      if (err) reject(JSON.stringify(err));

      // ensure the read operation returned a good result
      if (typeof _files !== "undefined") {
        filesArray = _files.map(_file => _file.isDirectory() ?
          ({ type: 'directory', val: _file.name }) :
          ({ type: 'file', val: _file.name }))

        // append an up directory
        if (currentDirectory() !== root)
          filesArray.push(({ type: 'directory', val: root }));

        resolve(filesArray);
      }
      reject("Unable to access files in this directory");

    });
  })
}

//  Access/return the single file identified by _filename.
//  A promise is returned with the file.
//
//  Params:
//    _fileName - the name of the file to be returned
//
exports.file = _fileName => {
  return new Promise((resolve, reject) => {
    fs.readFile((currentDirectory() + _fileName), (err, data) => {
      if (err) reject(JSON.stringify(err));

      resolve((data));
    });
  });
}

//  Re-set the current directory to _newDirectory.
//
//  Params:
//    _newDirectory -   this will be set as the new directory
//
exports.changeDirectory = _newDirectory => {
  // going up a director? 
  if (pathAr.includes(_newDirectory)) {
    pathAr.pop();
  } else {
    pathAr.push(_newDirectory + '/');
  }

  return currentDirectory()
}
