// Generated by CoffeeScript 1.7.1
var a, i, index, _i, _len;

a = [1, 2, 3, 4];

for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
  i = a[index];
  console.log(index);
  a.remove(index);
}

console.log(a);