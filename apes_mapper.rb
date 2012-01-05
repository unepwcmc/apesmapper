class ApesMapper < Sinatra::Base

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
