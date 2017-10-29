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
    .filter('stringToDate', function($filter) {
        return function(string, format) {
            // if (angular.isUndefined(format)) {
            format = format || "YYYY-MM-DD, h:mm:ss";
            // }

            return string ? moment(string).format(format) || '--' : '--';
        }
    })