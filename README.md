"# proyecto-de-melqui" 
## para admin puero 8080
1. cd front-end/admin
2. eliminar el archivo package-lock.json
3. npm install
4. quasar dev

## para app usuarios puerto 8081
1. cd front-end/usuarios
2. eliminar el archivo package-lock.json
3. npm install
2. quasar dev  =>  (ejecuta modo web)

## para el servidor puerto 3000
1. cd back-end
2. eliminar el archivo package-lock.json
3. npm install
4. npm run dev

## para ejecuata como app:
>> tener instalado cordova de manera global (npm i -g cordova), jdk java, android studio con su sdk, ó xCode para macos
3. quasar dev -m cordova -T android => (ejecuta modo app, tener instalado android studio )
4. quasar dev -m cordova -T ios => (ejecuta modo app, tener instalado xCode)
