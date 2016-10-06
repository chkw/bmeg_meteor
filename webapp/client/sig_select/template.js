import {
    Session
} from 'meteor/session';

var removeAllChildren = function(elementId) {
    var elem = document.getElementById(elementId);
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
    return null;
};

var createBoxPlot = function(divId, data, chartName) {
    // TODO: createBoxPlot
    var chartDivId = chartName.replace(/ /, "_") + "BoxPlot";
    var containerDiv = document.getElementById(divId);
    var boxPlotDiv = document.createElement("div");
    boxPlotDiv.setAttribute("id", chartDivId);
    // boxPlotDiv.setAttribute("style", "margin: auto; max-width: 100px");
    boxPlotDiv.setAttribute("style", "height:300px;width: 20%;float: left;");
    containerDiv.appendChild(boxPlotDiv);
    // containerDiv.appendChild(document.createElement("br"));

    $(boxPlotDiv).highcharts({
        credits: {
            enabled: false
        },
        chart: {
            type: 'boxplot',
            events: {
                load: function() {}
            }
        },
        title: {
            text: getSignatureDisplayName(chartName) + ' scores by sample group'
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: ['non-mutated samples', 'mutated samples'],
        },
        yAxis: {
            title: {
                text: 'signature score'
            }
        },
        plotOptions: {
            boxplot: {
                fillColor: 'silver',
                lineWidth: 2,
                medianColor: 'blue',
                medianWidth: 3,
                stemColor: 'red',
                stemDashStyle: 'dot',
                stemWidth: 1,
                whiskerColor: 'green',
                whiskerLength: '30%',
                whiskerWidth: 3
            }
        },
        series: [{
            name: 'sample scores',
            data: data
        }]
    });
};

var stringifiedWikipediaLink = function(article_title) {
    var s = "<a title='" + article_title + "' href='https://en.wikipedia.org/wiki/" + article_title + "' target='_" + article_title + "'>" + article_title + "</a>";
    return s;
};

var stringifiedGoogleLink = function(search_terms) {
    var s = "<a title='search google' href='https://www.google.com/?q=" + search_terms.join("+") + "' target='_blank'>search</a>";
    return s;
};

var stringifiedGenecardsLink = function(geneID) {
    var s = "<a title='search genecards' href='https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + geneID + "' target='_blank'>" + geneID + "</a>";
    return s;
};

var stringifiedExploreGraphLink = function(nodeID, text) {
    var s = "<a title='explore_graph' href='/explore_graph/" + encodeURIComponent(nodeID) + "' target='_bmeg_explore'>" + text + "</a>";
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

var processQuartileObj = function(quartileObj) {
    var precision = 3;

    quartileObj.low = (quartileObj.minimum);
    quartileObj.q1 = (quartileObj.first);
    quartileObj.median = (quartileObj.second);
    quartileObj.q3 = (quartileObj.third);
    quartileObj.high = (quartileObj.maximum);
};

var renderSigResultsDataTable = function(dataObjs) {

    var processedDataObjs = [];

    var useCase = Session.get("use_case");

    if (dataObjs.length > 0) {
        var s = [];
        s.push("  /  ");
        s.push("non-mutated samples: " + dataObjs[0].backgroundGroupDetails.size);
        s.push("  /  ");
        s.push("mutated samples: " + dataObjs[0].sampleGroupDetails.size);
        document.getElementById("queryP").innerHTML = document.getElementById("queryP").innerHTML + s.join("");
    }

    _.each(dataObjs, function(dataObj) {
        var signatureMetadata = dataObj.signatureMetadata;
        var score;
        if (useCase == 2) {
            score = dataObj.significance;
            score = Number.parseFloat(score).toPrecision(3);
        } else {
            score = dataObj.score;
        }
        var name = signatureMetadata.eventID;
        var median_shift = "NA";
        if ((_.isUndefined(dataObj.sampleGroupDetails) || _.isUndefined(dataObj.backgroundGroupDetails))) {
            console.log("no sample group details");
        } else {
            median_shift = (dataObj.sampleGroupDetails.quartiles.second) - (dataObj.backgroundGroupDetails.quartiles.second);
            median_shift = Number.parseFloat(median_shift).toPrecision(3);
            processQuartileObj(dataObj.backgroundGroupDetails.quartiles);
            processQuartileObj(dataObj.sampleGroupDetails.quartiles);
        }
        processedDataObjs.push({
            eventID: signatureMetadata.eventID,
            name: name,
            score: score,
            median_shift: median_shift,
            backgroundGroupDetails: dataObj.backgroundGroupDetails,
            sampleGroupDetails: dataObj.sampleGroupDetails
        });
    });

    var columnObjs = [{
        data: "eventID",
        title: "SIGNATURE NAME",
        // render: function(data, type, row) {
        //     displayName = getSignatureDisplayName(data);
        //     return displayName;
        // }
        render: function(data, type, row) {
            var s = stringifiedExploreGraphLink(data, getSignatureDisplayName(data));
            return s;
        }
    }];

    // wikipedia
    columnObjs.push({
        data: "name",
        title: "Wikipedia",
        render: function(data, type, row) {
            var displayName = getSignatureDisplayName(data);
            var links = [];
            _.each(displayName.split(/_/), function(drugName) {
                var s = stringifiedWikipediaLink(drugName);
                links.push(s);
            });
            return links.join(", ");
        }
    });

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
            data: "median_shift",
            title: "median shift"
        });
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
    var lastColIndex = columnObjs.length - 1;
    if (useCase == 2) {
        orderObj = [
            [lastColIndex, "asc"]
        ];
    } else {
        orderObj = [
            [lastColIndex, "desc"]
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
        }).data();

        var selectedSigs = [];

        removeAllChildren("sigBoxPlots");
        _.each(selectedData, function(dataObj) {
            selectedSigs.push(dataObj.name);
            createBoxPlot("sigBoxPlots", [dataObj.backgroundGroupDetails.quartiles, dataObj.sampleGroupDetails.quartiles], dataObj.name);
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
    var geneLinkOuts = [];
    _.each(geneList, function(geneID) {
        // geneLinkOuts.push(stringifiedGenecardsLink(geneID));
        geneLinkOuts.push(stringifiedExploreGraphLink("feature:" + geneID, geneID));
    });
    document.getElementById("queryP").innerHTML = description + "<BR>" + "query genes: " + geneLinkOuts.join(", ");

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
