// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

Parse.Cloud.define("SendPush", function(request, response) {

   

    Parse.Push.send({

        channels: [""],
        data: {

            alert: "Your trap: '"  + "' was just triggered!"
        }
    }, {
        success: function() {
            console.log('##### PUSH OK');
            response.success("Push Sent");
        },
        error: function(error) {
            console.log('##### PUSH ERROR: ' + error.message);
            response.error("Push Failed");
        },
        userMasterKey: true

    });
});
Parse.Cloud.define("new", function (request, response) {
    Parse.Cloud.useMasterKey();

    //requset lay link mp3
    Parse.Cloud.httpRequest({
        url: 'http://www.oxfordlearnersdictionaries.com/search/english/direct/?q=' + encodeURIComponent(request.params.Voca),
        followRedirects: true,
        success: function (httpOxfor) {
            //tao link mp3
            var responseString = httpOxfor.text;
            responseString = responseString.substring(responseString.indexOf(".mp3") + 5);
            responseString = responseString.substring(responseString.indexOf("mp3=") + 5);
            responseString = responseString.substring(0, responseString.indexOf(".mp3") + 4);
            Parse.Cloud.httpRequest({
                url: responseString,
                method: 'GET',
                headers: {

                    'Content-Type': 'audio/mpeg'
                },
                followRedirects: true,
                success: function (httpResponse) {
                    var parseFile = new Parse.File("mp3", { base64: httpResponse.buffer.toString('base64', 0, httpResponse.buffer.length) });

                    // parseFile.save().then(function() {
                    //    callback(parseFile, null);
                    // }, function(error) {
                    //    console.error('Downloader fails to save parse file.');
                    // });

                    parseFile.save({
                        success: function () {
                            var GameScore = Parse.Object.extend("History");
                            var gameScore = new GameScore();

                            gameScore.set("Voca", request.params.Voca);
                            gameScore.set("Mean", request.params.Mean);
                            gameScore.set("DauNhan", request.params.DauNhan);
                            gameScore.set("User", request.params.User);
                            gameScore.set("Check", false);
                            gameScore.set("STT", request.params.Stt);
                            gameScore.set("Listen", parseFile);
                            gameScore.save(null, {
                                success: function (gameScore) {
                                    // Execute any logic that should take place after the object is saved.
                                    response.success(gameScore);
                                },
                                error: function (gameScore, error) {
                                    // Execute any logic that should take place if the save fails.
                                    // error is a Parse.Error with an error code and message.
                                    response.error('Failed to create new object, with error code: ' + error.message);
                                }
                            });



                        }, error: function () {
                            response.error(null, 'Downloader fails to save parse file.');
                        }
                    });
                },
                error: function (httpResponse) {
                    //ko file mp3
                    var GameScore = Parse.Object.extend("History");
                    var gameScore = new GameScore();

                    gameScore.set("Voca", request.params.Voca);
                    gameScore.set("Mean", request.params.Mean);
                    gameScore.set("DauNhan", request.params.DauNhan);
                    gameScore.set("User", request.params.User);
                    gameScore.set("Check", false);
                    gameScore.set("STT", request.params.Stt);

                    gameScore.save(null, {
                        success: function (gameScore) {
                            // Execute any logic that should take place after the object is saved.
                            response.success(gameScore);
                        },
                        error: function (gameScore, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            response.error('Failed to create new object, with error code: ' + error.message);
                        }
                    });



                }
            });

        },
        error: function (httpResponse) {
            response.error('Error getting image');
        }
        //end
    });
});
//-- tạo database


Parse.Cloud.define("ListMp3", function (request, response) {
    Parse.Cloud.useMasterKey();
    var dem = 0;
    var count = 0;
    var ListVoca = new Array();
    var List = new Array();
    var ListInt = new Array();
    ListVoca = request.params.listvoca;
    var kq, test;
    var promises = [];
    var promises2 = [];
    var promises3 = [];
    var promises4 = [];
    var promises5 = [];
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }


    for (var i = ListVoca.length - 1; i >= 0 ; i--) {

        var vocabulary = ListVoca[i];

        var pro1 = (Parse.Cloud.httpRequest({
            url: 'http://www.oxfordlearnersdictionaries.com/search/english/direct/?q=' + encodeURIComponent(ListVoca[i].split("#")[0]),
            followRedirects: true
        }).then(function (httpResponse) {

            kq = "1";
            var responseString = httpResponse.text;
            responseString = responseString.substring(responseString.indexOf(".mp3") + 5);
            responseString = responseString.substring(responseString.indexOf("mp3=") + 5);
            responseString = responseString.substring(0, responseString.indexOf(".mp3") + 4);

            List.push(responseString);

            if (responseString.indexOf(".mp3") != -1) {
                ListInt.push(1);
                ++count;
                //-------
                var pro2 = (Parse.Cloud.httpRequest({
                    url: responseString,
                    method: 'GET',
                    headers: {

                        'Content-Type': 'audio/mpeg'
                    },
                    followRedirects: true,
                }).then(function (httpResponseimg) {
                    ListInt.push(2);
                    List.push("file");
                    var parseFile = new Parse.File("mp3", { base64: httpResponseimg.buffer.toString('base64', 0, httpResponseimg.buffer.length) });

                    // parseFile.save().then(function() {
                    //    callback(parseFile, null);
                    // }, function(error) {
                    //    console.error('Downloader fails to save parse file.');
                    // });

                    var pro3 = (parseFile.save({
                    }).then(function () {
                        List.push("5555");
                        kq = "6";
                        ListInt.push(3);
                        var GameScore = Parse.Object.extend("History")
                        var query = new Parse.Query(GameScore);
                        //var id=new String(ListVoca[i]);
                        List.push(vocabulary);
                        query.equalTo("objectId", vocabulary.split("#")[1]);

                        //--------
                        var pro4 = (query.find().then(function (resut) {
                            if (resut[0] != null) {
                                ListInt.push(4);
                                test = parseFile;
                                List.push(vocabulary + "6666");
                                resut[0].set("User", "AAAAAAAAAAAAAAAAAAAAAa");
                                resut[0].set("Listen", parseFile);

                                //-----------



                                promises5.push(resut[0].save().then(function () {
                                    ListInt.push(5);
                                    dem++;
                                    List.push("7777");
                                }, function (error) {
                                    // The file either could not be read, or could not be saved to Parse.
                                }));
                                return Parse.Promise.when(promises5);					//---------
                            }
                        }, function (httpResponse) {

                        }));
                        promises2.push(pro2);
                        return Parse.Promise.when(promises4);
                        //--------
                    }, function (error) {

                    }
                ));
                    promises3.push(pro3);
                    return Parse.Promise.when(promises3);

                }, function (httpResponse) {

                }));
                promises2.push(pro2);
                return Parse.Promise.when(promises2);
                //-----------
            } else {
                ++count;
            }


        }, function (httpResponse) {
            kq = "9";
            sleep(1000);
            response.error("3");
        }));

        promises.push(pro1);
    }
    //end for 	response.success(ListInt);
    Parse.Promise.when(promises).then(function (results) {
        response.success(ListInt);

    }, function (err) {

    });

});



Parse.Cloud.define("rajouteNews", function (request, response) {
    Parse.Cloud.httpRequest({
        url: 'myUrl'
    }).then(function (httpResponse) {
        var promises = [];
        var NewsClass = Parse.Object.extend("news");
        for (var i = 0; i < 10; ++i) {
            var maNews = new NewsClass();
            maNews.set("link", myLink[i]); // "Other informations"
            maNews.set("imgLink", myImgLink[i]);
            maNews.set("title", myTitle[i]);

            var maNewsPromise = Parse.Cloud.httpRequest({
                url: $('img').attr('src'),
                method: 'GET',
            }).then(function (httpResponse) {
                var imgFile = new Parse.File("photo.jpg", {
                    base64: httpResponse.buffer.toString('base64')
                });
                maNews.set("image", imgFile); // The picture
                return maNews.save();
            });
            promises.push(maNewsPromise);
        }
        return Parse.Promise.when(promises)
    }).then(function (bla, result) {
        // this function is call when `Parse.Promise.when(promises)` is done,
        //I can't figure out why you take two params.
        response.success("Job done");
    }, function (error) {
        response.error(error);
    });
});

Parse.Cloud.define("Demo", function (request, response) {
    var promises = [];
    var results = new Array();
    results = request.params.listvoca;
    for (var ri = results.length; ri > 0 ; ri--) {

        var promise = Parse.Cloud.httpRequest({
            url: 'http://www.oxfordlearnersdictionaries.com/search/english/direct/?q=' + encodeURIComponent(vocabulary.split("#")[0]),
            followRedirects: true
        }).then(function (httpResponse) {
            var Post = Parse.Object.extend("Post");
            var resultList = httpResponse.data.data.items;
            var savePromises = [];
            for (var hRi = resultList.length; hRi > 0 ; hRi--) {
                // not sure what "post" is in this context?
                savePromises.push(post.save());
                savePromises.push(results[ri].save());

            }
            // wait for all saves to finish
            return Parse.Promise.when(savePromises);
        });
        promises.push(promise);
    }

    return Parse.Promise.when(promises);
});





Parse.Cloud.define("asd", function (request, response) {
    Parse.Cloud.httpRequest({
        url: 'myUrl'
    }).then(function (httpResponse) {
        var promises = [];
        var NewsClass = Parse.Object.extend("news");
        for (var i = 0; i < 10; ++i) {
            var maNews = new NewsClass();
            maNews.set("link", myLink[i]); // "Other informations"
            maNews.set("imgLink", myImgLink[i]);
            maNews.set("title", myTitle[i]);

            var maNewsPromise = Parse.Cloud.httpRequest({
                url: $('img').attr('src'),
                method: 'GET',
            }).then(function (httpResponse) {
                var imgFile = new Parse.File("photo.jpg", {
                    base64: httpResponse.buffer.toString('base64')
                });
                maNews.set("image", imgFile); // The picture
                return maNews.save();
            });
            promises.push(maNewsPromise);
        }
        return Parse.Promise.when(promises)
    }).then(function (bla, result) {
        // this function is call when `Parse.Promise.when(promises)` is done,
        //I can't figure out why you take two params.
        response.success("Job done");
    }, function (error) {
        response.error(error);
    });
});

Parse.Cloud.define("getPage", function (request, response) {
    var voca = request.params.voca;
  
    Parse.Cloud.httpRequest({
        url: 'http://mobile.coviet.vn/tratu.aspx?k='+voca.split("#")[0]+'&t=ALL',
        headers: {
        
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0',
        
        }
    }).then(function (httpResponse) {
        // success
        var html = httpResponse.text;

        var pos1 = html.indexOf("class='fb' >");

        html =html.substring(pos1+12);
        var pos2 = html.lastIndexOf("</span><br/></li>");
        html = html.substring(0, pos2);
       // html = html.replace("<br/></li></ul><div class='pd1 p10t'><span class='fb' >", "");
        var htmltemp = html;
        var pos3 = html.indexOf("</div></div><div class=\"tar vdt\"><a class=\"vdt fr\" href=\"#go_to_top\"");
        if (pos3 != -1) {
            htmltemp = htmltemp.substring(pos3);
            pos3 = htmltemp.indexOf("class='fb' >");
            htmltemp = htmltemp.substring(0, pos3);
            html = html.replace(htmltemp, "<");
        }
        var index=0;
        var index2=0;
        while(index!=-1)
        {
            var html2=html;
            index = html2.indexOf("</span><br/></li></ul></");
            if(index==-1)
                break;
            html2= html2.substring(index);
            index2 = html2.indexOf("class='fb' >");
            if (index2 == -1)
                break;
            html2= html2.substring(0,index2+13);
            html =html.replace(html2,"");
        }
        index = 0;
        index2 = 0;
        while (index != -1) {
            var html2 = html;
            index = html2.indexOf("<br/></div></div><div id=");
            if (index == -1)
                break;
            html2 = html2.substring(index);
            index2 = html2.indexOf("class='fb' >");
            if (index2 == -1)
                break;
            html2 = html2.substring(0, index2 + 13);

            html = html.replace(html2, "");
        }

        index = 0;
        index2 = 0;
        while (index != -1) {
            var html2 = html;
            index = html2.indexOf("<a href=");
            if (index == -1)
                break;
            html2 = html2.substring(index);
            index2 = html2.indexOf("\">");
            if (index2 == -1)
                break;
            html2 = html2.substring(0, index2 + 2);

            html = html.replace(html2, "");
        }
     
        //xử lý theo chuyên ngành
        if (voca.split("#")[1] == "TT")
        {
            index = html.indexOf("class='fb' >Tin");
            if(index!=-1)// có tồn tại toán tin
            {
                html = html.substring(index + 12)
                index2 = html.indexOf("<span class='fb'");
                if (index2 != -1)
                html = html.substring(0, index2);
            }
            else
            {
                index = html.indexOf("class='fb' >To");
                if(index!=-1)// có tồn tại toán
                {
                    html = html.substring(index + 12)
                    index2 = html.indexOf("<span class='fb'");
                    if (index2 != -1)
                    html = html.substring(0, index2);
                }
                else
                {
                    index = html.indexOf("class='fb' >V");
                    if (index != -1)// có tồn tại vật lý
                    {
                        html = html.substring(index + 12)
                        index2 = html.indexOf("<span class='fb'");
                        if (index2 != -1)
                        html = html.substring(0, index2);
                    }
                    else {
                        index = html.indexOf("class='fb' >K");
                        if (index != -1)// có tồn tại ky thuật
                        {
                            html = html.substring(index + 12)
                            index2 = html.indexOf("<span class='fb'");
                            if (index2 != -1)
                            html = html.substring(0, index2);
                        }
                    }
                }
            }
        }
        else if (voca.split("#")[1] == "KT")
        {
            index = html.indexOf("class='fb' >Kinh t")
            if(index!=-1)
            {
                html = html.substring(index + 12)
                index2 = html.indexOf("<span class='fb'");
                if (index2 != -1)
                html = html.substring(0, index2);
            }
        }
        if(html!="")
        html = html + "<span class='fb'";
        response.success(html);
    }, function (httpResponse) {
        // error
        response.error('Request failed with response code ' + httpResponse.headers);
    });
});

Parse.Cloud.define("setMp3", function (request, response) {
    Parse.Cloud.useMasterKey();
    
    //requset lay link mp3
    Parse.Cloud.httpRequest({
        url: 'http://www.oxfordlearnersdictionaries.com/search/english/direct/?q=' + encodeURIComponent(request.params.data.split("#")[0]),
        followRedirects: true,
        success: function (httpOxfor) {
            //tao link mp3
            var responseString = httpOxfor.text;
            responseString = responseString.substring(responseString.indexOf(".mp3") + 5);
            responseString = responseString.substring(responseString.indexOf("mp3=") + 5);
            responseString = responseString.substring(0, responseString.indexOf(".mp3") + 4);
            Parse.Cloud.httpRequest({
                url: responseString,
                method: 'GET',
                headers: {

                    'Content-Type': 'audio/mpeg'
                },
                followRedirects: true,
                success: function (httpResponse) {
                    var parseFile = new Parse.File("mp3", { base64: httpResponse.buffer.toString('base64', 0, httpResponse.buffer.length) });

                    // parseFile.save().then(function() {
                    //    callback(parseFile, null);
                    // }, function(error) {
                    //    console.error('Downloader fails to save parse file.');
                    // });

                    parseFile.save({
                        success: function () {
                            var GameScore = Parse.Object.extend("History");
                            var query = new Parse.Query(GameScore);
                            query.get(request.params.data.split("#")[1], {
                                success: function (gameScore) {
                                    gameScore.set("Listen", parseFile);
                                    gameScore.save(null, {
                                        success: function (gameScore) {
                                            // Execute any logic that should take place after the object is saved.
                                            response.success(gameScore);
                                        },
                                        error: function (gameScore, error) {
                                            // Execute any logic that should take place if the save fails.
                                            // error is a Parse.Error with an error code and message.
                                            response.error('Failed to create new object, with error code: ' + error.message);
                                        }
                                    });
                                },
                                error: function (object, error) {
                                    // The object was not retrieved successfully.
                                    // error is a Parse.Error with an error code and message.
                                }
                            });



                            
                           



                        }, error: function () {
                            response.error(null, 'Downloader fails to save parse file.');
                        }
                    });
                },
                error: function (httpResponse) {
                    //ko file mp3
                   
                            response.error('Failed to create new object, with error code: ' + error.message);
 

                }
            });

        },
        error: function (httpResponse) {
            response.error('Error getting image');
        }
        //end
    });
});
