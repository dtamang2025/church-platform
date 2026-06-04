from django.urls import path
from . import views

urlpatterns = [
    path('', views.SongListCreateView.as_view(), name='song-list-create'),
    path('<int:pk>/', views.SongDetailView.as_view(), name='song-detail'),
]
