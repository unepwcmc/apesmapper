
App.modules.Header = function(app) {

    app.Header = Class.extend({
        init: function() {
            var self = this;
            this.share_popup = new SharePopup();
            jQuery('.share_button').click(function(e) {
                e.preventDefault();
                self.share_popup.open();
            });
        }
    });
}
