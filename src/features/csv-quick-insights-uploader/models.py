```python
# src/features/csv-quick-insights-uploader/models.py

import os
from django.db import models
from django.core.validators import FileExtensionValidator

class CSVUpload(models.Model):
    """
    Model to represent a CSV file upload for quick insights.
    """
    file = models.FileField(
        upload_to='uploads/csv/',
        validators=[FileExtensionValidator(allowed_extensions=['csv'])],
        help_text="Upload a CSV file for quick insights."
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return os.path.basename(self.file.name)

    class Meta:
        verbose_name = "CSV Upload"
        verbose_name_plural = "CSV Uploads"
        ordering = ['-uploaded_at']

# Note: Ensure that the 'uploads/csv/' directory exists and is writable by the application.
```