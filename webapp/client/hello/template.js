
Template.helloTemplate.onCreated(function helloOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
    this.result = "nothing here";
});

Template.helloTemplate.helpers({
counter() {
    return Template.instance().counter.get();
}
});

Template.helloTemplate.events({
'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
    Session.set("counter", instance.counter.get());

    var setResultCallback = function(error, result) {
        console.log("myMeteorMethodsCallback", result);
        console.log("instance.result1", instance.result);
        instance.result = result;
        console.log("instance.result2", instance.result);
    };

    var c = Session.get("counter");
    console.log("c", c);
    console.log("Meteor.absoluteUrl()", Meteor.absoluteUrl());
    Meteor.call("test_get", "http://time.gov/", setResultCallback);

    console.log("result", instance.result);

},
});

