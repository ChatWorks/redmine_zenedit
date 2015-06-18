module RedmineZenedit
  class StylesheetHook < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(context)
      javascript_include_tag(:zenedit, :plugin => 'redmine_zenedit') +
      stylesheet_link_tag(:zenedit, :plugin => 'redmine_zenedit')
    end
  end
end
