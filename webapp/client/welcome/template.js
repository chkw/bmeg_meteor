import { Session
}from'meteor/session';

Template.welcomeTemplate.events({
    'click button#gene_set' : function(event, instance) {
        FlowRouter.go("gene_sets");
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
