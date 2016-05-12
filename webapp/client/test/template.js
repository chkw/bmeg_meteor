import { Session
}from'meteor/session';

var getTextBoxValue = function(elemId) {
    var textBoxElem = document.getElementById(elemId);
    var textBoxVal = textBoxElem.value;
    return textBoxVal;
};

var getListFromString = function(inputString) {
    var stringSet = new Set();
    var splitRegExp = new RegExp(/\b/);
    _.each(inputString.split(splitRegExp), function(string) {
        var trimmedString = string.trim();
        if (trimmedString !== "" && trimmedString != ",") {
            stringSet.add(trimmedString);
        }
    });

    var stringList = Array.from(stringSet);
    return stringList;
};

var appendResponse = function(meteorCallResult) {
    var divElem = document.getElementById("testTemplateDiv");
    var pElem = document.createElement("p");
    if (!_.isUndefined(meteorCallResult.data)) {
        pElem.innerHTML = meteorCallResult.data.content;
    } else {
        pElem.innerHTML = meteorCallResult.response.content;
    }
    divElem.appendChild(pElem);
};

Template.testTemplate.events({
    'click button#go_test' : function(event, instance) {

        var geneSetString = getTextBoxValue("testTextBox");

        if (geneSetString === "") {
            window.alert("Please type in some text.");
            return;
        }

        var geneList = getListFromString(geneSetString);

        Meteor.call("test_post", {
            testList : JSON.stringify(geneList)
        }, function(error, result) {
            console.log("test_post result", result);
            appendResponse(result);
        });
    },
    'click button#go_post_sigs_for_genes' : function(event, instance) {

        var geneSetString = getTextBoxValue("testTextBox");

        if (geneSetString === "") {
            window.alert("Please type in some text.");
            return;
        }

        var geneList = getListFromString(geneSetString);

        Meteor.call("post_sigs_for_genes", geneList, function(error, result) {
            console.log("post_sigs_for_genes result", result);
            appendResponse(result);
        });
    },
    'click button#go_post_obs_deck_data_for_sigList' : function(event, instance) {

        var sigNamesString = getTextBoxValue("testTextBox");

        if (sigNamesString === "") {
            window.alert("Please type in some text.");
            return;
        }

        var sigNames = getListFromString(sigNamesString);

        Meteor.call("post_obs_deck_data_for_sigList", sigNames, function(error, result) {
            console.log("post_obs_deck_data_for_sigList result", result);
            appendResponse(result);
        });
    }
});

Template.testTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.testTemplate.onCreated(function() {
    console.log("Template.testTemplate.onCreated");
});

Template.testTemplate.onRendered(function() {
    console.log("Template.testTemplate.onRendered");

    // handle tab keydown events in textareas
    _.each(document.querySelectorAll("textarea, input[type=text]"), function(elem) {
        elem.addEventListener("keydown", function(e) {
            if (e.keyCode === 9) {// tab was pressed
                // get caret position/selection
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var target = e.target;
                var value = target.value;

                // set textarea value to: text before caret + tab + text after caret
                target.value = value.substring(0, start) + "\t" + value.substring(end);

                // put caret at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

                // prevent the focus lose
                e.preventDefault();
            }
        }, false);
    });

});

Template.testTemplate.onDestroyed(function() {
    console.log("Template.testTemplate.onDestroyed");
});

