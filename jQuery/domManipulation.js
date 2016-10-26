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