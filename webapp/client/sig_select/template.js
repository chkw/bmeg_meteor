import { Session
}from'meteor/session';

Template.sigSelectTemplate.events({
    'click button#go_obs_deck' : function(event, instance) {

        var selectedSigs = [];
        var checkBoxElems = document.querySelectorAll("div input[name=signatures]:checked");
        _.each(checkBoxElems, function(checkBoxElem) {
            var value = checkBoxElem.value;
            selectedSigs.push(value);
        });

        Session.set("selectedSigs", selectedSigs);

        FlowRouter.go("obs_deck");
    }
});

Template.sigSelectTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.sigSelectTemplate.onCreated(function() {
    console.log("Template.sigSelectTemplate.onCreated");
});

Template.sigSelectTemplate.onRendered(function() {
    console.log("Template.sigSelectTemplate.onRendered");

    // start throbber
    document.getElementById("throbberImg").style.display = "inline";

    var geneList = Session.get("geneList");
    console.log("geneList", geneList);

    // update query info
    document.getElementById("queryP").innerHTML = "getting signatures that are highly weighted in these genes: " + geneList;

    var show_signature_results = function(error, result) {
        console.log("result", result);

        if (result.success) {
            var data = result["data"];
            var query = result["query"];

            displaySignatures(data);

        } else {
            alert("request failed!");
        }
        // stop throbber
        document.getElementById("throbberImg").style.display = "none";
    };

    // get data via the Meteor.method
    Meteor.call("get_hard_coded_sigs", geneList, show_signature_results);
    // Meteor.call("post_sigs_for_genes", geneList, show_signature_results);
});

Template.sigSelectTemplate.onDestroyed(function() {
    console.log("Template.sigSelectTemplate.onDestroyed");
});

var displaySignatures = function(sigData) {
    console.log("sigData", sigData);

    var divElem = document.getElementById("sigResultsDiv");

    // remove child elements of divElem
    while (divElem.firstChild) {
        divElem.removeChild(divElem.firstChild);
    }

    //  add results to div
    _.each(sigData, function(sigObj) {
        var sigDiv = document.createElement("div");
        sigDiv.setAttribute("id", "sigDiv");
        sigDiv.setAttribute("title", sigObj.name);
        divElem.appendChild(sigDiv);

        var checkBoxElem = document.createElement("input");
        checkBoxElem.setAttribute("type", "checkbox");
        checkBoxElem.setAttribute("name", "signatures");
        checkBoxElem.setAttribute("value", sigObj.name);
        checkBoxElem.setAttribute("title", sigObj.name);
        checkBoxElem.setAttribute("checked", true);
        sigDiv.appendChild(checkBoxElem);

        sigDiv.innerHTML = sigDiv.innerHTML + sigObj.score + ": " + sigObj.name;
    });
};
