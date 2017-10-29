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