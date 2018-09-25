app.directive('loading', function() {
    return {
        restrict: 'E',
        scope: {
            color: '@',
            margin: '@'
        },
        template: "<div style=\"text-align: center; width: 100%;\"><i class=\"fas fa-spinner fa-4x fa-pulse\" style=\"margin-bottom:15%; margin-top: {{(margin) ? margin: '0';}}%; color:{{(color && color != '') ? color : '#61a4ff'}}\"></i></div>"
    }
});