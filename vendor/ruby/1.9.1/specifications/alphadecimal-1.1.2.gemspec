# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "alphadecimal"
  s.version = "1.1.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Mike Mondragon", "Jack Danger Canty"]
  s.date = "2011-06-21"
  s.description = "Convert integers to base62 strings (A-Za-z0-9) and back. Ideal for url shorteners like Shawty-server."
  s.email = "rubygems@6brand.com"
  s.executables = ["alphadecimal"]
  s.extra_rdoc_files = ["LICENSE", "README.txt"]
  s.files = ["bin/alphadecimal", "LICENSE", "README.txt"]
  s.homepage = "http://github.com/JackDanger/alphadecimal"
  s.require_paths = ["lib"]
  s.rubygems_version = "1.8.11"
  s.summary = "Convert integers to base62 strings (A-Za-z0-9) and back.  A handy way to shorten long numbers."

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
    else
    end
  else
  end
end
