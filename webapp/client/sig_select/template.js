import { Session
}from'meteor/session';

var renderSigResultsDataTable = function(dataObjs) {

    var columnObjs = [];
    var colNameSet = new Set();
    _.each(dataObjs, function(dataObj) {
        var keys = _.keys(dataObj);
        _.each(keys, function(key) {
            colNameSet.add(key);
        });
    });

    _.each(Array.from(colNameSet), function(colName) {
        columnObjs.push({
            data : colName,
            title : colName.toUpperCase(),
        });
    });

    // console.log("colNameSet", colNameSet);
    // console.log("columnObjs", columnObjs);

    var sigResultsDataTableObj = $('#sigResultsTable').DataTable({
        // supposed to make this object retrievable by ID
        bRetrieve : true,
        // turn on select extension
        select : true,
        data : dataObjs,
        columns : columnObjs
    });

    // set selected sigs rows
    var selectedSigs = Session.get("selectedSigs");

    if (!_.isUndefined(selectedSigs) && !_.isNull(selectedSigs) && selectedSigs.length > 0) {
        sigResultsDataTableObj.rows().every(function(rowIdx, tableLoop, rowLoop) {
            var data = this.data();
            if (_.contains(selectedSigs, data["name"])) {
                this.select();
            }
        });
    }

    var setSelectedSigsSession = function() {
        var selectedData = sigResultsDataTableObj.rows({
            selected : true
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
    'click button#go_obs_deck' : function(event, instance) {
        var selectedSigs = Session.get("selectedSigs");
        console.log("click button#go_obs_deck", "selectedSigs", selectedSigs);

        if (_.isUndefined(selectedSigs) || _.isNull(selectedSigs) || selectedSigs.length < 1) {
            alert("No signatures have been selected!");
        } else {
            FlowRouter.go("obs_deck");
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

    jQuery.getScript("dataTables/datatables.min.js", function() {
        console.log("loaded datatables.min.js");
        var sigResultsDataTableObj = renderSigResultsDataTable(sigData);
    });

};
