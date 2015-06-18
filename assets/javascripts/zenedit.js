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
  button.title = title || "Zen";

  var button_theme = document.createElement('button');
  button_theme.setAttribute('type','button');
  button_theme.tabIndex = 200;
  button_theme.className = "jstb_zenedit theme";
  button_theme.title = title || "Zen";

  document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
          self.editor.removeClass('zen');
          $html.removeClass('zen');
      }
  };

  button.onclick = function() { 
    try { 
      $(this).parent('.zeneditor').toggleClass('zen'); 
      self.textarea.removeAttr("style")
      $html.toggleClass('zen');
      self.textarea.focus();
    } catch (e) {} 
    return false; 
  };

  button_theme.onclick = function() { 
    try { 
      $(this).parent('.zeneditor').toggleClass('dark-theme'); 
      self.textarea.focus();
    } catch (e) {} 
    return false; 
  };  

  self.editor.append(button);
  self.editor.append(button_theme);

  self.editor.insertBefore(self.textarea);
  self.editor.prepend(self.textarea);

  self.zen = function () {
    button.onclick();
  };

  return self;
}

$(function () {
  var editor = null;
  $('textarea').each(function (index, textarea) {
    editor = jsZenEdit(textarea, null, '');
  });

  if (editor) {
    editor.zen();
  }
});
