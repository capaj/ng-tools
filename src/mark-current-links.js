angular.module('ngTools').directive('markCurrentLinks', function ($route) {
    return {
        link: function (scope, el, attrs) {
            scope.$on('$locationChangeSuccess', function (ev, newUrl) {
                var links = el.find('a');
                var i = links.length;
                while(i--) {
                    var link = angular.element(links[i]);
                    var index = newUrl.indexOf(link.attr('href'));
                    if (index !== -1) {
                        link.addClass('current');
                    } else {
                        link.removeClass('current');
                    }
                }
            });
        }
    }
});