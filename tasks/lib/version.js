'use strict';


var inquirer = require('inquirer');
var semver = require('semver');

var messages = require('./messages');


// ---


var releaseVersionQuestion = {
  type: 'input',
  name: null,
  message: null,
  validate: function (input) {
    if (semver.valid(input)) {
      return true;
    } else {
      return messages.versionNotValid;
    }
  },
  filter: function (input) {
    return semver.valid(input);
  }
};


// ---


function _getVersion(optionName, optionOutput, message, grunt, done, mockInput) {

  var versionValue = grunt.option(optionName);

  if (!versionValue) {

    releaseVersionQuestion.name =  optionName;
    releaseVersionQuestion.message = message;

    var prompt = inquirer.prompt([releaseVersionQuestion], function (answers) {

      // Set up output value and reset question values
      grunt.option(optionOutput, answers[optionName]);
      grunt.option(optionName, answers[optionName]);
      releaseVersionQuestion.name = null;
      releaseVersionQuestion.message = null;
      done();
    });

    // Force input, used for testing
    if (mockInput) {
      prompt.rl.emit('line');
    }

  } else {

    // If value exists, just set output and move along
    grunt.option(optionOutput, versionValue);
    done();
  }
}


// ---


function getReleaseVersion(grunt, done, mockInput) {

  // setversion is the name of the config option used by grunt-bump plugin
  _getVersion('releaseVersion', 'setversion', messages.releaseVersionQuestion, grunt, done, mockInput);

}


// ---


function getNextVersion(grunt, done, mockInput) {

  // setversion is the name of the config option used by grunt-bump plugin
  _getVersion('developVersion', 'setversion', messages.releaseNextQuestion, grunt, done, mockInput);

}


// ---


module.exports = {
  releaseQuestion: releaseVersionQuestion,
  getRelease: getReleaseVersion,
  getNext: getNextVersion
};

