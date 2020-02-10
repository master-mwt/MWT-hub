import os
import string
import sys

if (len(sys.argv) != 2):
    print("script synopsis: <script> <db_password>")
    exit
else:
    os.system('git clone https://github.com/master-mwt/web-programming-app.git')
    os.chdir(os.path.abspath(os.path.join(os.path.curdir, 'web-programming-app')))
    os.system('composer install')
    os.system('npm install')
    os.system('cp .env.example .env')

    with open('.env', 'r') as file:
        data = file.read()

    pwd = 'DB_PASSWORD=' + sys.argv[1]

    data = data.replace('DB_PASSWORD=', pwd)

    with open('.env', 'w') as file:
        file.write(data)

    os.system('php artisan key:generate')
    os.system('composer dump-autoload')
    os.system('php artisan migrate:fresh --seed')
