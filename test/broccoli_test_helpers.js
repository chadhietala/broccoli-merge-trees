var RSVP = require('rsvp')
var ncp = require('ncp')
var fixturify = require('fixturify')
var broccoli = require('broccoli');

exports.treeToFixture = function (tree) {
  var builder = new broccoli.Builder(tree);
  return builder.build()
    .then(fixturify.readSync)
    .finally(function () {
      builder.cleanup()
    })
}


exports.makeFixtureTree = FixtureTree
function FixtureTree (fixtureObject) {
  if (!(this instanceof FixtureTree)) return new FixtureTree(fixtureObject)
  this.fixtureObject = fixtureObject
  this.inputTree = fixtureObject;
}

FixtureTree.prototype.rebuild = function() {
  this.write();
}

FixtureTree.prototype.write = function () {
  fixturify.writeSync(this.outputPath, this.fixtureObject)
}


exports.dereferenceSymlinks = SymlinkDereferencer

function SymlinkDereferencer (inputTree) {
  if (!(this instanceof SymlinkDereferencer)) return new SymlinkDereferencer(inputTree)
  this.inputTree = inputTree
}

SymlinkDereferencer.prototype.rebuild = function() {
  this.write();
};

SymlinkDereferencer.prototype.write = function () {
  return RSVP.denodeify(ncp)(this.inputPath, this.outputPath, {
    dereference: true
  });
}
