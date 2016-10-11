// $.ajax('https://sheetsu.com/apis/v1.0/64b5c3f8').done(function(data) {
$.ajax('http://localhost:3000/citizens').done(function(citizens) {
  function getUniqueValuesForField(field, citizens) {
    const values = ['All'];
    citizens.forEach((c) => {
      let v = c[field];
      if (!values.includes(v)) {
        values.push(v);
      }
    });
    return values;
  }

  function populateSelectWithOptions(select, options) {
    options.forEach((option) => {
      $(select).append($("<option>", { value: option, html: option }));
    });
  }

  const characters = getUniqueValuesForField('character', citizens);
  const hometowns = getUniqueValuesForField('hometown', citizens);
  const sizes = getUniqueValuesForField('size', citizens);

  populateSelectWithOptions("#character-select", characters);
  populateSelectWithOptions("#hometown-select", hometowns);
  populateSelectWithOptions("#size-select", sizes);
});