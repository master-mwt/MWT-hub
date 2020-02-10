import os
import string

os.system('rm -rf web-programming-app')
os.system('git clone https://github.com/master-mwt/web-programming-app.git')
os.chdir(os.path.abspath(os.path.join(os.path.curdir, 'web-programming-app')))
os.system('composer install')
os.system('npm install')
os.system('cp .env.example .env')

with open('.env', 'r') as file:
    data = file.read()

data = data.replace('DB_PASSWORD=', 'DB_PASSWORD=r')

with open('.env', 'w') as file:
    file.write(data)

os.system('php artisan key:generate')
os.system('composer dump-autoload')
os.system('php artisan migrate:fresh --seed')