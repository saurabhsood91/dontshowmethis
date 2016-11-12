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
var tags = [];

var initialize = function() {
    chrome.storage.sync.get({
        'hideNSFW': false,
        'sites': [],
        'negative': false,
        'tags': []
    }, function(options) {
        document.querySelector('#optionsNSFW').checked = options.hideNSFW;
        document.querySelector('#optionsNegative').checked = options.negative;

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

        if(options.tags.length > 0) {
            tags = options.tags;
            showTags();
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

    document.querySelector('#btn-tags').onclick = function() {
        // Get list of Tags
        var selectedTags = $('#inputTags').tagsinput('items');
        selectedTags.forEach(function(t) {
            if(tags.indexOf(t) === -1) {
                tags.push(t);
            }
        });
        chrome.storage.sync.set({
            'tags': tags
        }, function() {
            // Clear the Tags
            $('#inputTags').tagsinput('removeAll');
            showTags();
        });
    };

    var showTags = function() {
        // $('#all-tags').empty();
        var allTags = document.querySelector('#all-tags');
        allTags.innerHTML = '';
        tags.forEach(function(tag) {
            var container = document.createElement('div');

            // var t = document.createElement('button');
            // t.className = 'btn btn-default';
            // t.type = 'button';

            var span = document.createElement('span');
            span.className = 'badge glyphicon glyphicon-remove';
            span.innerText = tag;

            // span.click(function() {
            //     console.log(this);
            // });
            span.onclick = function() {
                console.log(this);
                var tagToRemove = this.innerText;
                // Remove parent node
                this.parentElement.remove();
                // Splice from tags
                tags.splice(tagToRemove, 1);
                //Save new list of tags
                chrome.storage.sync.set({
                    'tags': tags
                }, function() {
                    console.log('removed tag');
                });
            };
            // t.append(span);
            container.append(span);
            // container.append(t);
            allTags.append(container);
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

    var saveNegativeSettings = function() {
        var negativeValue = document.querySelector('#optionsNegative').checked;
        chrome.storage.sync.set({
            'negative': negativeValue
        }, function() {
            console.log('Negative Settings saved');
            document.querySelector('#status').innerHTML = 'Negative Settings Saved!';
        });
    };

    document.querySelector('#optionsTwitter').onchange = saveSiteSettings;
    document.querySelector('#optionsFacebook').onchange = saveSiteSettings;
    document.querySelector('#optionsNegative').onchange = saveNegativeSettings;

};

document.addEventListener('DOMContentLoaded', initialize, false);
