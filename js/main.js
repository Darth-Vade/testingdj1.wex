'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$filter', '$sce', '$window', 'webServices', '$rootScope', 'isMobile', '$state', '$timeout',
        function($scope, $filter, $sce, $window, webServices, $rootScope, isMobile, $state, $timeout) {
            $scope.thisyear = new Date().getFullYear();
            //$rootScope.fmcities = angular.copy(app.fmcities);
            $rootScope.screenWidth = window.innerWidth;
            $rootScope.IMGURL = app.imageurl;
            $rootScope.rjprofiles = [];
            $rootScope.banners = [];
            $rootScope.loading = true;
            $rootScope.iscitychanged = false;
            $rootScope.isfirstplaydone = false;
            $rootScope.city = '';
            $rootScope.marquee = 'No Programs Listed Yet for Today';
            $rootScope.eventgap = 10000;
            $rootScope.nowplaying = {};
            $rootScope.isfirstplaydone

            /*if (localStorage.selectedcity) {
                $rootScope.city = localStorage.selectedcity;
            }*/

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            }

            $(window).resize(function() {
                $rootScope.screenWidth = window.innerWidth;
                $rootScope.setSliderConfig();
            });

            $rootScope.setSliderConfig = function() {
                $rootScope.slickmainConfig = {
                    enabled: true,
                    autoplay: true,
                    draggable: true,
                    autoplaySpeed: 3000,
                    dots: true,
                    infinite: true,
                    autoplaySpeed: 2000,
                    fade: true,
                    cssEase: 'linear',
                };
                if (!isMobile.phone) {
                    if (($rootScope.screenWidth >= 760) && ($rootScope.screenWidth < 959)) {
                        $rootScope.slidecount = 2;
                    } else if (($rootScope.screenWidth >= 960) && ($rootScope.screenWidth < 1151)) {
                        $rootScope.slidecount = 3;
                    } else if (($rootScope.screenWidth > 1151) && ($rootScope.screenWidth < 1320)) {
                        $rootScope.slidecount = 3;
                    } else if (($rootScope.screenWidth >= 1320) && ($rootScope.screenWidth < 1500)) {
                        $rootScope.slidecount = 3;
                    } else {
                        $rootScope.slidecount = 4;
                    }
                } else {
                    $rootScope.slidecount = 1;
                }

                $rootScope.slickConfig = {
                    enabled: true,
                    autoplay: true,
                    draggable: true,
                    autoplaySpeed: 3000,
                    dots: false,
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 2000,
                    slidesToShow: $rootScope.slidecount,
                    slidesToScroll: 1,
                    navigation: true
                };

                if (!$rootScope.iscitychanged) {
                    angular.element(document).ready(function() {
                        $timeout(function() {
                            $rootScope.setupPlayer();
                        }, 2000);
                    });
                } else {
                    /*$rootScope.audiosrc = $sce.trustAsResourceUrl('http://s6.voscast.com:7108/stream/1/');*/
                    var myAudio = document.getElementById("audio-player");
                    myAudio.play();
                }

            }

            $rootScope.openLink = function(link) {
                window.open(link, '_blank');
            }

            $rootScope.getFMInfo = function() {
                $rootScope.is_mobile = false;
                webServices.get('fminfo').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.fminfo = getData.data;
                        $rootScope.fminfo.socialcount = 0;
                        
                        if($rootScope.fminfo.facebook_status){
                            $rootScope.fminfo.socialcount++;
                        }if($rootScope.fminfo.email_status){
                            $rootScope.fminfo.socialcount++;
                        }if($rootScope.fminfo.whatsapp_status){
                            $rootScope.fminfo.socialcount++;
                        }if($rootScope.fminfo.youtube_status){
                            $rootScope.fminfo.socialcount++;
                        }
                        if (isMobile.phone) {
                            $rootScope.is_mobile = true;
                            if(isMobile.android.device){
                                //window.location.href = $rootScope.fminfo.applink;
                            }
                        }
                        $rootScope.audiosrc = $sce.trustAsResourceUrl(getData.data.streaming_url_high);
                        console.log($rootScope.audiosrc)
                        $rootScope.getBanners();
                    }
                });
            }

            $rootScope.getBanners = function() {
                webServices.get('banner/1').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.banners = getData.data;
                        $rootScope.getPrograms();
                    }
                });
            };

            $rootScope.getPrograms = function() {
                webServices.get('todayprogram').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.programs = getData.data;
                        if ($rootScope.programs.length > 0) {
                            $rootScope.marquee = '';
                            angular.forEach($rootScope.programs, function(schedule, key) {
                                $rootScope.marquee += schedule.program + '( ' + schedule.start_time + ' - ' + schedule.end_time + ' )';
                                if(schedule.rjinfo != null){
                                    $rootScope.marquee += '- RJ ' + schedule.rjinfo.nickname
                                }if ($rootScope.programs.length - 1 > key) {
                                    $rootScope.marquee += ', ';
                                }
                            });
                        }
                        $rootScope.getRjs();
                    }
                });
            };

            /*$rootScope.changeCity = function(city) {
                if ($rootScope.city != city) {
                    $rootScope.loading = true;
                    localStorage.selectedcity = city;
                    location.reload(true);
                }

            }*/

            $rootScope.checktime = function() {
                $rootScope.miniutes = new Date().getMinutes();
                if ($rootScope.miniutes % 5 === 0 || !$rootScope.isfirstplaydone) {
                    $rootScope.getnowplaying()
                }

                $timeout($rootScope.checktime, $rootScope.eventgap);
            }

            $rootScope.getnowplaying = function() {
                webServices.get('nowplaying').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.nowplaying = getData.data;
                    }
                });
            }


            /*if ($rootScope.city == '') {
                $timeout(function() {
                    $('#cityModal').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }, 1000);

            } else {
                $rootScope.getFMInfo();
            }

            $rootScope.selectcity = function(city) {
                if (city) {
                    localStorage.selectedcity = city;
                    $('#cityModal').modal('hide');
                    location.reload(true);
                }
            }*/

            $rootScope.setupPlayer = function() {
                $rootScope.checktime();
                var mediaElements = document.querySelectorAll('audio'),
                    total = mediaElements.length;
                for (var i = 0; i < total; i++) {
                    new MediaElementPlayer(mediaElements[i], {
                        pluginPath: 'libs/mediaplayer/',
                        shimScriptAccess: 'always',
                        success: function(media) {
                            var target = document.body.querySelectorAll('.player'),
                                targetTotal = target.length;
                            for (var j = 0; j < targetTotal; j++) {
                                target[j].style.visibility = 'visible';
                            }

                            media.addEventListener('canplay', function() {
                                if (!$rootScope.isfirstplaydone) {
                                    //console.log('first play done');
                                    $rootScope.isfirstplaydone = true;
                                    media.play();
                                }
                            }, false);

                            media.addEventListener('pause', function() {
                                var time = new Date().getTime();
                                media.setSrc($rootScope.audiosrc + '?nocache=' + time);
                                media.load();
                                media.pause();
                                //console.log('paused');
                            }, true);
                            media.addEventListener('play', function(e) {
                                //console.log('played');
                            }, true);
                        }
                    });
                }
            }

            $rootScope.getFMInfo();

        }
    ]);