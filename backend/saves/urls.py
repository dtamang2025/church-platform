from django.urls import path
from . import views

urlpatterns = [
    path('', views.SavedPostListView.as_view(), name='saved-list'),
    path('posts/<int:post_id>/toggle/', views.toggle_save, name='toggle-save'),
]
