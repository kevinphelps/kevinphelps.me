Jekyll::Hooks.register :site, :post_write do |site|
  uncssCommand = 'node src/_plugins/uncss/uncss.js'
  %x[ #{uncssCommand} ]
end