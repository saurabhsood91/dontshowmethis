// $(function(){
//     var restoreOptions = function() {
//         chrome.storage.sync.get({
//             'hideNSFW': false
//         }, function(options) {
//             document.querySelector('#optionsNSFW').checked = options.hideNSFW;
//         });
//     };
//
//     $('#optionsNSFW').change(function(){
//         var nsfwValue = document.querySelector('#optionsNSFW').checked;
//         chrome.storage.sync.set({
//             'hideNSFW': nsfwValue
//         }, function() {
//             $('#status').html('Option Saved!');
//         });
//     });
//
//     // Load Settings
//     document.addEventListener('DOMContentLoaded', restoreOptions, false);
//
// });
//
// // $(function(){})

var initialize = function() {
    chrome.storage.sync.get({
        'hideNSFW': false,
        'sites': []
    }, function(options) {
        document.querySelector('#optionsNSFW').checked = options.hideNSFW;

        if(options.sites.length > 0 && options.sites.indexOf('Facebook') != -1) {
            document.querySelector('#optionsFacebook').checked = true;
        } else {
            document.querySelector('#optionsFacebook').checked = false;
        }

        if(options.sites.length > 0 && options.sites.indexOf('Twitter') != -1) {
            document.querySelector('#optionsTwitter').checked = true;
        } else {
            document.querySelector('#optionsTwitter').checked = false;
        }

    });

    document.querySelector('#optionsNSFW').onchange = function(){
        var nsfwValue = document.querySelector('#optionsNSFW').checked;
        chrome.storage.sync.set({
            'hideNSFW': nsfwValue
        }, function() {
            document.querySelector('#status').innerHTML = 'NSFW option saved!';
        });
    };

    var saveSiteSettings = function() {
        var allSites = document.querySelectorAll('.selected-site:checked');
        var sites = [];
        for(var i = 0; i < allSites.length; i++) {
            sites.push(allSites[i].value);
        }
        console.log(allSites);
        chrome.storage.sync.set({
            'sites': sites
        }, function() {
            console.log('sites saved');
            document.querySelector('#status').innerHTML = 'Site settings saved!';
        });

    };

    document.querySelector('#optionsTwitter').onchange = saveSiteSettings;
    document.querySelector('#optionsFacebook').onchange = saveSiteSettings;

};

document.addEventListener('DOMContentLoaded', initialize, false);
