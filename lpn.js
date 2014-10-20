/**
 * @fileOverview
 * <Description of the File>
 *
 * @version 0.2.0
 * @author Jan Wielemaker, J.Wielemaker@vu.nl
 * @requires jquery
 */

(function($) {
  var pluginName = 'LPN';

  var SWISH = "http://swish.swi-prolog.org";

  /** @lends $.fn.LPN */
  var methods = {
    _init: function(options) {
      return this.each(function() {
	var elem = $(this);
	var data = {};			/* private data */

	elem.wrap("<div class='source'></div>");
	elem.parent()
	  .append("<div class='load'></div>")
	  .on("click", "div.load", loadFromLoadButton);
	elem.data(pluginName, data);	/* store with element */
      });
    }
  }; // methods

  // <private functions>

  function loadFromLoadButton() {
    function attr(name, value) {
      content.push(" ", name, "='", value, "'");
    }

    var source = $(this).parent().find("pre.source").text();
    var query  = SWISH+"?code="+encodeURIComponent(source);
    var content = [ "<iframe " ];

    attr("class", "swish");
    attr("src", query);
    attr("width", (window.innerWidth   * 0.9)+"px");
    attr("height", (window.innerHeight * 0.8)+"px");

    content.push("></iframe>");

    modal.open({ content: content.join("")
               });
  }

  /**
   * <Class description>
   *
   * @class LPN
   * @tutorial jquery-doc
   * @memberOf $.fn
   * @param {String|Object} [method] Either a method name or the jQuery
   * plugin initialization object.
   * @param [...] Zero or more arguments passed to the jQuery `method`
   */

  $.fn.LPN = function(method) {
    if ( methods[method] ) {
      return methods[method]
	.apply(this, Array.prototype.slice.call(arguments, 1));
    } else if ( typeof method === 'object' || !method ) {
      return methods._init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
    }
  };
}(jQuery));


		 /*******************************
		 *	    CHEAP MODAL		*
		 *******************************/

var modal = (function() {
  var method = {},
  $overlay,
  $modal,
  $content,
  $close;

				// Center the modal in the viewport
  method.center = function () {
    var top, left;

    top = Math.max(window.innerHeight - $modal.outerHeight(), 0) / 2;
    left = Math.max(window.innerWidth - $modal.outerWidth(), 0) / 2;

    $modal.css({ top:top + $(window).scrollTop(),
                 left:left + $(window).scrollLeft()
               });
  };

				// Open the modal
  method.open = function (settings) {
    $content.empty().append(settings.content);

    $modal.css({ width: settings.width || 'auto',
                 height: settings.height || 'auto'
	       });

    method.center();
    $(window).bind('resize.modal', method.center);
    $modal.show();
    $overlay.show();
  };

				// Close the modal
  method.close = function () {
    $modal.hide();
    $overlay.hide();
    $content.empty();
    $(window).unbind('resize.modal');
  };

				// Generate the HTML and add it to the document
  $overlay = $('<div id="overlay"></div>');
  $modal = $('<div id="modal"></div>');
  $content = $('<div id="content"></div>');
  $close = $('<a id="close" href="#">close</a>');

  $modal.hide();
  $overlay.hide();
  $modal.append($content, $close);

  $(document).ready(function() {
    $('body').append($overlay, $modal);
  });

  $close.click(function(e) {
    e.preventDefault();
    method.close();
  });

  return method;

}());
