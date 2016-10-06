import {
    Session
} from 'meteor/session';

var checkInput = function(input) {
    if (input.indexOf(":") == -1) {
        input = "feature:" + input.toUpperCase();
    }
    return input;
};

var getVertexData = function(vertexId, instance) {
    console.log("vertexId", vertexId);

    // start throbber
    document.getElementById("throbberImg").style.display = "inline";

    // query_bmeg_vertex_info
    Meteor.call("query_bmeg_vertex_info", checkInput(vertexId), function(error, result) {
        console.log("result", result);

        if (result.success) {
            var data = result.data.data;
            instance.state.set("data", data);
        } else {
            console.log("error with query_bmeg_vertex_info", error);
        }

        // stop throbber
        document.getElementById("throbberImg").style.display = "none";
    });

    return null;
};

Template.exploreGraphTemplate.events({
    'change #exploreTextBox' (event, instance) {
        var value = event.target.value;
        getVertexData(value, instance);
    }
});

Template.exploreGraphTemplate.helpers({
    vertexInfo() {
        var vertexInfo = Template.instance().state.get("data");
        console.log("vertexInfo", vertexInfo);
        return vertexInfo;
    },
    vertexProperties() {
        var result = [];
        var stateData = Template.instance().state.get("data");
        if (_.isUndefined(stateData)){
            return result;
        }
        var data = stateData.properties;
        _.each(_.keys(data), function(key) {
            var value = data[key];
            result.push({
                name: key,
                value: value
            });
        });
        console.log("result", result);
        return result;
    },
    inEdges() {
        var result = [];var stateData = Template.instance().state.get("data");
        if (_.isUndefined(stateData)){
            return result;
        }
        var data = stateData.in;
        _.each(_.keys(data), function(key) {
            var value = data[key];
            result.push({
                type: key,
                edges: value
            });
        });
        console.log("result", result);
        return result;
    },
    outEdges() {
        var result = [];var stateData = Template.instance().state.get("data");
        if (_.isUndefined(stateData)){
            return result;
        }
        var data = stateData.out;
        _.each(_.keys(data), function(key) {
            var value = data[key];
            result.push({
                type: key,
                edges: value
            });
        });
        console.log("result", result);
        return result;
    }
});

/**
 * lifecycle hooks
 */
Template.exploreGraphTemplate.onCreated(function() {
    console.log("Template.exploreGraphTemplate.onCreated");
    this.state = new ReactiveDict("exploreGraphReactiveDict");
});

Template.exploreGraphTemplate.onRendered(function() {
    console.log("Template.exploreGraphTemplate.onRendered");

    // start throbber
    document.getElementById("throbberImg").style.display = "none";

    // Meteor call !!
    // Meteor.call("query_sigs_for_genes", geneList, show_signature_results);
});

Template.exploreGraphTemplate.onDestroyed(function() {
    console.log("Template.exploreGraphTemplate.onDestroyed");
    delete this.state;
});
