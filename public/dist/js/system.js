var isCached = true;
var attachments = {};
var noCleaning = false;
var scanResult = '';
lang = /\/en/.test(location.href) ? 'en' : 'ar';

var app = angular.module('app', ['ngSanitize', , 'ngCookies', 'ui.sortable', 'md.data.table', 'ngMaterial', 'ui.router', 'pascalprecht.translate'])
    .config(["$httpProvider", "$translateProvider", "$logProvider", function($httpProvider, $translateProvider, $logProvider) {
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
    }])
    .config(["$mdDateLocaleProvider", function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment(date).format('YYYY-MM-DD, h:mm:ss') : '';
        };
    }])
    .config(["$mdThemingProvider", function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            // .primaryPalette('blue')
            .accentPalette('orange');
    }])
    .run(["$templateCache", "$rootScope", "mainService", "$location", "$state", function($templateCache, $rootScope, mainService, $location, $state) {
        $rootScope.$on('$locationChangeStart', function(evt, current, old, param) {
            currentLang = _.find(current.split('/'), function(e) { return e == 'en' }) || _.find(current.split('/'), function(e) { return e == 'ar' });
            oldLang = _.find(old.split('/'), function(e) { return e == 'en' }) || _.find(old.split('/'), function(e) { return e == 'ar' });
            if (currentLang && oldLang)
                if (currentLang != oldLang) {
                    location.reload();
                }
        });
    }]);
var test = {};
var origin = {};

try {
    angular.module('app').controller('mainCtrl', ["$scope", "$cookies", "$translate", "$state", "$filter", "$http", "$location", "$rootScope", "mainService", "$templateCache", "$timeout", "$mdSidenav", "$mdDialog", "$stateParams", function($scope, $cookies, $translate, $state, $filter, $http, $location, $rootScope, mainService, $templateCache, $timeout, $mdSidenav, $mdDialog, $stateParams) {
            $scope.lang = lang;
            $translate.use(lang);
            $scope.mainService = mainService;
            $scope.$state = $state;
            $scope.$http = $http;
            $scope.paginate = function(page) {
                $location.search().page = page;
                mainService.search($location.search());
            }

            $scope.record = {};
            $scope.changeLang = function() {
                if (lang == 'en') {
                    location.href = location.href.replace(/\/en/, '/ar');
                } else {
                    location.href = location.href.replace(/\/ar/, '/en');
                }
                location.reload();
            }

            $scope.close = function() { //this is for closing Active Dialog Modal
                $mdDialog.cancel();
            }

            $scope.delete = function(item) {
                var confirm = $mdDialog.confirm()
                    .title($filter('translate')('del_conf'))
                    .textContent($filter('translate')('u_will_rm_record'))
                    .ok($filter('translate')('agree'))
                    .cancel($filter('translate')('notAgree'));
                $mdDialog.show(confirm)
                    .then(function(res) {
                        $http.delete(mainService.get().apiUrl + item._id).
                        then(function(res) {
                            try {

                                mainService.get().data.data.splice(mainService.get().data.data.indexOf(item), 1);
                            } catch (e) {
                                console.log(e.message);
                            }
                        })
                    }, function() {});


            }

        }])

        .controller('listCtrl', ["$scope", "$http", "$mdDialog", "mainService", "$stateParams", "$state", function($scope, $http, $mdDialog, mainService, $stateParams, $state) {
            $scope.$state = $state;
            $scope.action = function(tmp,origin) {
                if (!tmp._id) {
                    add(tmp)
                } else {
                    mainService.update(tmp, origin);
                }
            }
            var add = function(record) {
                $http.post(mainService.get().apiUrl, record)
                    .then(function(res) {
                        $scope.tmp = {};
                        $scope.formName.$setPristine();
                        $scope.formName.$setUntouched();
                        if (!mainService.stillOpen) {
                            $mdDialog.hide();
                        }
                        try {
                            mainService.get().data.data.unshift(res.data.data);
                        } catch (e) {
                            console.log(e.message);
                        }

                    })
            }

            $scope.openDialog = function(evt, origin) {
                $scope.tmp = _.isObject(origin) ? angular.copy(origin) : {};
                // origin = angular.copy(origin);
                $scope.origin = origin;
                $mdDialog.show({
                    templateUrl: 'templates/dialogs/listDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    targetEvent: evt,
                    autoWrap: true,
                    scope: $scope, // same parent scope
                    preserveScope: true, // do not forget this if use parent scope
                    fullscreen: true,
                    escapeToClose: true
                });
            }
        }])



} catch (e) {
    console.log(e);
}
angular.module('app')
    .directive('customPagination', ["mainService", "$location", "$state", function(mainService, $location, $state) {
        return {
            templateUrl: 'templates/pagination.html',
            scope: {
                total: "@",
                page: '@?',
                pages: "@?",
                limit: '@?',
            },
            link: function(scope, elem, attr) {
                scope.paginate = function(page) {
                    scope.$parent.paginate(page);
                    scope.page = page;
                };

                if (!attr.page) {
                    scope.page = $location.search().page || 1;
                }
                if (!attr.limit) {

                    scope.limit = 10;
                }
                if (!attr.pages) {
                    scope.pages = Math.ceil(attr.total / scope.limit);
                }

                if (attr.total && attr.total < scope.limit && !$state.includes('screensManage')) { //for screen managements
                    elem.css('visibility', 'hidden');
                }

                scope.changePage = function(add) {
                    if (add) {
                        scope.$parent.paginate(++$location.search().page || 1);
                    } else {
                        scope.$parent.paginate(--$location.search().page);
                    }
                    scope.page = $location.search().page;
                }
            }
        }
    }])
    .directive('numbersOnly', function() {
        return {
            require: 'ngModel',
            resrict: "EA",
            link: function(scope, element, attr, ngModelCtrl) {
                element.css('font-family', 'Montserrat');

                function fromUser(text) {
                    try {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                                // ngModelCtrl.$setValidity();
                            }
                            return transformedInput;
                        }
                        return "";
                    } catch (e) {
                        console.log(e.message);
                    }
                }

                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })

    .directive('arabic', function() {
        return {
            require: 'ngModel',
            resrict: "EA",
            link: function(scope, element, attr, ngModelCtrl) {
                element.css('font-family', 'Noto Kufi Arabic');

                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^\u0600-\u06FF $ 0-9 _]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }

                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })

    .directive('english', function() {
        return {
            require: 'ngModel',
            resrict: "EA",
            link: function(scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^A-Z a-z 0-9 $ _]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }

                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })

angular.module('app')
    .filter('tel', function() {
        return function(tel) {
            if (!tel) {
                return '';
            }
            var value = tel.toString().trim().replace(/^\+/, '');
            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;
            switch (value.length) {
                case 1:
                case 2:
                case 3:
                    city = value;
                    break;
                default:
                    city = value.slice(0, 3);
                    number = value.slice(3);
            }

            if (number) {
                if (number.length > 3) {
                    number = number.slice(0, 4) + '-' + number.slice(4, 9);
                } else {
                    number = number;
                }
                return ("(" + city + ") " + number).trim();
            } else {
                return "(" + city;
            }
        };
    })

    .filter('range', function() {
        return function(input, total, reverse) {
            // total = parseInt(total);

            total = Math.ceil(total);
            for (var i = 0; i < total; i++) {
                input.push(i);
            }
            if (reverse) {
                input.reverse();
            }
            return input;
        };
    })
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }).filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        };
    })
    .filter('stringToDate', ["$filter", function($filter) {
        return function(string, format) {
            // if (angular.isUndefined(format)) {
            format = format || "YYYY-MM-DD, h:mm:ss";
            // }

            return string ? moment(string).format(format) || '--' : '--';
        }
    }])
function customDiff(copy, origin) {
    copy = angular.copy(copy);
    var propertyChanges = [];
    var objectGraphPath = [];
    // debugger;
    try {
        (function(a, b) {
            if (a.constructor == Object || (a.constructor != Number &&
                    a.constructor != String && a.constructor != Date &&
                    a.constructor != RegExp && a.constructor != Function &&
                    a.constructor != Boolean)) {
                for (var property in a) {
                    objectGraphPath.push(("." + property));
                    try {
                        if (a[property] != undefined && a[property] != null && a[property].constructor != Function) {
                            arguments.callee(a[property], b[property]);
                        }
                    } catch (e) {
                        console.log(e.message);
                    }
                    objectGraphPath.pop();
                }
                // }
            } else if (a.constructor != Function) { // filter out functions
                if (a != b) {
                    if (moment(a).isSame(moment(b), 'day')) {
                        return;
                    }
                    propertyChanges.push({
                        "key": objectGraphPath.join("").slice(1), 
                        "value": a
                    });
                }
            }
        })(copy, origin);
    } catch (e) {

    }
    return propertyChanges;
}
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: "/:lang/login",
                params: {
                    'lang': lang
                },
                views: {
                    'login': {
                        template: "<login-directive></login-directive>",
                        controller: function() {
                            // console.log('test');
                        }
                    }
                },
                resolve: {
                    data: ["authService", "$location", function(authService, $location) {
                        if (authService.isLoggedIn()) {
                            // $location.path('/'); 
                        }
                    }]
                }
            })

            .state('item', {
                url: '/:lang/item',
                params: {
                    'lang': lang
                },
                templateUrl: "templates/lists/list.html",
                resolve: {
                    data: ["$http", "mainService", "$stateParams", "$q", "$location", function($http, mainService, $stateParams, $q, $location) {
                        mainService.get().apiUrl = 'item/'
                        return $http.get('item/', { params: $location.search() })
                            .then((res) => mainService.get().data = res.data)
                    }]
                }
            })
    }])
try {
    angular.module('app')
       
        .service('mainService', ["$http", "$mdDialog", "$location", function($http, $mdDialog, $location) {
            var ref = {},
                data = {};
            ref.queryParams = $location.search();
            ref.set = function(tmp) {

                data = tmp;
            };
            ref.get = function() {
                return data;
            };
     ref.search = function(tmp) {
                // console.log(tmp);
                if (!tmp) {
                    return;
                }
                tmp1 = angular.copy(tmp);
                // if (_.size(tmp1) > 1 && tmp1.page) delete tmp1.page;
                $http.get(data.apiUrl, { params: tmp1 })
                    .then(function(res) {
                        ref.queryParams = $location.search();
                        $location.search(tmp1);
                       data.data = res.data
                    })
            }
            ref.update = function(copy, origin) {
                var updates = customDiff(copy, origin);
                var index = -1;
                if (_.isArray(updates) && _.size(updates))
                    $http.put(data.apiUrl + origin._id, { 'params': updates }).then(function(res) {
                        try {
                            index = data.data.data.findIndex(function(x) { return x._id == copy._id });
                        } catch (e) {
                            console.log(e.message);
                        }
                        if (index != -1) {
                            data.data.data[index] = copy;

                        }
                        $mdDialog.cancel();
                    }, function(res) {
                        return false;
                        // tmp.updating = true;
                    })

            }
          
            return ref;
        }])
} catch (e) {
    alert(e);
}