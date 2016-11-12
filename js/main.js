$(function() {
    var posts = $('.userContentWrapper._5pcr').find('._1dwg._1w_m');
    console.log(posts.length);
    // console.log(posts);
    for(var i = 0; i < posts.length; i++) {
        var fbPhotos = $(posts[i]).find('a._4-eo');
        // var links = $(posts[i]).find('a._52c6');
        var videos = $(posts[i]).find('img._3chq');
        var linkImage = $(posts[i]).find('._6l-.__c_').find('img');
        // debugger;
        if(fbPhotos.length > 0) {
            var link = $(fbPhotos[0]).find('img').attr('src');
            $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).hide()
            // debugger;
            console.log(link);
            continue;
        }
        if(linkImage.length > 0) {
            var link = linkImage[0].src;
            $($(linkImage[0]).closest('.userContentWrapper._5pcr')).hide();
            // debugger;
            console.log(link);
            // continue;
        }
        // if(links.length > 0) {
        //     console.log(links[0].href);
        // }
        if(videos.length > 0) {
            console.log(videos[0].src);
        }
    }

});
