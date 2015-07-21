var jsZenEdit = function (textarea, title, placeholder) {
  if (!document.createElement) { return; }

  if (!textarea) { return; }

  if ((typeof(document["selection"]) == "undefined")
   && (typeof(textarea["setSelectionRange"]) == "undefined")) {
    return;
  }

  var $html = $('html');
  var self = this;

  self.textarea = $(textarea);
  self.textarea.attr('placeholder', placeholder);

  self.editor = $('<div class="zeneditor dark-theme"></div>');

  var controls = $('<div class="jstb_zenedit_controls"></div>');

  var button_toggle = $('<button class="jstb_zenedit toggle" title="Toggle Zen Mode: Ctrl + E"></button>');
  var button_theme = $('<button class="jstb_zenedit theme" title="Switch theme"></button>');
  var button_back = $('<button class="jstb_zenedit back" title="Back: ESC"></button>');
  var button_preview = $('<button class="jstb_zenedit preview" title="Preview: Ctrl + D"></button>');
  var button_help = $('<button class="jstb_zenedit help" title="Format Help: Ctrl + J"></button>');
  var button_save = $('<button class="jstb_zenedit save" title="Save: Ctrl + S"></button>');

  button_toggle.on('click', function() { 
    try { 
      if (self.editor.hasClass('zen')) {
        self.editor.trigger('leave-zen');
      } else {
        self.editor.trigger('go-zen');
      }
      self.textarea.focus();
    } catch (e) {} 
    return false; 
  });

  button_theme.on('click', function() { 
    try { 
      self.editor.toggleClass('dark-theme'); 
      self.textarea.focus();
    } catch (e) {} 
    return false; 
  });

  var helping = false;

  if (jsZenEdit.$help) {
    button_help.addClass('available');
  }
  button_help.on('click', function() { 
    jsZenEdit.$help.addClass('active');
    helping = true;
    return false; 
  });
  self.editor.on('leave-help', function () {
    helping = false;
  });

  button_save.on('click', function () {
    self.editor.closest('form').submit();
  });

  button_back.on('click', function () {
    self.editor.trigger('leave-zen');
  });

  controls.append(button_back);
  controls.append(button_toggle);
  controls.append(button_theme);
  controls.append(button_preview);
  controls.append(button_help);
  controls.append(button_save);

  self.editor.append(controls);

  self.editor.insertAfter(self.textarea);
  self.editor.prepend(self.textarea);

  self.zen = function () {
    button_toggle.trigger('click');
  };

  var zenKeyHandler = function(e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode == 69 && e.ctrlKey) {
      e.preventDefault();
      button_toggle.trigger('click');
    }
    if (keyCode == 74 && e.ctrlKey) {
      e.preventDefault();
      button_help.trigger('click');
    }
    if (keyCode == 83 && e.ctrlKey) {
      e.preventDefault();
      if (confirm('Save ?')) {
        self.textarea.blur();
        self.editor.closest('form').submit();
      }
    }
  };
  var zenESCHandler = function(e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode == 27) {
      e.preventDefault();
      if (helping) {
        jsZenEdit.$help.trigger('click');
      } else {
        self.editor.trigger('leave-zen');
      }
    }
  };

  $(document).on('keydown', zenKeyHandler);
  $(document).on('keydown', zenESCHandler);

  self.editor.on('go-zen', function () {
    jsZenEdit.help(self.editor);
    self.editor.addClass('zen');
    $html.addClass('zen');
  });
  self.editor.on('leave-zen', function () {
    self.editor.removeClass('zen');
    $html.removeClass('zen');
  });

  if ($('body').hasClass('controller-wiki')) {

    button_back.off('click');
    button_back.on('click', function () {
      if (history.length) {
        history.back();
      } else {
        self.editor.trigger('leave-zen');
      }
    });

    $(document).off('keydown', zenESCHandler);

  }

  if ($('a[accesskey=r]').length) {
    var $preview = $('#preview');
    var $anchor = $('<div id="preview-anchor"></div>').insertBefore($preview);
    var stat = 'editing';

    var togglePreview = function (e) {
      if (stat == 'editing') {
        self.editor.trigger('go-preview');
      } else {
        self.editor.trigger('leave-preview');
      }
      e.preventDefault();
    };

    button_preview.on('click', togglePreview);

    var previewKeyHandler = function(e) {
      var keyCode = e.keyCode || e.which;

      if (keyCode == 68 && e.ctrlKey) {
        togglePreview(e);
      }

      if (keyCode == 27) {
        e.preventDefault();
        if (helping) {
          jsZenEdit.$help.trigger('click');
        } else {
          if (stat == 'preview') {
            self.editor.trigger('leave-preview');
          } else {
            if (history.length) {
              history.back();
            } else {
              self.editor.trigger('leave-zen');
            }
          }
        }
      }
    };

    self.editor.on('go-zen', function () {
      jsZenEdit.editor = self.editor;
      jsZenEdit.help(self.editor);
      $(document).on('keydown', previewKeyHandler);
    });
    self.editor.on('leave-zen', function () {
      jsZenEdit.editor = null;
      $(document).off('keydown', previewKeyHandler);
      self.editor.trigger('leave-preview');
    });

    self.editor.on('go-preview', function () {
      $('a[accesskey=r]').click();
      self.textarea.hide();
      $preview.insertBefore(self.textarea);
      stat = 'preview';
    });
    self.editor.on('leave-preview', function () {
      $preview.html('');
      self.textarea.show().focus();
      $preview.insertBefore($anchor);
      stat = 'editing';
    });
  }

  return self;
}

jsZenEdit.registerHelp = function (content) {
  var $help = $('<div class="jstb_zenedit_help"></div>');
  $help.html(content);
  $help.on('click', function () {
    jsZenEdit.editor.trigger('leave-help');
    $help.removeClass('active');
  });
  $help.on('click', '.help-box', function (event) {
    event.stopPropagation();
  });
  jsZenEdit.$help = $help;
  if (jsZenEdit.editor) { jsZenEdit.help(jsZenEdit.editor); }
};
jsZenEdit.help = function (editor) {
  var $help = jsZenEdit.$help;
  if ($help) {
    editor.find('button.help').addClass('available');
    editor.append($help);
  }
};

$(function () {
  var editor = null;
  $('textarea').each(function (index, textarea) {
    editor = new jsZenEdit(textarea, null, '');
  });

  if ($('body').hasClass('controller-wiki')) {
    if (editor) {
      editor.zen();
    }
  }
});
