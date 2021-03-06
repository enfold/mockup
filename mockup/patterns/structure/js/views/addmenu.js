/* global alert:true */

define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/buttongroup',
  'mockup-ui-url/views/button',
  'mockup-patterns-modal',
  'mockup-utils',
  'bootstrap-dropdown'
], function($, _, Backbone, ButtonGroup, ButtonView, Modal, utils) {
  'use strict';

  var AddMenu = ButtonGroup.extend({
    title: 'Add',
    className: 'btn-group addnew',
    events: {
    },
    initialize: function(options) {
      var self = this;
      ButtonGroup.prototype.initialize.apply(self, [options]);
      self.app.on('context-info-loaded', function(data) {
        self.$items.empty();
        _.each(data.addButtons, function(item) {
          var view = new ButtonView({
            id: item.id,
            title: item.title,
            url: item.action
          });
          view.render();
          var wrap = $('<li/>');
          // As we are reusing the whole ButtonView for render the add content
          // list we should remove entirely the "btn btn-default" classes.
          // This element in fact, should not have any class at all, so we
          // remove the attribute completely
          view.$el.removeAttr('class');

          wrap.append(view.el);
          self.$items.append(wrap);
          view.$el.click(function(e) {
            self.buttonClicked.apply(self, [e, view]);
            return false;
          });
        });
      });
    },
    buttonClicked: function(e, button) {
      var self = this;
      e.preventDefault();
      self.app.loading.show();

      $.ajax({
        url: button.url,
        type: 'POST',
        data: {
          '_authenticator': $('[name="_authenticator"]').val(),
        },
        success: function(response) {
          self.app.loading.hide();
          var modal = new Modal(self.$el, {
            html: utils.parseBodyTag(response),
            content: '#content',
            width: '80%',
            backdropOptions: {
              closeOnClick: false
            },
            automaticallyAddButtonActions: false,
            actionOptions: {
              displayInModal: false,
              reloadWindowOnClose: false
            },
            actions: {
              'input#form-buttons-save, .formControls input[name="form.button.save"]': {
                onSuccess: function(modal, response, state, xhr, form) {
                  self.app.collection.pager();
                  if (self.$items.is(':visible')) {
                    self.$dropdown.dropdown('toggle');
                  }
                  modal.hide();
                },
                onError: function() {
                  alert('error on form');
                }
              },
              'input#form-buttons-cancel, .formControls input[name="form.button.cancel"]': {
                modalFunction: 'hide'
              }
            },
          });
          modal.show();
        },
        error: function() {
          // XXX handle error
          self.app.loading.hide();
        }
      });
    },
    render: function() {
      var self = this;
      self.$el.empty();

      self.$el.append(
        '<a class="btn dropdown-toggle btn-success" data-toggle="dropdown" href="#">' +
          self.title +
          '<span class="caret"></span>' +
        '</a>' +
        '<ul class="dropdown-menu">' +
        '</ul>' +
      '</div>');

      self.$items = self.$('.dropdown-menu');
      self.$dropdown = self.$('.dropdown-toggle');
      self.$dropdown.dropdown();
      return this;
    }
  });

  return AddMenu;
});
