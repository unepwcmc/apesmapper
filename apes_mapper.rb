# Bundler
require "rubygems"
require "bundler/setup"
Bundler.require
require './app/models/database.rb'
class ApesMapper < Sinatra::Base

  BASE_ID = 111222333

  #Don't forget to check this :D
  #configure do
  #  use Rack::Session::Cookie, :secret => "ajshdaskjdmzxc,znc,mzxopewriumzxn,cjksdfh 93048 jchz xcm,bn3284 zxcnbz xcn,blkdsfj qp9 kh dlsakk zcvn"
  #  use Rack::Csrf, :raise => true
  #end

  helpers do
    def csrf_token
      Rack::Csrf.csrf_token(env)
    end

    def csrf_tag
      Rack::Csrf.csrf_tag(env)
    end
  end

  set :views, Proc.new{ File.join(root, 'app', 'views') }
  enable :logging, :dump_errors, :raise_errors

  get '/' do
    erb :home
  end

  get '/about' do
    erb :about
  end

  get '/tool' do
    erb :index
  end

  get '/data' do
    erb :data
  end

  get '/nojavascript' do
    erb :nojs
  end

  get '/ie6' do
    erb :ie6
  end

  before '/api/v0/work/:work_hash' do
    content_type "application/json"
    if params[:work_hash] && params[:work_hash] != "undefined"
      w = Work.find(params[:work_hash].alphadecimal - BASE_ID)
    else
      w = nil
    end
  end

  post '/api/v0/work' do
    content_type "application/json"
    w = Work.create
    {'id' => (w.id + BASE_ID).alphadecimal }.to_json
  end

  put '/api/v0/work/:work_hash' do
    if w
      w.json = params["data"]
      w.save
      data = params["data"]
    end
  end

  get '/api/v0/work/:work_hash' do
    if w
      data = w.json
    else
      data = '{"error": "does not exist"}'
      status = 404
    end
  end

  delete '/api/v0/work/:work_hash' do
    if w
      w.delete
      status = 204
      data = ''
    end
  end

  error do
    "Sorry there was a nasty error - " + env['sinatra.error'].name
  end
end
