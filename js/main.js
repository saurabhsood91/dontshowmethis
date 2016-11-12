$(function() {

    var isNSFW = function(input, callback) {
        Algorithmia.client("simGsutkPeebT3OirQm6PqZCDqg1")
                   .algo("algo://spullara/YahooOpenNSFW/0.1.1")
                   .pipe(input)
                   .then(callback);
    };

    var checkForDisallowedContent = function() {
        var posts = $('.userContentWrapper._5pcr').find('._1dwg._1w_m');
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
                        if(output.result > 0.5) {
                            $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).hide()
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
                        if(output.result > 0.5) {
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
                        if(output.result > 0.5) {
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

    // $(document).scroll(function(){
    //     setTimeout(checkForDisallowedContent, 1500);
    // });
    setInterval(checkForDisallowedContent, 5000);
    checkForDisallowedContent();
});
