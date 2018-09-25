app.directive('modal', function Directive(ModalService) {
    return {
        link: function(scope, element, attrs) {
            if (!attrs.id) {
                console.error('modal must have an id');
                return;
            }

            element.appendTo('body');

            element.on('click', function(e) {
                var target = $(e.target);
                if (!target.closest('.modal-body').length) {
                    scope.$evalAsync(Close);
                }
            });

            var modal = {
                id: attrs.id,
                open: Open,
                close: Close
            };
            ModalService.Add(modal);

            scope.$on('$destroy', function() {
                ModalService.Remove(attrs.id);
                element.remove();
            });

            function Open() {
                element.show();
                $('body').addClass('modal-open');
            }

            function Close() {
                element.hide();
                $('body').removeClass('modal-open');
            }
        }
    };
});