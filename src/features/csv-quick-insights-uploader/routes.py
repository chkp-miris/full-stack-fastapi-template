```python
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

# Blueprint for the CSV Quick Insights Uploader feature
csv_quick_insights_uploader = Blueprint('csv_quick_insights_uploader', __name__)

# Allowed extensions for file uploads
ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@csv_quick_insights_uploader.route('/upload', methods=['POST'])
def upload_file():
    """
    Endpoint to handle CSV file uploads.
    This endpoint expects a file to be sent with the key 'file'.
    """
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # If user does not select file, browser also submits an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Save the file to the desired location
        file.save(os.path.join('/path/to/save', filename))
        return jsonify({'success': f'File {filename} uploaded successfully'}), 200

    return jsonify({'error': 'File type not allowed'}), 400

# Note: The '/path/to/save' should be replaced with the actual path where you want to save the uploaded files.
# Ensure that the directory exists and the application has write permissions to it.
```