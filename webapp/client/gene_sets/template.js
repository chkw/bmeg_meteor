import { Session
}from'meteor/session';

var validateInput = function(inputString) {
    inputString = inputString.trim();

    if (_.isUndefined(inputString) || _.isNull(inputString)) {
        return false;
    }

    if (inputString === "") {
        return false;
    }

    return true;
};

Template.geneSetsTemplate.events({
    'click button#submit_gene_set' : function(event, instance) {

        var geneSetTextBoxElem = document.getElementById("geneSetTextBox");
        var geneSetString = geneSetTextBoxElem.value;

        if (! validateInput(geneSetString)) {
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

        Session.set("geneList", geneList);

        // clear the value so if same sig gets presented, it is not pre-selected
        Session.set("selectedSigs", undefined);

        // delete the key
        delete Session.keys["selectedSigs"];

        if (Session.get("use_case") == 2) {
            console.log("use_case 2");
            FlowRouter.go("sig_select");
        } else {
            console.log("use_case 1");
            FlowRouter.go("sig_select");
        }
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

    var useCase = Session.get("use_case");

    var descPElem = document.getElementById("description");

    if (useCase == 2) {
        descPElem.innerHTML = "Please type in a query set of genes. We'll look in the BMEG database see if presence of variant call in the submitted genes is linked to predicted drug sensitivity.";
    } else {
        descPElem.innerHTML = "Please type in a query set of genes. We'll look in the BMEG database for drug sensitivity models that have heavy weights for the submitted genes.";
    }

    // fill-in value from Session
    var geneList = Session.get("geneList");
    if (!_.isNull(geneList)) {
        var value = "";
        _.each(geneList, function(gene) {
            value = value + gene + " ";
        });
        document.getElementById("geneSetTextBox").value = value;
    }

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

