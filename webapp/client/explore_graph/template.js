import {
    Session
} from 'meteor/session';

var removeAllChildren = function(elementId) {
    var elem = document.getElementById(elementId);
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
    return null;
};

var stringifiedWikipediaLink = function(article_title) {
    var s = "<a title='" + article_title + "' href='https://en.wikipedia.org/wiki/" + article_title + "' target='_" + article_title + "'>" + article_title + "</a>";
    return s;
};

var stringifiedGoogleLink = function(search_terms) {
    var s = "<a title='search google' href='https://www.google.com/?q=" + search_terms.join("+") + "' target='_blank'>search</a>";
    return s;
};

var stringifiedGenecardsLink = function(geneID) {
    var s = "<a title='search genecards' href='https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + geneID + "' target='_blank'>" + geneID + "</a>";
    return s;
};

var validateInput = function(inputString) {

    if (_.isUndefined(inputString) || _.isNull(inputString)) {
        return false;
    }

    if (inputString.length < 1) {
        return false;
    }
    return true;
};

Template.exploreGraphTemplate.events({});

Template.exploreGraphTemplate.helpers({});

/**
 * lifecycle hooks
 */
Template.exploreGraphTemplate.onCreated(function() {
    console.log("Template.exploreGraphTemplate.onCreated");
});

Template.exploreGraphTemplate.onRendered(function() {
    console.log("Template.exploreGraphTemplate.onRendered");

    // start throbber
    document.getElementById("throbberImg").style.display = "inline";

    // Meteor call !!
    // Meteor.call("query_sigs_for_genes", geneList, show_signature_results);
});

Template.exploreGraphTemplate.onDestroyed(function() {
    console.log("Template.exploreGraphTemplate.onDestroyed");
});
