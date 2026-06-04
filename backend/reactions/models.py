from django.db import models
from django.conf import settings


class Reaction(models.Model):
    LIKE = 'like'
    LOVE = 'love'
    AMEN = 'amen'
    REACTION_TYPES = [(LIKE, 'Like'), (LOVE, 'Love'), (AMEN, 'Amen')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=10, choices=REACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
