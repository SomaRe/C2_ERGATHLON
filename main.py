import webview
import os
import sys
from backend.database import init_db, add_entry, get_entries, delete_entry

class Api:
    def __init__(self):
        init_db()

    def add_log_entry(self, entry):
        add_entry(entry)
        return self.get_log_entries()

    def get_log_entries(self):
        entries = get_entries()
        return [dict(zip(['id', 'date', 'bikePace', 'bikeDistance', 'rowPace', 'rowDistance',

                          'skiPace', 'skiDistance', 'totalTime', 'comments'], entry)) for entry in entries]

    def delete_log_entry(self, entry_id):
        delete_entry(entry_id)
        return self.get_log_entries()


def get_asset_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)


if __name__ == '__main__':
    api = Api()
    html_file = get_asset_path('frontend/index.html')
    window = webview.create_window(
        'C2 ERGATHLON', html_file, js_api=api, width=1000, height=1000)

    webview.start()
