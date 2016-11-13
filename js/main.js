$(function() {
    avoidTags = [];
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
        postsArray.forEach(function(post) {
            var fbPhotos = $(post).find('a._4-eo');
            var videos = $(post).find('img._3chq');
            var linkImage = $(post).find('._6l-.__c_').find('img');
            // debugger;
            if (fbPhotos.length > 0) {
                var link = $(fbPhotos[0]).find('img').attr('src');
                // $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).hide()
                // debugger;
                // console.log(link);
                if (!$(post).hasClass('dont-hide')) {
                    console.log('fb photos doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if (output.result > 0.25) {
                            $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).remove();
                        } else {
                            console.log('adding class photos');
                            $(post).addClass('dont-hide');
                        }
                    });
                }
            }
            if (linkImage.length > 0) {
                var link = linkImage[0].src;
                // $($(linkImage[0]).closest('.userContentWrapper._5pcr')).hide();
                if (!$(post).hasClass('dont-hide')) {
                    console.log('link doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if (output.result > 0.25) {
                            $($(linkImage[0]).closest('.userContentWrapper._5pcr')).remove();
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
            if (videos.length > 0) {
                // console.log(videos[0].src);
                var link = videos[0].src;
                if (!$(post).hasClass('dont-hide')) {
                    console.log('videos doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if (output.result > 0.25) {
                            $($(videos[0]).closest('.userContentWrapper._5pcr')).remove();
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
        postImageList.forEach(function(img) {
            if (!$(img).hasClass('dont-hide')) {
                isNSFW(img.src, function(output) {
                    console.log(output)
                    if (output.result > 0.25) {
                        $(img).remove()
                    } else {
                        $(img).addClass('dont-hide');
                    }
                })
            }
        })
    }

    var microsoftSentimentAnalysis = function(content) {
        // var params = {}
        // var output = ""
        var Inputdata = {
            "documents": [{
                "language": "en",
                "id": "string",
                "text": content.innerText
            }]
        }


        $.ajax({
                url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment?", //+ $.param(params),
                beforeSend: function(xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "a8d7c1ca87d4433d9bcec1aa74642f4b");
                },
                type: "POST",
                // Request body
                data: JSON.stringify(Inputdata),
            })
            .done(function(data) {
                // console.log(data['documents'][0]['score'])
                // return data['documents'][0]['score']
                if (!$(content).hasClass('dont-hide')) {
                    console.log(data['documents'][0]['score'])
                    if (data['documents'][0]['score'] < 0.50) {
                        console.log(content.innerText)
                        $(content).remove()
                        console.log("removed paragraph")
                    } else {
                        $(content).addClass('dont-hide')
                        console.log("Added to dont-hide class")
                    }
                }

                // alert("success");
            })
            .fail(function() {
                // alert("error");
            });
        // return output
    };

    var microsoftVisionTags = function(imageUrl, callback) {
        // var params = {}
        // var output = ""
        var Inputdata = {
            "url": imageUrl
        }


        $.ajax({
                url: "https://api.projectoxford.ai/vision/v1.0/tag?", //+ $.param(params),
                beforeSend: function(xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "a04b26d206e2482083db92c60b3b818a");
                },
                type: "POST",
                // Request body
                data: JSON.stringify(Inputdata),
            })
            .done(callback)
            .fail(function() {
                // alert("error");
            });
        // return output
    };

    // $(document).scroll(function(){
    //     setTimeout(checkForDisallowedContent, 1500);
    // });
    var initialize = function() {
        console.log('initializing');
        chrome.storage.sync.get({
            'sites': [],
            'hideNSFW': false,
            'negative': false,
            'tags': []
        }, function(options) {
            var optionNfsw = options.hideNSFW;
            var sites = options.sites;
            var optionNegative = options.negative;
            avoidTags = options.tags;
            if (window.location.href.indexOf('https://www.facebook.com') !== -1) {
                if (sites.length > 0 && sites.indexOf('Facebook') !== -1) {
                    if (optionNfsw) {
                        // setInterval(checkForDisallowedContent, 5000);
                        checkForDisallowedContent();
                        var photoList = $('._4-u2._24on._5t27._4-u8').find('img').toArray();
                        photoList.forEach(function(img) {
                            if (!$(img).hasClass('dont-hide')) {
                                isNSFW(img.src, function(output) {
                                    console.log(output);
                                    if (output.result > 0.25) {
                                        $(img).remove();
                                    } else {
                                        $(img).addClass('dont-hide');
                                    }
                                })
                            }
                        });
                    }
                    if (optionNegative) {
                        console.log('removing negative content');
                        // setInterval(function() {
                        var posts = $('.userContentWrapper._5pcr:visible').find('p').toArray();
                        posts.forEach(function(paragraph) {
                            microsoftSentimentAnalysis(paragraph)
                        })
                        // }, 5000);
                    }

                    if (avoidTags.length > 0) {
                        var posts = $('.userContentWrapper._5pcr:visible').find('._1dwg._1w_m');
                        console.log(posts.length);
                        // console.log(posts);
                        var postsArray = posts.toArray();
                        postsArray.forEach(function(post) {
                            var fbPhotos = $(post).find('a._4-eo');
                            var videos = $(post).find('img._3chq');
                            var linkImage = $(post).find('._6l-.__c_').find('img');
                            // debugger;
                            if (fbPhotos.length > 0) {
                                var link = $(fbPhotos[0]).find('img').attr('src');
                                // $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).hide()
                                // debugger;
                                // console.log(link);
                                // setInterval(function() {
                                    if (!$(post).hasClass('dont-hide')) {
                                        console.log('fb photos doesnt have class');
                                        microsoftVisionTags(link, function(data) {
                                            data['tags'].every(function(tag) {
                                                if (avoidTags.indexOf(tag.name) !== -1 && tag.confidence > 0.5) {
                                                    console.log(tag.name);
                                                    $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).remove();
                                                    console.log("The Tag has to be avoided")
                                                    return false;
                                                } else {
                                                    console.log(tag.name);
                                                    console.log("The Tag has to be printed");
                                                    $(post).addClass('dont-hide');
                                                }
                                            });
                                        });
                                    }
                                // }, 5000);
                            }
                            if (linkImage.length > 0) {
                                var link = linkImage[0].src;
                                // setInterval(function() {
                                    if (!$(post).hasClass('dont-hide')) {
                                        console.log('link doesnt have class');
                                        microsoftVisionTags(link, function(data) {
                                            data['tags'].every(function(tag) {
                                                if (avoidTags.indexOf(tag.name) != -1 && tag.confidence > 0.5) {
                                                    console.log(tag.name);
                                                    $($(linkImage[0]).closest('.userContentWrapper._5pcr')).remove();
                                                    console.log("The Tag has to be avoided");
                                                    return false;
                                                } else {
                                                    console.log(tag.name);
                                                    console.log("The Tag has to be printed");
                                                    $(post).addClass('dont-hide');
                                                }
                                            });
                                        });
                                    }
                                // }, 5000);

                                // debugger;
                                // console.log(link);
                                // continue;
                            }
                            // if(links.length > 0) {
                            //     console.log(links[0].href);
                            // }
                            if (videos.length > 0) {
                                // console.log(videos[0].src);
                                var link = videos[0].src;
                                // setInterval(function() {
                                    if (!$(post).hasClass('dont-hide')) {
                                        console.log('videos doesnt have class');
                                        microsoftVisionTags(link, function(data) {
                                            data['tags'].every(function(tag) {
                                                if (avoidTags.indexOf(tag.name) != -1 && tag.confidence > 0.5) {
                                                    console.log(tag.name);
                                                    $($(videos[0]).closest('.userContentWrapper._5pcr')).remove();
                                                    console.log("The Tag has to be avoided");
                                                    return false;
                                                } else {
                                                    console.log(tag.name);
                                                    console.log("The Tag has to be printed");
                                                    $(post).addClass('dont-hide');
                                                }
                                            });
                                        });
                                    }
                                // }, 5000);
                            }
                        });
                        var photoList = $('._4-u2._24on._5t27._4-u8').find('img').toArray();
                        photoList.forEach(function(img) {
                            // setInterval(function() {
                                if (!$(img).hasClass('dont-hide')) {
                                    microsoftVisionTags(img.src, function(data) {
                                        data['tags'].every(function(tag) {
                                            if (avoidTags.indexOf(tag.name) != -1 && tag.confidence > 0.5) {
                                                console.log(tag.name);
                                                $(img).remove();
                                                return false;
                                            } else {
                                                console.log(tag.name);
                                                console.log("The Tag has to be printed")
                                                $(img).addClass('dont-hide');
                                            }
                                        });
                                    });
                                }
                            // }, 5000);
                        });
                    }
                }
            } else if (window.location.href.indexOf('https://twitter.com') !== -1) {
                if (sites.length > 0 && sites.indexOf('Twitter') !== -1) {
                    console.log('running for twitter');
                    if (optionNfsw) {
                        // setInterval(checkForDisallowedContentTwitter, 5000);
                        checkForDisallowedContentTwitter();
                    }
                    if (optionNegative) {
                        // setInterval(function() {
                            var posts = $('.TweetTextSize.js-tweet-text.tweet-text').toArray();
                            posts.forEach(function(paragraph) {
                                microsoftSentimentAnalysis(paragraph)
                            });
                        // }, 5000);
                    }
                }
            }
        });
    };
    // document.addEventListener('DOMContentLoaded', initialize, false);
    setInterval(initialize, 5000);

});
