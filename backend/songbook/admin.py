from django.contrib import admin
from .models import Song

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ['title', 'author_name', 'category', 'language', 'is_shareable']
    list_filter = ['category', 'language']
    search_fields = ['title', 'author_name']
