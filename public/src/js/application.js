var isCached = true;
var attachments = {};
var noCleaning = false;
var scanResult = '';
lang = /\/en/.test(location.href) ? 'en' : 'ar';

var app = angular.module('app', ['ngSanitize', , 'ngCookies', 'ui.sortable', 'md.data.table', 'ngMaterial', 'ui.router', 'pascalprecht.translate'])
    .config(function($httpProvider, $translateProvider, $logProvider) {
        var interceptor = function($q, $rootScope, $injector, $location, $filter, $cookies) {
            var canceller = $q.defer();
            return {
                request: function(config) {
                    
                    return config;
                },
                requestError: function(config) {
                    return config;
                },
                response: function(res) {
                    if (["POST", "PUT", "DELETE"].indexOf(res.config.method) != -1) {
                        $injector.get("$mdToast").show($injector.get("$mdToast").simple().textContent(res.data.message).position('top'));
                    }
                    return res;
                },
                responseError: function(res) {
                    // if (["POST", "PUT", "DELETE"].indexOf(res.config.method) != -1) {}
                    if (res.status == 403) {}
                    if (res.status == 500) {
                        return $q.reject('home');
                    }

                    if (res.status == 401) {
                        $injector.get("$state").transitionTo('login', { lang: lang }, { notify: false });
                    }
                    if (res.status == 503) {
                        $injector.get("$state").transitionTo('underConstruction');
                    }
                    if (res.data && _.isArray(res.data)) {
                        _.each(res.data, function(elem) {
                            msg = _.isObject(elem.msg) ? '<span class="md-highlight">(' + $injector.get("$filter")('translate')(elem.param) + ')</span>' + elem.msg.message : elem.msg;
                            // template = '<md-toast>'+_.isObject(elem.msg) ? ($injector.get("$filter")('translate')(elem.param) + '<span class="md-highlight">(' + elem.msg.message + ')</span>') : elem.msg + '</md-toast>';
                            $injector.get("$mdToast").show({
                                    hideDelay: 10,
                                    position: 'top right',
                                    template: '<md-toast>' + msg + '</md-toast>'
                                }
                                // $injector.get("$mdToast").simple().textContent(msg).position('top')

                            );
                        })
                    }
                    if (res.data && res.data.message)
                        $injector.get("$mdToast").show($injector.get("$mdToast").simple().textContent(res.data.message).position('top'));
                    return $q.reject(res);
                }
            }
        }
        interceptor.$inject = ["$q", "$rootScope", "$injector", "$location", "$filter", "$cookies"];
        $httpProvider.interceptors.push(interceptor);
        $translateProvider.useUrlLoader('dist/Translations/' + lang + '.min.json');
        $translateProvider.preferredLanguage(lang);
    })
    .config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment(date).format('YYYY-MM-DD, h:mm:ss') : '';
        };
    })
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            // .primaryPalette('blue')
            .accentPalette('orange');
    })
    .run(function($templateCache, $rootScope, mainService, $location, $state) {
        $rootScope.$on('$locationChangeStart', function(evt, current, old, param) {
            currentLang = _.find(current.split('/'), function(e) { return e == 'en' }) || _.find(current.split('/'), function(e) { return e == 'ar' });
            oldLang = _.find(old.split('/'), function(e) { return e == 'en' }) || _.find(old.split('/'), function(e) { return e == 'ar' });
            if (currentLang && oldLang)
                if (currentLang != oldLang) {
                    location.reload();
                }
        });
    });