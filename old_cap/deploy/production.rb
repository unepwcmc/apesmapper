set :rails_env, "production"

# Primary domain name of your application. Used in the Apache configs
set :domain, "unepwcmc-014.vm.brightbox.net"

## List of servers
server "unepwcmc-014.vm.brightbox.net", :app, :web, :db, :primary => true


set :application, "apesmapper"
set :server_name, "apesmapper.unepwcmc-014.vm.brightbox.net"
set :sudo_user, "rails"
set :app_port, "80"


desc "Configure VHost"
task :config_vhost do
vhost_config =<<-EOF
server {
  listen 80;
  client_max_body_size 4G;
  server_name #{application}.unepwcmc-014.vm.brightbox.net;
  keepalive_timeout 5;
  root #{deploy_to}/current/public;
  passenger_enabled on;
  rails_env production;

  add_header 'Access-Control-Allow-Origin' *;
  add_header 'Access-Control-Allow-Methods' "GET, POST, PUT, DELETE, OPTIONS";
  add_header 'Access-Control-Allow-Headers' "X-Requested-With, X-Prototype-Version";
  add_header 'Access-Control-Max-Age' 1728000;
  
  gzip on;
  location ^~ /assets/ {
    expires max;
    add_header Cache-Control public;
  }
  
  if (-f $document_root/system/maintenance.html) {
    return 503;
  }

  error_page 500 502 504 /500.html;
  location = /500.html {
    root #{deploy_to}/public;
  }

  error_page 503 @maintenance;
  location @maintenance {
    rewrite  ^(.*)$  /system/maintenance.html break;
  }
}
EOF
put vhost_config, "/tmp/vhost_config"
sudo "mv /tmp/vhost_config /etc/nginx/sites-available/#{application}"
sudo "ln -s /etc/nginx/sites-available/#{application} /etc/nginx/sites-enabled/#{application}"
end
 
after "deploy:setup", :config_vhost


namespace :deploy do
  namespace :rake_tasks do
    task :singleton, :roles => :db, :only => {:primary => true} do
      puts "do nothing"
    end
  end
end
