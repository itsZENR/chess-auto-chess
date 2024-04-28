from fastapi import FastAPI, Depends
from database import database

app = FastAPI()


async def get_db():
    try:
        await database.connect()
        yield database
    finally:
        await database.disconnect()


@app.get("/")
async def read_root(db: database = Depends(get_db)):
    query = "SELECT * FROM auth_user"
    return await db.fetch_all(query)
