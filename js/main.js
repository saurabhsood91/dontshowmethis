$(function() {

    var isNSFW = function(input, callback) {
        Algorithmia.client("simGsutkPeebT3OirQm6PqZCDqg1")
                   .algo("algo://spullara/YahooOpenNSFW/0.1.1")
                   .pipe(input)
                   .then(callback);
    };

    var checkForDisallowedContent = function() {
        var posts = $('.userContentWrapper._5pcr:visible').find('._1dwg._1w_m');
        console.log(posts.length);
        // console.log(posts);
        var postsArray = posts.toArray();
        postsArray.forEach(function(post){
            var fbPhotos = $(post).find('a._4-eo');
            var videos = $(post).find('img._3chq');
            var linkImage = $(post).find('._6l-.__c_').find('img');
            // debugger;
            if(fbPhotos.length > 0) {
                var link = $(fbPhotos[0]).find('img').attr('src');
                // $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).hide()
                // debugger;
                // console.log(link);
                if(!$(post).hasClass('dont-hide')) {
                    console.log('fb photos doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if(output.result > 0.25) {
                            $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).hide();
                        } else {
                            console.log('adding class photos');
                            $(post).addClass('dont-hide');
                        }
                    });
                }
            }
            if(linkImage.length > 0) {
                var link = linkImage[0].src;
                // $($(linkImage[0]).closest('.userContentWrapper._5pcr')).hide();
                if(!$(post).hasClass('dont-hide')) {
                    console.log('link doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if(output.result > 0.25) {
                            $($(linkImage[0]).closest('.userContentWrapper._5pcr')).hide();
                        } else {
                            console.log('adding class link');
                            $(post).addClass('dont-hide');
                        }
                    });
                }
                // debugger;
                // console.log(link);
                // continue;
            }
            // if(links.length > 0) {
            //     console.log(links[0].href);
            // }
            if(videos.length > 0) {
                // console.log(videos[0].src);
                var link = videos[0].src;
                if(!$(post).hasClass('dont-hide')) {
                    console.log('videos doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if(output.result > 0.25) {
                            $($(videos[0]).closest('.userContentWrapper._5pcr')).hide();
                        } else {
                            // console.log('adding class videos');
                            $(post).addClass('dont-hide');
                        }
                    });
                }
                // $($(videos[0]).closest('.userContentWrapper._5pcr')).hide();
            }
        });

    };

    var checkForDisallowedContentTwitter = function() {
            postImageList = $('.AdaptiveMedia-photoContainer.js-adaptive-photo').find('img:visible').toArray()
            postImageList.forEach(function(img)
            {
                if(!$(img).hasClass('dont-hide'))
                {
                    isNSFW(img.src,function(output)
                    {
                        console.log(output)
                        if(output.result > 0.25)
                        {
                            $(img).remove()
                        }
                        else
                        {
                            $(img).addClass('dont-hide');
                        }
                    })
                }
            })
        }

    // $(document).scroll(function(){
    //     setTimeout(checkForDisallowedContent, 1500);
    // });
    var initialize = function() {
        console.log('initializing');
        chrome.storage.sync.get({
            'sites': [],
            'hideNSFW': false
        }, function(options) {
            var isNSFW = options.hideNSFW;
            var sites = options.sites;
            if(window.location.href.indexOf('https://www.facebook.com') !== -1) {
                if(sites.length > 0 && sites.indexOf('Facebook') !== -1) {
                    setInterval(checkForDisallowedContent, 5000);
                    checkForDisallowedContent();
                    var photoList = $('._4-u2._24on._5t27._4-u8').find('img').toArray();
                    photoList.forEach(function(img)
                    {
                        if(!$(img).hasClass('dont-hide'))
                        {
                            isNSFW(img.src,function(output)
                            {
                                console.log(output);
                                if(output.result > 0.25)
                                {
                                    $(img).hide();
                                }
                                else
                                {
                                    $(img).addClass('dont-hide');
                                }
                            })
                        }
                    });
                }
            } else if(window.location.href.indexOf('https://twitter.com') !== -1) {
                console.log('here');
                if(sites.length > 0 && sites.indexOf('Twitter') !== -1) {
                    console.log('running for twitter');
                    setInterval(checkForDisallowedContentTwitter, 5000);
                }
            }

        });
    };
    // document.addEventListener('DOMContentLoaded', initialize, false);
    initialize();

});
