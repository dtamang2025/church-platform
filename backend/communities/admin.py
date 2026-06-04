from django.contrib import admin
from .models import Community, CommunityMember

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'created_at']

@admin.register(CommunityMember)
class CommunityMemberAdmin(admin.ModelAdmin):
    list_display = ['community', 'user', 'role', 'joined_at']
    list_filter = ['role']
