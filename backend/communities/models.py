from django.db import models
from django.conf import settings


class Community(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='communities/', blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_communities')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='CommunityMember', related_name='joined_communities')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'communities'

    def __str__(self):
        return self.name


class CommunityMember(models.Model):
    ROLE_ADMIN = 'admin'
    ROLE_PASTOR = 'pastor'
    ROLE_YOUTH_LEADER = 'youth_leader'
    ROLE_CHOIR_MEMBER = 'choir_member'
    ROLE_MEMBER = 'member'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_PASTOR, 'Pastor'),
        (ROLE_YOUTH_LEADER, 'Youth Leader'),
        (ROLE_CHOIR_MEMBER, 'Choir Member'),
        (ROLE_MEMBER, 'Member'),
    ]

    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('community', 'user')
