from django.contrib import admin
from .models import SavedPost

@admin.register(SavedPost)
class SavedPostAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'saved_at']
