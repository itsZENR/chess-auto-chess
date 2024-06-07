import psycopg2

try:
    connection = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="postgres",
        host="127.0.0.1",
        port=5432
    )
    print("Connection successful")
except Exception as e:
    print(f"Error: {e}")
