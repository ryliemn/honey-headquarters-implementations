window.hh = {};

window.hh.selectors = {
  menu: '.menu',
  content: '.content',
  nameInput: '#name-input',
  characterSelect: '#character-select',
  hometownSelect: '#hometown-select',
  sizeSelect: '#size-select'
};

/* Defines functions that interact directly with the DOM */
window.hh.domManipulation = window.hh.domManipulation || (function() {
  function populateSelectWithOptions(select, options) {
    options.forEach(function(option) {
      $(select).append($('<option>', { value: option, html: option }));
    });
  }

  function gatherParams(form) {
    var selectors = window.hh.selectors;

    var name      = form.find(selectors.nameInput);
    var character = form.find(selectors.characterSelect);
    var hometown  = form.find(selectors.hometownSelect);
    var size      = form.find(selectors.sizeSelect);

    return [
      { field: 'name', value: name.val() },
      { field: 'character', value: character.val() },
      { field: 'hometown', value: hometown.val() },
      { field: 'size', value: size.val() }
    ];
  }

  function redrawContent(contentSelector, citizens) {
    var content = $(contentSelector);
    content.empty();

    citizens.forEach(function(citizen) {
      content.append($('<div>', { class: "citizen", html: citizen.name }));
    });
  }

  return {
    gatherParams: gatherParams,
    populateSelectWithOptions: populateSelectWithOptions,
    redrawContent: redrawContent
  };
})();

/* Defines funtions that handle backend logic that handle data, nothing to do with DOM */
window.hh.logic = window.hh.logic || (function() {
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

window.hh.ajax = window.hh.ajax || function(citizens) {
  var selectors = window.hh.selectors;
  var DOM = window.hh.domManipulation;
  var logic = window.hh.logic;

  var characters = logic.getUniqueValuesForField('character', citizens);
  var hometowns = logic.getUniqueValuesForField('hometown', citizens);
  var sizes = logic.getUniqueValuesForField('size', citizens);

  DOM.populateSelectWithOptions(selectors.characterSelect, characters);
  DOM.populateSelectWithOptions(selectors.hometownSelect, hometowns);
  DOM.populateSelectWithOptions(selectors.sizeSelect, sizes);

  $(selectors.characterSelect + "," + selectors.hometownSelect + "," + formHandler.sizeSelect)
      .on('change', { citizens: citizens }, formHandler);
  $(selectors.nameInput)
      .on('input', { citizens: citizens }, formHandler);

  formHandler({data: { citizens: citizens }});

  function formHandler(event) {
    var params = DOM.gatherParams($(selectors.menu));
    var filteredCitizens = logic.filter(params, event.data.citizens);
    DOM.redrawContent($(selectors.content), filteredCitizens);
  };
};