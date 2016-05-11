Meteor.methods({
    test_get : function(arg1) {
        console.log("in method test_get", "query:", arg1);

        this.unblock();

        var success = true;

        try {
            var response = HTTP.call("GET", arg1);
        } catch (error) {
            // console.log("error name:", error.name);
            console.log("error message:", error.message);
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

    test : function() {
        console.log("in method test");
    },

    get_hard_coded_data : function(sigNames) {
        // data hard-coded into test_data.js
        console.log("in method get_hard_coded_data", sigNames);
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
        console.log("in get_hard_coded_sigs", geneList);
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
    }
});
