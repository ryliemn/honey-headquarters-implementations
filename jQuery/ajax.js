function ajax(citizens) {
  var characters = getUniqueValuesForField('character', citizens);
  var hometowns = getUniqueValuesForField('hometown', citizens);
  var sizes = getUniqueValuesForField('size', citizens);

  populateSelectWithOptions("#character-select", characters);
  populateSelectWithOptions("#hometown-select", hometowns);
  populateSelectWithOptions("#size-select", sizes);

  var selectHandler = function(event) {
    var params = gatherParams();
    var filteredCitizens = filter(params, event.data.citizens);
    redrawContent(filteredCitizens);
  };

  $('#character-select').on('change', { citizens: citizens }, selectHandler);
  $('#hometown-select').on('change', { citizens: citizens }, selectHandler);
  $('#size-select').on('change', { citizens: citizens }, selectHandler);

  selectHandler({data: { citizens: citizens }});
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
    $(select).append($('<option>', { value: option, html: option }));
  });
}

function gatherParams() {
  var params = [];

  var characterValue = $('#character-select').val();
  params.push({field: 'character', value: characterValue});

  var hometownValue = $('#hometown-select').val();
  params.push({field: 'hometown', value: hometownValue});

  var sizeValue = $('#size-select').val();
  params.push({field: 'size', value: sizeValue});

  return params;
}

function filter(params, citizens) {
  var filteredCitizens = citizens.filter(function(citizen) {
    var matchesFilter = true;

    for (var i = 0; i < params.length && matchesFilter; i++) {
      var param = params[i];

      var field = param['field'];
      var citizenValue = citizen[field];
      var paramValue = param['value'];

      matchesFilter = paramValue === 'All' || citizenValue === paramValue;
    }

    return matchesFilter;
  });

  return filteredCitizens;
}

function redrawContent(citizens) {
  var content = $('.content');
  content.empty();

  citizens.forEach(function(citizen) {
    content.append($('<div>', { class: "citizen", html: citizen.name }));
  });
}