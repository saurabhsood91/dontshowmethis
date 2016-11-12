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
        'hideNSFW': false
    }, function(options) {
        document.querySelector('#optionsNSFW').checked = options.hideNSFW;
    });

    document.querySelector('#optionsNSFW').onchange = function(){
        var nsfwValue = document.querySelector('#optionsNSFW').checked;
        chrome.storage.sync.set({
            'hideNSFW': nsfwValue
        }, function() {
            document.querySelector('#status').innerHTML = 'Option Saved!';
        });
    };

};

document.addEventListener('DOMContentLoaded', initialize, false);
