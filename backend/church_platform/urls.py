from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/communities/', include('communities.urls')),
    path('api/reactions/', include('reactions.urls')),
    path('api/songbook/', include('songbook.urls')),
    path('api/saves/', include('saves.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
