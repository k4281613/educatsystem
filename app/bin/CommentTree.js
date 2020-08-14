
function commentTree(arr, start, val) {
  var tree = [];
  for (var i = 0; i < arr.length; i++) {

    if (arr[i].parent_id == start) {

      arr[i].val = val;
      tree.push(arr[i]);
      var cat = commentTree(arr, arr[i].id, val + 1);
      if (cat.length != 0) {
        for (var j = 0; j < cat.length; j++) {
          tree.push(cat[j]);
        }

      }
    }
  }

  return tree;

}

 module.exports = commentTree;