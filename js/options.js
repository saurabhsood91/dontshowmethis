$(function(){
    console.log('loaded settings');
    var restoreOptions = function() {
        chrome.storage.sync.get({
            'hideNSFW': false
        }, function(options) {
            $('#optionsNSFW').val(options.hideNSFW);
        });
    };

    $('#optionsNSFW').change(function(){
        chrome.storage.sync.set({
            'hideNSFW': $('#optionsNSFW').val()
        }, function() {
            $('#status').html('Option Saved!');
        });
    });

    // Load Settings
    document.addEventListener('DOMContentLoaded', restoreOptions);

})();
