import {
    Session
} from 'meteor/session';

var checkInput = function(input) {
    if (input.indexOf(":") == -1) {
        input = "feature:" + input.toUpperCase();
    }
    return input;
};

var stringifiedExploreGraphLink = function(nodeID, text) {
    var s = "<a title='explore_graph' href='/explore_graph/" + encodeURIComponent(nodeID) + "' target='_bmeg_explore'>" + text + "</a>";
    return s;
};

var getVertexData = function(vertexId, instance) {
    console.log("vertexId", vertexId);

    // start throbber
    document.getElementById("throbberImg").style.display = "inline";

    // query_bmeg_vertex_info
    Meteor.call("query_bmeg_vertex_info", vertexId, function(error, result) {
        console.log("result", result);

        if (result.success) {
            var data = result.data.data;
            instance.state.set("data", data);
        } else {
            console.log("error with query_bmeg_vertex_info", error);
        }

    });

    // stop throbber
    document.getElementById("throbberImg").style.display = "none";

    return null;
};

Template.exploreGraphTemplate.events({
    'change #exploreTextBox' (event, instance) {
        var value = event.target.value;
        var node_id = checkInput(value);
        console.log("exploreTextBox node_id", node_id);

        FlowRouter.setParams({
            node_id: encodeURIComponent(node_id)
        });

        // TODO: Is this the right thing to do?
        window.location.reload();
    },
    'click .node_id_text' (event, instance) {
        var node_id = event.target.innerHTML;
        console.log("node_id_text node_id", node_id);

        FlowRouter.setParams({
            node_id: encodeURIComponent(node_id)
        });

        // TODO: Is this the right thing to do?
        window.location.reload();
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
        if (_.isUndefined(stateData) || ((_.keys(stateData).length) === 0)) {
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
    vertexPropertiesTable() {
        var result = [];
        result.push("<table id='vertexPropertiesTable' class='table'>");
        result.push("<tbody>");
        var stateData = Template.instance().state.get("data");
        if (_.isUndefined(stateData) || ((_.keys(stateData).length) === 0)) {
            return "<br>";
        }
        var data = stateData.properties;
        _.each(_.keys(data), function(key) {
            var value = data[key];
            if (key === "coefficients") {
                value = "gene weights";
            }
            result.push("<tr>");
            result.push("<td>" + key + "</td>");
            result.push("<td>" + value + "</td>");
            result.push("</tr>");
        });
        result.push("</tbody>");
        result.push("</table>");
        result = result.join("\n");
        return result;
    },
    inEdgesHTML() {
        // stringifiedExploreGraphLink = function(nodeID, text)
        var result = [];
        var stateData = Template.instance().state.get("data");
        if (_.isUndefined(stateData) || ((_.keys(stateData).length) === 0)) {
            return "<br>";
        }
        var data = stateData.in;
        _.each(_.keys(data), function(edgeType) {
            result.push("<h5>" + edgeType + "</h5>");
            var targetNodes = data[edgeType];
            _.each(targetNodes, function(node_id) {
                var isNodeId = node_id.indexOf(":");
                if (isNodeId != -1) {
                    // var s = stringifiedExploreGraphLink(node_id, node_id);
                    result.push("<p class='node_id_text' style='cursor:pointer'>" + node_id + "</p>");
                } else {

                    result.push("<p>" + node_id + "</p>");
                }
            });

        });
        result = result.join("\n");
        return result;
    },
    outEdgesHTML() {
        // stringifiedExploreGraphLink = function(nodeID, text)
        var result = [];
        var stateData = Template.instance().state.get("data");
        if (_.isUndefined(stateData) || ((_.keys(stateData).length) === 0)) {
            return "<br>";
        }
        var data = stateData.out;
        _.each(_.keys(data), function(edgeType) {
            result.push("<h5>" + edgeType + "</h5>");
            var targetNodes = data[edgeType];
            _.each(targetNodes, function(node_id) {
                var isNodeId = node_id.indexOf(":");
                if (isNodeId != -1) {
                    // var s = stringifiedExploreGraphLink(node_id, node_id);
                    result.push("<p class='node_id_text' style='cursor:pointer'>" + node_id + "</p>");
                } else {

                    result.push("<p>" + node_id + "</p>");
                }
            });

        });
        result = result.join("\n");
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

    // Meteor.absoluteUrl()
    document.getElementById("baskin_logo").src = Meteor.absoluteUrl("images/baskin-logo-banner.gif");
    document.getElementById("ohsu_logo").src = Meteor.absoluteUrl("images/ohsu_logo_400x400.jpg");

    // stop throbber
    document.getElementById("throbberImg").style.display = "none";

    var node_id = FlowRouter.getParam("node_id");
    getVertexData(node_id, Template.instance());
});

Template.exploreGraphTemplate.onDestroyed(function() {
    console.log("Template.exploreGraphTemplate.onDestroyed");
    delete this.state;
});
