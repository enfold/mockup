/* Formautofocus pattern.
 *
 * Options:
 *    condition(string): TODO ('div.error')
 *    target(string): TODO ("div.error :input:not(.formTabs):visible:first')
 *    always(string): TODO (:input:not(.formTabs):visible:first')
 *
 * Documentation:
 *    # TODO
 *
 * Example: example-1
 *
 */


define([
  'jquery',
  'mockup-patterns-base'
], function($, Base, undefined) {
  'use strict';

  var FormAutoFocus = Base.extend({
    name: 'formautofocus',
    defaults: {
      condition: 'div.error',
      target: 'div.error :input:not(.formTabs):visible:first',
      always: ':input:not(.formTabs):visible:first'
    },
    init: function() {
      var self = this;
      if ($(self.options.condition, self.$el).size() !== 0) {
        $(self.options.target, self.$el).focus();
      } else {
        $(self.options.always, self.$el).focus();
      }

    }
  });

  return FormAutoFocus;

});
