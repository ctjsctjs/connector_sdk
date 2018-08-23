//Global var
var adapterCount = 0;
var hiddenCount = 0;
var json;
var filterList = {};

//On Init
$(document).ready(function () {
  loadJSON();
  generateAdapters();
  filterHandler();
  $('.filter-input').trigger('change');
});

//Handle filter navigation clicks
function filterHandler() {
  $("body").on("change", ".filter-input", function () {

    //Get filter and value selected
    var filter = ($(this).closest("ul").siblings("h5").html());
    var val = $(this).val();

    if ($(this).is(':checked')) {
      (filterList[filter] = val);
    }

    //Toggle hidden according to filter match
    $('.app').each(function () {

      var name = $(this).find(".item-name").html();
      var properties = json[name].properties;
      var state = false;

      if (_.isEqual(filterList, properties) == false) {
        $(this).addClass("filter-hidden");
      } else {
        $(this).removeClass("filter-hidden");
      }
    })
    checkAllHidden();
  });
}


//Load JSON
function loadJSON() {
  $.ajax({
    'async': false,
    'global': false,
    'url': 'json/adapters.json',
    'dataType': "json",
    'success': function (data) {
      json = data;
    }
  });
}

//Search Function
function filterFunc(event) {
  var userInput = event.value.toUpperCase();
  $('.app').each(function () {
    if (this.textContent.toUpperCase().indexOf(userInput) > -1) {
      $(this).removeClass("search-hidden");
    } else {
      $(this).addClass("search-hidden");
    }
  });
  checkAllHidden();
}

//Function to check if all apps are hidden, show no results message
function checkAllHidden() {
  //Show no result message if all adapters are hidden
  var valid = true;
  $('.app').each(function () {
    if ($(this).attr("class") === "app") {
      valid = false;
    }

    if (valid == false) {
      $('#no-result').hide();
      $(".splitter").show();

    } else {
      $('#no-result').show();
      $(".splitter").hide();
    }
  })
}

//Load JSON file to generate app listing
function generateAdapters() {

  generateCount = 0;
  var filters = {};
  var listCol = 5;
  var ul = $('#container-apps');

  //Generate app list from adapters.JSON
  Object.keys(json).forEach(function (key) {

    //Count adapter for no result function
    adapterCount += 1;

    var link = json[key].link;
    var git = json[key].git;
    var img = json[key].image;
    var name = json[key].name;
    var properties = json[key].properties;

    //Load filter options
    $.each(properties, function (i, item) {
      if (!(i in filters)) {
        filters[i] = [];
      }
      if (!(filters[i].includes(item))) {
        filters[i].push(item);
      }
    })

    var li = $("<li>").attr({ "class": "app" }).appendTo(ul);
    var a = $("<a>").attr({
      "href": "javascript:void(0);",
      "target": "_blank",
      "class": "app-link",
    }).appendTo(li);

    var image = $("<img>").attr("src", img).appendTo(a);
    var label = $("<div>").attr("class", "item-name black-font").html(name).appendTo(a);
    var hoverContainer = $("<div>").attr("class", "hoverContainer").appendTo(li);
    var hoverUL = $("<ul>").appendTo(hoverContainer);
    var hoverName = $("<span>").attr("class", "hover-name").html(name).appendTo(hoverUL);
    var hoverPageLi = $("<li>").attr("class", name).appendTo(hoverUL);
    var hoverPageA = $("<a>").attr({ "href": link, "target": "_blank", "class": "app-link" }).html("Install Connector").appendTo(hoverPageLi);
    var hoverGitLi = $("<li>").appendTo(hoverUL);
    var hoverGitA = $("<a>").attr({ "href": git, "target": "_blank", "class": "app-link" }).html("View Source Code").appendTo(hoverGitLi);
  });

  //Generate dummy box for responsive
  for (var i = 0; i < (listCol); i++) {
    $('<li class="item flex-dummy"></li>').appendTo(ul);
  }
  generateFilters(filters);
}

function generateFilters(filters) {
  var container = $("#container-filter");
  $.each(filters, function (i, item) {
    var isFirstInput = true;
    var div = $("<div>").attr("class", "filter-section").appendTo(container);
    var title = $("<h5>").html(i).appendTo(div);
    var ul = $("<ul>").appendTo(div);

    $.each(item, function (k, value) {
      var li = $("<li>").appendTo(ul);

      if (isFirstInput == true) {

        filterList[i] = value;

        var radioButtons = $("<input>").attr({
          "class": "filter-input",
          "type": "radio",
          "value": value,
          "name": i,
          "checked": true
        }).appendTo(li);
        isFirstInput = false;
      } else {
        var radioButtons = $("<input>").attr({
          "class": "filter-input",
          "type": "radio",
          "value": value,
          "name": i
        }).appendTo(li);
      }
      var label = $("<span>").html(value).appendTo(li);
    });
    isFirstInput = true;
  })
}

//Function to toggle visibility of navigation dropdown for mobile nav
function toggleSideNav() {
  if ($('.nav-links-li').is(':hidden')) {
    $('.nav-links-li').removeClass('hide');
    $('.nav-links-li').addClass('show');
  } else {
    $('.nav-links-li').removeClass('show');
    $('.nav-links-li').addClass('hide');
  }
}

//Function to toggle hover container
function toggleHover(item) {
  $(item).children(".hoverContainer").toggleClass("hoverContainer-show");
}
