// $.ajax('https://sheetsu.com/apis/v1.0/64b5c3f8').done(function(data) {
$.ajax('http://localhost:3000/citizens').done(function(citizens) {
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

  var characters = getUniqueValuesForField('character', citizens);
  var hometowns = getUniqueValuesForField('hometown', citizens);
  var sizes = getUniqueValuesForField('size', citizens);

  populateSelectWithOptions("#character-select", characters);
  populateSelectWithOptions("#hometown-select", hometowns);
  populateSelectWithOptions("#size-select", sizes);
});