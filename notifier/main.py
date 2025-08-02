from fastapi import FastAPI
import redis
import threading

app = FastAPI()

r = redis.Redis(host='redis', port=6379, decode_responses=True)

# Escuchar eventos en segundo plano
def listen_to_events():
    pubsub = r.pubsub()
    pubsub.subscribe('task-events')
    print("Subscribed to task-events channel")

    for message in pubsub.listen():
        if message['type'] == 'message':
            print(f"Received message: {message['data']}")
            
# Lanzar el listener en backround cuando arranca la app
@app.on_event("startup")
def startup_event():
    thread = threading.Thread(target=listen_to_events, daemon=True)
    thread.start()
        
# Endpoint de prueba
@app.get("/ping")
def ping():
    return {"message": "pong"}

# Endpoint para publicar mensajes manualmente
@app.post("/notify")
def notify(message: str):
    r.publish('task-events', message)
    return {"status": "sent"}