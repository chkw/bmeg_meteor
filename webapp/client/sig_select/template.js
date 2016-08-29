import {
    Session
} from 'meteor/session';

var stringifiedWikipediaLink = function(article_title) {
    var s = "<a title='" + article_title + "' href='https://en.wikipedia.org/wiki/" + article_title + "' target='_" + article_title + "'>" + article_title + "</a>";
    return s;
};

var stringifiedGoogleLink = function(search_terms) {
    var s = "<a title='search google' href='https://www.google.com/?q=" + search_terms.join("+") + "' target='_blank'>search</a>";
    return s;
};

var validateInput = function(inputSigs) {

    if (_.isUndefined(inputSigs) || _.isNull(inputSigs)) {
        return false;
    }

    if (inputSigs.length < 1) {
        return false;
    }

    // if (inputSigs.length != 1) {
    // return false;
    // }
    return true;
};

var getSignatureDisplayName = function(origName) {
    // strip off text preceding ":"
    var prefixRe = /^(.*?)\:/i;
    // strip off trailing "_median"
    var suffixRe = /_median$/i;
    var displayName = origName.replace(prefixRe, "").replace(suffixRe, "");
    // strip off trailing concentration
    suffixRe = /(_[\d]+)+_mol_mol$/i;
    displayName = displayName.replace(suffixRe, "");
    return displayName;
};

var renderSigResultsDataTable = function(dataObjs) {

    var processedDataObjs = [];

    var useCase = Session.get("use_case");

    _.each(dataObjs, function(dataObj) {
        var signatureMetadata = dataObj.signatureMetadata;
        var score;
        if (useCase == 2) {
            score = dataObj.significance;
        } else {
            score = dataObj.score;
        }
        var name = signatureMetadata.eventID;
        processedDataObjs.push({
            name: name,
            score: score
        });
    });

    console.log("processedDataObjs", processedDataObjs);

    var columnObjs = [{
        data: "name",
        title: "SIGNATURE NAME",
        // render: function(data, type, row) {
        //     displayName = getSignatureDisplayName(data);
        //     return displayName;
        // }
        render: function(data, type, row) {
            var displayName = getSignatureDisplayName(data);
            var links = [];
            _.each(displayName.split(/_/), function(drugName) {
                var s = stringifiedWikipediaLink(drugName);
                links.push(s);
            });
            return links.join("_");
        }
    }];

    // google search column
    columnObjs.push({
        data: "name",
        title: "Google Search",
        render: function(data, type, row) {
            var displayName = getSignatureDisplayName(data);
            var search_terms = _.union(displayName.split(/_/), Session.get("geneList"));
            var s = stringifiedGoogleLink(search_terms);
            return s;
        }
    });

    // add score column
    if (useCase == 2) {
        columnObjs.push({
            data: "score",
            title: "KS significance"
        });
    } else {
        // use case 1
        columnObjs.push({
            data: "score",
            title: "QUERY SET SCORE"
        });
    }

    // default column to sort
    var orderObj;
    if (useCase == 2) {
        orderObj = [
            [1, "asc"]
        ];
    } else {
        orderObj = [
            [1, "desc"]
        ];
    }

    var sigResultsDataTableObj = $('#sigResultsTable').DataTable({
        // supposed to make this object retrievable by ID
        // bRetrieve : true,
        // turn on select extension
        select: true,
        data: processedDataObjs,
        columns: columnObjs,
        order: orderObj
    });

    // set selected sigs rows
    var selectedSigs = Session.get("selectedSigs");

    if (!_.isUndefined(selectedSigs) && !_.isNull(selectedSigs) && selectedSigs.length > 0) {
        sigResultsDataTableObj.rows().every(function(rowIdx, tableLoop, rowLoop) {
            var data = this.data();
            if (_.contains(selectedSigs, data.name)) {
                this.select();
            }
        });
    }

    var setSelectedSigsSession = function() {
        var selectedData = sigResultsDataTableObj.rows({
            selected: true
        }).data().pluck('name');

        var selectedSigs = [];
        _.each(selectedData, function(sigName) {
            selectedSigs.push(sigName);
        });

        Session.set("selectedSigs", selectedSigs);
    };

    // event handling for (de)select events
    // https://datatables.net/reference/event/select
    // https://datatables.net/reference/event/deselect
    // ... update a session variable, selectedSigs

    sigResultsDataTableObj.on('select', function(e, dt, type, indexes) {
        if (type === 'row') {
            setSelectedSigsSession();
        }
    });

    sigResultsDataTableObj.on('deselect', function(e, dt, type, indexes) {
        if (type === 'row') {
            setSelectedSigsSession();
        }
    });

    return sigResultsDataTableObj;
};

Template.sigSelectTemplate.events({
    'click button#go_obs_deck': function(event, instance) {
        var selectedSigs = Session.get("selectedSigs");
        console.log("click button#go_obs_deck", "selectedSigs", selectedSigs);

        if (validateInput(selectedSigs)) {
            FlowRouter.go("obs_deck");
        } else {
            alert("Please select at least one row.");
            // alert("Please select exactly one row.");
        }

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

    // disable button
    document.getElementById("go_obs_deck").disabled = true;

    var geneList = Session.get("geneList");
    console.log("geneList", geneList);

    var description;
    switch ("" + Session.get("use_case")) {
        case "1":
            description = "These drug sensitivity models that have heavy weights for the submitted genes.";
            break;
        case "2":
            description = "The presence of variant call in the submitted genes is linked to these predicted drug sensitivities by KS test.";
            break;
        default:
            console.log("default description ??!");
    }
    // update query info
    document.getElementById("queryP").innerHTML = description + "<BR>" + "query genes: " + geneList;

    var show_signature_results = function(error, result) {
        console.log("result", result);

        if (result.success) {
            var data = result.data.data;
            var query = result.query;

            displaySignatures(data);

        } else {
            alert("request failed!");
        }
        // stop throbber
        document.getElementById("throbberImg").style.display = "none";

        // enable button
        document.getElementById("go_obs_deck").disabled = false;
    };

    // get data via the Meteor.method
    if (Session.get("use_case") == 2) {
        console.log("use case 2");
        Meteor.call("query_sigs_for_mutations", geneList, show_signature_results);
    } else {
        console.log("use case 1");
        Meteor.call("query_sigs_for_genes", geneList, show_signature_results);
    }
});

Template.sigSelectTemplate.onDestroyed(function() {
    console.log("Template.sigSelectTemplate.onDestroyed");
});

var displaySignatures = function(sigData) {
    console.log("sigData", sigData);

    jQuery.getScript("dataTables/datatables.min.js", function() {
        console.log("loaded datatables.min.js");
        var sigResultsDataTableObj = renderSigResultsDataTable(sigData);
    });
};
