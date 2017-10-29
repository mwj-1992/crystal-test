var test = {};
var origin = {};

try {
    angular.module('app').controller('mainCtrl', function($scope, $cookies, $translate, $state, $filter, $http, $location, $rootScope, mainService, $templateCache, $timeout, $mdSidenav, $mdDialog, $stateParams) {
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

        })

        .controller('listCtrl', function($scope, $http, $mdDialog, mainService, $stateParams, $state) {
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
        })



} catch (e) {
    console.log(e);
}