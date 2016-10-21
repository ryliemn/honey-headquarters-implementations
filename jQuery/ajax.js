window.honey = {};

window.honey.selectors = {
  menu: '.menu',
  content: '.content',
  paginator: '.paginator',
  pageSelect: '#page-select',
  firstPageButton: '#first-page-button',
  previousPageButton: '#previous-page-button',
  nextPageButton: '#next-page-button',
  lastPageButton: '#last-page-button',
  nameInput: '#name-input',
  characterSelect: '#character-select',
  hometownSelect: '#hometown-select',
  sizeSelect: '#size-select'
};

/* Defines functions that interact directly with the DOM */
window.honey.domManipulation = window.honey.domManipulation || (function($, selectors) {
  function populateSelectWithOptions(select, options) {
    options.forEach(function(option) {
      $(select).append($('<option>', { value: option, html: option }));
    });
  }

  function gatherParams(form) {
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

  function redrawContent(content, citizens) {
    content.empty();

    citizens.forEach(function(citizen) {
      content.append($('<div>', { class: "citizen", html: citizen.name }));
    });
  }

  function redrawPageSelect(pageSelect, noOfPages) {
    pageSelect.empty();

    var currentPage = 1;

    while (currentPage <= noOfPages) {
      pageSelect.append($('<option>', { value: currentPage, html: currentPage }));
      currentPage++;
    }
  }

  return {
    gatherParams: gatherParams,
    populateSelectWithOptions: populateSelectWithOptions,
    redrawContent: redrawContent,
    redrawPageSelect: redrawPageSelect
  };
})(jQuery, window.honey.selectors);

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

  /* Calls to filter should normalize page# to 0 indexing before calling */
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

window.honey.ajax = window.honey.ajax || (function($, selectors, logic, dom) {
  function afterCitizenRetrieval(citizens) {
    var characters = logic.getUniqueValuesForField('character', citizens);
    var hometowns = logic.getUniqueValuesForField('hometown', citizens);
    var sizes = logic.getUniqueValuesForField('size', citizens);

    dom.populateSelectWithOptions(selectors.characterSelect, characters);
    dom.populateSelectWithOptions(selectors.hometownSelect, hometowns);
    dom.populateSelectWithOptions(selectors.sizeSelect, sizes);

    $(selectors.characterSelect + "," + selectors.hometownSelect + "," + selectors.sizeSelect)
        .on('change', { citizens: citizens, page: 1 }, formHandler);
    $(selectors.nameInput)
        .on('input', { citizens: citizens, page: 1 }, formHandler);

    $(selectors.pageSelect)
        .on('change', { citizens: citizens }, pageHandler);

    $(selectors.firstPageButton + "," + selectors.previousPageButton + "," + selectors.nextPageButton + "," + selectors.lastPageButton)
        .on('click', { citizens: citizens }, pageButtonHandler);
    

    formHandler({data: { citizens: citizens, page: 1 }});

    function formHandler(event) {
      var page = event.data.page;

      var params = dom.gatherParams($(selectors.menu));
      var filteredCitizens = logic.filter(params, event.data.citizens);
      var pagedCitizens = filteredCitizens.slice((page - 1) * 10, (page - 1) * 10 + 10)
      dom.redrawContent($(selectors.content), pagedCitizens);
      if (page === 1) {
        dom.redrawPageSelect($(selectors.pageSelect), Math.ceil(filteredCitizens.length / 10));
      }
    };

    function pageHandler(event) {
      var page = $(this).val();
      formHandler({data: { citizens: event.data.citizens, page: page }});
    }

    function pageButtonHandler(event) {
      var pageSelect = $(selectors.pageSelect);

      var currentPage = Number(pageSelect.val());
      var maxPage = pageSelect.children().length;
      var buttonPressed = event.target.id;
      switch ('#' + buttonPressed) {
        case selectors.firstPageButton:
          var newPage = 1;
          break;
        case selectors.previousPageButton:
          var newPage = currentPage === 1 ? 1 : currentPage - 1;
          break;
        case selectors.nextPageButton:
          var newPage = currentPage === maxPage ? maxPage : currentPage + 1;
          break;
        case selectors.lastPageButton:
          var newPage = maxPage;
      }
      pageSelect.val(newPage);
      formHandler({data: { citizens: event.data.citizens, page: newPage }});
    }
  }

  return {
    afterCitizenRetrieval: afterCitizenRetrieval
  };
})(jQuery, window.honey.selectors, window.honey.logic, window.honey.domManipulation);