# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "sinatra-backbone"
  s.version = "0.1.0.rc2"

  s.required_rubygems_version = Gem::Requirement.new("> 1.3.1") if s.respond_to? :required_rubygems_version=
  s.authors = ["Rico Sta. Cruz"]
  s.date = "2011-09-11"
  s.description = "Provides Rest API access to your models and serves JST pages."
  s.email = ["rico@sinefunc.com"]
  s.homepage = "http://github.com/rstacruz/sinatra-backbone"
  s.require_paths = ["lib"]
  s.rubygems_version = "1.8.11"
  s.summary = "Helpful stuff using Sinatra with Backbone."

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<sinatra>, [">= 0"])
      s.add_development_dependency(%q<sequel>, [">= 3.25.0"])
      s.add_development_dependency(%q<sqlite3>, [">= 1.3.4"])
      s.add_development_dependency(%q<contest>, [">= 0"])
      s.add_development_dependency(%q<mocha>, [">= 0"])
      s.add_development_dependency(%q<rack-test>, [">= 0"])
    else
      s.add_dependency(%q<sinatra>, [">= 0"])
      s.add_dependency(%q<sequel>, [">= 3.25.0"])
      s.add_dependency(%q<sqlite3>, [">= 1.3.4"])
      s.add_dependency(%q<contest>, [">= 0"])
      s.add_dependency(%q<mocha>, [">= 0"])
      s.add_dependency(%q<rack-test>, [">= 0"])
    end
  else
    s.add_dependency(%q<sinatra>, [">= 0"])
    s.add_dependency(%q<sequel>, [">= 3.25.0"])
    s.add_dependency(%q<sqlite3>, [">= 1.3.4"])
    s.add_dependency(%q<contest>, [">= 0"])
    s.add_dependency(%q<mocha>, [">= 0"])
    s.add_dependency(%q<rack-test>, [">= 0"])
  end
end
