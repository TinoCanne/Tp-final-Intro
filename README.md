# Jameet

## Descripcion general:
Esta pagina busca conectar musicos con otros musicos, bandas y espacios de ensayo, buscado facilitar la tarea de encontrar gente con la cual hacer musica.

## Como levantar la pagina:  
Desde la terminal (ya estando dentro del directorio del proyecto) correr los siguientes comandos.  

1. `cd Backend` (moverse dentro de la carpeta de Backend).  
        Dentro de esta carpeta se encuentran los archivos docker-compose.yml y Dockerfile, que se encargan de la configuracion de los contenedores que se encargan del funcionamiento del backend y el frontend. 
          
2. `docker compose up --build`  
        este comando levanta el docker compose, el cual levanta los tres contendores necesarios para correr la pagina (la DB, el frontend y el backend). Si quisiera levantar el docker de fondo se puede agregar la flag `-d`. 
    
## Como acceder a la pagina:
Una vez levantado el docker compose, la aplicacion tendra su distintas partes corriendo en los sigueintes puertos:  
- `Forontend: puerto 8080`
- `Backend: pueto 3000`
- `DB: puerto 5432`  

Entonces, para acceder a la pagina se debe acceder a la siguiente direccion:  
`http://localhost:8080`.


## Como bajar la pagina:  
Si quieren bajar la pagina (desactivar los contenedores de docker) tienen dos opciones:  
- `docker compose down`: Este comando baja el docker compose, conservando toda la infromacion que se haya guardado en los volumenes, por ejemplo, datos que se hayan agregado a la DB.

- `docker compose down -v`: Este comando, ademas de bajar el docker compose, elimina todos los datos que se encuentren guardados dentro de los volumenes.  

## Como agregar datos a la DB manualmente:  
En el caso de querer agregar elementos a la base de datos, debera accederse a postgres utilizando el siguiente comando: `docker exec -it backend-db-1 psql -U admin -d tpDb`. este comando abrira una instncia de postgres, desde la cual se podra usar SQL para interactual con la base de datos.

## Funcionamiento de la pagina:  
Una vez levantado el docker compose, acceder a `http://localhost:8080` nos llevara a la pagina principal en caso de ya tener un usuario creado y una sesion iniciada, o a la pagina de iniciar sesion en el caso de no tener una sesion previa.  

