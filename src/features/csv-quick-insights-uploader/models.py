```python
# src/features/csv-quick-insights-uploader/models.py

import os
from django.db import models

class CSVUpload(models.Model):
    """
    Model to represent a CSV file upload.
    """
    file = models.FileField(upload_to='uploads/csv/', max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return os.path.basename(self.file.name)

    class Meta:
        verbose_name = "CSV Upload"
        verbose_name_plural = "CSV Uploads"
        ordering = ['-uploaded_at']

# Ensure that the file field is configured to handle CSV files specifically.
# Add any additional fields or methods needed to support the drag-and-drop interface.
```