import {
  Session
}
from 'meteor/session';

clinicalVarNameSelectWidget = (typeof clinicalVarNameSelectWidget ===
  "undefined") ? {} : clinicalVarNameSelectWidget;
(function(cvnsw) {
  "use strict";

  /**
   * Construct markup for displaying suggestion results.
   * @param {Object} suggestion
   */
  var formatSuggestions = function(suggestion) {
    var markup = [];

    markup.push("<div>");
    // markup.push("id:" + suggestion.id);
    // markup.push("<br>");
    // markup.push("text:" + suggestion.text);
    markup.push(suggestion.id);
    markup.push("</div>");

    return markup.join("");
  };

  /**
   * ID the selected suggestion.
   * @param {Object} suggestion
   */
  var formatSuggestionSelection = function(suggestion) {
    return suggestion.id || suggestion.text;
  };

  /**
   * Setup the select tag as a select2 widget.
   * @param {Object} cssSelector
   * @param {Object} options
   */
  cvnsw.setupWidget = function(cssSelector, options) {
    var jqSelection = $(cssSelector);
    if ("multiple" in options) {
      jqSelection.attr({
        multiple: options.multiple
      });
    }
    jqSelection.select2({
      placeholder: options.placeholder,
      minimumInputLength: options.minimumInputLength,
      ajax: {
        url: options.url,
        dataType: 'json',
        delay: 250,
        data: function(params) {
          var term = params.term;
          return {
            q: term.toUpperCase(), // search term
            page: params.page
          };
        },
        processResults: function(data, params) {
          // parse the results into the format expected by Select2
          // since we are using custom formatting functions we do not need to
          // alter the remote JSON data, except to indicate that infinite
          // scrolling can be used
          params.page = params.page || 1;

          // TODO: test data
          data = {
            "items": [{
              "id": "MDM1",
              "text": "MDM1"
            }, {
              "id": "MDM2",
              "text": "MDM2"
            }, {
              "id": "MDM4",
              "text": "MDM4"
            }]
          };

          return {
            results: data.items,
            pagination: {
              more: (params.page * 20) < data.total_count
            }
          };
        },
        cache: true
      },
      escapeMarkup: function(markup) {
        return markup;
      },

      // let our custom formatter work
      // suggestion object has fields: "id" and "text"
      templateResult: formatSuggestions,
      templateSelection: formatSuggestionSelection
    });

    jqSelection.on("change", function(e) {
      if (typeof options.changeEventCallback !== "undefined") {
        var value = jqSelection.val();
        options.changeEventCallback(value);
      }
    });

  };

})(clinicalVarNameSelectWidget);

var setupClinicalVarSelector = function() {
  var options = {
    placeholder: "list of genes",
    // TODO: use correct url here
    // url: Meteor.absoluteUrl() + "genes",
    // http://localhost:3000/genes?q=MDM
    // response looks like this: {"items":[{"id":"MDM1","text":"MDM1"},{"id":"MDM2","text":"MDM2"},{"id":"MDM4","text":"MDM4"}]}
    url: "https://api.github.com/search/repositories",
    minimumInputLength: 2,
    multiple: true,
    changeEventCallback: function(value) {
      var sessionVar = "clinicalVarNames";
      var sessionGeneList = Session.get(sessionVar);
      sessionGeneList = (_.isUndefined(sessionGeneList)) ? [] :
        sessionGeneList;

      var changes = {
        added: [],
        deleted: []
      };

      changes.added = _.difference(value, sessionGeneList);
      changes.deleted = _.difference(sessionGeneList, value);

      Session.set(sessionVar, value);
    }
  };

  clinicalVarNameSelectWidget.setupWidget("#select2ClinicalVarNames", options);
};

Template.clinicalPieTemplate.events({
  'click button#submitButtonClinicalVarNames': function(event, instance) {
    console.log("event", "click button#submitButtonClinicalVarNames");

    var divElem = document.getElementById("clinicalPiesDiv");

    // start throbber
    document.getElementById("throbberImg")
      .style.display = "inline";

    // callback for getting data
    var buildPies = function(error, result) {
      console.log("result", result);

      if (result.success) {
        console.log("got some data. let's build some pies!");
        var data = result.data.data;

      } else { // remove child elements of divElem
        while (divElem.firstChild) {
          divElem.removeChild(divElem.firstChild);
        }
        divElem.innerHTML = 'no data';
        alert("request failed!");
      }

      // stop throbber
      document.getElementById("throbberImg")
        .style.display = "none";
    };

    // get data via the Meteor.method
    // Meteor.call("get_hard_coded_data", selectedSigs, buildObsDeckWithData);
    Meteor.call("post_get_event_data", [], [], [
      "submittedTumorSite"
    ], buildPies);
  }
});

Template.clinicalPieTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.clinicalPieTemplate.onCreated(function() {});

Template.clinicalPieTemplate.onRendered(function() {
  console.log("Template.clinicalPieTemplate.rendered");

  document.getElementById("throbberImg")
    .style.display = "none";

  setupClinicalVarSelector();
});
