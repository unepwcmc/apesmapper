# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "sinatra-activerecord"
  s.version = "0.1.3"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Blake Mizerany"]
  s.date = "2009-09-21"
  s.description = "Extends Sinatra with activerecord helpers for instant activerecord use"
  s.email = "blake.mizerany@gmail.com"
  s.extra_rdoc_files = ["README.md"]
  s.files = ["README.md"]
  s.homepage = "http://github.com/rtomayko/sinatra-activerecord"
  s.rdoc_options = ["--line-numbers", "--inline-source", "--title", "Sinatra::ActiveRecord"]
  s.require_paths = ["lib"]
  s.rubyforge_project = "bmizerany"
  s.rubygems_version = "1.8.11"
  s.summary = "Extends Sinatra with activerecord helpers for instant activerecord use"

  if s.respond_to? :specification_version then
    s.specification_version = 2

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<sinatra>, [">= 0.9.4"])
    else
      s.add_dependency(%q<sinatra>, [">= 0.9.4"])
    end
  else
    s.add_dependency(%q<sinatra>, [">= 0.9.4"])
  end
end
