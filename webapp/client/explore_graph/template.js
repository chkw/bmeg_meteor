import {
    Session
} from 'meteor/session';


var getVertexData = function(vertexId, instance) {
    console.log("vertexId", vertexId);

    // start throbber
    document.getElementById("throbberImg").style.display = "inline";

    // query_bmeg_vertex_info
    Meteor.call("query_bmeg_vertex_info", vertexId, function(error, result) {
        console.log("result", result);

        if (result.success) {
            var data = result.data.data;
            instance.state.set(data);
            console.log("instance.state.keys", instance.state.keys);
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
    type() {
        const instance = Template.instance();
        return instance.state.get("type");
    },
    in () {
        const instance = Template.instance();
        return instance.state.get("in");
    },
    out() {
        const instance = Template.instance();
        return instance.state.get("out");
    },
    properties() {
        const instance = Template.instance();
        var propertiesObj = instance.state.get("properties");
        return JSON.stringify(propertiesObj);
    },
    vertexName(){
        return Template.instance().state.get("properties").name;
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
