class UrlValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    begin
      uri = URI.parse(value)
      #resp = uri.kind_of?(URI::HTTP)
      #strict but ok for now
      resp = uri.host && uri.host.match(/\.com$/)
    rescue URI::InvalidURIError
      resp = false
    end

    if resp == nil
      record.errors[attribute] << (options[:message] || "is not an uri")
    end
  end
end
