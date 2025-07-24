```python
"""
Module for providing a drag-and-drop CSV upload interface with quick insights generation.

This module handles CSV file uploads, parsing, and provides insights based on the data.
"""

import csv
import io
import logging
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_csv(file_stream):
    """Validate the CSV file format and content."""
    try:
        # Attempt to read the CSV file
        csv_reader = csv.reader(io.StringIO(file_stream.read().decode('utf-8')))
        # Check for basic structure (e.g., header presence)
        headers = next(csv_reader)
        if not headers:
            raise ValueError("CSV file is missing headers.")
        # Additional validation logic can be added here
        return True
    except Exception as e:
        logging.error(f"CSV validation failed: {e}")
        return False

def parse_csv(file_stream):
    """Parse the CSV file and return insights."""
    try:
        file_stream.seek(0)  # Reset stream position
        csv_reader = csv.DictReader(io.StringIO(file_stream.read().decode('utf-8')))
        insights = {
            "row_count": sum(1 for _ in csv_reader),
            "columns": csv_reader.fieldnames
        }
        return insights
    except Exception as e:
        logging.error(f"CSV parsing failed: {e}")
        return None

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and return insights."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        if validate_csv(file):
            insights = parse_csv(file)
            if insights:
                return jsonify({"filename": filename, "insights": insights}), 200
            else:
                return jsonify({"error": "Failed to parse CSV"}), 500
        else:
            return jsonify({"error": "Invalid CSV format"}), 400
    else:
        return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    app.run(debug=True)
```

```python
# test_csv_uploader.py

import unittest
from src.features.csv_quick_insights_uploader import app

class TestCSVUploader(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_upload_no_file(self):
        response = self.app.post('/upload')
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"No file part", response.data)

    def test_upload_empty_filename(self):
        response = self.app.post('/upload', data={'file': (io.BytesIO(b''), '')})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"No selected file", response.data)

    def test_upload_invalid_file_type(self):
        response = self.app.post('/upload', data={'file': (io.BytesIO(b'test'), 'test.txt')})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"File type not allowed", response.data)

    def test_upload_valid_csv(self):
        csv_data = b"header1,header2\nvalue1,value2\nvalue3,value4"
        response = self.app.post('/upload', data={'file': (io.BytesIO(csv_data), 'test.csv')})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"filename", response.data)
        self.assertIn(b"insights", response.data)

    def test_upload_invalid_csv_format(self):
        csv_data = b"value1,value2\nvalue3,value4"
        response = self.app.post('/upload', data={'file': (io.BytesIO(csv_data), 'test.csv')})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"Invalid CSV format", response.data)

if __name__ == '__main__':
    unittest.main()
```