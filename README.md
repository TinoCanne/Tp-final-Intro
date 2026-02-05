# Jameet

## Descripcion general:
    Esta pagina busca conectar musicos con otros musicos, bandas y espacios de ensayo, buscado facilitar la tarea de encontrar gente con la cual hacer musica.

## Como levantar la pagina:  
    Desde la terminal (ya estando dentro del directorio del proyecto) correr los siguientes comandos.  

1. `cd Backend` (moverse dentro de la carpeta de Backend).  
        Dentro de esta carpeta se encuentran los archivos docker-compose.yml y Dockerfile, que se encargan de la configuracion de los contenedores que se encargan del funcionamiento del back end y el front end. 
          
2. `docker compose up --build`  
        este comando levanta el docker compose, el cual levanta los tres contendores necesarios para correr la pagina (la DB, el front end y el back end).
    
## Como agregar datos a la DB:  
En el caso de querer agregar elementos a la base de datos, debera accederse a postgres utilizando el siguiente comando: `docker exec -it backend-db-1 psql -U admin -d tpDb`
    