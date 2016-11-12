$(function() {
    // var postElements = $('._1dwg._1w_m');
    // // console.log(postElements);
    // // postElements.forEach(function(post) {
    // //     console.log($(post).find('._4-eo'));
    // // });
    // for(var i = 0; i < postElements.length; i++) {
    //     // console.log($(postElements[i]).find('._4-eo'));
    //     var a = $(postElements[i]).find('a');
    //     debugger;
    //     a.filter(function(val) {
    //         return $(val).attr('href') !== '#';
    //     });
    //     if(a) {
    //         console.log(a.attr('href'));
    //     }
    // }
    var posts = $('._1dwg._1w_m');
    // console.log(img);

    for(var i = 0; i < posts.length; i++) {
        var fbPhotos = $(posts[i]).find('a._4-eo');
        // var links = $(posts[i]).find('a._52c6');
        var videos = $(posts[i]).find('video');
        // debugger;
        if(fbPhotos.length > 0) {
            console.log($(fbPhotos[0]).find('img').attr('src'));
            continue;
        }
        // if(links.length > 0) {
        //     console.log(links[0].href);
        // }
        if(videos.length > 0) {
            console.log(videos[0].src);
        }
    }

});
