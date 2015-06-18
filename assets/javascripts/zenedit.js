function jsZenEdit(textarea, title, placeholder) {
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

  var button = document.createElement('button');
  button.setAttribute('type','button');
  button.tabIndex = 200;
  button.className = "jstb_zenedit";
  button.title = "Zen: Ctrl + e";

  var button_theme = document.createElement('button');
  button_theme.setAttribute('type','button');
  button_theme.tabIndex = 200;
  button_theme.className = "jstb_zenedit theme";
  button_theme.title = "Switch theme";

  var button_preview = $('<button class="jstb_zenedit preview" title="Preview: Ctrl + d"></button>');
  var button_help = $('<button class="jstb_zenedit help" title="Help: Ctrl + h"></button>');
  var button_save = $('<button class="jstb_zenedit save" title="Save: Ctrl + s"></button>');

  button.onclick = function() { 
    try { 
      if (self.editor.hasClass('zen')) {
        self.editor.trigger('leave-zen');
      } else {
        self.editor.trigger('go-zen');
      }
      self.textarea.focus();
    } catch (e) {} 
    return false; 
  };

  button_theme.onclick = function() { 
    try { 
      self.editor.toggleClass('dark-theme'); 
      self.textarea.focus();
    } catch (e) {} 
    return false; 
  };  

  button_save.on('click', function () {
    self.editor.closest('form').submit();
  });

  self.editor.append(button);
  self.editor.append(button_theme);
  self.editor.append(button_preview);
  self.editor.append(button_help);
  self.editor.append(button_save);

  self.editor.insertAfter(self.textarea);
  self.editor.prepend(self.textarea);

  self.zen = function () {
    button.onclick();
  };

  var zenKeyHandler = function(e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode == 69 && e.ctrlKey) {
      e.preventDefault();
      button.onclick();
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
      self.editor.trigger('leave-zen');
    }
  };

  $(document).on('keydown', zenKeyHandler);
  $(document).on('keydown', zenESCHandler);

  self.editor.on('go-zen', function () {
    self.editor.addClass('zen');
    $html.addClass('zen');
  });
  self.editor.on('leave-zen', function () {
    self.editor.removeClass('zen');
    $html.removeClass('zen');
  });

  if ($('body').hasClass('controller-wiki')) {
    var $preview = $('#preview');
    var $anchor = $('<div id="preview-anchor"></div>').insertBefore($preview);
    var stat = 'editing';

    $(document).off('keydown', zenESCHandler);

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
    };

    self.editor.on('go-zen', function () {
      $(document).on('keydown', previewKeyHandler);
    });
    self.editor.on('leave-zen', function () {
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
