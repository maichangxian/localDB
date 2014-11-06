// Generated by CoffeeScript 1.8.0
define(function(require, exports, module) {
  "use strict";
  var Collection, LocalDB, Utils, db, Promise;
  LocalDB = require("localdb");
  Collection = require("lib/collection");
  Utils = require('lib/utils');
  db = new LocalDB("foo");
  Promise = require('lib/promise')
  return describe("Collection", function() {
    var bar;
    it("wrong usage", function() {
      var bar, e;
      try {
        return bar = db.collection();
      } catch (_error) {
        e = _error;
        return expect(e.message).toEqual("collectionName should be specified.");
      }
    });
    bar = db.collection("bar");
    it("Init", function() {
      return expect(bar instanceof Collection).toEqual(true);
    });
    it("Insert", function() {
      bar = db.collection("insert");
      return bar.insert({
        a: 1,
        b: "abc",
        c: /hell.*ld/,
        d: {
          e: 4,
          f: "5"
        },
        g: function(h) {
          return h * 3;
        },
        i: [1, 2, 3]
      }, function() {
        return bar.find(function(data) {
          data = data[0];
          expect(data.a).toEqual(1);
          expect(data.b).toEqual("abc");
          expect(data.c.test("hello world")).toEqual(true);
          expect(data.d).toEqual({
            e: 4,
            f: "5"
          });
          expect(Utils.isFunction(data.g)).toEqual(true);
          expect(data.g(100)).toEqual(300);
          return expect(data.i).toEqual([1, 2, 3]);
        });
      });
    });
    it("InsertPromise", function() {
      bar = db.collection("InsertPromise");
      return bar.insert({
        a: 1,
        b: "abc",
        c: /hell.*ld/,
        d: {
          e: 4,
          f: "5"
        },
        g: function(h) {
          return h * 3;
        },
        i: [1, 2, 3]
      }).then(function(val) {
        bar = db.collection("InsertPromise");
        return bar.find(function(data) {
          data = data[0];
          expect(data.a).toEqual(1);
          expect(data.b).toEqual("abc");
          expect(data.c.test("hello world")).toEqual(true);
          expect(data.d).toEqual({
            e: 4,
            f: "5"
          });
          expect(Utils.isFunction(data.g)).toEqual(true);
          expect(data.g(100)).toEqual(300);
          return expect(data.i).toEqual([1, 2, 3]);
        });
      });
    });
    it("Insert List", function() {
      bar = db.collection("insertList");
      return bar.insert([
        {
          a: 1,
          b: 2,
          c: 3
        }, {
          a: 2,
          b: 3,
          c: 4
        }
      ], function() {
        bar.find(function(data) {
          return expect(data.length).toEqual(2);
        });
        return bar.insert([
          {
            a: 1,
            b: 2,
            c: 3
          }, 4, {
            a: 2,
            b: 3,
            c: 4
          }
        ], function() {
          return bar.find(function(data) {
            return expect(data.length).toEqual(4);
          });
        });
      });
    });
    it("InsertListPromise", function() {
      bar = db.collection("InsertListPromise");
      return bar.insert([
        {
          a: 1,
          b: 2,
          c: 3
        }, {
          a: 2,
          b: 3,
          c: 4
        }
      ]).then(function(val) {
        bar = db.collection("InsertListPromise");
        bar.find(function(data) {
          return expect(data.length).toEqual(2);
        });
        return bar.insert([
          {
            a: 1,
            b: 2,
            c: 3
          }, 4, {
            a: 2,
            b: 3,
            c: 4
          }
        ]).then(function(val) {
          return bar.find(function(data) {
            return expect(data.length).toEqual(4);
          });
        });
      });
    });
    it("Update", function() {
      bar = db.collection("update");
      return bar.insert({
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 4
        },
        f: function(x) {
          return x * x;
        },
        g: [1, 2, 3, 4],
        h: "abc",
        price: 10.99,
        max1: 100,
        max2: 200,
        min1: 50,
        min2: 30,
        unchanged_val: 100
      }, function() {
        return bar.update({
          $set: {
            a: 4,
            "c.d": 5
          },
          $inc: {
            b: 2
          },
          $rename: {
            f: "function"
          },
          $unset: {
            h: ""
          },
          $mul: {
            price: 1.25
          },
          $max: {
            max1: 120,
            max2: 150
          },
          $min: {
            min1: 80,
            min2: 10
          },
          unchanged_val: 119
        }, function() {
          return bar.find(function(data) {
            data = data[0];
            expect(data.a).toEqual(4);
            expect(data.c.d).toEqual(5);
            expect(data.b).toEqual(4);
            expect(data.f).not.toBeDefined();
            expect(Utils.isFunction(data["function"])).toEqual(true);
            expect(data["function"](9)).toEqual(81);
            expect(data.h).not.toBeDefined();
            expect(data.max1).toEqual(120);
            expect(data.max2).toEqual(200);
            expect(data.min1).toEqual(50);
            expect(data.min2).toEqual(10);
            expect(data.unchanged_val).toEqual(100);
            return bar.drop(function() {
              return bar.insert({
                a: 1
              }, function() {
                return bar.update({
                  $set: {
                    a: 2
                  }
                }, {
                  where: {
                    a: 2
                  }
                }, function() {
                  return bar.find(function(data) {
                    data = data[0];
                    expect(data.a).toEqual(1);
                    return bar.update({
                      $set: {
                        b: 2,
                        "b.c": 1
                      }
                    }, {
                      where: {
                        a: 1
                      }
                    }, function() {
                      return bar.find(function(data) {
                        data = data[0];
                        expect(data.b).not.toBeDefined();
                        return bar.update({
                          $set: {
                            b: 2,
                            "d.c": 3
                          }
                        }, {
                          where: {
                            a: 1
                          },
                          upsert: true
                        }, function() {
                          return bar.findOne(function(data) {
                            console.log(data);
                            expect(data.b).toEqual(2);
                            return bar.drop(function() {
                              return bar.insert([
                                {
                                  a: 1,
                                  b: 2
                                }, {
                                  a: 1,
                                  b: 3
                                }, {
                                  a: 1,
                                  b: 4
                                }
                              ], function() {
                                return bar.update({
                                  $set: {
                                    b: 5
                                  }
                                }, {
                                  where: {
                                    a: 1
                                  },
                                  multi: false
                                }, function() {
                                  return bar.find(function(data) {
                                    var d, index, _i, _len, _results;
                                    _results = [];
                                    for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
                                      d = data[index];
                                      if (index > 0) {
                                        _results.push(expect(d.b).not.toEqual(5));
                                      }
                                    }
                                    return _results;
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    it("UpdatePromise", function() {
      bar = db.collection("UpdatePromise");
      return bar.insert([
        {
          a: 1,
          b: 2
        }, {
          a: 1,
          b: 3
        }, {
          a: 2,
          b: 4
        }
      ]).then(function(val) {
        bar = db.collection("UpdatePromise");
        return bar.update({
          $set: {
            a: 3
          },
          $inc: {
            b: 2
          }
        });
      }).then(function(val) {
        bar = db.collection("UpdatePromise");
        return bar.findOne();
      }).then(function(data) {
        return expect(data.a).toEqual(3);
      });
    });
    it("Remove", function() {
      bar = db.collection("remove");
      return bar.insert([
        {
          a: 1,
          b: 2
        }, {
          a: 1,
          b: 3
        }, {
          a: 2,
          b: 4
        }
      ], function() {
        return bar.remove(function() {
          return bar.find(function(data) {
            expect(data).toEqual([]);
            return bar.drop(function() {
              return bar.insert([
                {
                  a: 1,
                  b: 2
                }, {
                  a: 1,
                  b: 3
                }, {
                  a: 2,
                  b: 4
                }
              ], function() {
                return bar.remove({
                  where: {
                    a: 1
                  },
                  multi: false
                }, function() {
                  bar.find({
                    where: {
                      a: 1
                    }
                  }, function(data) {
                    return expect(data.length).toEqual(1);
                  });
                  return bar.drop(function() {
                    return bar.insert([
                      {
                        a: 1,
                        b: 2
                      }, {
                        a: 1,
                        b: 3
                      }, {
                        a: 2,
                        b: 4
                      }, {
                        a: 3,
                        b: 4
                      }
                    ], function() {
                      return bar.remove({
                        where: {
                          a: 1
                        }
                      }, function() {
                        bar.find({
                          where: {
                            a: 1
                          }
                        }, function(data) {
                          return expect(data.length).toEqual(0);
                        });
                        return bar.find(function(data) {
                          return expect(data.length).toEqual(2);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    it("RemovePromise", function() {
      bar = db.collection("RemovePromise");
      return bar.insert([
        {
          a: 1,
          b: 2
        }, {
          a: 1,
          b: 3
        }, {
          a: 2,
          b: 4
        }
      ]).then(function(val) {
        bar = db.collection("RemovePromise");
        return bar.remove();
      }).then(function(val) {
        bar = db.collection("RemovePromise");
        return bar.find();
      }).then(function(data) {
        return expect(data).toEqual([]);
      });
    });
    it("FindOne", function() {
      bar = db.collection('findone');
      return bar.insert([
        {
          a: 1,
          b: 2,
          c: {
            d: 3,
            e: 4
          },
          f: function(x) {
            return x * x;
          },
          g: [1, 2, 3, 4],
          h: "abc",
          price: 10.99,
          max1: 100,
          max2: 200,
          min1: 50,
          min2: 30
        }, {
          a: 1,
          b: 2,
          c: {
            d: 3,
            e: 4
          },
          f: function(x) {
            return x * x;
          },
          g: [1, 2, 3, 4],
          h: "abc",
          price: 10.99,
          max1: 100,
          max2: 200,
          min1: 50,
          min2: 30
        }
      ], function() {
        bar.findOne({
          where: {
            a: 1
          }
        }, function(data) {
          console.log("findOne: ", data);
          return expect(data.a).toEqual(1);
        });
        return bar.findOne({
          where: {
            no_val: 11111
          }
        }, function(data) {
          return expect(data).not.toBeDefined();
        });
      });
    });
    it("FindOnePromise", function() {
      var promise = new Promise(function(resolve, reject){ 
      		resolve(1);
      }).then(function(val){ 
      return new Promise(function(resolve, reject){ 
      		resolve(2);
      	});
      return val;
      }).then(function(val){ 
      	console.log('1111111111111111111111111111'+val);
      },function(err){ 
      	console.log('2222222222222222222'+err);
      });
    });
    return it("Projection", function() {
      bar = db.collection('projection');
      bar.insert([
        {
          a: 1,
          b: 2,
          c: {
            d: 3,
            e: 4
          },
          f: function(x) {
            return x * x;
          },
          g: [1, 2, 3, 4],
          h: "abc",
          price: 10.99,
          max1: 100,
          max2: 200,
          min1: 50,
          min2: 30
        }, {
          a: 1,
          b: 2,
          c: {
            d: 3,
            e: 4
          },
          f: function(x) {
            return x * x;
          },
          g: [1, 2, 3, 4],
          h: "abc",
          price: 10.99,
          max1: 100,
          max2: 200,
          min1: 50,
          min2: 30
        }
      ], function() {
        bar.findOne({
          where: {
            a: 1
          },
          projection: {
            a: 1,
            _id: -1
          }
        }, function(data) {
          return expect(data).toEqual({
            a: 1
          });
        });
        bar.find({
          where: {
            a: 1
          },
          projection: {
            "g.$": 1
          }
        }, function(data) {
          var d, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            d = data[_i];
            _results.push(expect(d.g).toEqual([1]));
          }
          return _results;
        });
        bar.find({
          where: {
            b: 1
          },
          projection: {
            "g.$": 1
          }
        }, function(data) {
          return expect(data).toEqual([]);
        });
        return bar.find({
          where: {
            a: 1
          },
          projection: {
            "a.$": 1
          }
        }, function(data) {
          return expect(data).toEqual([]);
        });
      });
      return bar.insert([
        {
          _id: 1,
          zipcode: "63109",
          students: [
            {
              name: "john",
              school: 102,
              age: 10
            }, {
              name: "jess",
              school: 102,
              age: 11
            }, {
              name: "jeff",
              school: 108,
              age: 15
            }
          ]
        }, {
          _id: 2,
          zipcode: "63110",
          students: [
            {
              name: "ajax",
              school: 100,
              age: 7
            }, {
              name: "achilles",
              school: 100,
              age: 8
            }
          ]
        }, {
          _id: 3,
          zipcode: "63109",
          students: [
            {
              name: "ajax",
              school: 100,
              age: 7
            }, {
              name: "achilles",
              school: 100,
              age: 8
            }
          ]
        }, {
          _id: 4,
          zipcode: "63109",
          students: [
            {
              name: "barney",
              school: 102,
              age: 7
            }, {
              name: "ruth",
              school: 102,
              age: 16
            }
          ]
        }
      ], function() {
        bar.find({
          where: {
            zipcode: "63109"
          },
          projection: {
            _id: 1,
            students: {
              $elemMatch: {
                school: 102
              }
            }
          }
        }, function(data) {
          return console.log(data);
        });
        return bar.find({
          where: {
            zipcode: "63109"
          },
          projection: {
            _id: 1,
            unexist: {
              $elemMatch: {
                school: 102
              }
            }
          }
        }, function(data) {
          return console.log(data);
        });
      });
    });
  });
});