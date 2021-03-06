from django.db import models

from django.utils.timezone import now


class Blog(models.Model):
    id = models.CharField(primary_key=True, max_length=1000)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    author = models.CharField(max_length=100)
    image = models.CharField(max_length=500, blank=True, null=True)
    text = models.TextField()
    category = models.CharField(max_length=100)
    uploaded_time = models.DateTimeField(blank=True, null=True, default=now)
    is_draft = models.BooleanField(default=False)


class BlogImage(models.Model):
    file_name = models.CharField(max_length=500)
    source = models.CharField(max_length=500)
    uploaded_time = models.DateTimeField(blank=True, null=True, default=now)