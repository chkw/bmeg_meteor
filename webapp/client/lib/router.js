// use the meteor package, kadira:flow-router, for routing

FlowRouter.route('/', {
    name: "root",
    action: function(params, queryParams) {
        console.log("routing for root");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("welcomeTemplate");
    }
});

FlowRouter.route('/hello', {
    name: "hello",
    action: function(params, queryParams) {
        console.log("routing for hello");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("helloTemplate");
    }
});

FlowRouter.route('/welcome', {
    name: "welcome",
    action: function(params, queryParams) {
        console.log("routing for welcome");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("welcomeTemplate");
    }
});

FlowRouter.route('/gene_sets', {
    name: "gene_sets",
    action: function(params, queryParams) {
        console.log("routing for gene_sets");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("geneSetsTemplate");
    }
});

FlowRouter.route('/sample_sets', {
    name: "sample_sets",
    action: function(params, queryParams) {
        console.log("routing for sample_sets");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("sampleSetsTemplate");
    }
});

FlowRouter.route('/sig_select', {
    name: "sig_select",
    action: function(params, queryParams) {
        console.log("routing for sig_select");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("sigSelectTemplate");
    }
});

FlowRouter.route('/obs_deck', {
    name: "obs_deck",
    action: function(params, queryParams) {
        console.log("routing for obs_deck");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("obsDeckTemplate");
    }
});

FlowRouter.route('/explore_graph', {
    name: "explore_graph",
    action: function(params, queryParams) {
        console.log("routing for explore_graph");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("exploreGraphTemplate");
    }
});

FlowRouter.notFound = {
    name: "notFound",
    action: function() {
        console.log("route not found");
        BlazeLayout.render("badRouteTemplate");
    }
};

FlowRouter.route('/test', {
    name: "test",
    action: function(params, queryParams) {
        console.log("routing for 'test'");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("testTemplate");
    }
});

FlowRouter.route('/clinicalPie', {
    name: "clinicalPie",
    action: function(params, queryParams) {
        console.log("routing for 'clinicalPie'");
        console.log("params", params);
        console.log("queryParams", queryParams);
        BlazeLayout.render("clinicalPieTemplate");
    }
});
