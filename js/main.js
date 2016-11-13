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
        var postsArray = posts.toArray();
        postsArray.forEach(function(post) {
            var fbPhotos = $(post).find('a._4-eo');
            var videos = $(post).find('img._3chq');
            var linkImage = $(post).find('._6l-.__c_').find('img');
            if (fbPhotos.length > 0) {
                var link = $(fbPhotos[0]).find('img').attr('src');
                if (!$(post).hasClass('dont-hide-image-nsfw')) {
                    console.log('fb photos doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if (output.result > 0.25) {
                            $($(fbPhotos[0]).closest('.userContentWrapper._5pcr')).remove();
                        } else {
                            console.log('adding class photos');
                            $(post).addClass('dont-hide-image-nsfw');
                        }
                    });
                }
            }
            if (linkImage.length > 0) {
                var link = linkImage[0].src;
                if (!$(post).hasClass('dont-hide-image-nsfw')) {
                    console.log('link doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if (output.result > 0.25) {
                            $($(linkImage[0]).closest('.userContentWrapper._5pcr')).remove();
                        } else {
                            console.log('adding class link');
                            $(post).addClass('dont-hide-image-nsfw');
                        }
                    });
                }
            }
            if (videos.length > 0) {
                var link = videos[0].src;
                if (!$(post).hasClass('dont-hide-image-nsfw')) {
                    console.log('videos doesnt have class');
                    isNSFW(link, function(output) {
                        console.log(output);
                        if (output.result > 0.25) {
                            $($(videos[0]).closest('.userContentWrapper._5pcr')).remove();
                        } else {
                            $(post).addClass('dont-hide-image-nsfw');
                        }
                    });
                }
            }
        });

    };

    var checkForDisallowedContentTwitter = function() {
        postImageList = $('.AdaptiveMedia-photoContainer.js-adaptive-photo').find('img:visible').toArray()
        postImageList.forEach(function(img) {
            if (!$(img).hasClass('dont-hide-sentiment')) {
                isNSFW(img.src, function(output) {
                    console.log(output)
                    if (output.result > 0.25) {
                        $(img).remove()
                    } else {
                        $(img).addClass('dont-hide-sentiment');
                    }
                })
            }
        })
    }

    var microsoftSentimentAnalysis = function(content) {
        var Inputdata = {
            "documents": [{
                "language": "en",
                "id": "string",
                "text": content.innerText
            }]
        }


        $.ajax({
                url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment?",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "a8d7c1ca87d4433d9bcec1aa74642f4b");
                },
                type: "POST",
                data: JSON.stringify(Inputdata),
            })
            .done(function(data) {
                if (!$(content).hasClass('dont-hide-sentiment')) {
                    console.log(data['documents'][0]['score'])
                    if (data['documents'][0]['score'] < 0.50) {
                        console.log(content.innerText)
                        $(content).remove()
                        console.log("removed paragraph")
                    } else {
                        $(content).addClass('dont-hide-sentiment')
                        console.log("Added to dont-hide class")
                    }
                }
            })
            .fail(function() {});
    };

    var microsoftVisionTags = function(imageUrl, callback) {
        var Inputdata = {
            "url": imageUrl
        }


        $.ajax({
                url: "https://api.projectoxford.ai/vision/v1.0/tag?",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "a04b26d206e2482083db92c60b3b818a");
                },
                type: "POST",
                data: JSON.stringify(Inputdata),
            })
            .done(callback)
            .fail(function() {});
    };
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
                        checkForDisallowedContent();
                        var photoList = $('._4-u2._24on._5t27._4-u8').find('img').toArray();
                        photoList.forEach(function(img) {
                            if (!$(img).hasClass('dont-hide-image-nsfw')) {
                                isNSFW(img.src, function(output) {
                                    console.log(output);
                                    if (output.result > 0.25) {
                                        $(img).remove();
                                    } else {
                                        $(img).addClass('dont-hide-image-nsfw');
                                    }
                                })
                            }
                        });
                    }
                    if (optionNegative) {
                        console.log('removing negative content');
                        var posts = $('.userContentWrapper._5pcr:visible').find('p').toArray();
                        posts.forEach(function(paragraph) {
                            microsoftSentimentAnalysis(paragraph);
                        })
                    }

                    if (avoidTags.length > 0) {
                        // Text
                        var textPosts = $('.userContentWrapper._5pcr:visible').find('p').toArray();
                        textPosts.forEach(function(paragraph) {
                            if(!$(paragraph).hasClass('dont-hide-tags-text')) {
                                var text = paragraph.innerText.toLowerCase();
                                var words = text.split(' ');
                                var isPresent = false;
                                words.every(function(word) {
                                    if(avoidTags.indexOf(word) !== -1) {
                                        isPresent = true;
                                        return false;
                                    }
                                });
                                if(!isPresent) {
                                    $(paragraph).addClass('dont-hide-tags-text');
                                } else {
                                    $(paragraph).remove();
                                }
                            } else {
                                return false;
                            }
                        });

                        // Images + Videos
                        var posts = $('.userContentWrapper._5pcr:visible').find('._1dwg._1w_m');
                        console.log(posts.length);
                        var postsArray = posts.toArray();
                        postsArray.forEach(function(post) {
                            var fbPhotos = $(post).find('a._4-eo');
                            var videos = $(post).find('img._3chq');
                            var linkImage = $(post).find('._6l-.__c_').find('img');
                            if (fbPhotos.length > 0) {
                                var link = $(fbPhotos[0]).find('img').attr('src');
                                if (!$(post).hasClass('dont-hide-tags-image')) {
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
                                                $(post).addClass('dont-hide-tags-image');
                                            }
                                        });
                                    });
                                }
                            }
                            if (linkImage.length > 0) {
                                var link = linkImage[0].src;
                                if (!$(post).hasClass('dont-hide-tags-image')) {
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
                                                $(post).addClass('dont-hide-tags-image');
                                            }
                                        });
                                    });
                                }
                            }
                            if (videos.length > 0) {
                                var link = videos[0].src;
                                if (!$(post).hasClass('dont-hide-tags-image')) {
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
                                                $(post).addClass('dont-hide-tags-image');
                                            }
                                        });
                                    });
                                }
                            }
                        });
                        var photoList = $('._4-u2._24on._5t27._4-u8').find('img').toArray();
                        photoList.forEach(function(img) {
                            if (!$(img).hasClass('dont-hide-tags-image')) {
                                microsoftVisionTags(img.src, function(data) {
                                    data['tags'].every(function(tag) {
                                        if (avoidTags.indexOf(tag.name) != -1 && tag.confidence > 0.5) {
                                            console.log(tag.name);
                                            $(img).remove();
                                            return false;
                                        } else {
                                            console.log(tag.name);
                                            console.log("The Tag has to be printed")
                                            $(img).addClass('dont-hide-tags-image');
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            } else if (window.location.href.indexOf('https://twitter.com') !== -1) {
                if (sites.length > 0 && sites.indexOf('Twitter') !== -1) {
                    console.log('running for twitter');
                    if (optionNfsw) {
                        checkForDisallowedContentTwitter();
                    }
                    if (optionNegative) {
                        var posts = $('.TweetTextSize.js-tweet-text.tweet-text').toArray();
                        posts.forEach(function(paragraph) {
                            microsoftSentimentAnalysis(paragraph)
                        });
                    }
                    if(avoidTags.length > 0) {
                        var postImageList = $('.AdaptiveMedia-photoContainer.js-adaptive-photo').find('img:visible').toArray()
                        postImageList.forEach(function(img) {
                            if (!$(img).hasClass('dont-hide-tags-image')) {
                                microsoftVisionTags(img.src, function(data) {
                                    data['tags'].every(function(tag) {
                                        if (avoidTags.indexOf(tag.name) != -1 && tag.confidence > 0.5) {
                                            console.log('removing tag ' + tag.name);
                                            $(img).remove();
                                            return false;
                                        } else {
                                            console.log(tag.name);
                                            console.log("The Tag has to be printed")
                                            $(img).addClass('dont-hide-tags-image');
                                        }
                                    });
                                })
                            }
                        })
                    }
                }
            }
        });
    };
    setInterval(initialize, 5000);
});
