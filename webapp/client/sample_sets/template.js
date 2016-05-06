import { Session
}from'meteor/session';

Template.sampleSetsTemplate.events({});

Template.sampleSetsTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.sampleSetsTemplate.onCreated(function() {
    console.log("Template.sampleSetsTemplate.onCreated");
});

Template.sampleSetsTemplate.onRendered(function() {
    console.log("Template.sampleSetsTemplate.onRendered");
});

Template.sampleSetsTemplate.onDestroyed(function() {
    console.log("Template.sampleSetsTemplate.onDestroyed");
});

