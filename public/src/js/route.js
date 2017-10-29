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
                    data: function(authService, $location) {
                        if (authService.isLoggedIn()) {
                            // $location.path('/'); 
                        }
                    }
                }
            })

            .state('item', {
                url: '/:lang/item',
                params: {
                    'lang': lang
                },
                templateUrl: "templates/lists/list.html",
                resolve: {
                    data: function($http, mainService, $stateParams, $q, $location) {
                        mainService.get().apiUrl = 'item/'
                        return $http.get('item/', { params: $location.search() })
                            .then((res) => mainService.get().data = res.data)
                    }
                }
            })
    }])