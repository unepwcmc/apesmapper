class ApesMapper < Sinatra::Base

  configure do
    use Rack::Session::Cookie, :secret => "ajshdaskjdmzxc,znc,mzxopewriumzxn,cjksdfh 93048 jchz xcm,bn3284 zxcnbz xcn,blkdsfj qp9 kh dlsakk zcvn"
    use Rack::Csrf, :raise => true
  end

  helpers do
    def csrf_token
      Rack::Csrf.csrf_token(env)
    end

    def csrf_tag
      Rack::Csrf.csrf_tag(env)
    end
  end

  set :views, Proc.new{ File.join(root, 'app', 'views') }

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

  #get '/api/v0' do
  #
  #end
end
