import {
  Session
}
from 'meteor/session';

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

});
