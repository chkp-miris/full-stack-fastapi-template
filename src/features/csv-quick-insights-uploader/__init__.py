```python
# src/features/csv-quick-insights-uploader/__init__.py

"""
Module: csv-quick-insights-uploader
Description: Provides a drag-and-drop CSV upload interface for quick insights generation.
"""

import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

# Constants
UPLOAD_FOLDER = '/path/to/upload/folder'
ALLOWED_EXTENSIONS = {'csv'}

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload via drag-and-drop interface."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'success': f'File {filename} uploaded successfully'}), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400

# Additional functionality for insights generation can be added here

if __name__ == '__main__':
    app.run(debug=True)
```