require 'redmine'
require 'redmine_zenedit'
require 'redmine_zenedit/hooks/view_layouts_base_html_head'

Redmine::Plugin.register :redmine_zenedit do
  name 'Redmine Zen Edit plugin'
  author 'RedmineCRM'
  description 'This is a Zen edit plugin for Redmine'
  version '0.0.2'
  url 'http://redminecrm.com'
  author_url 'mailto:support@redminecrm.com'
end
