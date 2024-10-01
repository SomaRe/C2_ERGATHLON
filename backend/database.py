import sqlite3
import os

# get asset path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'ergathlon.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''

    CREATE TABLE IF NOT EXISTS log_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        bike_pace TEXT NOT NULL,
        bike_distance INTEGER NOT NULL,
        row_pace TEXT NOT NULL,
        row_distance INTEGER NOT NULL,
        ski_pace TEXT NOT NULL,
        ski_distance INTEGER NOT NULL,
        total_time TEXT NOT NULL,
        comments TEXT
    )
    ''')

    conn.commit()
    conn.close()


def get_entries():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM log_entries ORDER BY date ASC')
    entries = cursor.fetchall()
    conn.close()
    return entries

def add_entry(entry):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO log_entries (date, bike_pace, bike_distance, row_pace, row_distance, ski_pace, ski_distance, total_time, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (entry['date'], entry['bikePace'], entry['bikeDistance'], entry['rowPace'], entry['rowDistance'], 
          entry['skiPace'], entry['skiDistance'], entry['totalTime'], entry['comments']))

    conn.commit()
    conn.close()

def delete_entry(entry_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM log_entries WHERE id = ?', (entry_id,))
    conn.commit()
    conn.close()