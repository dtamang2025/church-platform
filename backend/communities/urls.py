from django.urls import path
from . import views

urlpatterns = [
    path('', views.CommunityListCreateView.as_view(), name='community-list-create'),
    path('<int:pk>/', views.CommunityDetailView.as_view(), name='community-detail'),
    path('<int:pk>/join/', views.join_community, name='join-community'),
    path('<int:pk>/members/', views.community_members, name='community-members'),
    path('<int:pk>/members/<int:user_id>/role/', views.assign_role, name='assign-role'),
]
