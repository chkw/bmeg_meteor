import { Session
}from'meteor/session';

Template.badRouteTemplate.events({});

Template.badRouteTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.badRouteTemplate.onCreated(function() {
    console.log("Template.badRouteTemplate.onCreated");
});

Template.badRouteTemplate.onRendered(function() {
    console.log("Template.badRouteTemplate.onRendered");
});

Template.badRouteTemplate.onDestroyed(function() {
    console.log("Template.badRouteTemplate.onDestroyed");
});
