import { Session
}from'meteor/session';

Template.testTemplate.events({
    'click button#go_test' : function(event, instance) {

        var geneSetTextBoxElem = document.getElementById("testTextBox");
        var geneSetString = geneSetTextBoxElem.value;

        if (geneSetString === "") {
            window.alert("Please type in some genes symbols.");
            return;
        }

        var geneSet = new Set();
        var splitRegExp = new RegExp(/\b/);
        _.each(geneSetString.split(splitRegExp), function(string) {
            var geneString = string.trim();
            if (geneString !== "" && geneString != ",") {
                geneSet.add(geneString);
            }
        });

        var geneList = Array.from(geneSet);

        Meteor.call("test_post", {
            testList : geneList
        }, function(error, result) {
            console.log("test_post result", result);

            var divElem = document.getElementById("testTemplateDiv");
            var pElem = document.createElement("p");
            pElem.innerHTML = result.response.content;
            divElem.appendChild(pElem);
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

