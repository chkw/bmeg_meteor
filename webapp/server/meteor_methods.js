console.log(chalk.green("meteor_methods"));
var bmeg_query_service_url;
if (Meteor.isServer) {
    console.log(
        "Specify the address for BMEG GAEA by setting the environment variable, bmeg_ip."
    );
    bmeg_query_service_url = (_.isUndefined(process.env.bmeg_ip)) ?
        "http://bmeg.io" : process.env.bmeg_ip;
}
console.log(chalk.green("bmeg_query_service_url: " + bmeg_query_service_url));

var post_test_service_url = "https://posttestserver.com/post.php";

Meteor.methods({

    test: function() {
        console.log("method:test");
    },

    test_bmeg: function() {
        var s = "method:test_bmeg";
        this.unblock();
        var success = true;
        var response = null;
        try {
            response = HTTP.call("GET", bmeg_query_service_url);
        } catch (error) {
            console.log(chalk.red.bold(s), "error message:", error.message);
            success = false;
        }

        var returnObj = {
            success: success
        };
        if (success) {
            returnObj.response = response;
        }
        console.log(chalk.green.bold(s), returnObj);
        return returnObj;
    },

    test_get: function(arg1) {
        var startDate = new Date();
        var s = "method:test_get";
        console.log(s, "query:", arg1);

        this.unblock();

        var success = true;
        var response = null;
        try {
            response = HTTP.call("GET", arg1);
        } catch (error) {
            console.log(chalk.red.bold(s), "error message:", error.message);
            success = false;
        }

        var returnObj = {
            success: success
        };

        if (success) {
            returnObj.response = response;
        }

        console.log(chalk.green.bold(s), returnObj);
        console.log(s, arguments, "took " + (new Date() - startDate) / (1000 * 60) + " minutes");

        return returnObj;
    },
    test_post: function(postVars) {
        var startDate = newDate();
        var s = "method:test_post";
        console.log(s, postVars);

        this.unblock();

        var serviceUrl = post_test_service_url;
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                params: postVars
            });
        } catch (error) {
            console.log(chalk.red.bold(s), "HTTP.call error message:", error.message);
            return {
                success: false,
                postVars: postVars
            };
        }

        console.log(chalk.green.bold(s), response);

        console.log(s, arguments, "took " + (new Date() - startDate) / (1000 * 60) + " minutes");
        return {
            success: true,
            postVars: postVars,
            response: response
        };
    },
    query_hard_coded_data: function(sigNames) {
        // data hard-coded into test_data.js
        var s = "method:query_hard_coded_data";
        console.log(s, sigNames);
        if (_.isUndefined(sigNames) || _.isNull(sigNames) || sigNames.length <
            1) {
            return {
                success: false,
                query: sigNames
            };
        }
        var exampleData = test_data.exampleData;
        return {
            success: true,
            query: sigNames,
            data: exampleData.mongoData
        };
    },
    query_hard_coded_sigs: function(geneList) {
        // data hard-coded into test_data.js
        var s = "method:query_hard_coded_sigs";
        console.log(s, geneList);
        if (_.isUndefined(geneList) || _.isNull(geneList) || geneList.length <
            1) {
            return {
                success: false,
                query: geneList
            };
        }
        var sigsData = test_data.sigsData;
        return {
            success: true,
            query: geneList,
            data: sigsData
        };
    },
    // get signatures in which the query genes have heavy feature weight
    // The differs from 'post_sigs_for_mutations' only by the service url.
    query_sigs_for_genes: function(geneList) {
        var startDate = new Date();
        var s = "method:query_sigs_for_genes";
        console.log(s, geneList);
        if (_.isUndefined(geneList) || _.isNull(geneList) || geneList.length <
            1) {
            return {
                success: false,
                query: geneList
            };
        }

        this.unblock();

        var serviceUrl = bmeg_query_service_url + "/gaea/signature/gene";
        console.log(chalk.green(s), chalk.yellow("serviceUrl: " + serviceUrl),
            chalk.cyan("content: " + JSON.stringify(geneList)));
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                content: JSON.stringify(geneList)
            });
        } catch (error) {
            console.log(chalk.red.bold(s), serviceUrl,
                "HTTP.call error message:", error.message);
            success = false;
            return {
                success: false,
                query: geneList
            };
        }

        var sigsData = response;
        console.log(s, arguments, "took " + (new Date() - startDate) / (1000 * 60) + " minutes");
        return {
            success: true,
            query: geneList,
            data: sigsData
        };
    },
    // get signatures with differential signature scores between non-mutated and mutated sample groups
    // The differs from 'post_sigs_for_genes' only by the service url.
    query_sigs_for_mutations: function(geneList) {
        var startDate = new Date();
        var s = "method:query_sigs_for_mutations";
        console.log(s, geneList);
        if (_.isUndefined(geneList) || _.isNull(geneList) || geneList.length <
            1) {
            return {
                success: false,
                query: geneList
            };
        }

        this.unblock();

        var serviceUrl = bmeg_query_service_url + "/gaea/signature/mutation";
        console.log(chalk.green(s), chalk.yellow("serviceUrl: " + serviceUrl),
            chalk.cyan("content: " + JSON.stringify(geneList)));
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                content: JSON.stringify(geneList)
            });
        } catch (error) {
            console.log(chalk.red.bold(s), serviceUrl,
                "HTTP.call error message:", error.message);
            success = false;
            return {
                success: false,
                query: geneList
            };
        }

        var sigsData = response;
        console.log(s, arguments, "took " + (new Date() - startDate) / (1000 * 60) + " minutes");
        return {
            success: true,
            query: geneList,
            data: sigsData
        };
    },
    query_get_event_data: function(sigNames, geneList,
        clinicalEvents) {
        var startDate = new Date();
        var s = "method:query_obs_deck_data_for_sigList";
        console.log(s, sigNames, geneList, clinicalEvents);

        if (_.isUndefined(sigNames) || _.isNull(sigNames) || sigNames.length <
            1) {
            return {
                success: false,
                query: [sigNames, geneList, clinicalEvents]
            };
        }

        var signatureMetadataList = [];
        _.each(sigNames, function(sigName) {
            signatureMetadataList.push({
                eventID: sigName,
                datatype: "drug sensitivity signature"
            });
        });

        var expressionMetadataList = [];
        var mutationMetadataList = [];
        _.each(geneList, function(geneName) {
            expressionMetadataList.push({
                eventID: geneName,
                datatype: "mrna_expression"
            });
            mutationMetadataList.push({
                eventID: geneName,
                datatype: "mutation call"
            });
        });

        var clinicalMetadataList = [];
        _.each(clinicalEvents, function(eventName) {
            clinicalMetadataList.push({
                eventID: eventName,
                datatype: "clinical"
            });
        });

        var content = {
            signatureMetadata: signatureMetadataList,
            expressionMetadata: expressionMetadataList,
            clinicalEventMetadata: clinicalMetadataList,
            mutationEventMetadata: mutationMetadataList
        };

        this.unblock();

        var serviceUrl = bmeg_query_service_url + "/gaea/signature/sample";
        console.log(chalk.green(s), chalk.yellow("serviceUrl: " + serviceUrl),
            chalk.cyan("content: " + JSON.stringify(content)));
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                content: JSON.stringify(content)
            });
        } catch (error) {
            console.log(chalk.red.bold(s), serviceUrl,
                "HTTP.call error message:", error.message);
            return {
                success: false,
                query: content
            };
        }

        var eventData = response;

        console.log(s, arguments, "took " + (new Date() - startDate) / (1000 * 60) + " minutes");
        return {
            success: true,
            query: content,
            data: eventData
        };
    },
    test_clinical_var_names: function() {
        var s = "method:test_clinical_var_names";
        console.log(s, arguments);
        var content = {};
        var clinicalVarNames = test_data.clinicalVarNames;
        return {
            success: true,
            query: content,
            data: _.union(clinicalVarNames, ["Adeno", "Histology_Call", "study", "sample", "Small_Cell", "Trichotomy"])
        };
    },
    query_clinical_var_names: function() {
        // get available clinical variable names
        var startDate = new Date();
        var s = "method:query_clinical_var_names";
        console.log(s, arguments);

        this.unblock();

        var serviceUrl = bmeg_query_service_url + "/gaea/individual/attributes";
        console.log(chalk.green(s), chalk.yellow("serviceUrl: " + serviceUrl));
        var response;
        try {
            response = HTTP.call("GET", serviceUrl);
        } catch (error) {
            console.log(chalk.red.bold(s), serviceUrl,
                "HTTP.call error message:", error.message);
            return {
                success: false
            };
        }

        var clinicalVarNames = response;

        console.log(s, arguments, "took " + (new Date() - startDate) / (1000 * 60) + " minutes");
        return {
            success: true,
            data: clinicalVarNames
        };
    },
    query_clinical_data: function(clinicalVarNames) {
        // bmeg.io/gaea/individual/values
        var startDate = new Date();
        var s = "method:query_clinical_data";
        console.log(s, arguments);

        this.unblock();

        var content = clinicalVarNames;
        var serviceUrl = bmeg_query_service_url + "/gaea/individual/values";
        console.log(chalk.green(s), chalk.yellow("serviceUrl: " + serviceUrl),
            chalk.cyan("content: " + JSON.stringify(content)));
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                content: JSON.stringify(clinicalVarNames)
            });
        } catch (error) {
            console.log(chalk.red.bold(s), serviceUrl,
                "HTTP.call error message:", error.message);
            return {
                success: false,
                query: content
            };
        }

        var clinicalEventData = response;

        console.log(s, arguments, "took " + (new Date() - startDate) / (1000 * 60) + " minutes");
        return {
            success: true,
            query: content,
            data: clinicalEventData
        };
    },
    test_clinical_data: function(eventIds) {
        var s = "method:test_clinical_data";
        console.log(s, arguments);
        var content = {};
        var rawClinicalData = test_data.exampleData.mongoData.clinical;

        var clinicalEventDataMap = {};

        _.each(rawClinicalData, function(dataObj) {
            delete dataObj._id;

            var sampleId = dataObj.sample;

            _.each(_.keys(dataObj), function(clinicalVarName) {
                if (!_.contains(eventIds, clinicalVarName) || clinicalVarName == "sample") {
                    return;
                }
                if (!_.contains(_.keys(clinicalEventDataMap), clinicalVarName)) {
                    clinicalEventDataMap[clinicalVarName] = {
                        metadata: {
                            eventID: clinicalVarName,
                            eventType: "clinical",
                            datatype: "CATEGORIC",
                            FeatureWeights: null,
                            correlatorScore: null
                        },
                        sampleData: []
                    };
                }

                clinicalEventDataMap[clinicalVarName].sampleData.push({
                    sampleID: sampleId,
                    value: dataObj[clinicalVarName]
                });
            });

        });

        return {
            success: true,
            query: content,
            data: _.values(clinicalEventDataMap)
        };
    }
});
