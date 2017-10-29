angular.module('app')
    .directive('customPagination', function(mainService, $location, $state) {
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
    })
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
