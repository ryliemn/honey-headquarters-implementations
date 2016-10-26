window.honey = window.honey ? window.honey : {};

/* Defines funtions that handle backend logic that handle data, nothing to do with DOM */
window.honey.logic = window.honey.logic || (function() {
  function getUniqueValuesForField(field, citizens) {
    var values = ['All'];
    citizens.forEach(function(c) {
      var v = c[field];
      if (values.indexOf(v) === -1) {
        values.push(v);
      }
    });
    return values;
  }

  function filter(params, citizens) {
    return citizens.filter(function(citizen) {
      var matchesFilter = true;

      for (var i = 0; i < params.length && matchesFilter; i++) {
        var param = params[i];

        var field = param['field'];
        var citizenValue = citizen[field];
        var paramValue = param['value'];

        matchesFilter = paramValue === 'All' || citizenValue.toUpperCase().indexOf(paramValue.toUpperCase()) !== -1;
      }
      return matchesFilter;
    });
  }

  return {
    getUniqueValuesForField: getUniqueValuesForField,
    filter: filter
  };
})();