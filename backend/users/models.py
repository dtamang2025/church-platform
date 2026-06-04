from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_ADMIN = 'admin'
    ROLE_USER = 'user'
    GLOBAL_ROLES = [(ROLE_ADMIN, 'Admin'), (ROLE_USER, 'User')]

    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    global_role = models.CharField(max_length=20, choices=GLOBAL_ROLES, default=ROLE_USER)
    following = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    @property
    def is_platform_admin(self):
        return self.global_role == self.ROLE_ADMIN
