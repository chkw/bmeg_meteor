import { Session
}from'meteor/session';

Template.geneSetsTemplate.events({
    'click button#go_select_sigs' : function(event, instance) {

        var geneSetTextBoxElem = document.getElementById("geneSetTextBox");
        var geneSetString = geneSetTextBoxElem.value;

        if (geneSetString === "") {
            window.alert("Please type in some genes symbols.");
            return;
        }

        var geneList = geneSetString.split("\t");

        Session.set("geneList", geneList);

        FlowRouter.go("sig_select");
    }
});

Template.geneSetsTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.geneSetsTemplate.onCreated(function() {
    console.log("Template.geneSetsTemplate.onCreated");
});

Template.geneSetsTemplate.onRendered(function() {
    console.log("Template.geneSetsTemplate.onRendered");

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

Template.geneSetsTemplate.onDestroyed(function() {
    console.log("Template.geneSetsTemplate.onDestroyed");
});

