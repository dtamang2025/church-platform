from django.db import models
from django.conf import settings


class Song(models.Model):
    CATEGORY_CHOICES = [
        ('gospel', 'Gospel'), ('worship', 'Worship'), ('youth', 'Youth'),
        ('traditional', 'Traditional'), ('contemporary', 'Contemporary'),
    ]
    LANGUAGE_CHOICES = [
        ('english', 'English'), ('hindi', 'Hindi'), ('spanish', 'Spanish'),
        ('french', 'French'), ('portuguese', 'Portuguese'),
    ]

    title = models.CharField(max_length=255)
    author_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    lyrics = models.JSONField(default=list)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='worship')
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='english')
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_shareable = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
