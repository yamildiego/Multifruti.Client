app.factory('ModalService', function Service() {
    var modals = [];
    var service = {};

    service.Add = Add;
    service.Remove = Remove;
    service.Open = Open;
    service.Close = Close;

    return service;

    function Add(modal) {
        modals.push(modal);
    }

    function Remove(id) {
        var modalToRemove = _.findWhere(modals, { id: id });
        modals = _.without(modals, modalToRemove);
    }

    function Open(id) {
        var modal = _.findWhere(modals, { id: id });
        modal.open();
    }

    function Close(id) {
        var modal = _.findWhere(modals, { id: id });
        modal.close();
    }
});