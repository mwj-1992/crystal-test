try {
    angular.module('app')
       
        .service('mainService', function($http, $mdDialog, $location) {
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
        })
} catch (e) {
    alert(e);
}