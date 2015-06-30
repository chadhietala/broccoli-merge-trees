var expect = require('chai').expect;
var testHelpers = require('./broccoli_test_helpers');
var mergeTrees = require('../');
var makeFixtureTree = testHelpers.makeFixtureTree;
var treeToFixture = testHelpers.treeToFixture;
var dereferenceSymlinks = testHelpers.dereferenceSymlinks;

var mergeFixtures = function(inputFixtures, options) {
  return treeToFixture(dereferenceSymlinks(mergeTrees(inputFixtures.map(makeFixtureTree), options)));
};

var conflictErr = function() {
  return function(err) {
    return expect(err.message).to.be.closeTo(/Merge error: conflicting file types: foo is a directory in .* but a file in .*/, 0.5);
  }
};

var capitalizationErr = function() {
  return function(err) {
    return expect(err.message).to.be.closeTo(/Merge error: conflicting capitalizations:\nFOO in .*\nFoo in .*\nRemove/);
  }
};

var createResults = function(t, results, content, overwrite) {
  return function() {
    var j, len1, ref1, results1;
    ref1 = ['1', {}];
    results1 = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      content = ref1[j];
      results1.push(mergeFixtures([
        {
          FOO: content
        }, {
          Foo: content
        }
      ], {
        overwrite: overwrite
      }).catch(capitalizationErr()));
    }
    return results1;
  }
}

describe('mergeTrees', function() {

  it('files and symlinks', function() {
    return mergeFixtures([
      {
        foo: '1',
        bar: ['foo']
      }, {
        baz: '2'
      }
    ]).then(function(out) {
      expect(out).to.deepEqual({
        foo: '1',
        bar: '1',
        baz: '2'
      });
    });
  });

  // test('refuses to overwrite files by default', function(t) {
  //   t.plan(1);
  //   return mergeFixtures([
  //     {
  //       foo: '1a',
  //       bar: '2a'
  //     }, {
  //       foo: '1b',
  //       bar: '2b'
  //     }
  //   ]).catch(function(err) {
  //     return t.similar(err.message, /Merge error: file bar exists in .* and [^]* overwrite: true/);
  //   });
  // });

  // test('accepts { overwrite: true }', function(t) {
  //   t.plan(1);
  //   return mergeFixtures([
  //     {
  //       foo: '1a',
  //       bar: '2',
  //       baz: ['foo']
  //     }, {
  //       foo: '1b',
  //       bar: ['foo'],
  //       baz: '3'
  //     }, {
  //       foo: '1c'
  //     }
  //   ], {
  //     overwrite: true
  //   }).then(function(out) {
  //     return t.deepEqual(out, {
  //       foo: '1c',
  //       bar: '1b',
  //       baz: '3'
  //     });
  //   });
  // });

  // test('refuses to honor conflicting capitalizations', function(t) {
  //   var content, i, len, overwrite, ref, results;
  //   t.plan(4);
  //   ref = [false, true];
  //   results = [];
  //   for (i = 0, len = ref.length; i < len; i++) {
  //     overwrite = ref[i];
  //     results.push(createResults(t, results, content, overwrite));
  //   }
  //   return results;
  // });

  // test('directories', function(t) {
  //   t.plan(1);
  //   return mergeFixtures([
  //     {
  //       subdir: {
  //         foo: '1'
  //       }
  //     }, {
  //       subdir2: {}
  //     }, {
  //       subdir: {
  //         bar: '2'
  //       }
  //     }
  //   ]).then(function(out) {
  //     return t.deepEqual(out, {
  //       subdir: {
  //         foo: '1',
  //         bar: '2'
  //       },
  //       subdir2: {}
  //     });
  //   });
  // });

  // test('directory collision with file', function(t) {
  //   var i, len, overwrite, ref, results;
  //   t.plan(4);
  //   ref = [false, true];
  //   results = [];
  //   for (i = 0, len = ref.length; i < len; i++) {
  //     overwrite = ref[i];
  //     mergeFixtures([
  //       {
  //         foo: {}
  //       }, {
  //         foo: '1'
  //       }
  //     ], {
  //       overwrite: overwrite
  //     }).catch(conflictErr(t));

  //     results.push(mergeFixtures([
  //       {
  //         foo: '1'
  //       }, {
  //         foo: {}
  //       }
  //     ], {
  //       overwrite: overwrite
  //     }).catch(conflictErr(t)));
  //   }
  //   return results;
  // });

});