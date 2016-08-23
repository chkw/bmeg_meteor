import {
    Session
}
from 'meteor/session';

clinicalVarNameSelectWidget = (typeof clinicalVarNameSelectWidget ===
    "undefined") ? {} : clinicalVarNameSelectWidget;
(function(cvnsw) {
    "use strict";

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
            data: options.data

            // let our custom formatter work
            // suggestion object has fields: "id" and "text"
            // templateResult: formatSuggestions,
            // templateSelection: formatSuggestionSelection
        });

        jqSelection.on("change", function(e) {
            if (typeof options.changeEventCallback !==
                "undefined") {
                var value = jqSelection.val();
                options.changeEventCallback(value);
            }
        });

        return jqSelection;
    };

})(clinicalVarNameSelectWidget);

var setupClinicalVarSelector = function(clinicalVarNames) {
    var options = {
        placeholder: "list of clinical variable names",
        data: clinicalVarNames,
        // TODO: use correct url here
        // url: Meteor.absoluteUrl() + "genes",
        // http://localhost:3000/genes?q=MDM
        // response looks like this: {"items":[{"id":"MDM1","text":"MDM1"},{"id":"MDM2","text":"MDM2"},{"id":"MDM4","text":"MDM4"}]}
        // url: "https://api.github.com/search/repositories",
        minimumInputLength: 0,
        multiple: true,
        changeEventCallback: function(value) {
            var sessionVar = "clinicalVarNames";
            var sessionClinicalVarNames = Session.get(sessionVar);
            sessionClinicalVarNames = (_.isUndefined(sessionClinicalVarNames)) ? [] :
                sessionClinicalVarNames;

            var changes = {
                added: [],
                deleted: []
            };

            changes.added = _.difference(value, sessionClinicalVarNames);
            changes.deleted = _.difference(sessionClinicalVarNames, value);

            Session.set(sessionVar, value);
        },
    };

    jqSelectWidget = clinicalVarNameSelectWidget.setupWidget("#select2ClinicalVarNames",
        options);

    return jqSelectWidget;
};

var bakePies = function(piePanDivElem, pieData) {
    pie_charts(piePanDivElem, {
        'bmeg': pieData
    });
};

var startThrobber = function(start) {
    if (start) {
        document.getElementById("throbberImg")
            .style.display = "inline";
        document.getElementById("submitButtonClinicalVarNames").disabled = true;
    } else {
        document.getElementById("throbberImg")
            .style.display = "none";
        document.getElementById("submitButtonClinicalVarNames").disabled = false;
    }
};

Template.clinicalPieTemplate.events({
    'click button#submitButtonClinicalVarNames': function(event,
        instance) {
        console.log("event",
            "click button#submitButtonClinicalVarNames");

        var divElem = document.getElementById("clinicalPiesDiv");

        startThrobber(true);

        // callback for getting data
        var buildPies = function(error, result) {
            console.log("result", result);

            if (result.success) {
                console.log(
                    "got some data. let's build some pies!"
                );
                var data = JSON.parse(result.data.content);
                console.log("data", data);
                bakePies(divElem, data);

            } else { // remove child elements of divElem
                while (divElem.firstChild) {
                    divElem.removeChild(divElem.firstChild);
                }
                divElem.innerHTML = 'no data';
                alert("request failed!");
            }

            startThrobber(false);
        };

        // get data via the Meteor.method
        var clinicalVarNames = Session.get("clinicalVarNames");
        // Meteor.call("post_get_event_data", [], [], clinicalVarNames, buildPies);

        Meteor.call("post_clinical_data", clinicalVarNames, buildPies);
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
        .style.display = "inline";

    // Meteor.call("test_clinical_var_names", function(error, result) {
    Meteor.call("post_clinical_var_names", function(error, result) {
        console.log("result", result);

        if (result.success) {
            console.log("got some data. let's populate select2 widget!");
            var data = JSON.parse(result.data.content);
            console.log("clinical var names", data.length);
            var sortedData = _.sortBy(data, function(name) {
                return name.toLowerCase();
            });
            var clinicalVarNameSelectWidget = setupClinicalVarSelector(sortedData);

            // var initialSelection = ["sample", "tumor_type"];
            var initialSelection = ["submittedTumorSite"];
            clinicalVarNameSelectWidget.val(initialSelection).trigger("change");

            document.getElementById("throbberImg")
                .style.display = "none";
        } else {
            console.log("post_clinical_var_names failed");
        }
    });
});
