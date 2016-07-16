import { Meteor
}from'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    console.log(chalk.green("Meteor.startup"));

    // When to display the sig_select breadcrumb?
    Handlebars.registerHelper("display_sig_select_crumb", function() {
        var use_case = Session.get("use_case");
        if (use_case == 2) {
            return 0;
        } else {
            return 1;
        }
    });
});
