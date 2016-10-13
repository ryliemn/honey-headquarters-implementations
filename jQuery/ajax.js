function ajax(citizens) {
  var characters = getUniqueValuesForField('character', citizens);
  var hometowns = getUniqueValuesForField('hometown', citizens);
  var sizes = getUniqueValuesForField('size', citizens);

  populateSelectWithOptions("#character-select", characters);
  populateSelectWithOptions("#hometown-select", hometowns);
  populateSelectWithOptions("#size-select", sizes);
}

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

function populateSelectWithOptions(select, options) {
  options.forEach(function(option) {
    $(select).append($("<option>", { value: option, html: option }));
  });
}