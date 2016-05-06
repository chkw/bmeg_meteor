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

    get_hard_coded_data : function() {
        // data hard-coded into test_data.js
        console.log("in method get_hard_coded_data");
        var exampleData = test_data.exampleData;
        return {
            success : true,
            data : exampleData["mongoData"]
        };
    }
});
