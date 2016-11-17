define(
  'ephox.snooker.util.LayerSelector',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Selectors',
    'ephox.sugar.api.Traverse'
  ],

  function (Arr, Fun, Selectors, Traverse) {
    var firstLayer = function (scope, selector) {
      return filterFirstLayer(scope, selector, Fun.constant(true));
    };

    var filterFirstLayer = function (scope, selector, predicate) {
      return Arr.bind(Traverse.children(scope), function (x) {
        if (Selectors.is(x, selector)) {
          return predicate(x) ? [ x ] : [ ];
        } else {
          return filterFirstLayer(x, selector, predicate);
        }
      });
    };

    return {
      firstLayer: firstLayer,
      filterFirstLayer: filterFirstLayer
    };
  }
);