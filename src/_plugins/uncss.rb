Jekyll::Hooks.register :site, :post_write do |site|
  success = system 'node build_scripts/uncss.js'
  raise 'uncss: an error has occurred' unless success
end