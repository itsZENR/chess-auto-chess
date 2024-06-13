import redis
import random
import json

# redis_client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
redis_client = redis.StrictRedis(host='redis', port=6379, db=0)


def generate_command():
    command = {"action": random.random()}
    return command


def store_command(game_id, command):
    redis_client.set(game_id, json.dumps(command))


def get_command(game_id):
    command = redis_client.get(game_id)
    if command:
        return json.loads(command)
    return None
