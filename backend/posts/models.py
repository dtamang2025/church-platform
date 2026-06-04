from django.db import models
from django.conf import settings


class Post(models.Model):
    VISIBILITY_PUBLIC = 'public'
    VISIBILITY_COMMUNITY = 'community'
    VISIBILITY_CHOICES = [
        (VISIBILITY_PUBLIC, 'Public'),
        (VISIBILITY_COMMUNITY, 'Community Only'),
    ]

    TAG_CHOICES = [
        ('worship', 'Worship'),
        ('gospel', 'Gospel'),
        ('youth', 'Youth'),
        ('traditional', 'Traditional'),
        ('contemporary', 'Contemporary'),
        ('hymn', 'Hymn'),
    ]

    LANGUAGE_CHOICES = [
        ('english', 'English'),
        ('hindi', 'Hindi'),
        ('spanish', 'Spanish'),
        ('french', 'French'),
        ('portuguese', 'Portuguese'),
    ]

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    community = models.ForeignKey('communities.Community', on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    # Structured JSON: [{"line": "...", "chords": [{"chord": "G", "position": 0}]}]
    lyrics = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='english')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default=VISIBILITY_PUBLIC)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
