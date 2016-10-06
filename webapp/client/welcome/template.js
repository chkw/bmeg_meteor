import {
    Session
} from 'meteor/session';

Template.welcomeTemplate.events({
    'click button#gene_set': function(event, instance) {
        Session.set("use_case", 1);
        FlowRouter.go("gene_sets");
    },
    'click button#gene_set_2': function(event, instance) {
        Session.set("use_case", 2);
        FlowRouter.go("gene_sets");
    },
    'click button#browse_clinical_pies': function(event, instance) {
        Session.set("use_case", null);
        FlowRouter.go("clinicalPie");
    },
    'click button#explore_graph_button': function(event, instance) {
        Session.set("use_case", null);
        // FlowRouter.go("explore_graph/feature:TP53");

        FlowRouter.go("explore_graph_node_id", {
            node_id: "feature:TP53"
        }, {});

    }
});

Template.welcomeTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.welcomeTemplate.onCreated(function() {
    console.log("Template.welcomeTemplate.onCreated");
});

Template.welcomeTemplate.onRendered(function() {
    console.log("Template.welcomeTemplate.onRendered");
});

Template.welcomeTemplate.onDestroyed(function() {
    console.log("Template.welcomeTemplate.onDestroyed");
});
