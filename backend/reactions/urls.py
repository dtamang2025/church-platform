from django.urls import path
from . import views

urlpatterns = [
    path('posts/<int:post_id>/react/', views.react_to_post, name='react-to-post'),
]
