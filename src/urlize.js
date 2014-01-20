angular.module('ngTools').factory('urlize',['$location', '$route', '$log', function ($location, $route, $log) {
    function urlize(scope, prop){
        if($route.current.$$route.reloadOnSearch !== false){
            $log.error('Current route reloads on search, reloadOnSearch should be set to false');
        }

        function updateFromLocation() {
            var inLoc = $location.search()[prop];
            if (inLoc) {
                if (angular.isObject(inLoc)) {
                    inLoc = JSON.parse(inLoc);
                }
                scope[prop] = inLoc;
            }
        }

        updateFromLocation();
        
        scope.$watch(prop, function (nV, oV) {
            if (nV) {
                if (angular.isObject(nV)) {
                    nV = JSON.stringify(nV);
                }
                $location.search(prop, nV);
            }
        });

        scope.$on('$routeUpdate', updateFromLocation);
    }
    return urlize;
}]);