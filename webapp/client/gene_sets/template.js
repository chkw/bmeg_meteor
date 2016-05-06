import { Session
}from'meteor/session';

Template.geneSetsTemplate.events({'click button'(event, instance) {
    FlowRouter.go("obs_deck");
}});

Template.geneSetsTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.geneSetsTemplate.onCreated(function() {
    console.log("Template.geneSetsTemplate.onCreated");
});

Template.geneSetsTemplate.onRendered(function() {
    console.log("Template.geneSetsTemplate.onRendered");
});

Template.geneSetsTemplate.onDestroyed(function() {
    console.log("Template.geneSetsTemplate.onDestroyed");
});

