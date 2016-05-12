import { Session
}from'meteor/session';

Template.obsDeckTemplate.events({});

Template.obsDeckTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.obsDeckTemplate.onCreated(function() {
});

Template.obsDeckTemplate.onRendered(function() {
    console.log("Template.obsDeckTemplate.rendered");

    var divElem = document.getElementById("obsDeckDiv");

    // start throbber
    document.getElementById("throbberImg").style.display = "inline";

    // callback for getting data
    var buildObsDeckWithData = function(error, result) {
        console.log("result", result);

        if (result.success) {
            console.log("got some data. let's build an obs-deck!");
            var data = result["data"];

            var od_config = {
                mongoData : data
            };

            observation_deck.buildObservationDeck(divElem, od_config);

        } else {// remove child elements of divElem
            while (divElem.firstChild) {
                divElem.removeChild(divElem.firstChild);
            }
            divElem.innerHTML = 'no data';
            alert("request failed!");
        }

        // stop throbber
        document.getElementById("throbberImg").style.display = "none";
    };

    var selectedSigs = Session.get("selectedSigs");
    console.log("selectedSigs", selectedSigs);

    // update query info
    document.getElementById("queryP").innerHTML = "getting Observation Deck data for these signatures: " + selectedSigs;

    // get data via the Meteor.method
    Meteor.call("get_hard_coded_data", selectedSigs, buildObsDeckWithData);
    // Meteor.call("post_obs_deck_data_for_sigList", selectedSigs, buildObsDeckWithData);

});
