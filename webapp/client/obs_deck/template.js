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
            var data = result["data"]["data"];

            // TODO parse the result for the event data by type
            // var eventsGroupedByType = {};
            // var eventDataList = data;
            // _.each(eventDataList, function(eventData) {
            // var metadata = eventData["metadata"];
            // var sampleData = eventData["sampleData"];
            //
            // var datatype = metadata["eventType"];
            // if (! _.contains(_.keys(eventsGroupedByType))) {
            // eventsGroupedByType[datatype] = [];
            // }
            //
            // eventsGroupedByType[datatype].push(eventData);
            //
            // });
            //
            // console.log("eventsGroupedByType", eventsGroupedByType);

            var od_config = {
                bmeg : data,
                "rowTitleCallback" : function(eventId, config) {
                    var eventObj = config['eventAlbum'].getEvent(eventId);
                    var datatype = eventObj.metadata['datatype'];
                    datatype = datatype.toLowerCase();
                    console.log(eventId, datatype);
                    if (datatype === 'expression data') {
                        // mRNA url:
                        var gene = eventId.replace('_mRNA', '');
                        var url = "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + gene;
                        window.open(url, "_od_out");
                    }
                },
                "columnTitleCallback" : function(sampleId, config) {
                    console.log("clicked cell for", sampleId);
                }
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

    var sessionGeneList = Session.get("geneList");
    console.log("sessionGeneList", sessionGeneList);

    // update query info
    var innerHTML = "signatures: " + selectedSigs;
    innerHTML = innerHTML + "<br>";
    innerHTML = innerHTML + "genes: " + sessionGeneList;

    document.getElementById("queryP").innerHTML = innerHTML;

    // get data via the Meteor.method
    // Meteor.call("get_hard_coded_data", selectedSigs, buildObsDeckWithData);
    Meteor.call("post_obs_deck_data_for_sigList", selectedSigs, sessionGeneList, ["submittedTumorSite"], buildObsDeckWithData);

});
