Meteor.methods({

    test : function() {
        console.log("method:test");
    },

    test_get : function(arg1) {
        var s = "method:test_get";
        console.log(s, "query:", arg1);

        this.unblock();

        var success = true;

        try {
            var response = HTTP.call("GET", arg1);
        } catch (error) {
            console.log(s, "error message:", error.message);
            success = false;
        }

        var returnObj = {
            success : success
        };

        if (success) {
            returnObj["response"] = response;
        }

        return returnObj;
    },

    test_post : function(postVars) {
        var s = "method:test_post";
        console.log(s, postVars);

        this.unblock();

        var serviceUrl = "https://posttestserver.com/post.php";
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                params : postVars
            });
        } catch (error) {
            console.log(s, "HTTP.call error message:", error.message);
            return {
                success : false,
                postVars : postVars
            };
        }

        return {
            success : true,
            postVars : postVars,
            response : response
        };
    },

    get_hard_coded_data : function(sigNames) {
        // data hard-coded into test_data.js
        var s = "method:get_hard_coded_data";
        console.log(s, sigNames);
        if (_.isUndefined(sigNames) || _.isNull(sigNames) || sigNames.length < 1) {
            return {
                success : false,
                query : sigNames
            };
        }
        var exampleData = test_data.exampleData;
        return {
            success : true,
            query : sigNames,
            data : exampleData["mongoData"]
        };
    },

    get_hard_coded_sigs : function(geneList) {
        // data hard-coded into test_data.js
        var s = "method:get_hard_coded_sigs";
        console.log(s, geneList);
        if (_.isUndefined(geneList) || _.isNull(geneList) || geneList.length < 1) {
            return {
                success : false,
                query : geneList
            };
        }
        var sigsData = test_data.sigsData;
        return {
            success : true,
            query : geneList,
            data : sigsData
        };
    },

    post_sigs_for_genes : function(geneList) {
        var s = "method:post_sigs_for_genes";
        console.log(s, geneList);
        if (_.isUndefined(geneList) || _.isNull(geneList) || geneList.length < 1) {
            return {
                success : false,
                query : geneList
            };
        }

        this.unblock();

        // TODO api has yet to be released
        var serviceUrl = "https://posttestserver.com/post.php";
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                params : {
                    geneList : JSON.stringify(geneList)
                }
            });
        } catch (error) {
            console.log(s, "HTTP.call error message:", error.message);
            success = false;
            return {
                success : false,
                query : geneList
            };
        }

        var sigsData = response;
        return {
            success : true,
            query : geneList,
            data : sigsData
        };
    },

    post_obs_deck_data_for_sigList : function(sigNames) {
        var s = "method:post_obs_deck_data_for_sigList";
        console.log(s, sigNames);
        if (_.isUndefined(sigNames) || _.isNull(sigNames) || sigNames.length < 1) {
            return {
                success : false,
                query : sigNames
            };
        }

        var signatureMetadataList = [];
        _.each(sigNames, function(sigName) {
            signatureMetadataList.push({
                eventID : sigName,
                datatype : "signature"
            });
        });

        this.unblock();

        // TODO api has yet to be released
        var serviceUrl = "https://posttestserver.com/post.php";
        var response;
        try {
            response = HTTP.call("POST", serviceUrl, {
                params : {
                    signatureMetadata : JSON.stringify(signatureMetadataList)
                }
            });
        } catch (error) {
            console.log(s, "HTTP.call error message:", error.message);
            return {
                success : false,
                query : sigNames
            };
        }

        var obsDeckData = response;
        return {
            success : true,
            query : sigNames,
            data : obsDeckData
        };
    }
});
