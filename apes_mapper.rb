class ApesMapper < Sinatra::Base

  set :views, Proc.new{ File.join(root, 'app', 'views') }

  get '/' do
    erb :home
  end
end
