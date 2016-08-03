require 'jekyll_asset_pipeline'

module JekyllAssetPipeline
  class CssCompressor < JekyllAssetPipeline::Compressor
    require 'cssminify'

    def self.filetype
      '.css'
    end

    def compress
      return CSSminify.compress(@content)
    end
  end

  class JavaScriptCompressor < JekyllAssetPipeline::Compressor
    require 'uglifier'

    def self.filetype
      '.js'
    end

    def compress
      return Uglifier.compile(@content)
    end
  end

  class JavaScriptTagTemplate < JekyllAssetPipeline::Template
    def self.filetype
      '.js'
    end

    def html
      "<script async type='text/javascript' src='/#{@path}/#{@filename}'></script>\n"
    end
  end
end
